const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4500;

// Railway deployment için CORS ve güvenlik ayarları
if (process.env.RAILWAY_ENVIRONMENT) {
  app.set('trust proxy', 1);
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Content-Type', 'text/html; charset=UTF-8');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
}

// UTF-8 encoding için middleware
app.use((req, res, next) => {
  res.charset = 'utf-8';
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'defterdar-cms-2024-railway-deploy',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 saat
    secure: process.env.RAILWAY_ENVIRONMENT ? true : false,
    sameSite: process.env.RAILWAY_ENVIRONMENT ? 'none' : 'lax'
  }
}));

app.get('/api/debug', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    railway: !!process.env.RAILWAY_ENVIRONMENT,
    db_path: process.env.DB_PATH,
    directories: {
      '/app/data': fs.existsSync('/app/data'),
      '/data': fs.existsSync('/data'),
      '/tmp': fs.existsSync('/tmp'),
      './data': fs.existsSync('./data')
    },
    db_files: {}
  };
  
  // DB dosyalarını kontrol et
  const dbPaths = ['/app/data/defterdar.db', '/data/defterdar.db', '/tmp/defterdar.db'];
  dbPaths.forEach(p => {
    try {
      const stats = fs.statSync(p);
      debug.db_files[p] = {
        exists: true,
        size: stats.size,
        modified: stats.mtime
      };
    } catch(e) {
      debug.db_files[p] = { exists: false, error: e.message };
    }
  });
  
  res.json(debug);
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    railway: !!process.env.RAILWAY_ENVIRONMENT
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', require('./src/auth'));
app.use('/api', require('./src/routes'));
app.use('/api/medya', require('./src/cloudinary'));
app.use('/api/admin', require('./src/admin'));

// DDM Admin şifre (env'den veya default)
let DDM_SIFRE = process.env.DDM_SIFRE || 'ddm-4128.316.316';

app.post('/api/ddm/giris', (req, res) => {
  const { kullanici, sifre } = req.body;
  console.log('DDM giris denemesi:', JSON.stringify(kullanici), JSON.stringify(sifre));
  if (kullanici === 'DDMAdmin' && sifre === DDM_SIFRE) {
    req.session.ddmAdmin = true;
    req.session.save(() => res.json({ ok: true }));
  } else {
    res.status(401).json({ ok: false, hata: 'Hatalı kullanıcı adı veya şifre' });
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
  if (req.path.startsWith('/api')) return res.status(404).json({ ok: false, error: 'API endpoint not found' });
  // Railway deployment için index.html serve et
  if (process.env.RAILWAY_ENVIRONMENT) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

module.exports = app;

if (require.main === module) {
  const host = process.env.RAILWAY_ENVIRONMENT ? '0.0.0.0' : 'localhost';
  app.listen(PORT, host, () => {
    console.log(`Defterdar Muhasebe: http://${host}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Railway: ${process.env.RAILWAY_ENVIRONMENT ? 'Yes' : 'No'}`);
  });
}
