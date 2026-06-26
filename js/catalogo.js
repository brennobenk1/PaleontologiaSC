/* =========================================================
   catalogo.js — consulta ao banco de dados (filtros, busca, ficha)
   ========================================================= */

(function(){
  let mode = 'cards';
  let activeFilters = { periodo:'', categoria:'', municipio:'', instituicao:'', q:'' };

  function categoriaPillClass(categoria){
    return 'cat-pill cat-' + dbCategoriaGrupo(categoria);
  }
  function categoriaShort(categoria){
    return categoria.split('—')[0].trim();
  }

  function populateFilterOptions(){
    const periodoSel = document.getElementById('filterPeriodo');
    const catSel = document.getElementById('filterCategoria');
    const munSel = document.getElementById('filterMunicipio');
    const instSel = document.getElementById('filterInstituicao');

    const periodos = DB.periodos.slice().sort((a,b)=>a.ordem-b.ordem).map(p=>p.nome);
    periodos.forEach(p => periodoSel.insertAdjacentHTML('beforeend', `<option value="${p}">${p}</option>`));

    dbUnique('categoria').forEach(c => catSel.insertAdjacentHTML('beforeend', `<option value="${c}">${categoriaShort(c)}</option>`));
    dbUnique('municipio').forEach(m => munSel.insertAdjacentHTML('beforeend', `<option value="${m}">${m}</option>`));

    const instSet = new Set();
    DB.fosseis.forEach(f => instSet.add(f.armazenamento));
    Array.from(instSet).sort((a,b)=>a.localeCompare(b,'pt-BR')).forEach(i => instSel.insertAdjacentHTML('beforeend', `<option value="${i}">${i}</option>`));
  }

  function applyFilters(list){
    const q = activeFilters.q.trim().toLowerCase();
    return list.filter(f => {
      if(activeFilters.periodo && f.periodo !== activeFilters.periodo) return false;
      if(activeFilters.categoria && f.categoria !== activeFilters.categoria) return false;
      if(activeFilters.municipio && f.municipio !== activeFilters.municipio) return false;
      if(activeFilters.instituicao && f.armazenamento !== activeFilters.instituicao) return false;
      if(q){
        const hay = [f.taxon, f.formacao, f.municipio, f.descritor, f.categoria, f.observacoes, f.armazenamento].join(' ').toLowerCase();
        if(!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderCards(list){
    const wrap = document.getElementById('catalogCards');
    wrap.innerHTML = list.map(f => `
      <article class="fossil-card" data-id="${f.id}" tabindex="0">
        <div class="card-top">
          <h3 class="fossil-taxon">${f.taxon}</h3>
          <span class="${categoriaPillClass(f.categoria)}">${categoriaShort(f.categoria)}</span>
        </div>
        <span class="fossil-period">${f.periodo} &middot; ${f.idade_ma}</span>
        <div class="fossil-meta">
          <span><b>Formação:</b> ${f.formacao}</span>
          <span><b>Município:</b> ${f.municipio}</span>
          <span><b>Guarda:</b> ${f.armazenamento}</span>
        </div>
      </article>
    `).join('');
    wrap.querySelectorAll('.fossil-card').forEach(card => {
      card.addEventListener('click', () => openFossilModal(parseInt(card.dataset.id)));
      card.addEventListener('keydown', e => { if(e.key === 'Enter') openFossilModal(parseInt(card.dataset.id)); });
    });
  }

  function renderTable(list){
    const tbody = document.getElementById('catalogTableBody');
    tbody.innerHTML = list.map(f => `
      <tr data-id="${f.id}">
        <td class="fossil-taxon">${f.taxon}</td>
        <td>${f.periodo}</td>
        <td>${f.formacao}</td>
        <td>${f.municipio}</td>
        <td>${f.armazenamento}</td>
        <td>${f.idade_ma}</td>
      </tr>
    `).join('');
    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', () => openFossilModal(parseInt(row.dataset.id)));
    });
  }

  function renderCatalog(){
    const filtered = applyFilters(DB.fosseis);
    document.getElementById('resultCount').textContent = `${filtered.length} registro${filtered.length===1?'':'s'}`;
    document.getElementById('emptyState').classList.toggle('hidden', filtered.length !== 0);
    document.getElementById('catalogCards').classList.toggle('hidden', filtered.length === 0 || mode !== 'cards');
    document.getElementById('catalogTableWrap').classList.toggle('hidden', filtered.length === 0 || mode !== 'table');
    if(mode === 'cards') renderCards(filtered); else renderTable(filtered);
  }

  function openFossilModal(id){
    const f = dbFindFossil(id);
    if(!f) return;
    document.getElementById('modalBody').innerHTML = `
      <p class="${categoriaPillClass(f.categoria)}" style="display:inline-block;margin-bottom:0.6rem;">${f.categoria}</p>
      <h3 id="modalTitle" style="font-size:1.5rem;margin-bottom:0.2rem;">${f.taxon}</h3>
      <p class="muted" style="margin-bottom:0.4rem;">${f.periodo} &middot; idade estimada ${f.idade_ma}</p>

      <div class="modal-section">
        <div class="modal-grid">
          <div><b>Formação / Grupo</b>${f.formacao}</div>
          <div><b>Nº de amostra / catálogo</b>${f.numero_catalogo}</div>
          <div><b>Local de coleta</b>${f.local_coleta}</div>
          <div><b>Bacia / unidade</b>${f.bacia}</div>
          <div><b>Armazenamento atual</b>${f.armazenamento}</div>
          <div><b>Unidade de pesquisa</b>${f.unidade_pesquisa}</div>
          <div><b>Descritor(es) / referência</b>${f.descritor}</div>
        </div>
      </div>

      ${f.observacoes && f.observacoes !== '-' ? `
      <div class="modal-section">
        <h4>Observações</h4>
        <p style="margin:0;font-size:0.92rem;">${f.observacoes}</p>
      </div>` : ''}

      <div class="modal-section">
        <h4>Fontes / verificação</h4>
        <ul class="modal-sources">
          ${f.fontes.map(u => u.startsWith('http') ? `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a></li>` : `<li>${u}</li>`).join('')}
        </ul>
      </div>
    `;
    document.getElementById('modalOverlay').classList.add('open');
  }

  function closeModal(){
    document.getElementById('modalOverlay').classList.remove('open');
  }

  document.addEventListener('db:ready', () => {
    populateFilterOptions();
    renderCatalog();
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchInput').addEventListener('input', e => { activeFilters.q = e.target.value; renderCatalog(); });
    document.getElementById('filterPeriodo').addEventListener('change', e => { activeFilters.periodo = e.target.value; renderCatalog(); });
    document.getElementById('filterCategoria').addEventListener('change', e => { activeFilters.categoria = e.target.value; renderCatalog(); });
    document.getElementById('filterMunicipio').addEventListener('change', e => { activeFilters.municipio = e.target.value; renderCatalog(); });
    document.getElementById('filterInstituicao').addEventListener('change', e => { activeFilters.instituicao = e.target.value; renderCatalog(); });
    document.getElementById('clearFilters').addEventListener('click', () => {
      activeFilters = { periodo:'', categoria:'', municipio:'', instituicao:'', q:'' };
      document.getElementById('searchInput').value = '';
      document.querySelectorAll('.filter-row select').forEach(s => s.value = '');
      renderCatalog();
    });
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mode = btn.dataset.mode;
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.toggle('active', b===btn));
        renderCatalog();
      });
    });
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', e => { if(e.target.id === 'modalOverlay') closeModal(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
  });

  // expõe para uso por outras abas (períodos -> abrir ficha de um táxon)
  window.openFossilModal = openFossilModal;
  window.gotoCatalogWithTaxon = function(taxon){
    document.querySelector('[data-view="catalogo"]').click();
    setTimeout(() => {
      document.getElementById('searchInput').value = taxon;
      activeFilters.q = taxon;
      renderCatalog();
    }, 50);
  };
})();
