const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'defterdar-cms-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 saat
}));

app.use('/api/auth', require('./src/auth'));
app.use('/api', require('./src/routes'));
app.use('/api/medya', require('./src/cloudinary'));
app.use('/api/admin', require('./src/admin'));

// DDM Admin şifre (env'den veya default)
let DDM_SIFRE = process.env.DDM_SIFRE || 'ddm-4128-316-4128';

app.post('/api/ddm/giris', (req, res) => {
  const { sifre } = req.body;
  console.log('DDM giris denemesi:', JSON.stringify(sifre), '===', JSON.stringify(DDM_SIFRE), '->', sifre === DDM_SIFRE);
  if (sifre && sifre.trim() === DDM_SIFRE) {
    req.session.ddmAdmin = true;
    req.session.save(() => res.json({ ok: true }));
  } else {
    res.status(401).json({ ok: false, hata: 'Hatalı şifre' });
  }
});

app.post('/api/ddm/cikis', (req, res) => {
  req.session.ddmAdmin = false;
  res.json({ ok: true });
});

app.post('/api/ddm/sifre-degistir', (req, res) => {
  if (!req.session.ddmAdmin) return res.status(401).json({ ok: false });
  const { yeni_sifre } = req.body;
  if (!yeni_sifre || yeni_sifre.length < 6) return res.status(400).json({ hata: 'En az 6 karakter' });
  DDM_SIFRE = yeni_sifre;
  res.json({ ok: true });
});

app.get('/api/ddm/durum', (req, res) => {
  res.json({ giris: !!req.session.ddmAdmin });
});

app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'ddm.html')));
app.get('/ddm', (req, res) => res.sendFile(path.join(__dirname, 'public', 'ddm.html')));

app.get('/giris', (req, res) => res.sendFile(path.join(__dirname, 'public', 'giris.html')));
app.get('/kayit', (req, res) => res.sendFile(path.join(__dirname, 'public', 'giris.html')));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ ok: false });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Defterdar Muhasebe: http://localhost:${PORT}`);
  });
}
