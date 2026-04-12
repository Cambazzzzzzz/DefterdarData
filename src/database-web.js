// Web deployment için database wrapper (Railway, Heroku vb.)
// Electron database.js ile aynı API'yi sağlar

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'defterdar.db');

// Data klasörünü oluştur
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let saveTimer = null;
function scheduleSave(sqlDb) {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      const data = sqlDb.export();
      fs.writeFileSync(DB_PATH, Buffer.from(data));
    } catch (e) { console.error('DB kayit hatasi:', e); }
  }, 1000);
}

class Statement {
  constructor(sqlDb, sql) {
    this._sqlDb = sqlDb;
    this._sql = sql;
  }
  run(...params) {
    this._sqlDb.run(this._sql, params.length ? params : []);
    scheduleSave(this._sqlDb);
    const rows = this._sqlDb.exec('SELECT last_insert_rowid() as id');
    const lastId = rows.length > 0 ? rows[0].values[0][0] : 0;
    return { changes: this._sqlDb.getRowsModified(), lastInsertRowid: lastId };
  }
  get(...params) {
    const stmt = this._sqlDb.prepare(this._sql);
    try {
      stmt.bind(params.length ? params : []);
      if (stmt.step()) return stmt.getAsObject();
      return undefined;
    } finally { stmt.free(); }
  }
  all(...params) {
    const stmt = this._sqlDb.prepare(this._sql);
    const results = [];
    try {
      stmt.bind(params.length ? params : []);
      while (stmt.step()) results.push(stmt.getAsObject());
    } finally { stmt.free(); }
    return results;
  }
}

class DbWrapper {
  constructor(sqlDb) { this._sqlDb = sqlDb; }
  prepare(sql) { return new Statement(this._sqlDb, sql); }
  exec(sql) { this._sqlDb.run(sql); scheduleSave(this._sqlDb); }
  pragma(str) { try { this._sqlDb.run(`PRAGMA ${str}`); } catch (e) {} }
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS kullanicilar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kullanici_adi TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    sifre_hash TEXT NOT NULL,
    surum TEXT DEFAULT 'normal',
    rol TEXT DEFAULT 'kullanici',
    durum TEXT DEFAULT 'aktif',
    kayit_ip TEXT,
    son_ip TEXT,
    kayit_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS pro_keyler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_kodu TEXT UNIQUE NOT NULL,
    kullanildi INTEGER DEFAULT 0,
    kullanan_kullanici_id INTEGER,
    kullanan_adi TEXT,
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    kullanilma_tarihi DATETIME
  );
  CREATE TABLE IF NOT EXISTS pro_talepler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kullanici_id INTEGER NOT NULL,
    mesaj TEXT,
    durum TEXT DEFAULT 'bekliyor',
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    cevap_tarihi DATETIME
  );
  CREATE TABLE IF NOT EXISTS ip_yasaklar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT UNIQUE NOT NULL,
    sebep TEXT,
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS kullanici_ayarlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kullanici_id INTEGER UNIQUE NOT NULL,
    logo_data TEXT,
    bayrak_data TEXT,
    kurulum_tamamlandi INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS organizasyonlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kullanici_id INTEGER NOT NULL,
    ad TEXT NOT NULL,
    yil INTEGER NOT NULL,
    max_kurban INTEGER NOT NULL,
    buyukbas_hisse_fiyati REAL NOT NULL DEFAULT 0,
    kucukbas_hisse_fiyati REAL NOT NULL DEFAULT 0,
    aciklama TEXT,
    aktif INTEGER DEFAULT 1,
    olusturma DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS kurbanlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizasyon_id INTEGER NOT NULL,
    kurban_no INTEGER NOT NULL,
    tur TEXT NOT NULL,
    kurban_turu TEXT DEFAULT 'Udhiye',
    kesen_kisi TEXT,
    kucukbas_sayi INTEGER DEFAULT 1,
    kupe_no TEXT,
    alis_fiyati REAL DEFAULT 0,
    toplam_hisse INTEGER NOT NULL,
    kesildi INTEGER DEFAULT 0,
    kesim_tarihi TEXT,
    aciklama TEXT,
    olusturma DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS hisseler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kurban_id INTEGER NOT NULL,
    hisse_no INTEGER NOT NULL,
    bagisci_adi TEXT,
    bagisci_telefon TEXT,
    kimin_adina TEXT,
    kimin_adina_telefon TEXT,
    odeme_durumu TEXT DEFAULT 'bekliyor',
    video_ister INTEGER DEFAULT 0,
    aciklama TEXT,
    olusturma DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS cop_kutusu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tur TEXT NOT NULL,
    veri TEXT NOT NULL,
    silme_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

let _db = null;

async function getDb() {
  if (_db) return _db;
  const SQL = await initSqlJs();
  let sqlDb;
  if (fs.existsSync(DB_PATH)) {
    sqlDb = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    sqlDb = new SQL.Database();
  }
  sqlDb.run('PRAGMA foreign_keys = ON');
  SCHEMA.split(';').map(s => s.trim()).filter(Boolean).forEach(s => sqlDb.run(s));
  
  // Migration: eski DB'ye yeni kolonları ekle
  try { sqlDb.run("ALTER TABLE kurbanlar ADD COLUMN kurban_turu TEXT DEFAULT 'Udhiye'"); } catch(e) {}
  try { sqlDb.run("ALTER TABLE kurbanlar ADD COLUMN kesen_kisi TEXT"); } catch(e) {}
  try { sqlDb.run("ALTER TABLE kurbanlar ADD COLUMN kucukbas_sayi INTEGER DEFAULT 1"); } catch(e) {}
  try { sqlDb.run("ALTER TABLE organizasyonlar ADD COLUMN kullanici_id INTEGER DEFAULT 1"); } catch(e) {}
  
  // İlk admin kullanıcısı yoksa oluştur
  const adminCheck = sqlDb.exec("SELECT id FROM kullanicilar WHERE rol='admin' LIMIT 1");
  if (!adminCheck || adminCheck.length === 0 || adminCheck[0].values.length === 0) {
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('admin123', 10);
    sqlDb.run("INSERT OR IGNORE INTO kullanicilar (kullanici_adi, email, sifre_hash, surum, rol) VALUES ('admin', 'admin@defterdar.local', ?, 'pro', 'admin')", [hash]);
  }
  
  const data = sqlDb.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
  _db = new DbWrapper(sqlDb);
  return _db;
}

module.exports = { getDb };
