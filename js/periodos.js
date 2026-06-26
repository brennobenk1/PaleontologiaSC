/* =========================================================
   periodos.js — linha do tempo geológica em accordion
   ========================================================= */

(function(){
  function renderTimelineRail(){
    const rail = document.getElementById('timelineRail');
    const total = DB.periodos.reduce((s,p) => s + (p.inicio_ma - p.fim_ma), 0);
    rail.innerHTML = DB.periodos.slice().sort((a,b)=>a.ordem-b.ordem).map(p => {
      const span = Math.max(p.inicio_ma - p.fim_ma, 0.3);
      const pct = (span / total * 100).toFixed(2);
      return `<span style="width:${pct}%;background:${p.cor}" title="${p.nome}"></span>`;
    }).join('');
  }

  function renderAccordion(){
    const wrap = document.getElementById('periodsAccordion');
    const periodos = DB.periodos.slice().sort((a,b)=>a.ordem-b.ordem);
    wrap.innerHTML = periodos.map((p, idx) => `
      <div class="period-item" data-idx="${idx}">
        <button class="period-trigger" aria-expanded="false">
          <span class="period-swatch" style="background:${p.cor}"></span>
          <span class="period-title">${p.nome}</span>
          <span class="period-range">${p.inicio_ma}–${p.fim_ma} Ma</span>
          <span class="period-count">${p.total_registros} registro${p.total_registros===1?'':'s'}</span>
          <svg class="period-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="period-panel">
          <div class="period-panel-inner">
            <p class="period-desc">${p.descricao}</p>
            <div class="taxon-chip-list">
              ${p.taxons.map(t => `<button class="taxon-chip" data-taxon="${t.taxon.replace(/"/g,'&quot;')}">${t.taxon}${t.count>1?`<span class="chip-count">×${t.count}</span>`:''}</button>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `).join('');

    wrap.querySelectorAll('.period-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.period-item');
        const open = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    wrap.querySelectorAll('.taxon-chip').forEach(chip => {
      chip.addEventListener('click', e => {
        e.stopPropagation();
        window.gotoCatalogWithTaxon(chip.dataset.taxon);
      });
    });
  }

  document.addEventListener('db:ready', () => {
    renderTimelineRail();
    renderAccordion();
  });
})();
