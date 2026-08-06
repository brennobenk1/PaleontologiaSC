
/* =========================================================
   Paleo-SC — app.js
   Toda a lógica do site: navegação, catálogo, mapa SVG,
   períodos geológicos e instituições.
   Os dados (DB_FOSSEIS, DB_PERIODOS, DB_INSTITUICOES, DB_SITIOS,
   DB_BACIAS, SC_MAP_PATH, SC_MAP_VIEWBOX) estão definidos acima
   neste mesmo arquivo (bloco gerado a partir da planilha).
   ========================================================= */

/* ---------------------------------------------------------
   Helpers de consulta ao "banco de dados" embutido
   --------------------------------------------------------- */
function dbUnique(field){
  return Array.from(new Set(DB_FOSSEIS.map(f => f[field]).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'pt-BR'));
}

/* ---------------------------------------------------------------
   Normalização das listas de filtro.
   O campo livre `armazenamento` traz a mesma instituição escrita de
   várias formas ("CENPALEO/UnC", "CENPALEO / Museu da Terra e da
   Vida, UnC, Mafra, SC", ...). Sem normalizar, o seletor de Guarda
   mostrava a mesma instituição como várias opções distintas e cada
   uma filtrava só uma parte dos registros. Retorna uma LISTA porque
   há registros com guarda compartilhada entre duas instituições.
   --------------------------------------------------------------- */
function guardasDe(str){
  if(!str) return ['Não informado'];
  const out = [];
  if(/CENPALEO/i.test(str))              out.push('CENPALEO/UnC (Mafra, SC)');
  if(/UNISINOS|LaViG/i.test(str))        out.push('UNISINOS — LaViGæa (São Leopoldo, RS)');
  if(/UFRGS/i.test(str))                 out.push('UFRGS (Porto Alegre, RS)');
  if(/UERJ|LABPALEO/i.test(str))         out.push('LABPALEO/UERJ (Rio de Janeiro, RJ)');
  if(/USP/i.test(str))                   out.push('IGc-USP (São Paulo, SP)');
  if(/Univali/i.test(str))               out.push('Museu Oceanográfico Univali (SC)');
  if(/Geoparque/i.test(str))             out.push('Geoparque Caminhos dos Cânions do Sul (SC)');
  if(/UNESC\b/i.test(str) && !/UNESCO/i.test(str)) out.push('UNESC (Criciúma, SC)');
  if(/UDESC/i.test(str))                 out.push('UDESC (SC)');
  return out.length ? out : ['Não informado'];
}

/* Agrupa "Mafra" com "Mafra (região)" e separa registros que abrangem
   mais de um município ("Jacinto Machado / Praia Grande"). */
function municipiosDe(str){
  if(!str || /^Não especificado/i.test(str)) return ['Não especificado'];
  return str.replace(/\s*\(região\)\s*/gi, '')
            .split('/')
            .map(s => s.trim())
            .filter(Boolean);
}

function dbUniqueGrouped(fn){
  const set = new Set();
  DB_FOSSEIS.forEach(f => fn(f).forEach(v => set.add(v)));
  return Array.from(set).sort((a,b) => {
    if(a === 'Não informado' || a === 'Não especificado') return 1;
    if(b === 'Não informado' || b === 'Não especificado') return -1;
    return a.localeCompare(b,'pt-BR');
  });
}
function dbFindFossil(id){
  return DB_FOSSEIS.find(f => f.id === id);
}
function dbCategoriaGrupo(categoria){
  const c = categoria.toLowerCase();
  if(c.startsWith('vertebrado')) return 'vert';
  if(c.startsWith('invertebrado')) return 'invert';
  if(c.startsWith('flora')) return 'flora';
  if(c.startsWith('icnofóssil') || c.startsWith('icnofossil')) return 'icno';
  if(c.startsWith('microfóssil') || c.startsWith('microfossil')) return 'micro';
  if(c.startsWith('metazoário') || c.startsWith('metazoario')) return 'meta';
  return 'invert';
}
function categoriaShort(categoria){ return categoria.split('—')[0].trim(); }
function categoriaPillClass(categoria){ return 'cat-pill cat-' + dbCategoriaGrupo(categoria); }

/* Cor estratigráfica do período — a MESMA paleta da coluna-testemunho do
   topo da página. Reaproveitá-la no catálogo dá leitura instantânea da
   idade de cada registro sem precisar ler o texto. */
const __periodoCorCache = {};
function periodoCor(nomePeriodo){
  if(__periodoCorCache[nomePeriodo] !== undefined) return __periodoCorCache[nomePeriodo];
  const p = DB_PERIODOS.find(x => x.nome === nomePeriodo);
  return (__periodoCorCache[nomePeriodo] = p ? p.cor : '#8a9b6f');
}

/* ===========================================================
   NAVEGAÇÃO (SPA entre abas)
   =========================================================== */
(function(){
  function ready(fn){
    // Com <script defer>, este arquivo é avaliado com readyState
    // 'interactive' — chamar fn() aqui dentro rodaria a inicialização
    // ANTES das declarações `let` mais abaixo no arquivo, estourando
    // erro de temporal dead zone. setTimeout garante que fn só roda
    // depois que todo este script terminou de ser avaliado.
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else setTimeout(fn, 0);
  }

  ready(() => {
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view');
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.querySelector('.main-nav');

    function showView(name, opts){
      views.forEach(v => v.classList.toggle('active', v.dataset.view === name));
      navLinks.forEach(l => l.classList.toggle('active', l.dataset.view === name));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
      if(!(opts && opts.semUrl)) atualizarURL(name);
      document.dispatchEvent(new CustomEvent('view:show', { detail: { name } }));
    }
    window.paleoShowView = showView;

    navLinks.forEach(link => link.addEventListener('click', () => showView(link.dataset.view)));
    // delegação: pega também os [data-goto] criados dinamicamente depois
    // deste ponto (ex.: as fichas do hero, renderizadas em initHome)
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-goto]');
      if(btn) showView(btn.dataset.goto);
    });
    document.addEventListener('keydown', e => {
      if(e.key !== 'Enter' && e.key !== ' ') return;
      const btn = e.target.closest('[data-goto][role="button"]');
      if(btn){ e.preventDefault(); showView(btn.dataset.goto); }
    });

    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    initHome();
    initCatalogo();
    initMapa();
    initPeriodos();
    initInstituicoes();
    initAvifauna();
    initArvore();
    // restaura o estado vindo da URL (permalink) depois de tudo pronto
    aplicarHash();
  });
})();

/* ===========================================================
   INÍCIO — estatísticas, frieze de táxons, barras por era
   =========================================================== */
function initHome(){
  const nSitios = DB_SITIOS.length;
  const nInst = DB_INSTITUICOES.length;
  const periodosCount = new Set(DB_FOSSEIS.map(f => f.periodo)).size;

  const orderedPeriods = DB_PERIODOS.slice().sort((a,b)=>a.ordem-b.ordem);
  const totalRegistros = orderedPeriods.reduce((s,p)=>s+p.total_registros,0);
  const coreBands = orderedPeriods.map(p => {
    const h = Math.max(3, (p.total_registros/totalRegistros*100)).toFixed(2);
    return `<span class="core-band" style="height:${h}%; background:${p.cor}" title="${p.nome} — ${p.total_registros} registro${p.total_registros===1?'':'s'}"></span>`;
  }).join('');

  document.getElementById('heroStats').innerHTML = `
    <div class="specimen-rack">
      <div class="core-sample" role="img" aria-label="Coluna estratigráfica simplificada, do Ediacarano ao Quaternário, com a proporção de registros catalogados por período">
        <span class="core-cap core-cap-top"></span>
        ${coreBands}
        <span class="core-cap core-cap-bottom"></span>
      </div>
      <span class="core-caption">Ediacarano<br>&darr;<br>Quaternário</span>
      <div class="tag-stack">
        <div class="stat-card tag-1" data-goto="catalogo" role="button" tabindex="0"><span class="stat-num">${DB_FOSSEIS.length}</span><span class="stat-label">Registros</span></div>
        <div class="stat-card tag-2" data-goto="mapa" role="button" tabindex="0"><span class="stat-num">${nSitios}</span><span class="stat-label">Sítios</span></div>
        <div class="stat-card tag-3" data-goto="periodos" role="button" tabindex="0"><span class="stat-num">${periodosCount}</span><span class="stat-label">Períodos</span></div>
        <div class="stat-card tag-4" data-goto="instituicoes" role="button" tabindex="0"><span class="stat-num">${nInst}</span><span class="stat-label">Instituições</span></div>
      </div>
    </div>
  `;

  const taxons = DB_FOSSEIS.map(f => f.taxon);
  document.getElementById('stripTrack').innerHTML = taxons.concat(taxons).map(t => `<span>${t}</span>`).join('');

  const eraOrder = ['Neoproterozóico / Cambriano','Paleozóico — Carbonífero','Paleozóico — Permiano','Mesozóico','Cenozóico — Quaternário'];
  const eraColors = { 'Neoproterozóico / Cambriano':'#1f4e5f','Paleozóico — Carbonífero':'#3d6b52','Paleozóico — Permiano':'#7fa66b','Mesozóico':'#c9a23a','Cenozóico — Quaternário':'#b5651d' };
  const counts = {};
  DB_FOSSEIS.forEach(f => { counts[f.era] = (counts[f.era]||0) + 1; });
  const total = DB_FOSSEIS.length;
  const max = Math.max(...Object.values(counts));
  document.getElementById('eraBars').innerHTML = eraOrder.filter(e => counts[e]).map(e => {
    // largura mínima de 4%: a distribuição é muito desigual (o Permiano
    // domina), e sem piso as eras pequenas viravam traços invisíveis
    const w = Math.max(4, counts[e] / max * 100);
    const pct = (counts[e] / total * 100).toFixed(counts[e] / total < 0.1 ? 1 : 0);
    return `
    <div class="era-bar-row">
      <span class="era-bar-label">${e}</span>
      <span class="era-bar-track"><span class="era-bar-fill" style="width:${w.toFixed(1)}%; background:${eraColors[e]}"></span></span>
      <span class="era-bar-count">${counts[e]}<i>${pct}%</i></span>
    </div>
  `;}).join('');

  // contagem sempre em sincronia com o banco (antes estava fixa em "97")
  const featCount = document.getElementById('featCount');
  if(featCount) featCount.textContent = DB_FOSSEIS.length;
  const rodape = document.getElementById('footerTotal');
  if(rodape) rodape.textContent = DB_FOSSEIS.length;
}

/* ===========================================================
   CATÁLOGO — busca, filtros, cartões/tabela, ficha (modal)
   =========================================================== */
let __catalogMode = 'cards';
let __catalogFilters = { periodo:'', categoria:'', municipio:'', instituicao:'', q:'', grupoTax:'', subTax:'' };

function initCatalogo(){
  const periodoSel = document.getElementById('filterPeriodo');
  const catSel = document.getElementById('filterCategoria');
  const munSel = document.getElementById('filterMunicipio');
  const instSel = document.getElementById('filterInstituicao');

  DB_PERIODOS.slice().sort((a,b)=>a.ordem-b.ordem).forEach(p =>
    periodoSel.insertAdjacentHTML('beforeend', `<option value="${p.nome}">${p.nome}</option>`));
  dbUnique('categoria').forEach(c => catSel.insertAdjacentHTML('beforeend', `<option value="${c}">${categoriaShort(c)}</option>`));
  dbUniqueGrouped(f => municipiosDe(f.municipio)).forEach(m =>
    munSel.insertAdjacentHTML('beforeend', `<option value="${m}">${m}</option>`));

  dbUniqueGrouped(f => guardasDe(f.armazenamento)).forEach(i =>
    instSel.insertAdjacentHTML('beforeend', `<option value="${i}">${i}</option>`));

  renderCatalog();

  document.getElementById('searchInput').addEventListener('input', e => { __catalogFilters.q = e.target.value; renderCatalog(); });
  periodoSel.addEventListener('change', e => { __catalogFilters.periodo = e.target.value; renderCatalog(); });
  catSel.addEventListener('change', e => { __catalogFilters.categoria = e.target.value; renderCatalog(); });
  munSel.addEventListener('change', e => { __catalogFilters.municipio = e.target.value; renderCatalog(); });
  instSel.addEventListener('change', e => { __catalogFilters.instituicao = e.target.value; renderCatalog(); });

  document.getElementById('clearFilters').addEventListener('click', () => {
    __catalogFilters = { periodo:'', categoria:'', municipio:'', instituicao:'', q:'', grupoTax:'', subTax:'' };
    renderNavTaxonomica();
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.filter-row select').forEach(s => s.value = '');
    renderCatalog();
  });

  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      __catalogMode = btn.dataset.mode;
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.toggle('active', b===btn));
      renderCatalog();
    });
  });

  document.getElementById('modalClose').addEventListener('click', closeFossilModal);
  document.getElementById('modalOverlay').addEventListener('click', e => { if(e.target.id === 'modalOverlay') closeFossilModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeFossilModal(); });
}

function applyCatalogFilters(list){
  const q = __catalogFilters.q.trim().toLowerCase();
  return list.filter(f => {
    if(__catalogFilters.periodo && f.periodo !== __catalogFilters.periodo) return false;
    if(__catalogFilters.categoria && f.categoria !== __catalogFilters.categoria) return false;
    if(__catalogFilters.grupoTax && grupoTaxonomico(f.categoria) !== __catalogFilters.grupoTax) return false;
    if(__catalogFilters.subTax && subgrupoTaxonomico(f.categoria) !== __catalogFilters.subTax) return false;
    if(__catalogFilters.municipio && !municipiosDe(f.municipio).includes(__catalogFilters.municipio)) return false;
    if(__catalogFilters.instituicao && !guardasDe(f.armazenamento).includes(__catalogFilters.instituicao)) return false;
    if(q){
      const hay = [f.taxon, f.formacao, f.municipio, f.descritor, f.categoria, f.observacoes, f.armazenamento].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderCatalog(){
  // mantém a URL espelhando os filtros, para que a busca seja compartilhável
  if(document.querySelector('.view-catalogo.active')) atualizarURL('catalogo');
  const filtered = applyCatalogFilters(DB_FOSSEIS);
  document.getElementById('resultCount').textContent = `${filtered.length} registro${filtered.length===1?'':'s'}`;
  document.getElementById('emptyState').classList.toggle('hidden', filtered.length !== 0);
  document.getElementById('catalogCards').classList.toggle('hidden', filtered.length === 0 || __catalogMode !== 'cards');
  document.getElementById('catalogTableWrap').classList.toggle('hidden', filtered.length === 0 || __catalogMode !== 'table');
  if(__catalogMode === 'cards') renderCatalogCards(filtered); else renderCatalogTable(filtered);
}

function cardHTML(f){
  return `
    <article class="fossil-card" data-id="${f.id}" tabindex="0" style="--per-cor:${periodoCor(f.periodo)}">
      <span class="fossil-tagno">Nº ${String(f.id).padStart(3,'0')}</span>
      <div class="card-top">
        <h3 class="fossil-taxon">${f.taxon}</h3>
        <span class="${categoriaPillClass(f.categoria)}">${categoriaShort(f.categoria)}</span>
      </div>
      <span class="fossil-period"><i class="per-dot"></i>${f.periodo} &middot; ${f.idade_ma}</span>
      <div class="fossil-meta">
        <span><b>Formação</b>${f.formacao}</span>
        <span><b>Município</b>${f.municipio}</span>
      </div>
      <span class="fossil-guarda">${f.armazenamento}</span>
    </article>
  `;
}

/* ---------------------------------------------------------------
   RENDERIZAÇÃO INCREMENTAL
   Antes os 158 cards eram criados de uma vez. Com o catálogo
   crescendo (e a maior parte fora da tela), isso trava o primeiro
   desenho sem necessidade. Agora entra um lote por vez, e o
   próximo só quando o leitor chega perto do fim.
   --------------------------------------------------------------- */
const LOTE_CARDS = 36;
let __restoCards = [];
let __observadorFim = null;

function ligarCliqueCards(escopo){
  escopo.querySelectorAll('.fossil-card:not([data-ligado])').forEach(card => {
    card.dataset.ligado = '1';
    const abrir = () => openFossilModal(parseInt(card.dataset.id));
    card.addEventListener('click', abrir);
    card.addEventListener('keydown', e => { if(e.key === 'Enter') abrir(); });
  });
}

function renderCatalogCards(list){
  const wrap = document.getElementById('catalogCards');
  const sentinela = document.getElementById('cardsSentinela');
  wrap.innerHTML = list.slice(0, LOTE_CARDS).map(cardHTML).join('');
  ligarCliqueCards(wrap);
  __restoCards = list.slice(LOTE_CARDS);

  if(__observadorFim) __observadorFim.disconnect();
  if(!sentinela) return;
  sentinela.classList.toggle('hidden', __restoCards.length === 0);
  if(!__restoCards.length) return;

  __observadorFim = new IntersectionObserver(entradas => {
    if(!entradas[0].isIntersecting) return;
    const lote = __restoCards.splice(0, LOTE_CARDS);
    wrap.insertAdjacentHTML('beforeend', lote.map(cardHTML).join(''));
    ligarCliqueCards(wrap);
    if(!__restoCards.length){
      sentinela.classList.add('hidden');
      __observadorFim.disconnect();
    }
  }, { rootMargin: '600px' });
  __observadorFim.observe(sentinela);
}

function renderCatalogTable(list){
  const tbody = document.getElementById('catalogTableBody');
  tbody.innerHTML = list.map(f => `
    <tr data-id="${f.id}" style="--per-cor:${periodoCor(f.periodo)}">
      <td class="fossil-taxon">${f.taxon}</td>
      <td class="td-periodo"><i class="per-dot"></i>${f.periodo}</td>
      <td>${f.formacao}</td>
      <td>${f.municipio}</td>
      <td>${f.armazenamento}</td>
      <td>${f.idade_ma}</td>
    </tr>
  `).join('');
  tbody.querySelectorAll('tr').forEach(row => row.addEventListener('click', () => openFossilModal(parseInt(row.dataset.id))));
}

function openFossilModal(id){
  const f = dbFindFossil(id);
  if(!f) return;
  atualizarURL(null, '#/registro/' + id);
  document.getElementById('modalBody').innerHTML = `
    <p class="${categoriaPillClass(f.categoria)}" style="display:inline-block;margin-bottom:0.6rem;">${f.categoria}</p>
    <a class="btn-reportar" target="_blank" rel="noopener noreferrer" title="Encontrou um erro neste registro? Abra uma correção"
       href="${urlIssue(f)}">&#9873; reportar erro</a>
    <button type="button" class="btn-permalink" data-permalink="${urlDoRegistro(id)}" title="Copiar link para este registro">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/>
        <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>
      </svg> Nº ${String(id).padStart(3,'0')} · copiar link
    </button>
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
        ${f.doi ? `<li><a class="fonte-doi" href="https://doi.org/${f.doi}" target="_blank" rel="noopener noreferrer"><i>DOI</i> ${f.doi}</a></li>` : ''}
        ${f.fontes.filter(u => !(f.doi && u.includes('doi.org/' + f.doi))).map(u => u.startsWith('http')
          ? `<li><a href="${u}" target="_blank" rel="noopener noreferrer"><i class="fonte-tipo ${classeFonte(u)}">${rotuloFonte(u)}</i> ${u}</a></li>`
          : `<li>${u}</li>`).join('')}
      </ul>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  focarModal();
}
function closeFossilModal(){
  document.getElementById('modalOverlay').classList.remove('open');
  document.dispatchEvent(new CustomEvent('modal:close'));
}

window.gotoCatalogWithTaxon = function(taxon){
  window.paleoShowView('catalogo');
  setTimeout(() => {
    document.getElementById('searchInput').value = taxon;
    __catalogFilters.q = taxon;
    renderCatalog();
  }, 50);
};

/* ===========================================================
   MAPA — SVG nativo do contorno de SC, sem dependências externas
   =========================================================== */
function initMapa(){
  const legendList = document.getElementById('bacenLegend');
  legendList.innerHTML = DB_BACIAS.map(b =>
    `<li><span class="legend-swatch" style="background:${b.cor}"></span><span>${b.nome}</span></li>`
  ).join('') + `<li><span class="legend-swatch" style="background:#b5651d;border-radius:50%;"></span><span>Sítio de coleta (tamanho = nº de registros)</span></li>`;

  const polygons = DB_BACIAS.map(b =>
    `<polygon points="${b.svg_points}" fill="${b.cor}" fill-opacity="0.22" stroke="${b.cor}" stroke-width="1.5" stroke-dasharray="4,3" data-bacia="${encodeURIComponent(b.nome)}"></polygon>`
  ).join('');

  // maiores primeiro => desenhados por baixo, para que sítios pequenos
  // sobrepostos por um vizinho grande continuem visíveis e clicáveis
  const circles = DB_SITIOS.filter(s => s.x != null)
    .slice().sort((a, b) => b.count - a.count)
    .map(s => {
    const r = (4 + Math.sqrt(s.count) * 2.8).toFixed(1);
    return `<circle cx="${s.x}" cy="${s.y}" r="${r}" fill="#b5651d" fill-opacity="0.78" stroke="#7a3a10" stroke-width="1.4" class="site-dot" data-site="${encodeURIComponent(s.site)}"></circle>`;
  }).join('');

  document.getElementById('svgMapWrap').innerHTML = `
    <svg viewBox="${SC_MAP_VIEWBOX}" id="scMapSvg" role="img" aria-label="Mapa de Santa Catarina com sítios fossilíferos">
      <path d="${SC_MAP_PATH}" fill="#ece1c8" stroke="#1f4e5f" stroke-width="2.2"></path>
      ${polygons}
      ${circles}
    </svg>
  `;

  const svgEl = document.getElementById('scMapSvg');
  svgEl.querySelectorAll('.site-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const siteName = decodeURIComponent(dot.dataset.site);
      const s = DB_SITIOS.find(x => x.site === siteName);
      if(s) showSiteDetail(s);
      svgEl.querySelectorAll('.site-dot').forEach(d => d.classList.remove('site-dot-active'));
      dot.classList.add('site-dot-active');
    });
  });
  svgEl.querySelectorAll('polygon').forEach(poly => {
    poly.addEventListener('click', () => {
      const nome = decodeURIComponent(poly.dataset.bacia);
      const b = DB_BACIAS.find(x => x.nome === nome);
      if(b) showBaciaDetail(b);
    });
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
    <button class="btn btn-text" id="mapExploreBtn">Ver no catálogo →</button>
  `;
  document.getElementById('mapExploreBtn').addEventListener('click', () => window.gotoCatalogWithTaxon(s.taxons_amostra[0] || ''));
}

function showBaciaDetail(b){
  const el = document.getElementById('mapSiteDetail');
  el.innerHTML = `
    <h5>${b.nome}</h5>
    <p style="margin:0;font-size:0.88rem;">${b.descricao}</p>
  `;
}

/* ===========================================================
   PERÍODOS GEOLÓGICOS — accordion com táxons
   =========================================================== */
function initPeriodos(){
  const periodos = DB_PERIODOS.slice().sort((a,b)=>a.ordem-b.ordem);

  const total = periodos.reduce((s,p) => s + (p.inicio_ma - p.fim_ma), 0);
  document.getElementById('timelineRail').innerHTML = periodos.map(p => {
    const span = Math.max(p.inicio_ma - p.fim_ma, 0.3);
    const pct = (span / total * 100).toFixed(2);
    return `<span style="width:${pct}%;background:${p.cor}" title="${p.nome}"></span>`;
  }).join('');

  const wrap = document.getElementById('periodsAccordion');
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

/* ===========================================================
   INSTITUIÇÕES — cartões com contato
   =========================================================== */
function countForInst(sigla, nome){
  return DB_FOSSEIS.filter(f =>
    (f.armazenamento && (f.armazenamento.includes(sigla) || f.armazenamento.includes(nome.split(' —')[0]))) ||
    (f.unidade_pesquisa && f.unidade_pesquisa.includes(sigla))
  ).length;
}

function initInstituicoes(){
  const grid = document.getElementById('instGrid');
  grid.innerHTML = DB_INSTITUICOES.map(inst => {
    const n = countForInst(inst.sigla, inst.nome);
    return `
    <article class="inst-card">
      <div class="inst-top">
        <div>
          <span class="inst-sigla">${inst.sigla}</span>
          <h3 class="inst-name">${inst.nome}</h3>
          <p class="inst-type">${inst.tipo} &middot; ${inst.cidade}, ${inst.uf}</p>
        </div>
      </div>
      <p class="inst-desc">${inst.descricao}</p>
      <dl class="inst-contacts">
        <dt>Endereço</dt><dd>${inst.endereco}</dd>
        <dt>E-mail</dt><dd>${inst.email.startsWith('Não') ? inst.email : `<a href="mailto:${inst.email}">${inst.email}</a>`}</dd>
        <dt>Site</dt><dd><a href="${inst.site}" target="_blank" rel="noopener noreferrer">${inst.site.replace('https://','')}</a></dd>
        <dt>Telefone</dt><dd>${inst.telefone}</dd>
        <dt>Gestão / responsável</dt><dd>${inst.gestor}</dd>
      </dl>
      ${n > 0 ? `<span class="inst-badge">${n} registro${n===1?'':'s'} no catálogo</span>` : ''}
    </article>`;
  }).join('');

  const glossary = [
    ['Período Geológico', 'Eon / Era / Período / Época conforme ICS 2024. Quando preciso, inclui a idade do andar (ex: Asseliano).'],
    ['Formação / Grupo', 'Unidade litoestratigráfica formal. Inclui o nome informal do afloramento quando relevante.'],
    ['Táxon / Material', 'Nome científico (gênero + espécie) quando disponível; para icnofósseis, inclui o icnotáxon formal.'],
    ['Categoria', 'Grupo funcional: Vertebrado, Invertebrado, Flora, Microfóssil, Icnofóssil ou Metazoário.'],
    ['Nº de Amostra / Catálogo', "Número de tombamento institucional. '-' indica dado não localizado na literatura."],
    ['Local de Coleta', 'Município e afloramento específico quando publicado.'],
    ['Local de Armazenamento', "Instituição custodiante atual do material."],
    ['Descritor(es) / Referência', 'Autor(es) da primeira descrição formal ou referência principal citada.'],
    ['Unidade de Pesquisa', 'Laboratório ou grupo de pesquisa atualmente associado ao estudo do material.'],
    ['Idade Estimada (Ma)', 'Milhões de anos antes do presente, conforme idades publicadas para a unidade ou datações citadas.'],
  ];
  document.getElementById('fieldGlossary').innerHTML = glossary.map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
}

/* ===========================================================
   AVIFAUNA DO BRASIL — aba nacional independente
   =========================================================== */
let __aviFilters = { estado:'', periodo:'', q:'' };

function dbAviFindTaxon(taxon){
  return DB_AVIFAUNA.find(t => t.taxon === taxon);
}

function aviPeriodoGrupo(periodo){
  if(periodo.includes('Cretáceo')) return 'Cretáceo (Mesozoico)';
  if(periodo.includes('Paleoceno') || periodo.includes('Eoceno')) return 'Paleógeno (Paleoceno–Eoceno)';
  if(periodo.includes('Oligoceno') || periodo.includes('Mioceno')) return 'Neógeno (Oligoceno–Mioceno)';
  if(periodo.includes('Pleistoceno') || periodo.includes('Holoceno')) return 'Quaternário (Pleistoceno–Holoceno)';
  return 'Outro';
}

function aviEra(periodo){
  return periodo.includes('Cretáceo') ? 'Mesozoico' : 'Cenozoico';
}

function initAvifauna(){
  // Estatísticas gerais
  const nEstadosComRegistro = DB_COBERTURA_ESTADOS.filter(e => e.registros > 0).length;
  const nMesozoicos = DB_AVIFAUNA.filter(t => aviEra(t.periodo) === 'Mesozoico').length;
  document.getElementById('aviStats').innerHTML = `
    <div class="stat-card"><span class="stat-num">${DB_RESUMO_AVIFAUNA.total_registros_literatura}</span><span class="stat-label">Registros na literatura</span></div>
    <div class="stat-card"><span class="stat-num">${DB_RESUMO_AVIFAUNA.taxons_total_catalogo || DB_AVIFAUNA.length}</span><span class="stat-label">Táxons extintos catalogados</span></div>
    <div class="stat-card"><span class="stat-num">${nMesozoicos}</span><span class="stat-label">Táxons mesozoicos (Cretáceo)</span></div>
    <div class="stat-card"><span class="stat-num">${nEstadosComRegistro}</span><span class="stat-label">Estados com registro</span></div>
  `;

  document.getElementById('aviSourceNote').innerHTML =
    `Fonte principal: ${DB_RESUMO_AVIFAUNA.fonte_principal} &middot; Fonte secundária: ${DB_RESUMO_AVIFAUNA.fonte_secundaria}` +
    (DB_RESUMO_AVIFAUNA.nota_mesozoico ? `<br><span class="muted">${DB_RESUMO_AVIFAUNA.nota_mesozoico}</span>` : '');

  renderAviMap();
  renderAviStateTable();
  renderAviMesozoicHighlight();

  // Filtros
  const estSel = document.getElementById('aviFilterEstado');
  Array.from(new Set(DB_AVIFAUNA.map(t => t.estado).filter(e => e && e !== 'Não especificado')))
    .sort((a,b)=>a.localeCompare(b,'pt-BR'))
    .forEach(e => estSel.insertAdjacentHTML('beforeend', `<option value="${e}">${e}</option>`));

  const perSel = document.getElementById('aviFilterPeriodo');
  const periodoOrdem = ['Cretáceo (Mesozoico)', 'Paleógeno (Paleoceno–Eoceno)', 'Neógeno (Oligoceno–Mioceno)', 'Quaternário (Pleistoceno–Holoceno)'];
  periodoOrdem.filter(p => DB_AVIFAUNA.some(t => aviPeriodoGrupo(t.periodo) === p))
    .forEach(p => perSel.insertAdjacentHTML('beforeend', `<option value="${p}">${p}</option>`));

  document.getElementById('aviSearchInput').addEventListener('input', e => { __aviFilters.q = e.target.value; renderAviResults(); });
  estSel.addEventListener('change', e => { __aviFilters.estado = e.target.value; renderAviResults(); });
  perSel.addEventListener('change', e => { __aviFilters.periodo = e.target.value; renderAviResults(); });

  renderAviResults();
}

function applyAviFilters(list){
  const q = __aviFilters.q.trim().toLowerCase();
  return list.filter(t => {
    if(__aviFilters.estado && t.estado !== __aviFilters.estado) return false;
    if(__aviFilters.periodo && aviPeriodoGrupo(t.periodo) !== __aviFilters.periodo) return false;
    if(q){
      const hay = [t.taxon, t.familia, t.ordem, t.estado, t.municipio, t.formacao, t.obs].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderAviResults(){
  const filtered = applyAviFilters(DB_AVIFAUNA);
  document.getElementById('aviResultCount').textContent = `${filtered.length} táxon${filtered.length===1?'':'s'}`;
  document.getElementById('aviEmptyState').classList.toggle('hidden', filtered.length !== 0);
  const wrap = document.getElementById('aviResults');
  wrap.innerHTML = filtered.map(t => {
    const era = aviEra(t.periodo);
    const eraBadgeClass = era === 'Mesozoico' ? 'cat-pill cat-meta' : 'cat-pill cat-vert';
    return `
    <article class="avi-card" data-taxon="${encodeURIComponent(t.taxon)}" tabindex="0">
      <div class="avi-card-top">
        <h3 class="avi-taxon-name">${t.taxon}</h3>
        <span class="${eraBadgeClass}">${era}</span>
      </div>
      <span class="avi-card-period">${t.periodo} &middot; ${t.idade_ma}</span>
      <div class="avi-card-meta">
        <span><b>Família:</b> ${t.familia}</span>
        <span><b>Local-tipo:</b> ${t.municipio}, ${t.estado}</span>
        <span><b>Guarda:</b> ${t.armazenamento}</span>
      </div>
    </article>
  `;
  }).join('');
  wrap.querySelectorAll('.avi-card').forEach(card => {
    card.addEventListener('click', () => openAviModal(decodeURIComponent(card.dataset.taxon)));
    card.addEventListener('keydown', e => { if(e.key === 'Enter') openAviModal(decodeURIComponent(card.dataset.taxon)); });
  });
}

function renderAviMesozoicHighlight(){
  const mesozoicos = DB_AVIFAUNA.filter(t => aviEra(t.periodo) === 'Mesozoico');
  const wrap = document.getElementById('aviMesozoicHighlight');
  if(!wrap || mesozoicos.length === 0) return;
  wrap.innerHTML = `
    <div class="section-head" style="margin-bottom:1rem;">
      <span class="section-num">Mesozoico</span>
      <h2>As aves mais antigas do Brasil</h2>
    </div>
    <p class="view-intro" style="margin-bottom:1.2rem;">
      Antes da grande radiação cenozoica de aves modernas, o território brasileiro já registrava
      representantes de duas das principais linhagens de aves do Cretáceo: os Enantiornithes,
      grupo mais diverso de aves mesozoicas (extinto no limite Cretáceo–Paleógeno), e os
      Ornithuromorpha, a linhagem que leva às aves modernas.
    </p>
    <div class="avi-results">
      ${mesozoicos.map(t => `
        <article class="avi-card avi-card-mesozoic" data-taxon="${encodeURIComponent(t.taxon)}" tabindex="0">
          <div class="avi-card-top">
            <h3 class="avi-taxon-name">${t.taxon}</h3>
            <span class="cat-pill cat-meta">${t.idade_ma}</span>
          </div>
          <span class="avi-card-period">${t.periodo}</span>
          <div class="avi-card-meta">
            <span><b>Grupo:</b> ${t.familia}</span>
            <span><b>Sítio-tipo:</b> ${t.formacao}</span>
            <span><b>Local:</b> ${t.municipio}, ${t.estado}</span>
          </div>
        </article>
      `).join('')}
    </div>
  `;
  wrap.querySelectorAll('.avi-card').forEach(card => {
    card.addEventListener('click', () => openAviModal(decodeURIComponent(card.dataset.taxon)));
    card.addEventListener('keydown', e => { if(e.key === 'Enter') openAviModal(decodeURIComponent(card.dataset.taxon)); });
  });
}

function openAviModal(taxonName){
  const t = dbAviFindTaxon(taxonName);
  if(!t) return;
  document.getElementById('modalBody').innerHTML = `
    <p class="cat-pill cat-vert" style="display:inline-block;margin-bottom:0.6rem;">${t.familia}</p>
    <h3 id="modalTitle" style="font-size:1.5rem;margin-bottom:0.2rem;">${t.taxon}</h3>
    <p class="muted" style="margin-bottom:0.4rem;">${t.autor_ano} &middot; ${t.ordem}</p>
    <div class="modal-section">
      <div class="modal-grid">
        <div><b>Período</b>${t.periodo}</div>
        <div><b>Idade estimada</b>${t.idade_ma}</div>
        <div><b>Formação / sítio</b>${t.formacao}</div>
        <div><b>Local-tipo</b>${t.municipio}, ${t.estado}</div>
        <div><b>Armazenamento atual</b>${t.armazenamento}</div>
        <div><b>Material (holótipo)</b>${t.holotipo}</div>
      </div>
    </div>
    <div class="modal-section">
      <h4>Observações</h4>
      <p style="margin:0;font-size:0.92rem;">${t.obs}</p>
    </div>
    <div class="modal-section">
      <h4>Descrição / referência</h4>
      <p style="margin:0;font-size:0.88rem;">${t.descritor_ref}</p>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  focarModal();
}

function renderAviStateTable(){
  const tbody = document.getElementById('aviStateTableBody');
  const sorted = DB_COBERTURA_ESTADOS.slice().sort((a,b)=> b.registros - a.registros);
  tbody.innerHTML = sorted.map(e => `
    <tr>
      <td>${e.uf}</td>
      <td>${e.estado}</td>
      <td>${e.regiao}</td>
      <td>${e.registros}</td>
    </tr>
  `).join('');
}

function renderAviMap(){
  const maxReg = Math.max(...DB_COBERTURA_ESTADOS.map(e => e.registros));
  const estadoBySigla = {};
  DB_COBERTURA_ESTADOS.forEach(e => estadoBySigla[e.uf] = e);

  function colorForCount(count){
    if(count === 0) return '#ece1c8';
    const t = count / maxReg; // 0..1
    // interpolar entre creme (#ece1c8) e terracota (#b5651d)
    const c1 = [0xec,0xe1,0xc8], c2 = [0xb5,0x65,0x1d];
    const mix = c1.map((v,i) => Math.round(v + (c2[i]-v) * Math.min(t * 1.4, 1)));
    return `rgb(${mix[0]},${mix[1]},${mix[2]})`;
  }

  let statesSvg = "";
  Object.entries(BR_STATE_PATHS).forEach(([sigla, path_d]) => {
    const info = estadoBySigla[sigla];
    const count = info ? info.registros : 0;
    const color = colorForCount(count);
    const label = info ? `${info.estado}: ${count} registro${count===1?'':'s'}` : sigla;
    statesSvg += `<path d="${path_d}" fill="${color}" class="avi-state-shape" data-label="${encodeURIComponent(label)}"></path>\n`;
  });

  let dotsSvg = "";
  DB_AVIFAUNA.forEach(t => {
    if(t.x == null) return;
    const isMesozoic = aviEra(t.periodo) === 'Mesozoico';
    const dotClass = isMesozoic ? 'avi-taxon-dot avi-taxon-dot-mesozoic' : 'avi-taxon-dot';
    dotsSvg += `<circle cx="${t.x}" cy="${t.y}" r="${isMesozoic ? 7 : 6}" class="${dotClass}" data-taxon="${encodeURIComponent(t.taxon)}"><title>${t.taxon} (${t.periodo})</title></circle>\n`;
  });

  document.getElementById('aviSvgMapWrap').innerHTML = `
    <svg viewBox="${BR_MAP_VIEWBOX}" id="brMapSvg" role="img" aria-label="Mapa do Brasil com cobertura de registros de aves fósseis por estado">
      ${statesSvg}
      ${dotsSvg}
    </svg>
  `;

  const svgEl = document.getElementById('brMapSvg');
  svgEl.querySelectorAll('.avi-state-shape').forEach(shape => {
    shape.addEventListener('click', () => {
      const label = decodeURIComponent(shape.dataset.label);
      document.getElementById('aviSearchInput').value = '';
      __aviFilters.q = '';
      const ufName = label.split(':')[0];
      const match = DB_COBERTURA_ESTADOS.find(e => e.estado === ufName);
      if(match && match.registros > 0){
        document.getElementById('aviFilterEstado').value = match.estado;
        __aviFilters.estado = match.estado;
        renderAviResults();
      }
    });
  });
  svgEl.querySelectorAll('.avi-taxon-dot').forEach(dot => {
    dot.addEventListener('click', () => openAviModal(decodeURIComponent(dot.dataset.taxon)));
  });
}

/* ===========================================================
   ÁRVORE GENEALÓGICA — dendrograma SVG real
   Chordata > Aves > clados > ordens > famílias > (fósseis em vermelho)
   =========================================================== */
let __treeRoot = null;
let __treeNodeSeq = 0;
let __treeQuery = '';
let __treeZoom = { k: 1, x: 40, y: 40 };
const TREE_ROW_H = 26;      // espaçamento vertical entre folhas visíveis
const TREE_COL_W = 190;     // espaçamento horizontal entre níveis

function treeCountStats(){
  let ordens = 0, familiasVivas = 0, familiasExtintas = 0, fosseis = 0;
  (function walk(node){
    if(node.tipo === 'ordem') ordens++;
    if(node.tipo === 'familia'){ if(node.viva) familiasVivas++; else familiasExtintas++; }
    if(node.tipo === 'fossil') fosseis++;
    (node.filhos || []).forEach(walk);
  })(AVES_TREE_BR);
  return { ordens, familiasVivas, familiasExtintas, fosseis };
}

/* ---------- construção da hierarquia (uma vez) ----------
   Formato-fonte (AVES_TREE_BR) é uma árvore recursiva real:
   { nome, tipo: 'clado'|'ordem'|'familia'|'fossil', extinta?, viva?,
     introduzida?, nota?, filhos:[...] } — clados podem aninhar
   outros clados livremente (ex.: Neoaves contém Mirandornithes,
   Columbea, Aequornithes, Telluraves etc. como filhos diretos),
   em vez de uma lista plana de grupos irmãos. */
function hydrateTreeNode(raw, typeOverride){
  const type = typeOverride || raw.tipo;
  const node = {
    id: 'n' + (__treeNodeSeq++),
    name: raw.nome,
    type,
    extinta: !!raw.extinta,
    viva: raw.viva,
    introduzida: !!raw.introduzida,
    nota: raw.nota,
    taxonRef: type === 'fossil' ? raw.nome : undefined,
    idade: '',
    children: [],
    _collapsed: type === 'ordem'
  };
  if(type === 'fossil'){
    const t = dbAviFindTaxon(raw.nome);
    node.idade = t ? t.idade_ma : '';
  }
  (raw.filhos || []).forEach(child => node.children.push(hydrateTreeNode(child)));
  node.hasFossil = type === 'fossil' || node.children.some(c => c.hasFossil);
  return node;
}

function buildTreeHierarchy(){
  const root = hydrateTreeNode({ nome: 'Chordata', tipo: 'root', filhos: [] });
  root._collapsed = false;
  const aves = hydrateTreeNode(AVES_TREE_BR, 'classe');
  aves._collapsed = false;
  root.children.push(aves);
  return root;
}


function treeNodeMatches(node, q){
  if(!q) return false;
  return node.name.toLowerCase().includes(q);
}

/* expande o caminho até qualquer nó cujo nome contenha a busca */
function treeExpandToMatches(node, q){
  let selfOrDescendantMatches = treeNodeMatches(node, q);
  node.children.forEach(child => {
    if(treeExpandToMatches(child, q)) selfOrDescendantMatches = true;
  });
  if(selfOrDescendantMatches && node.children.length) node._collapsed = false;
  return selfOrDescendantMatches;
}

function treeSetCollapsedAll(node, value){
  if(node.children.length){
    if(node.type !== 'root' && node.type !== 'classe') node._collapsed = value;
    node.children.forEach(c => treeSetCollapsedAll(c, value));
  }
}

/* ---------- layout (calcula x,y só dos nós visíveis) ---------- */
function computeTreeLayout(root){
  const nodes = [];
  const links = [];
  let leafCounter = 0;

  function visit(node, depth){
    node._depth = depth;
    const visibleChildren = node._collapsed ? [] : node.children;
    if(visibleChildren.length === 0){
      node._x = depth * TREE_COL_W;
      node._y = leafCounter * TREE_ROW_H;
      leafCounter++;
    } else {
      visibleChildren.forEach(child => visit(child, depth + 1));
      const ys = visibleChildren.map(c => c._y);
      node._x = depth * TREE_COL_W;
      node._y = (Math.min(...ys) + Math.max(...ys)) / 2;
    }
    nodes.push(node);
    visibleChildren.forEach(child => links.push({ source: node, target: child }));
  }
  visit(root, 0);

  const width = (Math.max(...nodes.map(n => n._depth)) + 1) * TREE_COL_W + 260;
  const height = Math.max(leafCounter * TREE_ROW_H, 200);
  return { nodes, links, width, height };
}

/* ---------- render SVG ---------- */
function treeLinkPath(d){
  const x0 = d.source._x, y0 = d.source._y, x1 = d.target._x, y1 = d.target._y;
  const midX = (x0 + x1) / 2;
  return `M${x0},${y0} C${midX},${y0} ${midX},${y1} ${x1},${y1}`;
}

function treeNodeColor(node){
  if(node.type === 'fossil') return '#b23b2e';
  if(node.type === 'root' || node.type === 'classe') return 'var(--ink)';
  if(node.hasFossil) return '#b23b2e';
  if(node.type === 'clado') return 'var(--petrol-dk)';
  if(node.type === 'ordem') return node.extinta ? 'var(--moss-dk)' : 'var(--petrol-lt)';
  if(node.type === 'familia') return node.viva ? 'var(--moss)' : 'var(--stone-dk)';
  return 'var(--ink)';
}

function renderTreeSVG(){
  if(!__treeRoot) return;
  const q = __treeQuery.trim().toLowerCase();
  if(q) treeExpandToMatches(__treeRoot, q);

  const { nodes, links, width, height } = computeTreeLayout(__treeRoot);
  const svg = document.getElementById('treeSvg');

  const linksHtml = links.map(l => `<path class="tree-link" d="${treeLinkPath(l)}"></path>`).join('');

  const nodesHtml = nodes.map(n => {
    const color = treeNodeColor(n);
    const isFossil = n.type === 'fossil';
    const hasHiddenChildren = n.children.length > 0;
    const matched = q && treeNodeMatches(n, q);
    const r = isFossil ? 5 : (n.type === 'familia' ? 4.5 : 6);
    const labelClass = 'tree-label tree-label-' + n.type + (matched ? ' tree-label-match' : '') + (n.extinta || n.viva === false ? ' tree-label-extinct' : '');
    const marker = hasHiddenChildren && n._collapsed ? `<text class="tree-toggle-glyph" x="${n._x}" y="${n._y+1}" text-anchor="middle" dominant-baseline="middle">+</text>` : '';
    const daggerPrefix = isFossil ? '&#8224; ' : ((n.type==='ordem' && n.extinta) || (n.type==='familia' && n.viva===false) ? '&#8224; ' : '');
    return `
      <g class="tree-node tree-node-${n.type}${matched?' tree-node-match':''}" data-id="${n.id}" transform="translate(${n._x},${n._y})" tabindex="0">
        <rect class="tree-hit" x="-8" y="-12" width="170" height="24" fill="transparent"></rect>
        <circle r="${r}" fill="${hasHiddenChildren && n._collapsed ? color : (isFossil ? color : 'var(--paper)')}" stroke="${color}" stroke-width="2"></circle>
        ${marker}
        <text class="${labelClass}" x="${r + 8}" y="1" dominant-baseline="middle" fill="${isFossil ? '#b23b2e' : ''}">${daggerPrefix}${n.type==='fossil' ? `<tspan font-style="italic">${n.name}</tspan>` : n.name}${n.idade ? ` <tspan class="tree-label-age">(${n.idade})</tspan>` : ''}</text>
      </g>
    `;
  }).join('');

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.innerHTML = `<g id="treeZoomGroup" transform="translate(${__treeZoom.x},${__treeZoom.y}) scale(${__treeZoom.k})"><g transform="translate(20,20)">${linksHtml}${nodesHtml}</g></g>`;

  svg.querySelectorAll('.tree-node').forEach(g => {
    g.addEventListener('click', () => {
      const node = nodes.find(n => n.id === g.dataset.id);
      if(!node) return;
      if(node.type === 'fossil'){
        openAviModal(decodeURIComponent(node.taxonRef));
        return;
      }
      if(node.children.length){
        node._collapsed = !node._collapsed;
        renderTreeSVG();
      }
    });
    g.addEventListener('keydown', e => { if(e.key === 'Enter') g.dispatchEvent(new Event('click')); });
  });
}

/* ---------- zoom / pan ---------- */
function treeApplyZoom(){
  const g = document.getElementById('treeZoomGroup');
  if(g) g.setAttribute('transform', `translate(${__treeZoom.x},${__treeZoom.y}) scale(${__treeZoom.k})`);
}

function initTreeZoomPan(){
  const wrap = document.getElementById('treeCanvasWrap');
  const svg = document.getElementById('treeSvg');
  let dragging = false, startX = 0, startY = 0, startTx = 0, startTy = 0;

  wrap.addEventListener('mousedown', e => {
    dragging = true; wrap.classList.add('dragging');
    startX = e.clientX; startY = e.clientY;
    startTx = __treeZoom.x; startTy = __treeZoom.y;
  });
  window.addEventListener('mousemove', e => {
    if(!dragging) return;
    __treeZoom.x = startTx + (e.clientX - startX);
    __treeZoom.y = startTy + (e.clientY - startY);
    treeApplyZoom();
  });
  window.addEventListener('mouseup', () => { dragging = false; wrap.classList.remove('dragging'); });

  // toque (mobile)
  wrap.addEventListener('touchstart', e => {
    if(e.touches.length !== 1) return;
    dragging = true;
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    startTx = __treeZoom.x; startTy = __treeZoom.y;
  }, { passive:true });
  wrap.addEventListener('touchmove', e => {
    if(!dragging || e.touches.length !== 1) return;
    __treeZoom.x = startTx + (e.touches[0].clientX - startX);
    __treeZoom.y = startTy + (e.touches[0].clientY - startY);
    treeApplyZoom();
  }, { passive:true });
  wrap.addEventListener('touchend', () => { dragging = false; });

  svg.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    __treeZoom.k = Math.min(2.2, Math.max(0.35, __treeZoom.k + delta));
    treeApplyZoom();
  }, { passive:false });

  document.getElementById('treeZoomIn').addEventListener('click', () => {
    __treeZoom.k = Math.min(2.2, __treeZoom.k + 0.15); treeApplyZoom();
  });
  document.getElementById('treeZoomOut').addEventListener('click', () => {
    __treeZoom.k = Math.max(0.35, __treeZoom.k - 0.15); treeApplyZoom();
  });
  document.getElementById('treeZoomReset').addEventListener('click', () => {
    __treeZoom = { k: 1, x: 40, y: 40 }; treeApplyZoom();
  });
}

function initArvore(){
  const stats = treeCountStats();
  document.getElementById('treeStats').innerHTML = `
    <div class="stat-card"><span class="stat-num">${stats.ordens}</span><span class="stat-label">Ordens</span></div>
    <div class="stat-card"><span class="stat-num">${stats.familiasVivas}</span><span class="stat-label">Famílias vivas listadas</span></div>
    <div class="stat-card"><span class="stat-num">${stats.familiasExtintas}</span><span class="stat-label">Famílias sem viventes</span></div>
    <div class="stat-card"><span class="stat-num">${stats.fosseis}</span><span class="stat-label">Táxons fósseis encaixados</span></div>
  `;

  __treeRoot = buildTreeHierarchy();
  renderTreeSVG();
  initTreeZoomPan();

  document.getElementById('treeSearchInput').addEventListener('input', e => {
    __treeQuery = e.target.value;
    renderTreeSVG();
  });
  document.getElementById('treeExpandAll').addEventListener('click', () => {
    treeSetCollapsedAll(__treeRoot, false);
    renderTreeSVG();
  });
  document.getElementById('treeCollapseAll').addEventListener('click', () => {
    treeSetCollapsedAll(__treeRoot, true);
    renderTreeSVG();
  });
}

/* ===========================================================
   PERMALINK — estado do site na URL
   -----------------------------------------------------------
   Antes nada ia para a URL: não dava para mandar link de um
   registro nem de uma busca filtrada, e um pesquisador não
   tinha como CITAR uma ficha específica. Agora:

     #/catalogo                        aba
     #/catalogo?municipio=Criciúma     aba + filtros
     #/registro/104                    ficha aberta (citável)
     #/ave/Paraphysornis brasiliensis  ficha da avifauna

   Usa hash (e não History API) de propósito: funciona em
   GitHub Pages e ao abrir o index.html direto do disco.
   =========================================================== */
let __ignorarHash = false;

function atualizarURL(view, extra){
  if(__ignorarHash) return;
  let h = '#/' + (view || 'inicio');
  if(view === 'catalogo'){
    const p = new URLSearchParams();
    Object.entries(__catalogFilters || {}).forEach(([k,v]) => { if(v) p.set(k, v); });
    const qs = p.toString();
    if(qs) h += '?' + qs;
  }
  if(extra) h = extra;
  if(location.hash !== h){
    __ignorarHash = true;
    history.replaceState(null, '', h);
    setTimeout(() => { __ignorarHash = false; }, 0);
  }
}

function urlDoRegistro(id){
  return location.origin + location.pathname + '#/registro/' + id;
}

function aplicarHash(){
  const bruto = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  if(!bruto) return;

  const mReg = bruto.match(/^registro\/(\d+)/);
  if(mReg){
    window.paleoShowView('catalogo', { semUrl:true });
    setTimeout(() => openFossilModal(parseInt(mReg[1], 10)), 60);
    return;
  }
  const mAve = bruto.match(/^ave\/(.+)$/);
  if(mAve){
    window.paleoShowView('avifauna', { semUrl:true });
    setTimeout(() => openAviModal(mAve[1]), 60);
    return;
  }

  const [view, query] = bruto.split('?');
  const validas = ['inicio','catalogo','mapa','periodos','instituicoes','avifauna','arvore','sobre'];
  if(!validas.includes(view)) return;

  if(view === 'catalogo' && query){
    const p = new URLSearchParams(query);
    ['periodo','categoria','municipio','instituicao','q'].forEach(k => {
      if(p.has(k)) __catalogFilters[k] = p.get(k);
    });
    const set = (id, val) => { const el = document.getElementById(id); if(el && val) el.value = val; };
    set('filterPeriodo', __catalogFilters.periodo);
    set('filterCategoria', __catalogFilters.categoria);
    set('filterMunicipio', __catalogFilters.municipio);
    set('filterInstituicao', __catalogFilters.instituicao);
    set('searchInput', __catalogFilters.q);
    renderCatalog();
  }
  window.paleoShowView(view, { semUrl:true });
}

window.addEventListener('hashchange', () => { if(!__ignorarHash) aplicarHash(); });

/* copiar permalink (delegação — o botão nasce dentro do modal) */
document.addEventListener('click', async e => {
  const btn = e.target.closest('.btn-permalink');
  if(!btn) return;
  const url = btn.dataset.permalink;
  const original = btn.innerHTML;
  try{
    await navigator.clipboard.writeText(url);
    btn.classList.add('copiado');
    btn.textContent = 'link copiado';
  }catch(_){
    // clipboard bloqueado (http, permissão): mostra a URL para cópia manual
    btn.textContent = url;
  }
  setTimeout(() => { btn.innerHTML = original; btn.classList.remove('copiado'); }, 2200);
});

/* ao fechar a ficha, a URL volta para a aba — senão o link fica preso no registro */
document.addEventListener('modal:close', () => {
  const ativa = document.querySelector('.view.active');
  if(ativa) atualizarURL(ativa.dataset.view);
});

/* ===========================================================
   EXPORTAÇÃO — leva embora o que está filtrado na tela
   Exporta o RESULTADO ATUAL (não o banco inteiro), que é o que
   normalmente se quer: "os 58 do Bainha", "tudo do Permiano".
   =========================================================== */
const COLUNAS_EXPORT = ['id','taxon','categoria','periodo','era','idade_ma','formacao','bacia',
  'municipio','local_coleta','site','lat','lon','numero_catalogo','armazenamento',
  'unidade_pesquisa','descritor','observacoes','fontes'];

function baixarArquivo(nome, conteudo, tipo){
  // BOM só no CSV: o Excel em pt-BR precisa dele para ler acentos,
  // mas em JSON o BOM quebra parsers estritos (json.load, jq...)
  const corpo = tipo === 'text/csv' ? '\ufeff' + conteudo : conteudo;
  const blob = new Blob([corpo], { type: tipo + ';charset=utf-8' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob), download: nome
  });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function csvEscape(v){
  const s = Array.isArray(v) ? v.join(' | ') : (v == null ? '' : String(v));
  return /[";\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
}

function initExportacao(){
  const filtrados = () => applyCatalogFilters(DB_FOSSEIS);
  const carimbo = () => new Date().toISOString().slice(0,10);

  const csv = document.getElementById('exportCSV');
  const json = document.getElementById('exportJSON');
  if(!csv || !json) return;

  csv.addEventListener('click', () => {
    const linhas = filtrados().map(f => COLUNAS_EXPORT.map(c => csvEscape(f[c])).join(';'));
    // ';' como separador: é o que o Excel em pt-BR espera
    baixarArquivo(`paleo-sc_${carimbo()}.csv`,
      COLUNAS_EXPORT.join(';') + '\n' + linhas.join('\n'), 'text/csv');
  });

  json.addEventListener('click', () => {
    const dados = {
      fonte: 'Paleo-SC — Banco de Dados Paleontológico de Santa Catarina',
      url: location.origin + location.pathname,
      exportado_em: new Date().toISOString(),
      filtros_aplicados: Object.fromEntries(Object.entries(__catalogFilters).filter(([,v]) => v)),
      total: filtrados().length,
      registros: filtrados()
    };
    baixarArquivo(`paleo-sc_${carimbo()}.json`, JSON.stringify(dados, null, 2), 'application/json');
  });
}
document.addEventListener('DOMContentLoaded', initExportacao);

/* ===========================================================
   CLASSIFICAÇÃO DAS FONTES
   Nem todo link tem a mesma durabilidade. ResearchGate e
   Academia.edu removem PDFs sob pressão de editoras e exigem
   login; Wikipédia é terciária. Rotular deixa isso visível
   para o leitor — e marca o que ainda precisa ganhar DOI.
   =========================================================== */
function classeFonte(url){
  if(/doi\.org/.test(url)) return 'f-doi';
  if(/researchgate|academia\.edu/.test(url)) return 'f-repo';
  if(/wikipedia/.test(url)) return 'f-wiki';
  if(/\.gov\.br|periodicos|revistas|scielo|sbpbrasil|lume\.ufrgs|repositorio|sciencedirect|cell\.com|carnetsgeol|sigep|cambridge\.org|onlinelibrary\.wiley|nature\.com|springer|tandfonline|pubmed|royalsocietypublishing|rsdjournal|revistes\.ub\.edu|proceedings\.science/.test(url)) return 'f-cientifica';
  if(/ndmais|nsctotal|diariodoplanalto|revistaplaneta|portallitoral|destinofloripa|circuitomt|recantodos/.test(url)) return 'f-noticia';
  return 'f-outra';
}
function rotuloFonte(url){
  return { 'f-doi':'DOI', 'f-repo':'repositório', 'f-wiki':'enciclopédia',
           'f-cientifica':'científica', 'f-noticia':'imprensa', 'f-outra':'link' }[classeFonte(url)];
}

/* ===========================================================
   COMO CITAR
   -----------------------------------------------------------
   A versão anterior trazia só título + URL. Nenhuma norma aceita
   citação sem autoria, ano e — para recurso online que muda —
   data de acesso. Este banco muda: já foi de 97 para 164
   registros, então quem citou em datas diferentes consultou
   coisas diferentes. Daí a versão aparecer na citação.
   =========================================================== */

/* Autoria. Guardada em partes porque cada norma formata o nome de
   um jeito: ABNT usa "BENK, Brenno Alef"; APA abrevia os prenomes
   ("Benk, B. A."); BibTeX quer "Sobrenome, Nomes" para o BibTeX
   decidir sozinho como abreviar. Uma string única não daria conta. */
const CITACAO_AUTOR = { sobrenome: 'Benk', nomes: 'Brenno Alef' };

function autorFormatado(estilo){
  const a = CITACAO_AUTOR;
  if(!a || !a.sobrenome) return null;                    // sem autoria -> institucional
  const iniciais = a.nomes.split(/\s+/).filter(Boolean)
                     .map(n => n[0].toUpperCase() + '.').join(' ');
  if(estilo === 'abnt')   return `${a.sobrenome.toUpperCase()}, ${a.nomes}`;
  if(estilo === 'apa')    return `${a.sobrenome}, ${iniciais}`;
  return `${a.sobrenome}, ${a.nomes}`;                   // bibtex
}

const CITACAO = {
  // "Paleo-SC" é a entidade/autoria; o título não deve repeti-la,
  // senão a citação sai como "PALEO-SC. Paleo-SC — Banco de Dados..."
  entidade: 'Paleo-SC',
  titulo: 'Banco de Dados Paleontológico de Santa Catarina',
  versao: '2026.07.9',
  ano: '2026',
  url: 'https://brennobenk1.github.io/PaleontologiaSC/'
};

function dataPorExtenso(d){
  const meses = ['jan.','fev.','mar.','abr.','maio','jun.','jul.','ago.','set.','out.','nov.','dez.'];
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

function montarCitacao(formato){
  const c = CITACAO, hoje = new Date();
  const autorAbnt = autorFormatado('abnt') || c.entidade.toUpperCase();
  const autorApa  = autorFormatado('apa')  || c.entidade;

  if(formato === 'apa'){
    return `${autorApa} (${c.ano}). ${c.titulo} (versão ${c.versao}) [Conjunto de dados]. `
         + `Recuperado em ${hoje.toLocaleDateString('pt-BR')}, de ${c.url}`;
  }
  if(formato === 'bibtex'){
    return `@misc{benk2026paleosc,\n`
         + `  author       = {${autorFormatado('bibtex') || c.entidade}},\n`
         + `  title        = {${c.titulo}},\n`
         + `  version      = {${c.versao}},\n`
         + `  year         = {${c.ano}},\n`
         + `  howpublished = {\\url{${c.url}}},\n`
         + `  note         = {Acesso em ${hoje.toLocaleDateString('pt-BR')}}\n}`;
  }
  // ABNT (padrão) — evita ponto duplo se o autor já terminar com um
  const sep = autorAbnt.endsWith('.') ? '' : '.';
  return `${autorAbnt}${sep} ${c.titulo}. Versão ${c.versao}. ${c.ano}. `
       + `Disponível em: ${c.url}. Acesso em: ${dataPorExtenso(hoje)}.`;
}

function initCitacao(){
  const alvo = document.getElementById('citarTexto');
  if(!alvo) return;
  let formato = 'abnt';

  const desenhar = () => {
    alvo.textContent = montarCitacao(formato);
    alvo.classList.toggle('citar-bibtex', formato === 'bibtex');
    document.querySelectorAll('.btn-citar').forEach(b =>
      b.classList.toggle('ativo', b.dataset.formato === formato));
  };

  document.querySelectorAll('.btn-citar').forEach(b =>
    b.addEventListener('click', () => { formato = b.dataset.formato; desenhar(); }));

  const copiar = document.getElementById('citarCopiar');
  copiar.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(alvo.textContent);
      copiar.textContent = 'copiado'; copiar.classList.add('copiado');
    }catch(_){
      // clipboard bloqueado: seleciona o texto para cópia manual
      const r = document.createRange(); r.selectNodeContents(alvo);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      copiar.textContent = 'selecionado';
    }
    setTimeout(() => { copiar.textContent = 'copiar'; copiar.classList.remove('copiado'); }, 2000);
  });

  desenhar();
}
document.addEventListener('DOMContentLoaded', initCitacao);

/* ===========================================================
   ACESSIBILIDADE DO MODAL — foco
   -----------------------------------------------------------
   Os atributos ARIA (role=dialog, aria-modal, aria-labelledby)
   já estavam corretos, mas o FOCO não: ao abrir a ficha ele
   permanecia no cartão de trás, e o Tab passeava pela página
   coberta pelo modal. Para quem navega por teclado ou usa
   leitor de tela, a ficha era inalcançável.
   =========================================================== */
const FOCAVEIS = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
let __focoAnterior = null;

function focarModal(){
  const card = document.getElementById('modalCard');
  if(!card) return;
  __focoAnterior = document.activeElement;
  card.setAttribute('tabindex','-1');
  // foca o próprio diálogo: o leitor de tela anuncia o título (aria-labelledby)
  // antes de o usuário começar a tabular pelo conteúdo
  requestAnimationFrame(() => card.focus());
}

function prenderFoco(e){
  if(e.key !== 'Tab') return;
  const overlay = document.getElementById('modalOverlay');
  if(!overlay || !overlay.classList.contains('open')) return;
  const card = document.getElementById('modalCard');
  const itens = [...card.querySelectorAll(FOCAVEIS)].filter(el => el.offsetParent !== null);
  if(!itens.length){ e.preventDefault(); card.focus(); return; }
  const primeiro = itens[0], ultimo = itens[itens.length - 1];
  const atual = document.activeElement;
  if(!card.contains(atual)){ e.preventDefault(); primeiro.focus(); return; }
  if(e.shiftKey && atual === primeiro){ e.preventDefault(); ultimo.focus(); }
  else if(!e.shiftKey && atual === ultimo){ e.preventDefault(); primeiro.focus(); }
}
document.addEventListener('keydown', prenderFoco, true);

/* devolve o foco a quem abriu — senão o leitor volta ao topo da página */
document.addEventListener('modal:close', () => {
  if(__focoAnterior && document.contains(__focoAnterior)){
    __focoAnterior.focus();
    __focoAnterior = null;
  }
});


/* ===========================================================
   REPORTAR ERRO
   -----------------------------------------------------------
   Um banco citável precisa de caminho de correção: erro numa
   ficha vira erro em todo trabalho que a citou. O permalink
   torna isso preciso — a issue já nasce sabendo QUAL registro.
   Pré-preenche número, táxon, versão e link, para que o revisor
   não precise recomeçar a investigação do zero.
   =========================================================== */
const REPO_ISSUES = 'https://github.com/brennobenk1/PaleontologiaSC/issues/new';

function urlIssue(f){
  const titulo = `Correção — registro nº ${String(f.id).padStart(3,'0')}: ${f.taxon}`;
  const corpo = [
    `**Registro:** nº ${String(f.id).padStart(3,'0')} — ${f.taxon}`,
    `**Link:** ${urlDoRegistro(f.id)}`,
    `**Versão do banco:** ${CITACAO.versao}`,
    `**Fonte citada na ficha:** ${f.descritor}`,
    '',
    '---',
    '',
    '**O que está incorreto?**',
    '(campo, valor atual e valor correto)',
    '',
    '**Referência que sustenta a correção**',
    '(DOI, artigo, capítulo — o que permitir verificar)',
    ''
  ].join('\n');
  return `${REPO_ISSUES}?title=${encodeURIComponent(titulo)}&body=${encodeURIComponent(corpo)}`;
}


/* ===========================================================
   NAVEGAÇÃO TAXONÔMICA (catálogo de SC)
   -----------------------------------------------------------
   O campo `categoria` já era hierárquico na prática — "Flora —
   Glossopteridopsida (folha)" tem grande grupo e subgrupo
   separados por travessão — mas o filtro tratava a string
   inteira como valor único. Com 180 registros isso gerava
   dezenas de opções irmãs e nenhuma forma de pedir, por
   exemplo, "todos os vertebrados". Aqui a hierarquia implícita
   vira navegação de dois níveis, sem alterar o dado.
   =========================================================== */
function grupoTaxonomico(cat){
  const g = String(cat || '').split('—')[0].trim();
  return g || 'Outros';
}
function subgrupoTaxonomico(cat){
  const partes = String(cat || '').split('—');
  if(partes.length < 2) return null;
  return partes.slice(1).join('—').replace(/\(.*?\)/g, '').trim() || null;
}

function montarArvoreTaxonomica(){
  const arv = {};
  DB_FOSSEIS.forEach(f => {
    const g = grupoTaxonomico(f.categoria), s = subgrupoTaxonomico(f.categoria);
    arv[g] = arv[g] || { total: 0, subs: {} };
    arv[g].total++;
    if(s){ arv[g].subs[s] = (arv[g].subs[s] || 0) + 1; }
  });
  return arv;
}

function renderNavTaxonomica(){
  const alvo = document.getElementById('navTaxonomica');
  if(!alvo) return;
  const arv = montarArvoreTaxonomica();
  // grupos de afinidade indeterminada vão por último e recebem marcação
  // própria: "Metazoário de afinidade incerta" e "Assembleia fóssil"
  // NÃO são irmãos de Vertebrado/Invertebrado — são caixas de material
  // que a literatura não consegue posicionar, e exibi-los como se
  // fossem categorias equivalentes induziria o leitor ao erro.
  const indet = g => /afinidade incerta|Assembleia fóssil/.test(g);
  const ordem = Object.entries(arv).sort((a,b) =>
    (indet(a[0]) - indet(b[0])) || (b[1].total - a[1].total));
  const ativo = __catalogFilters.grupoTax || '';
  const ativoSub = __catalogFilters.subTax || '';

  alvo.innerHTML = `
    <button type="button" class="tax-chip${!ativo ? ' ativo' : ''}" data-grupo="">
      Todos <i>${DB_FOSSEIS.length}</i>
    </button>
    ${ordem.map(([g, o]) => `
      <button type="button" class="tax-chip${ativo === g ? ' ativo' : ''}${indet(g) ? ' tax-indet' : ''}"
              data-grupo="${g}"${indet(g) ? ' title="Material que a literatura não posiciona com segurança — não é um grupo equivalente aos demais"' : ''}>
        ${indet(g) ? '<span class="tax-marca">?</span>' : ''}${g} <i>${o.total}</i>
      </button>`).join('')}
    ${ativo && arv[ativo] ? `<div class="tax-subs">
      ${Object.entries(arv[ativo].subs).sort((a,b) => b[1]-a[1]).map(([s,n]) => `
        <button type="button" class="tax-sub${ativoSub === s ? ' ativo' : ''}" data-sub="${s}">
          ${s} <i>${n}</i>
        </button>`).join('')}
    </div>` : ''}`;

  alvo.querySelectorAll('.tax-chip').forEach(b => b.addEventListener('click', () => {
    __catalogFilters.grupoTax = b.dataset.grupo;
    __catalogFilters.subTax = '';
    renderNavTaxonomica(); renderCatalog();
  }));
  alvo.querySelectorAll('.tax-sub').forEach(b => b.addEventListener('click', () => {
    __catalogFilters.subTax = (__catalogFilters.subTax === b.dataset.sub) ? '' : b.dataset.sub;
    renderNavTaxonomica(); renderCatalog();
  }));
}
document.addEventListener('DOMContentLoaded', () => setTimeout(renderNavTaxonomica, 0));
