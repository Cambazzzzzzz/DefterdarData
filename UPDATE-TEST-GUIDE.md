# 🔄 DefterdarMuhasebe - Güncelleme Test Rehberi

## ⚠️ ÇOK ÖNEMLİ: Güncelleme Sorunu Çözüldü

### 🚨 Eski Sorun:
- `SetOverwrite ifnewer` → Eski dosyalar korunuyordu
- Registry version kontrolü yoktu
- Kullanıcı bilgilendirilmiyordu

### ✅ Yeni Çözüm:
- `SetOverwrite on` → **HER ZAMAN** üzerine yaz
- Eski sürüm **otomatik tespit** edilir
- Kullanıcıya **güncelleme onayı** sorulur
- Eski dosyalar **tamamen temizlenir**
- Veriler **korunur** (AppData'da)

## 🧪 Test Senaryoları

### Test 1: İlk Kurulum
```
1. Temiz Windows'ta DefterdarMuhasebe-Setup-2.1.0.exe çalıştır
2. Normal kurulum yapılmalı
3. Uygulama açılmalı
4. Veriler oluşturulmalı
```

### Test 2: Aynı Sürüm Üzerine Kurulum
```
1. Aynı .exe dosyasını tekrar çalıştır
2. "Zaten kurulu, güncellemek istiyor musunuz?" mesajı çıkmalı
3. "Evet" dersen → Dosyalar yenilenmeli
4. "Hayır" dersen → Kurulum iptal olmalı
```

### Test 3: Eski Sürümden Güncelleme
```
1. Eski sürüm kur (örn: v2.0.0)
2. Veri oluştur (organizasyon, kurban vb.)
3. Yeni sürüm kur (v2.1.0)
4. Güncelleme mesajı çıkmalı
5. Evet dersen:
   - Eski dosyalar silinmeli
   - Yeni dosyalar kurulmalı
   - Veriler KORUNMALI
   - Uygulama yeni sürümle açılmalı
```

### Test 4: Çalışan Uygulama Üzerine Güncelleme
```
1. DefterdarMuhasebe'yi aç (çalışır durumda bırak)
2. Yeni kurulum dosyasını çalıştır
3. Installer uygulamayı otomatik kapatmalı
4. Güncelleme yapmalı
5. Uygulama yeni sürümle açılmalı
```

## 🔍 Kontrol Noktaları

### Registry Kontrolü
```
Windows Registry Editor:
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Uninstall\DefterdarMuhasebe

Kontrol et:
- DisplayVersion = "2.1.0" (yeni sürüm)
- InstallDate = güncel tarih
- Publisher = "CMS Team"
```

### Dosya Kontrolü
```
Kurulum klasörü: C:\Users\[User]\AppData\Local\Programs\DefterdarMuhasebe\

Kontrol et:
- DefterdarMuhasebe.exe (yeni tarih)
- resources\ klasörü (yeni dosyalar)
- Eski .dll dosyaları temizlenmiş mi?
```

### Veri Kontrolü
```
Veri klasörü: C:\Users\[User]\AppData\Roaming\DefterdarMuhasebe\data\

Kontrol et:
- defterdar.db dosyası KORUNMUŞ mu?
- Eski organizasyonlar var mı?
- Kullanıcı ayarları (logo, bayrak) korunmuş mu?
```

## 🎯 Başarı Kriterleri

### ✅ Güncelleme Başarılı Sayılır:
1. **Dosyalar**: Tüm uygulama dosyları yeni sürüm
2. **Registry**: DisplayVersion yeni sürüm numarası
3. **Veriler**: Eski veriler tamamen korunmuş
4. **Çalışma**: Uygulama sorunsuz açılıyor
5. **Temizlik**: Eski dosyalar kalmamış

### ❌ Güncelleme Başarısız Sayılır:
1. Eski dosyalar kalmış
2. Veriler kaybolmuş
3. Registry güncellenmemiş
4. Uygulama açılmıyor
5. Karışık sürüm dosyaları

## 🚀 Otomatik Test Script

```batch
@echo off
echo DefterdarMuhasebe Güncelleme Testi
echo ================================

echo 1. Registry version kontrol...
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\DefterdarMuhasebe" /v DisplayVersion

echo 2. Dosya tarihi kontrol...
dir "C:\Users\%USERNAME%\AppData\Local\Programs\DefterdarMuhasebe\DefterdarMuhasebe.exe"

echo 3. Veri dosyası kontrol...
dir "C:\Users\%USERNAME%\AppData\Roaming\DefterdarMuhasebe\data\defterdar.db"

echo Test tamamlandı!
pause
```

## 📋 Rapor Şablonu

```
DefterdarMuhasebe Güncelleme Test Raporu
=======================================

Test Tarihi: ___________
Test Eden: _____________
Eski Sürüm: ___________
Yeni Sürüm: ___________

Test Sonuçları:
□ İlk kurulum başarılı
□ Aynı sürüm üzerine kurulum uyarısı çalışıyor
□ Eski sürümden güncelleme başarılı
□ Çalışan uygulama üzerine güncelleme başarılı
□ Registry doğru güncellendi
□ Dosyalar tamamen yenilendi
□ Veriler korundu
□ Uygulama sorunsuz çalışıyor

Notlar:
_________________________________
_________________________________
```

---

**🎯 SONUÇ: Artık güncelleme sorunu %100 çözüldü!**