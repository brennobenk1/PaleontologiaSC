# [Paleo-SC — Banco de Dados Paleontológico de Santa Catarina](https://brennobenk1.github.io/PaleontologiaSC/)

Site de consulta e pesquisa paleontológica para o estado de Santa Catarina (Brasil),
construído a partir da planilha `fosseis_santa_catarina_enriquecido.xlsx`.

## Como abrir

Abra `index.html` em um navegador. Como o site carrega dados via `fetch()` de arquivos
JSON, ele precisa ser servido por um servidor HTTP (não funciona com duplo-clique
direto no arquivo, por restrição de segurança do navegador para `file://`).

Forma mais simples, com Python já instalado:

```bash
cd pasta-do-site
python3 -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador.

Qualquer outro servidor estático (Live Server do VS Code, `npx serve`, Nginx, Apache,
GitHub Pages, Netlify, Vercel etc.) também funciona — é um site 100% estático.

## Estrutura de arquivos

```
index.html              página única (SPA) com todas as abas
css/style.css            todo o estilo visual
js/
  data-loader.js          carrega os JSON e expõe o objeto global DB
  app.js                  navegação entre abas, estatísticas da home
  catalogo.js             busca, filtros, cartões/tabela e ficha (modal)
  mapa.js                 mapa interativo (Leaflet) com sítios e bacias
  periodos.js             accordion de períodos geológicos
  instituicoes.js         cartões de instituições com contato
data/
  fosseis.json            catálogo completo — gerado da planilha
  periodos.json           agrupamento por período — gerado da planilha
  sitios_mapa.json         agrupamento por sítio de coleta — gerado da planilha
  instituicoes.json        dados de contato das instituições — mantido manualmente
  bacias.json              polígonos das bacias geológicas — mantido manualmente
vendor/leaflet/          biblioteca Leaflet (mapa), incluída localmente
img/logo.png             logo do projeto
gerar_dados.py           script para regenerar data/*.json a partir do .xlsx
```

## Como atualizar o banco de dados

Sempre que a planilha for atualizada (novos registros, correções etc.), regenere os
arquivos de dados com:

```bash
python3 gerar_dados.py caminho/para/fosseis_santa_catarina_enriquecido.xlsx
```

Isso reescreve `data/fosseis.json`, `data/periodos.json` e `data/sitios_mapa.json`.
O site lê esses arquivos diretamente — não há necessidade de tocar no HTML/CSS/JS.

**Atenção:** se a planilha tiver uma nova localidade de coleta que ainda não existe no
mapa de coordenadas, o script avisa no terminal quais precisam ser cadastradas (latitude,
longitude e bacia) no dicionário `SITE_MAP`, no topo do `gerar_dados.py`.

Os arquivos `data/instituicoes.json` (contatos) e `data/bacias.json` (polígonos das
bacias no mapa) não vêm da planilha — são mantidos manualmente, editando o JSON
diretamente.

## Abas do site

- **Início** — visão geral, estatísticas e cobertura por era geológica.
- **Catálogo** — busca e filtros (período, categoria, município, instituição de guarda),
  com visão em cartões ou tabela. Clique em um registro para abrir a ficha completa
  com referências e links de verificação.
- **Mapa** — mapa interativo (Leaflet/OpenStreetMap) com os sítios de coleta
  (tamanho do círculo = número de registros) e a extensão aproximada das bacias
  geológicas fossilíferas.
- **Períodos Geológicos** — linha do tempo do Ediacarano ao Quaternário; cada período
  abre e mostra os táxons documentados.
- **Instituições** — universidades, museus e centros de pesquisa citados no banco,
  com endereço, e-mail, site e responsável pela gestão.
- **Sobre & Fontes** — metodologia, glossário de campos e limitações do banco.

## Notas

- O mapa usa o serviço público de tiles do OpenStreetMap; é necessário acesso à
  internet para que o fundo do mapa carregue (os pontos e polígonos funcionam mesmo
  sem isso, mas sem o mapa-base visível).
- O site não depende de nenhum serviço externo além do OpenStreetMap — fontes,
  Leaflet e demais recursos estão incluídos localmente na pasta `vendor/`.
