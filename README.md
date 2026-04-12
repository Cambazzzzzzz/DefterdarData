# Defterdar Muhasebe - PRO Sistemi

## Yeni Özellikler

### 🎯 Kullanıcı Sistemi
- Kayıt ve giriş sistemi
- Kullanıcı bazlı veri yönetimi
- IP takibi ve güvenlik

### 👑 Defterdar PRO
- **Normal Sürüm:**
  - Maksimum 100 bağışçı
  - Maksimum 3 medya dosyası
  - Yazdırmalarda watermark

- **PRO Sürüm:**
  - Sınırsız bağışçı
  - Sınırsız medya deposu
  - Watermark olmadan yazdırma
  - Yatay/Dikey yazdırma seçeneği
  - Gelişmiş raporlama
  - Öncelikli destek

### 🔐 Admin Paneli
- Kullanıcı yönetimi
- PRO key oluşturma ve yönetimi
- PRO talep yönetimi
- IP yasaklama sistemi
- Detaylı istatistikler

## Kurulum

```bash
npm install
npm start
```

## İlk Giriş

**Admin Hesabı:**
- Kullanıcı Adı: `admin`
- Şifre: `admin123`

⚠️ **ÖNEMLİ:** İlk girişten sonra admin şifresini değiştirin!

## PRO Aktivasyonu

### 1. PRO Key ile
- Admin panelinden DDM- ile başlayan key oluşturun
- Kullanıcı "Defterdar PRO" sayfasından key'i girin

### 2. Talep ile
- Kullanıcı "Defterdar PRO" sayfasından talep gönderir
- Admin panelinden talebi onaylayın

## Yazdırma Özellikleri

### Normal Sürüm
- Watermark: "defterdar.xyz - CMS Team" (büyük font)
- Tarih gösterilmez
- Kurban sayısı gösterilir

### PRO Sürüm
- Watermark: "Defterdar Muhasebe — defterdar.xyz" (küçük font)
- Tarih gösterilmez
- Kurban sayısı gösterilir
- Yatay/Dikey seçeneği (gelecek güncellemede)

## Medya Deposu

### Normal Sürüm
- Maksimum 3 dosya
- Cloudinary entegrasyonu

### PRO Sürüm
- Sınırsız dosya
- Cloudinary entegrasyonu

## Güvenlik

- Şifreler bcrypt ile hashlenir
- Session tabanlı kimlik doğrulama
- IP bazlı yasaklama
- Hesap askıya alma

## Geliştirici

**CMS Team**
- Founder: Ismail DEMIRCAN
- Web: defterdar.xyz

## Lisans

Copyright © 2025 CMS Team
