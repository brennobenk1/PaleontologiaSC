# Changelog — Paleo-SC

Registro datado das mudanças no banco. Para um banco de consulta
científica isso importa: quem citou o site em determinada data precisa
saber o que havia nele naquele momento.

Formato: as versões seguem `ANO.MÊS.N`.

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
