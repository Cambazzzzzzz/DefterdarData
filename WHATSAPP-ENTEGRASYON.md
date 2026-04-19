# 📱 WhatsApp Entegrasyonu - Defterdar Muhasebe

## 🔍 Mevcut Durum

Defterdar Muhasebe **v2.3.0** şu anda **WhatsApp entegrasyonu içermemektedir**. Ancak telefon numarası yönetimi ve manuel iletişim için gerekli altyapı mevcuttur.

---

## ✅ Mevcut Özellikler

### 1. Telefon Numarası Yönetimi
- **Bağışçı Telefonu**: Her bağışçı için telefon numarası kaydedilir
- **Kimin Adına Telefonu**: Kurban kimin adına kesiliyorsa onun telefonu
- **Veritabanı Alanları**:
  - `bagisci_telefon` - Bağışçının telefon numarası
  - `kimin_adina_telefon` - Kurban sahibinin telefon numarası

### 2. Excel Raporları
- Telefon numaraları Excel raporlarında görüntülenir
- Toplu veri dışa aktarımı yapılabilir
- Filtreleme ve arama özellikleri mevcut

### 3. Video Sistemi
- Video URL'leri kaydedilir (Cloudinary)
- Video isteyen bağışçılar işaretlenir
- Manuel olarak video linkleri paylaşılabilir

---

## 🚀 Gelecek Sürümler İçin Planlanan Özellikler

### Faz 1: WhatsApp Business API Entegrasyonu
```javascript
// Örnek yapı
const whatsapp = {
  apiKey: 'YOUR_API_KEY',
  phoneNumberId: 'YOUR_PHONE_NUMBER_ID',
  businessAccountId: 'YOUR_BUSINESS_ACCOUNT_ID'
};

// Mesaj gönderme
async function sendWhatsAppMessage(to, message) {
  const response = await fetch('https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + whatsapp.apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: message }
    })
  });
  return response.json();
}
```

### Faz 2: Otomatik Bildirimler
- ✅ Kurban kesildiğinde otomatik bildirim
- ✅ Video hazır olduğunda link gönderimi
- ✅ Ödeme hatırlatmaları
- ✅ Organizasyon duyuruları

### Faz 3: Şablon Mesajları
```javascript
const templates = {
  kurbanKesildi: {
    name: 'kurban_kesildi',
    language: 'tr',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{bagisci_adi}}' },
          { type: 'text', text: '{{kurban_no}}' }
        ]
      }
    ]
  },
  videoHazir: {
    name: 'video_hazir',
    language: 'tr',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{bagisci_adi}}' },
          { type: 'text', text: '{{video_url}}' }
        ]
      }
    ]
  }
};
```

### Faz 4: Toplu Mesajlaşma
- Organizasyon bazında toplu mesaj
- Filtreleme (ödeme durumu, video isteği, vb.)
- Zamanlama özellikleri
- Mesaj geçmişi ve raporlama

---

## 🛠️ Manuel Kullanım (Şu An)

### 1. Telefon Numaralarını Kaydetme
```
1. Bağışçı eklerken "Telefon" alanını doldurun
2. Format: +90 5XX XXX XX XX (önerilen)
3. Veritabanında saklanır
```

### 2. Excel Raporu ile Toplu İletişim
```
1. Raporlar > Excel İndir
2. Excel'de telefon numaraları görünür
3. WhatsApp Web'den manuel mesaj gönderin
4. Veya toplu SMS servisi kullanın
```

### 3. Video Linklerini Paylaşma
```
1. Video yüklendiğinde URL kaydedilir
2. Bağışçı listesinden URL'yi kopyalayın
3. WhatsApp'tan manuel paylaşın
```

---

## 📋 Veritabanı Yapısı

### Hisseler Tablosu
```sql
CREATE TABLE hisseler (
  id INTEGER PRIMARY KEY,
  kurban_id INTEGER,
  hisse_no INTEGER,
  bagisci_adi TEXT,
  bagisci_telefon TEXT,          -- WhatsApp için
  kimin_adina TEXT,
  kimin_adina_telefon TEXT,      -- WhatsApp için
  odeme_durumu TEXT,
  video_ister INTEGER,
  video_url TEXT,                -- Paylaşılacak link
  video_public_id TEXT,
  aciklama TEXT,
  olusturma DATETIME
);
```

---

## 🔧 Entegrasyon Gereksinimleri

### WhatsApp Business API
1. **Meta Business Hesabı**: https://business.facebook.com
2. **WhatsApp Business API Erişimi**: Onay gerekli
3. **Telefon Numarası**: İş telefonu gerekli
4. **Webhook URL**: Gelen mesajlar için
5. **SSL Sertifikası**: HTTPS zorunlu

### Alternatif Çözümler
1. **Twilio WhatsApp API**: https://www.twilio.com/whatsapp
2. **MessageBird**: https://messagebird.com
3. **360dialog**: https://www.360dialog.com
4. **WATI**: https://www.wati.io

---

## 💡 Örnek Kullanım Senaryoları

### Senaryo 1: Kurban Kesildi Bildirimi
```javascript
// Kurban kesildiğinde
async function kurbanKesildiNotify(kurbanId) {
  const hisseler = await getHisseler(kurbanId);
  
  for (const hisse of hisseler) {
    if (hisse.bagisci_telefon) {
      const mesaj = `Sayın ${hisse.bagisci_adi}, 
      
${hisse.kurban_no} numaralı kurbanınız kesilmiştir.

${hisse.video_ister ? 'Video linkiniz hazır olduğunda tarafınıza iletilecektir.' : ''}

Hayırlı kurbanlar dileriz.`;
      
      await sendWhatsApp(hisse.bagisci_telefon, mesaj);
    }
  }
}
```

### Senaryo 2: Video Hazır Bildirimi
```javascript
async function videoHazirNotify(hisseId) {
  const hisse = await getHisse(hisseId);
  
  if (hisse.bagisci_telefon && hisse.video_url) {
    const mesaj = `Sayın ${hisse.bagisci_adi},

Kurban videonuz hazır!

Video linki: ${hisse.video_url}

Hayırlı kurbanlar dileriz.`;
    
    await sendWhatsApp(hisse.bagisci_telefon, mesaj);
  }
}
```

### Senaryo 3: Ödeme Hatırlatması
```javascript
async function odemeHatirlatma(organizasyonId) {
  const bekleyenler = await getOdemeBekleyenler(organizasyonId);
  
  for (const hisse of bekleyenler) {
    if (hisse.bagisci_telefon) {
      const mesaj = `Sayın ${hisse.bagisci_adi},

${hisse.kurban_no} numaralı kurban için ödemeniz beklenmektedir.

Tutar: ${hisse.hisse_fiyati} TL

Lütfen en kısa sürede ödemenizi yapınız.`;
      
      await sendWhatsApp(hisse.bagisci_telefon, mesaj);
    }
  }
}
```

---

## 📊 İstatistikler ve Raporlama

### Mesaj Durumu Takibi
```javascript
const messageStatus = {
  sent: 'Gönderildi',
  delivered: 'İletildi',
  read: 'Okundu',
  failed: 'Başarısız'
};

// Veritabanına eklenecek tablo
CREATE TABLE whatsapp_mesajlar (
  id INTEGER PRIMARY KEY,
  hisse_id INTEGER,
  telefon TEXT,
  mesaj TEXT,
  durum TEXT,
  gonderim_tarihi DATETIME,
  iletim_tarihi DATETIME,
  okunma_tarihi DATETIME
);
```

---

## 🔐 Güvenlik ve Gizlilik

### KVKK Uyumluluğu
- ✅ Telefon numaraları şifreli saklanmalı
- ✅ Kullanıcı onayı alınmalı
- ✅ Mesaj geçmişi loglanmalı
- ✅ Silme hakkı tanınmalı

### Güvenlik Önlemleri
```javascript
// Telefon numarası şifreleme
const crypto = require('crypto');

function encryptPhone(phone) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(phone, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptPhone(encrypted) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

---

## 📞 Destek ve Yardım

**Geliştirici**: CMS Team  
**E-posta**: info@cmsteam.com  
**Web**: https://cmsteam.com  

**Not**: WhatsApp entegrasyonu için özel geliştirme talebi oluşturabilirsiniz.

---

**CMS Team © 2025**  
**DefterdarMuhasebe v2.3.0**