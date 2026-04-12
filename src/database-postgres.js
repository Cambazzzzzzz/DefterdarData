// PostgreSQL database adapter for Vercel Postgres
const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (pool) return pool;
  
  // Vercel Postgres otomatik olarak POSTGRES_URL environment variable'ını set eder
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err);
  });

  return pool;
}

// Schema oluşturma
async function initSchema() {
  const pool = getPool();
  
  const schema = `
    CREATE TABLE IF NOT EXISTS kullanicilar (
      id SERIAL PRIMARY KEY,
      kullanici_adi VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      sifre_hash TEXT NOT NULL,
      olusturma TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS organizasyonlar (
      id SERIAL PRIMARY KEY,
      kullanici_id INTEGER NOT NULL DEFAULT 0,
      ad TEXT NOT NULL,
      yil INTEGER NOT NULL,
      max_kurban INTEGER NOT NULL,
      buyukbas_hisse_fiyati DECIMAL(10,2) NOT NULL DEFAULT 0,
      kucukbas_hisse_fiyati DECIMAL(10,2) NOT NULL DEFAULT 0,
      aciklama TEXT,
      aktif INTEGER DEFAULT 1,
      olusturma TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS kurbanlar (
      id SERIAL PRIMARY KEY,
      organizasyon_id INTEGER NOT NULL,
      kurban_no INTEGER NOT NULL,
      tur VARCHAR(50) NOT NULL,
      kurban_turu VARCHAR(50) DEFAULT 'Udhiye',
      kesen_kisi TEXT,
      kucukbas_sayi INTEGER DEFAULT 1,
      kupe_no TEXT,
      alis_fiyati DECIMAL(10,2) DEFAULT 0,
      toplam_hisse INTEGER NOT NULL,
      kesildi INTEGER DEFAULT 0,
      kesim_tarihi TEXT,
      aciklama TEXT,
      olusturma TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS hisseler (
      id SERIAL PRIMARY KEY,
      kurban_id INTEGER NOT NULL,
      hisse_no INTEGER NOT NULL,
      bagisci_adi TEXT,
      bagisci_telefon TEXT,
      kimin_adina TEXT,
      kimin_adina_telefon TEXT,
      odeme_durumu VARCHAR(50) DEFAULT 'bekliyor',
      video_ister INTEGER DEFAULT 0,
      aciklama TEXT,
      olusturma TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cop_kutusu (
      id SERIAL PRIMARY KEY,
      tur VARCHAR(50) NOT NULL,
      veri TEXT NOT NULL,
      silme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_organizasyonlar_kullanici ON organizasyonlar(kullanici_id);
    CREATE INDEX IF NOT EXISTS idx_kurbanlar_org ON kurbanlar(organizasyon_id);
    CREATE INDEX IF NOT EXISTS idx_hisseler_kurban ON hisseler(kurban_id);
  `;

  const statements = schema.split(';').map(s => s.trim()).filter(Boolean);
  
  for (const stmt of statements) {
    try {
      await pool.query(stmt);
    } catch (err) {
      // Ignore "already exists" errors
      if (!err.message.includes('already exists')) {
        console.error('Schema error:', err.message);
      }
    }
  }
}

// Better-sqlite3 benzeri API wrapper
class Statement {
  constructor(pool, sql) {
    this.pool = pool;
    this.sql = sql;
  }

  async run(...params) {
    // PostgreSQL uses $1, $2 instead of ?
    const pgSql = this.sql.replace(/\?/g, (_, i) => `$${params.indexOf(_) + 1}`);
    let paramIndex = 1;
    const finalSql = this.sql.replace(/\?/g, () => `$${paramIndex++}`);
    
    const result = await this.pool.query(finalSql, params);
    
    // Return format compatible with better-sqlite3
    return {
      changes: result.rowCount || 0,
      lastInsertRowid: result.rows[0]?.id || 0
    };
  }

  async get(...params) {
    let paramIndex = 1;
    const finalSql = this.sql.replace(/\?/g, () => `$${paramIndex++}`);
    const result = await this.pool.query(finalSql, params);
    return result.rows[0] || undefined;
  }

  async all(...params) {
    let paramIndex = 1;
    const finalSql = this.sql.replace(/\?/g, () => `$${paramIndex++}`);
    const result = await this.pool.query(finalSql, params);
    return result.rows || [];
  }
}

class DbWrapper {
  constructor(pool) {
    this.pool = pool;
  }

  prepare(sql) {
    return new Statement(this.pool, sql);
  }

  async exec(sql) {
    await this.pool.query(sql);
  }

  pragma() {
    // PostgreSQL doesn't use pragma
  }
}

let _db = null;

async function getDb() {
  if (_db) return _db;
  
  const pool = getPool();
  await initSchema();
  
  _db = new DbWrapper(pool);
  return _db;
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (pool) {
    await pool.end();
  }
});

module.exports = { getDb };
