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

// KURBANLAR SAYFASI
let _kurbanlar = [];
let _kurbanFilters = { tur: '', durum: '' };

async function renderKurbanlar() {
  if (!S.orgId) {
    document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-cow"></i><p>Önce bir organizasyon seçin</p></div>';
    return;
  }

  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-cow"></i></div>
        Kurbanlar
        <span class="page-subtitle">${esc(S.orgAd)} - ${S.orgYil}</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="yazdirKurban()"><i class="fa-solid fa-print"></i> Yazdır</button>
        <button class="btn btn-primary" onclick="modalYeniKurban()"><i class="fa-solid fa-plus"></i> Kurban Ekle</button>
      </div>
    </div>
    
    <div class="filters-bar">
      <select id="kurban-tur-filter" onchange="filterKurbanlar()">
        <option value="">Tüm Türler</option>
        <option value="buyukbas">Büyükbaş</option>
        <option value="kucukbas">Küçükbaş</option>
      </select>
      <select id="kurban-durum-filter" onchange="filterKurbanlar()">
        <option value="">Tüm Durumlar</option>
        <option value="bos">Boş Kurbanlar</option>
        <option value="doldu">Dolu Kurbanlar</option>
        <option value="kesildi">Kesilmiş</option>
      </select>
      <div class="filters-info" id="kurban-stats"></div>
    </div>

    <div class="kurban-grid" id="kurban-grid">
      <div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Yükleniyor...</p></div>
    </div>`;

  await yukleKurbanlar();
}

// BAĞIŞÇILAR SAYFASI
async function renderBagiscilar() {
  if (!S.orgId) {
    document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-users"></i><p>Önce bir organizasyon seçin</p></div>';
    return;
  }

  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-users"></i></div>
        Bağışçılar
        <span class="page-subtitle">${esc(S.orgAd)} - ${S.orgYil}</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="yazdirBagiscilar()"><i class="fa-solid fa-print"></i> Yazdır</button>
        <button class="btn btn-primary" onclick="modalYeniBagisci()"><i class="fa-solid fa-plus"></i> Bağışçı Ekle</button>
      </div>
    </div>
    
    <div class="search-bar">
      <div class="search-input-wrap">
        <i class="fa-solid fa-search"></i>
        <input type="text" id="bagisci-search" placeholder="Bağışçı adı veya telefon ile ara..." onkeyup="araBagisci(this.value)"/>
      </div>
      <button class="btn btn-secondary" onclick="tumBagiscilariYukle()">Tümünü Göster</button>
    </div>

    <div class="bagisci-stats" id="bagisci-stats"></div>

    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Bağışçı Adı</th>
                <th>Telefon</th>
                <th>Kimin Adına</th>
                <th>Kurban No</th>
                <th>Hisse</th>
                <th>Tür</th>
                <th>Ödeme</th>
                <th>Video</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody id="bagisci-tbody">
              <tr><td colspan="10" class="text-center"><i class="fa-solid fa-spinner fa-spin"></i> Yükleniyor...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>`;

  await tumBagiscilariYukle();
}

// RAPORLAR SAYFASI
async function renderRaporlar() {
  if (!S.orgId) {
    document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-chart-bar"></i><p>Önce bir organizasyon seçin</p></div>';
    return;
  }

  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-chart-bar"></i></div>
        Raporlar
        <span class="page-subtitle">${esc(S.orgAd)} - ${S.orgYil}</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="yazdir('raporlar')"><i class="fa-solid fa-print"></i> Yazdır</button>
        <button class="btn btn-primary" onclick="excelIndir()"><i class="fa-solid fa-file-excel"></i> Excel İndir</button>
      </div>
    </div>

    <div id="rapor-icerik">
      <div class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Rapor hazırlanıyor...</p>
      </div>
    </div>`;

  await yukleRapor();
}

// ÇÖP KUTUSU SAYFASI
async function renderCopKutusu() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-trash-can"></i></div>
        Çöp Kutusu
        <span class="page-subtitle">Silinen öğeleri geri yükleyebilirsiniz</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-danger" onclick="bosaltCopKutusu()"><i class="fa-solid fa-trash"></i> Çöp Kutusunu Boşalt</button>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div id="cop-kutusu-icerik">
          <div class="loading-state">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Yükleniyor...</p>
          </div>
        </div>
      </div>
    </div>`;

  await yukleCopKutusu();
}

// DENETİM SAYFASI
async function renderDenetim() {
  if (!S.orgId) {
    document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-shield-halved"></i><p>Önce bir organizasyon seçin</p></div>';
    return;
  }

  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-shield-halved"></i></div>
        Denetim Masası
        <span class="page-subtitle">${esc(S.orgAd)} - ${S.orgYil}</span>
      </div>
    </div>

    <div id="denetim-icerik">
      <div class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Denetim verileri yükleniyor...</p>
      </div>
    </div>`;

  await yukleDenetimVerileri();
}

// MEDYA DEPOSU SAYFASI
async function renderMedyaDeposu() {
  if (!S.orgId) {
    document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-photo-film"></i><p>Önce bir organizasyon seçin</p></div>';
    return;
  }

  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-photo-film"></i></div>
        Medya Deposu
        <span class="page-subtitle">${esc(S.orgAd)} - ${S.orgYil}</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="modalMedyaYukle()"><i class="fa-solid fa-upload"></i> Medya Yükle</button>
      </div>
    </div>

    <div class="medya-filters">
      <select id="medya-tur-filter" onchange="filterMedya()">
        <option value="">Tüm Medya Türleri</option>
        <option value="resim">Resimler</option>
        <option value="video">Videolar</option>
      </select>
    </div>

    <div id="medya-galeri">
      <div class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Medya dosyaları yükleniyor...</p>
      </div>
    </div>`;

  await yukleMedyaGaleri();
}

// PRO SAYFASI
async function renderProSayfasi() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-infinity"></i></div>
        Pro Özellikleri
        <span class="page-subtitle">Gelişmiş özellikler ve sınırsız kullanım</span>
      </div>
    </div>

    <div class="pro-section">
      <div class="card success-card">
        <div class="card-body text-center">
          <div class="pro-icon">
            <i class="fa-solid fa-crown"></i>
          </div>
          <h2>🎉 Tebrikler!</h2>
          <p class="lead">Defterdar Muhasebe artık tamamen ücretsiz ve sınırsız!</p>
          <div class="pro-features">
            <div class="feature-item">
              <i class="fa-solid fa-check-circle"></i>
              <span>Sınırsız organizasyon</span>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-check-circle"></i>
              <span>Sınırsız kurban</span>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-check-circle"></i>
              <span>Sınırsız bağışçı</span>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-check-circle"></i>
              <span>Tüm raporlar</span>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-check-circle"></i>
              <span>Excel dışa aktarma</span>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-check-circle"></i>
              <span>Yedekleme ve geri yükleme</span>
            </div>
          </div>
          
          <div class="pro-message">
            <h3>Pro sistemi kaldırıldı!</h3>
            <p>Artık tüm özellikler herkese açık. Defterdar Muhasebe'yi sınırsız kullanabilirsiniz.</p>
          </div>
        </div>
      </div>
    </div>`;
}

// VERİ YÜKLEME SAYFASI
async function renderVeriYukle() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-file-import"></i></div>
        Veri Yükleme
        <span class="page-subtitle">Excel dosyasından veri içe aktarın</span>
      </div>
    </div>

    <div class="import-section">
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-file-excel"></i> Excel Dosyası Yükle</h3>
        </div>
        <div class="card-body">
          <div class="alert alert-info">
            <i class="fa-solid fa-info-circle"></i>
            <strong>Desteklenen Format:</strong> Excel dosyası (.xlsx) içinde "Organizasyonlar", "Kurbanlar" ve "Bağışçılar" sayfaları bulunmalıdır.
          </div>
          
          <div class="upload-area" onclick="document.getElementById('excel-file').click()">
            <div class="upload-content">
              <i class="fa-solid fa-cloud-upload-alt"></i>
              <h4>Excel Dosyası Seçin</h4>
              <p>Dosyayı buraya sürükleyin veya tıklayarak seçin</p>
            </div>
            <input type="file" id="excel-file" accept=".xlsx,.xls" style="display: none;" onchange="handleFileSelect(this)"/>
          </div>
          
          <div id="upload-status" class="upload-status"></div>
          
          <div class="form-actions">
            <button class="btn btn-primary" onclick="yukleExcelDosyasi()" disabled id="upload-btn">
              <i class="fa-solid fa-upload"></i> Yükle ve İçe Aktar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="import-help">
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-question-circle"></i> Dosya Formatı Yardımı</h3>
        </div>
        <div class="card-body">
          <div class="format-info">
            <h4>Organizasyonlar Sayfası:</h4>
            <p>Sütunlar: Ad, Yıl, Maksimum Kurban, Büyükbaş Fiyat, Küçükbaş Fiyat, Açıklama</p>
            
            <h4>Kurbanlar Sayfası:</h4>
            <p>Sütunlar: Organizasyon Adı, Organizasyon Yılı, Kurban No, Tür, Kurban Türü, Küpe No, Alış Fiyatı, Kesen Kişi</p>
            
            <h4>Bağışçılar Sayfası:</h4>
            <p>Sütunlar: Organizasyon Adı, Organizasyon Yılı, Kurban No, Hisse No, Bağışçı Adı, Telefon, Kimin Adına, Ödeme, Video</p>
          </div>
        </div>
      </div>
    </div>`;
}

// VİDEO İSTEYENLER SAYFASI
async function renderVideoIsteyenler() {
  if (!S.orgId) {
    document.getElementById('main-content').innerHTML = '<div class="empty-state"><i class="fa-solid fa-video"></i><p>Önce bir organizasyon seçin</p></div>';
    return;
  }

  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-video"></i></div>
        Video İsteyenler
        <span class="page-subtitle">${esc(S.orgAd)} - ${S.orgYil}</span>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div id="video-isteyenler-icerik">
          <div class="loading-state">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Yükleniyor...</p>
          </div>
        </div>
      </div>
    </div>`;

  await yukleVideoIsteyenler();
}

// AYARLAR SAYFASI
async function renderAyarlarSayfasi() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-gear"></i></div>
        Ayarlar
        <span class="page-subtitle">Uygulama ayarlarını yönetin</span>
      </div>
    </div>

    <div class="settings-section">
      <!-- Yazdırma Ayarları -->
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-print"></i> Yazdırma Ayarları</h3>
        </div>
        <div class="card-body">
          <div class="form-grid">
            <div class="form-group">
              <label><i class="fa-solid fa-image"></i> Logo (Orta + Bağışçı sol üst)</label>
              <div class="upload-zone" onclick="document.getElementById('ayar-logo-input').click()">
                <div id="ayar-logo-preview">
                  ${_kullaniciAyarlar.logo_data ? 
                    `<img src="${_kullaniciAyarlar.logo_data}" style="max-height:80px;max-width:100%;border-radius:6px;object-fit:contain"/>` :
                    '<i class="fa-solid fa-image" style="font-size:22px;color:var(--text3)"></i><div style="color:var(--text3);font-size:12px;margin-top:4px">Logo yükle</div>'
                  }
                </div>
              </div>
              <input type="file" id="ayar-logo-input" accept="image/*" style="display:none" onchange="onAyarImageChange(this,'logo')"/>
            </div>
            
            <div class="form-group">
              <label><i class="fa-solid fa-flag"></i> Sağ Üst Bayrak (Kurban yazdır)</label>
              <div class="upload-zone" onclick="document.getElementById('ayar-bayrak-input').click()">
                <div id="ayar-bayrak-preview">
                  ${_kullaniciAyarlar.bayrak_data ? 
                    `<img src="${_kullaniciAyarlar.bayrak_data}" style="max-height:80px;max-width:100%;border-radius:6px;object-fit:contain"/>` :
                    '<i class="fa-solid fa-flag" style="font-size:22px;color:var(--text3)"></i><div style="color:var(--text3);font-size:12px;margin-top:4px">Bayrak yükle</div>'
                  }
                </div>
              </div>
              <input type="file" id="ayar-bayrak-input" accept="image/*" style="display:none" onchange="onAyarImageChange(this,'bayrak')"/>
            </div>
          </div>
          
          <div class="alert alert-info">
            <i class="fa-solid fa-info-circle"></i>
            <strong>Kurban yazdır:</strong> Sol üst = Türk Bayrağı (sabit) | Orta = Logonuz | Sağ üst = Yüklediğiniz bayrak<br>
            <strong>Bağışçı listesi:</strong> Sol üst = Logonuz
          </div>
          
          <div class="form-actions">
            <button class="btn btn-primary" onclick="kaydetAyarlar()">
              <i class="fa-solid fa-floppy-disk"></i> Ayarları Kaydet
            </button>
          </div>
        </div>
      </div>

      <!-- Sistem Bilgileri -->
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-info-circle"></i> Sistem Bilgileri</h3>
        </div>
        <div class="card-body">
          <div id="sistem-bilgileri">
            <div class="loading-state">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <p>Sistem bilgileri yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Yedekleme -->
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-download"></i> Yedekleme</h3>
        </div>
        <div class="card-body">
          <p>Verilerinizi güvenli bir şekilde yedekleyin.</p>
          <div class="form-actions">
            <button class="btn btn-secondary" onclick="tamYedekAl()">
              <i class="fa-solid fa-download"></i> Tam Yedek Al (JSON)
            </button>
          </div>
        </div>
      </div>
    </div>`;

  await yukleSistemBilgileri();
}

// VERİ GERİ YÜKLEME SAYFASI
async function renderVeriGeriYukle() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-rotate-left"></i></div>
        Veri Geri Yükleme
        <span class="page-subtitle">Yedek dosyasından verileri geri yükleyin</span>
      </div>
    </div>

    <div class="restore-section">
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-file-import"></i> Yedek Dosyası Geri Yükle</h3>
        </div>
        <div class="card-body">
          <div class="alert alert-warning">
            <i class="fa-solid fa-exclamation-triangle"></i>
            <strong>Dikkat:</strong> Bu işlem mevcut verilerinizi etkileyebilir. Geri yükleme öncesi mevcut verilerinizi yedeklemenizi öneririz.
          </div>
          
          <div class="upload-area" onclick="document.getElementById('backup-file').click()">
            <div class="upload-content">
              <i class="fa-solid fa-cloud-upload-alt"></i>
              <h4>Yedek Dosyası Seçin</h4>
              <p>JSON formatındaki yedek dosyasını seçin</p>
            </div>
            <input type="file" id="backup-file" accept=".json" style="display: none;" onchange="handleBackupFileSelect(this)"/>
          </div>
          
          <div id="restore-status" class="upload-status"></div>
          
          <div class="form-actions">
            <button class="btn btn-danger" onclick="geriYukleYedek()" disabled id="restore-btn">
              <i class="fa-solid fa-rotate-left"></i> Geri Yükle
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="restore-help">
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-info-circle"></i> Geri Yükleme Hakkında</h3>
        </div>
        <div class="card-body">
          <div class="help-content">
            <h4>Desteklenen Dosya Formatı:</h4>
            <p>Defterdar Muhasebe tarafından oluşturulan JSON yedek dosyaları (.json)</p>
            
            <h4>Geri Yükleme Süreci:</h4>
            <ul>
              <li>Mevcut organizasyonlar güncellenir veya yeni olanlar eklenir</li>
              <li>Kurban ve bağışçı bilgileri geri yüklenir</li>
              <li>Logo ve bayrak ayarları geri yüklenir (varsa)</li>
              <li>Mevcut veriler korunur, sadece eksik olanlar eklenir</li>
            </ul>
            
            <h4>Güvenlik:</h4>
            <p>Geri yükleme işlemi mevcut verilerinizi silmez, sadece eksik verileri ekler ve mevcut olanları günceller.</p>
          </div>
        </div>
      </div>
    </div>`;
}

async function yukleKurbanlar() {
  try {
    const tur = document.getElementById('kurban-tur-filter')?.value || '';
    const durum = document.getElementById('kurban-durum-filter')?.value || '';
    _kurbanlar = await api('GET', `/organizasyonlar/${S.orgId}/kurbanlar?tur=${tur}&durum=${durum}`);
    renderKurbanGrid();
    updateKurbanStats();
  } catch(e) {
    toast(e.message, 'error');
  }
}

function renderKurbanGrid() {
  const grid = document.getElementById('kurban-grid');
  if (!_kurbanlar.length) {
    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-cow"></i><p>Kurban bulunamadı</p></div>';
    return;
  }

  grid.innerHTML = _kurbanlar.map(k => {
    const doluluk = k.toplam_hisse > 0 ? (k.dolu_hisse / k.toplam_hisse) * 100 : 0;
    const durumClass = k.kesildi ? 'kesildi' : doluluk >= 100 ? 'dolu' : doluluk > 0 ? 'kismen' : 'bos';
    const durumText = k.kesildi ? 'Kesildi' : doluluk >= 100 ? 'Dolu' : doluluk > 0 ? 'Kısmen Dolu' : 'Boş';
    
    return `
      <div class="kurban-card ${durumClass}">
        <div class="kurban-card-header">
          <div class="kurban-no">Kurban #${k.kurban_no}</div>
          <div class="kurban-tur">${k.tur === 'buyukbas' ? 'Büyükbaş' : 'Küçükbaş'}</div>
        </div>
        
        <div class="kurban-card-body">
          <div class="kurban-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${doluluk}%"></div>
            </div>
            <div class="progress-text">${k.dolu_hisse}/${k.toplam_hisse} hisse</div>
          </div>
          
          <div class="kurban-info">
            <div class="info-row">
              <span>Kurban Türü:</span>
              <span>${k.kurban_turu || 'Udhiye'}</span>
            </div>
            ${k.kupe_no ? `<div class="info-row"><span>Küpe No:</span><span>${k.kupe_no}</span></div>` : ''}
            ${k.alis_fiyati ? `<div class="info-row"><span>Alış Fiyatı:</span><span>${para(k.alis_fiyati)}</span></div>` : ''}
            ${k.kesen_kisi ? `<div class="info-row"><span>Kesen Kişi:</span><span>${k.kesen_kisi}</span></div>` : ''}
          </div>
          
          <div class="kurban-durum">
            <span class="durum-badge ${durumClass}">${durumText}</span>
            ${k.kesim_tarihi ? `<span class="kesim-tarihi">${k.kesim_tarihi}</span>` : ''}
          </div>
        </div>
        
        <div class="kurban-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="modalHisseler(${k.id}, ${k.kurban_no})">
            <i class="fa-solid fa-users"></i> Hisseler
          </button>
          <button class="btn btn-secondary btn-sm" onclick="yazdirKurban(${k.id}, ${k.kurban_no}, '${k.tur}')">
            <i class="fa-solid fa-print"></i> Yazdır
          </button>
          <button class="btn btn-secondary btn-sm" onclick="modalDuzenleKurban(${k.id})">
            <i class="fa-solid fa-pen"></i> Düzenle
          </button>
          <button class="btn btn-danger btn-sm" onclick="silKurban(${k.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>`;
  }).join('');
}

function updateKurbanStats() {
  const stats = document.getElementById('kurban-stats');
  if (!stats) return;
  
  const toplam = _kurbanlar.length;
  const buyukbas = _kurbanlar.filter(k => k.tur === 'buyukbas').length;
  const kucukbas = _kurbanlar.filter(k => k.tur === 'kucukbas').length;
  const kesildi = _kurbanlar.filter(k => k.kesildi).length;
  const dolu = _kurbanlar.filter(k => !k.kesildi && k.dolu_hisse >= k.toplam_hisse).length;
  const bos = _kurbanlar.filter(k => !k.kesildi && k.dolu_hisse < k.toplam_hisse).length;
  
  stats.innerHTML = `
    <span>Toplam: ${toplam}</span>
    <span>Büyükbaş: ${buyukbas}</span>
    <span>Küçükbaş: ${kucukbas}</span>
    <span>Kesildi: ${kesildi}</span>
    <span>Dolu: ${dolu}</span>
    <span>Boş: ${bos}</span>
  `;
}

function filterKurbanlar() {
  yukleKurbanlar();
}

function modalYeniKurban() {
  openModal('Yeni Kurban Ekle', `
    <div class="form-grid">
      <div class="form-group">
        <label>Hayvan Türü *</label>
        <select id="fk-tur" onchange="updateKurbanHisseSayisi()">
          <option value="buyukbas">Büyükbaş (7 hisse)</option>
          <option value="kucukbas">Küçükbaş (1 hisse)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Kurban Türü</label>
        <select id="fk-kurban-turu">
          ${kurbanTuruOptions('Udhiye')}
        </select>
      </div>
      <div class="form-group">
        <label>Küpe No</label>
        <input id="fk-kupe" placeholder="Opsiyonel"/>
      </div>
      <div class="form-group">
        <label>Alış Fiyatı (TL)</label>
        <input id="fk-alis" type="number" placeholder="0"/>
      </div>
      <div class="form-group">
        <label>Kesen Kişi</label>
        <input id="fk-kesen" placeholder="Opsiyonel"/>
      </div>
      <div class="form-group">
        <label>Küçükbaş Sayısı</label>
        <input id="fk-kucukbas-sayi" type="number" value="1" min="1"/>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Açıklama</label>
        <textarea id="fk-aciklama" placeholder="Opsiyonel..."></textarea>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">İptal</button>
      <button class="btn btn-primary" onclick="kaydetKurban()"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
    </div>`, false, 'cow');
}

async function kaydetKurban() {
  const tur = document.getElementById('fk-tur').value;
  const kurban_turu = document.getElementById('fk-kurban-turu').value;
  const kupe_no = document.getElementById('fk-kupe').value.trim();
  const alis_fiyati = parseFloat(document.getElementById('fk-alis').value) || 0;
  const kesen_kisi = document.getElementById('fk-kesen').value.trim();
  const kucukbas_sayi = parseInt(document.getElementById('fk-kucukbas-sayi').value) || 1;
  const aciklama = document.getElementById('fk-aciklama').value.trim();
  
  try {
    await api('POST', `/organizasyonlar/${S.orgId}/kurbanlar`, {
      tur, kurban_turu, kupe_no: kupe_no || null, alis_fiyati, 
      kesen_kisi: kesen_kisi || null, kucukbas_sayi, aciklama: aciklama || null
    });
    closeModal();
    toast('Kurban eklendi');
    yukleKurbanlar();
  } catch(e) {
    toast(e.message, 'error');
  }
}

async function modalDuzenleKurban(id) {
  const kurban = _kurbanlar.find(k => k.id === id);
  if (!kurban) return;
  
  openModal('Kurban Düzenle', `
    <div class="form-grid">
      <div class="form-group">
        <label>Kurban Türü</label>
        <select id="fk-kurban-turu">
          ${kurbanTuruOptions(kurban.kurban_turu)}
        </select>
      </div>
      <div class="form-group">
        <label>Küpe No</label>
        <input id="fk-kupe" value="${kurban.kupe_no || ''}"/>
      </div>
      <div class="form-group">
        <label>Alış Fiyatı (TL)</label>
        <input id="fk-alis" type="number" value="${kurban.alis_fiyati || 0}"/>
      </div>
      <div class="form-group">
        <label>Kesen Kişi</label>
        <input id="fk-kesen" value="${kurban.kesen_kisi || ''}"/>
      </div>
      <div class="form-group">
        <label>Kesildi mi?</label>
        <select id="fk-kesildi">
          <option value="0" ${!kurban.kesildi ? 'selected' : ''}>Hayır</option>
          <option value="1" ${kurban.kesildi ? 'selected' : ''}>Evet</option>
        </select>
      </div>
      <div class="form-group">
        <label>Kesim Tarihi</label>
        <input id="fk-kesim-tarihi" type="date" value="${kurban.kesim_tarihi || ''}"/>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Açıklama</label>
        <textarea id="fk-aciklama">${kurban.aciklama || ''}</textarea>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">İptal</button>
      <button class="btn btn-primary" onclick="guncelleKurban(${id})"><i class="fa-solid fa-floppy-disk"></i> Güncelle</button>
    </div>`, false, 'pen');
}

async function guncelleKurban(id) {
  const kurban_turu = document.getElementById('fk-kurban-turu').value;
  const kupe_no = document.getElementById('fk-kupe').value.trim();
  const alis_fiyati = parseFloat(document.getElementById('fk-alis').value) || 0;
  const kesen_kisi = document.getElementById('fk-kesen').value.trim();
  const kesildi = document.getElementById('fk-kesildi').value === '1';
  const kesim_tarihi = document.getElementById('fk-kesim-tarihi').value;
  const aciklama = document.getElementById('fk-aciklama').value.trim();
  
  try {
    await api('PUT', `/kurbanlar/${id}`, {
      kurban_turu, kupe_no: kupe_no || null, alis_fiyati, 
      kesen_kisi: kesen_kisi || null, kesildi, 
      kesim_tarihi: kesim_tarihi || null, aciklama: aciklama || null
    });
    closeModal();
    toast('Kurban güncellendi');
    yukleKurbanlar();
  } catch(e) {
    toast(e.message, 'error');
  }
}

async function silKurban(id) {
  if (!confirm('Bu kurbanı silmek istediğinizden emin misiniz?')) return;
  try {
    await api('DELETE', `/kurbanlar/${id}`);
    toast('Kurban silindi');
    yukleKurbanlar();
  } catch(e) {
    toast(e.message, 'error');
  }
}

// HİSSELER MODAL
async function modalHisseler(kurbanId, kurbanNo) {
  try {
    const hisseler = await api('GET', `/kurbanlar/${kurbanId}/hisseler`);
    const kurban = _kurbanlar.find(k => k.id === kurbanId);
    
    openModal(`Kurban #${kurbanNo} Hisseleri`, `
      <div class="hisse-grid">
        ${hisseler.map(h => `
          <div class="hisse-card ${h.bagisci_adi ? 'dolu' : 'bos'}">
            <div class="hisse-header">
              <span class="hisse-no">Hisse ${h.hisse_no}</span>
              ${h.bagisci_adi ? '<span class="hisse-durum dolu">Dolu</span>' : '<span class="hisse-durum bos">Boş</span>'}
            </div>
            <div class="hisse-body">
              ${h.bagisci_adi ? `
                <div class="hisse-info">
                  <div><strong>Bağışçı:</strong> ${h.bagisci_adi}</div>
                  ${h.bagisci_telefon ? `<div><strong>Telefon:</strong> ${h.bagisci_telefon}</div>` : ''}
                  ${h.kimin_adina ? `<div><strong>Kimin Adına:</strong> ${h.kimin_adina}</div>` : ''}
                  <div><strong>Ödeme:</strong> <span class="odeme-${h.odeme_durumu}">${h.odeme_durumu === 'odendi' ? 'Ödendi' : h.odeme_durumu === 'iptal' ? 'İptal' : 'Bekliyor'}</span></div>
                  ${h.video_ister ? '<div><strong>Video:</strong> İsteniyor</div>' : ''}
                </div>
                <div class="hisse-actions">
                  <button class="btn btn-secondary btn-sm" onclick="modalDuzenleHisse(${h.id}, ${kurbanId}, ${kurbanNo})">Düzenle</button>
                  <button class="btn btn-danger btn-sm" onclick="temizleHisse(${h.id}, ${kurbanId}, ${kurbanNo})">Temizle</button>
                </div>
              ` : `
                <div class="hisse-bos">
                  <p>Bu hisse boş</p>
                  <button class="btn btn-primary btn-sm" onclick="modalDuzenleHisse(${h.id}, ${kurbanId}, ${kurbanNo})">Bağışçı Ekle</button>
                </div>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    `, true, 'users');
  } catch(e) {
    toast(e.message, 'error');
  }
}

async function modalDuzenleHisse(hisseId, kurbanId, kurbanNo) {
  try {
    const hisseler = await api('GET', `/kurbanlar/${kurbanId}/hisseler`);
    const hisse = hisseler.find(h => h.id === hisseId);
    
    openModal(`Hisse ${hisse.hisse_no} - Kurban #${kurbanNo}`, `
      <div class="form-grid">
        <div class="form-group">
          <label>Bağışçı Adı *</label>
          <input id="fh-bagisci-adi" value="${hisse.bagisci_adi || ''}" placeholder="İsim Soyisim"/>
        </div>
        <div class="form-group">
          <label>Bağışçı Telefon</label>
          <input id="fh-bagisci-telefon" value="${hisse.bagisci_telefon || ''}" placeholder="05XX XXX XX XX"/>
        </div>
        <div class="form-group">
          <label>Kimin Adına</label>
          <input id="fh-kimin-adina" value="${hisse.kimin_adina || ''}" placeholder="Opsiyonel"/>
        </div>
        <div class="form-group">
          <label>Kimin Adına Telefon</label>
          <input id="fh-kimin-telefon" value="${hisse.kimin_adina_telefon || ''}" placeholder="Opsiyonel"/>
        </div>
        <div class="form-group">
          <label>Ödeme Durumu</label>
          <select id="fh-odeme-durumu">
            <option value="bekliyor" ${hisse.odeme_durumu === 'bekliyor' ? 'selected' : ''}>Bekliyor</option>
            <option value="odendi" ${hisse.odeme_durumu === 'odendi' ? 'selected' : ''}>Ödendi</option>
            <option value="iptal" ${hisse.odeme_durumu === 'iptal' ? 'selected' : ''}>İptal</option>
          </select>
        </div>
        <div class="form-group">
          <label>Video İster mi?</label>
          <select id="fh-video-ister">
            <option value="0" ${!hisse.video_ister ? 'selected' : ''}>Hayır</option>
            <option value="1" ${hisse.video_ister ? 'selected' : ''}>Evet</option>
          </select>
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Açıklama</label>
          <textarea id="fh-aciklama" placeholder="Opsiyonel...">${hisse.aciklama || ''}</textarea>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-secondary" onclick="closeModal()">İptal</button>
        <button class="btn btn-primary" onclick="kaydetHisse(${hisseId}, ${kurbanId}, ${kurbanNo})"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
      </div>`, false, 'user');
  } catch(e) {
    toast(e.message, 'error');
  }
}

async function kaydetHisse(hisseId, kurbanId, kurbanNo) {
  const bagisci_adi = document.getElementById('fh-bagisci-adi').value.trim();
  const bagisci_telefon = document.getElementById('fh-bagisci-telefon').value.trim();
  const kimin_adina = document.getElementById('fh-kimin-adina').value.trim();
  const kimin_adina_telefon = document.getElementById('fh-kimin-telefon').value.trim();
  const odeme_durumu = document.getElementById('fh-odeme-durumu').value;
  const video_ister = document.getElementById('fh-video-ister').value === '1';
  const aciklama = document.getElementById('fh-aciklama').value.trim();
  
  if (!bagisci_adi) {
    toast('Bağışçı adı zorunludur', 'error');
    return;
  }
  
  try {
    await api('PUT', `/hisseler/${hisseId}`, {
      bagisci_adi, bagisci_telefon: bagisci_telefon || null,
      kimin_adina: kimin_adina || null, kimin_adina_telefon: kimin_adina_telefon || null,
      odeme_durumu, video_ister, aciklama: aciklama || null
    });
    closeModal();
    toast('Hisse kaydedildi');
    yukleKurbanlar();
    modalHisseler(kurbanId, kurbanNo);
  } catch(e) {
    toast(e.message, 'error');
  }
}

async function temizleHisse(hisseId, kurbanId, kurbanNo) {
  if (!confirm('Bu hisseyi temizlemek istediğinizden emin misiniz?')) return;
  try {
    await api('DELETE', `/hisseler/${hisseId}/temizle`);
    toast('Hisse temizlendi');
    yukleKurbanlar();
    modalHisseler(kurbanId, kurbanNo);
  } catch(e) {
    toast(e.message, 'error');
  }
}
async function tumBagiscilariYukle() {
  try {
    const bagiscilar = await api('GET', `/bagiscilar/ara?orgId=${S.orgId}&tumunu=1`);
    renderBagisciTable(bagiscilar);
    updateBagisciStats(bagiscilar);
  } catch(e) {
    toast(e.message, 'error');
  }
}

async function araBagisci(query) {
  if (!query.trim()) {
    await tumBagiscilariYukle();
    return;
  }
  
  try {
    const bagiscilar = await api('GET', `/bagiscilar/ara?q=${encodeURIComponent(query)}&orgId=${S.orgId}`);
    renderBagisciTable(bagiscilar);
    updateBagisciStats(bagiscilar);
  } catch(e) {
    toast(e.message, 'error');
  }
}

function renderBagisciTable(bagiscilar) {
  const tbody = document.getElementById('bagisci-tbody');
  if (!bagiscilar.length) {
    tbody.innerHTML = '<tr><td colspan="10" class="text-center">Bağışçı bulunamadı</td></tr>';
    return;
  }

  tbody.innerHTML = bagiscilar.map((b, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${esc(b.bagisci_adi)}</strong></td>
      <td>${b.bagisci_telefon || '-'}</td>
      <td>${b.kimin_adina || '-'}</td>
      <td><span class="kurban-no-badge">#${b.kurban_no}</span></td>
      <td>${b.hisse_no}</td>
      <td><span class="tur-badge ${b.tur}">${b.tur === 'buyukbas' ? 'Büyükbaş' : 'Küçükbaş'}</span></td>
      <td><span class="odeme-badge ${b.odeme_durumu}">${b.odeme_durumu === 'odendi' ? 'Ödendi' : b.odeme_durumu === 'iptal' ? 'İptal' : 'Bekliyor'}</span></td>
      <td>${b.video_ister ? '<i class="fa-solid fa-video text-primary"></i>' : '-'}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-secondary btn-sm" onclick="modalDuzenleBagisci(${b.id}, ${b.kurban_id})">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="silBagisci(${b.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateBagisciStats(bagiscilar) {
  const stats = document.getElementById('bagisci-stats');
  if (!stats) return;
  
  const toplam = bagiscilar.length;
  const odendi = bagiscilar.filter(b => b.odeme_durumu === 'odendi').length;
  const bekliyor = bagiscilar.filter(b => b.odeme_durumu === 'bekliyor').length;
  const iptal = bagiscilar.filter(b => b.odeme_durumu === 'iptal').length;
  const video = bagiscilar.filter(b => b.video_ister).length;
  
  stats.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${toplam}</div>
        <div class="stat-label">Toplam Bağışçı</div>
      </div>
      <div class="stat-card success">
        <div class="stat-value">${odendi}</div>
        <div class="stat-label">Ödendi</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-value">${bekliyor}</div>
        <div class="stat-label">Bekliyor</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-value">${iptal}</div>
        <div class="stat-label">İptal</div>
      </div>
      <div class="stat-card info">
        <div class="stat-value">${video}</div>
        <div class="stat-label">Video İsteyen</div>
      </div>
    </div>
  `;
}

function modalYeniBagisci() {
  openModal('Yeni Bağışçı Ekle', `
    <div class="alert alert-info">
      <i class="fa-solid fa-info-circle"></i>
      Yeni bağışçı eklemek için önce kurban oluşturup hisse ataması yapmanız gerekir.
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Tamam</button>
      <button class="btn btn-primary" onclick="closeModal(); showPage('kurbanlar')">Kurban Sayfasına Git</button>
    </div>`, false, 'info');
}

async function modalDuzenleBagisci(hisseId, kurbanId) {
  try {
    const hisseler = await api('GET', `/kurbanlar/${kurbanId}/hisseler`);
    const hisse = hisseler.find(h => h.id === hisseId);
    const kurban = _kurbanlar.find(k => k.id === kurbanId) || {};
    
    openModal(`Bağışçı Düzenle - Kurban #${kurban.kurban_no || '?'}`, `
      <div class="form-grid">
        <div class="form-group">
          <label>Bağışçı Adı *</label>
          <input id="fb-bagisci-adi" value="${hisse.bagisci_adi || ''}" placeholder="İsim Soyisim"/>
        </div>
        <div class="form-group">
          <label>Bağışçı Telefon</label>
          <input id="fb-bagisci-telefon" value="${hisse.bagisci_telefon || ''}" placeholder="05XX XXX XX XX"/>
        </div>
        <div class="form-group">
          <label>Kimin Adına</label>
          <input id="fb-kimin-adina" value="${hisse.kimin_adina || ''}" placeholder="Opsiyonel"/>
        </div>
        <div class="form-group">
          <label>Kimin Adına Telefon</label>
          <input id="fb-kimin-telefon" value="${hisse.kimin_adina_telefon || ''}" placeholder="Opsiyonel"/>
        </div>
        <div class="form-group">
          <label>Ödeme Durumu</label>
          <select id="fb-odeme-durumu">
            <option value="bekliyor" ${hisse.odeme_durumu === 'bekliyor' ? 'selected' : ''}>Bekliyor</option>
            <option value="odendi" ${hisse.odeme_durumu === 'odendi' ? 'selected' : ''}>Ödendi</option>
            <option value="iptal" ${hisse.odeme_durumu === 'iptal' ? 'selected' : ''}>İptal</option>
          </select>
        </div>
        <div class="form-group">
          <label>Video İster mi?</label>
          <select id="fb-video-ister">
            <option value="0" ${!hisse.video_ister ? 'selected' : ''}>Hayır</option>
            <option value="1" ${hisse.video_ister ? 'selected' : ''}>Evet</option>
          </select>
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Açıklama</label>
          <textarea id="fb-aciklama" placeholder="Opsiyonel...">${hisse.aciklama || ''}</textarea>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-secondary" onclick="closeModal()">İptal</button>
        <button class="btn btn-primary" onclick="kaydetBagisciDuzenle(${hisseId})"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
      </div>`, false, 'user-edit');
  } catch(e) {
    toast(e.message, 'error');
  }
}

async function kaydetBagisciDuzenle(hisseId) {
  const bagisci_adi = document.getElementById('fb-bagisci-adi').value.trim();
  const bagisci_telefon = document.getElementById('fb-bagisci-telefon').value.trim();
  const kimin_adina = document.getElementById('fb-kimin-adina').value.trim();
  const kimin_adina_telefon = document.getElementById('fb-kimin-telefon').value.trim();
  const odeme_durumu = document.getElementById('fb-odeme-durumu').value;
  const video_ister = document.getElementById('fb-video-ister').value === '1';
  const aciklama = document.getElementById('fb-aciklama').value.trim();
  
  if (!bagisci_adi) {
    toast('Bağışçı adı zorunludur', 'error');
    return;
  }
  
  try {
    await api('PUT', `/hisseler/${hisseId}`, {
      bagisci_adi, bagisci_telefon: bagisci_telefon || null,
      kimin_adina: kimin_adina || null, kimin_adina_telefon: kimin_adina_telefon || null,
      odeme_durumu, video_ister, aciklama: aciklama || null
    });
    closeModal();
    toast('Bağışçı güncellendi');
    tumBagiscilariYukle();
  } catch(e) {
    toast(e.message, 'error');
  }
}

async function silBagisci(hisseId) {
  if (!confirm('Bu bağışçıyı silmek istediğinizden emin misiniz?')) return;
  try {
    await api('DELETE', `/hisseler/${hisseId}/temizle`);
    toast('Bağışçı silindi');
    tumBagiscilariYukle();
  } catch(e) {
    toast(e.message, 'error');
  }
}
async function yukleRapor() {
  try {
    const rapor = await api('GET', `/organizasyonlar/${S.orgId}/rapor`);
    renderRaporIcerik(rapor);
  } catch(e) {
    document.getElementById('rapor-icerik').innerHTML = `
      <div class="error-state">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <p>Rapor yüklenirken hata oluştu: ${e.message}</p>
      </div>`;
  }
}

function renderRaporIcerik(rapor) {
  const { org, kurbanlar, hisseler, ozet } = rapor;
  
  document.getElementById('rapor-icerik').innerHTML = `
    <!-- Özet İstatistikler -->
    <div class="stats-section">
      <h2><i class="fa-solid fa-chart-pie"></i> Genel Özet</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-cow"></i></div>
          <div class="stat-content">
            <div class="stat-value">${ozet.toplam_kurban}</div>
            <div class="stat-label">Toplam Kurban</div>
            <div class="stat-detail">Büyükbaş: ${ozet.buyukbas} • Küçükbaş: ${ozet.kucukbas}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-chart-line"></i></div>
          <div class="stat-content">
            <div class="stat-value">${ozet.dolu_hisse}/${ozet.toplam_hisse}</div>
            <div class="stat-label">Hisse Doluluk</div>
            <div class="stat-detail">Boş: ${ozet.bos_hisse} hisse</div>
          </div>
        </div>
        
        <div class="stat-card success">
          <div class="stat-icon"><i class="fa-solid fa-money-bill-wave"></i></div>
          <div class="stat-content">
            <div class="stat-value">${para(ozet.toplam_gelir)}</div>
            <div class="stat-label">Toplam Gelir</div>
            <div class="stat-detail">Ödenen: ${ozet.odendi} • Bekleyen: ${ozet.bekliyor}</div>
          </div>
        </div>
        
        <div class="stat-card warning">
          <div class="stat-icon"><i class="fa-solid fa-scissors"></i></div>
          <div class="stat-content">
            <div class="stat-value">${ozet.kesildi}</div>
            <div class="stat-label">Kesilmiş Kurban</div>
            <div class="stat-detail">${((ozet.kesildi / ozet.toplam_kurban) * 100).toFixed(1)}% tamamlandı</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Kurban Listesi -->
    <div class="report-section">
      <h2><i class="fa-solid fa-list"></i> Kurban Listesi</h2>
      <div class="table-responsive">
        <table class="report-table">
          <thead>
            <tr>
              <th>Kurban No</th>
              <th>Tür</th>
              <th>Kurban Türü</th>
              <th>Küpe No</th>
              <th>Alış Fiyatı</th>
              <th>Hisse Durumu</th>
              <th>Kesim Durumu</th>
              <th>Kesen Kişi</th>
            </tr>
          </thead>
          <tbody>
            ${kurbanlar.map(k => `
              <tr>
                <td><strong>#${k.kurban_no}</strong></td>
                <td><span class="tur-badge ${k.tur}">${k.tur === 'buyukbas' ? 'Büyükbaş' : 'Küçükbaş'}</span></td>
                <td>${k.kurban_turu || 'Udhiye'}</td>
                <td>${k.kupe_no || '-'}</td>
                <td>${para(k.alis_fiyati)}</td>
                <td>
                  <div class="hisse-progress">
                    <span>${k.dolu_hisse}/${k.toplam_hisse}</span>
                    <div class="progress-bar-mini">
                      <div class="progress-fill" style="width: ${(k.dolu_hisse / k.toplam_hisse) * 100}%"></div>
                    </div>
                  </div>
                </td>
                <td><span class="durum-badge ${k.kesildi ? 'kesildi' : 'bekliyor'}">${k.kesildi ? 'Kesildi' : 'Bekliyor'}</span></td>
                <td>${k.kesen_kisi || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bağışçı Listesi -->
    <div class="report-section">
      <h2><i class="fa-solid fa-users"></i> Bağışçı Listesi</h2>
      <div class="table-responsive">
        <table class="report-table">
          <thead>
            <tr>
              <th>Bağışçı Adı</th>
              <th>Telefon</th>
              <th>Kimin Adına</th>
              <th>Kurban No</th>
              <th>Hisse</th>
              <th>Tür</th>
              <th>Ödeme</th>
              <th>Video</th>
            </tr>
          </thead>
          <tbody>
            ${hisseler.map(h => `
              <tr>
                <td><strong>${esc(h.bagisci_adi)}</strong></td>
                <td>${h.bagisci_telefon || '-'}</td>
                <td>${h.kimin_adina || '-'}</td>
                <td><span class="kurban-no-badge">#${h.kurban_no}</span></td>
                <td>${h.hisse_no}</td>
                <td><span class="tur-badge ${h.tur}">${h.tur === 'buyukbas' ? 'Büyükbaş' : 'Küçükbaş'}</span></td>
                <td><span class="odeme-badge ${h.odeme_durumu}">${h.odeme_durumu === 'odendi' ? 'Ödendi' : h.odeme_durumu === 'iptal' ? 'İptal' : 'Bekliyor'}</span></td>
                <td>${h.video_ister ? '<i class="fa-solid fa-video text-primary"></i>' : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Ödeme Durumu Analizi -->
    <div class="report-section">
      <h2><i class="fa-solid fa-credit-card"></i> Ödeme Analizi</h2>
      <div class="payment-analysis">
        <div class="payment-stats">
          <div class="payment-stat success">
            <div class="payment-count">${ozet.odendi}</div>
            <div class="payment-label">Ödenen Hisse</div>
          </div>
          <div class="payment-stat warning">
            <div class="payment-count">${ozet.bekliyor}</div>
            <div class="payment-label">Bekleyen Hisse</div>
          </div>
          <div class="payment-stat info">
            <div class="payment-count">${hisseler.filter(h => h.video_ister).length}</div>
            <div class="payment-label">Video İsteyen</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function excelIndir() {
  if (!S.orgId) {
    toast('Önce organizasyon seçin', 'error');
    return;
  }
  
  try {
    const url = `/api/organizasyonlar/${S.orgId}/excel`;
    
    if (window.electronAPI && window.electronAPI.downloadFile) {
      const fullUrl = 'http://127.0.0.1:4500' + url;
      const filename = `defterdar-rapor-${S.orgAd}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      const result = await window.electronAPI.downloadFile(fullUrl, filename);
      if (result && result.ok) {
        toast('Excel dosyası kaydedildi: ' + result.path);
      } else if (result && result.canceled) {
        toast('Kaydetme iptal edildi', 'warning');
      } else {
        throw new Error(result && result.error || 'Bilinmeyen hata');
      }
    } else {
      // Web fallback
      const a = document.createElement('a');
      a.href = url;
      a.download = `defterdar-rapor-${S.orgAd}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast('Excel dosyası indiriliyor...');
    }
  } catch(e) {
    toast('Excel indirme hatası: ' + e.message, 'error');
  }
}
async function yukleCopKutusu() {
  try {
    const items = await api('GET', '/cop-kutusu');
    renderCopKutusuIcerik(items);
  } catch(e) {
    document.getElementById('cop-kutusu-icerik').innerHTML = `
      <div class="error-state">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <p>Çöp kutusu yüklenirken hata: ${e.message}</p>
      </div>`;
  }
}

function renderCopKutusuIcerik(items) {
  const icerik = document.getElementById('cop-kutusu-icerik');
  
  if (!items.length) {
    icerik.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-trash-can"></i>
        <p>Çöp kutusu boş</p>
      </div>`;
    return;
  }

  icerik.innerHTML = `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tür</th>
            <th>Başlık</th>
            <th>Silinme Tarihi</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>
                <span class="tur-badge ${item.tur}">
                  <i class="fa-solid fa-${item.tur === 'organizasyon' ? 'layer-group' : 'cow'}"></i>
                  ${item.tur === 'organizasyon' ? 'Organizasyon' : 'Kurban'}
                </span>
              </td>
              <td><strong>${esc(item.baslik)}</strong></td>
              <td>${new Date(item.silme_tarihi).toLocaleString('tr-TR')}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-success btn-sm" onclick="geriYukle(${item.id})">
                    <i class="fa-solid fa-rotate-left"></i> Geri Yükle
                  </button>
                  <button class="btn btn-danger btn-sm" onclick="kaliciSil(${item.id})">
                    <i class="fa-solid fa-trash"></i> Kalıcı Sil
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

async function geriYukle(id) {
  if (!confirm('Bu öğeyi geri yüklemek istediğinizden emin misiniz?')) return;
  
  try {
    await api('POST', `/cop-kutusu/${id}/geri-yukle`);
    toast('Öğe geri yüklendi');
    yukleCopKutusu();
    // Organizasyonlar sayfasını yenile
    if (S.page === 'organizasyonlar') {
      renderOrganizasyonlar();
    }
  } catch(e) {
    toast('Geri yükleme hatası: ' + e.message, 'error');
  }
}

async function kaliciSil(id) {
  if (!confirm('Bu öğeyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) return;
  
  try {
    await api('DELETE', `/cop-kutusu/${id}`);
    toast('Öğe kalıcı olarak silindi');
    yukleCopKutusu();
  } catch(e) {
    toast('Silme hatası: ' + e.message, 'error');
  }
}

async function bosaltCopKutusu() {
  if (!confirm('Çöp kutusundaki tüm öğeleri kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) return;
  
  try {
    await api('DELETE', '/cop-kutusu');
    toast('Çöp kutusu boşaltıldı');
    yukleCopKutusu();
  } catch(e) {
    toast('Boşaltma hatası: ' + e.message, 'error');
  }
}
async function yukleVideoIsteyenler() {
  try {
    const videoIsteyenler = await api('GET', `/organizasyonlar/${S.orgId}/video-isteyenler`);
    renderVideoIsteyenlerIcerik(videoIsteyenler);
  } catch(e) {
    document.getElementById('video-isteyenler-icerik').innerHTML = `
      <div class="error-state">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <p>Video isteyenler yüklenirken hata: ${e.message}</p>
      </div>`;
  }
}

function renderVideoIsteyenlerIcerik(videoIsteyenler) {
  const icerik = document.getElementById('video-isteyenler-icerik');
  
  if (!videoIsteyenler.length) {
    icerik.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-video"></i>
        <p>Video isteyen bağışçı bulunmuyor</p>
      </div>`;
    return;
  }

  icerik.innerHTML = `
    <div class="video-stats">
      <div class="stat-card info">
        <div class="stat-value">${videoIsteyenler.length}</div>
        <div class="stat-label">Video İsteyen</div>
      </div>
      <div class="stat-card success">
        <div class="stat-value">${videoIsteyenler.filter(v => v.video_url).length}</div>
        <div class="stat-label">Video Yüklendi</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-value">${videoIsteyenler.filter(v => !v.video_url).length}</div>
        <div class="stat-label">Video Bekleniyor</div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Kurban No</th>
            <th>Hisse</th>
            <th>Bağışçı</th>
            <th>Telefon</th>
            <th>Tür</th>
            <th>Kurban Türü</th>
            <th>Video Durumu</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          ${videoIsteyenler.map(v => `
            <tr>
              <td><span class="kurban-no-badge">#${v.kurban_no}</span></td>
              <td>${v.hisse_no}</td>
              <td><strong>${esc(v.bagisci_adi)}</strong></td>
              <td>${v.bagisci_telefon || '-'}</td>
              <td><span class="tur-badge ${v.tur}">${v.tur === 'buyukbas' ? 'Büyükbaş' : 'Küçükbaş'}</span></td>
              <td>${v.kurban_turu || 'Udhiye'}</td>
              <td>
                ${v.video_url ? 
                  '<span class="video-badge uploaded"><i class="fa-solid fa-check"></i> Yüklendi</span>' : 
                  '<span class="video-badge pending"><i class="fa-solid fa-clock"></i> Bekleniyor</span>'
                }
              </td>
              <td>
                <div class="action-buttons">
                  ${v.video_url ? 
                    `<button class="btn btn-primary btn-sm" onclick="videoGoster('${v.video_url}')">
                      <i class="fa-solid fa-play"></i> İzle
                    </button>` : 
                    `<button class="btn btn-secondary btn-sm" onclick="videoYukle(${v.id})">
                      <i class="fa-solid fa-upload"></i> Yükle
                    </button>`
                  }
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function videoGoster(videoUrl) {
  openModal('Video İzle', `
    <div class="video-container">
      <video controls style="width: 100%; max-height: 400px; border-radius: 8px;">
        <source src="${videoUrl}" type="video/mp4">
        Tarayıcınız video oynatmayı desteklemiyor.
      </video>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" onclick="closeModal()">Kapat</button>
    </div>`, true, 'play');
}

function videoYukle(hisseId) {
  openModal('Video Yükle', `
    <div class="form-group">
      <label>Video Dosyası Seç</label>
      <input type="file" id="video-file" accept="video/*" />
      <small class="form-text">Maksimum dosya boyutu: 50MB</small>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">İptal</button>
      <button class="btn btn-primary" onclick="kaydetVideo(${hisseId})">
        <i class="fa-solid fa-upload"></i> Yükle
      </button>
    </div>`, false, 'upload');
}

async function kaydetVideo(hisseId) {
  const fileInput = document.getElementById('video-file');
  const file = fileInput.files[0];
  
  if (!file) {
    toast('Lütfen bir video dosyası seçin', 'error');
    return;
  }
  
  if (file.size > 50 * 1024 * 1024) { // 50MB
    toast('Dosya boyutu 50MB\'dan büyük olamaz', 'error');
    return;
  }
  
  const formData = new FormData();
  formData.append('video', file);
  
  try {
    // Video yükleme API'si henüz implement edilmemiş
    // Şimdilik sadece mesaj göster
    toast('Video yükleme özelliği yakında eklenecek', 'warning');
    closeModal();
  } catch(e) {
    toast('Video yükleme hatası: ' + e.message, 'error');
  }
}
function handleFileSelect(input) {
  const file = input.files[0];
  const status = document.getElementById('upload-status');
  const uploadBtn = document.getElementById('upload-btn');
  
  if (file) {
    status.innerHTML = `
      <div class="file-info">
        <i class="fa-solid fa-file-excel"></i>
        <span><strong>${file.name}</strong> (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
      </div>`;
    uploadBtn.disabled = false;
  } else {
    status.innerHTML = '';
    uploadBtn.disabled = true;
  }
}

async function yukleExcelDosyasi() {
  const fileInput = document.getElementById('excel-file');
  const file = fileInput.files[0];
  const status = document.getElementById('upload-status');
  
  if (!file) {
    toast('Lütfen bir dosya seçin', 'error');
    return;
  }
  
  const formData = new FormData();
  formData.append('dosya', file);
  
  status.innerHTML = `
    <div class="upload-progress">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>Dosya yükleniyor ve işleniyor...</span>
    </div>`;
  
  try {
    const response = await fetch('/api/veri-yukle', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      status.innerHTML = `
        <div class="upload-success">
          <i class="fa-solid fa-check-circle"></i>
          <span>${result.mesaj}</span>
        </div>`;
      
      if (result.detay && result.detay.errors && result.detay.errors.length > 0) {
        status.innerHTML += `
          <div class="upload-warnings">
            <h5>Uyarılar:</h5>
            <ul>
              ${result.detay.errors.map(err => `<li>${err}</li>`).join('')}
            </ul>
          </div>`;
      }
      
      toast('Veri başarıyla yüklendi');
      
      // Organizasyonlar sayfasını yenile
      if (S.page === 'organizasyonlar') {
        renderOrganizasyonlar();
      }
    } else {
      throw new Error(result.hata || 'Yükleme hatası');
    }
  } catch(e) {
    status.innerHTML = `
      <div class="upload-error">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <span>Hata: ${e.message}</span>
      </div>`;
    toast('Veri yükleme hatası: ' + e.message, 'error');
  }
}
function handleBackupFileSelect(input) {
  const file = input.files[0];
  const status = document.getElementById('restore-status');
  const restoreBtn = document.getElementById('restore-btn');
  
  if (file) {
    if (!file.name.endsWith('.json')) {
      status.innerHTML = `
        <div class="upload-error">
          <i class="fa-solid fa-exclamation-triangle"></i>
          <span>Lütfen JSON formatında bir yedek dosyası seçin</span>
        </div>`;
      restoreBtn.disabled = true;
      return;
    }
    
    status.innerHTML = `
      <div class="file-info">
        <i class="fa-solid fa-file-code"></i>
        <span><strong>${file.name}</strong> (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
      </div>`;
    restoreBtn.disabled = false;
  } else {
    status.innerHTML = '';
    restoreBtn.disabled = true;
  }
}

async function geriYukleYedek() {
  const fileInput = document.getElementById('backup-file');
  const file = fileInput.files[0];
  const status = document.getElementById('restore-status');
  
  if (!file) {
    toast('Lütfen bir yedek dosyası seçin', 'error');
    return;
  }
  
  if (!confirm('Yedek dosyasını geri yüklemek istediğinizden emin misiniz? Bu işlem mevcut verilerinizi etkileyebilir.')) {
    return;
  }
  
  const formData = new FormData();
  formData.append('dosya', file);
  
  status.innerHTML = `
    <div class="upload-progress">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>Yedek dosyası geri yükleniyor...</span>
    </div>`;
  
  try {
    const response = await fetch('/api/tam-geri-yukle', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      status.innerHTML = `
        <div class="upload-success">
          <i class="fa-solid fa-check-circle"></i>
          <span>${result.mesaj}</span>
        </div>`;
      
      toast('Yedek başarıyla geri yüklendi');
      
      // Kullanıcı ayarlarını yenile
      await yukleKullaniciAyarlar();
      
      // Organizasyonlar sayfasını yenile
      if (S.page === 'organizasyonlar') {
        renderOrganizasyonlar();
      }
    } else {
      throw new Error(result.hata || 'Geri yükleme hatası');
    }
  } catch(e) {
    status.innerHTML = `
      <div class="upload-error">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <span>Hata: ${e.message}</span>
      </div>`;
    toast('Geri yükleme hatası: ' + e.message, 'error');
  }
}
let _ayarLogoData = null;
let _ayarBayrakData = null;

function onAyarImageChange(input, tip) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    if (tip === 'logo') {
      _ayarLogoData = data;
      document.getElementById('ayar-logo-preview').innerHTML =
        '<img src="' + data + '" style="max-height:80px;max-width:100%;border-radius:6px;object-fit:contain"/>';
    } else {
      _ayarBayrakData = data;
      document.getElementById('ayar-bayrak-preview').innerHTML =
        '<img src="' + data + '" style="max-height:80px;max-width:100%;border-radius:6px;object-fit:contain"/>';
    }
  };
  reader.readAsDataURL(file);
}

async function kaydetAyarlar() {
  try {
    const logo = _ayarLogoData || _kullaniciAyarlar.logo_data;
    const bayrak = _ayarBayrakData || _kullaniciAyarlar.bayrak_data;
    
    await api('POST', '/ayarlar', { 
      logo_data: logo, 
      bayrak_data: bayrak, 
      kurulum_tamamlandi: 1 
    });
    
    _kullaniciAyarlar.logo_data = logo;
    _kullaniciAyarlar.bayrak_data = bayrak;
    _kullaniciAyarlar.kurulum_tamamlandi = 1;
    
    toast('Ayarlar kaydedildi');
  } catch(e) {
    toast(e.message, 'error');
  }
}

async function yukleSistemBilgileri() {
  try {
    const sistemIP = await api('GET', '/sistem/ip');
    const sistemBilgileri = document.getElementById('sistem-bilgileri');
    
    sistemBilgileri.innerHTML = `
      <div class="sistem-info">
        <div class="info-row">
          <span><i class="fa-solid fa-desktop"></i> Uygulama:</span>
          <span>Defterdar Muhasebe v2.3.0</span>
        </div>
        <div class="info-row">
          <span><i class="fa-solid fa-user"></i> Kullanıcı:</span>
          <span>${_kullaniciAdi}</span>
        </div>
        <div class="info-row">
          <span><i class="fa-solid fa-network-wired"></i> IP Adresleri:</span>
          <span>${sistemIP.ips.map(ip => ip.ip || ip).join(', ')}</span>
        </div>
        <div class="info-row">
          <span><i class="fa-solid fa-calendar"></i> Kurulum Durumu:</span>
          <span>${_kullaniciAyarlar.kurulum_tamamlandi ? 'Tamamlandı' : 'Bekliyor'}</span>
        </div>
      </div>`;
  } catch(e) {
    document.getElementById('sistem-bilgileri').innerHTML = `
      <div class="error-state">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <p>Sistem bilgileri yüklenemedi</p>
      </div>`;
  }
}

async function tamYedekAl() {
  try {
    const url = '/api/tam-yedek';
    const tarih = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = 'defterdar-tam-yedek-' + tarih + '.json';
    
    if (window.electronAPI && window.electronAPI.downloadFile) {
      const fullUrl = 'http://127.0.0.1:4500' + url;
      const result = await window.electronAPI.downloadFile(fullUrl, filename);
      if (result && result.ok) {
        toast('Yedek kaydedildi: ' + result.path);
      } else if (result && result.canceled) {
        toast('Kaydetme iptal edildi', 'warning');
      } else {
        throw new Error(result && result.error || 'Bilinmeyen hata');
      }
    } else {
      // Web fallback
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast('Yedek indiriliyor...');
    }
  } catch(e) {
    toast('Yedek alma hatası: ' + e.message, 'error');
  }
}
async function yukleDenetimVerileri() {
  try {
    const dashboard = await api('GET', `/organizasyonlar/${S.orgId}/dashboard`);
    renderDenetimIcerik(dashboard);
  } catch(e) {
    document.getElementById('denetim-icerik').innerHTML = `
      <div class="error-state">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <p>Denetim verileri yüklenirken hata: ${e.message}</p>
      </div>`;
  }
}

function renderDenetimIcerik(dashboard) {
  const icerik = document.getElementById('denetim-icerik');
  
  // Yüzdeler hesapla
  const hisseDoluluk = dashboard.toplam_hisse > 0 ? (dashboard.dolu_hisse / dashboard.toplam_hisse) * 100 : 0;
  const kesimOrani = dashboard.toplam_kurban > 0 ? (dashboard.kesildi / dashboard.toplam_kurban) * 100 : 0;
  
  icerik.innerHTML = `
    <!-- Genel Durum -->
    <div class="dashboard-section">
      <h2><i class="fa-solid fa-tachometer-alt"></i> Genel Durum</h2>
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="card-icon success">
            <i class="fa-solid fa-cow"></i>
          </div>
          <div class="card-content">
            <div class="card-value">${dashboard.toplam_kurban}</div>
            <div class="card-label">Toplam Kurban</div>
            <div class="card-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 100%"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-card">
          <div class="card-icon info">
            <i class="fa-solid fa-chart-pie"></i>
          </div>
          <div class="card-content">
            <div class="card-value">${dashboard.dolu_hisse}/${dashboard.toplam_hisse}</div>
            <div class="card-label">Hisse Doluluk</div>
            <div class="card-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${hisseDoluluk}%"></div>
              </div>
              <span class="progress-text">${hisseDoluluk.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div class="dashboard-card">
          <div class="card-icon warning">
            <i class="fa-solid fa-scissors"></i>
          </div>
          <div class="card-content">
            <div class="card-value">${dashboard.kesildi}</div>
            <div class="card-label">Kesilmiş Kurban</div>
            <div class="card-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${kesimOrani}%"></div>
              </div>
              <span class="progress-text">${kesimOrani.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div class="dashboard-card">
          <div class="card-icon ${dashboard.bos_hisse > 0 ? 'danger' : 'success'}">
            <i class="fa-solid fa-exclamation-triangle"></i>
          </div>
          <div class="card-content">
            <div class="card-value">${dashboard.bos_hisse}</div>
            <div class="card-label">Boş Hisse</div>
            <div class="card-status ${dashboard.bos_hisse > 0 ? 'warning' : 'success'}">
              ${dashboard.bos_hisse > 0 ? 'Dikkat Gerekli' : 'Tamamlandı'}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Kurban Durumu -->
    <div class="dashboard-section">
      <h2><i class="fa-solid fa-list-check"></i> Kurban Durumu</h2>
      <div class="status-grid">
        <div class="status-card success">
          <div class="status-icon">
            <i class="fa-solid fa-check-circle"></i>
          </div>
          <div class="status-content">
            <div class="status-value">${dashboard.doldu_kurban}</div>
            <div class="status-label">Dolu Kurban</div>
            <div class="status-desc">Satışı tamamlanan kurbanlar</div>
          </div>
        </div>
        
        <div class="status-card warning">
          <div class="status-icon">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="status-content">
            <div class="status-value">${dashboard.bos_kurban}</div>
            <div class="status-label">Boş Kurban</div>
            <div class="status-desc">Hisse satışı devam eden kurbanlar</div>
          </div>
        </div>
        
        <div class="status-card info">
          <div class="status-icon">
            <i class="fa-solid fa-scissors"></i>
          </div>
          <div class="status-content">
            <div class="status-value">${dashboard.kesildi}</div>
            <div class="status-label">Kesilmiş</div>
            <div class="status-desc">Kesimi tamamlanan kurbanlar</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Uyarılar ve Öneriler -->
    <div class="dashboard-section">
      <h2><i class="fa-solid fa-bell"></i> Uyarılar ve Öneriler</h2>
      <div class="alerts-container">
        ${dashboard.bos_hisse > 0 ? `
          <div class="alert alert-warning">
            <i class="fa-solid fa-exclamation-triangle"></i>
            <div>
              <strong>Boş Hisse Uyarısı:</strong>
              <p>${dashboard.bos_hisse} adet boş hisse bulunuyor. Satış çalışmalarını hızlandırmanız önerilir.</p>
            </div>
          </div>
        ` : `
          <div class="alert alert-success">
            <i class="fa-solid fa-check-circle"></i>
            <div>
              <strong>Tebrikler!</strong>
              <p>Tüm hisseler satılmış durumda. Kesim planlamasına geçebilirsiniz.</p>
            </div>
          </div>
        `}
        
        ${dashboard.kesildi < dashboard.toplam_kurban ? `
          <div class="alert alert-info">
            <i class="fa-solid fa-info-circle"></i>
            <div>
              <strong>Kesim Planlaması:</strong>
              <p>${dashboard.toplam_kurban - dashboard.kesildi} kurban kesim bekliyor. Kesim takvimini planlamanız önerilir.</p>
            </div>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Hızlı İşlemler -->
    <div class="dashboard-section">
      <h2><i class="fa-solid fa-bolt"></i> Hızlı İşlemler</h2>
      <div class="quick-actions">
        <button class="quick-action-btn" onclick="showPage('kurbanlar')">
          <i class="fa-solid fa-cow"></i>
          <span>Kurban Yönetimi</span>
        </button>
        <button class="quick-action-btn" onclick="showPage('bagiscilar')">
          <i class="fa-solid fa-users"></i>
          <span>Bağışçı Listesi</span>
        </button>
        <button class="quick-action-btn" onclick="showPage('raporlar')">
          <i class="fa-solid fa-chart-bar"></i>
          <span>Raporlar</span>
        </button>
        <button class="quick-action-btn" onclick="excelIndir()">
          <i class="fa-solid fa-file-excel"></i>
          <span>Excel İndir</span>
        </button>
      </div>
    </div>
  `;
}
async function yukleMedyaGaleri() {
  // Medya API'si henüz implement edilmemiş, örnek veri göster
  const medyaGaleri = document.getElementById('medya-galeri');
  
  medyaGaleri.innerHTML = `
    <div class="empty-state">
      <i class="fa-solid fa-photo-film"></i>
      <p>Medya deposu özelliği yakında eklenecek</p>
      <small>Video ve resim yükleme, galeri görüntüleme özellikleri geliştirilmektedir.</small>
    </div>`;
}

function modalMedyaYukle() {
  openModal('Medya Yükle', `
    <div class="alert alert-info">
      <i class="fa-solid fa-info-circle"></i>
      Medya yükleme özelliği yakında eklenecektir.
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" onclick="closeModal()">Tamam</button>
    </div>`, false, 'upload');
}

function filterMedya() {
  // Medya filtreleme yakında eklenecek
  toast('Medya filtreleme yakında eklenecek', 'info');
}