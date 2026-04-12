// ─── INIT ─────────────────────────────────────────────────────────────────────
function initPanel() {
  showPage('dashboard');
}

// ─── API ─────────────────────────────────────────────────────────────────────
async function api(method, url, body) {
  const opts = { method, headers:{'Content-Type':'application/json'} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch('/api/admin' + url, opts);
  const d = await r.json();
  if (!r.ok) throw new Error(d.hata || 'Hata olustu');
  return d;
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function toast(msg, type='success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fa-solid fa-${type==='success'?'circle-check':'circle-xmark'}"></i> ${msg}`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function openModal(title, html, large=false, icon='') {
  document.getElementById('modal-title').innerHTML = `${icon?`<i class="fa-solid fa-${icon}"></i>`:''}${title}`;
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-box').className = large ? 'modal modal-lg' : 'modal';
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
function closeModalOutside(e) { if (e.target===document.getElementById('modal-overlay')) closeModal(); }

// ─── NAV ─────────────────────────────────────────────────────────────────────
function showPage(page) {
  document.querySelectorAll('.sidebar-item').forEach(el =>
    el.classList.toggle('active', el.dataset.page === page));
  document.getElementById('main-content').innerHTML = '';
  if (page==='dashboard') renderDashboard();
  else if (page==='kullanicilar') renderKullanicilar();
  else if (page==='pro-keyler') renderProKeyler();
  else if (page==='pro-talepler') renderProTalepler();
  else if (page==='ip-yasaklar') renderIpYasaklar();
}

function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
async function renderDashboard() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-chart-line"></i></div>
        Dashboard
      </div>
    </div>
    <div class="stats-grid" id="stats"></div>`;
  
  const stats = await api('GET', '/istatistikler');
  document.getElementById('stats').innerHTML = `
    <div class="stat-card blue"><div class="stat-icon"><i class="fa-solid fa-users"></i></div><div class="stat-value">${stats.toplam_kullanici}</div><div class="stat-label">Toplam Kullanici</div></div>
    <div class="stat-card green"><div class="stat-icon"><i class="fa-solid fa-crown"></i></div><div class="stat-value">${stats.pro_kullanici}</div><div class="stat-label">PRO Kullanici</div></div>
    <div class="stat-card yellow"><div class="stat-icon"><i class="fa-solid fa-user"></i></div><div class="stat-value">${stats.normal_kullanici}</div><div class="stat-label">Normal Kullanici</div></div>
    <div class="stat-card purple"><div class="stat-icon"><i class="fa-solid fa-envelope"></i></div><div class="stat-value">${stats.bekleyen_talepler}</div><div class="stat-label">Bekleyen Talep</div></div>
    <div class="stat-card blue"><div class="stat-icon"><i class="fa-solid fa-key"></i></div><div class="stat-value">${stats.toplam_key}</div><div class="stat-label">Toplam Key</div></div>
    <div class="stat-card green"><div class="stat-icon"><i class="fa-solid fa-check"></i></div><div class="stat-value">${stats.kullanilmis_key}</div><div class="stat-label">Kullanilmis Key</div></div>
    <div class="stat-card yellow"><div class="stat-icon"><i class="fa-solid fa-clock"></i></div><div class="stat-value">${stats.kullanilmamis_key}</div><div class="stat-label">Kullanilmamis Key</div></div>
    <div class="stat-card red"><div class="stat-icon"><i class="fa-solid fa-ban"></i></div><div class="stat-value">${stats.yasakli_ip}</div><div class="stat-label">Yasakli IP</div></div>`;
  
  // Badge güncelle
  const badge = document.getElementById('talep-badge');
  if (stats.bekleyen_talepler > 0) {
    badge.textContent = stats.bekleyen_talepler;
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// KULLANICILAR
// ═══════════════════════════════════════════════════════════════════════════
let _kullaniciList = [];

function filterKullanicilar() {
  const q = document.getElementById('kullanici-ara').value.toLowerCase();
  const filtered = q ? _kullaniciList.filter(u =>
    (u.kullanici_adi||'').toLowerCase().includes(q) ||
    (u.email||'').toLowerCase().includes(q) ||
    (u.kayit_ip||'').toLowerCase().includes(q) ||
    (u.son_ip||'').toLowerCase().includes(q)
  ) : _kullaniciList;
  renderKullaniciTablo(filtered);
}

function renderKullaniciTablo(list) {
  const tbody = document.getElementById('kullanici-tbody');
  tbody.innerHTML = list.map((u,i) => `
    <tr>
      <td>${i+1}</td>
      <td><strong>${esc(u.kullanici_adi)}</strong></td>
      <td>${esc(u.email)}</td>
      <td><span class="badge ${u.surum==='pro'?'badge-green':'badge-gray'}">${u.surum==='pro'?'PRO':'Normal'}</span></td>
      <td><span class="badge ${u.rol==='admin'?'badge-purple':'badge-blue'}">${u.rol==='admin'?'Admin':'Kullanici'}</span></td>
      <td><span class="badge ${u.durum==='aktif'?'badge-green':u.durum==='askida'?'badge-yellow':'badge-red'}">${u.durum==='aktif'?'Aktif':u.durum==='askida'?'Askida':'Yasak'}</span></td>
      <td style="font-size:11px;font-family:monospace">${u.kayit_ip||'-'}</td>
      <td style="font-size:11px;font-family:monospace">${u.son_ip||'-'}</td>
      <td style="font-size:11px">${new Date(u.kayit_tarihi).toLocaleString('tr-TR')}</td>
      <td>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm btn-icon" onclick="modalKullaniciDetay(${u.id})" title="Detay"><i class="fa-solid fa-eye"></i></button>
          <button class="btn btn-purple btn-sm btn-icon" onclick="modalSurumDegistir(${u.id},'${u.surum}')" title="Surum"><i class="fa-solid fa-crown"></i></button>
          <button class="btn btn-yellow btn-sm btn-icon" onclick="modalDurumDegistir(${u.id},'${u.durum}')" title="Durum"><i class="fa-solid fa-circle-dot"></i></button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="modalSifreDegistir(${u.id})" title="Sifre"><i class="fa-solid fa-key"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

async function renderKullanicilar() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-users"></i></div>
        Kullanicilar
      </div>
    </div>
    <div style="margin-bottom:12px">
      <input id="kullanici-ara" type="text" placeholder="İsim, email veya IP ara..." oninput="filterKullanicilar()"
        style="padding:8px 12px;background:#0d0d0d;border:1px solid #333;border-radius:6px;color:#e0e0e0;font-size:13px;outline:none;width:280px"/>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>#</th><th>Kullanici Adi</th><th>Email</th><th>Surum</th><th>Rol</th><th>Durum</th><th>Kayit IP</th><th>Son IP</th><th>Kayit Tarihi</th><th>Islemler</th>
          </tr></thead>
          <tbody id="kullanici-tbody"></tbody>
        </table>
      </div>
    </div>`;
  
  _kullaniciList = await api('GET', '/kullanicilar');
  renderKullaniciTablo(_kullaniciList);
}

// ESKI renderKullanicilar tbody kodu asagida kaldirildi

async function modalKullaniciDetay(id) {
  const list = _kullaniciList.length ? _kullaniciList : await api('GET', '/kullanicilar');
  const u = list.find(x=>x.id===id);
  if (!u) return;
  
  const orgs = await api('GET', `/kullanicilar/${id}/organizasyonlar`);
  const orgHtml = orgs.length ? orgs.map(o => `<div style="padding:8px;background:var(--bg4);border-radius:6px;margin-bottom:6px"><strong>${esc(o.ad)}</strong> (${o.yil}) - ${o.max_kurban} kurban</div>`).join('') : '<div style="color:var(--text3)">Organizasyon yok</div>';
  
  openModal('Kullanici Detay', `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div><strong>Kullanici Adi:</strong> ${esc(u.kullanici_adi)}</div>
      <div><strong>Email:</strong> ${esc(u.email)}</div>
      <div><strong>Surum:</strong> <span class="badge ${u.surum==='pro'?'badge-green':'badge-gray'}">${u.surum==='pro'?'PRO':'Normal'}</span></div>
      <div><strong>Rol:</strong> <span class="badge ${u.rol==='admin'?'badge-purple':'badge-blue'}">${u.rol==='admin'?'Admin':'Kullanici'}</span></div>
      <div><strong>Durum:</strong> <span class="badge ${u.durum==='aktif'?'badge-green':u.durum==='askida'?'badge-yellow':'badge-red'}">${u.durum==='aktif'?'Aktif':u.durum==='askida'?'Askida':'Yasak'}</span></div>
      <div><strong>Kayit Tarihi:</strong> ${new Date(u.kayit_tarihi).toLocaleString('tr-TR')}</div>
      <div><strong>Kayit IP:</strong> <code>${u.kayit_ip||'-'}</code></div>
      <div><strong>Son IP:</strong> <code>${u.son_ip||'-'}</code></div>
    </div>
    <div style="margin-top:16px">
      <strong>Organizasyonlar (${orgs.length}):</strong>
      <div style="margin-top:8px;max-height:200px;overflow-y:auto">${orgHtml}</div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
    </div>`, true, 'user');
}

async function modalSurumDegistir(id, mevcutSurum) {
  openModal('Surum Degistir', `
    <div class="form-group">
      <label>Yeni Surum</label>
      <select id="yeni-surum">
        <option value="normal" ${mevcutSurum==='normal'?'selected':''}>Normal</option>
        <option value="pro" ${mevcutSurum==='pro'?'selected':''}>PRO</option>
      </select>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-primary" onclick="surumDegistir(${id})"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
    </div>`, false, 'crown');
}

async function surumDegistir(id) {
  const surum = document.getElementById('yeni-surum').value;
  await api('PUT', `/kullanicilar/${id}/surum`, { surum });
  closeModal();
  toast('Surum degistirildi');
  renderKullanicilar();
}

async function modalDurumDegistir(id, mevcutDurum) {
  openModal('Durum Degistir', `
    <div class="form-group">
      <label>Yeni Durum</label>
      <select id="yeni-durum">
        <option value="aktif" ${mevcutDurum==='aktif'?'selected':''}>Aktif</option>
        <option value="askida" ${mevcutDurum==='askida'?'selected':''}>Askida</option>
        <option value="yasak" ${mevcutDurum==='yasak'?'selected':''}>Yasak</option>
      </select>
    </div>
    <div style="background:var(--bg4);border-radius:8px;padding:10px;font-size:12px;color:var(--text3);margin-top:12px">
      <i class="fa-solid fa-info-circle" style="color:var(--accent)"></i>
      <strong>Askida:</strong> Kullanici giris yapamaz, veriler korunur<br>
      <strong>Yasak:</strong> Kullanici giris yapamaz, IP yasaklanir, veriler korunur
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-primary" onclick="durumDegistir(${id})"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
    </div>`, false, 'circle-dot');
}

async function durumDegistir(id) {
  const durum = document.getElementById('yeni-durum').value;
  await api('PUT', `/kullanicilar/${id}/durum`, { durum });
  closeModal();
  toast('Durum degistirildi');
  renderKullanicilar();
}

async function modalSifreDegistir(id) {
  openModal('Sifre Degistir', `
    <div class="form-group">
      <label>Yeni Sifre</label>
      <input type="password" id="yeni-sifre" placeholder="En az 6 karakter"/>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-primary" onclick="sifreDegistir(${id})"><i class="fa-solid fa-floppy-disk"></i> Kaydet</button>
    </div>`, false, 'key');
}

async function sifreDegistir(id) {
  const yeni_sifre = document.getElementById('yeni-sifre').value;
  if (!yeni_sifre || yeni_sifre.length < 6) return toast('Sifre en az 6 karakter olmali', 'error');
  await api('PUT', `/kullanicilar/${id}/sifre`, { yeni_sifre });
  closeModal();
  toast('Sifre degistirildi');
}

// ═══════════════════════════════════════════════════════════════════════════
// PRO KEYLER
// ═══════════════════════════════════════════════════════════════════════════
let _keyList = [];

function filterKeyler() {
  const q = document.getElementById('key-ara').value.toLowerCase();
  const filtered = q ? _keyList.filter(k =>
    (k.key_kodu||'').toLowerCase().includes(q) ||
    (k.kullanan_adi||'').toLowerCase().includes(q)
  ) : _keyList;
  renderKeyTablo(filtered);
}

function renderKeyTablo(list) {
  const tbody = document.getElementById('key-tbody');
  tbody.innerHTML = list.map((k,i) => `
    <tr>
      <td>${i+1}</td>
      <td><code style="font-size:12px;background:var(--bg4);padding:4px 8px;border-radius:4px">${k.key_kodu}</code></td>
      <td><span class="badge ${k.kullanildi?'badge-green':'badge-yellow'}">${k.kullanildi?'Kullanildi':'Bekliyor'}</span></td>
      <td>${k.kullanan_adi?esc(k.kullanan_adi):'-'}</td>
      <td style="font-size:11px">${new Date(k.olusturma_tarihi).toLocaleString('tr-TR')}</td>
      <td style="font-size:11px">${k.kullanilma_tarihi?new Date(k.kullanilma_tarihi).toLocaleString('tr-TR'):'-'}</td>
      <td>
        <div style="display:flex;gap:4px">
          ${k.kullanildi?`<button class="btn btn-danger btn-sm" onclick="keyIptal(${k.id})"><i class="fa-solid fa-ban"></i> Iptal Et</button>`:''}
          <button class="btn btn-danger btn-sm btn-icon" onclick="keySil(${k.id})" title="Sil"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

async function renderProKeyler() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-key"></i></div>
        PRO Keyler
      </div>
      <button class="btn btn-primary" onclick="modalYeniKey()"><i class="fa-solid fa-plus"></i> Key Olustur</button>
    </div>
    <div style="margin-bottom:12px">
      <input id="key-ara" type="text" placeholder="Key kodu veya kullanıcı ara..." oninput="filterKeyler()"
        style="padding:8px 12px;background:#0d0d0d;border:1px solid #333;border-radius:6px;color:#e0e0e0;font-size:13px;outline:none;width:280px"/>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>#</th><th>Key Kodu</th><th>Durum</th><th>Kullanan</th><th>Olusturma</th><th>Kullanilma</th><th>Islemler</th>
          </tr></thead>
          <tbody id="key-tbody"></tbody>
        </table>
      </div>
    </div>`;
  
  _keyList = await api('GET', '/pro-keyler');
  renderKeyTablo(_keyList);
}

function modalYeniKey() {
  openModal('Yeni Key Olustur', `
    <div class="form-group">
      <label>Kac adet key olusturulsun?</label>
      <input type="number" id="key-adet" value="1" min="1" max="100"/>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-primary" onclick="keyOlustur()"><i class="fa-solid fa-plus"></i> Olustur</button>
    </div>`, false, 'key');
}

async function keyOlustur() {
  const adet = parseInt(document.getElementById('key-adet').value);
  const r = await api('POST', '/pro-keyler', { adet });
  closeModal();
  toast(`${r.keyler.length} key olusturuldu`);
  renderProKeyler();
}

async function keySil(id) {
  if (!confirm('Bu key silinecek. Emin misiniz?')) return;
  await api('DELETE', `/pro-keyler/${id}`);
  toast('Key silindi');
  renderProKeyler();
}

async function keyIptal(id) {
  if (!confirm('Bu key iptal edilecek ve kullanici normal surume dusecek. Emin misiniz?')) return;
  await api('POST', `/pro-keyler/${id}/iptal`);
  toast('Key iptal edildi');
  renderProKeyler();
}

// ═══════════════════════════════════════════════════════════════════════════
// PRO TALEPLERİ
// ═══════════════════════════════════════════════════════════════════════════
async function renderProTalepler() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-envelope"></i></div>
        PRO Talepleri
      </div>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>#</th><th>Kullanici</th><th>Email</th><th>Mesaj</th><th>Durum</th><th>Tarih</th><th>Islemler</th>
          </tr></thead>
          <tbody id="talep-tbody"></tbody>
        </table>
      </div>
    </div>`;
  
  const list = await api('GET', '/pro-talepler');
  const tbody = document.getElementById('talep-tbody');
  tbody.innerHTML = list.map((t,i) => `
    <tr>
      <td>${i+1}</td>
      <td><strong>${esc(t.kullanici_adi)}</strong></td>
      <td>${esc(t.email)}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.mesaj||'-'}</td>
      <td><span class="badge ${t.durum==='bekliyor'?'badge-yellow':t.durum==='onaylandi'?'badge-green':'badge-red'}">${t.durum==='bekliyor'?'Bekliyor':t.durum==='onaylandi'?'Onaylandi':'Reddedildi'}</span></td>
      <td style="font-size:11px">${new Date(t.olusturma_tarihi).toLocaleString('tr-TR')}</td>
      <td>
        ${t.durum==='bekliyor'?`
          <div style="display:flex;gap:4px">
            <button class="btn btn-success btn-sm" onclick="talepOnayla(${t.id})"><i class="fa-solid fa-check"></i> Onayla</button>
            <button class="btn btn-danger btn-sm" onclick="talepReddet(${t.id})"><i class="fa-solid fa-xmark"></i> Reddet</button>
          </div>
        `:'<span style="color:var(--text3)">-</span>'}
      </td>
    </tr>`).join('');
}

async function talepOnayla(id) {
  if (!confirm('Bu talep onaylanacak ve kullanici PRO surume yukseltilecek. Emin misiniz?')) return;
  await api('POST', `/pro-talepler/${id}/onayla`);
  toast('Talep onaylandi');
  renderProTalepler();
  renderDashboard();
}

async function talepReddet(id) {
  if (!confirm('Bu talep reddedilecek. Emin misiniz?')) return;
  await api('POST', `/pro-talepler/${id}/reddet`);
  toast('Talep reddedildi');
  renderProTalepler();
  renderDashboard();
}

// ═══════════════════════════════════════════════════════════════════════════
// IP YASAKLARI
// ═══════════════════════════════════════════════════════════════════════════
async function renderIpYasaklar() {
  const m = document.getElementById('main-content');
  m.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <div class="icon-wrap"><i class="fa-solid fa-ban"></i></div>
        IP Yasaklari
      </div>
      <button class="btn btn-primary" onclick="modalYeniIpYasak()"><i class="fa-solid fa-plus"></i> IP Yasakla</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>#</th><th>IP Adresi</th><th>Sebep</th><th>Tarih</th><th>Islemler</th>
          </tr></thead>
          <tbody id="ip-tbody"></tbody>
        </table>
      </div>
    </div>`;
  
  const list = await api('GET', '/ip-yasaklar');
  const tbody = document.getElementById('ip-tbody');
  tbody.innerHTML = list.map((ip,i) => `
    <tr>
      <td>${i+1}</td>
      <td><code style="font-size:12px;background:var(--bg4);padding:4px 8px;border-radius:4px">${ip.ip}</code></td>
      <td>${ip.sebep||'-'}</td>
      <td style="font-size:11px">${new Date(ip.olusturma_tarihi).toLocaleString('tr-TR')}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-icon" onclick="ipYasakKaldir(${ip.id})" title="Yasagi Kaldir"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`).join('');
}

function modalYeniIpYasak() {
  openModal('IP Yasakla', `
    <div class="form-group">
      <label>IP Adresi</label>
      <input type="text" id="ip-adres" placeholder="192.168.1.1"/>
    </div>
    <div class="form-group">
      <label>Sebep</label>
      <textarea id="ip-sebep" placeholder="Opsiyonel..."></textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Iptal</button>
      <button class="btn btn-primary" onclick="ipYasakla()"><i class="fa-solid fa-ban"></i> Yasakla</button>
    </div>`, false, 'ban');
}

async function ipYasakla() {
  const ip = document.getElementById('ip-adres').value.trim();
  const sebep = document.getElementById('ip-sebep').value.trim();
  if (!ip) return toast('IP adresi zorunlu', 'error');
  await api('POST', '/ip-yasaklar', { ip, sebep });
  closeModal();
  toast('IP yasaklandi');
  renderIpYasaklar();
}

async function ipYasakKaldir(id) {
  if (!confirm('Bu IP yasagi kaldirilacak. Emin misiniz?')) return;
  await api('DELETE', `/ip-yasaklar/${id}`);
  toast('Yasak kaldirildi');
  renderIpYasaklar();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function initPanel() {
  showPage('dashboard');
}

document.addEventListener('DOMContentLoaded', () => {
  // initPanel ddm.html tarafından çağrılır, burada çağırmıyoruz
});
