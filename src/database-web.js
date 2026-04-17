// Web deployment için database (Railway, Heroku vb.)
// better-sqlite3 kullanır - WASM sorunu yok

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// DB path öncelik sırası: Railway Volume paths
function findWritablePath() {
  const candidates = [
    process.env.DB_PATH,           // Environment variable (en yüksek öncelik)
    '/app/data/defterdar.db',      // Railway Volume mount (Dockerfile'da mkdir -p /app/data)
    '/data/defterdar.db',          // Alternatif mount
    '/tmp/defterdar.db',           // Fallback (deploy'da sıfırlanır!)
    './data/defterdar.db'          // Local geliştirme
  ].filter(Boolean);

  for (const p of candidates) {
    try {
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Yazma izni testi
      const testFile = path.join(dir, '.write_test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log('✅ DB path secildi:', p);
      if (p === '/tmp/defterdar.db') {
        console.warn('⚠️  UYARI: /tmp kullanılıyor! Deploy sonrası veriler SİLİNECEK!');
        console.warn('⚠️  Railway Volume mount path yanlış veya izin sorunu var!');
        console.warn('⚠️  Railway dashboard > Variables > DB_PATH=/app/data/defterdar.db ekleyin');
      }
      return p;
    } catch(e) {
      console.warn('❌ DB path yazilabilir degil:', p, '-', e.message);
    }
  }
  console.error('⚠️  Hiçbir DB path yazılabilir değil, /tmp kullanılıyor');
  return '/tmp/defterdar.db';
}

const DB_PATH = findWritablePath();

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
    kullanici_id INTEGER NOT NULL DEFAULT 1,
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
    video_url TEXT,
    video_public_id TEXT,
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

  console.log('🗄️  DB aciliyor:', DB_PATH);
  console.log('📁 DB directory:', path.dirname(DB_PATH));
  console.log('💾 Railway Volume check:');
  console.log('  - /app/data exists:', fs.existsSync('/app/data'));
  console.log('  - /data exists:', fs.existsSync('/data'));
  console.log('  - DB file exists:', fs.existsSync(DB_PATH));
  
  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');
  
  console.log('🔗 Database connection successful');

  // Schema oluştur
  SCHEMA.split(';').map(s => s.trim()).filter(Boolean).forEach(s => {
    try { db.exec(s + ';'); } catch(e) {}
  });

  // Migration: eski kolonları ekle
  const migrations = [
    "ALTER TABLE kurbanlar ADD COLUMN kurban_turu TEXT DEFAULT 'Udhiye'",
    "ALTER TABLE kurbanlar ADD COLUMN kesen_kisi TEXT",
    "ALTER TABLE kurbanlar ADD COLUMN kucukbas_sayi INTEGER DEFAULT 1",
    "ALTER TABLE organizasyonlar ADD COLUMN kullanici_id INTEGER DEFAULT 1",
    "ALTER TABLE hisseler ADD COLUMN video_url TEXT",
    "ALTER TABLE hisseler ADD COLUMN video_public_id TEXT",
  ];
  migrations.forEach(m => { try { db.exec(m); } catch(e) {} });

  // İlk admin yoksa oluşturma - Railway deployment için
  const adminCheck = db.prepare("SELECT id FROM kullanicilar WHERE rol='admin' LIMIT 1").all();
  if (!adminCheck || adminCheck.length === 0) {
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare("INSERT OR IGNORE INTO kullanicilar (kullanici_adi, email, sifre_hash, surum, rol) VALUES ('admin', 'admin@defterdar.local', ?, 'pro', 'admin')")
      .run(hash);
    console.log('👤 İlk admin kullanıcısı oluşturuldu: admin/admin123');
  } else {
    console.log('👤 Admin kullanıcısı mevcut, atlanıyor');
  }
  
  // Veritabanı istatistikleri
  const userCount = db.prepare("SELECT COUNT(*) as count FROM kullanicilar").get().count;
  const orgCount = db.prepare("SELECT COUNT(*) as count FROM organizasyonlar").get().count;
  console.log(`📊 Veritabanı: ${userCount} kullanıcı, ${orgCount} organizasyon`);


  _db = db;
  return _db;
}

module.exports = { getDb };
