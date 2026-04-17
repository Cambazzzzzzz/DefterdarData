# Defterdar Muhasebe v2.0.0 - Yenilikler

## 🎯 Ana Özellikler

### 🔐 Gelişmiş Admin Girişi
- **DDMAdmin** kullanıcı adı ve **ddm-4128.316.316** şifresi ile giriş
- Kullanıcı adı + şifre kombinasyonu ile daha güvenli erişim

### 💾 Akıllı Veri Korunması
- **Güncelleme sonrası veriler asla silinmez**
- Veritabanı ProgramData altında saklanır (Windows userData)
- Uygulama güncellendiğinde tüm organizasyonlar, kurbanlar ve bağışçılar korunur

### 🚪 Yedekli Kapatma Sistemi
- Uygulama kapatılırken **2 seçenek**:
  - **Yedekle ve Kapat**: Seçilen organizasyonun Excel yedegini alır
  - **Yedeksiz Kapat**: Direkt kapatır
- Otomatik yedek dosya adı: `defterdar-yedek-YYYY-MM-DD-HH-mm-ss.xlsx`

### 📹 Video Yükleme Sistemi
- **Video isteyen bağışçılar** için özel video yükleme
- Cloudinary entegrasyonu ile güvenli depolama
- Desteklenen formatlar: MP4, MOV, WEBM, AVI
- Hisse bazında video yönetimi
- Video görüntüleme ve silme özellikleri

### 📊 Veri İçe Aktarma
- **Excel dosyasından toplu veri yükleme**
- 3 sayfa desteği:
  - **Organizasyonlar**: Ad, Yıl, Max Kurban, Fiyatlar
  - **Kurbanlar**: Org bilgisi, Kurban detayları
  - **Bağışçılar**: Hisse bilgileri, İletişim
- Mevcut veriler korunur, sadece yeni veriler eklenir
- Örnek Excel dosyası indirme özelliği

## 🛠️ Teknik İyileştirmeler

### 🗄️ Veritabanı Güncellemeleri
- `hisseler` tablosuna `video_url` ve `video_public_id` kolonları
- Otomatik migration sistemi
- Veri bütünlüğü korunması

### 🎨 Kullanıcı Arayüzü
- Yeni "Veri Yükle" menüsü
- Video yükleme arayüzü hisse modalında
- Gelişmiş kapatma modalı
- Drag & drop dosya yükleme

### 🔧 Build Sistemi
- NSIS installer iyileştirmeleri
- Veri korunması makroları
- Kaldırma öncesi uyarı sistemi
- Versiyon 2.0.0 güncellemesi

## 📋 Kullanım Kılavuzu

### Admin Girişi
1. Uygulama açıldığında giriş ekranında:
   - **Kullanıcı Adı**: `DDMAdmin`
   - **Şifre**: `ddm-4128.316.316`

### Video Yükleme
1. Hisse düzenlerken "Video İster mi?" seçeneğini "Evet" yapın
2. Video yükleme alanı görünecek
3. Video dosyasını sürükleyip bırakın veya tıklayarak seçin
4. Yüklenen videoyu görüntüleyebilir veya silebilirsiniz

### Veri İçe Aktarma
1. Sol menüden "Veri Yükle" seçin
2. "Örnek Dosya İndir" ile format öğrenin
3. Excel dosyanızı hazırlayın (3 sayfa: Organizasyonlar, Kurbanlar, Bağışçılar)
4. Dosyayı sürükleyip bırakın veya seçin
5. İşlem sonucunu kontrol edin

### Yedekli Kapatma
1. Uygulamayı kapatmaya çalışın (X butonu)
2. Yedek alma modalı açılacak
3. Organizasyon seçin
4. "Yedekle ve Kapat" veya "Yedeksiz Kapat" seçin

## 🔒 Güvenlik ve Veri Korunması

- **Veriler asla silinmez**: Güncelleme, yeniden kurulum sonrası tüm veriler korunur
- **Otomatik yedekleme**: Kapatma öncesi isteğe bağlı yedek alma
- **Çöp kutusu sistemi**: Silinen veriler geri yüklenebilir
- **Cloudinary güvenliği**: Medya dosyaları güvenli bulut depolamada

## 🚀 Performans İyileştirmeleri

- Daha hızlı veritabanı işlemleri
- Optimize edilmiş Excel export/import
- Gelişmiş hata yönetimi
- Akıllı dosya yükleme sistemi

---

**Geliştirici**: CMS Team  
**Kurucu**: İsmail DEMIRCAN  
**Versiyon**: 2.0.0  
**Tarih**: 2025