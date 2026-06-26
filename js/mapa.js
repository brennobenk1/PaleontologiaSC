/* =========================================================
   mapa.js — mapa interativo Leaflet com sítios e bacias
   ========================================================= */

(function(){
  let map = null;
  let initialized = false;

  function radiusForCount(count){
    return 6 + Math.sqrt(count) * 4;
  }

  function buildMap(){
    if(initialized) return;
    initialized = true;

    map = L.map('leafletMap', { scrollWheelZoom: true }).setView([-27.35, -49.6], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 16,
    }).addTo(map);

    // Bacias (polígonos)
    const legendList = document.getElementById('bacenLegend');
    legendList.innerHTML = '';
    DB.bacias.forEach(b => {
      L.polygon(b.coords, {
        color: b.cor, weight: 1.5, fillColor: b.cor, fillOpacity: 0.18, dashArray: '4,4'
      }).addTo(map).bindPopup(`<b>${b.nome}</b><br>${b.descricao}`);

      legendList.insertAdjacentHTML('beforeend', `
        <li><span class="legend-swatch" style="background:${b.cor}"></span><span>${b.nome}</span></li>
      `);
    });
    legendList.insertAdjacentHTML('beforeend', `
      <li><span class="legend-swatch" style="background:#b5651d;border-radius:50%;"></span><span>Sítio de coleta (tamanho = nº de registros)</span></li>
    `);

    // Sítios (marcadores circulares)
    DB.sitios.forEach(s => {
      if(s.lat == null || s.lon == null) return;
      const marker = L.circleMarker([s.lat, s.lon], {
        radius: radiusForCount(s.count),
        color: '#7a3a10',
        weight: 1.5,
        fillColor: '#b5651d',
        fillOpacity: 0.75,
      }).addTo(map);

      marker.bindPopup(`
        <b>${s.site}</b><br>
        ${s.municipio}<br>
        <span style="font-family:monospace;font-size:0.78em;">${s.count} registro${s.count===1?'':'s'} &middot; ${s.bacia}</span>
      `);

      marker.on('click', () => showSiteDetail(s));
    });
  }

  function showSiteDetail(s){
    const el = document.getElementById('mapSiteDetail');
    el.innerHTML = `
      <h5>${s.site}</h5>
      <p class="muted" style="margin-bottom:0.5rem;">${s.municipio} &middot; ${s.bacia}</p>
      <p style="margin-bottom:0.4rem;"><b>${s.count}</b> registro${s.count===1?'':'s'} catalogado${s.count===1?'':'s'}</p>
      <p class="muted" style="margin-bottom:0.3rem;">Períodos: ${s.periodos.join(', ')}</p>
      <ul class="site-taxon-list">
        ${s.taxons_amostra.map(t => `<li><em>${t}</em></li>`).join('')}
        ${s.count > s.taxons_amostra.length ? `<li class="muted">+ ${s.count - s.taxons_amostra.length} outro(s)…</li>` : ''}
      </ul>
      <button class="btn btn-text" data-explore="${s.site}" style="margin-top:0.4rem;">Ver no catálogo →</button>
    `;
    const btn = el.querySelector('[data-explore]');
    if(btn) btn.addEventListener('click', () => window.gotoCatalogWithTaxon(s.taxons_amostra[0] || ''));
  }

  document.addEventListener('view:show', e => {
    if(e.detail.name === 'mapa'){
      buildMap();
      setTimeout(() => { if(map) map.invalidateSize(); }, 60);
    }
  });
})();
