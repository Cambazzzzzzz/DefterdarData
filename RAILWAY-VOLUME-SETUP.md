# 🗄️ Railway Volume Setup - Veri Korunması

## ⚠️ Önemli: Railway'de Veri Korunması

Railway varsayılan olarak **ephemeral file system** kullanır. Bu demek oluyor ki:
- Her deploy sonrası tüm dosyalar silinir
- Veritabanı dosyası kaybolur
- Kullanıcı verileri sıfırlanır

## 💾 Çözüm: Railway Volume

Railway Volume, persistent storage sağlar ve deploy sonrası veriler korunur.

### 1. Railway Volume Oluşturma

#### Railway Dashboard'dan:
1. Projenizi açın
2. **"Variables"** sekmesine gidin
3. **"Volume"** sekmesine geçin
4. **"Create Volume"** tıklayın
5. **Mount Path**: `/data` yazın
6. **Size**: `1GB` (ücretsiz limit)
7. **"Create"** tıklayın

#### Railway CLI ile:
```bash
# Railway CLI kurulumu
npm install -g @railway/cli

# Login
railway login

# Volume oluştur
railway volume create --mount-path /data --size 1
```

### 2. Environment Variables Güncelleme

Railway dashboard'da **Variables** sekmesinde:

```bash
# Veritabanı path'ini volume'a yönlendir
DB_PATH=/data/defterdar.db

# Diğer ayarlar aynı kalır
NODE_ENV=production
PORT=4500
SESSION_SECRET=defterdar-railway-super-secret-key-2025
CLOUDINARY_CLOUD_NAME=dguch8d6w
CLOUDINARY_API_KEY=253232419598976
CLOUDINARY_API_SECRET=agZ6arR8iRBS9vFP8tBfKWiTE6Q
DDM_SIFRE=ddm-4128.316.316
RAILWAY_ENVIRONMENT=true
```

### 3. Redeploy

Volume oluşturduktan sonra:
1. **"Deployments"** sekmesine gidin
2. **"Redeploy"** tıklayın
3. Yeni deployment volume ile başlar

## 🔍 Volume Kontrolü

### Logs'da Kontrol
Railway logs'da şu mesajları göreceksiniz:

```bash
✅ DB path secildi: /data/defterdar.db
📁 DB directory: /data
💾 Railway Volume: Mevcut
👤 İlk admin kullanıcısı oluşturuldu: admin/admin123
📊 Veritabanı: 1 kullanıcı, 0 organizasyon
```

### Health Check
```bash
curl https://your-app.railway.app/health
```

Yanıt:
```json
{
  "status": "OK",
  "timestamp": "2025-01-14T...",
  "environment": "production",
  "railway": true
}
```

## 📊 Volume Yönetimi

### Volume Bilgileri
```bash
# Railway CLI ile
railway volume list
railway volume info
```

### Volume Boyutu
- **Free Plan**: 1GB volume ücretsiz
- **Pro Plan**: 100GB'a kadar
- **Maliyet**: $0.25/GB/ay

### Backup
```bash
# Manuel backup (Railway CLI)
railway run "cp /data/defterdar.db /tmp/backup.db"
railway run "cat /tmp/backup.db" > local-backup.db
```

## 🚨 Troubleshooting

### Volume Mount Edilmedi
**Hata**: `❌ DB path yazilabilir degil: /data/defterdar.db`

**Çözüm**:
1. Volume oluşturuldu mu kontrol edin
2. Mount path `/data` olmalı
3. Redeploy yapın

### Permission Denied
**Hata**: `EACCES: permission denied`

**Çözüm**:
```bash
# Railway'de otomatik düzelir, redeploy deneyin
```

### Volume Dolu
**Hata**: `ENOSPC: no space left on device`

**Çözüm**:
1. Volume boyutunu artırın
2. Eski verileri temizleyin
3. Backup alıp yeni volume oluşturun

## ✅ Test Senaryosu

### 1. İlk Deploy
1. Volume oluşturun
2. Environment variables ekleyin
3. Deploy edin
4. Admin hesabı oluşturun
5. Test verisi ekleyin

### 2. Redeploy Testi
1. GitHub'a kod değişikliği push edin
2. Railway otomatik redeploy eder
3. Veriler korunmalı
4. Admin hesabı durmalı

### 3. Başarı Kriterleri
- [ ] Volume mount edildi (`/data` klasörü var)
- [ ] Database `/data/defterdar.db` konumunda
- [ ] Redeploy sonrası veriler korunuyor
- [ ] Admin hesabı kaybolmuyor
- [ ] Organizasyonlar durmalı

## 💡 Best Practices

### Volume Boyutu
- Başlangıç: 1GB (ücretsiz)
- Orta ölçek: 5GB
- Büyük ölçek: 20GB+

### Backup Stratejisi
1. **Otomatik**: Excel export ile günlük
2. **Manuel**: Railway CLI ile haftalık
3. **Cloudinary**: Medya dosyaları zaten korunuyor

### Monitoring
```bash
# Disk kullanımı
railway run "df -h /data"

# Database boyutu
railway run "ls -lh /data/defterdar.db"
```

---

## 🎯 Özet

**Railway Volume** ile:
- ✅ Veriler deploy sonrası korunur
- ✅ Database persistent olur
- ✅ Kullanıcı hesapları kaybolmaz
- ✅ Organizasyonlar durmalı

**Volume olmadan**:
- ❌ Her deploy'da veriler sıfırlanır
- ❌ Database kaybolur
- ❌ Kullanıcılar tekrar kayıt olmalı

**🚀 Volume oluşturup redeploy yapın!**