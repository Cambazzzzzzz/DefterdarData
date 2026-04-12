// Web deployment için database (Railway, Heroku vb.)
// better-sqlite3 kullanır - WASM sorunu yok

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'defterdar.db');

// Data klasörünü oluştur
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

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

  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');

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
  ];
  migrations.forEach(m => { try { db.exec(m); } catch(e) {} });

  // İlk admin yoksa oluştur
  const adminCheck = db.prepare("SELECT id FROM kullanicilar WHERE rol='admin' LIMIT 1").get();
  if (!adminCheck) {
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare("INSERT OR IGNORE INTO kullanicilar (kullanici_adi, email, sifre_hash, surum, rol) VALUES (?, ?, ?, 'pro', 'admin')")
      .run('admin', 'admin@defterdar.local', hash);
    console.log('Admin kullanici olusturuldu: admin / admin123');
  }

  _db = db;
  return _db;
}

module.exports = { getDb };
