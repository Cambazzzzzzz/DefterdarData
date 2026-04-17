# 🚀 Defterdar Muhasebe - Railway Deployment

## GitHub Repository
**Repo**: https://github.com/Cambazzzzzzz/DefterdarData

## 📋 Railway Deployment Adımları

### 1. Railway Hesabı ve Proje Oluşturma
1. [Railway.app](https://railway.app) hesabı oluşturun
2. "New Project" → "Deploy from GitHub repo" seçin
3. `Cambazzzzzzz/DefterdarData` reposunu seçin

### 2. Environment Variables
Railway dashboard'da şu environment variable'ları ekleyin:

```bash
# Temel Ayarlar
NODE_ENV=production
PORT=4500
SESSION_SECRET=defterdar-railway-super-secret-key-2025

# Veritabanı (Railway otomatik sağlar)
DB_PATH=/app/data/defterdar.db

# Cloudinary (Medya için)
CLOUDINARY_CLOUD_NAME=dguch8d6w
CLOUDINARY_API_KEY=253232419598976
CLOUDINARY_API_SECRET=agZ6arR8iRBS9vFP8tBfKWiTE6Q

# DDM Admin Şifresi
DDM_SIFRE=ddm-4128.316.316

# Railway Ortam Tanımlayıcısı
RAILWAY_ENVIRONMENT=true
```

### 3. Deployment Konfigürasyonu

**railway.json** (otomatik algılanır):
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/api/organizasyonlar",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**nixpacks.toml** (build ayarları):
```toml
[phases.setup]
nixPkgs = ['nodejs-18_x', 'npm-9_x']

[start]
cmd = 'node server.js'
```

### 4. Domain ve SSL
- Railway otomatik domain sağlar: `your-app.railway.app`
- Custom domain eklenebilir
- SSL otomatik aktif

## 🔧 Deployment Sonrası Ayarlar

### ⚠️ Veri Korunması Kontrolü
Deploy sonrası logs'da şunları görmeli:
```bash
✅ DB path secildi: /data/defterdar.db
📁 DB directory: /data
💾 Railway Volume: Mevcut
👤 İlk admin kullanıcısı oluşturuldu: admin/admin123
```

**Eğer "Railway Volume: Yok" görürseniz**:
1. Volume oluşturmayı unutmuşsunuz
2. Mount path `/data` olmalı
3. Redeploy yapın

### İlk Giriş
1. Railway URL'ini açın
2. **Admin Girişi**:
   - Kullanıcı: `DDMAdmin`
   - Şifre: `ddm-4128.316.316`

### Veritabanı
- SQLite dosyası `/app/data/defterdar.db` konumunda
- Railway persistent volume ile korunur
- Otomatik migration çalışır

### Medya Depolama
- Cloudinary entegrasyonu aktif
- Video ve resim yükleme çalışır
- PRO/Normal sürüm limitleri geçerli

## 🌐 Özellikler

### ✅ Çalışan Özellikler
- Kullanıcı kayıt/giriş sistemi
- Organizasyon yönetimi
- Kurban ve hisse takibi
- Video yükleme (Cloudinary)
- Excel export/import
- Admin paneli (DDM)
- PRO key sistemi
- Yedekleme sistemi

### 🔒 Güvenlik
- HTTPS otomatik aktif
- Session güvenliği
- CORS ayarları
- IP yasaklama sistemi
- Şifre hashleme (bcrypt)

## 📊 Monitoring

### Health Check
- Endpoint: `/api/organizasyonlar`
- Railway otomatik health check yapar
- Restart policy: ON_FAILURE

### Logs
```bash
# Railway CLI ile log görüntüleme
railway logs
```

## 🛠️ Troubleshooting

### Deployment Hataları
1. **Build Fail**: `package.json` dependencies kontrol edin
2. **Start Fail**: Environment variables kontrol edin
3. **Database Error**: Persistent volume ayarlarını kontrol edin

### Performance
- Railway'de otomatik scaling
- Memory: 512MB-8GB arası
- CPU: Shared/Dedicated seçenekleri

## 🔄 Güncelleme

### GitHub'dan Otomatik Deploy
1. GitHub'a push yapın
2. Railway otomatik deploy eder
3. Zero-downtime deployment

### Manuel Deploy
```bash
# Railway CLI ile
railway up
```

## 💰 Maliyet

### Railway Pricing
- **Hobby Plan**: $5/ay (512MB RAM)
- **Pro Plan**: $20/ay (8GB RAM)
- **Team Plan**: $20/kullanıcı/ay

### Cloudinary
- **Free**: 25GB storage, 25GB bandwidth
- **Plus**: $89/ay (100GB)

## 📞 Destek

**Geliştirici**: CMS Team  
**Kurucu**: İsmail DEMIRCAN  
**GitHub**: https://github.com/Cambazzzzzzz/DefterdarData  
**Web**: defterdar.xyz

---

## 🎯 Deployment Checklist

- [ ] Railway hesabı oluşturuldu
- [ ] GitHub repo bağlandı
- [ ] Environment variables eklendi
- [ ] İlk deployment başarılı
- [ ] Health check çalışıyor
- [ ] Admin girişi test edildi
- [ ] Veritabanı çalışıyor
- [ ] Medya yükleme test edildi
- [ ] Custom domain eklendi (opsiyonel)

**🚀 Deployment Hazır!**