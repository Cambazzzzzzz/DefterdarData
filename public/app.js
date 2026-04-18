// AUTH KONTROL
// Kullanıcı ayarları global
let _kullaniciAyarlar = { logo_data: null, bayrak_data: null, kurulum_tamamlandi: 0 };
let _kullaniciAdi = '';
// Pro sistemi kaldırıldı - herkes sınırsızdır

// Yedek alma uyarısı
window.addEventListener('beforeunload', function(e) {
  const message = 'Sayfayı kapatmadan önce verilerinizi yedeklemek ister misiniz?';
  e.preventDefault();
  e.returnValue = message;
  return message;
});

(async function checkAuth() {
  const lastLogin = localStorage.getItem('defterdar-last-login');
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  if (lastLogin && (now - parseInt(lastLogin)) < TWENTY_FOUR_HOURS) {
    const r = await fetch('/api/auth/durum');
    const d = await r.json();
    if (d.girisYapildi) {
      _kullaniciAdi = d.kullanici_adi;

      const badge = document.getElementById('user-badge');
      const name = document.getElementById('user-name');
      if (badge) badge.style.display = '';
      if (name) name.textContent = d.kullanici_adi;
      await yukleKullaniciAyarlar();
      return;
    }
  }

  const r = await fetch('/api/auth/durum');
  const d = await r.json();
  if (!d.girisYapildi) {
    localStorage.removeItem('defterdar-last-login');
    window.location.href = '/giris.html';
    return;
  }
  _kullaniciAdi = d.kullanici_adi;

  const badge = document.getElementById('user-badge');
  const name = document.getElementById('user-name');
  if (badge) badge.style.display = '';
  if (name) name.textContent = d.kullanici_adi;
  await yukleKullaniciAyarlar();
})();

async function yukleKullaniciAyarlar() {
  try {
    const ayar = await api('GET', '/ayarlar');
    _kullaniciAyarlar = ayar;
    if (!ayar.kurulum_tamamlandi) {
      setTimeout(() => modalKurulumSihirbazi(), 600);
    }
  } catch(e) {}
}

async function cikisYap() {
  // Çıkış öncesi yedek uyarısı
  await modalCikisYedek();
}

// KURULUM SİHİRBAZI
let _setupLogoData = null;
let _setupBayrakData = null;

function modalKurulumSihirbazi() {
  _setupLogoData = null;
  _setupBayrakData = null;
  openModal('Hoş Geldiniz! Kurulum', `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:36px;margin-bottom:6px">🎉</div>
      <div style="font-size:14px;color:var(--text2)">Yazdırma şablonunuz için görselleri yükleyin.</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px">
      <div class="form-group">
        <label><i class="fa-solid fa-image"></i> Logonuz <span style="color:var(--text3);font-weight:400">(Orta + Bağışçı sol üst)</span></label>
        <div class="upload-zone" style="padding:16px;text-align:center;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('setup-logo-input').click()">
          <div id="setup-logo-preview">
            <i class="fa-solid fa-cloud-arrow-up" style="font-size:22px;color:var(--text3)"></i>
            <div style="color:var(--text3);font-size:12px;margin-top:4px">Logo yükle</div>
          </div>
        </div>
        <input type="file" id="setup-logo-input" accept="image/*" style="display:none" onchange="onSetupImageChange(this,'logo')"/>
      </div>
      <div class="form-group">
        <label><i class="fa-solid fa-flag"></i> Sağ Üst Bayrak <span style="color:var(--text3);font-weight:400">(Kurban yazdır)</span></label>
        <div class="upload-zone" style="padding:16px;text-align:center;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('setup-bayrak-input').click()">
          <div id="setup-bayrak-preview">
            <i class="fa-solid fa-cloud-arrow-up" style="font-size:22px;color:var(--text3)"></i>
            <div style="color:var(--text3);font-size:12px;margin-top:4px">Bayrak yükle</div>
          </div>
        </div>
        <input type="file" id="setup-bayrak-input" accept="image/*" style="display:none" onchange="onSetupImageChange(this,'bayrak')"/>
      </div>
    </div>
    <div style="background:var(--bg4);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--text3);line-height:1.7">
      <i class="fa-solid fa-info-circle" style="color:var(--accent)"></i>
      <strong>Kurban yazdır:</strong> Sol üst = Türk Bayrağı (sabit) &nbsp;|&nbsp; Orta = Logonuz &nbsp;|&nbsp; Sağ üst = Yüklediğiniz bayrak<br>
      <i class="fa-solid fa-info-circle" style="color:var(--accent)"></i>
      <strong>Bağışçı listesi:</strong> Sol üst = Logonuz &nbsp;|&nbsp; Ayarlardan sonradan değiştirilebilir
    </div>
    <div class="form-actions" style="margin-top:16px">
      <button class="btn btn-secondary" onclick="kurulumAtla()">Şimdi Değil</button>
      <button class="btn btn-primary" onclick="kurulumKaydet()"><i class="fa-solid fa-floppy-disk"></i> Kaydet ve Başla</button>
    </div>
  `, true, 'gear');
}

function onSetupImageChange(input, tip) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    if (tip === 'logo') {
      _setupLogoData = data;
      document.getElementById('setup-logo-preview').innerHTML =
        '<img src="' + data + '" style="max-height:80px;max-width:100%;border-radius:6px;object-fit:contain"/>';
    } else {
      _setupBayrakData = data;
      document.getElementById('setup-bayrak-preview').innerHTML =
        '<img src="' + data + '" style="max-height:80px;max-width:100%;border-radius:6px;object-fit:contain"/>';
    }
  };
  reader.readAsDataURL(file);
}

async function kurulumKaydet() {
  try {
    const logo = _setupLogoData || _kullaniciAyarlar.logo_data;
    const bayrak = _setupBayrakData || _kullaniciAyarlar.bayrak_data;
    await api('POST', '/ayarlar', { logo_data: logo, bayrak_data: bayrak, kurulum_tamamlandi: 1 });
    _kullaniciAyarlar.logo_data = logo;
    _kullaniciAyarlar.bayrak_data = bayrak;
    _kullaniciAyarlar.kurulum_tamamlandi = 1;
    closeModal();
    toast('Ayarlar kaydedildi');
  } catch(e) { toast(e.message, 'error'); }
}

async function kurulumAtla() {
  try {
    await api('POST', '/ayarlar', { kurulum_tamamlandi: 1 });
    _kullaniciAyarlar.kurulum_tamamlandi = 1;
  } catch(e) {}
  closeModal();
}

// ÇIKIŞ YEDEK MODALI
async function modalCikisYedek() {
  let orgOpts = '<option value="">-- Organizasyon seçin --</option>';
  try {
    const orgs = await api('GET', '/organizasyonlar');
    orgOpts += orgs.map(o => '<option value="' + o.id + '"' + (o.id === S.orgId ? ' selected' : '') + '>' + esc(o.ad) + ' (' + o.yil + ')</option>').join('');
  } catch(e) {}

  openModal('🔒 Çıkmadan Önce Yedek Alın', `
    <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:16px;margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:10px">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:24px;color:var(--red)"></i>
        <div>
          <div style="font-weight:700;font-size:15px;margin-bottom:4px">Verilerinizi kaybetmeyin!</div>
          <div style="font-size:13px;color:var(--text2)">Çıkmadan önce verilerinizi yedeklemenizi şiddetle tavsiye ederiz. Yedek dosyası ile başka bilgisayara da taşıyabilirsiniz.</div>
        </div>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:16px">
      <label><i class="fa-solid fa-layer-group"></i> Yedeklenecek Organizasyon</label>
      <select id="cikis-org-select" style="width:100%">
        <option value="tümü">🗂️ Tüm Organizasyonlar (Tam Yedek)</option>
        ${orgOpts}
      </select>
    </div>
    <div class="form-actions">
      <button class="btn btn-danger" onclick="cikisYapsiz()"><i class="fa-solid fa-right-from-bracket"></i> Yedeksiz Çık</button>
      <button class="btn btn-secondary" onclick="closeModal()"><i class="fa-solid fa-xmark"></i> İptal</button>
      <button class="btn btn-primary" onclick="yedekAlVeCik()"><i class="fa-solid fa-floppy-disk"></i> Yedekle ve Çık</button>
    </div>
    <div id="cikis-status" style="margin-top:10px;font-size:12px;min-height:18px;text-align:center"></div>
  `, false, 'shield-halved');
}

async function yedekAlVeCik() {
  const orgSec = document.getElementById('cikis-org-select').value;
  const statusEl = document.getElementById('cikis-status');
  statusEl.textContent = 'Yedek hazırlanıyor...';
  statusEl.style.color = 'var(--accent)';

  try {
    let url, filename;
    const tarih = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    if (orgSec === 'tümü' || !orgSec) {
      url = '/api/tam-yedek';
      filename = 'defterdar-tam-yedek-' + tarih + '.json';
    } else {
      url = '/api/organizasyonlar/' + orgSec + '/excel';
      filename = 'defterdar-yedek-' + tarih + '.xlsx';
    }

    if (window.electronAPI && window.electronAPI.downloadFile) {
      const fullUrl = 'http://127.0.0.1:4500' + url;
      const result = await window.electronAPI.downloadFile(fullUrl, filename);
      if (result && result.ok) {
        statusEl.textContent = '✅ Yedek kaydedildi: ' + result.path;
        statusEl.style.color = 'var(--green)';
        setTimeout(async () => {
          await fetch('/api/auth/cikis', { method: 'POST' });
          localStorage.removeItem('defterdar-last-login');
          window.location.href = '/giris.html';
        }, 1500);
      } else if (result && result.canceled) {
        statusEl.textContent = 'Kaydetme iptal edildi.';
        statusEl.style.color = 'var(--yellow)';
      } else {
        throw new Error(result && result.error || 'Bilinmeyen hata');
      }
    } else {
      // Web fallback
      const r = await fetch(url);
      if (!r.ok) throw new Error('Sunucu hatası');
      const blob = await r.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      statusEl.textContent = '✅ Yedek indirildi. Çıkılıyor...';
      statusEl.style.color = 'var(--green)';
      setTimeout(async () => {
        await fetch('/api/auth/cikis', { method: 'POST' });
        localStorage.removeItem('defterdar-last-login');
        window.location.href = '/giris.html';
      }, 1500);
    }
  } catch(e) {
    statusEl.textContent = '❌ Hata: ' + e.message;
    statusEl.style.color = 'var(--red)';
  }
}

async function cikisYapsiz() {
  if (!confirm('Yedek almadan çıkmak istediğinizden emin misiniz?')) return;
  closeModal();
  await fetch('/api/auth/cikis', { method: 'POST' });
  localStorage.removeItem('defterdar-last-login');
  window.location.href = '/giris.html';
}

// Ayarlar sayfasından da değiştirilebilir
async function modalAyarlar() {
  _setupLogoData = null;
  _setupBayrakData = null;
  const logoOnizleme = _kullaniciAyarlar.logo_data
    ? '<img src="' + _kullaniciAyarlar.logo_data + '" style="max-height:70px;max-width:100%;border-radius:6px;object-fit:contain"/>'
    : '<i class="fa-solid fa-image" style="font-size:22px;color:var(--text3)"></i><div style="color:var(--text3);font-size:12px;margin-top:4px">Yüklenmedi</div>';
  const bayrakOnizleme = _kullaniciAyarlar.bayrak_data
    ? '<img src="' + _kullaniciAyarlar.bayrak_data + '" style="max-height:70px;max-width:100%;border-radius:6px;object-fit:contain"/>'
    : '<i class="fa-solid fa-flag" style="font-size:22px;color:var(--text3)"></i><div style="color:var(--text3);font-size:12px;margin-top:4px">Yüklenmedi</div>';

  openModal('Yazdırma Ayarları', `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px">
      <div class="form-group">
        <label><i class="fa-solid fa-image"></i> Logonuz</label>
        <div class="upload-zone" style="padding:16px;text-align:center;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('setup-logo-input').click()">
          <div id="setup-logo-preview">${logoOnizleme}</div>
        </div>
        <input type="file" id="setup-logo-input" accept="image/*" style="display:none" onchange="onSetupImageChange(this,'logo')"/>
      </div>
      <div class="form-group">
        <label><i class="fa-solid fa-flag"></i> Sağ Üst Bayrak</label>
        <div class="upload-zone" style="padding:16px;text-align:center;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('setup-bayrak-input').click()">
          <div id="setup-bayrak-preview">${bayrakOnizleme}</div>
        </div>
        <input type="file" id="setup-bayrak-input" accept="image/*" style="display:none" onchange="onSetupImageChange(this,'bayrak')"/>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">İptal</button>
      <button class="btn btn-primary" onclick="kurulumKaydet()"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
    </div>
  `, true, 'gear');
}

// STATE
const S = { page:'organizasyonlar', orgId:null, orgAd:'', orgYil:'' };

const KURBAN_TURLERI = ['Udhiye','Adak','Akika','Vacip','Hedy','Sukur','Kiran','Temmettu','Ceza','Ihsar','Sadaka','Nafile','Olu','Kefaret','Sifa','Hacet','Fidye','Zekat','Nesike','Vesile','Atire'];

function kurbanTuruOptions(secili) {
  return KURBAN_TURLERI.map(t => '<option value="' + t + '"' + (secili===t?' selected':'') + '>' + t + '</option>').join('');
}

// API
async function api(method, url, body) {
  const opts = { method, headers:{'Content-Type':'application/json'} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch('/api' + url, opts);
  const d = await r.json();
  if (!r.ok) throw new Error(d.hata || 'Hata oluştu');
  return d;
}

// TOAST
function toast(msg, type='success') {
  const c = document.getElementById('toast-container');
  if (!c) {
    console.warn('toast-container not found, using console:', msg);
    return;
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fa-solid fa-${type==='success'?'circle-check':'circle-xmark'}"></i> ${msg}`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// MODAL
function openModal(title, html, large=false, icon='') {
  document.getElementById('modal-title').innerHTML = `${icon?`<i class="fa-solid fa-${icon}"></i>`:''}${title}`;
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-box').className = large ? 'modal modal-lg' : 'modal';
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
function closeModalOutside(e) { if (e.target===document.getElementById('modal-overlay')) closeModal(); }

// NAV
function showPage(page) {
  S.page = page;
  document.querySelectorAll('.sidebar-item').forEach(el =>
    el.classList.toggle('active', el.dataset.page === page));
  document.getElementById('main-content').innerHTML = '';
  if (page==='organizasyonlar') renderOrganizasyonlar();
  else if (page==='kurbanlar')   renderKurbanlar();
  else if (page==='bagiscilar')  renderBagiscilar();
  else if (page==='raporlar')    renderRaporlar();
  else if (page==='cop')         renderCopKutusu();
  else if (page==='denetim')     renderDenetim();
  else if (page==='medya')       renderMedyaDeposu();
  else if (page==='pro')         renderProSayfasi();
  else if (page==='veri-yukle')  renderVeriYukle();
  else if (page==='video-isteyenler') renderVideoIsteyenler();
  else if (page==='ayarlar')     renderAyarlarSayfasi();
  else if (page==='veri-geri-yukle') renderVeriGeriYukle();
}

function setSidebarOrg(ad, yil) {
  document.getElementById('sidebar-org-name').textContent = ad || 'Organizasyon Seçilmedi';
  document.getElementById('sidebar-org-sub').textContent  = yil ? `${yil} Yılı` : 'Bir organizasyon seçin';
}

// YARDIMCI
function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function para(v) { return v ? Number(v).toLocaleString('tr-TR') + ' TL' : '-'; }

// ORGANİZASYONLAR
async function renderOrganizasyonlar() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-layer-group"></i></div>
        Organizasyonlar
      </div>
      <button class="btn btn-primary" onclick="modalYeniOrg()">
        <i class="fa-solid fa-plus"></i> Yeni Organizasyon
      </button>
    </div>
    <div class="org-grid" id="org-grid">
      <div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Yükleniyor...</p></div>
    </div>`;
  const list = await api('GET','/organizasyonlar');
  const g = document.getElementById('org-grid');
  if (!list.length) {
    g.innerHTML = `<div class="empty-state"><i class="fa-solid fa-layer-group"></i><p>Henüz organizasyon yok.</p></div>`;
    return;
  }
  g.innerHTML = list.map(o => `
    <div class="org-card" onclick="secOrg(${o.id},'${esc(o.ad)}',${o.yil})">
      <div class="org-card-name">${esc(o.ad)}</div>
      <div class="org-card-year"><i class="fa-solid fa-calendar"></i> ${o.yil} &nbsp;|&nbsp; Maks. ${o.max_kurban} Kurban</div>
      <div class="org-card-stats">
        <div class="org-card-stat"><div class="val">${o.max_kurban}</div><div class="lbl">Kapasite</div></div>
        <div class="org-card-stat"><div class="val" style="color:var(--green)">${para(o.buyukbas_hisse_fiyati)}</div><div class="lbl">Büyükbaş</div></div>
        <div class="org-card-stat"><div class="val" style="color:var(--yellow)">${para(o.kucukbas_hisse_fiyati)}</div><div class="lbl">Küçükbaş</div></div>
      </div>
      <div class="org-card-actions" onclick="event.stopPropagation()">
        <button class="btn btn-secondary btn-sm" onclick="modalDuzenleOrg(${o.id})"><i class="fa-solid fa-pen"></i> Düzenle</button>
        <button class="btn btn-danger btn-sm" onclick="silOrg(${o.id})"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function secOrg(id, ad, yil) {
  S.orgId=id; S.orgAd=ad; S.orgYil=yil;
  setSidebarOrg(ad, yil);
  showPage('kurbanlar');
}

function modalYeniOrg() {
  openModal('Yeni Organizasyon Oluştur', `
    <div class="form-grid">
      <div class="form-group" style="grid-column:1/-1">
        <label>Organizasyon Adı *</label>
        <input id="fo-ad" placeholder="Örnek: 2025 Kurban Organizasyonu"/>
      </div>
      <div class="form-group">
        <label>Yıl *</label>
        <input id="fo-yil" type="number" value="${new Date().getFullYear()}"/>
      </div>
      <div class="form-group">
        <label>Maksimum Kurban Sayısı *</label>
        <input id="fo-max" type="number" placeholder="50"/>
      </div>
      <div class="form-group">
        <label>Büyükbaş Hisse Fiyatı (TL)</label>
        <input id="fo-bb" type="number" placeholder="0"/>
      </div>
      <div class="form-group">
        <label>Küçükbaş Hisse Fiyatı (TL)</label>
        <input id="fo-kb" type="number" placeholder="0"/>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Açıklama</label>
        <textarea id="fo-aciklama" placeholder="Opsiyonel..."></textarea>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">İptal</button>
      <button class="btn btn-primary" onclick="kaydetOrg()"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
    </div>`, false, 'layer-group');
}

async function kaydetOrg() {
  const ad=document.getElementById('fo-ad').value.trim();
  const yil=parseInt(document.getElementById('fo-yil').value);
  const max_kurban=parseInt(document.getElementById('fo-max').value);
  const buyukbas_hisse_fiyati=parseFloat(document.getElementById('fo-bb').value)||0;
  const kucukbas_hisse_fiyati=parseFloat(document.getElementById('fo-kb').value)||0;
  const aciklama=document.getElementById('fo-aciklama').value.trim();
  if (!ad||!yil||!max_kurban) return toast('Zorunlu alanlar eksik','error');
  try {
    await api('POST','/organizasyonlar',{ad,yil,max_kurban,buyukbas_hisse_fiyati,kucukbas_hisse_fiyati,aciklama});
    closeModal(); toast('Organizasyon oluşturuldu'); renderOrganizasyonlar();
  } catch(e) { toast(e.message,'error'); }
}

async function modalDuzenleOrg(id) {
  const list = await api('GET','/organizasyonlar');
  const o = list.find(x=>x.id===id); if (!o) return;
  openModal('Organizasyonu Düzenle', `
    <div class="form-grid">
      <div class="form-group" style="grid-column:1/-1">
        <label>Organizasyon Adı *</label>
        <input id="fo-ad" value="${esc(o.ad)}"/>
      </div>
      <div class="form-group"><label>Yıl *</label><input id="fo-yil" type="number" value="${o.yil}"/></div>
      <div class="form-group"><label>Maks. Kurban *</label><input id="fo-max" type="number" value="${o.max_kurban}"/></div>
      <div class="form-group"><label>Büyükbaş Hisse (TL)</label><input id="fo-bb" type="number" value="${o.buyukbas_hisse_fiyati}"/></div>
      <div class="form-group"><label>Küçükbaş Hisse (TL)</label><input id="fo-kb" type="number" value="${o.kucukbas_hisse_fiyati}"/></div>
      <div class="form-group" style="grid-column:1/-1"><label>Açıklama</label><textarea id="fo-aciklama">${esc(o.aciklama||'')}</textarea></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">İptal</button>
      <button class="btn btn-primary" onclick="guncOrg(${id})"><i class="fa-solid fa-floppy-disk"></i> Güncelle</button>
    </div>`, false, 'pen');
}

async function guncOrg(id) {
  const ad=document.getElementById('fo-ad').value.trim();
  const yil=parseInt(document.getElementById('fo-yil').value);
  const max_kurban=parseInt(document.getElementById('fo-max').value);
  const buyukbas_hisse_fiyati=parseFloat(document.getElementById('fo-bb').value)||0;
  const kucukbas_hisse_fiyati=parseFloat(document.getElementById('fo-kb').value)||0;
  const aciklama=document.getElementById('fo-aciklama').value.trim();
  try {
    await api('PUT',`/organizasyonlar/${id}`,{ad,yil,max_kurban,buyukbas_hisse_fiyati,kucukbas_hisse_fiyati,aciklama});
    closeModal(); toast('Güncellendi'); renderOrganizasyonlar();
  } catch(e) { toast(e.message,'error'); }
}

async function silOrg(id) {
  if (!confirm('Bu organizasyonu silmek istediğinizden emin misiniz?')) return;
  try { await api('DELETE',`/organizasyonlar/${id}`); toast('Silindi'); renderOrganizasyonlar(); }
  catch(e) { toast(e.message,'error'); }
}
// YAZDIR FONKSİYONLARI
function yazdir(tip) {
  if (!S.orgId) return toast('Önce organizasyon seçin', 'error');
  const html = yazdirilabilirHTML(tip);
  const blob = new Blob([html], {type: 'text/html'});
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  iframe.src = url;
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 2000);
  };
}

async function yazdirKurban(kurbanId, kurbanNo, tur) {
  const hisseler = await api('GET', '/kurbanlar/' + kurbanId + '/hisseler');
  const kurbanData = _kurbanlar.find(k => k.id === kurbanId) || {};
  const html = kurbanYazdirHTML(kurbanNo, tur, hisseler, kurbanData);
  printHTML(html);
}

function yazdirilabilirHTML(tip) {
  const icerik = document.getElementById('rapor-icerik');
  const baslik = tip === 'kurbanlar' ? 'Kurban Listesi' : tip === 'bagiscilar' ? 'Bağışçı Listesi' : 'Tam Rapor';
  const printStyle = 'body{font-family:Arial,sans-serif;font-size:12px;color:#000;margin:20px}' +
    '.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;border-bottom:2px solid #1a2a50;padding-bottom:10px}' +
    '.header-left{font-size:18px;font-weight:bold;color:#1a2a50}' +
    '.header-left small{display:block;font-size:11px;color:#666;font-weight:normal}' +
    'h2{font-size:14px;color:#333;margin:16px 0 8px}' +
    'table{width:100%;border-collapse:collapse;margin-bottom:20px}' +
    'th{background:#1a2a50;color:#fff;padding:8px;text-align:left;font-size:11px}' +
    'td{padding:7px 8px;border-bottom:1px solid #ddd;font-size:11px}' +
    'tr:nth-child(even){background:#f5f5f5}' +
    '.stats{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px}' +
    '.stat{background:#f0f4ff;border:1px solid #c0d0ff;border-radius:6px;padding:10px 16px;min-width:100px}' +
    '.stat .v{font-size:22px;font-weight:bold;color:#1a2a50}.stat .l{font-size:10px;color:#666;text-transform:uppercase}' +
    '.footer{margin-top:30px;font-size:10px;color:#999;display:flex;justify-content:space-between;border-top:1px solid #ddd;padding-top:10px}' +
    '@media print{body{margin:10px}}';
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + baslik + '</title>' +
    '<style>' + printStyle + '</style></head><body>' +
    '<div class="header">' +
    '<div style="display:flex;align-items:center;gap:10px">' +
    '<img src="http://127.0.0.1:4500/icder.png" style="height:48px;object-fit:contain" onerror="this.style.display=\'none\'" />' +
    '<div class="header-left">DEFTERDAR MUHASEBE<small>' + baslik + ' — ' + new Date().toLocaleDateString('tr-TR') + '</small></div>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">' +
    '<img src="http://127.0.0.1:4500/cad.png" style="height:48px;object-fit:contain" onerror="this.style.display=\'none\'" />' +
    '<div style="font-size:12px;color:#555;text-align:right">Organizasyon: <strong>' + esc(S.orgAd) + '</strong><br>' + S.orgYil + '</div>' +
    '</div>' +
    '</div>' +
    (icerik ? icerik.innerHTML : '') +
    '<div class="footer"><span>Defterdar Muhasebe</span></div>' +
    '</body></html>';
}

function kurbanYazdirHTML(kurbanNo, tur, hisseler, kurbanData) {
  const kurbanTuru = (kurbanData && kurbanData.kurban_turu) || 'Udhiye';

  const minSatir = tur === 'buyukbas' ? 7 : 1;
  let rows = '';
  for (let i = 0; i < minSatir; i++) {
    const h = hisseler[i];
    rows += '<tr style="height:42px">';
    rows += '<td style="text-align:center;font-weight:bold;border:1.5px solid #000;padding:8px 6px;font-size:16px;width:60px">' + (i + 1) + '</td>';
    rows += '<td style="border:1.5px solid #000;padding:8px 14px;font-size:16px">' + (h && h.bagisci_adi ? h.bagisci_adi : '') + '</td>';
    rows += '<td style="border:1.5px solid #000;padding:8px 14px;font-size:16px;width:140px;text-align:center">' + kurbanTuru + '</td>';
    rows += '</tr>';
  }

  // Türk bayrağı SVG - her zaman sabit, dosyaya bağımlı değil
  const turkBayrakSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="140" height="93">
    <rect width="1200" height="800" fill="#E30A17"/>
    <circle cx="425" cy="400" r="200" fill="white"/>
    <circle cx="475" cy="400" r="160" fill="#E30A17"/>
    <polygon points="583.334,400 764.235,458.779 652.431,304.894 652.431,495.106 764.235,341.221" fill="white"/>
  </svg>`;

  const baseUrl = window.location.origin;
  const logoSrc = _kullaniciAyarlar.logo_data || (baseUrl + '/icder.png');
  const bayrakSrc = _kullaniciAyarlar.bayrak_data || '';

  const printStyle = `
    @page { margin: 12mm 15mm; size: A4; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .header-left { width: 140px; display: flex; align-items: center; }
    .header-center { flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .header-center img { height: 130px; max-width: 280px; object-fit: contain; }
    .kurban-no { font-size: 13px; color: #555; font-weight: 600; }
    .header-right { width: 140px; display: flex; align-items: center; justify-content: flex-end; }
    .header-right img { height: 93px; width: 140px; object-fit: contain; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { border: 1.5px solid #000; padding: 10px 14px; text-align: left; font-size: 16px; font-weight: bold; background: #fff; }
    td { border: 1.5px solid #000; padding: 8px 14px; font-size: 16px; }
    @media print { body { margin: 0; } }
  `;

  const bayrakImg = bayrakSrc
    ? '<img src="' + bayrakSrc + '" alt="Bayrak" style="height:93px;width:140px;object-fit:contain" onerror="this.style.visibility=\'hidden\'"/>'
    : '';

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Kurban #' + kurbanNo + '</title>' +
    '<style>' + printStyle + '</style></head><body>' +
    '<div class="header">' +
    '<div class="header-left">' + turkBayrakSVG + '</div>' +
    '<div class="header-center">' +
    '<img src="' + logoSrc + '" alt="Logo" onerror="this.style.visibility=\'hidden\'"/>' +
    '<div class="kurban-no">Kurban #' + kurbanNo + '</div>' +
    '</div>' +
    '<div class="header-right">' + bayrakImg + '</div>' +
    '</div>' +
    '<table>' +
    '<thead><tr>' +
    '<th style="width:60px;text-align:center">No</th>' +
    '<th>İsim Soyisim</th>' +
    '<th style="width:140px;text-align:center">Kurban Türü</th>' +
    '</tr></thead>' +
    '<tbody>' + rows + '</tbody>' +
    '</table>' +
    '</body></html>';
}

function yazdirBagiscilar() {
  if (!S.orgId) return toast('Önce organizasyon seçin', 'error');
  const tbody = document.getElementById('bagisci-tbody');
  if (!tbody) return toast('Bağışçı listesi yüklü değil', 'error');

  const rows = Array.from(tbody.querySelectorAll('tr')).map(tr => {
    const cells = tr.querySelectorAll('td');
    if (!cells.length) return '';
    let r = '<tr>';
    cells.forEach((td, i) => {
      if (i < cells.length - 1) r += '<td>' + td.innerText.trim() + '</td>';
    });
    r += '</tr>';
    return r;
  }).join('');

  const baseUrl = window.location.origin;
  const logoSrc = _kullaniciAyarlar.logo_data || (baseUrl + '/yazi.png');

  const printStyle = `
    @page { margin: 12mm 15mm; size: A4; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; }
    .header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 12px; }
    .header img { height: 70px; object-fit: contain; }
    .header-info { flex: 1; }
    .header-info .title { font-size: 20px; font-weight: bold; }
    .header-info .sub { font-size: 13px; color: #555; margin-top: 3px; }
    .header-right { text-align: right; font-size: 13px; color: #555; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1a2a50; color: #fff; padding: 9px 8px; text-align: left; font-size: 13px; }
    td { padding: 8px; border-bottom: 1px solid #ddd; font-size: 13px; }
    tr:nth-child(even) { background: #f5f5f5; }
    .footer { margin-top: 20px; font-size: 11px; color: #999; display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 8px; }
    @media print { body { margin: 0; } }
  `;

  const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bağışçı Listesi</title>' +
    '<style>' + printStyle + '</style></head><body>' +
    '<div class="header">' +
    '<img src="' + logoSrc + '" alt="Logo" onerror="this.style.visibility=\'hidden\'"/>' +
    '<div class="header-info">' +
    '<div class="title">' + esc(_kullaniciAdi || 'Kullanıcı') + '</div>' +
    '<div class="sub">Bağışçı Listesi — ' + new Date().toLocaleDateString('tr-TR') + '</div>' +
    '</div>' +
    '<div class="header-right">Organizasyon: <strong>' + esc(S.orgAd) + '</strong><br>' + S.orgYil + '</div>' +
    '</div>' +
    '<table><thead><tr><th>#</th><th>Bağışçı Adı</th><th>Telefon</th><th>Kimin Adına</th><th>Kurban No</th><th>Hisse</th><th>Tür</th><th>Ödeme</th><th>Video</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table>' +
    '<div class="footer"><span>Defterdar Muhasebe</span><span>' + new Date().toLocaleString('tr-TR') + '</span></div>' +
    '</body></html>';

  printHTML(html);
}

async function printHTML(html) {
  if (window.electronAPI && window.electronAPI.printHTML) {
    await window.electronAPI.printHTML(html);
  } else {
    // Web fallback: iframe ile
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none';
    document.body.appendChild(iframe);
    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    setTimeout(() => {
      try { iframe.contentWindow.print(); } catch(e) {}
      setTimeout(() => document.body.removeChild(iframe), 3000);
    }, 300);
  }
}

// TEMA TOGGLE
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('defterdar-tema', isLight ? 'light' : 'dark');
}

// Sayfa yüklenince kayıtlı temayı uygula
(function initTheme() {
  const saved = localStorage.getItem('defterdar-tema');
  if (saved === 'light') {
    document.body.classList.add('light');
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = 'fa-solid fa-sun';
  }
})();

// INIT
document.addEventListener('DOMContentLoaded', () => {
  showPage('organizasyonlar');

  // Electron kapatma öncesi yedek uyarısı
  if (window.electronAPI && window.electronAPI.onBeforeClose) {
    window.electronAPI.onBeforeClose(() => {
      modalCikisYedek();
    });
  }
});

// Basit render fonksiyonları - diğer sayfalar için
function renderKurbanlar() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-cow"></i><p>Kurban yönetimi geliştiriliyor...</p></div>';
}

function renderBagiscilar() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-users"></i><p>Bağışçı yönetimi geliştiriliyor...</p></div>';
}

function renderRaporlar() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-chart-bar"></i><p>Raporlar geliştiriliyor...</p></div>';
}

function renderCopKutusu() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-trash-can"></i><p>Çöp kutusu geliştiriliyor...</p></div>';
}

function renderDenetim() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-shield-halved"></i><p>Denetim masası geliştiriliyor...</p></div>';
}

function renderMedyaDeposu() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-photo-film"></i><p>Medya deposu geliştiriliyor...</p></div>';
}

function renderProSayfasi() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-infinity"></i><p>Pro özellikleri geliştiriliyor...</p></div>';
}

function renderVeriYukle() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-file-import"></i><p>Veri yükleme geliştiriliyor...</p></div>';
}

function renderVideoIsteyenler() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-video"></i><p>Video isteyenler geliştiriliyor...</p></div>';
}

function renderAyarlarSayfasi() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-gear"></i><p>Ayarlar geliştiriliyor...</p></div>';
}

function renderVeriGeriYukle() {
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-rotate-left"></i><p>Veri geri yükleme geliştiriliyor...</p></div>';
}