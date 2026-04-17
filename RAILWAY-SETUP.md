# 🚀 Railway Deployment - Adım Adım Kurulum

## 1. Railway Hesabı Oluşturma
1. [Railway.app](https://railway.app) adresine gidin
2. "Start a New Project" tıklayın
3. GitHub ile giriş yapın

## 2. GitHub Repository Bağlama
1. "Deploy from GitHub repo" seçin
2. `Cambazzzzzzz/DefterdarData` reposunu seçin
3. "Deploy Now" tıklayın

## 3. Environment Variables Ekleme
Railway dashboard'da "Variables" sekmesine gidin ve şu değişkenleri ekleyin:

### Temel Ayarlar
```
NODE_ENV = production
PORT = 4500
SESSION_SECRET = defterdar-railway-super-secret-key-2025
```

### Veritabanı
```
DB_PATH = /data/defterdar.db
```
**⚠️ ÖNEMLİ**: Railway Volume oluşturmayı unutmayın!
- Mount Path: `/data`
- Size: `1GB` (ücretsiz)
- Volume olmadan veriler her deploy'da silinir!

### Cloudinary (Medya için)
```
CLOUDINARY_CLOUD_NAME = dguch8d6w
CLOUDINARY_API_KEY = 253232419598976
CLOUDINARY_API_SECRET = agZ6arR8iRBS9vFP8tBfKWiTE6Q
```

### Admin Ayarları
```
DDM_SIFRE = ddm-4128.316.316
RAILWAY_ENVIRONMENT = true
```

## 4. Deployment Bekleme
- Railway otomatik build ve deploy işlemini başlatır
- Logs sekmesinden ilerlemeyi takip edebilirsiniz
- Build süresi: ~2-3 dakika

## 5. Domain Alma
1. "Settings" sekmesine gidin
2. "Domains" bölümünde "Generate Domain" tıklayın
3. Otomatik domain: `your-app-name.railway.app`

## 6. İlk Giriş Testi
1. Railway domain'ini açın
2. Admin girişi:
   - Kullanıcı: `DDMAdmin`
   - Şifre: `ddm-4128.316.316`

## 7. Veritabanı Kontrolü
- İlk açılışta otomatik admin hesabı oluşturulur:
  - Kullanıcı: `admin`
  - Şifre: `admin123`

## 8. Health Check
- Railway otomatik health check yapar
- Endpoint: `/api/organizasyonlar`
- Başarısız olursa otomatik restart

## 🔧 Troubleshooting

### ⚠️ Veriler Deploy Sonrası Siliniyor
**Sebep**: Railway Volume oluşturulmamış

**Çözüm**:
1. Railway Dashboard → Variables → Volume
2. "Create Volume" → Mount Path: `/data` → Size: `1GB`
3. Environment variable: `DB_PATH=/data/defterdar.db`
4. Redeploy yapın

### Build Hatası
```bash
# Logs'da şu hatayı görürseniz:
npm ERR! peer dep missing

# Çözüm: package.json'da dependencies kontrol edin
```

### Database Hatası
```bash
# EACCES: permission denied hatası
# Çözüm: DB_PATH environment variable'ını kontrol edin
```

### Port Hatası
```bash
# Port already in use
# Çözüm: PORT environment variable'ını 4500 yapın
```

## 🎯 Başarı Kontrol Listesi

- [ ] Railway hesabı oluşturuldu
- [ ] GitHub repo bağlandı
- [ ] **Railway Volume oluşturuldu** (`/data` mount path)
- [ ] Environment variables eklendi (`DB_PATH=/data/defterdar.db`)
- [ ] Build başarılı (yeşil ✅)
- [ ] Domain oluşturuldu
- [ ] Site açılıyor
- [ ] Admin girişi çalışıyor
- [ ] Veritabanı `/data` klasöründe
- [ ] **Redeploy testi yapıldı** (veriler korunuyor mu?)

## 🌐 Sonuç

Başarılı deployment sonrası:
- **URL**: `https://your-app.railway.app`
- **Admin**: DDMAdmin / ddm-4128.316.316
- **Veritabanı**: SQLite (persistent)
- **Medya**: Cloudinary entegrasyonu
- **SSL**: Otomatik aktif

**🎉 Defterdar Muhasebe Railway'de çalışıyor!**