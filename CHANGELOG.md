# Changelog — Paleo-SC

Registro datado das mudanças no banco. Para um banco de consulta
científica isso importa: quem citou o site em determinada data precisa
saber o que havia nele naquele momento.

Formato: as versões seguem `ANO.MÊS.N`.

## 2026.09.14 — 08/10/2026 · tudo com fonte científica ou com "citação de mídia" explícita

Banco: **228 registros** (era 227), **57 sítios**, 15 intervalos de tempo, 107 obras na bibliografia, 52 registros com DOI
(eram 56: foram retirados DOIs genéricos que não identificavam a ocorrência).

### Política nova: nada especulado, nada removido sem prova de invenção
Pedido do autor: registros só saem se parecerem inventados; reportagem pode ficar, mas
**declarada como citação de mídia**. Aplicado assim:
- **Novo `tipo_fonte` "Citação de mídia"** (13 registros: 38, 44, 56, 57, 67, 68, 69, 70, 81, 83, 101,
  195, 222). Substitui "Divulgação ou imprensa", que o validador agora recusa. Cada obra de mídia
  no descritor começa com "Citação de mídia — "; a observação começa com "CITAÇÃO DE MÍDIA"; a ficha
  mostra uma faixa de aviso; o card, um selo; a bibliografia, um grupo próprio; e a citação ABNT sai entre
  colchetes ("sem publicação científica primária identificada"). A verificação nº 20 do
  `scripts/validar.py` confere os três lados.
- **Descritor só com obra que documenta aquela ocorrência.** Trabalhos genéricos de contexto saíram do
  descritor e foram para a observação ("CONTEXTO CIENTÍFICO"). O que a fonte não diz (formação, idade,
  depositário, autoria) fica como "não informado na fonte" ou marcado como inferência.

### Afirmações sem lastro corrigidas
- **67** (pegadas de terópode): período passa a "Jurássico (segundo a reportagem)"; sem formação nem datação.
- **68** (*Notiomastodon platensis*): histórico taxonômico registrado — a reportagem usa *Stegomastodon
  waringi*; o táxon é tratado hoje como *N. platensis* (Mothé et al. 2012).
- **69, 101, 195, 222**: reescritos só com o que a reportagem ou o resumo diz; "não informado" onde a
  fonte não informa tombo, depositário ou localidade.
- **70**: rótulo "Toxodon sp." era da ficha, não da reportagem — agora "Toxodontidae indet. («toxodonte»
  na reportagem)".
- **81**: "Furnas Xocleng" não aparece em nenhuma fonte; renomeado **Paleotoca Xocleng**.
- **83**: nome "Paleotoca do Engenho Velho" não achado em fonte; sítio renomeado para
  "Jacinto Machado e Praia Grande (paleotocas do Geoparque)".
- **44** (Paleotoca Amaral de Baixo, Lauro Müller): reescrita só com o que as duas notícias dizem (UDESC
  08/04/2026 e ND Mais 24/03/2026); a Fm. Rio Bonito é a informada pela UDESC, e a autoria "tatus
  extintos" aparece como "provável".
- **Paleotocas, fontes locais:** 178 → Munhoz et al. (2024, DOI 10.4072/rbp.2024.4.0428); 179 → Audi
  (2022, dissertação); 180 → Santos et al. (2021, DOI 10.33448/rsd-v10i11.19176, Fm. Botucatu); 82 →
  Frank et al. (2012). O DOI genérico de Buchmann et al. (2009) saiu do campo `doi` de 38, 44, 81, 82, 83
  e 179 (descrevia o fenômeno em geral, não cada paleotoca).
- **TCC citado com autoria errada** (ids 101, 221, 222, 223): "Luiz, E. R." → **Elias, R.L. (2020)**,
  "Vertebrados fósseis de Santa Catarina: uma cartilha…", UFSC.
- **43** (Rio dos Cedros): os artigos do descritor não mencionam Rio dos Cedros. Agora cita Saldanha
  et al. (2023, *Sedimentary Geology* 458:106533), como "Citação em revisão" — o resumo foi lido por
  fonte secundária (a Wikipédia que o resume); o artigo integral não foi aberto. O registro 37 recebeu
  nota de referência cruzada (podem ser a mesma localidade; não confirmado).
- **96**: acrescentado Buck et al. (2026, DOI 10.1016/j.jsames.2026.106223) e o histórico taxonômico de
  *Aracoaraichnium* (→ Chelichnopodidae). O DOI veio de lista de discussão, não do artigo.
- **Peixes do Campáleo (56–59):** os quatro repetiam as mesmas três obras (e o 56–59 apontavam para um
  artigo sobre larvas de tricóptero). Agora cada um cita só a obra do próprio táxon:
  58 → Hamel (2005); 59 → Malabarba (1988); ambos + Mouro et al. (2020) como contexto. **56 e 57
  só têm a listagem da Wikipédia** (sem autoria nem referência por táxon) e viraram citação explícita.
  A autoria "Beltan, 1975" de *Irajapintoseidon uruguayensis* não foi confirmada e foi retirada. O título
  de Hamel (2005) foi corrigido para "A new **lower** actinopterygian…" (a lista de referências de Mouro
  et al. 2020 o omite).
- **218**: o campo de tombo trazia só o prefixo "CP/P (coleção CENPALEO)", sem número de espécime; passou a "-" (a coleção já consta no depositário).
- Pontuação: 19 fichas tinham "UNIDADE E IDADE" colado ao fim da frase anterior; 3 fichas mostravam "-"
  como depositário (agora "Não informado na fonte consultada").

- **Período sem registro removido:** "Permiano Inferior (Asseliano)" (0 registros) saiu da tabela de
  períodos (de 16 para 15 intervalos). Sua descrição dizia que o Folhelho Lontras tem "o mais importante
  conjunto de tetrápodes permianos de Santa Catarina", afirmação sem fonte (o Campáleo é conhecido por
  peixes, conodontes, artrópodes e esponjas).

### Registro novo
- **233 — Palinomorfos holocênicos de turfeiras (Santa Rosa do Sul / São João do Sul).** Cancelli, Souza
  & Neves (2012), *Acta Botanica Brasilica* 26(1):20–37, DOI 10.1590/S0102-33062012000100004: 54
  morfotipos. Substitui, com fonte própria, o registro 040 removido em 2026.09.13 (que misturava três
  fontes). Ponto aproximado; novo sítio "Planície Costeira sul-catarinense".

### Site
- **Árvore das aves aninhada em clados reais.** Neoaves agora contém Mirandornithes, **Columbaves**
  (→ Otidimorphae, Columbimorphae), Strisores, Gruimorphae (→ Gruiformes, Charadriiformes),
  **Phaethoquornithes** (→ Eurypygimorphae, Aequornithes) e Telluraves. Corrigido o uso de "Columbea",
  que na definição original (Jarvis et al. 2014) inclui Mirandornithes e aqui continha só as pombas.
  O cigana (Opisthocomiformes) fica direto em Neoaves, sem clado superior: a posição é debatida
  (Jarvis et al. 2014 o põem como irmão de Gruiformes + Charadriiformes; outros estudos divergem).
  As notas dos nós passam a aparecer ao passar o mouse. Contagens e fósseis inalterados (34 ordens, 104
  famílias, 28 fósseis encaixados). Telluraves ficou plano de propósito: as subdivisões (Afroaves,
  Australaves) não são consenso.
- **Etiqueta "Nº 00X" dos cards** agora fica dentro do card, na primeira linha; antes passava da borda
  superior e disputava espaço com a pílula de categoria.
- **Mapa:** a bolha do maior sítio (Campáleo, Mafra) era cortada pela borda superior; o quadro do mapa
  ganhou folga (viewBox `0 -40 640 800`). O zoom com a roda do mouse não mantinha o ponto sob o cursor
  (deslocava ~30 px); agora usa a matriz de tela do SVG (`getScreenCTM`), que considera as faixas vazias
  e a origem do viewBox. Arrastar e os botões +/−/◎ conferidos.
- **Ficha:** entrada de fonte no formato "URL (anotação)" gerava link quebrado; corrigido.
- Selos "Citação de mídia" sem quebra de linha.

### Verificações
`scripts/validar.py`: aprovado (228 registros, 57 sítios; 2 avisos — DOI 52/228 e 10 obras ainda com
referência incompleta). Teste no navegador (desktop e celular): abas, fichas com aviso, grupos da
bibliografia, selos nos cards (14), 57 sítios clicáveis no mapa, árvore aninhada, etiqueta dentro do card.

### O que continua em aberto
- Obras ainda com referência incompleta (10): Da Rosa et al. 1997 (ids 1, 2, 3, 5, 84); Netto & Zucatti
  da Rosa 1997 (209–213); Reed 1930, Beurlen 1954/1957, Rocha-Campos 1964–1993 (31); Paula-Couto 1980
  (39, original não consultado); Pigão & Mouro 2019 (99); "Nova localidade fossilífera da Fm. Rio do
  Rasto" 2017 (181–183); Nizer & Weinschütz 2015 (223); Weinschütz et al. 2021 (37, veículo não confirmado).
- Nomes taxonômicos seguem a obra citada; revisões posteriores só constam onde foram verificadas
  (Glossopteris, bivalves de Taió, icnofósseis, Irati e Quaternário não foram revistos um a um).
- Registro 221 cita Karl et al. 2007; o TCC diz 2008 (já anotado na ficha).

## 2026.09.13 — 08/10/2026 · referências completadas, citações ABNT refeitas, 1 registro removido

Banco: **227 registros** (era 228), 56 sítios, 99 obras na bibliografia.

### Registro removido
- **nº 040 — "Registro paleoambiental (fitólitos, palinomorfos)", Lagoa do Sombrio.**
  A ficha misturava três fontes sem relação entre si: o link apontava um estudo
  de fitólitos em sambaqui de São Francisco do Sul; a citação exportada era um
  resumo sobre dinoflagelados da plataforma de Itajaí (Menezes et al. 2009); e a
  localidade era Sombrio. Nenhuma sustentava "fitólitos e palinomorfos" na Lagoa
  do Sombrio, nem a idade "12.000–3.000 a". Removido junto com o sítio e o
  período que só ele usava. Fontes que existem e podem virar registros próprios,
  se for do interesse: Cancelli, Souza & Neves (2012), *Acta Botanica Brasilica*
  26(1):20–37, DOI 10.1590/S0102-33062012000100004 (54 palinomorfos holocênicos,
  testemunhos de Santa Rosa do Sul e São João do Sul); e resumos do Salão de
  Iniciação Científica da UFRGS (2015, 2016) sobre diatomáceas da Lagoa do Sombrio
  (autoria não listada na página consultada).

### Citação ABNT exportada: 42 de 98 eram de outro trabalho
O campo `citacao_abnt` não aparece no site, mas vai para a planilha e para
`data/fosseis.json`. Auditoria: 42 registros traziam a citação de **outra obra**
(o registro das larvas de tricóptero levava a citação de uma barata fóssil;
os fósseis de Taió levavam a de Rocha-Campos & Simões 1993 em vez da de
Schmidt-Neto et al. 2014; o 063 levava um título de artigo que não corresponde
ao trabalho citado). Além disso, 129 registros não tinham o campo.
- Novo `scripts/citacoes-abnt.py`: gera a citação **a partir do descritor**,
  obra por obra; o que não tem formato bibliográfico é transcrito entre
  colchetes, nunca completado por suposição.
- Todos os 227 registros têm agora `citacao_abnt` coerente com o descritor.
  Citações antigas com detalhes não verificáveis (periódico/volume/DOI que o
  descritor não confirma) foram descartadas. Mantidas só as notas-padrão de
  reportagem/divulgação (ids 67, 68, 70).
- `validar.py` ganhou duas checagens que reprovam o build: (18) o DOI do
  registro tem de constar no descritor; (19) a citação ABNT tem de ser da
  mesma obra do descritor (autor, ano e início do título).

### Referências completadas (verificadas na revisão de Balistieri, Netto & Sedorko 2021 e em páginas das próprias obras)
- **Bainha (56 registros):** a tese citada como "Bernardes-de-Oliveira (1977)"
  é *"Tafoflora eogondvânica da camada Irapuá, Formação Rio Bonito (Grupo
  Tubarão), SC"*, Tese de Doutoramento, IG-USP, 301 p., 36 est. (2 vol.).
  O título do capítulo SIGEP 082 foi corrigido para o da página oficial
  ("Afloramento Bainha (Criciúma), SC — Flora Glossopteris do Permiano
  Inferior"), e uma repetição "v.1:23–31, v.1:23–31" foi removida.
- **Balistieri, Netto & Lavina (2002)** — *Revista Brasileira de Paleontologia*
  4:13–26, ritmitos de **Mafra** (ids 218–220).
- **Nogueira & Netto (2001b)** — título completo, *Acta Geologica Leopoldensia*
  52/53:387–396 (ids 201–203).
- **Netto, Buatois, Mángano & Balistieri (2007)** — "Gyrolithes as a multipurpose
  burrow", *RBP* 10(3):157–168, DOI 10.4072/rbp.2007.3.03 (id 224).
- **Marques-Toigo et al. (1989)** — título e páginas dos Anais do XI Congresso
  Brasileiro de Paleontologia (ids 72, 78, 79, 80).
- **Paim, Leipnitz, Zucatti da Rosa & Da Rosa (1997)** — *Chancelloria*,
  *Revista Brasileira de Geociências* 27(3):303–308 (id 4).

### Erros corrigidos
- **nº 224:** o campo DOI trazia o da revisão de 2021 (Balistieri, Netto &
  Sedorko), não o do artigo citado (Netto et al. 2007).
- **nº 048 e 063:** Vinn et al. (2019) estava com autores errados ("Vinn,
  Wilson, Mouro & Fernandes"). O artigo é de **Vinn, Zabini & Weinschütz**,
  *Carnets de Géologie* 2019(19):439–444, DOI 10.4267/2042/70636, "Ichnofossils
  associated with lingulide shells from the Lower Permian of Brazil". A página
  consultada diz só "Permiano Inferior do Brasil"; a ligação ao Campáleo vem da
  compilação do Folhelho Lontras e fica declarada na ficha.
- **nº 080:** a sinonímia *Isopodichnus* → *Cruziana* cf. *problematica* era
  atribuída a Balistieri et al. (2002), trabalho que trata dos ritmitos de
  Mafra e não de Trombudo Central. Atribuição retirada; tipo da fonte corrigido
  para anais.
- **nº 004:** "Leipnitz et al. (1997)" não pôde ser confirmado como trabalho
  distinto de Paim et al. (1997) e foi retirado.
- **nº 037:** classificado como "Divulgação ou imprensa", mas é uma publicação
  científica; reclassificado provisoriamente como anais/resumo (veículo ainda
  não confirmado, declarado na ficha).

### Ressalvas novas nas fichas da Bacia do Itajaí (Ediacarano)
- Becker-Kerber et al. (2024, *Precambrian Research* 403:107307, DOI
  10.1016/j.precamres.2024.107307) interpretam como **tectógrafos**
  (pseudofósseis) marcas horizontais da Bacia do Itajaí parecidas com icnofósseis
  simples. O resumo consultado não diz se os icnofósseis de Netto & Zucatti da
  Rosa foram reavaliados; os registros 209–213 agora trazem essa ressalva.
- Becker-Kerber et al. (2020, *Gondwana Research* 84:211–228, DOI
  10.1016/j.gr.2020.03.007) citam *Aspidella* e *Nimbia* (sustenta o 084), mas o
  resumo não menciona *Parvancorina*, *Charniodiscus* nem *Cyclomedusa*: os
  registros 001–003 passam a declarar que a identificação vem da dissertação e
  deve ser conferida no texto completo.

### Ainda sem citação completa (declarado na própria ficha, 9 obras)
Da Rosa et al. (1997) [ids 1, 2, 3, 5, 84]; Netto & Zucatti da Rosa (1997)
[209–213]; Reed (1930), Beurlen (1954, 1957) e Rocha-Campos (1964–1993) [31];
Paula-Couto (1980) [39]; Pigão & Mouro (2019) [99]; "Nova localidade fossilífera
da Fm. Rio do Rasto" (2017) [181–183]; Nizer & Weinschütz (2015) [223]. Nada foi
completado por suposição; o aviso do validador continua visível.

## 2026.09.12 — 07/10/2026 · bibliografia completa e auditoria das fontes

### Aba Sobre & Fontes — todas as fontes citadas
O texto citava só quatro instituições e não listava nenhuma fonte. A seção
"Origem dos dados — Santa Catarina" agora traz a **bibliografia completa**:
**103 obras**, cada uma citada uma única vez, agrupadas pela natureza
(artigo em periódico, capítulo SIGEP, monografia, tese, anais, divulgação,
revisão). A lista é **gerada a partir dos próprios registros**, por isso não
pode omitir uma fonte nem ficar defasada. Cada obra mostra seu DOI (15
obras) e links, e um botão "N registros →" abre o catálogo filtrado por
aquela obra, com etiqueta removível. Verificado com clique real: os 103
botões levam exatamente aos registros que a obra sustenta, e nenhum registro
ficou sem fonte.

### Correções de texto na mesma aba
- O texto afirmava que as instituições mais citadas eram "CENPALEO/UnC,
  UFRGS, UNISINOS e UFSC". Nos dados, a UFSC aparece em 3 registros; lideram
  USP/IGc (94), UFRGS (91), CENPALEO (73) e UNISINOS (55). Frase substituída
  por contagens lidas do banco.
- "Limitações" dizia que o banco inclui **apenas** publicações científicas
  indexadas, mas o catálogo contém resumos de eventos e registros de
  divulgação (sinalizados na ficha). Texto corrigido.

### Erros encontrados nas referências ao montar a lista
- **Título inventado.** Malabarba (1988) constava como "Revisão dos peixes
  paleoniscóides do Grupo Itararé". O título real é "A new genus and species
  of stem group actinopteran fish from the Lower Permian of Santa Catarina
  State, Brazil", Zool. J. Linn. Soc. 94:287-299. A citação "Beltan (1975)",
  que o acompanhava, não pôde ser confirmada e foi removida.
- **Fonte trocada.** Os 10 registros de bivalves e equinodermos de Taió
  citavam, ao lado do artigo certo, a dissertação de Boardman (2006), que
  trata da macroflora, não da fauna marinha. Passam a citar Schmidt-Neto,
  Netto & Tognoli (2014), Rev. Bras. Paleontol., que antes estava sem
  autores. A dissertação segue nos registros de plantas, onde pertence; as
  "112 p." que constavam não foram confirmadas e saíram.
- Cruziana problematica citava "Balistieri, Netto et al. (2015) - citado em
  ScienceDirect"; é uma das dez icnoespécies de Lima et al. (2015).
- Autoria afirmada sem confirmação: "Boardman, Iannuzzi & Dutra (2007)"
  passa a "Boardman et al. (2007)", única forma confirmada.
- Duas referências estavam sem autores (Boardman et al. 2023, Silva et al.
  2021) e Balistieri et al. (2021) tinha dois localizadores diferentes.
- Gangamopteris e sementes de Taió citavam um artigo sobre esfenófitas.
- Completadas com título, autoria, veículo e paginação: Hamel (2005),
  Richter (1991), Martins-Neto (2005), Carvalho et al. (1942), Mouro et al.
  (2018), Mouro (2017), Pinto & Sedor (2000), Ricetti et al. (2016),
  Ricetti & Weinschütz (2011), Wilner et al. (2016), Kegel & Costa (1951),
  Ferreira-Oliveira & Rohn (2008), Buchmann et al. (2009), Lopes et al.
  (2017) e os títulos dos quatro capítulos SIGEP. DOIs agora fazem parte do
  texto de cada citação.

### Pendências declaradas
21 obras ainda sem título completo, herdadas da planilha original, sem fonte
localizada nesta rodada: Beurlen (1954, 1957); Reed (1930); Rocha-Campos
(1964-1993); Paim et al. (1997); Leipnitz et al. (1997); Da Rosa et al.
(1997); Marques-Toigo et al. (1989); Paula-Couto (1980); Pigão & Mouro
(2019); Balistieri, Netto & Lavina (2002); Netto & Zucatti da Rosa (1997);
Netto et al. (2007); Nizer & Weinschütz (2015); Nogueira & Netto (2001b);
Vinn et al. (2019); Bernardes-de-Oliveira (1977); boletim SBP nº 63; e três
entradas da Fm. Rio do Rasto. A validação agora emite aviso permanente com
esse número.

## 2026.09.11 — 06/10/2026 · varredura dirigida — Itaiópolis

### Correção de autoria
- ***Myonia costata*** estava atribuída a **Reed, 1930**; a autoria
  correta é **Rocha-Campos, 1970**, confirmada em Gibathe, Neves &
  Weinschütz (2019). *M. tayoensis* passa a trazer o "?" que o próprio
  estudo usa — identificação tentativa.

### Registros enriquecidos (Localidade Moema)
Os três bivalves da fauna de Itaiópolis (*Heteropecten catharinae*,
*Myonia costata*, *Myonia tayoensis*) ganharam descrição morfológica e a
referência completa: **Weinschütz, Wilner, Ricetti & Greinert (2015)**,
que relatou a ocorrência pela primeira vez, e **Gibathe, Neves &
Weinschütz (2019)**, estudo taxonômico de 120 espécimes do CENPALEO.

Contexto que passou a constar: a fauna de Itaiópolis fica a **130 km**
da de Taió e compartilha as mesmas três espécies — o que sugere
biocorrelação entre as duas ocorrências. *H. catharinae*, até este
estudo, só era conhecida em Taió.

### Registro novo
- **Espículas de esponjas silicosas** (?Hexactinellida), de uma
  localidade do interior de Itaiópolis distinta de Moema (Bremem &
  Weinschütz, 2008). Ocorrem no intervalo **superior** da Fm. Rio do
  Sul — outros achados do grupo no Itararé catarinense estão em
  unidades medianas (Fm. Mafra e base da Rio do Sul). Entra com
  ressalva: os autores não classificam além do nível de classe, por
  não haver espículas interligadas em rede.

Catálogo: 227 → 228 registros.

## 2026.09.10 — 05/10/2026 · revisão do Campáleo pelo artigo de referência

Revisão dos registros do Afloramento Campáleo contra o texto completo de
**Mouro et al. (2020)**, *Palaeogeography, Palaeoclimatology,
Palaeoecology* 555: 109850 — fonte principal do sítio.

### Unidade, idade e localização (38 registros)
- O Folhelho Lontras passa a constar como **topo da Fm. Campo Mourão**
  (França & Potter, 1988); na nomenclatura de superfície de SC, base da
  Fm. Rio do Sul. Antes, metade das fichas citava uma unidade e metade a
  outra.
- **A idade está em discussão** na fonte: conodontes (*Mesogondolella*
  spp.) e palinologia (Zona *Vittatina costabilis*) indicam Cisuraliano;
  datações U-Pb em zircão apontam Pennsylvaniano, e a palinologia de 2023
  sugere Gzheliano. As fichas afirmavam "Permiano Inferior (Asseliano)"
  como fato e passam ao intervalo **Carbonífero – Permiano Inferior**
  (ca. 303–295 Ma), com a divergência explicada. O período "Permiano
  Inferior (Cisuraliano)" ficou sem registros e saiu da linha do tempo
  (18 → 17 intervalos).
- Localização conforme o artigo: BR-280, a 2 km do entroncamento com a
  BR-116 (26°09′30,22″S, 49°48′52,82″W).

### Duplicatas removidas
- **Nº 016** repetia os dois morfotipos de peixe com encéfalo preservado
  do nº 098, com ano errado ("Figueroa et al., 2025"; o artigo é de 2024)
  e link para o artigo de outra localidade.
- **Nº 023** ("Conodontes — 5–6 espécies", apoiado em reportagem) repetia
  o nº 095, *Mesogondolella* spp.

### Fichas corrigidas
- **Nº 015** passa a representar a ictiofauna de actinopterígios basais
  (mais de 200 exemplares; exemplar figurado CP.V 5202a). Saíram o ano
  errado e a preservação de "coração", que não tinha fonte.
- **Nº 022** passa a ser a possível **demosponja** descrita por Mouro
  (2017), de amostra coletada por Oliveira em 1927 e guardada no New York
  State Museum.
- **Nº 042**: insetos das ordens **Blattodea e Grylloblattodea** (a ficha
  dizia "ordens não determinadas").
- *Biconvexiella* sp. → ***Biconvexiella roxoi***; *Beecheria* e
  *Quinquenella* ganham "?", como na fonte.
- *Microhemidiscia greinerti*: referência completa (*J. Paleontol.*
  88(1): 171–178) e quase cem exemplares completos.
- *Anthracoblattina mendesi*: cerca de 54% dos mais de cem insetos; número
  de espécime CP/E 3755b.

### Registros novos
- **Estojos larvais de Trichoptera/Permotrichoptera** — possivelmente os
  mais antigos conhecidos (Mouro et al., 2016, *Scientific Reports*
  6: 19215).
- **Estrutura semelhante a âmbar**, comunicada como possível primeiro
  âmbar paleozoico da Bacia do Paraná — com a ressalva de que segue em
  descrição.

### Navegação (defeito também presente no site publicado)
- **O botão "voltar" saía do site.** Toda navegação substituía o endereço
  sem criar entrada no histórico; quem abria uma ficha e apertava
  "voltar" — no celular, o gesto natural para fechá-la — deixava o
  Paleo-SC. Agora trocar de aba ou abrir uma ficha cria entrada no
  histórico, e mexer só nos filtros continua substituindo, para não
  acumular uma entrada por letra digitada.
- **Mudar de rota deixava a ficha aberta** por cima da nova aba. Agora a
  ficha fecha.
- Fechar a ficha no X ou no Esc equivale a voltar, sem pares repetidos no
  histórico. Endereço sem rota mostra o Início.

Catálogo: 227 registros (−2 duplicatas, +2 novos).

## 2026.09.9 — 05/10/2026 · correções de nomenclatura e de referências

A partir de uma dúvida sobre o registro nº 014, revisão das referências
e dos links da base.

### Registro nº 014
- Nome grafado errado: "Gluckstadella cooperi" → ***Gluckstadtella
  cooperi* Savage, 1971** (com "t"), com autoria.
- A ficha estava sem descrição. Agora traz: impressão de repouso de
  artrópode, descrita nos ritmitos periglaciais do Grupo Dwyka (África do
  Sul) e interpretada como de crustáceos sincarídeos ou pericarídeos.
- A localidade, pedreira de Águas Claras (Rio do Sul), estava correta
  (Gandini, Netto & Souza, 2007).
- O registro nº 074 afirmava que *G. cooperi* estava "registrada no
  Campáleo" — sem fonte. Passa a remeter a Águas Claras (nº 014).

### Referências que não correspondiam ao link
Nova checagem automática: o código de um link do ScienceDirect embute o
ISSN da revista, e ele tem de bater com a revista citada na ficha. Na
versão publicada, sete fichas divergiam:
- **Registro nº 084:** citava "Sanchez et al. (2010) — *Sedimentary
  Geology*", referência que não corresponde a trabalho algum. O correto é
  **Guadagnin et al. (2010), *Precambrian Research***, que data a Bacia
  do Itajaí entre 563 e 549 Ma. Erro introduzido na rodada de
  referências de 2026.08.5.
- **Registro nº 100:** citava *Review of Palaeobotany and Palynology*; o
  artigo é da ***Sedimentary Geology* (2023)**. A ficha passa a registrar
  que esse trabalho situa o Campáleo perto do limite Carbonífero–Permiano
  (provavelmente Gzheliano), enquanto outras fontes o põem no início do
  Permiano. Também erro da rodada 2026.08.5.
- **Registros nº 072, 201–203:** linkavam um artigo de 2015 enquanto
  citavam Nogueira & Netto (2001). Os links passam à revisão de
  Balistieri et al. (2021), que indexa o trabalho.
- **Registro nº 038:** link de um trabalho de 2024 que a ficha não cita;
  removido.

### DOIs confirmados
- Lima et al. (2015): **10.1016/j.jsames.2015.07.008**, *J. South Am.
  Earth Sci.* 63: 137–148 — 8 registros.
- Netto et al. (2009): **10.1016/j.palaeo.2008.10.028** — 3 registros.

Registros com DOI: 34 → 45. Validação: 15 → 16 verificações.

## 2026.09.8 — 28/09/2026 · revisão de erros e novos registros

Catálogo: 224 → 227 registros; 54 → 56 sítios; 34 → 35 municípios.

### Erros corrigidos
- **Contradição entre fichas.** O registro nº 159 ainda dizia que
  Canoinhas é a "única localidade" do *Krauselcladus* em toda a Bacia do
  Paraná, embora o próprio catálogo tenha a ocorrência de Major Vieira
  (nº 195). Agora: "até 2024, única localidade conhecida".
- **Afirmação datada.** O *Parapytanga* era dado como "um dos três
  temnospôndilos da Fm. Rio do Rasto"; outros foram descritos depois de
  2015. A contagem passou a ser situada no tempo ("na época da
  descrição").
- **Período com limites errados.** "Pleistoceno–Holoceno" tinha os mesmos
  limites do Holoceno (0,0117–0 Ma), e o registro datado de 12.000 anos
  ficava fora dele. Passou a "Pleistoceno Superior – Holoceno"
  (0,129–0 Ma). O "Plioceno–Pleistoceno" foi alinhado ao limite oficial
  (0,0117 Ma).
- **Superlativo sem fonte.** Oito fichas de paleotoca diziam que SC e RS
  têm "a maior abundância de paleotocas do mundo"; as referências citadas
  não dizem isso. A frase foi trocada por uma afirmação atribuída: segundo
  F. S. C. Buchmann (*Jornal da Unesp*, 2022), há mais de 2 mil
  paleotocas no Brasil, 99% delas entre o sul de SC e o norte do RS.
- **Toca do Tatu (Timbé do Sul):** a coordenada estava cerca de 6 km fora
  da publicada, e a ficha se apoiava em divulgação, embora exista artigo
  sobre a caverna (Frank et al., 2012, *Espeleo-Tema* 23(2): 87–101).
  Ambos corrigidos.
- **Grafia:** "bioestratifráfico" → "bioestratigráfico". (Conferido:
  "pteridófila" está correto — é o termo para folhagem de aspecto de
  samambaia de afinidade incerta.)

### Subcategorias unificadas
Sinônimos e variações que viravam itens separados na navegação:
"semente/sementes", "conodonto/conodonte", três variações de "esponja",
"pista/trilha de artrópode", duas de "bioerosão", duas de "escavação de
organismo vermiforme", "conchostráceo/crustáceo conchostráceo",
"gastrópode" (2), "equinodermas". Os quatro mamíferos passam a formar o
subgrupo **mamífero**, e os anfíbios, **anfíbio**. As **9 paleotocas**,
antes em 4 subcategorias, ficam em **paleotoca**. Em todos os casos o
rótulo detalhado foi para a descrição ("Classificação: …").

### Registros novos
- **Paleotoca da Cavidade Linha Mimosa, Lindóia do Sul** (Budke, Lima &
  Carbonera, 2020): o **primeiro registro do oeste catarinense** no
  catálogo.
- **Carvão vegetal fóssil** do afloramento Porongos, Lauro Müller
  (Benicio et al., 2019, *PLoS ONE*): evidência de incêndios recorrentes
  nas turfeiras do Permiano Inferior, presente nos seis níveis carbonosos
  da camada Barro Branco.
- ***Brasilodendron pedroanum***, licófita subarborescente da mina
  Bonito I (Manfroi et al., 2012, *Revista Brasileira de Paleontologia*).

### Validação (14 → 15 verificações)
Nova checagem: subcategorias que diferem só no plural ou na vogal final
são reprovadas. Testada contra a versão publicada: reprova.

## 2026.09.7 — 28/09/2026 · auditoria das tabelas

Auditoria cruzada entre as tabelas — registros, sítios, períodos e
instituições —, que a validação não cobria. Catálogo: 221 → 224.

### Defeitos visíveis no site
- **Aba Períodos incompleta.** As listas de táxons de cada período eram
  cópias mantidas à mão e tinham ficado para trás: o Permiano Inferior
  listava 18 dos 90 registros, e um botão apontava para o registro
  removido nº 017 e levava a catálogo vazio. Agora todos os 224
  registros aparecem; na amostra testada, nenhum botão leva a catálogo
  vazio.
- **Painel dos sítios no mapa** exibia nomes anteriores às correções de
  nomenclatura, e o botão "explorar" filtrava pelo primeiro deles: no
  Bainha, o catálogo vinha vazio. O botão passou a aplicar um **filtro
  exato por sítio**, visível e removível. O Bainha retorna seus 58
  registros (uma busca por texto trazia 60, incluindo outros sítios que
  o citam).
- A busca do catálogo passa a cobrir também sítio e local de coleta.

### Correções de dados
- **Campo da Lança fica em Mafra**, não em Doutor Pedrinho (Netto et al.,
  2007, perfil do afloramento na região de Mafra; Balistieri & Netto,
  2002). Segundo erro de município da mesma rodada que atribuíra Bela
  Vista do Sul a Doutor Pedrinho.
- **Coluna White** atravessa dois municípios: a seção sobe a SC-438 de
  Lauro Müller ao topo da serra, em Bom Jardim da Serra. Município
  registrado como "Lauro Müller / Bom Jardim da Serra".
- **Furna Xocleng (Morro Grande):** a coordenada caía no município
  vizinho de Nova Veneza. Passou à sede de Morro Grande, com a localidade
  (comunidade de Três Barras) descrita na ficha.
- **Referências:** título completo de Netto et al. (2009),
  *Palaeogeography, Palaeoclimatology, Palaeoecology* 272: 240–255, e
  título truncado removido de Nogueira & Netto (2001b). DOI da descrição
  original de *Anthracoblattina mendesi* (Pinto & Sedor, 2000).
- **Link repetido** nas fontes do registro nº 178.
- **FURB** incluída na aba Instituições: guarda o material de Ponte Alta.

### Registros novos
- ***Taiophlebia niloriclasodae*** Martins-Neto et al., 2007: inseto do
  Carbonífero Superior com **holótipo de Taió**; o gênero leva o nome do
  município.
- **Trilha de salto de artrópode** (*Ichnos* 28(4), 2021): primeira
  ocorrência em depósitos glaciais do Paleozoico da Bacia do Paraná, numa
  pedreira de Trombudo Central. Indica exposição subaérea.
- **Escavações tipo *Gyrolithes*** da suíte Glossifungites do Campo da
  Lança (Netto et al., 2007).

### Estrutura
- Novo `scripts/recalcular-derivados.py`: recalcula a partir dos
  registros os campos de sítios (contagem, períodos, amostra de táxons)
  e de períodos (total, lista de táxons).
- Validação (13 → 14 verificações): campos derivados precisam bater com
  os registros. Testada contra a versão publicada: reprova.

## 2026.09.6 — 28/09/2026

Reúne a rodada de busca aprofundada (ainda não publicada) e as mudanças
pedidas para os peixes e os mesossauros. Catálogo: 212 → 221.

### Correções de dados
- **Bela Vista do Sul é distrito de Mafra**, não de Doutor Pedrinho, onde
  dois registros (nº 199 e 200) estavam por engano. O Campo da Lança
  permanece em Doutor Pedrinho, onde a literatura situa a suíte
  Glossifungites.
- ***Stegomastodon waringi* → *Notiomastodon platensis*** (Ameghino, 1888),
  conforme Mothé et al. (2012, *Quaternary International*), com a
  sinonímia registrada na ficha.
- **Duplicata removida.** O registro nº 017, "Symmoriiformes gen. et sp.
  nov.", era o mesmo dente que no mesmo artigo recebeu o nome
  *Crioselache wittigi* (nº 055). O tubarão contava duas vezes.
- **Números de tombo falsos.** 14 registros traziam marcadores como
  "CENPALEO-MP-[múltiplos]", que imitam número de tombo. Foram reescritos
  como "Coleção CENPALEO — … (número de tombo não informado na fonte)".
  Só 9 registros têm número real de espécime, e não 25, como uma
  contagem anterior indicava.

### Peixes num só grupo
Os 15 registros de peixe estavam em 9 subgrupos ("peixe actinopterígio",
"peixe ósseo", "condrictio", "tubarão Symmoriiformes"…). Agora formam o
subgrupo único **peixes**, e a classificação anterior de cada um abre a
descrição da ficha ("Classificação: …").

### Mesossauros
Não há descrição formal de mesossauro catarinense: a compilação de
vertebrados fósseis de SC da UFSC o afirma, e a busca confirmou. Ficam
documentadas três ocorrências, todas como Mesosauridae indet.:
- **Três Barras**: ficha reforçada; achados nas estiagens de 2018 e 2020
  (a ficha dizia só 2020) e várias amostras no CENPALEO;
- **Papanduva** (novo): citado por Karl, Gröning & Brauckmann (2007,
  *Clausthaler Geowissenschaften* 6: 63–78), a única menção a mesossauro
  catarinense em periódico científico;
- **Ribeirão das Pedras, Taió** (novo): exemplar exposto em museu do
  município, conhecido por divulgação.

As fichas registram a taxonomia atual: *Mesosaurus tenuidens* seria a
única espécie válida da família (Verrière & Fröbisch, 2022, *PeerJ*).

Também entra o primeiro **peixe da Fm. Irati** catalogado para SC:
paleoniscídeos de Três Barras (Nizer & Weinschütz, 2015, resumo).

### Rodada de busca aprofundada (Mafra)
- Pedreira Butiá (Fm. Taciba): *Myonia argentinensis*, *Aviculopecten
  multiscalptus* e braquiópodes productídeos (Simões et al., 2012).
- Bela Vista do Sul: ***Lyonia rochacamposi*** Taboada et al., 2016,
  espécie nova, assembleia monotípica com cerca de 110 indivíduos/m².
- Fazenda Potreiro (Fm. Mafra): *Hormosiroidea meandrica*, *Undichna
  consulca* (trilha de nadadeira de peixe) e *Gordia*.

### Mapa
O anel que separa sítios de mesma coordenada não impedia que **grupos
vizinhos** colidissem: com o sítio novo de Taió, o "Clube Caça e Tiro"
ficou coberto pela "Pedreira Fama", de Trombudo Central. Uma etapa de
relaxação passou a afastar qualquer par sobreposto, deslocando só
símbolos já deslocados. Verificado: os 53 sítios respondem ao toque, em
computador e celular.

### Interface
O permalink de um registro removido abria um modal vazio. Agora explica
o motivo (casos nº 017 e nº 184) ou informa que o número não existe.

### Validação (12 → 13 verificações)
Nova checagem: número de tombo sem marcadores entre colchetes. Testada
contra a versão publicada: reprova.

## 2026.09.5 — 22/09/2026 · tema com as cores da bandeira

Nova paleta opcional baseada na bandeira de Santa Catarina (Lei estadual
nº 975/1953): tres faixas horizontais iguais — vermelha, branca,
vermelha — e um losango verde-claro ao centro, com as Armas do Estado.

- **Vermelho** como cor primaria, **verde-claro do losango** como
  secundaria, **branco** da faixa central como fundo e o **dourado das
  estrelas do brasao** como acento.
- O cabecalho ganha a propria bandeira reduzida a uma **faixa tricolor**
  no topo, e as etiquetas de secao recebem um **losango verde**.
- No mapa as cores passam a carregar dado: municipios com registro em
  verde, sitios de coleta em vermelho.

A lei nao fixa codigos de cor; os tons sao representativos e foram
conferidos contra WCAG AA antes de entrar. O verde-claro do losango
reprova como texto (4,04:1), entao aparece apenas em preenchimentos —
textos usam o verde escuro (6,47:1).

**Implementado como tema alternavel, nao como substituicao.** Um botao
no cabecalho troca entre a paleta classica e a da bandeira; a escolha
fica no localStorage e e aplicada por um script inline no <head>, antes
da pintura, para nao piscar o tema errado no carregamento. Sem
localStorage disponivel, a troca vale para a sessao.

Para tornar a bandeira o tema padrao, basta acrescentar
data-tema="bandeira" a tag <html> em index.html.

Testado nos dois temas, em desktop e mobile: 6 abas sem erro de
JavaScript e os 49 sitios do mapa respondendo ao toque em todos os
cenarios.

## 2026.09.4 — 14/09/2026 · paleta e hierarquia visual

### Nova paleta, derivada do logo
O logo é **teal profundo, pergaminho quente e sálvia**; o site usava um
fundo **cinza-esverdeado frio** (#dde1d3) e cinco famílias de cor
competindo (petróleo, musgo, ouro, terracota, pedra). A desarmonia vinha
daí. A paleta foi refeita a partir das cores extraídas do próprio logo:

- **fundo** pergaminho quente #efe8da (do creme do logo);
- **primária** teal #17505b (do teal do logo);
- **secundária** sálvia #617558;
- **um único acento quente**, cobre #8f4c1c — complementar do teal.

Todos os pares de texto conferidos contra WCAG AA antes de aplicar; o
cobre foi escurecido de #a85f28 para #8f4c1c porque a primeira versão
dava 3,98:1 sobre o fundo. A categoria "Microfóssil", que era roxa e
estava fora de qualquer família, passou a ocre. O entorno dos mapas
recebeu um tom de mar (#d7e1df), separando terra e água.

### Defeito latente encontrado: a hierarquia de texto tinha sumido
O token `--texto-suave` era **usado 17 vezes e nunca definido**. O
navegador não acusa erro nesse caso — cai no valor herdado —, então por
várias versões **todo texto secundário saiu na mesma cor do principal**,
sem nada parecer quebrado. Confirmado por medição: na versão publicada,
guarda e corpo de texto tinham a mesma cor, rgb(27,36,32). Parte da
impressão de site "chapado" vinha disso. Token definido (0,72, >=4,79:1).

### Validação — duas checagens novas
- **Variáveis CSS**: toda `var(--x)` usada precisa estar definida, no CSS
  ou inline pelo JS. Testado contra a versão defeituosa: reprova.
- **Vocabulário controlado de categorias**: um registro entrara como
  "Icnofóssil / Porifera" e criara, sozinho, um grupo espúrio na
  navegação. Reclassificado para "Metazoário de afinidade incerta", que é
  o que ele é (icnofóssil *ou* esponja).

### Ajuste de interface
A pílula "Metazoário de afinidade incerta" esmagava o nome do táxon e
forçava quebra de linha. Passa a exibir "Afinidade incerta"; a ficha
mantém o nome completo.

### Busca sem resultado
Cavernas calcárias do Grupo Brusque, a começar pela **Gruta de
Botuverá**: sem registro fóssil publicado. A gruta é referência em
**paleoclima** (isótopos de espeleotemas), não em paleontologia.

## 2026.09.3 — 14/09/2026 · avifauna

### Registro novo (29 → 30)
**Enantiornithes indet. — bonebed de Presidente Prudente.** Concentração
excepcional de aves enantiornitinas na Fm. Adamantina, descrita na
literatura como um bonebed único para o Cretáceo brasileiro. Foi desse
material que saiu *Navaornis hestiae*, mas o conjunto reúne vários
outros espécimes, **incluindo restos cranianos preservados em três
dimensões** — raridade num grupo cujo material costuma chegar achatado
pelo peso do sedimento.

Ressalva registrada: apesar de reportados desde Alvarenga & Nava (2005)
e apresentados em congressos internacionais por Chiappe e colaboradores,
estes espécimes **permanecem sem descrição formal publicada**. Entram
como *Enantiornithes* indet. — clado inteiramente extinto no limite
Cretáceo–Paleógeno —, não como táxon nomeado. Com isso o catálogo passa
a quatro táxons mesozoicos.

### Escopo confirmado
Mantido o critério de **apenas táxons extintos**. Os cerca de 250
registros quaternários de cavernas compilados por Nascimento (2022)
são quase todos de espécies **viventes** e permanecem fora do catálogo.

## 2026.09.2 — 09/09/2026 · avifauna

Rodada a partir de Nascimento, R.S. (2022) "Fossil Birds of Brazil"
(MZUSP) — a compilação mais completa já feita da paleornitologia
brasileira, com 378 registros.

### Correção taxonômica
***Eutreptodactylus itaboraiensis*** constava como **Cuculidae**,
seguindo a descrição original de Baird & Vickers-Rich (1997), que o
anunciou como "um dos mais antigos cuculídeos do mundo". A revisão de
2022 o trata como **gracilitarsídeo** — família globalmente extinta de
pequenas aves paleógenas, de posição sistemática debatida (Mayr 2005
sugere ?Piciformes).

Com a correção, **Gracilitarsidae passa a figurar entre as seis
famílias globalmente extintas com registro no Brasil**, ao lado de
Quercymegapodiidae, Pelagornithidae, Palaelodidae, Teratornithidae e
Phorusrhacidae — todas já presentes. A árvore genealógica foi
reorganizada: o táxon saiu de Cuculidae e passou a um novo nó
Gracilitarsidae sob Piciformes.

Registrada também a ressalva de que o **holótipo foi perdido**
(tarsometatarso coletado por Ney Vidal em 1950); restam moldes e
ilustrações.

### Registros novos (27 → 29)
Dois táxons indeterminados descritos por Mayr, Alvarenga & Clarke
(2011, *Acta Palaeontologica Polonica*, DOI 10.4202/app.2010.0099) no
mesmo trabalho que erigiu *Itaboravis*:
- um **carpometacarpo de morfologia não encontrada em nenhum outro
  táxon de ave**, com afinidades tinamídeas e tamanho compatível com
  *Itaboravis*, mas não atribuível a ele com segurança;
- **quatro tibiotarsos distais morfologicamente distintos**, um dos
  quais pode ser de *Eutreptodactylus*.

Ambos indicam que a diversidade de aves da Bacia de São José de
Itaboraí era maior que as quatro espécies formalmente nomeadas.

### Verificação de completude
Conferida a lista de 21 espécies extintas nomeadas da revisão de 2022:
**todas já constavam do catálogo**, que inclui ainda quatro descritas
ou reconhecidas depois — *Navaornis hestiae* (2024), *Eschatornis
aterradora* (2026), *Macranhinga paranensis* e *Macranhinga* sp. O
catálogo está, portanto, mais atualizado que a compilação de
referência.

## 2026.09.1 — 09/09/2026

### Icnofauna ediacarana da Fm. Campo Alegre (207 → 212)
A Bacia do Itajaí constava com seis fósseis corpóreos, mas **nenhum dos
icnofósseis** descritos por Netto & Zucatti da Rosa (1997) nos siltitos
prodeltaicos da base da Fm. Campo Alegre. Acrescentados:

- *Gordia* isp. e *Diplocraterion* isp., frequentemente **associados a
  impressões de espículas de esponjas hexactinélidas** — associação que
  liga a icnofauna à fauna corpórea da bacia;
- *Helminthoidichnites* isp., de organismo vermiforme epifaunal,
  indicativo de ambiente marinho profundo e substrato lamoso;
- ?*Oldhamia* isp. / ?*Choia* sp., registrado com dupla interrogação
  pelos próprios autores: a leitura como icnofóssil-guia cambriano ou
  como esponja demospongia altera a natureza do registro e sua
  implicação cronoestratigráfica;
- ?*Arumberia* sp., impressões de repouso de medusoides.

As fichas registram que a associação tem **baixa diversidade** e traços
de tamanho muito inferior ao usual, interpretados como estresse
ambiental — e que estes icnofósseis sustentaram idade cambriana para a
bacia, em contraposição às datações Pb/U, que apontam o Ediacarano.
A divergência permanece em aberto.

### Homonímia documentada
Existem **dois "Campo Alegre"** na geologia catarinense, sem relação
entre si, e a confusão entre eles é um erro plausível:

- a **Fm. Campo Alegre** é unidade da Bacia do Itajaí, no vale do
  Itajaí, e é fossilífera — é ela que aparece no catálogo;
- a **Bacia de Campo Alegre** fica no nordeste do estado, junto ao
  município homônimo, e é vulcanossedimentar (riolitos, traquitos,
  tufos; vulcanismo em ~602 Ma), **sem registro paleontológico
  conhecido**, o que é esperado pela litologia.

Os 11 registros da formação passam a trazer essa ressalva, para que
nenhum deles seja atribuído ao município de Campo Alegre.

## 2026.09.0 — 09/09/2026 · malha municipal e mapa interativo

### Municípios no mapa
O mapa era um contorno único de Santa Catarina. Passa a exibir a
**malha dos 293 municípios**, obtida do IBGE (via tbrugz/geodata-br),
projetada no mesmo sistema do contorno existente e simplificada por
Douglas-Peucker (tolerância 0,6 unidade do viewBox) para caber sem
inchar a página.

Validação do alinhamento: 39 dos 44 sítios caem dentro do polígono do
município que declaram. As cinco exceções são coerentes — três são de
**plataforma continental** (mar, fora de qualquer município) e duas têm
coordenada regional declarada.

Os **32 municípios com ocorrência publicada** recebem preenchimento
distinto: o mapa passa a mostrar, sozinho, a razão entre o que foi
estudado e os 293 municípios do estado — leitura direta do viés
amostral já documentado.

Clicar num município abre um painel com seus registros e sítios, e leva
ao catálogo já filtrado. Municípios sem registro exibem a ressalva de
que a ausência reflete o que foi publicado, não a ausência de fósseis.

### Zoom e deslocamento
Arrastar para mover, rolar para ampliar (até 8×), pinça de dois dedos no
toque, e botões de aproximar/afastar/enquadrar. A transformação é
aplicada ao grupo SVG, não ao viewBox, o que mantém a espessura dos
traços constante e deixa a operação acelerada pelo navegador.

### Desempenho preservado
Embutida no arquivo de dados, a malha **dobrava a carga inicial**
(998 → 1825 ms em 4G). Ela foi movida para `js/municipios.js`, baixado
**sob demanda** na primeira vez que a aba Mapa é aberta — verificado:
não aparece entre os recursos da carga inicial.

### Correção encontrada nos testes
No mobile, os botões de zoom sobre o mapa cobriam sítios: primeiro os de
Itajaí, à direita; movidos para baixo, passaram a cobrir os dos Cânions
e da plataforma sul. Como a área é estreita e todo canto tem sítio, os
controles saíram de cima do mapa e viraram uma barra abaixo dele.
Resultado: os 49 sítios respondem ao toque em ambos os tamanhos.

## 2026.08.8 — 01/09/2026

### Reorganização — a árvore volta para casa
A **árvore genealógica deixa de ser aba própria** e passa a ser um bloco
dentro de *Avifauna do Brasil*, onde sempre pertenceu: ela existe para
posicionar os táxons fósseis daquele catálogo, não como assunto
independente. A navegação cai de 8 para 7 abas.

Links antigos continuam válidos: `#/arvore` leva à aba de avifauna e
rola até o bloco, em vez de quebrar.

### Números que estavam congelados
O texto afirmava "os **24** táxons fósseis" em dois pontos, enquanto o
cartão ao lado já mostrava 27 — a prosa não acompanhou o crescimento do
catálogo. Ambos passam a ler do banco.

### Lista de períodos
As 18 linhas eram visualmente idênticas: um período com 1 registro
parecia igual a outro com 83. Cada linha ganhou uma **barra
proporcional**, na cor do próprio período, dando leitura imediata da
magnitude sem precisar comparar números.

## 2026.08.7 — 25/08/2026

### Santa Catarina (204 → 207)

***Protovirgularia dichotoma*** — traço de locomoção do pé de bivalve.
Com ele, **as dez icnoespécies reconhecidas por Lima et al. (2015) nos
ritmitos de Trombudo Central estão todas no catálogo**: *Cruziana
problematica*, *Diplichnites gouldi*, *Diplopodichnus biformis*,
*Glaciichnium liebegastensis*, *Gluckstadtella elongata*,
*Helminthoidichnites tenuis*, *Mermia carickensis*, *Protovirgularia
dichotoma*, *Treptichnus pollardi* e *Umfolozia sinuosa*.

**Presidente Getúlio** (município novo) — icnofósseis das formações
Campo Mourão e Taciba, em sucessão de 17 litofácies que definem
subambientes de um **sistema de fiorde**. O tamanho reduzido dos traços
e a baixa diversidade, frente ao esperado para ambiente plenamente
marinho, são o próprio argumento paleoambiental da interpretação.

**Bom Retiro** (município novo) — folhelhos betuminosos da **Fm.
Irati**, que passa de uma para duas ocorrências no catálogo. A unidade
é mundialmente conhecida pela associação de mesossaurídeos,
correlacionada à Fm. Whitehill sul-africana.

Ambos entram **com ressalva**: os trabalhos são de natureza
estratigráfica e sedimentológica, e não determinam os fósseis em nível
taxonômico — constam como ocorrência da unidade fossilífera, não como
táxon identificado.

## 2026.08.6 — 25/08/2026

### Santa Catarina (199 → 204)

Rodada a partir da revisão de Balistieri, Netto & Sedorko (2021) e das
referências que ela indexa.

**Duas pedreiras que faltavam** — **Waltrick** e **Fama**, ambas em
Trombudo Central, estudadas por Lima, Netto, Corrêa & Lavina (2015)
junto com a Itaú-Itaúna. As três expõem os mesmos ritmitos de
deglaciação do topo da Fm. Rio do Sul, com coordenadas UTM publicadas.

**Três icnogêneros** ausentes da assembleia da Itaú-Itaúna:
*Neonereites*, *Gluckstadtella* e *Rusophycus*.

Contexto registrado nas fichas: a Fm. Rio do Sul concentra a **maior
diversidade fossilífera do Grupo Itararé**, com cerca de 17 icnogêneros.
A assembleia compõe duas suítes — uma de pistas de artrópodes e
escavações rasas, ligada à icnofácies Scoyenia; outra dominada por
*Helminthoidichnites*, indicando pastagem subaquática. A análise
paleobiológica indica colonização por animais terrestres (milípedes) e
aquáticos (crustáceos e larvas de insetos).

Referência da Itaú-Itaúna completada: Nogueira & Netto (2001a, 2001b),
*Acta Geologica Leopoldensia* 52/53, com paginação.

## 2026.08.5 — 07/08/2026 · rastreabilidade das fontes

### Referências completadas
Auditoria do campo `descritor` classificou cada registro por presença de
autoria, ano e veículo de publicação. **131 de 199 estavam completas.**
Após esta rodada, **163**.

Os maiores blocos corrigidos:
- **10 registros de Taió** que citavam apenas "síntese taphonômica
  (Academia.edu)" passam a referenciar a análise tafonômica das
  concentrações fossilíferas do Mb. Paraguaçu, publicada na *Revista
  Brasileira de Paleontologia*, e a dissertação de Boardman (2006, UFRGS).
- **5 icnofósseis** de Rio do Sul: Lima, Netto, Corrêa & Lavina (2015),
  *Journal of South American Earth Sciences*.
- **4 registros de Rohn & Röster** ganharam título e boletim completos.
- **4 actinopterígios** do Lontras: Malabarba (1988), Hamel (2005),
  Beltan (1975).
- *Anthracoblattina mendesi*, *Orbiculoidea guaraunensis*, vermetídeos,
  *Arachnostega* e outros receberam título do artigo e paginação.

### Natureza da fonte, declarada em cada ficha
Novo campo `tipo_fonte`, exibido como selo colorido ao lado do
descritor. Não basta a referência estar completa: o leitor precisa saber
**que tipo de evidência** sustenta o registro.

| Natureza | Registros |
|---|---|
| Artigo em periódico | 76 |
| Capítulo de sítio (SIGEP) | 74 |
| Tese ou dissertação | 19 |
| Divulgação ou imprensa | 17 |
| Anais ou resumo de evento | 12 |
| Citação em revisão | 1 |

Fica explícito, por exemplo, que a pista de terópode de Nova Veneza se
apoia em reportagem, enquanto os 58 táxons do Bainha vêm de capítulo de
sítio revisado.

A validação passa a **exigir** que todo registro declare a natureza da
sua fonte, e reporta a composição no modo detalhado.

## 2026.08.4 — 07/08/2026 · auditoria

Verificação dos 199 registros: escopo geográfico, municípios, idade
declarada vs período, coerência de coordenadas, duplicatas e campos
obrigatórios.

### Resultado da auditoria dos dados
- **199/199 dentro de Santa Catarina**; todos os municípios conferidos
  um a um como catarinenses.
- Nenhuma incoerência entre idade declarada e período; nenhum táxon
  duplicado; nenhum campo obrigatório vazio; coordenadas de registro e
  de sítio batendo em 100% dos casos.
- Oito registros citam "norte de SC e PR" no local de coleta. Não é
  erro: Rohn (1987) e Rohn & Rösler tratam em conjunto os afloramentos
  dos dois estados, e a ressalva já consta das fichas.
- **13 registros declaram a própria limitação** — coordenada
  aproximada, ausência de publicação formal ou identificação a revisar.

### Defeito encontrado e corrigido — mapa
A auditoria revelou que **11 dos 45 sítios eram inalcançáveis no
mapa**: desenhados sobre a mesma coordenada de um vizinho maior,
ficavam inteiramente cobertos e nenhum clique os atingia. Afetava as
três localidades de Taió, os dois afloramentos de Doutor Pedrinho e a
região de Criciúma sob o Afloramento Bainha.

Sítios coincidentes passam a ser distribuídos em anel, com raio
calculado pela corda entre vizinhos, e uma linha-guia liga cada símbolo
à sua posição real. O agrupamento é por **proximidade**, não por
coordenada idêntica — sítios que diferiam em frações de pixel escapavam
do tratamento e voltavam a se sobrepor. Coordenadas dos registros
permanecem inalteradas: o ajuste é apenas de desenho.

Resultado verificado: **0 sítios inalcançáveis**, em desktop e mobile.

## 2026.08.3 — 07/08/2026

### Santa Catarina (194 → 199)

Rodada a partir de **Balistieri, Netto & Sedorko (2021)**, revisão que
reúne 17 trabalhos sobre a paleoicnologia do Grupo Itararé em SC
(DOI 10.5212/TerraPlural.v.15.2118322.039).

**Dois afloramentos que faltavam** — Campo da Lança e Bela Vista do Sul,
ambos em Doutor Pedrinho, e ambos com icnofaunas descritas. O primeiro
reúne oito icnogêneros; o segundo, no topo da Fm. Rio do Sul, tem
*Cruziana*, *Diplichnites*, *Diplopodichnus*, *Lockeia*,
*Protovirgularia* e *Rusophycus*.

Entraram também icnogêneros ausentes da base: ***Rusophycus*** cf.
*carbonarius*, ***Protichnites*** e ***Lockeia***.

Contexto registrado: esses seis afloramentos, em cinco municípios, são
**os únicos estudados** de toda a faixa aflorante das formações Mafra e
Rio do Sul no estado. O registro icnológico catarinense do Grupo
Itararé remonta a Maury (1927), em Anitápolis.

### Qualidade das fontes
Com esta rodada, a proporção de links frágeis caiu abaixo do limite de
25% e **o aviso correspondente deixou de ser emitido** pela validação.
Registros com DOI: 31 de 199.

## 2026.08.2 — 07/08/2026

### Santa Catarina (193 → 194)

***Krauselcladus canoinhensis*** **em Major Vieira** — município novo.
Segunda localidade conhecida do gênero, cuja **única ocorrência em toda
a Bacia do Paraná é catarinense**. O espécime foi achado em 1º de maio
de 2024 por participantes de uma caminhada religiosa e levado ao
CENPALEO. Amplia o entendimento da distribuição paleogeográfica da
espécie.

Ressalva registrada na ficha: a identificação foi feita **a partir de
fotos e vídeos**, não de exame direto do material, e não há publicação
formal nem dado de tombamento. A ocorrência do gênero em SC, porém, é
bem estabelecida (ver Afloramento de Canoinhas, SIGEP 126).

### Buscas sem resultado (registrado para não repetir)

- **Megafauna quaternária**: a bibliografia de plataforma continental e
  de "tanques" é toda do RS e do Nordeste. Nada específico de SC além
  do que já consta.
- **Fm. Botucatu**: os icnofósseis do paleodeserto — *Brasilichnium*,
  *Farlowichnus*, pistas de terópodes — são de São Paulo e Paraná. A
  **única ocorrência catarinense é a de Turvo**, já catalogada, e o
  próprio trabalho que a descreve afirma ser a primeira pegada de
  tetrápode descrita para a formação no estado.

Conclusão desta rodada: as duas maiores lacunas do catálogo —
Mesozoico e Quaternário — **não são falhas de compilação**. Refletem o
que existe publicado para Santa Catarina.

## 2026.08.1 — 07/08/2026

### Santa Catarina (188 → 193)

**Taió tinha três localidades, não uma.** O material paleobotânico do
município provém dos afloramentos Bruno Peiker, **Clube Caça e Tiro** e
**Igreja** — os dois últimos ausentes do banco. Acrescentados
*Gangamopteris* cf. *G. obovata* (Caça e Tiro), sementes tipo
*Cordaicarpus*/*Samaropsis* (Igreja) e um **novo táxon de
Notocalamitaceae** ainda sem denominação formal (Bruno Peiker), que
difere de *Notocalamites askosus* — do Bainha — por não ter nós nem
folhas modificadas junto à região fértil.

Contexto registrado nas fichas: Taió era conhecida por seus depósitos
**marinhos** do Mb. Paraguaçu; os níveis vegetais na base do mesmo
membro ampliaram o registro e ajudam a reconstruir a evolução dos
paleoambientes locais.

**Paleoflora Siderópolis** (2 registros, município novo). Ocorre nas
camadas de carvão superiores da Fm. Rio Bonito em **quatro áreas** do
estado — Lauro Müller, Criciúma, São Marcos e Treviso. Glossopterídeas
dominam, com *Glossopteris* sobre *Gangamopteris*, seguidas de
*Noeggerathiopsis* e sementes; estruturas reprodutivas e coníferas são
raras. Serve de referência fitoestratigráfica para correlação com
outras macrofloras eopermianas da bacia. Entra também *Vertebraria*,
o sistema radicular das glossopteridófitas, que faltava à base.

Ressalva registrada: a coordenada da paleoflora Siderópolis é regional,
já que a associação é tratada em conjunto para as quatro áreas.

## 2026.08.0 — 07/08/2026

### Santa Catarina (180 → 188)

Rodada dirigida à Fm. Rio do Rasto, até então representada por apenas
seis registros apesar de ser uma das unidades mais fossilíferas do
Permiano catarinense.

**Nova localidade — Afloramento de Ponte Alta** (município novo,
próximo a Otacílio Costa). Descrito a partir de 58 amostras coletadas
pelo Laboratório de Paleovertebrados da UFRGS e depositadas na FURB:
fragmentos vegetais similares a *Calamites* e *Pecopteris*, e
conchostráceos similares a *Cyzicus* e *Asmussia*. A ficha registra a
ressalva dos próprios autores — o material não preserva caracteres
diagnósticos suficientes para determinação genérica segura.

**Conchostráceos da Fm. Rio do Rasto** (4 registros): *Palaeolimnadiopsis
subalata*, *Falsisca brasiliensis*, *Monoleiolophus unicostatus* e
*Hemicycloleaia mitchelli*. *F. brasiliensis* foi descrita como espécie
nova por Ferreira-Oliveira & Rohn (2008) e marca a **primeira ocorrência
do gênero *Falsisca* no Gondwana** — até então restrito ao Permiano
Superior–Triássico Inferior da Europa e da Ásia. São os fósseis mais
abundantes da formação: 13 espécies em pelo menos 192 afloramentos.

***Paragiridia taioensis*** Boardman, Iannuzzi & Dutra, 2016
(Afloramento Bruno Peiker, Taió) — **gênero e espécie novos erigidos
sobre material catarinense**. Caso raro: a assembleia é monoespecífica
e autóctone, com as partes da planta ainda conectadas entre si e alguns
eixos em posição de vida, o que permitiu reconstruir a **planta
inteira**. Os autores a interpretam como linhagem descendente direta
das Archaeocalamitaceae carboníferas.

***Australoxylon duartei*** (lenho permineralizado), inventariado na
literatura, entra **com ressalva**: a fonte registra a ocorrência sem
detalhar localidade, tombo ou depositário.

**Registro removido.** cf. *Melosaurus* sp. foi incluído e, em seguida,
retirado a pedido do mantenedor. A verificação posterior sustenta a
remoção: os únicos temnospôndilos formalmente descritos para a Fm. Rio
do Rasto são *Australerpeton cosgriffi*, *Bageherpeton longignathus* e
*Parapytanga catarinensis*. *Melosaurus* aparece na literatura
brasileira apenas como táxon de COMPARAÇÃO com material russo — a
menção catarinense é citação frouxa, não ocorrência documentada.

## 2026.07.9 — 05/08/2026

### Coerência taxonômica das categorias
A navegação por grupo, criada na versão anterior, expôs uma
incoerência que a lista plana escondia: **"Metazoário" aparecia como
irmão de "Invertebrado" e "Vertebrado"** — mas Metazoa contém os dois.
Havia ainda uma categoria "Invertebrado / Vertebrado", que é mistura e
não classificação.

Os cinco registros afetados são os ediacaranos da Bacia do Itajaí
(*Parvancorina*, *Charniodiscus*, *Cyclomedusa*, *Chancelloria*,
*Aspidella*), cuja afinidade é **genuinamente incerta** na literatura —
a ressalva estava certa, faltava explicitá-la. Agora:

- "Metazoário" -> **"Metazoário de afinidade incerta"**
- "Invertebrado / Vertebrado" -> **"Assembleia fóssil (biota mista)"**

Na navegação, esses dois grupos vão por último, com borda tracejada e
marcador "?", e explicam no tooltip que não são categorias equivalentes
às demais. O dado não mudou — mudou o que ele afirma.

### Instituições (12 -> 17)
Cinco instituições citadas nos registros não constavam da aba:
**UERJ, Museu do Contestado (Três Barras), UNESP, UNICAMP e
UNIPAMPA**. Vieram das adições recentes (Turvo, mesossauros, Canoinhas,
*Parapytanga*) e a sincronização passou batida.

A ausência mais grave era a da UERJ, que guarda o holótipo UERJ-IC-170:
quem abria a ficha do registro 96, ia à aba procurar a instituição e
não encontrava nada.

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
