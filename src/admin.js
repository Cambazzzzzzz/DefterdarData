const router = require('express').Router();
const { getDb } = process.env.RAILWAY_ENVIRONMENT || process.env.PORT
  ? require('./database-web')
  : require('./database');

// Admin middleware
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.ddmAdmin) {
    return res.status(401).json({ hata: 'DDM girisi gerekiyor' });
  }
  next();
}

router.use(requireAdmin);

// ─── KULLANICI YÖNETİMİ ────────────────────────────────────────────────────

router.get('/kullanicilar', async (req, res) => {
  const db = await getDb();
  const list = db.prepare(`SELECT id, kullanici_adi, email, surum, rol, durum, kayit_ip, son_ip, kayit_tarihi FROM kullanicilar ORDER BY kayit_tarihi DESC`).all();
  res.json(list);
});

router.put('/kullanicilar/:id/surum', async (req, res) => {
  const db = await getDb();
  const { surum } = req.body;
  if (!['normal', 'pro'].includes(surum)) return res.status(400).json({ hata: 'Gecersiz surum' });
  db.prepare('UPDATE kullanicilar SET surum=? WHERE id=?').run(surum, req.params.id);
  res.json({ ok: true });
});

router.put('/kullanicilar/:id/durum', async (req, res) => {
  const db = await getDb();
  const { durum } = req.body;
  if (!['aktif', 'askida', 'yasak'].includes(durum)) return res.status(400).json({ hata: 'Gecersiz durum' });
  const user = db.prepare('SELECT * FROM kullanicilar WHERE id=?').get(req.params.id);
  if (!user) return res.status(404).json({ hata: 'Kullanici bulunamadi' });
  
  db.prepare('UPDATE kullanicilar SET durum=? WHERE id=?').run(durum, req.params.id);
  
  // Yasaklanırsa IP'yi de yasakla
  if (durum === 'yasak' && user.kayit_ip) {
    try {
      db.prepare('INSERT OR IGNORE INTO ip_yasaklar (ip, sebep) VALUES (?,?)').run(user.kayit_ip, 'Kullanici yasaklandi: ' + user.kullanici_adi);
    } catch(e) {}
  }
  
  res.json({ ok: true });
});

router.put('/kullanicilar/:id/sifre', async (req, res) => {
  const db = await getDb();
  const { yeni_sifre } = req.body;
  if (!yeni_sifre || yeni_sifre.length < 6) return res.status(400).json({ hata: 'Sifre en az 6 karakter olmali' });
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync(yeni_sifre, 10);
  db.prepare('UPDATE kullanicilar SET sifre_hash=? WHERE id=?').run(hash, req.params.id);
  res.json({ ok: true });
});

router.get('/kullanicilar/:id/organizasyonlar', async (req, res) => {
  const db = await getDb();
  const list = db.prepare('SELECT * FROM organizasyonlar WHERE kullanici_id=? ORDER BY olusturma DESC').all(req.params.id);
  res.json(list);
});

// ─── PRO KEY YÖNETİMİ ──────────────────────────────────────────────────────

router.get('/pro-keyler', async (req, res) => {
  const db = await getDb();
  const list = db.prepare('SELECT * FROM pro_keyler ORDER BY olusturma_tarihi DESC').all();
  res.json(list);
});

router.post('/pro-keyler', async (req, res) => {
  const db = await getDb();
  const { adet } = req.body;
  const sayi = parseInt(adet) || 1;
  if (sayi < 1 || sayi > 100) return res.status(400).json({ hata: 'Adet 1-100 arasinda olmali' });
  
  const keyler = [];
  for (let i = 0; i < sayi; i++) {
    const key = 'DDM-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
      db.prepare('INSERT INTO pro_keyler (key_kodu) VALUES (?)').run(key);
      keyler.push(key);
    } catch(e) {}
  }
  
  res.json({ ok: true, keyler });
});

router.delete('/pro-keyler/:id', async (req, res) => {
  const db = await getDb();
  db.prepare('DELETE FROM pro_keyler WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

router.post('/pro-keyler/:id/iptal', async (req, res) => {
  const db = await getDb();
  const key = db.prepare('SELECT * FROM pro_keyler WHERE id=?').get(req.params.id);
  if (!key) return res.status(404).json({ hata: 'Key bulunamadi' });
  if (!key.kullanildi) return res.status(400).json({ hata: 'Key zaten kullanilmamis' });
  
  // Kullanıcıyı normal sürüme düşür
  if (key.kullanan_kullanici_id) {
    db.prepare("UPDATE kullanicilar SET surum='normal' WHERE id=?").run(key.kullanan_kullanici_id);
  }
  
  // Key'i sil
  db.prepare('DELETE FROM pro_keyler WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ─── PRO TALEPLERİ ─────────────────────────────────────────────────────────

router.get('/pro-talepler', async (req, res) => {
  const db = await getDb();
  const list = db.prepare(`SELECT pt.*, k.kullanici_adi, k.email FROM pro_talepler pt 
    JOIN kullanicilar k ON pt.kullanici_id=k.id 
    ORDER BY pt.olusturma_tarihi DESC`).all();
  res.json(list);
});

router.post('/pro-talepler/:id/onayla', async (req, res) => {
  const db = await getDb();
  const talep = db.prepare('SELECT * FROM pro_talepler WHERE id=?').get(req.params.id);
  if (!talep) return res.status(404).json({ hata: 'Talep bulunamadi' });
  
  db.prepare("UPDATE kullanicilar SET surum='pro' WHERE id=?").run(talep.kullanici_id);
  db.prepare("UPDATE pro_talepler SET durum='onaylandi', cevap_tarihi=CURRENT_TIMESTAMP WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

router.post('/pro-talepler/:id/reddet', async (req, res) => {
  const db = await getDb();
  db.prepare("UPDATE pro_talepler SET durum='reddedildi', cevap_tarihi=CURRENT_TIMESTAMP WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

// ─── IP YASAKLARI ──────────────────────────────────────────────────────────

router.get('/ip-yasaklar', async (req, res) => {
  const db = await getDb();
  const list = db.prepare('SELECT * FROM ip_yasaklar ORDER BY olusturma_tarihi DESC').all();
  res.json(list);
});

router.post('/ip-yasaklar', async (req, res) => {
  const db = await getDb();
  const { ip, sebep } = req.body;
  if (!ip) return res.status(400).json({ hata: 'IP adresi zorunlu' });
  try {
    db.prepare('INSERT INTO ip_yasaklar (ip, sebep) VALUES (?,?)').run(ip, sebep || '');
    res.json({ ok: true });
  } catch(e) {
    res.status(400).json({ hata: 'Bu IP zaten yasakli' });
  }
});

router.delete('/ip-yasaklar/:id', async (req, res) => {
  const db = await getDb();
  db.prepare('DELETE FROM ip_yasaklar WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ─── İSTATİSTİKLER ─────────────────────────────────────────────────────────

router.get('/istatistikler', async (req, res) => {
  const db = await getDb();
  const toplam_kullanici = db.prepare('SELECT COUNT(*) as c FROM kullanicilar').get().c;
  const pro_kullanici = db.prepare("SELECT COUNT(*) as c FROM kullanicilar WHERE surum='pro'").get().c;
  const bekleyen_talepler = db.prepare("SELECT COUNT(*) as c FROM pro_talepler WHERE durum='bekliyor'").get().c;
  const toplam_key = db.prepare('SELECT COUNT(*) as c FROM pro_keyler').get().c;
  const kullanilmis_key = db.prepare('SELECT COUNT(*) as c FROM pro_keyler WHERE kullanildi=1').get().c;
  const yasakli_ip = db.prepare('SELECT COUNT(*) as c FROM ip_yasaklar').get().c;
  
  res.json({
    toplam_kullanici,
    pro_kullanici,
    normal_kullanici: toplam_kullanici - pro_kullanici,
    bekleyen_talepler,
    toplam_key,
    kullanilmis_key,
    kullanilmamis_key: toplam_key - kullanilmis_key,
    yasakli_ip
  });
});

module.exports = router;
