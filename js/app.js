/* =========================================================
   app.js — navegação entre abas (SPA) e seção inicial
   ========================================================= */

(function(){
  const navLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.view');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.querySelector('.main-nav');

  function showView(name){
    views.forEach(v => v.classList.toggle('active', v.dataset.view === name));
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.view === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded','false');
    document.dispatchEvent(new CustomEvent('view:show', { detail: { name } }));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => showView(link.dataset.view));
  });

  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.goto));
  });

  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ---------- Hero stats + frieze strip + era bars ---------- */
  function renderHome(){
    const fosseis = DB.fosseis;
    const nSitios = DB.sitios.length;
    const nInst = DB.instituicoes.length;
    const periodosCount = new Set(fosseis.map(f => f.periodo)).size;

    const heroStats = document.getElementById('heroStats');
    heroStats.innerHTML = `
      <div class="stat-card"><span class="stat-num">${fosseis.length}</span><span class="stat-label">Registros catalogados</span></div>
      <div class="stat-card"><span class="stat-num">${nSitios}</span><span class="stat-label">Sítios de coleta</span></div>
      <div class="stat-card"><span class="stat-num">${periodosCount}</span><span class="stat-label">Períodos geológicos</span></div>
      <div class="stat-card"><span class="stat-num">${nInst}</span><span class="stat-label">Instituições</span></div>
    `;

    const taxons = fosseis.map(f => f.taxon);
    const strip = document.getElementById('stripTrack');
    strip.innerHTML = taxons.concat(taxons).map(t => `<span>${t}</span>`).join('');

    const eraOrder = ['Neoproterozóico / Cambriano','Paleozóico — Carbonífero','Paleozóico — Permiano','Mesozóico','Cenozóico — Quaternário'];
    const eraColors = { 'Neoproterozóico / Cambriano':'#1f4e5f','Paleozóico — Carbonífero':'#3d6b52','Paleozóico — Permiano':'#7fa66b','Mesozóico':'#c9a23a','Cenozóico — Quaternário':'#b5651d' };
    const counts = {};
    fosseis.forEach(f => { counts[f.era] = (counts[f.era]||0) + 1; });
    const max = Math.max(...Object.values(counts));
    const eraBars = document.getElementById('eraBars');
    eraBars.innerHTML = eraOrder.filter(e => counts[e]).map(e => `
      <div class="era-bar-row">
        <span class="era-bar-label">${e}</span>
        <span class="era-bar-track"><span class="era-bar-fill" style="width:${(counts[e]/max*100).toFixed(0)}%; background:${eraColors[e]}"></span></span>
        <span class="era-bar-count">${counts[e]}</span>
      </div>
    `).join('');
  }

  document.addEventListener('db:ready', renderHome);
})();
