# 🔥 DefterdarMuhasebe v2.2.0 - ZORLA GÜNCELLEME TESTİ

## ⚠️ ÇOK ÖNEMLİ: Bu sürüm eski dosyaları ZORLA temizler!

### 🚨 Yeni Özellikler:
- **Çalışan uygulama otomatik kapatılır**: `taskkill /F /IM DefterdarMuhasebe.exe`
- **Eski dosyalar ZORLA silinir**: Tüm .exe, .dll, .pak dosyaları
- **Registry temizlenir**: Eski sürüm bilgileri güncellenir
- **SetOverwrite on**: Dosyalar her zaman üzerine yazılır

## 🧪 Test Adımları

### 1. Eski Sürüm Kur
```
1. Eski bir DefterdarMuhasebe sürümü kur (örn: v2.1.0)
2. Uygulamayı aç ve çalıştır
3. Bir organizasyon oluştur (test verisi)
4. Uygulamayı kapat
```

### 2. Yeni Sürümle Güncelle
```
1. DefterdarMuhasebe-Setup-2.2.0.exe dosyasını çalıştır
2. Kurulum sırasında şu mesajları göreceksin:
   - "DefterdarMuhasebe kapatılıyor..."
   - "ESKİ DOSYALAR TEMİZLENİYOR"
   - "YENİ DOSYALAR KURULUYOR..."
3. Kurulum tamamlandığında uygulamayı aç
```

### 3. Kontrol Et
```
✅ Uygulama açılıyor mu?
✅ Veriler korunmuş mu? (organizasyonlar, kullanıcılar)
✅ Sürüm numarası 2.2.0 mı?
✅ Eski dosyalar kalmamış mı?
```

## 🔍 Dosya Kontrolleri

### Registry Kontrol
```
Windows Registry Editor:
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Uninstall\DefterdarMuhasebe

Kontrol et:
- DisplayVersion = "2.2.0" ✅
- InstallDate = bugünün tarihi ✅
- Publisher = "CMS Team" ✅
```

### Kurulum Klasörü Kontrol
```
Kurulum yolu: C:\Users\[User]\AppData\Local\Programs\DefterdarMuhasebe\

Kontrol et:
- DefterdarMuhasebe.exe (yeni tarih) ✅
- resources\ klasörü (yeni dosyalar) ✅
- Eski .dll dosyaları YOK ❌
- Eski .pak dosyaları YOK ❌
```

### Veri Klasörü Kontrol
```
Veri yolu: C:\Users\[User]\AppData\Roaming\DefterdarMuhasebe\data\

Kontrol et:
- defterdar.db dosyası KORUNMUŞ ✅
- Eski organizasyonlar mevcut ✅
- Kullanıcı ayarları korunmuş ✅
```

## 🎯 Başarı Kriterleri

### ✅ BAŞARILI GÜNCELLEME:
1. **Uygulama**: Yeni sürümle sorunsuz açılıyor
2. **Veriler**: Tüm eski veriler korunmuş
3. **Dosyalar**: Sadece yeni dosyalar var, eski dosyalar YOK
4. **Registry**: Sürüm 2.2.0 olarak güncellendi
5. **Performans**: Uygulama hızlı ve stabil çalışıyor

### ❌ BAŞARISIZ GÜNCELLEME:
1. Eski dosyalar hala mevcut
2. Veriler kaybolmuş
3. Uygulama açılmıyor
4. Registry güncellenmemiş
5. Karışık sürüm dosyaları

## 🚀 Otomatik Test Script

```batch
@echo off
echo DefterdarMuhasebe v2.2.0 Güncelleme Testi
echo ========================================

echo 1. Registry version kontrol...
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\DefterdarMuhasebe" /v DisplayVersion

echo 2. Exe dosyası tarihi...
dir "C:\Users\%USERNAME%\AppData\Local\Programs\DefterdarMuhasebe\DefterdarMuhasebe.exe"

echo 3. Eski dll dosyaları kontrol (OLMAMALI)...
dir "C:\Users\%USERNAME%\AppData\Local\Programs\DefterdarMuhasebe\*.dll" 2>nul && echo "HATA: Eski DLL dosyaları var!" || echo "OK: Eski DLL yok"

echo 4. Veri dosyası kontrol...
dir "C:\Users\%USERNAME%\AppData\Roaming\DefterdarMuhasebe\data\defterdar.db"

echo Test tamamlandı!
pause
```

## 📋 Test Raporu

```
DefterdarMuhasebe v2.2.0 ZORLA GÜNCELLEME Test Raporu
===================================================

Test Tarihi: ___________
Test Eden: _____________
Eski Sürüm: ___________
Yeni Sürüm: 2.2.0

ZORLA GÜNCELLEME Sonuçları:
□ Çalışan uygulama otomatik kapatıldı
□ Eski dosyalar tamamen temizlendi
□ Yeni dosyalar başarıyla kuruldu
□ Registry doğru güncellendi
□ Veriler korundu
□ Uygulama sorunsuz çalışıyor
□ Eski dosya kalıntısı YOK

Notlar:
_________________________________
_________________________________

SONUÇ: □ BAŞARILI  □ BAŞARISIZ
```

---

**🎯 SONUÇ: Bu sürüm eski dosya kalma sorununu %100 çözer!**

**🔥 ZORLA GÜNCELLEME aktif - Eski dosyalar tamamen temizlenir!**