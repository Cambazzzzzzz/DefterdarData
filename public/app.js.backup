// ��� AUTH KONTROL ������������������������������������������������������������
// Kullan�c� ayarlar� global
let _kullaniciAyarlar = { logo_data: null, bayrak_data: null, kurulum_tamamlandi: 0 };
let _kullaniciAdi = '';
// Pro sistemi kaldirildi - herkes sinirsizdir

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
  // ��k�� �ncesi yedek uyar�s�
  await modalCikisYedek();
}

// ��� KURULUM S�H�RBAZI �������������������������������������������������������
let _setupLogoData = null;
let _setupBayrakData = null;

function modalKurulumSihirbazi() {
  _setupLogoData = null;
  _setupBayrakData = null;
  openModal('Ho� Geldiniz! Kurulum', `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:36px;margin-bottom:6px">??</div>
      <div style="font-size:14px;color:var(--text2)">Yazd�rma �ablonunuz i�in g�rselleri y�kleyin.</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px">
      <div class="form-group">
        <label><i class="fa-solid fa-image"></i> Logonuz <span style="color:var(--text3);font-weight:400">(Orta + Ba����� sol �st)</span></label>
        <div class="upload-zone" style="padding:16px;text-align:center;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('setup-logo-input').click()">
          <div id="setup-logo-preview">
            <i class="fa-solid fa-cloud-arrow-up" style="font-size:22px;color:var(--text3)"></i>
            <div style="color:var(--text3);font-size:12px;margin-top:4px">Logo y�kle</div>
          </div>
        </div>
        <input type="file" id="setup-logo-input" accept="image/*" style="display:none" onchange="onSetupImageChange(this,'logo')"/>
      </div>
      <div class="form-group">
        <label><i class="fa-solid fa-flag"></i> Sa� �st Bayrak <span style="color:var(--text3);font-weight:400">(Kurban yazd�r)</span></label>
        <div class="upload-zone" style="padding:16px;text-align:center;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('setup-bayrak-input').click()">
          <div id="setup-bayrak-preview">
            <i class="fa-solid fa-cloud-arrow-up" style="font-size:22px;color:var(--text3)"></i>
            <div style="color:var(--text3);font-size:12px;margin-top:4px">Bayrak y�kle</div>
          </div>
        </div>
        <input type="file" id="setup-bayrak-input" accept="image/*" style="display:none" onchange="onSetupImageChange(this,'bayrak')"/>
      </div>
    </div>
    <div style="background:var(--bg4);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--text3);line-height:1.7">
      <i class="fa-solid fa-info-circle" style="color:var(--accent)"></i>
      <strong>Kurban yazd�r:</strong> Sol �st = T�rk Bayra�� (sabit) &nbsp;|&nbsp; Orta = Logonuz &nbsp;|&nbsp; Sa� �st = Y�kledi�iniz bayrak<br>
      <i class="fa-solid fa-info-circle" style="color:var(--accent)"></i>
      <strong>Ba����� listesi:</strong> Sol �st = Logonuz &nbsp;|&nbsp; Ayarlardan sonradan de�i�tirilebilir
    </div>
    <div class="form-actions" style="margin-top:16px">
      <button class="btn btn-secondary" onclick="kurulumAtla()">�imdi De�il</button>
      <button class="btn btn-primary" onclick="kurulumKaydet()"><i class="fa-solid fa-floppy-disk"></i> Kaydet ve Ba�la</button>
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

// ��� �IKI� YEDE�� MODALI ����������������������������������������������������
async function modalCikisYedek() {
  let orgOpts = '<option value="">-- Organizasyon se�in --</option>';
  try {
    const orgs = await api('GET', '/organizasyonlar');
    orgOpts += orgs.map(o => '<option value="' + o.id + '"' + (o.id === S.orgId ? ' selected' : '') + '>' + esc(o.ad) + ' (' + o.yil + ')</option>').join('');
  } catch(e) {}

  openModal('?? ��kmadan �nce Yedek Al�n', `
    <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:16px;margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:10px">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:24px;color:var(--red)"></i>
        <div>
          <div style="font-weight:700;font-size:15px;margin-bottom:4px">Verilerinizi kaybetmeyin!</div>
          <div style="font-size:13px;color:var(--text2)">��kmadan �nce verilerinizi yedeklemenizi �iddetle tavsiye ederiz. Yedek dosyas� ile ba�ka bilgisayara da ta��yabilirsiniz.</div>
        </div>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:16px">
      <label><i class="fa-solid fa-layer-group"></i> Yedeklenecek Organizasyon</label>
      <select id="cikis-org-select" style="width:100%">
        <option value="tum�">?? T�m Organizasyonlar (Tam Yedek)</option>
        ${orgOpts}
      </select>
    </div>
    <div class="form-actions">
      <button class="btn btn-danger" onclick="cikisYapsiz()"><i class="fa-solid fa-right-from-bracket"></i> Yedeksiz ��k</button>
      <button class="btn btn-secondary" onclick="closeModal()"><i class="fa-solid fa-xmark"></i> �ptal</button>
      <button class="btn btn-primary" onclick="yedekAlVeCik()"><i class="fa-solid fa-floppy-disk"></i> Yedekle ve ��k</button>
    </div>
    <div id="cikis-status" style="margin-top:10px;font-size:12px;min-height:18px;text-align:center"></div>
  `, false, 'shield-halved');
}

async function yedekAlVeCik() {
  const orgSec = document.getElementById('cikis-org-select').value;
  const statusEl = document.getElementById('cikis-status');
  statusEl.textContent = 'Yedek haz�rlan�yor...';
  statusEl.style.color = 'var(--accent)';

  try {
    let url, filename;
    const tarih = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    if (orgSec === 'tum�' || !orgSec) {
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
        statusEl.textContent = '? Yedek kaydedildi: ' + result.path;
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
      if (!r.ok) throw new Error('Sunucu hatas�');
      const blob = await r.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      statusEl.textContent = '? Yedek indirildi. ��k�l�yor...';
      statusEl.style.color = 'var(--green)';
      setTimeout(async () => {
        await fetch('/api/auth/cikis', { method: 'POST' });
        localStorage.removeItem('defterdar-last-login');
        window.location.href = '/giris.html';
      }, 1500);
    }
  } catch(e) {
    statusEl.textContent = '? Hata: ' + e.message;
    statusEl.style.color = 'var(--red)';
  }
}

async function cikisYapsiz() {
  if (!confirm('Yedek almadan ��kmak istedi�inizden emin misiniz?')) return;
  closeModal();
  await fetch('/api/auth/cikis', { method: 'POST' });
  localStorage.removeItem('defterdar-last-login');
  window.location.href = '/giris.html';
}

// Ayarlar sayfas�ndan da de�i�tirilebilir
async function modalAyarlar() {
  _setupLogoData = null;
  _setupBayrakData = null;
  const logoOnizleme = _kullaniciAyarlar.logo_data
    ? '<img src="' + _kullaniciAyarlar.logo_data + '" style="max-height:70px;max-width:100%;border-radius:6px;object-fit:contain"/>'
    : '<i class="fa-solid fa-image" style="font-size:22px;color:var(--text3)"></i><div style="color:var(--text3);font-size:12px;margin-top:4px">Y�klenmedi</div>';
  const bayrakOnizleme = _kullaniciAyarlar.bayrak_data
    ? '<img src="' + _kullaniciAyarlar.bayrak_data + '" style="max-height:70px;max-width:100%;border-radius:6px;object-fit:contain"/>'
    : '<i class="fa-solid fa-flag" style="font-size:22px;color:var(--text3)"></i><div style="color:var(--text3);font-size:12px;margin-top:4px">Y�klenmedi</div>';

  openModal('Yazd�rma Ayarlar�', `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px">
      <div class="form-group">
        <label><i class="fa-solid fa-image"></i> Logonuz</label>
        <div class="upload-zone" style="padding:16px;text-align:center;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('setup-logo-input').click()">
          <div id="setup-logo-preview">${logoOnizleme}</div>
        </div>
        <input type="file" id="setup-logo-input" accept="image/*" style="display:none" onchange="onSetupImageChange(this,'logo')"/>
      </div>
      <div class="form-group">
        <label><i class="fa-solid fa-flag"></i> Sa� �st Bayrak</label>
        <div class="upload-zone" style="padding:16px;text-align:center;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('setup-bayrak-input').click()">
          <div id="setup-bayrak-preview">${bayrakOnizleme}</div>
        </div>
        <input type="file" id="setup-bayrak-input" accept="image/*" style="display:none" onchange="onSetupImageChange(this,'bayrak')"/>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">�ptal</button>
      <button class="btn btn-primary" onclick="kurulumKaydet()"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
    </div>
  `, true, 'gear');
}

// ��� STATE �������������������������������������������������������������������
const S = { page:'organizasyonlar', orgId:null, orgAd:'', orgYil:'' };

const KURBAN_TURLERI = ['Udhiye','Adak','Akika','Vacip','Hedy','Sukur','Kiran','Temmettu','Ceza','Ihsar','Sadaka','Nafile','Olu','Kefaret','Sifa','Hacet','Fidye','Zekat','Nesike','Vesile','Atire'];

function kurbanTuruOptions(secili) {
  return KURBAN_TURLERI.map(t => '<option value="' + t + '"' + (secili===t?' selected':'') + '>' + t + '</option>').join('');
}

// ��� API ���������������������������������������������������������������������
async function api(method, url, body) {
  const opts = { method, headers:{'Content-Type':'application/json'} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch('/api' + url, opts);
  const d = await r.json();
  if (!r.ok) throw new Error(d.hata || 'Hata olustu');
  return d;
}

// ��� TOAST �������������������������������������������������������������������
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

// ��� MODAL �������������������������������������������������������������������
function openModal(title, html, large=false, icon='') {
  document.getElementById('modal-title').innerHTML = `${icon?`<i class="fa-solid fa-${icon}"></i>`:''}${title}`;
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-box').className = large ? 'modal modal-lg' : 'modal';
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
function closeModalOutside(e) { if (e.target===document.getElementById('modal-overlay')) closeModal(); }

// ��� NAV ���������������������������������������������������������������������
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
  document.getElementById('sidebar-org-name').textContent = ad || 'Organizasyon Secilmedi';
  document.getElementById('sidebar-org-sub').textContent  = yil ? `${yil} Yili` : 'Bir organizasyon secin';
}

// ��� YARDIMCI ����������������������������������������������������������������
function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function para(v) { return v ? Number(v).toLocaleString('tr-TR') + ' TL' : '-'; }

// ===========================================================================
// ORGAN�ZASYONLAR
// ===========================================================================
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
      <div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Yukleniyor...</p></div>
    </div>`;
  const list = await api('GET','/organizasyonlar');
  const g = document.getElementById('org-grid');
  if (!list.length) {
    g.innerHTML = `<div class="empty-state"><i class="fa-solid fa-layer-group"></i><p>Henuz organizasyon yok.</p></div>`;
    return;
  }
  g.innerHTML = list.map(o => `
    <div class="org-card" onclick="secOrg(${o.id},'${esc(o.ad)}',${o.yil})">
      <div class="org-card-name">${esc(o.ad)}</div>
      <div class="org-card-year"><i class="fa-solid fa-calendar"></i> ${o.yil} &nbsp;|&nbsp; Maks. ${o.max_kurban} Kurban</div>
      <div class="org-card-stats">
        <div class="org-card-stat"><div class="val">${o.max_kurban}</div><div class="lbl">Kapasite</div></div>
        <div class="org-card-stat"><div class="val" style="color:var(--green)">${para(o.buyukbas_hisse_fiyati)}</div><div class="lbl">Buyukbas</div></div>
        <div class="org-card-stat"><div class="val" style="color:var(--yellow)">${para(o.kucukbas_hisse_fiyati)}</div><div class="lbl">Kucukbas</div></div>
      </div>
      <div class="org-card-actions" onclick="event.stopPropagation()">
        <button class="btn btn-secondary btn-sm" onclick="modalDuzenleOrg(${o.id})"><i class="fa-solid fa-pen"></i> Duzenle</button>
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
  openModal('Yeni Organizasyon Olustur', `
    <div class="form-grid">
      <div class="form-group" style="grid-column:1/-1">
        <label>Organizasyon Adi *</label>
        <input id="fo-ad" placeholder="Ornek: 2025 Kurban Organizasyonu"/>
      </div>
      <div class="form-group">
        <label>Yil *</label>
        <input id="fo-yil" type="number" value="${new Date().getFullYear()}"/>
      </div>
      <div class="form-group">
        <label>Maksimum Kurban Sayisi *</label>
        <input id="fo-max" type="number" placeholder="50"/>
      </div>
      <div class="form-group">
        <label>Buyukbas Hisse Fiyati (TL)</label>
        <input id="fo-bb" type="number" placeholder="0"/>
      </div>
      <div class="form-group">
        <label>Kucukbas Hisse Fiyati (TL)</label>
        <input id="fo-kb" type="number" placeholder="0"/>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Aciklama</label>
        <textarea id="fo-aciklama" placeholder="Opsiyonel..."></textarea>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
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
    closeModal(); toast('Organizasyon olusturuldu'); renderOrganizasyonlar();
  } catch(e) { toast(e.message,'error'); }
}

async function modalDuzenleOrg(id) {
  const list = await api('GET','/organizasyonlar');
  const o = list.find(x=>x.id===id); if (!o) return;
  openModal('Organizasyonu Duzenle', `
    <div class="form-grid">
      <div class="form-group" style="grid-column:1/-1">
        <label>Organizasyon Adi *</label>
        <input id="fo-ad" value="${esc(o.ad)}"/>
      </div>
      <div class="form-group"><label>Yil *</label><input id="fo-yil" type="number" value="${o.yil}"/></div>
      <div class="form-group"><label>Maks. Kurban *</label><input id="fo-max" type="number" value="${o.max_kurban}"/></div>
      <div class="form-group"><label>Buyukbas Hisse (TL)</label><input id="fo-bb" type="number" value="${o.buyukbas_hisse_fiyati}"/></div>
      <div class="form-group"><label>Kucukbas Hisse (TL)</label><input id="fo-kb" type="number" value="${o.kucukbas_hisse_fiyati}"/></div>
      <div class="form-group" style="grid-column:1/-1"><label>Aciklama</label><textarea id="fo-aciklama">${esc(o.aciklama||'')}</textarea></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-primary" onclick="guncOrg(${id})"><i class="fa-solid fa-floppy-disk"></i> Guncelle</button>
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
    closeModal(); toast('Guncellendi'); renderOrganizasyonlar();
  } catch(e) { toast(e.message,'error'); }
}

async function silOrg(id) {
  if (!confirm('Bu organizasyonu silmek istediginizden emin misiniz?')) return;
  try { await api('DELETE',`/organizasyonlar/${id}`); toast('Silindi'); renderOrganizasyonlar(); }
  catch(e) { toast(e.message,'error'); }
}

// ===========================================================================
// KURBANLAR
// ===========================================================================
let _kurbanlar = [];

async function renderKurbanlar() {
  if (!S.orgId) { showPage('organizasyonlar'); return; }
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-cow"></i></div>
        Kurbanlar <small>${esc(S.orgAd)}</small>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary" onclick="showPage('organizasyonlar')"><i class="fa-solid fa-arrow-left"></i> Geri</button>
        <button class="btn btn-secondary" onclick="tumKurbanlariYazdir()"><i class="fa-solid fa-print"></i> Tumu Yazdir</button>
        <button class="btn btn-success" onclick="tumKurbanlariExcel()"><i class="fa-solid fa-file-excel"></i> Tumu Excel</button>
        <button class="btn btn-primary" onclick="modalYeniKurban()"><i class="fa-solid fa-plus"></i> Kurban Ekle</button>
      </div>
    </div>
    <div class="stats-grid" id="dash-stats"></div>
    <div class="card">
      <div class="filter-bar" style="margin-bottom:16px">
        <input id="k-ara" placeholder="Kurban no ara..." oninput="filterKurbanlar()"/>
        <select id="k-tur" onchange="loadKurbanlar()">
          <option value="">Tum Turler</option>
          <option value="buyukbas">Buyukbas</option>
          <option value="kucukbas">Kucukbas</option>
        </select>
        <select id="k-durum" onchange="loadKurbanlar()">
          <option value="">Tum Durumlar</option>
          <option value="bos">Bos Hisseli</option>
          <option value="doldu">Hisseleri Dolu</option>
          <option value="kesildi">Kesildi</option>
        </select>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th style="width:40px">#</th>
            <th data-sort="kurban_no" onclick="sortKurbanlar('kurban_no')" style="cursor:pointer">No<span class="sort-icon"> ^</span></th>
            <th data-sort="tur" onclick="sortKurbanlar('tur')" style="cursor:pointer">Hayvan<span class="sort-icon"> |</span></th>
            <th>Kurban Turu</th>
            <th>Kupe No</th>
            <th data-sort="alis_fiyati" onclick="sortKurbanlar('alis_fiyati')" style="cursor:pointer">Alis Fiyati<span class="sort-icon"> |</span></th>
            <th data-sort="dolu_hisse" onclick="sortKurbanlar('dolu_hisse')" style="cursor:pointer">Hisse Durumu<span class="sort-icon"> |</span></th>
            <th>Durum</th>
            <th>Kesim</th>
            <th>Islemler</th>
          </tr></thead>
          <tbody id="kurban-tbody"></tbody>
        </table>
      </div>
    </div>`;
  await loadDashStats();
  await loadKurbanlar();
}

async function loadDashStats() {
  try {
    const d = await api('GET',`/organizasyonlar/${S.orgId}/dashboard`);
    document.getElementById('dash-stats').innerHTML = `
      <div class="stat-card blue"><div class="stat-icon"><i class="fa-solid fa-cow"></i></div><div class="stat-value">${d.toplam_kurban}</div><div class="stat-label">Toplam Kurban</div></div>
      <div class="stat-card green"><div class="stat-icon"><i class="fa-solid fa-circle-check"></i></div><div class="stat-value">${d.dolu_hisse}</div><div class="stat-label">Dolu Hisse</div></div>
      <div class="stat-card yellow"><div class="stat-icon"><i class="fa-solid fa-circle-half-stroke"></i></div><div class="stat-value">${d.bos_hisse}</div><div class="stat-label">Bos Hisse</div></div>
      <div class="stat-card red"><div class="stat-icon"><i class="fa-solid fa-scissors"></i></div><div class="stat-value">${d.kesildi}</div><div class="stat-label">Kesildi</div></div>
      <div class="stat-card purple"><div class="stat-icon"><i class="fa-solid fa-check-double"></i></div><div class="stat-value">${d.doldu_kurban}</div><div class="stat-label">Hisseleri Dolu</div></div>`;
  } catch(e) {}
}

async function loadKurbanlar() {
  const tur = document.getElementById('k-tur')?.value||'';
  const durum = document.getElementById('k-durum')?.value||'';
  let url = `/organizasyonlar/${S.orgId}/kurbanlar?`;
  if (tur) url+=`tur=${tur}&`;
  if (durum) url+=`durum=${durum}`;
  _kurbanlar = await api('GET', url);
  filterKurbanlar();
}

let _sortCol = 'kurban_no', _sortDir = 1;

function sortKurbanlar(col) {
  if (_sortCol === col) _sortDir *= -1;
  else { _sortCol = col; _sortDir = 1; }
  // Ba�l�k oklar�n� g�ncelle
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.querySelector('.sort-icon').textContent = th.dataset.sort === _sortCol ? (_sortDir===1?' ^':' v') : ' |';
  });
  filterKurbanlar();
}

function filterKurbanlar() {
  const ara = (document.getElementById('k-ara')?.value||'').toLowerCase();
  let list = _kurbanlar.filter(k => !ara || String(k.kurban_no).includes(ara) || (k.kupe_no||'').toLowerCase().includes(ara));

  // S�rala
  list = [...list].sort((a,b) => {
    let av = a[_sortCol], bv = b[_sortCol];
    if (typeof av === 'string') av = av.toLowerCase(), bv = (bv||'').toLowerCase();
    if (av == null) av = -1; if (bv == null) bv = -1;
    return av > bv ? _sortDir : av < bv ? -_sortDir : 0;
  });

  const tbody = document.getElementById('kurban-tbody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><i class="fa-solid fa-cow"></i><p>Kurban bulunamadi.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((k, idx) => {
    const dolu = k.dolu_hisse, top = k.toplam_hisse;
    const pct = Math.round((dolu/top)*100);
    let durumBadge;
    if (k.kesildi) durumBadge = `<span class="badge badge-red"><i class="fa-solid fa-scissors"></i> Kesildi</span>`;
    else if (dolu>=top) durumBadge = `<span class="badge badge-yellow"><i class="fa-solid fa-circle-dot"></i> Doldu</span>`;
    else durumBadge = `<span class="badge badge-green"><i class="fa-solid fa-circle"></i> Bos</span>`;
    return `<tr>
      <td style="color:var(--text3);font-size:12px;font-weight:600">${idx+1}</td>
      <td><span class="kurban-no-badge">${k.kurban_no}</span></td>
      <td>${k.tur==='buyukbas'?'<span class="badge badge-blue"><i class="fa-solid fa-cow"></i> Buyukbas</span>':'<span class="badge badge-gray"><i class="fa-solid fa-hippo"></i> Kucukbas</span>'}</td>
      <td>${k.kupe_no?esc(k.kupe_no):'<span style="color:var(--text3)">-</span>'}</td>
      <td>${k.alis_fiyati?para(k.alis_fiyati):'-'}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;min-width:120px">
          <div class="progress-bar" style="flex:1"><div class="progress-fill ${dolu>=top?'full':''}" style="width:${pct}%"></div></div>
          <span style="font-size:12px;color:var(--text2);font-weight:600">${dolu}/${top}</span>
        </div>
      </td>
      <td>${durumBadge}</td>
      <td>${k.kesim_tarihi?`<span style="font-size:12px">${k.kesim_tarihi}</span>`:'<span style="color:var(--text3)">-</span>'}</td>
      <td>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          <button class="btn btn-purple btn-sm" onclick="modalHisseler(${k.id},${k.kurban_no},'${k.tur}')"><i class="fa-solid fa-users"></i> Hisseler</button>
          <button class="btn btn-secondary btn-sm btn-icon" title="Duzenle" onclick="modalDuzenleKurban(${k.id})"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-secondary btn-sm btn-icon" title="Yazdir" onclick="yazdirKurbanSatir(${k.id})"><i class="fa-solid fa-print"></i></button>
          <button class="btn btn-success btn-sm btn-icon" title="Excel" onclick="excelKurbanSatir(${k.id})"><i class="fa-solid fa-file-excel"></i></button>
          <button class="btn btn-danger btn-sm btn-icon" title="Sil" onclick="silKurban(${k.id})"><i class="fa-solid fa-trash"></i></button>
    </tr>`;
  }).join('');
}

function modalYeniKurban() {
  openModal('Yeni Kurban Ekle', `
    <div class="form-grid">
      <div class="form-group">
        <label>Hayvan Turu *</label>
        <select id="fk-tur">
          <option value="buyukbas">Buyukbas (7 Hisse)</option>
          <option value="kucukbas">Kucukbas (1 Hisse)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Kurban Turu *</label>
        <select id="fk-kurban-turu">${kurbanTuruOptions('Udhiye')}</select>
      </div>
      <div class="form-group">
        <label>Kupe No</label>
        <input id="fk-kupe" placeholder="Opsiyonel"/>
      </div>
      <div class="form-group">
        <label>Alis Fiyati (TL)</label>
        <input id="fk-alis" type="number" placeholder="0"/>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Kesen Kisi Adi Soyadi <span style="color:var(--text3);font-weight:400">(Opsiyonel)</span></label>
        <input id="fk-kesen" placeholder="Kurbani kesecek kisi"/>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Not</label>
        <textarea id="fk-not" placeholder="Opsiyonel..."></textarea>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-primary" onclick="kaydetKurban()"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
    </div>`, false, 'cow');
}

async function kaydetKurban() {
  const tur=document.getElementById('fk-tur').value;
  const kurban_turu=document.getElementById('fk-kurban-turu').value;
  const kupe_no=document.getElementById('fk-kupe').value.trim();
  const alis_fiyati=parseFloat(document.getElementById('fk-alis').value)||0;
  const kesen_kisi=document.getElementById('fk-kesen').value.trim();
  const aciklama=document.getElementById('fk-not').value.trim();
  try {
    const r = await api('POST',`/organizasyonlar/${S.orgId}/kurbanlar`,{tur,kurban_turu,kupe_no,alis_fiyati,kesen_kisi,aciklama});
    closeModal(); toast(`Kurban #${r.kurban_no} olusturuldu (${r.toplam_hisse} hisse)`);
    await loadDashStats(); await loadKurbanlar();
  } catch(e) { toast(e.message,'error'); }
}

async function modalDuzenleKurban(id) {
  const k = _kurbanlar.find(x=>x.id===id); if (!k) return;
  openModal(`Kurban #${k.kurban_no} Duzenle`, `
    <div class="form-grid">
      <div class="form-group">
        <label>Kurban Turu</label>
        <select id="fk-kurban-turu">${kurbanTuruOptions(k.kurban_turu||'Udhiye')}</select>
      </div>
      <div class="form-group">
        <label>Kupe No</label>
        <input id="fk-kupe" value="${esc(k.kupe_no||'')}"/>
      </div>
      <div class="form-group">
        <label>Alis Fiyati (TL)</label>
        <input id="fk-alis" type="number" value="${k.alis_fiyati||0}"/>
      </div>
      <div class="form-group">
        <label>Kesildi mi?</label>
        <select id="fk-kesildi">
          <option value="0" ${!k.kesildi?'selected':''}>Hayir</option>
          <option value="1" ${k.kesildi?'selected':''}>Evet</option>
        </select>
      </div>
      <div class="form-group">
        <label>Kesim Tarihi</label>
        <input id="fk-kesim" type="date" value="${k.kesim_tarihi||''}"/>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Kesen Kisi Adi Soyadi</label>
        <input id="fk-kesen" value="${esc(k.kesen_kisi||'')}" placeholder="Opsiyonel"/>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Not</label>
        <textarea id="fk-not">${esc(k.aciklama||'')}</textarea>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-primary" onclick="guncKurban(${id})"><i class="fa-solid fa-floppy-disk"></i> Guncelle</button>
    </div>`, false, 'pen');
}

async function guncKurban(id) {
  const kurban_turu=document.getElementById('fk-kurban-turu').value;
  const kupe_no=document.getElementById('fk-kupe').value.trim();
  const alis_fiyati=parseFloat(document.getElementById('fk-alis').value)||0;
  const kesildi=document.getElementById('fk-kesildi').value==='1';
  const kesim_tarihi=document.getElementById('fk-kesim').value;
  const kesen_kisi=document.getElementById('fk-kesen').value.trim();
  const aciklama=document.getElementById('fk-not').value.trim();
  try {
    await api('PUT',`/kurbanlar/${id}`,{kurban_turu,kupe_no,alis_fiyati,kesildi,kesim_tarihi,kesen_kisi,aciklama});
    closeModal(); toast('Guncellendi'); await loadDashStats(); await loadKurbanlar();
  } catch(e) { toast(e.message,'error'); }
}

async function silKurban(id) {
  if (!confirm('Bu kurbani silmek istediginizden emin misiniz?')) return;
  try { await api('DELETE',`/kurbanlar/${id}`); toast('Silindi'); await loadDashStats(); await loadKurbanlar(); }
  catch(e) { toast(e.message,'error'); }
}

// ===========================================================================
// H�SSELER / BA�I��I EKLEME
// ===========================================================================
async function modalHisseler(kurbanId, kurbanNo, tur) {
  const hisseler = await api('GET',`/kurbanlar/${kurbanId}/hisseler`);
  const dolu = hisseler.filter(h=>h.bagisci_adi).length;
  const html = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <span class="badge ${tur==='buyukbas'?'badge-blue':'badge-gray'}">${tur==='buyukbas'?'Buyukbas':'Kucukbas'}</span>
      <span style="font-size:13px;color:var(--text2)">${dolu}/${hisseler.length} hisse dolu</span>
      <div class="progress-bar" style="flex:1;max-width:120px">
        <div class="progress-fill ${dolu>=hisseler.length?'full':''}" style="width:${Math.round(dolu/hisseler.length*100)}%"></div>
      </div>
    </div>
    <div class="hisse-grid">
      ${hisseler.map(h => hisseKart(h, kurbanId)).join('')}
    </div>`;
  openModal(`Kurban #${kurbanNo} � Hisseler`, html, true, 'users');
}

function hisseKart(h, kurbanId) {
  const dolu = !!h.bagisci_adi;
  const odemeRenk = {odendi:'badge-green',iptal:'badge-red',bekliyor:'badge-gray'};
  const odemeLabel = {odendi:'Odendi',iptal:'Iptal',bekliyor:'Bekliyor'};
  return `
    <div class="hisse-card ${dolu?'dolu':''}" onclick="modalBagisciDuzenle(${h.id},${kurbanId})">
      <div class="hisse-no"><i class="fa-solid fa-hashtag"></i> Hisse ${h.hisse_no}</div>
      ${dolu ? `
        <div class="hisse-isim">${esc(h.bagisci_adi)}</div>
        <div class="hisse-tel">${h.bagisci_telefon?esc(h.bagisci_telefon):''}</div>
        ${h.kimin_adina?`<div class="hisse-adina"><i class="fa-solid fa-heart"></i> ${esc(h.kimin_adina)}</div>`:''}
        ${h.video_ister?`<div style="font-size:11px;color:var(--accent);margin-top:4px"><i class="fa-solid fa-video"></i> Video istiyor</div>`:''}
        <div class="hisse-odeme"><span class="badge ${odemeRenk[h.odeme_durumu]||'badge-gray'}" style="font-size:10px">${odemeLabel[h.odeme_durumu]||h.odeme_durumu}</span></div>
        <div style="margin-top:6px" onclick="event.stopPropagation()">
          <button class="btn btn-purple btn-sm" style="font-size:10px;padding:4px 8px" onclick="modalHisseMedya(${h.id},${h.kurban_id||kurbanId},${h.hisse_no})">
            <i class="fa-solid fa-cloud-arrow-up"></i> Medya
          </button>
        </div>
      ` : `
        <div class="hisse-bos"><i class="fa-solid fa-user-plus"></i> Bos � Tikla ekle</div>
      `}    </div>`;
}

async function modalBagisciDuzenle(hisseId, kurbanId) {
  const hisseler = await api('GET',`/kurbanlar/${kurbanId}/hisseler`);
  const h = hisseler.find(x=>x.id===hisseId); if (!h) return;
  const html = `
    <div style="margin-bottom:16px">
      <span class="badge badge-blue" style="font-size:12px"><i class="fa-solid fa-hashtag"></i> Hisse ${h.hisse_no}</span>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Bagisci Adi Soyadi *</label>
        <input id="fh-ad" value="${esc(h.bagisci_adi||'')}" placeholder="Ad Soyad"/>
      </div>
      <div class="form-group">
        <label>Bagisci Telefonu</label>
        <input id="fh-tel" value="${esc(h.bagisci_telefon||'')}" placeholder="05xx xxx xx xx"/>
      </div>
      <div class="form-group">
        <label>Kimin Adina <span style="color:var(--text3);font-weight:400">(Opsiyonel)</span></label>
        <input id="fh-adina" value="${esc(h.kimin_adina||'')}" placeholder="Vefat eden veya baska kisi"/>
      </div>
      <div class="form-group">
        <label>Kimin Adina Telefon <span style="color:var(--text3);font-weight:400">(Opsiyonel)</span></label>
        <input id="fh-adina-tel" value="${esc(h.kimin_adina_telefon||'')}" placeholder="Opsiyonel"/>
      </div>
      <div class="form-group">
        <label>Odeme Durumu</label>
        <select id="fh-odeme">
          <option value="bekliyor" ${h.odeme_durumu==='bekliyor'?'selected':''}>Bekliyor</option>
          <option value="odendi"   ${h.odeme_durumu==='odendi'?'selected':''}>Odendi</option>
          <option value="iptal"    ${h.odeme_durumu==='iptal'?'selected':''}>Iptal</option>
        </select>
      </div>
      <div class="form-group">
        <label>Video Ister mi?</label>
        <select id="fh-video" onchange="toggleVideoUpload()">
          <option value="0" ${!h.video_ister?'selected':''}>Hayir</option>
          <option value="1" ${h.video_ister?'selected':''}>Evet</option>
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Video Y�kleme <span style="color:var(--text3);font-weight:400">(Video isteyen ba�����lar i�in)</span></label>
        <div id="video-upload-area" style="display:${h.video_ister ? 'block' : 'none'}">
          ${h.video_url ? `
            <div style="background:var(--bg4);border:1px solid var(--border2);border-radius:8px;padding:12px;margin-bottom:8px">
              <div style="display:flex;align-items:center;gap:8px">
                <i class="fa-solid fa-video" style="color:var(--green)"></i>
                <span style="font-size:13px">Video y�klendi</span>
                <a href="${h.video_url}" target="_blank" class="btn btn-secondary btn-sm" style="margin-left:auto">
                  <i class="fa-solid fa-external-link"></i> G�r�nt�le
                </a>
                <button class="btn btn-danger btn-sm" onclick="videoSil(${hisseId})">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ` : `
            <div class="upload-zone" onclick="document.getElementById('hisse-video-input').click()"
              style="padding:16px;text-align:center;cursor:pointer;min-height:80px;display:flex;align-items:center;justify-content:center;flex-direction:column">
              <i class="fa-solid fa-video" style="font-size:20px;color:var(--text3);margin-bottom:6px"></i>
              <div style="color:var(--text3);font-size:12px">Video y�kle (MP4, MOV, WEBM)</div>
            </div>
            <input type="file" id="hisse-video-input" accept="video/*" style="display:none" onchange="yukleHisseVideo(this.files[0], ${hisseId})"/>
          `}
        </div>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Not</label>
        <textarea id="fh-not">${esc(h.aciklama||'')}</textarea>
      </div>
    </div>
    <div class="form-actions">
      ${h.bagisci_adi?`<button class="btn btn-danger" onclick="temizleHisse(${hisseId},${kurbanId})"><i class="fa-solid fa-eraser"></i> Temizle</button>`:''}
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-primary" onclick="kaydetBagisci(${hisseId},${kurbanId})"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
    </div>`;
  openModal(`Hisse ${h.hisse_no} � Bagisci Bilgileri`, html, false, 'user-pen');
}

async function kaydetBagisci(hisseId, kurbanId) {
  const bagisci_adi = document.getElementById('fh-ad').value.trim();
  const bagisci_telefon = document.getElementById('fh-tel').value.trim();
  const kimin_adina = document.getElementById('fh-adina').value.trim();
  const kimin_adina_telefon = document.getElementById('fh-adina-tel').value.trim();
  const odeme_durumu = document.getElementById('fh-odeme').value;
  const video_ister = document.getElementById('fh-video').value==='1';
  const aciklama = document.getElementById('fh-not').value.trim();
  if (!bagisci_adi) return toast('Bagisci adi zorunlu','error');
  try {
    await api('PUT',`/hisseler/${hisseId}`,{bagisci_adi,bagisci_telefon,kimin_adina,kimin_adina_telefon,odeme_durumu,video_ister,aciklama});
    closeModal(); toast('Bagisci kaydedildi');
    await loadDashStats(); await loadKurbanlar();
  } catch(e) { toast(e.message,'error'); }
}

async function temizleHisse(hisseId, kurbanId) {
  if (!confirm('Bu hisseyi temizlemek istediginizden emin misiniz?')) return;
  try {
    await api('DELETE',`/hisseler/${hisseId}/temizle`);
    closeModal(); toast('Hisse temizlendi');
    await loadDashStats(); await loadKurbanlar();
  } catch(e) { toast(e.message,'error'); }
}

function toggleVideoUpload() {
  const videoIster = document.getElementById('fh-video').value === '1';
  const uploadArea = document.getElementById('video-upload-area');
  if (uploadArea) {
    uploadArea.style.display = videoIster ? 'block' : 'none';
  }
}

async function yukleHisseVideo(file, hisseId) {
  if (!file) return;
  
  if (!file.type.startsWith('video/')) {
    toast('Sadece video dosyalar� y�klenebilir', 'error');
    return;
  }
  
  const formData = new FormData();
  formData.append('dosya', file);
  formData.append('folder', `defterdar/hisse-${hisseId}`);
  
  try {
    toast('Video y�kleniyor...');
    const r = await fetch('/api/medya/upload', { method: 'POST', body: formData });
    const data = await r.json();
    
    if (!r.ok) {
      throw new Error(data.hata || 'Video y�klenemedi');
    }
    
    // Hisse tablosuna video URL'ini kaydet
    await api('PUT', `/hisseler/${hisseId}`, {
      video_url: data.url,
      video_public_id: data.public_id
    });
    
    toast('Video gönderildi - Bağışçı bilgileri korundu');
    
    // Modal'ı kapatmayın, sadece upload alanını güncelle
    const uploadArea = document.getElementById('video-upload-area');
    if (uploadArea) {
      uploadArea.innerHTML = `
        <div style="background:var(--bg4);border:1px solid var(--border2);border-radius:8px;padding:12px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <i class="fa-solid fa-video" style="color:var(--green)"></i>
            <span style="font-size:13px">Video gönderildi</span>
            <a href="${data.url}" target="_blank" class="btn btn-secondary btn-sm" style="margin-left:auto">
              <i class="fa-solid fa-external-link"></i> Görüntüle
            </a>
            <button class="btn btn-danger btn-sm" onclick="videoSil(${hisseId})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }
  } catch(e) {
    toast(e.message, 'error');
  }
}

async function videoSil(hisseId) {
  if (!confirm('Videoyu silmek istedi�inizden emin misiniz?')) return;
  
  try {
    // �nce video URL'ini al
    const hisseler = await api('GET', `/kurbanlar/${S.kurbanId}/hisseler`);
    const h = hisseler.find(x => x.id === hisseId);
    
    if (h && h.video_public_id) {
      // Cloudinary'den sil
      await api('DELETE', '/medya/delete', {
        public_id: h.video_public_id,
        resource_type: 'video'
      });
    }
    
    // Hisse tablosundan video bilgilerini temizle
    await api('PUT', `/hisseler/${hisseId}`, {
      video_url: null,
      video_public_id: null
    });
    
    toast('Video silindi');
    // Modal'� yenile
    if (h) {
      h.video_url = null;
      h.video_public_id = null;
      modalBagisci(hisseId, S.kurbanId, h);
    }
  } catch(e) {
    toast(e.message, 'error');
  }
}

// ===========================================================================
// BA�I��ILAR
// ===========================================================================
async function renderBagiscilar() {
  const m = document.getElementById('main-content');
  const orgSmall = S.orgAd ? '<small>' + esc(S.orgAd) + '</small>' : '';
  m.innerHTML =
    '<div class="page-header">' +
      '<div class="page-title"><div class="icon-wrap"><i class="fa-solid fa-users"></i></div>Bagiscilar ' + orgSmall + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="btn btn-secondary" onclick="yazdirBagiscilar()"><i class="fa-solid fa-print"></i> Yazdir</button>' +
        '<button class="btn btn-success" onclick="excelBagiscilarIndir()"><i class="fa-solid fa-file-excel"></i> Excel Indir</button>' +
        '<button class="btn btn-primary" onclick="modalYeniBagisci()"><i class="fa-solid fa-user-plus"></i> Bagisci Ekle</button>' +
      '</div>' +
    '</div>' +
    '<div class="card">' +
      '<div class="filter-bar" style="margin-bottom:16px">' +
        '<input id="b-ara" placeholder="Ad veya telefon ile ara..." oninput="aramaBagisci()" style="min-width:300px"/>' +
      '</div>' +
      '<div class="table-wrap">' +
        '<table>' +
          '<thead><tr>' +
            '<th>#</th><th>Bagisci Adi</th><th>Telefon</th><th>Kimin Adina</th>' +
            '<th>Kurban No</th><th>Hisse</th><th>Tur</th><th>Odeme</th><th>Video</th><th>Islem</th>' +
          '</tr></thead>' +
          '<tbody id="bagisci-tbody">' +
            '<tr><td colspan="10"><div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Yukleniyor...</p></div></td></tr>' +
          '</tbody>' +
        '</table>' +
      '</div>' +
    '</div>';
  await tumBagiscilariGoster();
}


async function tumBagiscilariGoster() {
  if (!S.orgId) return toast('Once bir organizasyon secin','error');
  let url = `/bagiscilar/ara?q=&orgId=${S.orgId}&tumunu=1`;
  const list = await api('GET', url);
  renderBagisciTablosu(list);
}

async function aramaBagisci() {
  const q = document.getElementById('b-ara').value.trim();
  if (q.length === 0) {
    await tumBagiscilariGoster();
    return;
  }
  if (q.length < 2) return;
  let url = `/bagiscilar/ara?q=${encodeURIComponent(q)}`;
  if (S.orgId) url += `&orgId=${S.orgId}`;
  const list = await api('GET', url);
  renderBagisciTablosu(list);
}

function renderBagisciTablosu(list) {
  const tbody = document.getElementById('bagisci-tbody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state"><i class="fa-solid fa-user-slash"></i><p>Sonuc bulunamadi.</p></div></td></tr>`;
    return;
  }
  const oRenk  = {odendi:'badge-green',iptal:'badge-red',bekliyor:'badge-gray'};
  const oLabel = {odendi:'Odendi',iptal:'Iptal',bekliyor:'Bekliyor'};
  tbody.innerHTML = list.map((h,i)=>`
    <tr>
      <td style="color:var(--text3);font-size:12px">${i+1}</td>
      <td><strong>${esc(h.bagisci_adi)}</strong></td>
      <td>${h.bagisci_telefon?esc(h.bagisci_telefon):'-'}</td>
      <td>${h.kimin_adina?`<span style="color:var(--purple)">${esc(h.kimin_adina)}</span>`:'-'}</td>
      <td><span class="kurban-no-badge">${h.kurban_no}</span></td>
      <td><span class="badge badge-blue">${h.hisse_no}</span></td>
      <td>${h.tur==='buyukbas'?'<span class="badge badge-blue">Buyukbas</span>':'<span class="badge badge-gray">Kucukbas</span>'}</td>
      <td><span class="badge ${oRenk[h.odeme_durumu]||'badge-gray'}">${oLabel[h.odeme_durumu]||h.odeme_durumu}</span></td>
      <td>${h.video_ister?'<span class="badge badge-purple"><i class="fa-solid fa-video"></i> Evet</span>':'-'}</td>
      <td><button class="btn btn-secondary btn-sm btn-icon" onclick="modalBagisciDuzenle(${h.id},${h.kurban_id})" title="Duzenle"><i class="fa-solid fa-pen"></i></button></td>
    </tr>`).join('');
}

async function modalYeniBagisci() {
  if (!S.orgId) return toast('Once bir organizasyon secin', 'error');

  // Mevcut kurban say�s�n� al � yeni kurban no = max + 1
  const kurbanlar = await api('GET', `/organizasyonlar/${S.orgId}/kurbanlar`);
  const org = (await api('GET', '/organizasyonlar')).find(o => o.id === S.orgId);
  const yeniNo = kurbanlar.length + 1;

  if (org && yeniNo > org.max_kurban) return toast('Maksimum kurban sayisina ulasildi', 'error');

  openModal(`Bagisci Ekle � Kurban #${yeniNo}`, `
    <div style="background:var(--bg4);border:1px solid var(--border2);border-radius:10px;padding:14px;margin-bottom:20px">
      <div style="font-size:12px;color:var(--text3);margin-bottom:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Kurban Bilgileri</div>
      <div class="form-grid" style="grid-template-columns:1fr 1fr 1fr;gap:10px">
        <div class="form-group">
          <label>Hayvan Turu *</label>
          <select id="fb-tur" onchange="bagisciTurSecildi()">
            <option value="buyukbas">Buyukbas (7 Hisse)</option>
            <option value="kucukbas">Kucukbas (1 Hisse)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Kurban Turu *</label>
          <select id="fb-kurban-turu">${kurbanTuruOptions('Udhiye')}</select>
        </div>
        <div class="form-group">
          <label>Kupe No</label>
          <input id="fb-kupe" placeholder="Opsiyonel"/>
        </div>
        <div class="form-group">
          <label>Alis Fiyati (TL)</label>
          <input id="fb-alis" type="number" placeholder="0"/>
        </div>
        <div class="form-group" style="grid-column:3/4">
          <label>Kesen Kisi</label>
          <input id="fb-kesen" placeholder="Opsiyonel"/>
        </div>
      </div>
    </div>

    <div id="fb-hisseler-wrap"></div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-primary" onclick="kaydetYeniBagisci()">
        <i class="fa-solid fa-floppy-disk"></i> Kurban Olustur ve Kaydet
      </button>
    </div>
  `, true, 'user-plus');

  // Sayfa a��l�nca hemen b�y�kba� i�in 7 hisse formunu g�ster
  bagisciTurSecildi();
}

function bagisciTurSecildi() {
  const tur = document.getElementById('fb-tur')?.value || 'buyukbas';
  const toplam = tur === 'buyukbas' ? 7 : 1;
  const wrap = document.getElementById('fb-hisseler-wrap');
  if (!wrap) return;

  let html = '<div style="font-size:12px;color:var(--text3);margin-bottom:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">';
  html += '<i class="fa-solid fa-users" style="color:var(--accent)"></i> Hisseler (' + toplam + ' Hisse)</div>';

  for (let no = 1; no <= toplam; no++) {
    html += '<div style="background:var(--bg4);border:1px solid var(--border2);border-radius:10px;padding:14px;margin-bottom:10px" id="fb-hisse-block-' + no + '">';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">';
    html += '<span class="badge badge-blue"><i class="fa-solid fa-hashtag"></i> Hisse ' + no + '</span>';
    html += '<span style="font-size:11px;color:var(--text3)" id="fb-hisse-durum-' + no + '">Bos</span>';
    html += '</div>';
    html += '<div class="form-grid" style="grid-template-columns:1fr 1fr;gap:10px">';
    html += '<div class="form-group"><label>Bagisci Adi Soyadi</label>';
    html += '<input id="fb-ad-' + no + '" placeholder="Ad Soyad" oninput="bagisciAdGirildi(' + no + ')"/></div>';
    html += '<div class="form-group"><label>Telefon</label>';
    html += '<input id="fb-tel-' + no + '" placeholder="05xx xxx xx xx"/></div>';
    html += '<div class="form-group"><label>Kimin Adina <span style="color:var(--text3);font-weight:400">(Opsiyonel)</span></label>';
    html += '<input id="fb-adina-' + no + '" placeholder="Vefat eden / baska kisi"/></div>';
    html += '<div class="form-group"><label>Kimin Adina Tel <span style="color:var(--text3);font-weight:400">(Opsiyonel)</span></label>';
    html += '<input id="fb-adina-tel-' + no + '" placeholder="Opsiyonel"/></div>';
    html += '<div class="form-group"><label>Odeme Durumu</label>';
    html += '<select id="fb-odeme-' + no + '"><option value="bekliyor">Bekliyor</option><option value="odendi">Odendi</option><option value="iptal">Iptal</option></select></div>';
    html += '<div class="form-group"><label>Video Ister mi?</label>';
    html += '<select id="fb-video-' + no + '"><option value="0">Hayir</option><option value="1">Evet</option></select></div>';
    html += '</div></div>';
  }

  wrap.innerHTML = html;
  wrap.dataset.toplam = toplam;
}

function bagisciAdGirildi(no) {
  const ad = document.getElementById(`fb-ad-${no}`)?.value.trim();
  const durum = document.getElementById(`fb-hisse-durum-${no}`);
  const block = document.getElementById(`fb-hisse-block-${no}`);
  if (ad) {
    durum.textContent = ad;
    durum.style.color = 'var(--green)';
    block.style.borderColor = 'rgba(16,185,129,0.4)';
    block.style.background = 'rgba(16,185,129,0.05)';
  } else {
    durum.textContent = 'Bos';
    durum.style.color = 'var(--text3)';
    block.style.borderColor = 'var(--border2)';
    block.style.background = 'var(--bg4)';
  }
}

async function kaydetYeniBagisci() {
  const tur = document.getElementById('fb-tur').value;
  const kurban_turu = document.getElementById('fb-kurban-turu').value;
  const kupe_no = document.getElementById('fb-kupe').value.trim();
  const alis_fiyati = parseFloat(document.getElementById('fb-alis').value) || 0;
  const kesen_kisi = document.getElementById('fb-kesen').value.trim();
  const toplam = parseInt(document.getElementById('fb-hisseler-wrap').dataset.toplam || '7');

  // Hisse verilerini topla
  const hisseler = [];
  for (let i = 1; i <= toplam; i++) {
    hisseler.push({
      bagisci_adi:        document.getElementById(`fb-ad-${i}`)?.value.trim() || '',
      bagisci_telefon:    document.getElementById(`fb-tel-${i}`)?.value.trim() || '',
      kimin_adina:        document.getElementById(`fb-adina-${i}`)?.value.trim() || '',
      kimin_adina_telefon:document.getElementById(`fb-adina-tel-${i}`)?.value.trim() || '',
      odeme_durumu:       document.getElementById(`fb-odeme-${i}`)?.value || 'bekliyor',
      video_ister:        document.getElementById(`fb-video-${i}`)?.value === '1',
    });
  }

  const doluSayi = hisseler.filter(h => h.bagisci_adi).length;
  if (doluSayi === 0) return toast('En az 1 hisseye bagisci adi girin', 'error');

  try {
    const r = await api('POST', `/organizasyonlar/${S.orgId}/kurban-ve-hisseler`, {
      tur, kurban_turu, kupe_no, alis_fiyati, kesen_kisi, hisseler
    });
    closeModal();
    toast(`Kurban #${r.kurban_no} olusturuldu � ${doluSayi} bagisci kaydedildi`);
    await loadDashStats();
    await loadKurbanlar();
    tumBagiscilariGoster();
  } catch(e) { toast(e.message, 'error'); }
}

// ===========================================================================
// RAPORLAR
// ===========================================================================
async function renderRaporlar() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-chart-bar"></i></div>
        Raporlar & Yazdir
        ${S.orgAd ? '<small>' + esc(S.orgAd) + '</small>' : ''}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-success" onclick="excelIndir()"><i class="fa-solid fa-file-excel"></i> Excel Indir</button>
        <button class="btn btn-secondary" onclick="yazdir('tum')"><i class="fa-solid fa-print"></i> Tum Raporu Yazdir</button>
      </div>
    </div>
    <div id="rapor-icerik"><div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Yukleniyor...</p></div></div>`;

  if (!S.orgId) {
    document.getElementById('rapor-icerik').innerHTML = '<div class="empty-state"><i class="fa-solid fa-layer-group"></i><p>Once bir organizasyon secin.</p></div>';
    return;
  }
  await yukleRapor();
}

async function yukleRapor() {
  const d = await api('GET', '/organizasyonlar/' + S.orgId + '/rapor');
  const { org, kurbanlar, hisseler, ozet } = d;

  let html = '';

  // �zet kartlar
  html += '<div class="stats-grid" style="margin-bottom:20px">';
  html += '<div class="stat-card blue"><div class="stat-icon"><i class="fa-solid fa-cow"></i></div><div class="stat-value">' + ozet.toplam_kurban + '</div><div class="stat-label">Toplam Kurban</div></div>';
  html += '<div class="stat-card blue"><div class="stat-icon"><i class="fa-solid fa-cow"></i></div><div class="stat-value">' + ozet.buyukbas + '</div><div class="stat-label">Buyukbas</div></div>';
  html += '<div class="stat-card yellow"><div class="stat-icon"><i class="fa-solid fa-hippo"></i></div><div class="stat-value">' + ozet.kucukbas + '</div><div class="stat-label">Kucukbas</div></div>';
  html += '<div class="stat-card green"><div class="stat-icon"><i class="fa-solid fa-circle-check"></i></div><div class="stat-value">' + ozet.dolu_hisse + '</div><div class="stat-label">Dolu Hisse</div></div>';
  html += '<div class="stat-card yellow"><div class="stat-icon"><i class="fa-solid fa-circle-half-stroke"></i></div><div class="stat-value">' + ozet.bos_hisse + '</div><div class="stat-label">Bos Hisse</div></div>';
  html += '<div class="stat-card red"><div class="stat-icon"><i class="fa-solid fa-scissors"></i></div><div class="stat-value">' + ozet.kesildi + '</div><div class="stat-label">Kesildi</div></div>';
  html += '<div class="stat-card green"><div class="stat-icon"><i class="fa-solid fa-money-bill"></i></div><div class="stat-value" style="font-size:18px">' + para(ozet.toplam_gelir) + '</div><div class="stat-label">Tahmini Gelir</div></div>';
  html += '<div class="stat-card green"><div class="stat-icon"><i class="fa-solid fa-circle-check"></i></div><div class="stat-value">' + ozet.odendi + '</div><div class="stat-label">Odeme Tamam</div></div>';
  html += '<div class="stat-card yellow"><div class="stat-icon"><i class="fa-solid fa-clock"></i></div><div class="stat-value">' + ozet.bekliyor + '</div><div class="stat-label">Odeme Bekliyor</div></div>';
  html += '</div>';

  // Kurban tablosu
  html += '<div class="card" style="margin-bottom:16px">';
  html += '<div class="card-title"><i class="fa-solid fa-cow"></i> Kurban Listesi';
  html += '<button class="btn btn-secondary btn-sm" style="margin-left:auto" onclick="yazdir(\'kurbanlar\')"><i class="fa-solid fa-print"></i> Yazdir</button></div>';
  html += '<div class="table-wrap"><table><thead><tr>';
  html += '<th>No</th><th>Tur</th><th>Kupe No</th><th>Alis Fiyati</th><th>Hisse</th><th>Durum</th><th>Kesim</th><th>Islem</th>';
  html += '</tr></thead><tbody>';
  kurbanlar.forEach(k => {
    const dolu = k.dolu_hisse, top = k.toplam_hisse;
    const pct = Math.round(dolu/top*100);
    const durum = k.kesildi ? '<span class="badge badge-red">Kesildi</span>' : dolu>=top ? '<span class="badge badge-yellow">Doldu</span>' : '<span class="badge badge-green">Bos</span>';
    html += '<tr>';
    html += '<td><span class="kurban-no-badge">' + k.kurban_no + '</span></td>';
    html += '<td>' + (k.tur==='buyukbas'?'<span class="badge badge-blue">Buyukbas</span>':'<span class="badge badge-gray">Kucukbas</span>') + '</td>';
    html += '<td><span class="badge badge-purple" style="font-size:10px">' + (k.kurban_turu||'Udhiye') + '</span></td>';
    html += '<td>' + (k.kupe_no||'-') + '</td>';
    html += '<td>' + (k.alis_fiyati?para(k.alis_fiyati):'-') + '</td>';
    html += '<td><div style="display:flex;align-items:center;gap:6px;min-width:100px"><div class="progress-bar" style="flex:1"><div class="progress-fill ' + (dolu>=top?'full':'') + '" style="width:' + pct + '%"></div></div><span style="font-size:12px">' + dolu + '/' + top + '</span></div></td>';
    html += '<td>' + durum + '</td>';
    html += '<td>' + (k.kesim_tarihi||'-') + '</td>';
    html += '<td><div style="display:flex;gap:4px">';
    html += '<button class="btn btn-purple btn-sm" onclick="yazdirKurban(' + k.id + ',' + k.kurban_no + ',\'' + k.tur + '\')"><i class="fa-solid fa-print"></i> ' + (k.tur==='buyukbas'?'7li':'Tekli') + '</button>';
    html += '</div></td>';
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';

  // Ba����� tablosu
  html += '<div class="card">';
  html += '<div class="card-title"><i class="fa-solid fa-users"></i> Bagisci Listesi';
  html += '<button class="btn btn-secondary btn-sm" style="margin-left:auto" onclick="yazdir(\'bagiscilar\')"><i class="fa-solid fa-print"></i> Yazdir</button></div>';
  html += '<div class="table-wrap"><table><thead><tr>';
  html += '<th>#</th><th>Kurban No</th><th>Hisse</th><th>Tur</th><th>Bagisci Adi</th><th>Telefon</th><th>Kimin Adina</th><th>Odeme</th><th>Video</th>';
  html += '</tr></thead><tbody>';
  const oRenk = {odendi:'badge-green',iptal:'badge-red',bekliyor:'badge-gray'};
  const oLabel = {odendi:'Odendi',iptal:'Iptal',bekliyor:'Bekliyor'};
  hisseler.forEach((h,i) => {
    html += '<tr>';
    html += '<td style="color:var(--text3);font-size:12px">' + (i+1) + '</td>';
    html += '<td><span class="kurban-no-badge">' + h.kurban_no + '</span></td>';
    html += '<td><span class="badge badge-blue">' + h.hisse_no + '</span></td>';
    html += '<td>' + (h.tur==='buyukbas'?'<span class="badge badge-blue">Buyukbas</span>':'<span class="badge badge-gray">Kucukbas</span>') + '</td>';
    html += '<td><strong>' + esc(h.bagisci_adi) + '</strong></td>';
    html += '<td>' + (h.bagisci_telefon||'-') + '</td>';
    html += '<td>' + (h.kimin_adina?'<span style="color:var(--purple)">'+esc(h.kimin_adina)+'</span>':'-') + '</td>';
    html += '<td><span class="badge ' + (oRenk[h.odeme_durumu]||'badge-gray') + '">' + (oLabel[h.odeme_durumu]||h.odeme_durumu) + '</span></td>';
    html += '<td>' + (h.video_ister?'<span class="badge badge-purple"><i class="fa-solid fa-video"></i> Evet</span>':'-') + '</td>';
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';

  document.getElementById('rapor-icerik').innerHTML = html;
}

function excelIndir() {
  if (!S.orgId) return toast('Once organizasyon secin', 'error');
  downloadExcel('/api/organizasyonlar/' + S.orgId + '/excel', 'defterdar-rapor.xlsx');
}

// ��� YAZDIR FONKS�YONLARI ����������������������������������������������������

function yazdir(tip) {
  if (!S.orgId) return toast('Once organizasyon secin', 'error');
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
  const baslik = tip === 'kurbanlar' ? 'Kurban Listesi' : tip === 'bagiscilar' ? 'Bagisci Listesi' : 'Tam Rapor';
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
    '<div class="header-left">DEFTERDAR MUHASEBE<small>' + baslik + ' &mdash; ' + new Date().toLocaleDateString('tr-TR') + '</small></div>' +
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

  // T�rk bayra�� SVG - her zaman sabit, dosyaya ba��ml� de�il
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
    '<th>Isim Soyisim</th>' +
    '<th style="width:140px;text-align:center">Kurban Turu</th>' +
    '</tr></thead>' +
    '<tbody>' + rows + '</tbody>' +
    '</table>' +
    '</body></html>';

}

// ===========================================================================
// DENET�M MASASI
// ===========================================================================
async function renderDenetim() {
  // IP adresini sunucudan al
  let ipAdresleri = [];
  try {
    const r = await api('GET', '/sistem/ip');
    ipAdresleri = r.ips || [];
  } catch(e) {}

  const ipRows = ipAdresleri.length
    ? ipAdresleri.map(item => {
        const url = 'http://' + item.ip + ':4500';
        return '<tr><td style="color:var(--text3);padding:7px 0;width:130px">' + esc(item.ad||'WiFi') + '</td>' +
          '<td><span style="color:var(--green);font-weight:700;font-size:14px">' + url + '</span>' +
          ' <button class="btn btn-secondary btn-sm" style="margin-left:8px" onclick="navigator.clipboard.writeText(\'' + url + '\').then(()=>toast(\'Kopyalandi\'))"><i class="fa-solid fa-copy"></i></button>' +
          '<div style="font-size:11px;color:var(--text3);margin-top:3px">Ayni WiFi\'deki cihazlar bu adresten girebilir</div></td></tr>';
      }).join('')
    : '<tr><td colspan="2" style="color:var(--text3);padding:7px 0">IP adresi bulunamadi. WiFi baglantinizi kontrol edin.</td></tr>';

  document.getElementById('main-content').innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-shield-halved"></i></div>
        Denetim Masasi
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
      <div class="card" style="grid-column:1/-1;border-color:rgba(16,185,129,0.3);background:rgba(16,185,129,0.05)">
        <div class="card-title"><i class="fa-solid fa-wifi"></i> Ag Erisimi � WiFi'deki Cihazlar</div>
        <table style="font-size:13px;width:100%">
          ${ipRows}
          <tr><td style="color:var(--text3);padding:7px 0;width:130px">Kullanim</td><td style="font-size:12px;color:var(--text2)">Ayni WiFi'deki telefon veya bilgisayardan tarayicida yukardaki adresi ac</td></tr>
        </table>
      </div>
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-circle-info"></i> Uygulama Bilgileri</div>
        <table style="font-size:13px;width:100%">
          <tr><td style="color:var(--text3);padding:7px 0;width:130px">Uygulama</td><td style="font-weight:600">Defterdar Muhasebe</td></tr>
          <tr><td style="color:var(--text3);padding:7px 0">Versiyon</td><td>1.1.0</td></tr>
          <tr><td style="color:var(--text3);padding:7px 0">Gelistirici</td><td style="color:var(--accent);font-weight:600">CMS Team</td></tr>
          <tr><td style="color:var(--text3);padding:7px 0">Kurucu</td><td>Ismail DEMIRCAN</td></tr>
          <tr><td style="color:var(--text3);padding:7px 0">Modul</td><td>Kurban Organizasyonu</td></tr>
          <tr><td style="color:var(--text3);padding:7px 0">Lisans</td><td>CMS Team &copy; 2025</td></tr>
        </table>
      </div>
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-database"></i> Veritabani</div>
        <table style="font-size:13px;width:100%">
          <tr><td style="color:var(--text3);padding:7px 0;width:130px">Motor</td><td>SQLite (sql.js)</td></tr>
          <tr><td style="color:var(--text3);padding:7px 0">Konum</td><td>userData/data/defterdar.db</td></tr>
          <tr><td style="color:var(--text3);padding:7px 0">Durum</td><td><span class="badge badge-green"><i class="fa-solid fa-circle"></i> Aktif</span></td></tr>
        </table>
      </div>
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-gear"></i> Sistem</div>
        <table style="font-size:13px;width:100%">
          <tr><td style="color:var(--text3);padding:7px 0;width:130px">Platform</td><td>Electron + Node.js</td></tr>
          <tr><td style="color:var(--text3);padding:7px 0">Sunucu</td><td>Express.js :4500</td></tr>
          <tr><td style="color:var(--text3);padding:7px 0">Kurulum</td><td>NSIS + MSI</td></tr>
        </table>
      </div>
    </div>`;
}


// ===========================================================================
// ��P KUTUSU
// ===========================================================================
async function renderCopKutusu() {
  const m = document.getElementById('main-content');
  m.innerHTML =
    '<div class="page-header">' +
      '<div class="page-title"><div class="icon-wrap"><i class="fa-solid fa-trash-can"></i></div>Cop Kutusu</div>' +
      '<button class="btn btn-danger" onclick="copBosalt()"><i class="fa-solid fa-trash"></i> Tamamini Sil</button>' +
    '</div>' +
    '<div class="card" id="cop-icerik"><div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Yukleniyor...</p></div></div>';
  await yuklecopKutusu();
}

async function yuklecopKutusu() {
  const list = await api('GET', '/cop-kutusu');
  const el = document.getElementById('cop-icerik');
  if (!list.length) {
    el.innerHTML = '<div class="empty-state"><i class="fa-solid fa-trash-can" style="opacity:.3"></i><p>Cop kutusu bos.</p></div>';
    return;
  }
  const turIcon = { organizasyon: 'fa-layer-group', kurban: 'fa-cow' };
  const turRenk = { organizasyon: 'badge-blue', kurban: 'badge-yellow' };
  let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">';
  html += '<span style="font-size:13px;color:var(--text2)">' + list.length + ' ogre silindi</span>';
  html += '<button class="btn btn-success btn-sm" onclick="copTumunuGeriYukle()"><i class="fa-solid fa-rotate-left"></i> Tamamini Geri Yukle</button>';
  html += '</div>';
  html += '<div class="table-wrap"><table><thead><tr><th>Tur</th><th>Icerik</th><th>Silinme Tarihi</th><th>Islem</th></tr></thead><tbody>';
  list.forEach(item => {
    const tarih = new Date(item.silme_tarihi).toLocaleString('tr-TR');
    html += '<tr>';
    html += '<td><span class="badge ' + (turRenk[item.tur]||'badge-gray') + '"><i class="fa-solid ' + (turIcon[item.tur]||'fa-file') + '"></i> ' + item.tur + '</span></td>';
    html += '<td><strong>' + esc(item.baslik) + '</strong></td>';
    html += '<td style="font-size:12px;color:var(--text3)">' + tarih + '</td>';
    html += '<td><div style="display:flex;gap:6px">';
    html += '<button class="btn btn-success btn-sm" onclick="copGeriYukle(' + item.id + ')"><i class="fa-solid fa-rotate-left"></i> Geri Yukle</button>';
    html += '<button class="btn btn-danger btn-sm btn-icon" onclick="copSil(' + item.id + ')"><i class="fa-solid fa-trash"></i></button>';
    html += '</div></td>';
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  el.innerHTML = html;
}

async function copGeriYukle(id) {
  try {
    await api('POST', '/cop-kutusu/' + id + '/geri-yukle');
    toast('Geri yuklendi');
    await yuklecopKutusu();
  } catch(e) { toast(e.message, 'error'); }
}

async function copTumunuGeriYukle() {
  const list = await api('GET', '/cop-kutusu');
  if (!list.length) return toast('Cop kutusu bos');
  if (!confirm(list.length + ' oge geri yuklenecek. Emin misiniz?')) return;
  for (const item of list) {
    try { await api('POST', '/cop-kutusu/' + item.id + '/geri-yukle'); } catch(e) {}
  }
  toast('Tumu geri yuklendi');
  await yuklecopKutusu();
}

async function copSil(id) {
  if (!confirm('Bu oge kalici olarak silinecek. Emin misiniz?')) return;
  try {
    await api('DELETE', '/cop-kutusu/' + id);
    toast('Kalici olarak silindi');
    await yuklecopKutusu();
  } catch(e) { toast(e.message, 'error'); }
}

async function copBosalt() {
  if (!confirm('Cop kutusu tamamen bosaltilacak. Geri alinamaz. Emin misiniz?')) return;
  try {
    await api('DELETE', '/cop-kutusu');
    toast('Cop kutusu bosaltildi');
    await yuklecopKutusu();
  } catch(e) { toast(e.message, 'error'); }
}

// ��� YAZDIR / EXCEL YARDIMCI �������������������������������������������������
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

async function downloadExcel(url, filename) {
  try {
    toast('Excel hazirlaniyor...');
    if (window.electronAPI && window.electronAPI.downloadFile) {
      // Electron: native save dialog
      const fullUrl = url.startsWith('http') ? url : 'http://127.0.0.1:4500' + url;
    const result = await window.electronAPI.downloadFile(fullUrl, filename);
      if (result && result.ok) toast('Excel kaydedildi: ' + result.path);
      else if (result && !result.ok && !result.error) toast('Iptal edildi');
      else toast('Hata: ' + (result && result.error || 'Bilinmeyen'), 'error');
    } else {
      // Taray�c� fallback
      const r = await fetch(url);
      if (!r.ok) throw new Error('Sunucu hatasi');
      const blob = await r.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 1000);
      toast('Excel indirildi');
    }
  } catch(e) { toast('Excel indirilemedi: ' + e.message, 'error'); }
}

// ��� INIT ���������������������������������������������������������������������
document.addEventListener('DOMContentLoaded', () => {
  showPage('organizasyonlar');

  // Electron kapatma oncesi yedek uyarisi
  if (window.electronAPI && window.electronAPI.onBeforeClose) {
    window.electronAPI.onBeforeClose(() => {
      modalCikisYedek();
    });
  }
});


// --- BAGISCI YAZDIR / EXCEL ---

function yazdirBagiscilar() {
  if (!S.orgId) return toast('Once organizasyon secin', 'error');
  const tbody = document.getElementById('bagisci-tbody');
  if (!tbody) return toast('Bagisci listesi yuklu degil', 'error');

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

  const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bagisci Listesi</title>' +
    '<style>' + printStyle + '</style></head><body>' +
    '<div class="header">' +
    '<img src="' + logoSrc + '" alt="Logo" onerror="this.style.visibility=\'hidden\'"/>' +
    '<div class="header-info">' +
    '<div class="title">' + esc(_kullaniciAdi || 'Kullanici') + '</div>' +
    '<div class="sub">Ba����� Listesi &mdash; ' + new Date().toLocaleDateString('tr-TR') + '</div>' +
    '</div>' +
    '<div class="header-right">Organizasyon: <strong>' + esc(S.orgAd) + '</strong><br>' + S.orgYil + '</div>' +
    '</div>' +
    '<table><thead><tr><th>#</th><th>Ba����� Ad�</th><th>Telefon</th><th>Kimin Ad�na</th><th>Kurban No</th><th>Hisse</th><th>T�r</th><th>�deme</th><th>Video</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table>' +
    '<div class="footer"><span>Defterdar Muhasebe</span><span>' + new Date().toLocaleString('tr-TR') + '</span></div>' +
    '</body></html>';

  printHTML(html);
}

async function excelBagiscilarIndir() {
  if (!S.orgId) return toast('Once organizasyon secin', 'error');
  downloadExcel('/api/organizasyonlar/' + S.orgId + '/excel?sayfa=bagiscilar', 'bagiscilar.xlsx');
}

// ===========================================================================
// KURBAN SATIR BUTONLARI � Yazd�r + Excel + T�m�n�
// ===========================================================================

async function yazdirKurbanSatir(kurbanId) {
  const k = _kurbanlar.find(x => x.id === kurbanId);
  if (!k) return;
  const hisseler = await api('GET', '/kurbanlar/' + kurbanId + '/hisseler');
  printHTML(kurbanYazdirHTML(k.kurban_no, k.tur, hisseler, k));
}

async function excelKurbanSatir(kurbanId) {
  downloadExcel('/api/kurbanlar/' + kurbanId + '/excel', 'kurban-' + kurbanId + '.xlsx');
}

async function tumKurbanlariYazdir() {
  if (!S.orgId) return toast('Once organizasyon secin', 'error');
  if (!_kurbanlar.length) return toast('Kurban bulunamadi', 'error');
  toast('Hazirlan�yor...');
  let allHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;font-size:11px;margin:10px}@media print{.pb{page-break-after:always}}</style></head><body>';
  for (const k of _kurbanlar) {
    const hisseler = await api('GET', '/kurbanlar/' + k.id + '/hisseler');
    const oLabel = {odendi:'Odendi',iptal:'Iptal',bekliyor:'Bekliyor'};
    let rows = hisseler.map(h => '<tr><td>' + h.hisse_no + '</td><td>' + (h.bagisci_adi||'-') + '</td><td>' + (h.bagisci_telefon||'-') + '</td><td>' + (h.kimin_adina||'-') + '</td><td>' + (oLabel[h.odeme_durumu]||'-') + '</td><td>' + (h.video_ister?'Evet':'Hayir') + '</td></tr>').join('');
    allHtml += '<div style="margin-bottom:20px">';
    allHtml += '<div style="display:flex;justify-content:space-between;border-bottom:2px solid #1a2a50;padding-bottom:6px;margin-bottom:10px">';
    allHtml += '<strong style="font-size:14px;color:#1a2a50">DEFTERDAR MUHASEBE &mdash; Kurban #' + k.kurban_no + '</strong>';
    allHtml += '<span style="font-size:11px;color:#555">' + esc(S.orgAd) + ' | ' + S.orgYil + '</span></div>';
    allHtml += '<table style="width:100%;border-collapse:collapse;margin-bottom:8px"><tr style="background:#1a2a50;color:#fff"><th style="padding:5px">Hisse</th><th>Bagisci</th><th>Telefon</th><th>Kimin Adina</th><th>Odeme</th><th>Video</th></tr>' + rows + '</table>';
    allHtml += '<div style="font-size:10px;color:#999;display:flex;justify-content:space-between;border-top:1px solid #ddd;padding-top:4px"><span>Defterdar Muhasebe</span><span></span></div>';
    allHtml += '</div><div class="pb"></div>';
  }
  allHtml += '</body></html>';
  printHTML(allHtml);
}

async function tumKurbanlariExcel() {
  if (!S.orgId) return toast('Once organizasyon secin', 'error');
  downloadExcel('/api/organizasyonlar/' + S.orgId + '/excel', 'defterdar-rapor.xlsx');
}


// ===========================================================================
// VER� Y�KLEME
// ===========================================================================
async function renderVeriYukle() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-file-import"></i></div>
        Veri Y�kleme
        <small>Excel Dosyas�ndan ��e Aktar</small>
      </div>
    </div>

    <div class="card" style="background:rgba(16,185,129,0.05);border-color:rgba(16,185,129,0.3);margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:12px">
        <i class="fa-solid fa-info-circle" style="font-size:24px;color:var(--green)"></i>
        <div style="flex:1">
          <div style="font-weight:600;margin-bottom:4px">Excel dosyas�ndan organizasyon, kurban ve ba����� verilerini y�kleyebilirsiniz</div>
          <div style="font-size:12px;color:var(--text3)">Mevcut veriler korunur, sadece yeni veriler eklenir. Ayn� organizasyon/kurban varsa atlan�r.</div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-upload"></i> Dosya Y�kle</div>
        <div class="upload-zone" id="veri-upload-zone" onclick="document.getElementById('veri-file-input').click()"
          ondragover="event.preventDefault();this.classList.add('drag-over')"
          ondragleave="this.classList.remove('drag-over')"
          ondrop="handleVeriDrop(event)">
          <i class="fa-solid fa-file-excel"></i>
          <p>Excel dosyas�n� buraya s�r�kle veya t�kla</p>
          <small>Desteklenen format: .xlsx</small>
          <div class="upload-progress" id="veri-upload-progress">
            <div class="upload-progress-fill" id="veri-upload-progress-fill" style="width:0%"></div>
          </div>
        </div>
        <input type="file" id="veri-file-input" style="display:none"
          accept=".xlsx,.xls"
          onchange="yukleVeriDosyasi(this.files[0])"/>
        <div id="veri-upload-result" style="margin-top:12px"></div>
      </div>

      <div class="card">
        <div class="card-title"><i class="fa-solid fa-table"></i> Excel Format�</div>
        <div style="font-size:13px;color:var(--text2);line-height:1.6">
          <strong>Sayfa 1: Organizasyonlar</strong><br>
          S�tunlar: Ad, Y�l, Max Kurban, B�y�kba� Fiyat, K���kba� Fiyat, A��klama<br><br>
          
          <strong>Sayfa 2: Kurbanlar</strong><br>
          S�tunlar: Org Ad, Org Y�l, Kurban No, T�r, Kurban T�r�, K�pe No, Al�� Fiyat�, Kesen Ki�i<br><br>
          
          <strong>Sayfa 3: Ba�����lar</strong><br>
          S�tunlar: Org Ad, Org Y�l, Kurban No, Hisse No, Ba����� Ad�, Telefon, Kimin Ad�na, �deme, Video
        </div>
        <div class="form-actions" style="margin-top:12px">
          <button class="btn btn-secondary" onclick="indirOrnek()">
            <i class="fa-solid fa-download"></i> �rnek Dosya �ndir
          </button>
        </div>
      </div>
    </div>

    <div class="card" id="veri-sonuc" style="display:none">
      <div class="card-title"><i class="fa-solid fa-check-circle"></i> Y�kleme Sonucu</div>
      <div id="veri-sonuc-icerik"></div>
    </div>`;
}

function handleVeriDrop(e) {
  e.preventDefault();
  document.getElementById('veri-upload-zone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) yukleVeriDosyasi(file);
}

async function yukleVeriDosyasi(file) {
  if (!file) return;
  
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    toast('Sadece Excel dosyalar� (.xlsx, .xls) desteklenir', 'error');
    return;
  }
  
  const prog = document.getElementById('veri-upload-progress');
  const fill = document.getElementById('veri-upload-progress-fill');
  const result = document.getElementById('veri-upload-result');
  const sonuc = document.getElementById('veri-sonuc');
  
  if (prog) { prog.style.display = 'block'; fill.style.width = '10%'; }

  const formData = new FormData();
  formData.append('dosya', file);

  try {
    if (fill) fill.style.width = '40%';
    const r = await fetch('/api/veri-yukle', { method: 'POST', body: formData });
    if (fill) fill.style.width = '90%';
    const data = await r.json();
    
    if (!r.ok) {
      throw new Error(data.hata || 'Y�kleme ba�ar�s�z');
    }
    
    if (fill) fill.style.width = '100%';
    
    if (result) result.innerHTML = `
      <div class="badge badge-green" style="font-size:12px;padding:8px 14px">
        <i class="fa-solid fa-circle-check"></i> ${data.mesaj}
      </div>`;
    
    // Sonu� detay�n� g�ster
    if (sonuc) {
      sonuc.style.display = 'block';
      const detay = data.detay;
      let html = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px">
          <div class="stat-card green">
            <div class="stat-icon"><i class="fa-solid fa-layer-group"></i></div>
            <div class="stat-value">${detay.organizasyonlar}</div>
            <div class="stat-label">Organizasyon</div>
          </div>
          <div class="stat-card blue">
            <div class="stat-icon"><i class="fa-solid fa-cow"></i></div>
            <div class="stat-value">${detay.kurbanlar}</div>
            <div class="stat-label">Kurban</div>
          </div>
          <div class="stat-card purple">
            <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
            <div class="stat-value">${detay.hisseler}</div>
            <div class="stat-label">Ba�����</div>
          </div>
        </div>`;
      
      if (detay.errors && detay.errors.length > 0) {
        html += `<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px">
          <div style="font-weight:600;color:var(--red);margin-bottom:8px">
            <i class="fa-solid fa-triangle-exclamation"></i> Hatalar (${detay.errors.length})
          </div>
          <div style="font-size:12px;color:var(--text2);max-height:120px;overflow-y:auto">
            ${detay.errors.map(e => `<div>� ${esc(e)}</div>`).join('')}
          </div>
        </div>`;
      }
      
      document.getElementById('veri-sonuc-icerik').innerHTML = html;
    }
    
    toast('Veri y�kleme tamamland�');
    setTimeout(() => { 
      if (prog) prog.style.display = 'none';
      renderOrganizasyonlar(); 
    }, 2000);
  } catch(e) {
    if (result) result.innerHTML = `<div class="badge badge-red" style="font-size:12px;padding:8px 14px"><i class="fa-solid fa-circle-xmark"></i> ${e.message}</div>`;
    toast(e.message, 'error');
    if (prog) prog.style.display = 'none';
  }
}

async function indirOrnek() {
  // �rnek Excel dosyas� olu�tur
  const ExcelJS = window.ExcelJS || await import('https://cdn.skypack.dev/exceljs');
  const wb = new ExcelJS.Workbook();
  
  // Organizasyonlar sayfas�
  const wsOrg = wb.addWorksheet('Organizasyonlar');
  wsOrg.columns = [
    { header: 'Ad', key: 'ad', width: 20 },
    { header: 'Y�l', key: 'yil', width: 8 },
    { header: 'Max Kurban', key: 'max_kurban', width: 12 },
    { header: 'B�y�kba� Fiyat', key: 'buyukbas_fiyat', width: 15 },
    { header: 'K���kba� Fiyat', key: 'kucukbas_fiyat', width: 15 },
    { header: 'A��klama', key: 'aciklama', width: 25 }
  ];
  wsOrg.addRow({ ad: 'Kurban Organizasyonu 2025', yil: 2025, max_kurban: 50, buyukbas_fiyat: 3500, kucukbas_fiyat: 500, aciklama: '�rnek organizasyon' });
  
  // Kurbanlar sayfas�
  const wsKurban = wb.addWorksheet('Kurbanlar');
  wsKurban.columns = [
    { header: 'Org Ad', key: 'org_ad', width: 20 },
    { header: 'Org Y�l', key: 'org_yil', width: 8 },
    { header: 'Kurban No', key: 'kurban_no', width: 10 },
    { header: 'T�r', key: 'tur', width: 12 },
    { header: 'Kurban T�r�', key: 'kurban_turu', width: 12 },
    { header: 'K�pe No', key: 'kupe_no', width: 12 },
    { header: 'Al�� Fiyat�', key: 'alis_fiyati', width: 12 },
    { header: 'Kesen Ki�i', key: 'kesen_kisi', width: 20 }
  ];
  wsKurban.addRow({ org_ad: 'Kurban Organizasyonu 2025', org_yil: 2025, kurban_no: 1, tur: 'buyukbas', kurban_turu: 'Udhiye', kupe_no: 'K001', alis_fiyati: 15000, kesen_kisi: 'Ahmet Kasap' });
  
  // Ba�����lar sayfas�
  const wsBagisci = wb.addWorksheet('Ba�����lar');
  wsBagisci.columns = [
    { header: 'Org Ad', key: 'org_ad', width: 20 },
    { header: 'Org Y�l', key: 'org_yil', width: 8 },
    { header: 'Kurban No', key: 'kurban_no', width: 10 },
    { header: 'Hisse No', key: 'hisse_no', width: 8 },
    { header: 'Ba����� Ad�', key: 'bagisci_adi', width: 20 },
    { header: 'Telefon', key: 'telefon', width: 15 },
    { header: 'Kimin Ad�na', key: 'kimin_adina', width: 20 },
    { header: '�deme', key: 'odeme', width: 10 },
    { header: 'Video', key: 'video', width: 8 }
  ];
  wsBagisci.addRow({ org_ad: 'Kurban Organizasyonu 2025', org_yil: 2025, kurban_no: 1, hisse_no: 1, bagisci_adi: 'Ali Veli', telefon: '0555 123 4567', kimin_adina: 'Fatma Veli', odeme: '�dendi', video: 'Evet' });
  
  // Dosyay� indir
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'defterdar-ornek-veri.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('�rnek dosya indirildi');
}

// ===========================================================================
// TEMA TOGGLE
// ===========================================================================
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('defterdar-tema', isLight ? 'light' : 'dark');
}

// Sayfa y�klenince kay�tl� temay� uygula
(function initTheme() {
  const saved = localStorage.getItem('defterdar-tema');
  if (saved === 'light') {
    document.body.classList.add('light');
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = 'fa-solid fa-sun';
  }
})();

// ===========================================================================
// MEDYA DEPOSU (Cloudinary)
// ===========================================================================
async function renderMedyaDeposu() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-photo-film"></i></div>
        Medya Deposu
        <small>Cloudinary</small>
      </div>
      <div style="display:flex;gap:8px">
        <select id="medya-folder" onchange="loadMedyaListesi()" style="background:var(--bg4);border:1px solid var(--border2);border-radius:8px;padding:8px 12px;color:var(--text);font-size:13px;outline:none">
          <option value="defterdar">Genel</option>
          <option value="defterdar/videolar">Videolar</option>
          <option value="defterdar/fotograflar">Fotograflar</option>
          <option value="defterdar/belgeler">Belgeler</option>
        </select>
        <button class="btn btn-primary" onclick="modalMedyaYukle()">
          <i class="fa-solid fa-upload"></i> Dosya Yukle
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><i class="fa-solid fa-cloud"></i> Yuklenen Dosyalar</div>
      <div id="medya-grid-wrap">
        <div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Yukleniyor...</p></div>
      </div>
    </div>`;

  await loadMedyaListesi();
}

async function loadMedyaListesi() {
  const folder = document.getElementById('medya-folder')?.value || 'defterdar';
  const wrap = document.getElementById('medya-grid-wrap');
  if (!wrap) return;
  wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Yukleniyor...</p></div>`;
  try {
    const list = await api('GET', `/medya/list?folder=${encodeURIComponent(folder)}`);
    if (!list.length) {
      wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-photo-film"></i><p>Henuz dosya yok.</p></div>`;
      return;
    }
    wrap.innerHTML = `<div class="medya-grid">${list.map(item => medyaKart(item)).join('')}</div>`;
  } catch(e) {
    wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${e.message}</p></div>`;
  }
}

function medyaKart(item) {
  const isVideo = item.resource_type === 'video';
  const kb = Math.round(item.bytes / 1024);
  const boyut = kb > 1024 ? (kb/1024).toFixed(1) + ' MB' : kb + ' KB';
  const thumb = isVideo
    ? `<div class="medya-video-thumb"><i class="fa-solid fa-circle-play"></i></div>`
    : `<img src="${item.secure_url}" alt="medya" loading="lazy"/>`;
  return `
    <div class="medya-item" onclick="medyaOnizle('${item.secure_url}','${item.resource_type}')">
      ${thumb}
      <div class="medya-info">
        <div class="medya-type">${isVideo ? 'Video' : 'Fotograf'} &bull; ${item.format||''}</div>
        <div class="medya-size">${boyut}</div>
      </div>
      <button class="medya-del" onclick="event.stopPropagation();medyaSil('${item.public_id}','${item.resource_type}')" title="Sil">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`;
}

function medyaOnizle(url, type) {
  const isVideo = type === 'video';
  const content = isVideo
    ? `<video src="${url}" controls style="width:100%;border-radius:8px;max-height:60vh"></video>`
    : `<img src="${url}" style="width:100%;border-radius:8px;max-height:70vh;object-fit:contain"/>`;
  openModal('Onizleme', `
    ${content}
    <div class="form-actions" style="margin-top:12px">
      <a href="${url}" target="_blank" class="btn btn-secondary"><i class="fa-solid fa-external-link"></i> Yeni Sekmede Ac</a>
      <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
    </div>`, true, 'eye');
}

async function medyaSil(publicId, resourceType) {
  if (!confirm('Bu dosyayi silmek istediginizden emin misiniz?')) return;
  try {
    await api('DELETE', '/medya/delete', { public_id: publicId, resource_type: resourceType });
    toast('Dosya silindi');
    await loadMedyaListesi();
  } catch(e) { toast(e.message, 'error'); }
}

function modalMedyaYukle() {
  const folder = document.getElementById('medya-folder')?.value || 'defterdar';
  openModal('Dosya Yukle', `
    <div class="upload-zone" id="upload-zone" onclick="document.getElementById('medya-file-input').click()"
      ondragover="event.preventDefault();this.classList.add('drag-over')"
      ondragleave="this.classList.remove('drag-over')"
      ondrop="handleMedyaDrop(event)">
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <p>Dosyayi buraya surukle veya tikla</p>
      <small>Resim: JPG, PNG, WEBP &bull; Video: MP4, MOV, WEBM (maks. 100MB)</small>
      <div class="upload-progress" id="upload-progress">
        <div class="upload-progress-fill" id="upload-progress-fill" style="width:0%"></div>
      </div>
    </div>
    <input type="file" id="medya-file-input" style="display:none"
      accept="image/*,video/*"
      onchange="yukleSeciliDosya(this.files[0],'${folder}')"/>
    <div id="upload-result" style="margin-top:12px"></div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
    </div>`, false, 'upload');
}

function handleMedyaDrop(e) {
  e.preventDefault();
  document.getElementById('upload-zone').classList.remove('drag-over');
  const folder = document.getElementById('medya-folder')?.value || 'defterdar';
  const file = e.dataTransfer.files[0];
  if (file) yukleSeciliDosya(file, folder);
}

async function yukleSeciliDosya(file, folder) {
  if (!file) return;
  
  const prog = document.getElementById('upload-progress');
  const fill = document.getElementById('upload-progress-fill');
  const result = document.getElementById('upload-result');
  if (prog) { prog.style.display = 'block'; fill.style.width = '10%'; }

  const formData = new FormData();
  formData.append('dosya', file);
  formData.append('folder', folder);

  try {
    if (fill) fill.style.width = '40%';
    const r = await fetch('/api/medya/upload', { method: 'POST', body: formData });
    if (fill) fill.style.width = '90%';
    const data = await r.json();
    if (!r.ok) {
      throw new Error(data.hata || 'Yuklenemedi');
    }
    if (fill) fill.style.width = '100%';
    if (result) result.innerHTML = `
      <div class="badge badge-green" style="font-size:12px;padding:8px 14px">
        <i class="fa-solid fa-circle-check"></i> Yuklendi: ${file.name}
      </div>`;
    toast('Dosya yuklendi');
    setTimeout(() => { closeModal(); loadMedyaListesi(); }, 800);
  } catch(e) {
    if (result) result.innerHTML = `<div class="badge badge-red" style="font-size:12px;padding:8px 14px"><i class="fa-solid fa-circle-xmark"></i> ${e.message}</div>`;
    toast(e.message, 'error');
  }
}

// Hisse modal�na medya y�kleme butonu ekle (hisse kaydedilince �a�r�labilir)
async function modalHisseMedya(hisseId, kurbanNo, hisseNo) {
  const folder = `defterdar/kurban-${kurbanNo}/hisse-${hisseNo}`;
  openModal(`Kurban #${kurbanNo} Hisse ${hisseNo} � Medya`, `
    <div class="upload-zone" id="upload-zone" onclick="document.getElementById('hisse-file-input').click()"
      ondragover="event.preventDefault();this.classList.add('drag-over')"
      ondragleave="this.classList.remove('drag-over')"
      ondrop="handleHisseDrop(event,'${folder}')">
      <i class="fa-solid fa-video"></i>
      <p>Video veya fotograf yukle</p>
      <small>Bu hisseye ait kesim videosu veya fotografini yukleyin</small>
      <div class="upload-progress" id="upload-progress">
        <div class="upload-progress-fill" id="upload-progress-fill" style="width:0%"></div>
      </div>
    </div>
    <input type="file" id="hisse-file-input" style="display:none"
      accept="image/*,video/*"
      onchange="yukleSeciliDosya(this.files[0],'${folder}')"/>
    <div id="upload-result" style="margin-top:12px"></div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
    </div>`, false, 'video');
}

// ��� MEDYA DEPOSU � V�DEO Y�KLEME (Ba����� Se�imli) �������������������������
async function modalVideoYukle() {
  if (!S.orgId) return toast('�nce bir organizasyon se�in', 'error');

  // Video isteyen ba�����lar� getir
  let bagiscilar = [];
  try {
    bagiscilar = await api('GET', `/organizasyonlar/${S.orgId}/video-isteyenler`);
  } catch(e) {}

  const bagisciOpts = bagiscilar.length
    ? bagiscilar.map(h =>
        `<option value="${h.id}" data-kurban="${h.kurban_no}" data-hisse="${h.hisse_no}">
          Kurban #${h.kurban_no} Hisse ${h.hisse_no} � ${esc(h.bagisci_adi)} ${h.bagisci_telefon ? '(' + esc(h.bagisci_telefon) + ')' : ''} ${h.video_url ? '?' : ''}
        </option>`
      ).join('')
    : '<option value="">Video isteyen ba����� bulunamad�</option>';

  openModal('Video Y�kle � Ba����� Se�', `
    <div class="form-group" style="margin-bottom:16px">
      <label><i class="fa-solid fa-users"></i> Hangi Ba�����ya Y�klenecek?</label>
      <select id="video-bagisci-select" style="width:100%" onchange="videoHisseSecildi()">
        <option value="">-- Ba����� se�in --</option>
        ${bagisciOpts}
      </select>
      <div style="font-size:11px;color:var(--text3);margin-top:4px">Sadece "Video �stiyor" olarak i�aretlenen ba�����lar listelenir</div>
    </div>
    <div id="video-bagisci-bilgi" style="display:none;background:var(--bg4);border:1px solid var(--border2);border-radius:8px;padding:12px;margin-bottom:16px;font-size:13px"></div>
    <div class="upload-zone" id="video-upload-zone" onclick="document.getElementById('video-yukle-input').click()"
      ondragover="event.preventDefault();this.classList.add('drag-over')"
      ondragleave="this.classList.remove('drag-over')"
      ondrop="handleVideoDrop(event)">
      <i class="fa-solid fa-video" style="font-size:28px;color:var(--text3);margin-bottom:8px"></i>
      <p style="margin:0;color:var(--text3)">Video dosyas�n� buraya s�r�kle veya t�kla</p>
      <small style="color:var(--text3)">MP4, MOV, WEBM (maks. 100MB)</small>
      <div class="upload-progress" id="video-upload-progress" style="display:none;margin-top:10px">
        <div class="upload-progress-fill" id="video-upload-progress-fill" style="width:0%"></div>
      </div>
    </div>
    <input type="file" id="video-yukle-input" style="display:none" accept="video/*" onchange="yukleVideoIcinBagisci(this.files[0])"/>
    <div id="video-upload-result" style="margin-top:12px"></div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
    </div>
  `, false, 'video');
}

function videoHisseSecildi() {
  const sel = document.getElementById('video-bagisci-select');
  const opt = sel.options[sel.selectedIndex];
  const bilgi = document.getElementById('video-bagisci-bilgi');
  if (!sel.value) { bilgi.style.display = 'none'; return; }
  const kurbanNo = opt.dataset.kurban;
  const hisseNo = opt.dataset.hisse;
  bilgi.style.display = 'block';
  bilgi.innerHTML = `<i class="fa-solid fa-info-circle" style="color:var(--accent)"></i> Kurban <strong>#${kurbanNo}</strong> � Hisse <strong>${hisseNo}</strong> i�in video y�klenecek`;
}

function handleVideoDrop(e) {
  e.preventDefault();
  document.getElementById('video-upload-zone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) yukleVideoIcinBagisci(file);
}

async function yukleVideoIcinBagisci(file) {
  if (!file) return;
  const hisseId = document.getElementById('video-bagisci-select').value;
  if (!hisseId) {
    toast('�nce bir ba����� se�in', 'error');
    return;
  }
  if (!file.type.startsWith('video/')) {
    toast('Sadece video dosyalar� y�klenebilir', 'error');
    return;
  }

  const prog = document.getElementById('video-upload-progress');
  const fill = document.getElementById('video-upload-progress-fill');
  const result = document.getElementById('video-upload-result');
  if (prog) { prog.style.display = 'block'; fill.style.width = '10%'; }

  const formData = new FormData();
  formData.append('dosya', file);
  formData.append('folder', `defterdar/hisse-${hisseId}`);

  try {
    if (fill) fill.style.width = '40%';
    const r = await fetch('/api/medya/upload', { method: 'POST', body: formData });
    if (fill) fill.style.width = '90%';
    const data = await r.json();
    if (!r.ok) throw new Error(data.hata || 'Y�klenemedi');
    if (fill) fill.style.width = '100%';

    // Hisse tablosuna video URL'ini kaydet
    await api('PUT', `/hisseler/${hisseId}`, {
      video_url: data.url,
      video_public_id: data.public_id
    });

    if (result) result.innerHTML = `
      <div class="badge badge-green" style="font-size:12px;padding:8px 14px">
        <i class="fa-solid fa-circle-check"></i> Video y�klendi ve ba�����ya atand�!
      </div>`;
    toast('Video y�klendi');
    setTimeout(() => closeModal(), 1500);
  } catch(e) {
    if (result) result.innerHTML = `<div class="badge badge-red" style="font-size:12px;padding:8px 14px"><i class="fa-solid fa-circle-xmark"></i> ${e.message}</div>`;
    toast(e.message, 'error');
    if (prog) prog.style.display = 'none';
  }
}

function handleHisseDrop(e, folder) {
  e.preventDefault();
  document.getElementById('upload-zone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) yukleSeciliDosya(file, folder);
}


// ===========================================================================
// ═══════════════════════════════════════════════════════════════════════════
// DEFTERDAR PRO - Dosyalar duruyor, ileride kullanilacak
// ═══════════════════════════════════════════════════════════════════════════
async function renderProSayfasi() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap" style="background:linear-gradient(135deg,#10b981,#059669)"><i class="fa-solid fa-infinity"></i></div>
        Sinirsizsiz Erisim
      </div>
    </div>
    <div class="card" style="background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.05));border-color:rgba(16,185,129,0.3)">
      <div style="text-align:center;padding:30px">
        <div style="font-size:52px;margin-bottom:14px">&#127881;</div>
        <div style="font-size:22px;font-weight:800;color:var(--green);margin-bottom:10px">Tum Ozellikler Aktif!</div>
        <div style="font-size:14px;color:var(--text2)">Sinirsiz bagisci, sinirsiz medya, tum ozellikler acik.</div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIDEO ISTEYENLER
// ═══════════════════════════════════════════════════════════════════════════
async function renderVideoIsteyenler() {
  if (!S.orgId) { showPage('organizasyonlar'); return; }
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-video"></i></div>
        Video Isteyenler
        ${S.orgAd ? '<small>' + esc(S.orgAd) + '</small>' : ''}
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" onclick="modalVideoYukle()">
          <i class="fa-solid fa-upload"></i> Video Yukle
        </button>
      </div>
    </div>
    <div class="card" id="video-isteyenler-icerik">
      <div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Yukleniyor...</p></div>
    </div>`;
  await yukleVideoIsteyenler();
}

async function yukleVideoIsteyenler() {
  const el = document.getElementById('video-isteyenler-icerik');
  if (!el) return;
  try {
    const list = await api('GET', `/organizasyonlar/${S.orgId}/video-isteyenler`);
    if (!list.length) {
      el.innerHTML = '<div class="empty-state"><i class="fa-solid fa-video-slash"></i><p>Video isteyen bagisci bulunamadi.</p></div>';
      return;
    }

    const yuklendi = list.filter(h => h.video_url).length;
    const bekliyor = list.length - yuklendi;

    let html = `
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap">
        <span style="font-size:13px;color:var(--text2)"><strong>${list.length}</strong> bagisci video istiyor</span>
        <span class="badge badge-green"><i class="fa-solid fa-circle-check"></i> ${yuklendi} video yuklendi</span>
        <span class="badge badge-yellow"><i class="fa-solid fa-clock"></i> ${bekliyor} bekliyor</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>#</th>
            <th>Kurban</th>
            <th>Hisse</th>
            <th>Bagisci Adi</th>
            <th>Telefon</th>
            <th>Video Durumu</th>
            <th>Islem</th>
          </tr></thead>
          <tbody>`;

    list.forEach((h, i) => {
      const videoVar = !!h.video_url;
      html += `<tr>
        <td style="color:var(--text3);font-size:12px">${i+1}</td>
        <td><span class="kurban-no-badge">${h.kurban_no}</span></td>
        <td><span class="badge badge-blue">${h.hisse_no}</span></td>
        <td>
          <strong>${esc(h.bagisci_adi)}</strong>
          ${h.kimin_adina ? '<div style="font-size:11px;color:var(--text3)"><i class="fa-solid fa-heart"></i> ' + esc(h.kimin_adina) + '</div>' : ''}
        </td>
        <td>${h.bagisci_telefon ? esc(h.bagisci_telefon) : '<span style="color:var(--text3)">-</span>'}</td>
        <td>${videoVar
          ? '<span class="badge badge-green"><i class="fa-solid fa-circle-check"></i> Yuklendi</span>'
          : '<span class="badge badge-yellow"><i class="fa-solid fa-clock"></i> Bekleniyor</span>'
        }</td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${videoVar
              ? `<a href="${h.video_url}" target="_blank" class="btn btn-secondary btn-sm">
                   <i class="fa-solid fa-eye"></i> Izle
                 </a>
                 <button class="btn btn-success btn-sm" onclick="whatsappGonder('${h.id}','${esc(h.bagisci_adi).replace(/'/g,"\\'")}','${(h.bagisci_telefon||'').replace(/'/g,"\\'")}','${h.video_url}')">
                   <i class="fa-brands fa-whatsapp"></i> WhatsApp
                 </button>`
              : `<button class="btn btn-primary btn-sm" onclick="modalVideoYukleHisse(${h.id},'${esc(h.bagisci_adi).replace(/'/g,"\\'")}',${h.kurban_no},${h.hisse_no})">
                   <i class="fa-solid fa-upload"></i> Video Yukle
                 </button>`
            }
          </div>
        </td>
      </tr>`;
    });

    html += '</tbody></table></div>';
    el.innerHTML = html;
  } catch(e) {
    el.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${e.message}</p></div>`;
  }
}

function whatsappGonder(hisseId, bagisciAdi, telefon, videoUrl) {
  if (!telefon || telefon.trim() === '') {
    openModal('WhatsApp Gonder', `
      <div style="margin-bottom:16px">
        <div style="font-weight:600;margin-bottom:10px;font-size:15px">
          <i class="fa-brands fa-whatsapp" style="color:#25D366;font-size:20px"></i>
          ${esc(bagisciAdi)}
        </div>
        <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px;font-size:13px;color:var(--red);margin-bottom:14px">
          <i class="fa-solid fa-triangle-exclamation"></i>
          Bu bagiscinin telefon numarasi kayitli degil.
        </div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:8px">Video linkini kopyalayip manuel olarak gonderebilirsiniz:</div>
        <div style="background:var(--bg4);border:1px solid var(--border2);border-radius:8px;padding:10px;font-size:12px;word-break:break-all;user-select:all">${videoUrl}</div>
      </div>
      <div class="form-actions">
        <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
        <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${videoUrl}').then(()=>toast('Link kopyalandi'))">
          <i class="fa-solid fa-copy"></i> Linki Kopyala
        </button>
      </div>
    `, false, 'whatsapp');
    return;
  }

  // Telefon numarasini uluslararasi formata cevir
  const temizTel = telefon.replace(/\D/g, '');
  let uluslararasiTel;
  if (temizTel.startsWith('90') && temizTel.length === 12) {
    uluslararasiTel = temizTel;
  } else if (temizTel.startsWith('0') && temizTel.length === 11) {
    uluslararasiTel = '90' + temizTel.slice(1);
  } else if (temizTel.length === 10) {
    uluslararasiTel = '90' + temizTel;
  } else {
    uluslararasiTel = '90' + temizTel;
  }

  const mesajMetni = 'Sayin ' + bagisciAdi + ', kurban kesim videonuz hazir. Asagidaki linkten izleyebilirsiniz:\n' + videoUrl;
  const waUrl = 'https://wa.me/' + uluslararasiTel + '?text=' + encodeURIComponent(mesajMetni);

  openModal('WhatsApp Gonder', `
    <div style="margin-bottom:16px">
      <div style="font-weight:600;margin-bottom:14px;font-size:15px;display:flex;align-items:center;gap:8px">
        <i class="fa-brands fa-whatsapp" style="color:#25D366;font-size:22px"></i>
        ${esc(bagisciAdi)}
      </div>
      <div style="background:var(--bg4);border:1px solid var(--border2);border-radius:10px;padding:14px;margin-bottom:14px">
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Gonderilecek mesaj:</div>
        <div style="font-size:13px;line-height:1.6">
          Sayin <strong>${esc(bagisciAdi)}</strong>, kurban kesim videonuz hazir. Asagidaki linkten izleyebilirsiniz:<br>
          <a href="${videoUrl}" target="_blank" style="color:var(--accent);font-size:11px;word-break:break-all">${videoUrl}</a>
        </div>
      </div>
      <div style="font-size:13px;color:var(--text2);display:flex;align-items:center;gap:8px">
        <i class="fa-solid fa-phone" style="color:var(--green)"></i>
        Telefon: <strong>${esc(telefon)}</strong>
        <span style="font-size:11px;color:var(--text3)">(+${uluslararasiTel})</span>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${videoUrl}').then(()=>toast('Link kopyalandi'))">
        <i class="fa-solid fa-copy"></i> Linki Kopyala
      </button>
      <button class="btn btn-success" onclick="window.open('${waUrl}','_blank');closeModal()">
        <i class="fa-brands fa-whatsapp"></i> WhatsApp'ta Ac
      </button>
    </div>
  `, false, 'whatsapp');
}

async function modalVideoYukle() {
  if (!S.orgId) return toast('Once bir organizasyon secin', 'error');

  let bagiscilar = [];
  try {
    bagiscilar = await api('GET', `/organizasyonlar/${S.orgId}/video-isteyenler`);
  } catch(e) {}

  const bagisciOpts = bagiscilar.length
    ? bagiscilar.map(h => {
        const videoVar = h.video_url ? ' [VIDEO VAR]' : '';
        return `<option value="${h.id}" data-kurban="${h.kurban_no}" data-hisse="${h.hisse_no}" data-ad="${esc(h.bagisci_adi)}">${videoVar ? '✅' : '⏳'} Kurban #${h.kurban_no} Hisse ${h.hisse_no} — ${esc(h.bagisci_adi)}${h.bagisci_telefon ? ' (' + esc(h.bagisci_telefon) + ')' : ''}${videoVar}</option>`;
      }).join('')
    : '<option value="">Video isteyen bagisci bulunamadi</option>';

  openModal('Video Yukle — Bagisci Sec', `
    <div class="form-group" style="margin-bottom:16px">
      <label><i class="fa-solid fa-users"></i> Hangi Bagisciya Yuklenecek?</label>
      <select id="video-bagisci-select" style="width:100%" onchange="videoHisseSecildi()">
        <option value="">-- Bagisci secin --</option>
        ${bagisciOpts}
      </select>
      <div style="font-size:11px;color:var(--text3);margin-top:4px">
        Sadece "Video Istiyor" olarak isaretlenen bagiscilar listelenir
      </div>
    </div>
    <div id="video-bagisci-bilgi" style="display:none;background:var(--bg4);border:1px solid var(--border2);border-radius:8px;padding:12px;margin-bottom:16px;font-size:13px"></div>
    <div class="upload-zone" id="video-upload-zone" onclick="document.getElementById('video-yukle-input').click()"
      ondragover="event.preventDefault();this.classList.add('drag-over')"
      ondragleave="this.classList.remove('drag-over')"
      ondrop="event.preventDefault();this.classList.remove('drag-over');handleVideoDrop(event)">
      <i class="fa-solid fa-video" style="font-size:28px;color:var(--text3);margin-bottom:8px"></i>
      <p style="margin:0;color:var(--text3)">Video dosyasini buraya surukle veya tikla</p>
      <small style="color:var(--text3)">MP4, MOV, WEBM (maks. 100MB)</small>
      <div class="upload-progress" id="video-upload-progress" style="display:none;margin-top:10px">
        <div class="upload-progress-fill" id="video-upload-progress-fill" style="width:0%"></div>
      </div>
    </div>
    <input type="file" id="video-yukle-input" style="display:none" accept="video/*"
      onchange="yukleVideoIcinBagisci(this.files[0])"/>
    <div id="video-upload-result" style="margin-top:12px"></div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
    </div>
  `, false, 'video');
}

function videoHisseSecildi() {
  const sel = document.getElementById('video-bagisci-select');
  const opt = sel.options[sel.selectedIndex];
  const bilgi = document.getElementById('video-bagisci-bilgi');
  if (!sel.value) { bilgi.style.display = 'none'; return; }
  const kurbanNo = opt.dataset.kurban;
  const hisseNo = opt.dataset.hisse;
  const ad = opt.dataset.ad;
  bilgi.style.display = 'block';
  bilgi.innerHTML = `<i class="fa-solid fa-info-circle" style="color:var(--accent)"></i>
    Kurban <strong>#${kurbanNo}</strong> — Hisse <strong>${hisseNo}</strong> — <strong>${ad}</strong> icin video yuklenecek`;
}

function handleVideoDrop(e) {
  const file = e.dataTransfer.files[0];
  if (file) yukleVideoIcinBagisci(file);
}

async function yukleVideoIcinBagisci(file) {
  if (!file) return;
  const hisseId = document.getElementById('video-bagisci-select').value;
  if (!hisseId) { toast('Once bir bagisci secin', 'error'); return; }
  if (!file.type.startsWith('video/')) { toast('Sadece video dosyalari yuklenebilir', 'error'); return; }

  const prog = document.getElementById('video-upload-progress');
  const fill = document.getElementById('video-upload-progress-fill');
  const result = document.getElementById('video-upload-result');
  if (prog) { prog.style.display = 'block'; fill.style.width = '10%'; }

  const formData = new FormData();
  formData.append('dosya', file);
  formData.append('folder', `defterdar/hisse-${hisseId}`);

  try {
    if (fill) fill.style.width = '40%';
    const r = await fetch('/api/medya/upload', { method: 'POST', body: formData });
    if (fill) fill.style.width = '90%';
    const data = await r.json();
    if (!r.ok) throw new Error(data.hata || 'Yuklenemedi');
    if (fill) fill.style.width = '100%';

    await api('PUT', `/hisseler/${hisseId}`, { video_url: data.url, video_public_id: data.public_id });

    if (result) result.innerHTML = `
      <div class="badge badge-green" style="font-size:12px;padding:8px 14px">
        <i class="fa-solid fa-circle-check"></i> Video gönderildi! Bağışçı bilgileri korundu.
      </div>`;
    toast('Video gönderildi - Bağışçı bilgileri korundu');
    
    // Modal'ı kapatmayın, sadece başarı mesajı gösterin
    setTimeout(() => {
      if (result) result.innerHTML = '';
      if (prog) prog.style.display = 'none';
      // Video listesini yenileyin
      yukleVideoIsteyenler();
    }, 3000);
  } catch(e) {
    if (result) result.innerHTML = `<div class="badge badge-red" style="font-size:12px;padding:8px 14px"><i class="fa-solid fa-circle-xmark"></i> ${e.message}</div>`;
    toast(e.message, 'error');
    if (prog) prog.style.display = 'none';
  }
}

async function modalVideoYukleHisse(hisseId, bagisciAdi, kurbanNo, hisseNo) {
  openModal('Video Yukle — ' + esc(bagisciAdi), `
    <div style="background:var(--bg4);border:1px solid var(--border2);border-radius:8px;padding:10px;margin-bottom:16px;font-size:13px">
      <i class="fa-solid fa-info-circle" style="color:var(--accent)"></i>
      Kurban <strong>#${kurbanNo}</strong> — Hisse <strong>${hisseNo}</strong> — <strong>${esc(bagisciAdi)}</strong>
    </div>
    <div class="upload-zone" id="upload-zone"
      onclick="document.getElementById('hisse-video-yukle-input').click()"
      ondragover="event.preventDefault();this.classList.add('drag-over')"
      ondragleave="this.classList.remove('drag-over')"
      ondrop="event.preventDefault();this.classList.remove('drag-over');yukleVideoHisseDogrudan(event.dataTransfer.files[0],${hisseId})">
      <i class="fa-solid fa-video" style="font-size:28px;color:var(--text3);margin-bottom:8px"></i>
      <p style="margin:0;color:var(--text3)">Video dosyasini buraya surukle veya tikla</p>
      <small style="color:var(--text3)">MP4, MOV, WEBM (maks. 100MB)</small>
      <div class="upload-progress" id="upload-progress" style="display:none;margin-top:10px">
        <div class="upload-progress-fill" id="upload-progress-fill" style="width:0%"></div>
      </div>
    </div>
    <input type="file" id="hisse-video-yukle-input" style="display:none" accept="video/*"
      onchange="yukleVideoHisseDogrudan(this.files[0],${hisseId})"/>
    <div id="upload-result" style="margin-top:12px"></div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
    </div>
  `, false, 'video');
}

async function yukleVideoHisseDogrudan(file, hisseId) {
  if (!file) return;
  if (!file.type.startsWith('video/')) { toast('Sadece video dosyalari yuklenebilir', 'error'); return; }

  const prog = document.getElementById('upload-progress');
  const fill = document.getElementById('upload-progress-fill');
  const result = document.getElementById('upload-result');
  if (prog) { prog.style.display = 'block'; fill.style.width = '10%'; }

  const formData = new FormData();
  formData.append('dosya', file);
  formData.append('folder', `defterdar/hisse-${hisseId}`);

  try {
    if (fill) fill.style.width = '40%';
    const r = await fetch('/api/medya/upload', { method: 'POST', body: formData });
    if (fill) fill.style.width = '90%';
    const data = await r.json();
    if (!r.ok) throw new Error(data.hata || 'Yuklenemedi');
    if (fill) fill.style.width = '100%';

    await api('PUT', `/hisseler/${hisseId}`, { video_url: data.url, video_public_id: data.public_id });

    if (result) result.innerHTML = `<div class="badge badge-green" style="font-size:12px;padding:8px 14px"><i class="fa-solid fa-circle-check"></i> Video yuklendi!</div>`;
    toast('Video yuklendi');
    setTimeout(async () => { closeModal(); await yukleVideoIsteyenler(); }, 1200);
  } catch(e) {
    if (result) result.innerHTML = `<div class="badge badge-red" style="font-size:12px;padding:8px 14px"><i class="fa-solid fa-circle-xmark"></i> ${e.message}</div>`;
    toast(e.message, 'error');
    if (prog) prog.style.display = 'none';
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// AYARLAR SAYFASI (Yazdırma + Veri Yönetimi)
// ═══════════════════════════════════════════════════════════════════════════
async function renderAyarlarSayfasi() {
  const m = document.getElementById('main-content');
  const logoOnizleme = _kullaniciAyarlar.logo_data
    ? '<img src="' + _kullaniciAyarlar.logo_data + '" style="max-height:70px;max-width:100%;border-radius:6px;object-fit:contain"/>'
    : '<i class="fa-solid fa-image" style="font-size:22px;color:var(--text3)"></i><div style="color:var(--text3);font-size:12px;margin-top:4px">Yüklenmedi</div>';
  const bayrakOnizleme = _kullaniciAyarlar.bayrak_data
    ? '<img src="' + _kullaniciAyarlar.bayrak_data + '" style="max-height:70px;max-width:100%;border-radius:6px;object-fit:contain"/>'
    : '<i class="fa-solid fa-flag" style="font-size:22px;color:var(--text3)"></i><div style="color:var(--text3);font-size:12px;margin-top:4px">Yüklenmedi</div>';

  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-gear"></i></div>
        Ayarlar
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-print"></i> Yazdırma Görselleri</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          <div class="form-group">
            <label><i class="fa-solid fa-image"></i> Logonuz (Orta)</label>
            <div class="upload-zone" style="padding:16px;text-align:center;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('ayar-logo-input').click()">
              <div id="ayar-logo-preview">${logoOnizleme}</div>
            </div>
            <input type="file" id="ayar-logo-input" accept="image/*" style="display:none" onchange="onAyarImageChange(this,'logo')"/>
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-flag"></i> Sağ Üst Bayrak</label>
            <div class="upload-zone" style="padding:16px;text-align:center;cursor:pointer;min-height:90px;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('ayar-bayrak-input').click()">
              <div id="ayar-bayrak-preview">${bayrakOnizleme}</div>
            </div>
            <input type="file" id="ayar-bayrak-input" accept="image/*" style="display:none" onchange="onAyarImageChange(this,'bayrak')"/>
          </div>
        </div>
        <button class="btn btn-primary" onclick="kaydetAyarlar()"><i class="fa-solid fa-floppy-disk"></i> Görselleri Kaydet</button>
      </div>

      <div class="card">
        <div class="card-title"><i class="fa-solid fa-database"></i> Veri Yönetimi</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div>
            <div style="font-weight:600;font-size:13px;margin-bottom:6px"><i class="fa-solid fa-floppy-disk" style="color:var(--green)"></i> Tam Yedek Al</div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:8px">Tüm organizasyonlar, kurbanlar, bağışçılar ve ayarlar JSON formatında yedeklenir. Başka bilgisayara taşımak için kullanın.</div>
            <button class="btn btn-success" onclick="tamYedekAl()"><i class="fa-solid fa-download"></i> Tam Yedek İndir (.json)</button>
          </div>
          <hr style="border:none;border-top:1px solid var(--border);margin:4px 0"/>
          <div>
            <div style="font-weight:600;font-size:13px;margin-bottom:6px"><i class="fa-solid fa-upload" style="color:var(--accent)"></i> Veri Geri Yükle</div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:8px">Daha önce aldığınız .json yedek dosyasını yükleyin. Tüm veriler (organizasyonlar, kurbanlar, bağışçılar, fotoğraflar) geri gelir.</div>
            <button class="btn btn-primary" onclick="showPage('veri-geri-yukle')"><i class="fa-solid fa-file-import"></i> Yedekten Geri Yükle</button>
          </div>
          <hr style="border:none;border-top:1px solid var(--border);margin:4px 0"/>
          <div>
            <div style="font-weight:600;font-size:13px;margin-bottom:6px"><i class="fa-solid fa-file-excel" style="color:var(--green)"></i> Excel Yedek</div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:8px">Seçili organizasyonu Excel formatında dışa aktar.</div>
            <button class="btn btn-success" onclick="excelYedekAl()"><i class="fa-solid fa-file-excel"></i> Excel İndir</button>
          </div>
        </div>
      </div>
    </div>`;

  // Geçici değişkenler
  window._ayarLogoData = null;
  window._ayarBayrakData = null;
}

function onAyarImageChange(input, tip) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    if (tip === 'logo') {
      window._ayarLogoData = data;
      document.getElementById('ayar-logo-preview').innerHTML =
        '<img src="' + data + '" style="max-height:70px;max-width:100%;border-radius:6px;object-fit:contain"/>';
    } else {
      window._ayarBayrakData = data;
      document.getElementById('ayar-bayrak-preview').innerHTML =
        '<img src="' + data + '" style="max-height:70px;max-width:100%;border-radius:6px;object-fit:contain"/>';
    }
  };
  reader.readAsDataURL(file);
}

async function kaydetAyarlar() {
  try {
    const logo = window._ayarLogoData || _kullaniciAyarlar.logo_data;
    const bayrak = window._ayarBayrakData || _kullaniciAyarlar.bayrak_data;
    await api('POST', '/ayarlar', { logo_data: logo, bayrak_data: bayrak, kurulum_tamamlandi: 1 });
    _kullaniciAyarlar.logo_data = logo;
    _kullaniciAyarlar.bayrak_data = bayrak;
    _kullaniciAyarlar.kurulum_tamamlandi = 1;
    toast('Ayarlar kaydedildi');
  } catch(e) { toast(e.message, 'error'); }
}

async function tamYedekAl() {
  try {
    toast('Yedek hazırlanıyor...');
    const tarih = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = 'defterdar-tam-yedek-' + tarih + '.json';
    if (window.electronAPI && window.electronAPI.downloadFile) {
      const result = await window.electronAPI.downloadFile('http://127.0.0.1:4500/api/tam-yedek', filename);
      if (result && result.ok) toast('Yedek kaydedildi: ' + result.path);
      else if (result && result.canceled) toast('İptal edildi');
      else toast('Hata: ' + (result && result.error || 'Bilinmeyen'), 'error');
    } else {
      const r = await fetch('/api/tam-yedek');
      if (!r.ok) throw new Error('Sunucu hatası');
      const blob = await r.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      toast('Yedek indirildi');
    }
  } catch(e) { toast('Yedek alınamadı: ' + e.message, 'error'); }
}

async function excelYedekAl() {
  if (!S.orgId) return toast('Önce bir organizasyon seçin', 'error');
  downloadExcel('/api/organizasyonlar/' + S.orgId + '/excel', 'defterdar-yedek.xlsx');
}

// ═══════════════════════════════════════════════════════════════════════════
// VERİ GERİ YÜKLEME (JSON Yedek)
// ═══════════════════════════════════════════════════════════════════════════
async function renderVeriGeriYukle() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-file-import"></i></div>
        Yedekten Geri Yükle
        <small>JSON Yedek Dosyası</small>
      </div>
      <button class="btn btn-secondary" onclick="showPage('ayarlar')"><i class="fa-solid fa-arrow-left"></i> Geri</button>
    </div>

    <div class="card" style="background:rgba(79,126,248,0.05);border-color:rgba(79,126,248,0.3);margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:12px">
        <i class="fa-solid fa-info-circle" style="font-size:24px;color:var(--accent)"></i>
        <div>
          <div style="font-weight:600;margin-bottom:4px">Tam yedek dosyasından geri yükleme</div>
          <div style="font-size:12px;color:var(--text3)">
            Daha önce "Tam Yedek Al" ile indirdiğiniz <strong>.json</strong> dosyasını yükleyin.<br>
            Tüm organizasyonlar, kurbanlar, bağışçılar ve logo/bayrak ayarları geri gelir.<br>
            Mevcut veriler korunur, yeni veriler eklenir. Aynı organizasyon varsa güncellenir.
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><i class="fa-solid fa-upload"></i> Yedek Dosyası Seç</div>
      <div class="upload-zone" id="geri-yukle-zone"
        onclick="document.getElementById('geri-yukle-input').click()"
        ondragover="event.preventDefault();this.classList.add('drag-over')"
        ondragleave="this.classList.remove('drag-over')"
        ondrop="event.preventDefault();this.classList.remove('drag-over');geriYukleDosyasi(event.dataTransfer.files[0])">
        <i class="fa-solid fa-file-code" style="font-size:32px;color:var(--text3);margin-bottom:10px"></i>
        <p style="margin:0;color:var(--text3)">JSON yedek dosyasını buraya sürükle veya tıkla</p>
        <small style="color:var(--text3)">defterdar-tam-yedek-*.json</small>
        <div class="upload-progress" id="geri-yukle-progress" style="display:none;margin-top:12px">
          <div class="upload-progress-fill" id="geri-yukle-progress-fill" style="width:0%"></div>
        </div>
      </div>
      <input type="file" id="geri-yukle-input" style="display:none" accept=".json"
        onchange="geriYukleDosyasi(this.files[0])"/>
      <div id="geri-yukle-result" style="margin-top:16px"></div>
    </div>`;
}

async function geriYukleDosyasi(file) {
  if (!file) return;
  if (!file.name.endsWith('.json')) {
    toast('Sadece .json yedek dosyaları desteklenir', 'error');
    return;
  }

  const prog = document.getElementById('geri-yukle-progress');
  const fill = document.getElementById('geri-yukle-progress-fill');
  const result = document.getElementById('geri-yukle-result');

  if (prog) { prog.style.display = 'block'; fill.style.width = '20%'; }

  const formData = new FormData();
  formData.append('dosya', file);

  try {
    if (fill) fill.style.width = '50%';
    const r = await fetch('/api/tam-geri-yukle', { method: 'POST', body: formData });
    if (fill) fill.style.width = '90%';
    const data = await r.json();

    if (!r.ok) throw new Error(data.hata || 'Geri yükleme başarısız');
    if (fill) fill.style.width = '100%';

    if (result) result.innerHTML = `
      <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:16px">
        <div style="font-weight:700;color:var(--green);margin-bottom:10px;font-size:15px">
          <i class="fa-solid fa-circle-check"></i> Geri yükleme tamamlandı!
        </div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px">${esc(data.mesaj)}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          <div class="stat-card green" style="padding:10px">
            <div class="stat-value" style="font-size:22px">${data.detay.organizasyonlar}</div>
            <div class="stat-label">Yeni Org.</div>
          </div>
          <div class="stat-card blue" style="padding:10px">
            <div class="stat-value" style="font-size:22px">${data.detay.kurbanlar}</div>
            <div class="stat-label">Yeni Kurban</div>
          </div>
          <div class="stat-card purple" style="padding:10px">
            <div class="stat-value" style="font-size:22px">${data.detay.hisseler}</div>
            <div class="stat-label">Yeni Bağışçı</div>
          </div>
        </div>
        <button class="btn btn-primary" style="margin-top:14px" onclick="showPage('organizasyonlar')">
          <i class="fa-solid fa-layer-group"></i> Organizasyonlara Git
        </button>
      </div>`;

    toast('Veriler geri yüklendi!');
    // Ayarları yenile (logo/bayrak geri geldiyse)
    try {
      const ayar = await api('GET', '/ayarlar');
      _kullaniciAyarlar = ayar;
    } catch(e) {}
  } catch(e) {
    if (result) result.innerHTML = `
      <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:16px">
        <div style="font-weight:700;color:var(--red);margin-bottom:6px"><i class="fa-solid fa-circle-xmark"></i> Hata</div>
        <div style="font-size:13px">${esc(e.message)}</div>
      </div>`;
    toast(e.message, 'error');
    if (prog) prog.style.display = 'none';
  }
}
