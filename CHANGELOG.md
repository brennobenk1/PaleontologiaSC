# Changelog — Paleo-SC

Registro datado das mudanças no banco. Para um banco de consulta
científica isso importa: quem citou o site em determinada data precisa
saber o que havia nele naquele momento.

Formato: as versões seguem `ANO.MÊS.N`.

## 2026.07.5 — 03/08/2026

### Santa Catarina (176 → 177)
- **Vermetídeos fósseis** dos costões entre o Cabo de Santa Marta e
  Imbituba (SIGEP 075) — carapaças aragoníticas datadas por
  radiocarbono, base da curva mais completa de variação do nível
  relativo do mar da Região Sul nos últimos ~5.500 anos
  (Angulo et al., 1999, *Marine Geology* 159:323–339).
- Nova época na linha do tempo: **Holoceno**.
- Ressalva registrada na ficha: os sambaquis da mesma região, embora
  ricos em conchas, são depósitos **arqueológicos** (antrópicos) e por
  isso ficam fora deste catálogo paleontológico.

### Varredura sem resultado (registrado por transparência)
- **Os sítios SIGEP de Santa Catarina estão esgotados**: 024 (Coluna
  White), 075 (Complexo Lagunar), 082 (Bainha) e 126 (Canoinhas) estão
  todos no catálogo. Os demais sítios catarinenses do SIGEP — 050
  (Aparados da Serra) e 114 (Domo de Vargeão) — não são
  paleontológicos.
- **Avifauna: nenhum táxon novo confirmado nesta rodada.** Foram
  verificados o material do Piauí (Toca da Janela da Barra do
  Antonião — a fauna publicada é essencialmente de mamíferos, apesar
  de Mourer-Chauviré constar como coautora) e descrições recentes de
  aves fósseis brasileiras. Nada acrescentado sem confirmação.

## 2026.07.4 — 03/08/2026

### A planilha volta ao circuito
- **`fosseis_santa_catarina_enriquecido.xlsx` estava parada em 97
  registros** enquanto o banco já tinha 176. Ao inverter o fluxo de
  dados (v2026.07.1), a planilha ficou órfã e isso não foi tratado.
- Novo `scripts/exportar-planilha.py`: a planilha passa a ser
  **artefato gerado** a partir de `js/dados.js`, como `data/*.json`.
  Preserva título, ordem das 13 colunas originais e a aba
  "Legenda e Fontes"; os campos que só existem no banco (nº do
  registro, sítio, bacia, coordenadas, DOI) entram como colunas
  adicionais ao final.
- `scripts/validar.py` passa a **acusar planilha desatualizada**.

### Dado recuperado
- A coluna **"Citação Científica (ABNT)"** existia só na planilha e se
  perdera na migração para o `app.js`. As **97 citações** foram
  recuperadas e incorporadas ao banco (campo `citacao_abnt`). Quatro
  delas exigiram mapeamento manual, por corresponderem a táxons
  renomeados nas correções de nomenclatura e procedência.
- Os 79 registros acrescentados depois ainda não têm citação ABNT — o
  campo fica vazio, e a legenda da planilha explica isso.

## 2026.07.3 — 30/07/2026

### Santa Catarina (164 → 175)
- **+11 registros da Coluna White** (SIGEP 024), a seção estratigráfica
  clássica do Gondwana no Brasil, na Serra do Rio do Rastro — onde
  Israel C. White correlacionou, em 1908, o "Systema de Santa Catharina"
  ao "Systema Karroo" da África do Sul.
- Duas formações que faltavam por completo passam a ter registro:
  **Fm. Palermo** (*Dadoxylon*, pelecípodes, palinoflora) e
  **Fm. Serra Alta** (peixes, pelecípodes, conchostráceos).
- Tafoflora do **Mb. Morro Pelado na sua localidade-tipo**
  (*Schizoneura*, *Dizeugotheca*, *Dichophyllites*) e anfíbio
  labirintodonte da Fm. Rio do Rasto.
- Registro de "*Loxomma*" (Criciúma, Putzer 1954) incluído **com
  ressalva explícita**: o gênero é um bafetídeo do Carbonífero europeu
  e a atribuição carece de revisão — não vale como identificação atual.
- ***Parapytanga catarinensis*** (Strapasson, Pinheiro & Soares, 2015) —
  o **único temnospôndilo formalmente nomeado de Santa Catarina**, e um
  dos três descritos para toda a Fm. Rio do Rasto. Holótipo
  UFRGS-PV-0355-P, da Serra do Espigão (Santa Cecília), coletado em 1985
  e descrito só em 2015. O registro genérico "anfíbio labirintodonte" da
  Coluna White passou a remeter a ele.
- Novos municípios: Bom Jardim da Serra e Santa Cecília.

### Avifauna do Brasil (25 → 27)
- ***Macranhinga paranensis*** — o material brasileiro do alto Rio Acre
  foi descrito por Campbell (1996) como *Anhinga fraileyi*, hoje
  sinônimo júnior.
- ***Macranhinga* sp.** (Guilherme et al., 2024, *The Anatomical
  Record*, DOI 10.1002/ar.25329): com *A. minuta* e *M. ranzii*,
  evidencia **três** táxons de Anhingidae coexistindo na mesma
  localidade do Mioceno amazônico.

## 2026.07.2 — 28/07/2026

### Acessibilidade
- **Contraste corrigido.** Sete estilos usavam texto entre 45% e 60% de
  opacidade; o pior caso dava 2,80:1, abaixo do mínimo WCAG AA (4,5:1) —
  e afetava os rótulos de todos os cartões. Agora há um token único
  (`--texto-suave`, 0,68) calculado para passar sobre o fundo mais
  escuro em uso.

### Confiabilidade
- `scripts/validar.py`: as verificações de integridade que vinham sendo
  feitas à mão viraram script versionado (escopo geográfico, coerência
  formação × bacia, mapa × catálogo, contagens, campos obrigatórios).
- GitHub Action roda a validação a cada push e pull request.
- `LICENSE.md`: dados sob CC BY 4.0, código sob MIT, material de
  terceiros fora do escopo. Antes não havia nada.

### Desempenho
- **Logo: 512 KB → 3 KB.** Estava em 1254×1254 px sendo exibida a 42×42.
  Gerados `logo-96.png` (interface) e `logo-512.png` (compartilhamento).
- Cartões passam a renderizar em lotes de 36 conforme a rolagem, em vez
  de 158 de uma vez.
- Carga em 3G lento: 19,7 s → 9,6 s; transferência 940 KB → 432 KB
  (sem gzip; no GitHub Pages, com gzip, fica em torno de 92 KB).
- Corrigido erro latente no `ready()`: com `<script defer>` a
  inicialização rodava antes das declarações `let`, quebrando a página.

### Conteúdo
- **+6 registros do Afloramento de Canoinhas** (SIGEP 126), incluindo
  *Krauselcladus canoinhensis* — única ocorrência do gênero em toda a
  Bacia do Paraná e única conífera do Guadalupiano da porção gondwânica
  brasileira. Novo município e primeira ocorrência da Fm. Teresina.
- Nova época na linha do tempo: **Permiano Médio (Guadalupiano)**,
  273,0–259,1 Ma, que não existia no banco.
- Catálogo: 158 → 164 registros.

## 2026.07.1 — 28/07/2026

### Estrutura
- **Fonte única de dados.** Todo o conteúdo passou para `js/dados.js`;
  `js/app.js` agora tem só código. Antes existiam duas fontes
  independentes — `data/*.json` havia parado em 97 registros enquanto o
  site já mostrava 158, e quem abrisse a pasta pegava dados velhos.
- `data/*.json` viraram artefatos gerados por
  `scripts/exportar-dados.py`, com modo `--check` para acusar
  divergência. `gerar_dados.py` marcado como obsoleto.
- **Permalink**: o estado agora vai para a URL
  (`#/registro/104`, `#/catalogo?municipio=Criciúma`), tornando
  possível citar e compartilhar um registro ou uma busca.
- **Exportação** do resultado filtrado em CSV e JSON.
- Meta tags Open Graph/Twitter para pré-visualização ao compartilhar.

### Conteúdo
- Documentada a ressalva de **viés amostral** nas Limitações.

## 2026.07.0 — catálogo em 158 registros

- +57 táxons do **Afloramento Bainha** (Criciúma), sítio SIGEP 082,
  a partir da lista aceita de Iannuzzi (2002) — inclui 5 gêneros
  endêmicos e 3 holótipos.
- +4 registros: peixes com encéfalo preservado em 3D (Figueroa et al.
  2024, *Current Biology*), Mesosauridae de Três Barras (primeiro
  réptil e primeira ocorrência da Fm. Irati), foraminíferos e
  palinoflora do Campáleo.
- +1 registro: *Eschatornis aterradora* na aba de avifauna.
- Coordenada do Afloramento Campáleo corrigida do centro de Mafra para
  a coordenada publicada do afloramento (BR-280 km 166).
- Correção de 9 contradições estratigráficas entre formação e bacia.
- Procedência do registro nº 96 corrigida para **Turvo, SC**
  (antes "não especificado", e atribuído a um icnotáxon cujo
  material-tipo é de Araraquara/SP).
- Normalização das listas de filtro: 22 opções de "Guarda" viraram 10;
  antes a mesma instituição aparecia várias vezes e cada uma filtrava
  só parte dos registros.
