#!/usr/bin/env python3
"""
exportar-dados.py — regenera data/*.json a partir de js/dados.js

POR QUE ESTE SCRIPT EXISTE
--------------------------
Antes, data/*.json e os dados embutidos no app.js eram duas fontes
independentes, e divergiram: os JSON pararam em 97 registros enquanto
o site já mostrava 158. Quem abrisse a pasta data/ pegava dados velhos
sem perceber.

Agora js/dados.js é a ÚNICA fonte de verdade, e data/*.json são
artefatos GERADOS por este script — úteis para quem quiser reusar o
banco em outra ferramenta, mas nunca editados à mão.

Uso:
    python3 scripts/exportar-dados.py           # gera data/
    python3 scripts/exportar-dados.py --check   # só verifica se está em dia
"""
import json, re, sys, pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
FONTE = RAIZ / "js" / "dados.js"
DESTINO = RAIZ / "data"

# nome da constante em dados.js -> arquivo em data/
TABELAS = {
    "DB_FOSSEIS": "fosseis.json",
    "DB_PERIODOS": "periodos.json",
    "DB_INSTITUICOES": "instituicoes.json",
    "DB_SITIOS": "sitios_mapa.json",
    "DB_BACIAS": "bacias.json",
    "DB_AVIFAUNA": "avifauna.json",
    "DB_COBERTURA_ESTADOS": "avifauna_cobertura_estados.json",
    "DB_RESUMO_AVIFAUNA": "avifauna_resumo.json",
}

def extrair(texto, const):
    """Lê `const NOME = <json>;` de dados.js."""
    m = re.search(r"^const %s = (.*?);\n" % const, texto, re.S | re.M)
    if not m:
        raise SystemExit(f"ERRO: constante {const} não encontrada em {FONTE}")
    return json.loads(m.group(1))

def main():
    checar = "--check" in sys.argv
    texto = FONTE.read_text(encoding="utf-8")
    DESTINO.mkdir(exist_ok=True)

    divergentes, total = [], {}
    for const, arquivo in TABELAS.items():
        dados = extrair(texto, const)
        total[arquivo] = len(dados) if isinstance(dados, list) else 1
        novo = json.dumps(dados, ensure_ascii=False, indent=2) + "\n"
        caminho = DESTINO / arquivo

        if checar:
            antigo = caminho.read_text(encoding="utf-8") if caminho.exists() else ""
            if antigo != novo:
                divergentes.append(arquivo)
        else:
            caminho.write_text(novo, encoding="utf-8")

    if checar:
        if divergentes:
            print("DESATUALIZADO — rode: python3 scripts/exportar-dados.py")
            for a in divergentes:
                print("  ", a)
            sys.exit(1)
        print("data/ está em dia com js/dados.js")
        return

    print(f"Gerado a partir de {FONTE.name}:")
    for arquivo, n in total.items():
        print(f"  data/{arquivo:38s} {n:4d} registro(s)")

if __name__ == "__main__":
    main()
