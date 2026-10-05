#!/usr/bin/env python3
"""
validar.py — verificações de integridade do Paleo-SC

POR QUE EXISTE
--------------
Estas checagens vinham sendo rodadas à mão a cada alteração. Isso não
escala e não sobrevive a quem fez. Aqui elas viram parte do repositório:
qualquer um roda antes de um commit, e o GitHub Action roda sozinho.

Cada teste abaixo nasceu de um erro REAL já encontrado no banco:
  - coordenadas fora de SC        -> escopo do projeto é só Santa Catarina
  - formação x bacia contraditória -> 9 registros diziam "Fm. Rio do Rasto"
                                      (Grupo Passa Dois) e "Grupo Itararé"
  - mapa fora de sincronia         -> a soma dos sítios tem de bater
  - contagem por período           -> DB_PERIODOS guarda totais duplicados
  - data/ desatualizado            -> já divergiu em 61 registros

Uso:
    python3 scripts/validar.py          # falha com código 1 se algo quebrar
    python3 scripts/validar.py -v       # mostra também o que passou
"""
import json, re, sys, pathlib
from collections import Counter

RAIZ = pathlib.Path(__file__).resolve().parent.parent
VERBOSO = "-v" in sys.argv
falhas, avisos = [], []

def carregar(nome):
    texto = (RAIZ / "js" / "dados.js").read_text(encoding="utf-8")
    m = re.search(r"^const %s = (.*?);\n" % nome, texto, re.S | re.M)
    if not m:
        falhas.append(f"constante {nome} não encontrada em js/dados.js")
        return []
    return json.loads(m.group(1))

def checar(ok, titulo, detalhe=""):
    if ok:
        if VERBOSO: print(f"  ok    {titulo}")
    else:
        print(f"  FALHA {titulo}" + (f"\n        {detalhe}" if detalhe else ""))
        falhas.append(titulo)

def alertar(ok, titulo, detalhe=""):
    if not ok:
        print(f"  aviso {titulo}" + (f"\n        {detalhe}" if detalhe else ""))
        avisos.append(titulo)
    elif VERBOSO:
        print(f"  ok    {titulo}")

FOSSEIS   = carregar("DB_FOSSEIS")
SITIOS    = carregar("DB_SITIOS")
PERIODOS  = carregar("DB_PERIODOS")
AVIFAUNA  = carregar("DB_AVIFAUNA")

print(f"Paleo-SC — validação  ({len(FOSSEIS)} registros, {len(SITIOS)} sítios)\n")

# --- 1. escopo geográfico: o catálogo é EXCLUSIVAMENTE de Santa Catarina ---
LAT_N, LAT_S, LON_O, LON_L = -25.95, -29.40, -53.85, -48.30
fora = [d["id"] for d in FOSSEIS
        if not (LAT_S <= d.get("lat", 0) <= LAT_N and LON_O <= d.get("lon", 0) <= LON_L)]
checar(not fora, "todas as coordenadas dentro de Santa Catarina",
       f"registros fora: {fora}")

# --- 2. coerência estratigráfica entre os campos formacao e bacia ---
def grupo_por_formacao(f):
    if "Botucatu" in f: return "São Bento"
    if any(k in f for k in ("Rio do Rasto", "Passa Dois", "Pirambóia", "Irati")): return "Passa Dois"
    if any(k in f for k in ("Rio Bonito", "Guatá", "Irapuá")): return "Guatá"
    if any(k in f for k in ("Itararé", "Lontras", "Rio do Sul", "Campo Mourão")): return "Itararé"
    if any(k in f for k in ("Itajaí", "Campo Alegre")): return "Itajaí"
    if "Laguna-Barreira" in f: return "Costeiro"

def grupo_por_bacia(b):
    if "Botucatu" in b: return "São Bento"
    if any(k in b for k in ("Rio do Rasto", "Passa Dois", "Irati")): return "Passa Dois"
    if any(k in b for k in ("Rio Bonito", "Guatá")): return "Guatá"
    if "Itararé" in b: return "Itararé"
    if "Itajaí" in b: return "Itajaí"
    if any(k in b for k in ("Laguna-Barreira", "Plataforma")): return "Costeiro"
    if any(k in b for k in ("Quaternári", "Costeira")): return "Quaternário"

contradicoes = []
for d in FOSSEIS:
    gf, gb = grupo_por_formacao(d.get("formacao", "")), grupo_por_bacia(d.get("bacia", ""))
    if gf and gb and gf != gb:
        contradicoes.append(f"id {d['id']}: formação diz '{gf}', bacia diz '{gb}'")
checar(not contradicoes, "formação e bacia coerentes", "\n        ".join(contradicoes))

# --- 3. o mapa e o catálogo têm de contar a mesma história ---
por_site = Counter(d["site"] for d in FOSSEIS)
no_mapa = {s["site"]: s["count"] for s in SITIOS}
div = [f"{s}: catálogo={por_site[s]} mapa={no_mapa.get(s, 'ausente')}"
       for s in por_site if no_mapa.get(s) != por_site[s]]
div += [f"{s}: no mapa mas sem registros" for s in no_mapa if s not in por_site]
checar(not div, f"mapa e catálogo batem (soma {sum(no_mapa.values())})", "\n        ".join(div))

# --- 4. totais por período (DB_PERIODOS guarda a contagem duplicada) ---
por_periodo = Counter(d["periodo"] for d in FOSSEIS)
declarado = {p["nome"]: p["total_registros"] for p in PERIODOS}
pdiv = [f"{k}: real={por_periodo[k]} declarado={declarado.get(k, 'ausente')}"
        for k in por_periodo if declarado.get(k) != por_periodo[k]]
checar(not pdiv, "contagem por período confere", "\n        ".join(pdiv))

# --- 5. chaves e unicidade ---
ids = [d["id"] for d in FOSSEIS]
dups = [i for i, n in Counter(ids).items() if n > 1]
checar(not dups, "ids únicos", f"duplicados: {dups}")
tx = [t for t, n in Counter(d["taxon"] for d in FOSSEIS).items() if n > 1]
checar(not tx, "táxons não duplicados", f"repetidos: {tx}")

# --- 6. campos obrigatórios ---
OBRIGATORIOS = ["id", "taxon", "categoria", "periodo", "formacao", "municipio", "site", "fontes"]
faltando = [f"id {d.get('id','?')}: sem {c}" for d in FOSSEIS for c in OBRIGATORIOS if not d.get(c)]
checar(not faltando, "campos obrigatórios preenchidos", "\n        ".join(faltando[:10]))

# --- 7. todo período usado precisa de cor (a faixa do cartão depende disso) ---
sem_cor = [k for k in por_periodo if not any(p["nome"] == k and p.get("cor") for p in PERIODOS)]
checar(not sem_cor, "todo período tem cor definida", f"sem cor: {sem_cor}")

# --- 8. data/ em dia com a fonte única ---
try:
    sys.path.insert(0, str(RAIZ / "scripts"))
    import subprocess
    r = subprocess.run([sys.executable, str(RAIZ / "scripts" / "exportar-dados.py"), "--check"],
                       capture_output=True, text=True)
    checar(r.returncode == 0, "data/*.json em dia com js/dados.js", r.stdout.strip())
except Exception as e:
    alertar(False, "não foi possível checar data/", str(e))

# --- 9. a planilha também é artefato gerado; precisa estar em dia ---
try:
    import openpyxl
    xlsx = RAIZ / "fosseis_santa_catarina_enriquecido.xlsx"
    if xlsx.exists():
        ws = openpyxl.load_workbook(xlsx, read_only=True)["Catálogo de Fósseis SC"]
        na_planilha = ws.max_row - 3
        checar(na_planilha == len(FOSSEIS),
               f"planilha .xlsx em dia ({na_planilha} linhas)",
               f"banco tem {len(FOSSEIS)} registros; rode: python3 scripts/exportar-planilha.py")
    else:
        alertar(False, "planilha .xlsx ausente")
except ImportError:
    alertar(False, "openpyxl indisponível — planilha não verificada")

# --- 10. toda ocorrência precisa declarar a natureza da sua fonte ---
sem_tipo = [d["id"] for d in FOSSEIS if not d.get("tipo_fonte")]
checar(not sem_tipo, "natureza da fonte declarada em todos os registros",
       f"sem tipo_fonte: {sem_tipo[:10]}")

from collections import Counter as _C
_tipos = _C(d.get("tipo_fonte", "?") for d in FOSSEIS)
if VERBOSO:
    print("        composição das fontes:")
    for t, n in _tipos.most_common():
        print(f"          {n:4d}  {t}")

# --- 11. toda variável CSS usada precisa estar definida ---
# Motivo: --texto-suave foi usado 17 vezes e nunca definido. O navegador
# não acusa erro — cai no valor herdado —, então o defeito passou várias
# versões invisível, apagando a hierarquia entre texto principal e secundário.
css = (RAIZ / "css" / "style.css").read_text(encoding="utf-8")
usadas = set(re.findall(r"var\((--[\w-]+)", css))
definidas = set(re.findall(r"(--[\w-]+)\s*:", css))
# variáveis também podem ser definidas inline pelo JS (ex.: style="--per-cor:..."
# em cada cartão do catálogo) — essas são legítimas
js = (RAIZ / "js" / "app.js").read_text(encoding="utf-8")
definidas |= set(re.findall(r"(--[\w-]+)\s*:", js))
indefinidas = sorted(usadas - definidas)
checar(not indefinidas, f"variáveis CSS definidas ({len(usadas)} usadas)",
       f"usadas mas nunca definidas: {indefinidas}")

# --- 12. o grande grupo da categoria precisa ser um dos reconhecidos ---
# Motivo: um registro entrou como "Icnofóssil / Porifera — ..." e criou,
# sozinho, um grupo novo na navegação taxonômica. Vocabulário controlado
# evita que cada adição invente uma categoria.
GRUPOS_VALIDOS = {"Flora", "Invertebrado", "Vertebrado", "Icnofóssil", "Microfóssil",
                  "Metazoário de afinidade incerta", "Assembleia fóssil (biota mista)"}
fora_vocab = sorted({(d["id"], d["categoria"].split("—")[0].strip()) for d in FOSSEIS
                     if d["categoria"].split("—")[0].strip() not in GRUPOS_VALIDOS})
checar(not fora_vocab, "categorias dentro do vocabulário controlado",
       f"grupos não reconhecidos: {fora_vocab[:8]}")

# --- 13. número de tombo: nada de marcador que imite número real ---
# Motivo: 16 registros traziam "CENPALEO-MP-[múltiplos]" e afins, que parecem
# números de tombo mas não são — e chegaram a inflar uma estatística (25 em
# vez de 9 registros com número real de espécime).
falsos = [d["id"] for d in FOSSEIS if re.search(r"\[[^\]]*\]", d.get("numero_catalogo", ""))]
checar(not falsos, "número de tombo sem marcadores falsos", f"marcadores entre colchetes: {falsos[:10]}")

# --- 14. campos derivados (sítios e períodos) em dia com os registros ---
# Motivo: eram mantidos à mão e ficaram defasados — a aba Períodos listava
# 18 de 90 táxons e o painel do mapa exibia nomes antigos.
import importlib.util as _ilu
_sp = _ilu.spec_from_file_location("rd", RAIZ / "scripts" / "recalcular-derivados.py")
_rd = _ilu.module_from_spec(_sp); _sp.loader.exec_module(_rd)
_txt = (RAIZ / "js" / "dados.js").read_text(encoding="utf-8")
checar(_rd.recalcular(_txt) == _txt, "campos derivados de sítios e períodos em dia",
       "rode: python3 scripts/recalcular-derivados.py")

# --- 15. subcategorias sem sinônimos duplicados ---
# Motivo: conviviam "semente"/"sementes", "conodonto"/"conodonte", três
# variações de "esponja"... cada uma virava um item separado na navegação.
import unicodedata as _ud
from collections import defaultdict as _dd
def _norm(s):
    s = re.sub(r"\(.*?\)", "", s).strip().lower()
    s = "".join(ch for ch in _ud.normalize("NFD", s) if _ud.category(ch) != "Mn")
    s = re.sub(r"s$", "", s)
    return re.sub(r"[aeo]$", "", s)
_grupos = _dd(lambda: _dd(set))
for d in FOSSEIS:
    g, _, sub = d["categoria"].partition("—")
    sub = re.sub(r"\s*\(.*?\)", "", sub).strip()
    _grupos[g.strip()][_norm(sub)].add(sub)
_dups = [sorted(v) for g in _grupos.values() for v in g.values() if len(v) > 1]
checar(not _dups, "subcategorias sem sinônimos duplicados", f"variações do mesmo termo: {_dups}")

# --- avisos: não quebram o build, mas mostram dívida acumulada ---
links = [u for d in FOSSEIS for u in d.get("fontes", [])]
frageis = [u for u in links if re.search(r"researchgate|academia\.edu|wikipedia", u)]
alertar(len(frageis) / max(len(links), 1) < 0.25,
        f"fontes frágeis: {len(frageis)}/{len(links)} ({len(frageis)*100//max(len(links),1)}%)",
        "ResearchGate/Academia/Wikipédia quebram; prefira DOI ou repositório institucional")
com_doi = sum(1 for d in FOSSEIS if d.get("doi"))
alertar(com_doi / max(len(FOSSEIS), 1) > 0.5,
        f"registros com DOI: {com_doi}/{len(FOSSEIS)}",
        "DOI é o identificador que não apodrece")

print()
if falhas:
    print(f"REPROVADO — {len(falhas)} falha(s), {len(avisos)} aviso(s)")
    sys.exit(1)
print(f"APROVADO — {len(avisos)} aviso(s), nenhuma falha")
