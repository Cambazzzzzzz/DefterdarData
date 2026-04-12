# Defterdar Muhasebe - Deployment Rehberi

## 🚀 Deployment Durumu: HAZIR

Defterdar Muhasebe uygulaması başarıyla deploy edildi ve çalışıyor!

### 📍 Erişim Bilgileri
- **URL:** http://localhost:4500
- **Admin Paneli:** http://localhost:4500/admin
- **Giriş Sayfası:** http://localhost:4500/giris

### 🔐 İlk Giriş Bilgileri
**Admin Hesabı:**
- Kullanıcı Adı: `admin`
- Şifre: `admin123`

⚠️ **ÖNEMLİ:** İlk girişten sonra admin şifresini mutlaka değiştirin!

## 🎯 Yeni Özellikler

### 👑 PRO Sistemi
- **Normal Sürüm:** 100 bağışçı, 3 medya, watermark
- **PRO Sürüm:** Sınırsız bağışçı, sınırsız medya, watermark yok

### 🔧 Admin Paneli
- Kullanıcı yönetimi (sürüm, durum, şifre değiştirme)
- PRO key oluşturma ve yönetimi
- PRO talep onaylama/reddetme
- IP yasaklama sistemi
- Detaylı istatistikler

### 📝 Yazdırma İyileştirmeleri
- Tarih kaldırıldı
- Kurban sayısı eklendi (logo altında)
- PRO/Normal watermark ayrımı
- Gelişmiş layout

### 🔒 Güvenlik
- bcrypt şifre hashleme
- Session tabanlı kimlik doğrulama
- IP takibi ve yasaklama
- Hesap askıya alma

## 🛠️ Teknik Detaylar

### Veritabanı
- SQLite (sql.js)
- Otomatik migration
- İlk admin kullanıcısı otomatik oluşturma

### API Endpoints
- `/api/auth/*` - Kimlik doğrulama
- `/api/admin/*` - Admin işlemleri
- `/api/medya/*` - Medya yönetimi
- `/api/*` - Genel API

### Dosya Yapısı
```
Defterdar/
├── public/           # Frontend dosyalar
│   ├── index.html    # Ana sayfa
│   ├── admin.html    # Admin paneli
│   ├── giris.html    # Giriş sayfası
│   ├── app.js        # Ana uygulama
│   ├── app-admin.js  # Admin paneli JS
│   └── style.css     # Stil dosyası
├── src/              # Backend dosyalar
│   ├── auth.js       # Kimlik doğrulama
│   ├── admin.js      # Admin routes
│   ├── routes.js     # Ana routes
│   ├── database.js   # Electron DB
│   ├── database-web.js # Web DB
│   └── cloudinary.js # Medya yönetimi
├── data/             # Veritabanı
└── server.js         # Express sunucu
```

## 🎮 Kullanım Rehberi

### 1. İlk Kurulum
1. Admin hesabı ile giriş yapın
2. Admin şifresini değiştirin
3. PRO keyler oluşturun
4. Kullanıcıları yönetin

### 2. PRO Aktivasyonu
**Yöntem 1: PRO Key**
- Admin panelinden key oluşturun
- Kullanıcı "Defterdar PRO" sayfasından key'i girin

**Yöntem 2: Talep Onayı**
- Kullanıcı PRO talep gönderir
- Admin panelinden talebi onaylayın

### 3. Medya Yönetimi
- Normal: Max 3 dosya
- PRO: Sınırsız
- Cloudinary entegrasyonu

### 4. Yazdırma
- Normal: Watermark var
- PRO: Watermark minimal
- Kurban sayısı gösterimi

## 🔧 Maintenance

### Veritabanı Yedekleme
```bash
# Veritabanı dosyası
cp data/defterdar.db backup/defterdar-$(date +%Y%m%d).db
```

### Log Kontrolü
```bash
# Sunucu logları
npm start 2>&1 | tee logs/defterdar.log
```

### Güncelleme
```bash
git pull
npm install
npm start
```

## 🚨 Sorun Giderme

### Veritabanı Sorunları
- `data/` klasörü yazılabilir olmalı
- SQLite dosya izinlerini kontrol edin

### Session Sorunları
- Tarayıcı çerezlerini temizleyin
- Session secret'ı kontrol edin

### Medya Yükleme Sorunları
- Cloudinary ayarlarını kontrol edin
- Dosya boyutu limitlerini kontrol edin

## 📞 Destek

**CMS Team**
- Founder: Ismail DEMIRCAN
- Web: defterdar.xyz
- GitHub: [Repository Link]

---

## ✅ Deployment Checklist

- [x] Sunucu çalışıyor (Port 4500)
- [x] Veritabanı oluşturuldu
- [x] Admin hesabı hazır
- [x] PRO sistemi aktif
- [x] Admin paneli erişilebilir
- [x] Medya yükleme çalışıyor
- [x] Yazdırma sistemi güncel
- [x] Güvenlik önlemleri aktif

**🎉 DEPLOYMENT BAŞARILI!**