/* =========================================================
   data-loader.js
   Camada de "banco de dados" do site: carrega os JSONs gerados
   a partir da planilha fosseis_santa_catarina_enriquecido.xlsx
   e expõe um objeto global DB com os dados e helpers de consulta.
   ========================================================= */

const DB = {
  fosseis: [],
  periodos: [],
  instituicoes: [],
  sitios: [],
  bacias: [],
  ready: false,
};

async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Falha ao carregar ' + path);
  return res.json();
}

async function initDB(){
  const [fosseis, periodos, instituicoes, sitios, bacias] = await Promise.all([
    loadJSON('data/fosseis.json'),
    loadJSON('data/periodos.json'),
    loadJSON('data/instituicoes.json'),
    loadJSON('data/sitios_mapa.json'),
    loadJSON('data/bacias.json'),
  ]);
  DB.fosseis = fosseis;
  DB.periodos = periodos;
  DB.instituicoes = instituicoes;
  DB.sitios = sitios;
  DB.bacias = bacias;
  DB.ready = true;
  document.dispatchEvent(new CustomEvent('db:ready'));
}

/* ---------- helpers de consulta ---------- */

function dbUnique(field){
  return Array.from(new Set(DB.fosseis.map(f => f[field]).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'pt-BR'));
}

function dbFindFossil(id){
  return DB.fosseis.find(f => f.id === id);
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

initDB().catch(err => {
  console.error(err);
  const main = document.querySelector('main');
  if(main){
    const warn = document.createElement('p');
    warn.style.padding = '2rem';
    warn.style.color = '#b5651d';
    warn.textContent = 'Não foi possível carregar os dados do banco. Verifique se os arquivos em /data estão acessíveis.';
    main.prepend(warn);
  }
});
