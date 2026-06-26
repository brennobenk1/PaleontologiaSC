/* =========================================================
   instituicoes.js — cartões de instituições com contato
   ========================================================= */

(function(){
  function countForInst(sigla, nome){
    return DB.fosseis.filter(f =>
      (f.armazenamento && (f.armazenamento.includes(sigla) || f.armazenamento.includes(nome.split(' —')[0]))) ||
      (f.unidade_pesquisa && f.unidade_pesquisa.includes(sigla))
    ).length;
  }

  function renderInstituicoes(){
    const grid = document.getElementById('instGrid');
    grid.innerHTML = DB.instituicoes.map(inst => {
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
  }

  function renderGlossary(){
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

  document.addEventListener('db:ready', () => {
    renderInstituicoes();
    renderGlossary();
  });
})();
