# 🏛️ Defterdar Muhasebe v2.3.0

**Profesyonel STK Muhasebe Sistemi** - CMS Team tarafından geliştirilmiştir.

## 📋 Özellikler

### 💼 Muhasebe Yönetimi
- **Organizasyon Yönetimi**: Çoklu organizasyon desteği
- **Kurban Kayıtları**: Detaylı kurban bilgileri
- **Bağışçı Takibi**: Hisse bazında bağışçı yönetimi
- **Video Sistemi**: Video isteyen bağışçılar için özel sistem
- **Telefon Yönetimi**: Bağışçı telefon numaraları kaydı (WhatsApp için hazır)

### 📊 Raporlama
- **Excel Çıktıları**: Detaylı raporlar (telefon numaraları dahil)
- **Yazdırma Desteği**: Profesyonel belgeler
- **Otomatik Yedekleme**: Güvenli veri korunması

### 🔒 Güvenlik
- **Şifreli Giriş**: Güvenli admin paneli
- **Veri Şifreleme**: Yerel veri korunması
- **Firewall Uyumlu**: Otomatik port yönetimi

### 📱 İletişim (Planlanan)
- **WhatsApp Entegrasyonu**: Gelecek sürümlerde eklenecek
- **Otomatik Bildirimler**: Kurban kesildi, video hazır bildirimleri
- **Toplu Mesajlaşma**: Organizasyon bazında duyurular
- **Detaylı Bilgi**: `WHATSAPP-ENTEGRASYON.md` dosyasına bakın

## 🚀 Hızlı Kurulum

### 1. Hazır Kurulum (Önerilen)
```bash
# Kurulum dosyasını indirin ve çalıştırın
DefterdarMuhasebe-Setup-2.3.0.exe
```

### 2. Geliştirici Kurulumu
```bash
# Projeyi klonlayın
git clone [repo-url]
cd Defterdar

# Bağımlılıkları yükleyin
npm install

# Sunucuyu başlatın
npm start

# Electron uygulamasını başlatın (ayrı terminal)
npm run electron
```

## 🔧 Build İşlemi

```bash
# Kurulum dosyası oluştur
npm run build

# Test için klasör oluştur
npm run build-dir

# Test scriptini çalıştır
./test-kurulum.bat
```

## 🔑 Giriş Bilgileri

**Kullanıcı Adı**: `DDMAdmin`  
**Şifre**: `ddm-4128.316.316`  
**Port**: `4500`

## 📁 Proje Yapısı

```
Defterdar/
├── build/                  # Build dosyaları
│   ├── icon.ico           # Uygulama ikonu
│   └── installer.nsh      # NSIS installer scripti
├── data/                  # Veritabanı dosyaları
├── dist/                  # Build çıktıları
├── public/                # Frontend dosyaları
├── src/                   # Backend kaynak kodları
├── electron.js            # Electron ana dosyası
├── server.js              # Express sunucu
├── package.json           # Proje konfigürasyonu
└── README.md              # Bu dosya
```

## 🛠️ Geliştirme

### Gereksinimler
- **Node.js**: v18.0.0+
- **npm**: v8.0.0+
- **Windows**: 10/11 (x64)

### Komutlar
```bash
npm start          # Sunucuyu başlat
npm run dev        # Geliştirme modu
npm run electron   # Electron uygulaması
npm run build      # Kurulum dosyası oluştur
npm run dist       # Build alias
```

### Veritabanı
- **SQLite3**: better-sqlite3 ile
- **Konum**: `data/defterdar.db`
- **Yedek**: Otomatik Excel yedekleme

### API Endpoints
```
GET  /              # Ana sayfa
POST /login         # Giriş
GET  /dashboard     # Yönetim paneli
POST /api/...       # API endpoints
```

## 🎯 Kullanım Kılavuzu

### 1. İlk Kurulum
1. `DefterdarMuhasebe-Setup-2.3.0.exe` dosyasını çalıştırın
2. Kurulum sihirbazını takip edin
3. Masaüstü kısayolundan uygulamayı başlatın

### 2. İlk Giriş
1. **DDMAdmin** / **ddm-4128.316.316** ile giriş yapın
2. Sol menüden "Organizasyonlar" seçin
3. Yeni organizasyon oluşturun

### 3. Kurban Ekleme
1. "Kurbanlar" menüsünden "Yeni Kurban" seçin
2. Kurban bilgilerini doldurun
3. Hisse sayısını belirleyin

### 4. Bağışçı Ekleme
1. Kurban listesinden "Hisseler" butonuna tıklayın
2. "Yeni Bağışçı" seçin
3. Bağışçı bilgilerini doldurun
4. Video ister seçeneğini işaretleyin (isteğe bağlı)

### 5. Video Yükleme
1. Video isteyen bağışçılar listesinden seçin
2. "Video Yükle" butonuna tıklayın
3. MP4, MOV veya WEBM dosyası seçin
4. Yükleme tamamlanana kadar bekleyin

### 6. Veri İçe Aktarma
1. "Ayarlar" menüsünden "Veri İçe Aktar" seçin
2. Örnek Excel dosyasını indirin
3. Verilerinizi örnek formata göre düzenleyin
4. Excel dosyasını yükleyin

### 7. Yedekleme
1. Uygulamayı kapatırken "Yedekle ve Kapat" seçin
2. Organizasyon seçin
3. Kayıt konumunu belirleyin
4. Excel yedek dosyası oluşturulur

## 🔍 Sorun Giderme

### Build Hataları
```bash
# Node modules temizle
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Çakışması
```bash
# Port 4500 kullanımda ise
netstat -ano | findstr :4500
taskkill /PID [PID_NUMARASI] /F
```

### Windows Defender Uyarısı
- İlk çalıştırmada "Bilinmeyen yayımcı" uyarısı normal
- "Yine de çalıştır" seçeneği ile devam edin
- Exclusion eklemek için: Windows Security > Virus & threat protection > Exclusions

### Veritabanı Hataları
```bash
# Veritabanını sıfırla
rm data/defterdar.db*
npm start  # Yeni veritabanı oluşturulur
```

## 📞 Destek

**Geliştirici**: CMS Team  
**Kurucu**: İsmail DEMIRCAN  
**E-posta**: info@cmsteam.com  
**Web**: https://cmsteam.com  

## 📄 Lisans

Bu yazılım CMS Team tarafından geliştirilmiştir. Tüm hakları saklıdır.

## 🔄 Sürüm Geçmişi

### v2.3.0 (19 Nisan 2026)
- ✅ Profesyonel NSIS installer
- ✅ Windows Defender uyumluluğu
- ✅ Otomatik güncelleme sistemi
- ✅ Geliştirilmiş video yükleme
- ✅ Veri korunması optimizasyonu

### v2.2.0
- Video sistemi eklendi
- Cloudinary entegrasyonu
- Geliştirilmiş yedekleme

### v2.1.0
- Veri içe aktarma özelliği
- Excel rapor sistemi
- Güvenlik güncellemeleri

### v2.0.0
- Electron tabanlı masaüstü uygulaması
- Modern arayüz tasarımı
- SQLite veritabanı entegrasyonu

---

**CMS Team © 2025**  
**DefterdarMuhasebe v2.3.0**