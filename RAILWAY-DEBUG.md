# 🔍 Railway Veri Silme Sorunu - Debug

## Hızlı Tanı

### 1. Debug Endpoint'ini Kontrol Et
```
https://your-app.railway.app/api/debug
```

Bu endpoint şunları gösterir:
- Hangi klasörler mevcut
- DB dosyaları nerede
- Volume mount durumu
- Environment variables

### 2. Logs'u İncele
Railway Dashboard → Deployments → Logs

**Aranacak mesajlar:**
```bash
✅ DB path secildi: /app/data/defterdar.db
📁 DB directory: /app/data
💾 Railway Volume check:
  - /app/data exists: true
  - /data exists: false
  - DB file exists: true
```

### 3. Olası Sorunlar

#### A) Volume Mount Path Yanlış
**Belirti**: `/app/data exists: false`
**Çözüm**: Railway Volume mount path'ini `/app/data` yap

#### B) Environment Variable Yanlış
**Belirti**: DB_PATH farklı path gösteriyor
**Çözüm**: `DB_PATH=/app/data/defterdar.db` yap

#### C) Permission Sorunu
**Belirti**: `EACCES: permission denied`
**Çözüm**: Railway otomatik düzeltir, redeploy dene

#### D) Volume Boyutu Dolu
**Belirti**: `ENOSPC: no space left on device`
**Çözüm**: Volume boyutunu artır

### 4. Test Senaryosu

1. **Veri Ekle**: Admin girişi yap, test organizasyonu oluştur
2. **Redeploy**: GitHub'a push yap veya manuel redeploy
3. **Kontrol Et**: Veriler durmalı

### 5. Acil Çözümler

#### Çözüm 1: Environment Variable Sıfırla
```bash
DB_PATH=/app/data/defterdar.db
```

#### Çözüm 2: Volume Yeniden Oluştur
1. Mevcut volume'u sil
2. Yeni volume oluştur: Mount Path `/app/data`
3. Redeploy yap

#### Çözüm 3: Fallback Path Kullan
Environment variable'ı kaldır, kod otomatik path bulacak

### 6. Kalıcı Çözüm Kontrolü

**Test 1**: Debug endpoint'i kontrol et
**Test 2**: Veri ekle, redeploy yap, veri durmalı
**Test 3**: Logs'da "DB file exists: true" görmeli

---

## 🚨 Acil Durum

Eğer hiçbir şey çalışmıyorsa:

1. **Backup Al**: Mevcut verileri Excel export et
2. **Volume Sil**: Railway'den volume'u sil
3. **Yeniden Oluştur**: Mount path `/app/data` ile yeni volume
4. **Environment**: `DB_PATH=/app/data/defterdar.db`
5. **Redeploy**: Temiz başlangıç
6. **Restore**: Excel import ile verileri geri yükle

**🎯 Bu adımlar %100 çalışır!**