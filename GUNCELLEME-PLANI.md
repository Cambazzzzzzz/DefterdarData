# 🚀 İÇDER Muhasebe Güncelleme Planı

## ✅ Tamamlananlar
1. Sol menüde scroll eklendi
2. "İÇDER Muhasebe" başlığı güncellendi

## 🔄 Devam Edenler

### 1. Anasayfa Dashboard - Gerçek Veriler
- [ ] Toplam bağış
- [ ] Kumbara tahsilat
- [ ] Sponsor tahsilat
- [ ] Toplam personel
- [ ] Bağışçı sayısı
- [ ] Faydalanıcı sayısı
- [ ] Bekleyen kurban hisse

### 2. Bağışçılar Sistemi
- [ ] Tüm kategorilerdeki bağışçılar
- [ ] Kurban bağışçıları
- [ ] Su kuyusu bağışçıları
- [ ] Genel bağışçılar
- [ ] Sponsor bağışçılar

### 3. Su Kuyusu Organizasyonu
- [ ] Yeni organizasyon türü: "Su Kuyusu"
- [ ] Su kuyusu oluşturma formu
- [ ] Lokasyon bilgisi
- [ ] Maliyet takibi
- [ ] Bağışçı atama

### 4. Bağış Türü Yönetimi
- [ ] Dinamik bağış türü oluşturma
- [ ] Kategori tanımlama
- [ ] Alt kategori sistemi
- [ ] Her kategori için ayrı route
- [ ] Bağış türü düzenleme/silme

## 📊 Database Şeması Güncellemeleri

```sql
-- Organizasyon türleri
ALTER TABLE organizasyonlar ADD COLUMN tur TEXT DEFAULT 'kurban';

-- Bağış türleri tablosu
CREATE TABLE bagis_turleri (
  id INTEGER PRIMARY KEY,
  kategori TEXT NOT NULL,
  alt_kategori TEXT,
  aciklama TEXT,
  aktif INTEGER DEFAULT 1
);

-- Su kuyusu tablosu
CREATE TABLE su_kuyulari (
  id INTEGER PRIMARY KEY,
  organizasyon_id INTEGER,
  lokasyon TEXT,
  maliyet REAL,
  durum TEXT DEFAULT 'planlaniyor'
);
```

## 🎯 Öncelik Sırası
1. Dashboard gerçek veriler (ÖNCELİK 1)
2. Bağış türü yönetimi (ÖNCELİK 2)
3. Su kuyusu organizasyonu (ÖNCELİK 3)
4. Bağışçı kategorileri (ÖNCELİK 4)
