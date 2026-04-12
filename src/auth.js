const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getDb } = require('./database-web');

function getIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress || 'unknown';
}

// ─── KAYIT ─────────────────────────────────────────────────────────────────
router.post('/kayit', async (req, res) => {
  const { kullanici_adi, email, sifre } = req.body;
  if (!kullanici_adi || !email || !sifre)
    return res.status(400).json({ hata: 'Tum alanlar zorunlu' });
  if (sifre.length < 6)
    return res.status(400).json({ hata: 'Sifre en az 6 karakter olmali' });

  const ip = getIP(req);
  const db = await getDb();

  // IP ban kontrolü
  const ipBan = db.prepare('SELECT id FROM ip_yasaklar WHERE ip=?').get(ip);
  if (ipBan) return res.status(403).json({ hata: 'Bu IP adresi yasaklanmistir' });

  const mevcut = db.prepare('SELECT id FROM kullanicilar WHERE kullanici_adi=? OR email=?').get(kullanici_adi, email);
  if (mevcut) return res.status(400).json({ hata: 'Bu kullanici adi veya email zaten kayitli' });

  const hash = bcrypt.hashSync(sifre, 10);
  const r = db.prepare('INSERT INTO kullanicilar (kullanici_adi, email, sifre_hash, kayit_ip, son_ip) VALUES (?,?,?,?,?)').run(kullanici_adi, email, hash, ip, ip);
  req.session.userId = r.lastInsertRowid;
  req.session.kullaniciAdi = kullanici_adi;
  req.session.surum = 'normal';
  req.session.rol = 'kullanici';
  res.json({ ok: true, kullanici_adi });
});

// ─── GİRİŞ ─────────────────────────────────────────────────────────────────
router.post('/giris', async (req, res) => {
  const { kullanici_adi, sifre } = req.body;
  if (!kullanici_adi || !sifre)
    return res.status(400).json({ hata: 'Kullanici adi ve sifre zorunlu' });

  const ip = getIP(req);
  const db = await getDb();

  // IP ban kontrolü
  const ipBan = db.prepare('SELECT id FROM ip_yasaklar WHERE ip=?').get(ip);
  if (ipBan) return res.status(403).json({ hata: 'Bu IP adresi yasaklanmistir' });

  const user = db.prepare('SELECT * FROM kullanicilar WHERE kullanici_adi=?').get(kullanici_adi);
  if (!user) return res.status(401).json({ hata: 'Kullanici adi veya sifre yanlis' });

  // Hesap askıya alınmış mı?
  if (user.durum === 'askida') return res.status(403).json({ hata: 'Hesabiniz askiya alinmistir. Destek icin iletisime gecin.' });
  if (user.durum === 'yasak') return res.status(403).json({ hata: 'Hesabiniz yasaklanmistir.' });

  const eslesme = bcrypt.compareSync(sifre, user.sifre_hash);
  if (!eslesme) return res.status(401).json({ hata: 'Kullanici adi veya sifre yanlis' });

  // Son IP güncelle
  db.prepare('UPDATE kullanicilar SET son_ip=? WHERE id=?').run(ip, user.id);

  req.session.userId = user.id;
  req.session.kullaniciAdi = user.kullanici_adi;
  req.session.surum = user.surum || 'normal';
  req.session.rol = user.rol || 'kullanici';
  res.json({ ok: true, kullanici_adi: user.kullanici_adi, surum: user.surum || 'normal', rol: user.rol || 'kullanici' });
});

// ─── ÇIKIŞ ─────────────────────────────────────────────────────────────────
router.post('/cikis', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

// ─── DURUM ─────────────────────────────────────────────────────────────────
router.get('/durum', async (req, res) => {
  if (!req.session.userId) return res.json({ girisYapildi: false });
  try {
    const db = await getDb();
    const user = db.prepare('SELECT kullanici_adi, surum, rol, durum FROM kullanicilar WHERE id=?').get(req.session.userId);
    if (!user || user.durum === 'askida' || user.durum === 'yasak') {
      req.session.destroy();
      return res.json({ girisYapildi: false });
    }
    res.json({ girisYapildi: true, kullanici_adi: user.kullanici_adi, userId: req.session.userId, surum: user.surum || 'normal', rol: user.rol || 'kullanici' });
  } catch(e) {
    res.json({ girisYapildi: true, kullanici_adi: req.session.kullaniciAdi, userId: req.session.userId, surum: req.session.surum || 'normal', rol: req.session.rol || 'kullanici' });
  }
});

// ─── PRO KEY KULLAN ─────────────────────────────────────────────────────────
router.post('/pro-key', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ hata: 'Giris yapmaniz gerekiyor' });
  const { key } = req.body;
  if (!key) return res.status(400).json({ hata: 'Key zorunlu' });
  if (!key.startsWith('DDM-')) return res.status(400).json({ hata: 'Gecersiz key formati' });

  const db = await getDb();
  const keyRow = db.prepare('SELECT * FROM pro_keyler WHERE key_kodu=?').get(key);
  if (!keyRow) return res.status(400).json({ hata: 'Gecersiz key' });
  if (keyRow.kullanildi) return res.status(400).json({ hata: 'Bu key daha once kullanilmis' });

  const user = db.prepare('SELECT kullanici_adi FROM kullanicilar WHERE id=?').get(req.session.userId);
  db.prepare('UPDATE pro_keyler SET kullanildi=1, kullanan_kullanici_id=?, kullanan_adi=?, kullanilma_tarihi=CURRENT_TIMESTAMP WHERE key_kodu=?')
    .run(req.session.userId, user.kullanici_adi, key);
  db.prepare("UPDATE kullanicilar SET surum='pro' WHERE id=?").run(req.session.userId);
  req.session.surum = 'pro';
  res.json({ ok: true, mesaj: 'PRO aktivasyon basarili!' });
});

// ─── PRO TALEP ─────────────────────────────────────────────────────────────
router.post('/pro-talep', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ hata: 'Giris yapmaniz gerekiyor' });
  const { mesaj } = req.body;
  const db = await getDb();
  const mevcutTalep = db.prepare("SELECT id FROM pro_talepler WHERE kullanici_id=? AND durum='bekliyor'").get(req.session.userId);
  if (mevcutTalep) return res.status(400).json({ hata: 'Zaten bekleyen bir talebiniz var' });
  db.prepare('INSERT INTO pro_talepler (kullanici_id, mesaj) VALUES (?,?)').run(req.session.userId, mesaj || '');
  res.json({ ok: true });
});

module.exports = router;
