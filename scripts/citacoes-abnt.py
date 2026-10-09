#!/usr/bin/env python3
"""
citacoes-abnt.py — mantém o campo `citacao_abnt` coerente com o `descritor`.

POR QUE EXISTE
--------------
O site mostra o `descritor` (a referência de cada registro), mas a planilha
.xlsx e data/fosseis.json exportam também `citacao_abnt`. Em 2026.09 uma
auditoria achou 37 de 99 registros cuja citação ABNT era de OUTRO trabalho
(ex.: o registro das larvas de tricóptero levava a citação de uma barata
fóssil; o registro 40 misturava três fontes). Como ninguém vê esse campo no
site, o erro passou despercebido.

REGRA: o par (sobrenome do 1º autor, ano) da citação ABNT precisa existir
entre as obras do descritor. Citações que passam nessa regra são mantidas
(podem trazer notas manuais); as que não passam são REGERADAS a partir do
descritor. Obras sem formato bibliográfico (reportagem, nota) são copiadas
tal como estão, marcadas como tal — nunca completadas por suposição.

Uso:
    python3 scripts/citacoes-abnt.py --check     # só lista as incoerentes
    python3 scripts/citacoes-abnt.py             # regera as incoerentes
    python3 scripts/citacoes-abnt.py --tudo      # regera todas
"""
import json, re, sys, pathlib, unicodedata

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ARQ = RAIZ / "js" / "dados.js"
# Citações de mídia: cada obra do descritor que começa com este prefixo é reportagem ou
# divulgação institucional, não publicação científica. O registro que a usa leva
# tipo_fonte = "Citação de mídia" (validar.py confere os dois lados).
PREF_MIDIA = "Citação de mídia"


def semacento(s):
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower().strip()


def partes(desc, tipo=None):
    """Mesma regra de partesDaReferencia() do app.js."""
    out = []
    for b in [s.strip() for s in re.split(r";\s+", desc) if s.strip()]:
        if out and re.match(r"^[a-zà-ú(]", b):
            out[-1] += "; " + b
        else:
            out.append(b)
    return out


def partes_abnt(desc):
    """Como partes(), mas sempre divide em obras (inclusive em registros de divulgação)."""
    return partes(desc, None)


ESTRUT = re.compile(r"^(?P<aut>.+?)\s\((?P<ano>[^)]*\d{4}[^)]*)\)(?P<resto>.*)$", re.S)
PAR_AUT = re.compile(r"([^,&]+?),\s*((?:[A-ZÀ-Ú]\.\s?-?)+)(?=\s*(?:,|&|$))")


def parece_autoria(txt):
    """Autoria: tem 'SOBRENOME, I.' ou 'et al.' ou poucos nomes próprios curtos; título tem palavras minúsculas longas."""
    t = txt.strip()
    if re.match(r"^(Divulga|Identifica|Citad|Ocorr)", t):
        return False
    if PAR_AUT.search(t) or re.search(r"\bet al\.?$", t):
        return True
    palavras = re.findall(r"[A-Za-zÀ-ú]+", t)
    miudas = {"da", "de", "do", "dos", "das", "e", "y", "van", "von", "der", "del", "la"}
    return 0 < len(palavras) <= 8 and all(w[0].isupper() or w.lower() in miudas for w in palavras)


def autores(texto):
    """Devolve ([(SOBRENOME, iniciais)...], et_al)."""
    t = texto.strip().rstrip(",")
    et_al = bool(re.search(r"\bet al\.?$", t))
    t = re.sub(r"\s*,?\s*\bet al\.?$", "", t).strip()
    pares = [(s.strip(), i.strip()) for s, i in PAR_AUT.findall(t)]
    if not pares:  # só sobrenomes (ex.: "Weinschütz et al.", "Nizer & Weinschütz")
        pares = [(s.strip(), "") for s in re.split(r"\s*&\s*|\s+e\s+", t) if s.strip()]
    return pares, et_al


def fmt_autores(texto):
    pares, et_al = autores(texto)
    if len(pares) > 3:
        pares, et_al = pares[:3], True
    s = "; ".join((f"{n.upper()}, {i}" if i else n.upper()) for n, i in pares)
    return s + (" et al." if et_al else "")


def fmt_resto(resto):
    """', Periódico 12(3):45–67, DOI x'  ->  'Periódico, 12(3), 45–67. DOI: x'"""
    r = resto.strip().lstrip(",").strip()
    if not r:
        return ""
    doi = ""
    m = re.search(r",?\s*DOI\s+(\S+?)[.,]?(\s|$)", r)
    if m:
        doi = m.group(1)
        r = (r[:m.start()] + r[m.end():]).strip().rstrip(",")
    m = re.match(r"^(?P<v>.+?)\s+(?P<vol>\d+(?:\([^)]*\))?(?:/\d+)?):(?P<p>[\w.\-–/]+)(?P<cola>.*)$", r)
    if m:
        r = f"{m.group('v')}, {m.group('vol')}, {m.group('p')}{m.group('cola')}"
    r = r.rstrip(".")
    return r + "." + (f" DOI: {doi}" if doi else "")


def eh_midia(parte):
    return parte.lstrip().startswith(PREF_MIDIA)


def gerar_parte(parte):
    if eh_midia(parte):
        resto = re.sub(r"^" + PREF_MIDIA + r"\s*[—–-]\s*", "", parte.strip())
        return f"[Citação de mídia, sem publicação científica primária identificada: {resto}]"
    m = ESTRUT.match(parte)
    if not m or not parece_autoria(m.group("aut")):
        return f"[referência sem formato bibliográfico, transcrita do descritor: {parte}]"
    ano = m.group("ano").strip()
    resto = m.group("resto").strip()
    titulo = ""
    mt = re.match(r'^[—–,-]\s*"(?P<t>[^"]+)"(?P<r>.*)$', resto, re.S)
    if mt:
        titulo, resto = mt.group("t").strip(), mt.group("r")
    elif resto.startswith(("—", "–")):
        livre = resto.lstrip("—– ").strip()  # descrição livre, sem título entre aspas
        titulo, resto = (livre[:1].upper() + livre[1:]), ""
    elif resto.startswith(("[", ",")):
        pass
    aut = fmt_autores(m.group("aut"))
    out = f"{aut} {ano}."
    if titulo:
        out += " " + (titulo if titulo.rstrip().endswith(("?", "!", ".")) else titulo + ".")
    r = fmt_resto(resto) if not resto.strip().startswith("[") else resto.strip()
    if r:
        out += " " + r
    return out


def obras_do_descritor(f):
    """Conjunto de (sobrenome, ano) das obras estruturadas do descritor."""
    s = set()
    for p in partes_abnt(f["descritor"]):
        if eh_midia(p):
            continue
        m = ESTRUT.match(p)
        if not m or not parece_autoria(m.group("aut")):
            continue
        pares, _ = autores(m.group("aut"))
        sob = semacento(pares[0][0])
        for a in re.findall(r"\b(1[89]\d\d|20\d\d)[a-z]?\b", m.group("ano")):
            s.add((sob, a))
    return s


def coerente(f):
    """True se a citação ABNT existente corresponde a alguma obra do descritor."""
    c = f.get("citacao_abnt") or ""
    obras = obras_do_descritor(f)
    if not obras:
        return bool(c)
    # a conferência vale para a 1ª obra com formato bibliográfico (as de mídia e as
    # transcritas entre colchetes não têm autor/ano para conferir)
    estruturadas = [p for p in c.split(" | ") if not p.startswith("[")]
    if not estruturadas:
        return False
    primeiro = estruturadas[0]
    m = re.match(r"\s*([^\d,;.]+?)(?:\s+et al)?\s*[,;.\d]", primeiro)
    ano = re.search(r"\b(1[89]\d\d|20\d\d)[a-z]?\b", primeiro)
    if not m or not ano:
        return False
    sob = semacento(m.group(1))
    ano = re.match(r"\d{4}", ano.group(0)).group(0)
    if (sob, ano) not in obras:
        return False
    # se a obra correspondente do descritor tem título entre aspas, ele tem de estar na citação
    for parte in partes_abnt(f["descritor"]):
        if eh_midia(parte):
            continue
        mp = ESTRUT.match(parte)
        if not mp or not parece_autoria(mp.group("aut")):
            continue
        pares, _ = autores(mp.group("aut"))
        if semacento(pares[0][0]) != sob or ano not in re.findall(r"\b(1[89]\d\d|20\d\d)", mp.group("ano")):
            continue
        mt = re.search(r'"([^"]{20,})"', parte)
        if mt:
            chave = re.sub(r"[^a-z0-9]", "", semacento(mt.group(1)))[:30]
            if chave not in re.sub(r"[^a-z0-9]", "", semacento(primeiro)):
                return False
        break
    return True


def regerar(f):
    return " | ".join(gerar_parte(p) for p in partes_abnt(f["descritor"]))


def ler_fosseis():
    c = ARQ.read_text(encoding="utf-8")
    m = re.search(r"^const DB_FOSSEIS = (\[.*?\]);\n", c, re.S | re.M)
    return c, m, json.loads(m.group(1))


if __name__ == "__main__":
    c, m, F = ler_fosseis()
    tudo = "--tudo" in sys.argv
    incoerentes = [f for f in F if f.get("citacao_abnt") and not coerente(f)]
    faltam = [f for f in F if not f.get("citacao_abnt")]
    if "--check" in sys.argv:
        print(f"{len(incoerentes)} registro(s) com citacao_abnt incoerente com o descritor; {len(faltam)} sem citacao_abnt")
        for f in incoerentes:
            print("  ", f["id"], f["taxon"][:50])
        sys.exit(1 if incoerentes or faltam else 0)
    alvo = ([f for f in F if not (not obras_do_descritor(f) and f.get("citacao_abnt"))]
            if tudo else incoerentes + faltam)
    for f in alvo:
        f["citacao_abnt"] = regerar(f)
    novo = c[:m.start(1)] + json.dumps(F, ensure_ascii=False, separators=(", ", ": ")) + c[m.end(1):]
    ARQ.write_text(novo, encoding="utf-8")
    print(f"citacao_abnt regerada em {len(alvo)} registro(s) ({len(incoerentes)} incoerentes, {len(faltam)} que não tinham)")
