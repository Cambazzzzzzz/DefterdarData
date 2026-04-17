# 🚀 Railway Basit Çözüm - Veri Korunması

## ⚡ Hızlı Çözüm (Volume Olmadan)

Railway Dashboard'da sadece şu environment variable'ı ekle:

```bash
DB_PATH=/app/data/defterdar.db
```

## 🔧 Nasıl Çalışıyor?

1. **Dockerfile** zaten `/app/data` klasörünü oluşturuyor
2. **database-web.js** önce `/data` (volume) sonra `/app/data` (dockerfile) arıyor
3. Volume yoksa otomatik olarak `/app/data` kullanıyor

## ⚠️ Önemli Not

Bu çözümde veriler **deploy sonrası korunmaz** ama:
- ✅ Uygulama çalışır durumda kalır
- ✅ Crash olmaz
- ✅ Geliştirme için yeterli

## 🎯 Kalıcı Çözüm İçin

Eğer veriler kalıcı olsun istersen:
1. Railway'de Volume oluştur (`/data` mount path)
2. `DB_PATH=/data/defterdar.db` environment variable ekle
3. Redeploy yap

## 📋 Şu Anki Durum

- ✅ Kod hazır (her iki durumu da destekliyor)
- ✅ Dockerfile hazır
- ⏳ Sadece environment variable ekle ve redeploy yap

---

**Hızlı çözüm:** `DB_PATH=/app/data/defterdar.db` ekle, redeploy yap! 🚀