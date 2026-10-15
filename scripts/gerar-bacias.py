#!/usr/bin/env python3
"""Gera os contornos das bacias do mapa (DB_BACIAS em js/dados.js).

Entrada
  data/fonte-geometria/sgb_parana_paleozoico.json
      Polígonos do Mapa Geológico de SC 1:500.000 (SGB/CPRM, 2020) das unidades
      paleozoicas da Bacia do Paraná (Campo Mourão, Taciba/Itararé, Rio Bonito,
      Palermo/Guatá, Irati, Serra Alta, Teresina e Rio do Rasto/Passa Dois).
      Coordenadas em (lon, lat), graus decimais, WGS84.

Processo (Bacia do Paraná)
  1. une os anéis externos de todos os polígonos (shapely, make_valid + unary_union);
  2. fecha reentrâncias estreitas: buffer(+0,02°) seguido de buffer(−0,02°), ≈ 2 km;
  3. descarta partes < 0,005 grau² (≈ 60 km²) e preserva buracos ≥ 0,02 grau²;
  4. simplifica (Douglas-Peucker, 0,012° ≈ 1,3 km);
  5. converte para a projeção do mapa (a mesma da malha municipal e dos sítios).

Bacia do Itajaí e Plataforma/Planície Costeira
  Continuam com o contorno esquemático antigo (desenhado à mão): o mapa do SGB
  traz o Grupo Itajaí em centenas de fragmentos e o Quaternário em mais de 600
  polígonos, e ainda não foram obtidos com precisão. São marcados como
  contorno_tipo = "esquematico" e o mapa os desenha tracejados.

Uso:  python3 scripts/gerar-bacias.py          (reescreve DB_BACIAS em js/dados.js)
Depois: python3 scripts/exportar-dados.py && python3 scripts/validar.py
Requer: shapely
"""
import json
import re
import sys
from pathlib import Path

from shapely.geometry import MultiPolygon, Polygon
from shapely.ops import unary_union
from shapely.validation import make_valid

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / "data" / "fonte-geometria" / "sgb_parana_paleozoico.json"
DADOS = RAIZ / "js" / "dados.js"

# Parâmetros do tratamento (graus)
FECHAR = 0.02
BURACO_MIN = 0.02
PARTE_MIN = 0.005
SIMPLIFICAR = 0.012

# Projeção do mapa (igual à da malha municipal e dos sítios): x = A·lon + B ; y = C·lat + D
PX_A, PX_B = 114.2826, 6159.77
PX_C, PX_D = -211.117, -5467.5


def proj(lat, lon):
    return PX_A * lon + PX_B, PX_C * lat + PX_D


def path_svg(aneis_latlon):
    """Anéis [[lat, lon], ...] -> atributo d de <path> (um subcaminho por anel)."""
    partes = []
    for anel in aneis_latlon:
        pts = [proj(la, lo) for la, lo in anel]
        if pts[0] == pts[-1]:
            pts = pts[:-1]
        seg = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + "Z"
        partes.append(seg)
    return " ".join(partes)


def so_poligonos(g):
    """Extrai, recursivamente, só os polígonos de uma geometria (descarta linhas e pontos)."""
    if g.geom_type == "Polygon":
        return [g] if not g.is_empty else []
    if hasattr(g, "geoms"):
        return [p for sub in g.geoms for p in so_poligonos(sub)]
    return []


def contorno_parana():
    dados = json.loads(FONTE.read_text(encoding="utf-8"))
    geoms = []
    for p in dados["poligonos"]:
        # aneis[0] = anel externo; os demais (se houver) são buracos e não são usados
        geoms.extend(so_poligonos(make_valid(Polygon(p["aneis"][0]))))
    u = unary_union(geoms)
    c = u.buffer(FECHAR, join_style=1).buffer(-FECHAR, join_style=1)
    partes = []
    for pol in (c.geoms if hasattr(c, "geoms") else [c]):
        if pol.area < PARTE_MIN:
            continue
        buracos = [i for i in pol.interiors if Polygon(i).area >= BURACO_MIN]
        partes.append(Polygon(pol.exterior, buracos))
    g = MultiPolygon(partes) if len(partes) > 1 else partes[0]
    g = g.simplify(SIMPLIFICAR)
    aneis = []
    for pol in (g.geoms if hasattr(g, "geoms") else [g]):
        aneis.append([[round(y, 3), round(x, 3)] for x, y in pol.exterior.coords])
        for i in pol.interiors:
            aneis.append([[round(y, 3), round(x, 3)] for x, y in i.coords])
    return aneis, g.area


def ler_constante(texto, nome):
    m = re.search(rf"^const {nome} = (\[.*?\]);\n", texto, re.S | re.M)
    if not m:
        sys.exit(f"const {nome} não encontrada em dados.js")
    return m


def main():
    texto = DADOS.read_text(encoding="utf-8")
    m = ler_constante(texto, "DB_BACIAS")
    atuais = json.loads(m.group(1))

    def achar(prefixo):
        for b in atuais:
            if b["nome"].startswith(prefixo):
                return b
        sys.exit(f"bacia '{prefixo}' não encontrada em DB_BACIAS")

    ref_parana = achar("Bacia do Paraná")
    ref_itajai = achar("Bacia do Itajaí")
    ref_plan = achar("Plataforma Continental")

    def aneis_de(b):
        # esquema novo: 'aneis'; esquema antigo: 'coords' (um anel [lat, lon])
        if "aneis" in b:
            return b["aneis"]
        return [b["coords"]]

    aneis_pr, area_pr = contorno_parana()

    novo = []
    novo.append({
        "nome": "Bacia do Paraná — Grupos Itararé, Guatá e Passa Dois (Carbonífero–Permiano)",
        "cor": ref_parana["cor"],
        "descricao": ref_parana["descricao"],
        "contorno_tipo": "sgb",
        "contorno": (
            "Contorno derivado do Mapa Geológico de Santa Catarina 1:500.000 (SGB/CPRM, 2020): "
            "união dos afloramentos das formações Campo Mourão, Taciba (Gr. Itararé), Rio Bonito e "
            "Palermo (Gr. Guatá), Irati, Serra Alta, Teresina e Rio do Rasto (Gr. Passa Dois), "
            "generalizada (fragmentos menores que ≈ 60 km² omitidos e reentrâncias de até ≈ 2 km "
            "fechadas). Não é o limite formal da bacia e não inclui a Fm. Botucatu nem o Gr. Serra Geral."
        ),
        "aneis": aneis_pr,
        "svg_path": path_svg(aneis_pr),
    })
    for ref in (ref_itajai, ref_plan):
        aneis = aneis_de(ref)
        novo.append({
            "nome": ref["nome"],
            "cor": ref["cor"],
            "descricao": ref["descricao"],
            "contorno_tipo": "esquematico",
            "contorno": (
                "Contorno esquemático, desenhado à mão e sem base cartográfica (provisório): "
                "indica a região, não o limite da unidade."
            ),
            "aneis": aneis,
            "svg_path": path_svg(aneis),
        })

    nova_const = "const DB_BACIAS = " + json.dumps(novo, ensure_ascii=False, separators=(", ", ": ")) + ";\n"
    texto2 = texto[: m.start()] + nova_const + texto[m.end():]
    DADOS.write_text(texto2, encoding="utf-8")

    nv = sum(len(a) for a in aneis_pr)
    print(f"Paraná: {len(aneis_pr)} anel(éis), {nv} vértices, área {area_pr:.3f} grau² (≈ {area_pr * 111.0 * 111.0 * 0.885:,.0f} km²)")
    print("Itajaí e Planície: esquemáticos (mantidos)")


if __name__ == "__main__":
    main()
