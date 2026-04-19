# Defterdar Muhasebe - Build Kılavuzu

## 🚀 EXE Kurulum Dosyası Oluşturma

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Windows (build için)

### Build Adımları

1. **Bağımlılıkları yükle**:
```bash
cd Defterdar
npm install
```

2. **Electron Builder ile EXE oluştur**:
```bash
npm run build
```

3. **Kurulum dosyası konumu**:
```
Defterdar/dist/Defterdar Muhasebe Setup 2.0.0.exe
```

### Build Konfigürasyonu

`package.json` içindeki build ayarları:

```json
{
  "build": {
    "appId": "com.cmsteam.defterdar",
    "productName": "Defterdar Muhasebe",
    "win": {
      "target": ["nsis"],
      "arch": ["x64"],
      "icon": "assets/defterdar.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "perMachine": true,
      "createDesktopShortcut": true,
      "deleteAppDataOnUninstall": false
    }
  }
}
```

### Önemli Özellikler

- **Veri Korunması**: `deleteAppDataOnUninstall: false` ile veriler korunur
- **Masaüstü Kısayolu**: Otomatik oluşturulur
- **Sistem Geneli Kurulum**: `perMachine: true`
- **Kurulum Dizini Seçimi**: Kullanıcı isterse değiştirebilir

### Kurulum Sonrası

1. **Masaüstü kısayolu** ile uygulama başlatılır
2. **İlk giriş**: DDMAdmin / ddm-4128.316.316
3. **Veri konumu**: `%APPDATA%/defterdar-muhasebe/data/`
4. **Port**: 4500 (otomatik firewall kuralı eklenir)

### Güncelleme

- Yeni versiyon kurulduğunda eski veriler korunur
- Veritabanı otomatik migrate edilir
- Eski kurulum temizlenir, veriler kalır

### Sorun Giderme

**Build hatası alıyorsanız**:
```bash
# Node modules temizle
rm -rf node_modules package-lock.json
npm install

# Cache temizle
npm run build -- --publish=never
```

**Kurulum hatası**:
- Yönetici olarak çalıştırın
- Antivirus'ü geçici kapatın
- Windows Defender exclusion ekleyin

---

**Not**: Build işlemi Windows'ta yapılmalıdır. Linux/Mac'te cross-platform build mümkün ancak test edilmemiştir.