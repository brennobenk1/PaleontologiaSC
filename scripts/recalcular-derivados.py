#!/usr/bin/env python3
"""
recalcular-derivados.py — recalcula, a partir de DB_FOSSEIS, os campos que
são CÓPIAS dos registros:

  DB_SITIOS:   count, periodos, taxons_amostra
  DB_PERIODOS: total_registros, taxons

POR QUE EXISTE
Esses campos eram mantidos à mão e foram ficando para trás: em 2026.09 a
aba Períodos listava 18 dos 90 táxons do Permiano Inferior, apontava para
um registro já removido, e o painel do Bainha no mapa exibia nomes de
táxons anteriores às correções de nomenclatura — o botão "explorar"
levava a um catálogo vazio. Rode este script sempre que alterar registros;
validar.py reprova se as cópias divergirem.

Uso:  python3 scripts/recalcular-derivados.py
"""
import json, re, pathlib
from collections import defaultdict

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ARQ = RAIZ / "js" / "dados.js"
AMOSTRA = 6


def ler(c, nome):
    m = re.search(r"^const %s = (\[.*?\]);\n" % nome, c, re.S | re.M)
    return json.loads(m.group(1)), m


def gravar(c, nome, valor):
    m = re.search(r"^const %s = (\[.*?\]);\n" % nome, c, re.S | re.M)
    return c[:m.start(1)] + json.dumps(valor, ensure_ascii=False, separators=(", ", ": ")) + c[m.end(1):]


def recalcular(c):
    fos, _ = ler(c, "DB_FOSSEIS")
    sit, _ = ler(c, "DB_SITIOS")
    per, _ = ler(c, "DB_PERIODOS")
    ordem = {p["nome"]: p["ordem"] for p in per}
    fos = sorted(fos, key=lambda d: d["id"])

    por_sitio = defaultdict(list)
    for d in fos:
        por_sitio[d["site"]].append(d)
    for s in sit:
        regs = por_sitio.get(s["site"], [])
        s["count"] = len(regs)
        s["periodos"] = sorted({d["periodo"] for d in regs}, key=lambda n: ordem.get(n, 99))
        amostra = []
        for d in regs:
            if d["taxon"] not in amostra:
                amostra.append(d["taxon"])
        s["taxons_amostra"] = amostra[:AMOSTRA]

    por_periodo = defaultdict(list)
    for d in fos:
        por_periodo[d["periodo"]].append(d)
    for p in per:
        regs = por_periodo.get(p["nome"], [])
        p["total_registros"] = len(regs)
        grupos = {}
        for d in regs:
            g = grupos.setdefault(d["taxon"], {"taxon": d["taxon"], "count": 0, "ids": []})
            g["count"] += 1
            g["ids"].append(d["id"])
        p["taxons"] = list(grupos.values())

    c = gravar(c, "DB_SITIOS", sit)
    c = gravar(c, "DB_PERIODOS", per)
    return c


if __name__ == "__main__":
    antes = ARQ.read_text(encoding="utf-8")
    depois = recalcular(antes)
    ARQ.write_text(depois, encoding="utf-8")
    print("campos derivados recalculados" if depois != antes else "nada a recalcular")
