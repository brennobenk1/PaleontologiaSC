# Changelog — Paleo-SC

Registro datado das mudanças no banco. Para um banco de consulta
científica isso importa: quem citou o site em determinada data precisa
saber o que havia nele naquele momento.

Formato: as versões seguem `ANO.MÊS.N`.

## 2026.07.8 — 03/08/2026

### Acessibilidade — foco no modal
Auditoria anterior mediu o elemento errado e acusou ARIA ausente.
**Os atributos estavam corretos** (`role="dialog"`, `aria-modal`,
`aria-labelledby` no `.modal-card`). O defeito real era o **foco**:
- ao abrir a ficha, o foco ficava no cartão de trás;
- o Tab escapava para a página coberta (16 Tabs, nenhum dentro).

Corrigido: o foco entra no diálogo (o leitor de tela anuncia o título
antes do conteúdo), fica preso com Tab e Shift+Tab, e volta ao
elemento que abriu a ficha. Vale para o modal do catálogo e o da
avifauna.

### Caminho de correção
- Botão **"reportar erro"** em cada ficha. Abre uma issue no GitHub já
  preenchida com número do registro, táxon, permalink, versão do banco
  e a fonte citada — o revisor não recomeça a investigação do zero.
- Link também no rodapé.

Motivo: erro numa ficha vira erro em todo trabalho que a citou, e este
banco já teve erros reais (citação da *Microhemidiscia*, procedência do
registro 96, nove contradições estratigráficas). Sem caminho de
correção, quem percebe não tem o que fazer.

### Navegação taxonômica
O campo `categoria` já era hierárquico na prática ("Flora —
Glossopteridopsida (folha)"), mas o filtro tratava a string inteira como
valor único: dezenas de opções irmãs e nenhuma forma de pedir "todos os
vertebrados". Agora há navegação de **dois níveis** acima do catálogo —
Flora (73), Invertebrado (36), Icnofóssil (35), Vertebrado (23),
Microfóssil (7), Metazoário (5) — e, ao escolher um grupo, seus
subgrupos aparecem com contagem. Sem alterar o dado.

### Fontes
- Os 9 registros de Águas Claras passam de "Gandini et al. (2007)" para
  a referência completa: *Gaea — Journal of Geoscience* (UNISINOS)
  3(1):47–59.

## 2026.07.7 — 03/08/2026 · reforço das fontes

Ataque direto ao problema que a auditoria anterior apontou: 19
registros sustentados só por imprensa ou enciclopédia.

### Resultado
- **19 → 2.** Sobram apenas o terópode de Nova Veneza (67) e o
  mesossauro de Três Barras (101), ambos já com ressalva na ficha.
- **Registros com DOI: 4 → 26.**

### O que foi feito
- **14 registros do Campáleo** receberam o DOI do artigo que já
  constava no descritor: Mouro et al. (2020), *Palaeogeography,
  Palaeoclimatology, Palaeoecology* 555:109850
  (**10.1016/j.palaeo.2020.109850**), mais o capítulo de Mouro et al.
  (2021) sobre o Folhelho Lontras.
- **5 paleotocas** ganharam referência primária — Buchmann, Lopes &
  Caron (2009), RBP 12(3):247–256 (**10.4072/rbp.2009.3.07**) — e,
  sobretudo, a **icnotaxonomia formal que faltava**: desde Lopes et al.
  (2017, *Ichnos* 24) estas estruturas são o icnogênero ***Megaichnus***,
  com *M. major* (preguiças-gigantes) e *M. minor* (tatus-gigantes).

### Registros novos (177 → 180)
Três paleotocas catarinenses com referência publicada:
- ***Megaichnus major*** **de Urubici** (URU-01-P2, coordenada
  publicada, 1.036 m de altitude) — usada em experimentos de
  propagação sonora que testam a hipótese de comunicação acústica
  entre mylodontídeos fossoriais.
- ***Megaichnus major*** **de Doutor Pedrinho** — escavada no arenito
  da **Fm. Taciba (Permiano)**: a estrutura é cenozóica, mas a rocha é
  ~270 milhões de anos mais velha. Documentada por fotogrametria.
- ***Megaichnus* isp. de Porto União** — Planalto Norte, analisadas em
  conjunto com as de União da Vitória (PR).

Fica registrado o contexto: SC e RS concentram a **maior abundância
conhecida de paleotocas do mundo**, com várias centenas em cada estado.

### Interface
- Classificador de fontes ampliado (Cambridge, Wiley, Nature, Springer,
  PubMed, Royal Society e outros passam a ser rotulados como
  "científica" em vez de "link").
- Corrigida a exibição duplicada do DOI quando ele aparecia também
  entre as fontes.

## 2026.07.6 — 03/08/2026 · auditoria de veracidade

Verificação dos registros já existentes. Oito checagens automáticas
sobre os 177 registros de SC e os 27 de avifauna, mais conferência
externa dos pontos que ficaram suspeitos.

### Erro encontrado e corrigido
- **Registro 53 (*Microhemidiscia greinerti*) citava periódico e ano
  errados.** Constava "Mouro et al. (2020, 2021) — Palaeogeogr.
  Palaeoclimatol. Palaeoecol.". A espécie foi de fato descrita em
  **Mouro, Fernandes, Rogerio & Fonseca (2014), Journal of
  Paleontology 88(1)**. Corrigido, com link para o periódico e a
  observação completada: é a primeira esponja articulada do Paleozoico
  do Brasil.

### Transparência de fontes
- **16 links da Wikipédia** foram rotulados como *"compilação
  secundária — referência primária no campo Descritor"*. Não eram
  invenção: o descritor desses registros sempre citou a literatura
  primária (Mouro et al.), mas o link levava só à enciclopédia. Agora
  isso fica explícito para quem lê a ficha.

### Checagens sem irregularidade
- Coordenadas × município declarado: nenhuma a mais de 35 km do centro
  do município (o que também confirma a correção do Campáleo feita em
  2026.07.1 — a coordenada bate com a publicada, 26°09'30"S 49°48'52"W).
- Idade declarada × período: sem incompatibilidade real (dois alertas
  foram falso positivo do detector, que leu "5,33" e "12.000 anos" como
  valores em Ma).
- Nomenclatura: nenhuma autoria indevidamente entre parênteses.
- Nenhuma URL malformada, nenhuma ocorrência duplicada (mesmo táxon no
  mesmo sítio), avifauna coerente entre período e idade.
- Táxons do Folhelho Lontras citados na literatura (*Santosichthys
  mafrensis*, *Roslerichthys riomafrensis*, *Irajapintoseidon
  uruguayensis*, *Daphnaechelus*) conferidos: todos já presentes.

### Limitação declarada desta auditoria
Não foi possível conferir os 177 registros um a um contra a literatura
primária. O que se fez foi: checagem automática de consistência interna
em toda a base, e verificação externa dirigida aos registros que essas
checagens apontaram como frágeis. **20 registros têm apenas fonte
jornalística ou enciclopédica** — permanecem no catálogo, mas são os
primeiros candidatos a receber referência primária.

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
