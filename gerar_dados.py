#!/usr/bin/env python3
"""
gerar_dados.py
================
Regenera os arquivos JSON em data/ a partir da planilha
"fosseis_santa_catarina_enriquecido.xlsx".

Uso:
    python3 gerar_dados.py caminho/para/planilha.xlsx

Isso atualiza automaticamente:
    data/fosseis.json        — catálogo completo de registros
    data/periodos.json       — agrupamento por período geológico
    data/sitios_mapa.json    — agrupamento por sítio de coleta (para o mapa)

O arquivo data/instituicoes.json e data/bacias.json são mantidos
manualmente, pois contêm informações de contato e polígonos
geográficos que não vêm diretamente da planilha.

Se a planilha ganhar novos municípios/locais de coleta que não
estejam no dicionário SITE_MAP abaixo, o script avisa quais
precisam ser adicionados manualmente (com coordenadas lat/lon).
"""

import sys
import re
import json
from collections import defaultdict
from pathlib import Path

import pandas as pd

# ---------------------------------------------------------------
# Mapa de localidades de coleta -> coordenadas geográficas e bacia.
# Atualize aqui se novos locais aparecerem na planilha.
# ---------------------------------------------------------------
SITE_MAP = {
    'Afloramento Campáleo, Mafra, SC': {'site': 'Afloramento Campáleo (Mafra)', 'municipio': 'Mafra', 'lat': -26.1112, 'lon': -49.8050, 'bacia': 'Bacia do Paraná — Grupo Itararé'},
    'Afloramento Campáleo, Mafra, SC; também Fm. Mafra e Fm. Rio do Sul': {'site': 'Afloramento Campáleo (Mafra)', 'municipio': 'Mafra', 'lat': -26.1112, 'lon': -49.8050, 'bacia': 'Bacia do Paraná — Grupo Itararé'},
    'Município de Taió, SC': {'site': 'Assembleia Taió', 'municipio': 'Taió', 'lat': -27.1100, 'lon': -49.9850, 'bacia': 'Bacia do Paraná — Fm. Rio Bonito'},
    'Margens do rio Taió, Município de Taió, SC': {'site': 'Assembleia Taió (rio Taió)', 'municipio': 'Taió', 'lat': -27.1100, 'lon': -49.9850, 'bacia': 'Bacia do Paraná — Fm. Rio Bonito'},
    'Pedreira Águas Claras, Rio do Sul, SC': {'site': 'Pedreira Águas Claras', 'municipio': 'Rio do Sul', 'lat': -27.2150, 'lon': -49.6433, 'bacia': 'Bacia do Paraná — Grupo Itararé'},
    'Pedreiras de Trombudo Central, SC': {'site': 'Pedreiras de Trombudo Central', 'municipio': 'Trombudo Central', 'lat': -27.3050, 'lon': -49.7950, 'bacia': 'Bacia do Paraná — Grupo Itararé'},
    'Pedreira Itaú-Itaúna, Trombudo Central, SC': {'site': 'Pedreira Itaú-Itaúna', 'municipio': 'Trombudo Central', 'lat': -27.3050, 'lon': -49.7950, 'bacia': 'Bacia do Paraná — Grupo Itararé'},
    'Região de Itajaí / BR-470, SC': {'site': 'Região de Itajaí / BR-470', 'municipio': 'Itajaí', 'lat': -26.9078, 'lon': -48.6614, 'bacia': 'Bacia do Itajaí'},
    'Região de Itajaí, SC': {'site': 'Região de Itajaí', 'municipio': 'Itajaí', 'lat': -26.9078, 'lon': -48.6614, 'bacia': 'Bacia do Itajaí'},
    'Afloramentos do norte de SC e PR': {'site': 'Afloramentos do norte de SC/PR', 'municipio': 'Mafra (região)', 'lat': -26.1500, 'lon': -49.9000, 'bacia': 'Bacia do Paraná — Grupo Itararé'},
    '13+ afloramentos no norte de SC e PR': {'site': 'Afloramentos do norte de SC/PR', 'municipio': 'Mafra (região)', 'lat': -26.1500, 'lon': -49.9000, 'bacia': 'Bacia do Paraná — Grupo Itararé'},
    'Localidade Moema, Itaiópolis, SC': {'site': 'Localidade Moema', 'municipio': 'Itaiópolis', 'lat': -26.3400, 'lon': -49.9100, 'bacia': 'Bacia do Paraná — Grupo Itararé'},
    'Localidade Moema, Itaiópolis, SC (prop. fam. Nietzkar)': {'site': 'Localidade Moema', 'municipio': 'Itaiópolis', 'lat': -26.3400, 'lon': -49.9100, 'bacia': 'Bacia do Paraná — Grupo Itararé'},
    'Afloramento Bainha, Criciúma, SC': {'site': 'Afloramento Bainha', 'municipio': 'Criciúma', 'lat': -28.6775, 'lon': -49.3697, 'bacia': 'Bacia do Paraná — Fm. Rio Bonito'},
    'Nova localidade SC (não especificada)': {'site': 'Localidade não especificada (SC)', 'municipio': 'Não especificado', 'lat': -27.5000, 'lon': -49.5000, 'bacia': 'Bacia do Paraná — Grupo Itararé'},
    'Municípios do Sul de SC (Geoparque Caminhos dos Cânions do Sul)': {'site': 'Geoparque Caminhos dos Cânions do Sul', 'municipio': 'Praia Grande / Timbé do Sul (região)', 'lat': -29.1900, 'lon': -49.9400, 'bacia': 'Bacia do Paraná — Fm. Botucatu / Cânions'},
    'Planície litorânea sul de SC (localidades imprecisas)': {'site': 'Planície litorânea sul de SC', 'municipio': 'Litoral sul (região)', 'lat': -28.9500, 'lon': -49.4500, 'bacia': 'Planície Costeira — Depósitos Quaternários'},
    'Lagoa do Sombrio, SC': {'site': 'Lagoa do Sombrio', 'municipio': 'Sombrio', 'lat': -29.1133, 'lon': -49.6306, 'bacia': 'Planície Costeira — Depósitos Quaternários'},
    'Afloramento de Rio dos Cedros, SC': {'site': 'Afloramento de Rio dos Cedros', 'municipio': 'Rio dos Cedros', 'lat': -26.6483, 'lon': -49.2783, 'bacia': 'Bacia do Itajaí'},
    'Lauro Müller, SC': {'site': 'Lauro Müller', 'municipio': 'Lauro Müller', 'lat': -28.4047, 'lon': -49.3811, 'bacia': 'Bacia do Paraná — Fm. Rio Bonito'},
    'Litoral sul de Santa Catarina, SC (localidade não especificada na fonte)': {'site': 'Litoral sul de SC', 'municipio': 'Litoral sul (região)', 'lat': -28.9500, 'lon': -49.4500, 'bacia': 'Planície Costeira — Depósitos Quaternários'},
    'Costa de Sombrio, SC (encontrado a ~23 m de profundidade, rede de arrasto)': {'site': 'Costa de Sombrio (plataforma continental)', 'municipio': 'Sombrio', 'lat': -29.2200, 'lon': -49.5000, 'bacia': 'Plataforma Continental — Fm. Laguna-Barreira'},
    'Costa de Sombrio, SC (vértebra torácica, rede de arrasto)': {'site': 'Costa de Sombrio (plataforma continental)', 'municipio': 'Sombrio', 'lat': -29.2200, 'lon': -49.5000, 'bacia': 'Plataforma Continental — Fm. Laguna-Barreira'},
    'Plataforma continental entre Passo de Torres e Araranguá, SC (rede de arrasto de camarão)': {'site': 'Plataforma continental Passo de Torres–Araranguá', 'municipio': 'Passo de Torres / Araranguá (região)', 'lat': -29.2800, 'lon': -49.5500, 'bacia': 'Plataforma Continental — Fm. Laguna-Barreira'},
    'Afloramento de Anitápolis, SC': {'site': 'Afloramento de Anitápolis', 'municipio': 'Anitápolis', 'lat': -27.8869, 'lon': -49.1394, 'bacia': 'Embasamento Cristalino / Depósitos Superficiais'},
    'Morro Grande, SC (a ~18 km do centro do município)': {'site': 'Morro Grande', 'municipio': 'Morro Grande', 'lat': -28.6611, 'lon': -49.5444, 'bacia': 'Bacia do Paraná — Fm. Botucatu'},
    'Timbé do Sul, SC (a ~7,3 km do município, junto ao rio Rocinha)': {'site': 'Timbé do Sul (rio Rocinha)', 'municipio': 'Timbé do Sul', 'lat': -28.8244, 'lon': -49.9183, 'bacia': 'Bacia do Paraná — Fm. Botucatu'},
    'Jacinto Machado, SC (Paleotoca do Engenho Velho); Praia Grande, SC': {'site': 'Paleotoca do Engenho Velho', 'municipio': 'Jacinto Machado / Praia Grande', 'lat': -29.0333, 'lon': -49.8167, 'bacia': 'Bacia do Paraná — Fm. Botucatu / Cânions'},
    'Santa Catarina (localidade/município não especificado na fonte consultada)': {'site': 'Localidade não especificada (SC)', 'municipio': 'Não especificado', 'lat': -27.5000, 'lon': -49.5000, 'bacia': 'Não especificado'},
    'Entre Valões e Poço Preto, Lages, SC (estrada Lombo Alto–Lages, próx. km 65)': {'site': 'Entre Valões e Poço Preto', 'municipio': 'Lages', 'lat': -27.8167, 'lon': -50.3264, 'bacia': 'Bacia do Paraná — Fm. Rio do Rasto'},
}

# Ordem cronológica e metadados de cada período presente na planilha.
PERIOD_INFO = {
    'Ediacarano (Neoproterozóico)':                          {'ordem': 1,  'era': 'Neoproterozóico', 'inicio_ma': 635,   'fim_ma': 538.8, 'cor': '#1f4e5f', 'desc': 'Último período do Pré-cambriano, marcado pelo surgimento dos primeiros metazoários macroscópicos de corpo mole (biota ediacarana).'},
    'Ediacarano / Cambriano':                                {'ordem': 2,  'era': 'Neoproterozóico/Paleozóico', 'inicio_ma': 541, 'fim_ma': 530, 'cor': '#1f4e5f', 'desc': 'Intervalo de transição entre o Ediacarano e o início do Cambriano, marcado pela diversificação inicial de metazoários.'},
    'Carbonífero Superior':                                  {'ordem': 3,  'era': 'Paleozóico', 'inicio_ma': 323.2, 'fim_ma': 298.9, 'cor': '#3d6b52', 'desc': 'Período de grandes glaciações no Gondwana; na Bacia do Paraná corresponde aos depósitos glaciogênicos e periglaciais do Grupo Itararé.'},
    'Carbonífero Superior – Permiano Inferior (limite)':     {'ordem': 4,  'era': 'Paleozóico', 'inicio_ma': 300,   'fim_ma': 298.9, 'cor': '#3d6b52', 'desc': 'Limite cronoestratigráfico entre o Carbonífero e o Permiano, registrado nas camadas superiores do Grupo Itararé.'},
    'Carbonífero – Permiano Inferior':                       {'ordem': 5,  'era': 'Paleozóico', 'inicio_ma': 303,   'fim_ma': 295,   'cor': '#3d6b52', 'desc': 'Intervalo glacial a pós-glacial do Grupo Itararé, com rica fauna de invertebrados marinhos e icnofósseis associados a ambientes deltaicos e marinhos rasos.'},
    'Permiano Inferior (Asseliano)':                         {'ordem': 6,  'era': 'Paleozóico', 'inicio_ma': 298.9, 'fim_ma': 295,   'cor': '#6b8f5e', 'desc': 'Primeiro andar do Permiano Inferior (Cisuraliano); em Mafra corresponde ao Folhelho Lontras, com o mais importante conjunto de tetrápodes permianos de Santa Catarina.'},
    'Permiano Inferior (Cisuraliano)':                       {'ordem': 7,  'era': 'Paleozóico', 'inicio_ma': 298.9, 'fim_ma': 279.3, 'cor': '#6b8f5e', 'desc': 'Série Cisuraliano do Permiano Inferior, abrangendo o intervalo de deposição do Grupo Itararé/Guatá em SC.'},
    'Permiano Inferior':                                     {'ordem': 8,  'era': 'Paleozóico', 'inicio_ma': 298.9, 'fim_ma': 273.0, 'cor': '#7fa66b', 'desc': 'Período com ampla diversidade de invertebrados marinhos, flora glossopterídea e icnofósseis na Fm. Rio Bonito (Assembleia Taió) e no Grupo Itararé.'},
    'Permiano Superior':                                     {'ordem': 9,  'era': 'Paleozóico', 'inicio_ma': 259.1, 'fim_ma': 251.9, 'cor': '#9bb86b', 'desc': 'Permiano final, representado pela Fm. Rio do Rasto, com depósitos continentais lacustres-fluviais e tetrápodes e invertebrados associados.'},
    'Jurássico Superior (?) – Cretáceo Inferior (?)':        {'ordem': 10, 'era': 'Mesozóico', 'inicio_ma': 152,   'fim_ma': 100,   'cor': '#c9a23a', 'desc': 'Idade indicativa para depósitos eólicos do paleodeserto da Fm. Botucatu, com icnofósseis de vertebrados continentais.'},
    'Cretáceo Inferior':                                     {'ordem': 11, 'era': 'Mesozóico', 'inicio_ma': 143.1, 'fim_ma': 100.5, 'cor': '#c9a23a', 'desc': 'Continuação da sedimentação eólica/desértica regional, associada a geossítios do Geoparque Caminhos dos Cânions do Sul.'},
    'Plioceno–Pleistoceno':                                  {'ordem': 12, 'era': 'Cenozóico', 'inicio_ma': 5.33,  'fim_ma': 0.012, 'cor': '#b5651d', 'desc': 'Transição entre o Plioceno e o Pleistoceno, com depósitos da plataforma continental e registros de megafauna marinha e continental.'},
    'Pleistoceno':                                           {'ordem': 13, 'era': 'Cenozóico', 'inicio_ma': 2.58,  'fim_ma': 0.0117,'cor': '#b5651d', 'desc': 'Época das grandes glaciações; em SC corresponde aos depósitos quaternários com megafauna continental.'},
    'Pleistoceno Superior':                                  {'ordem': 14, 'era': 'Cenozóico', 'inicio_ma': 0.129, 'fim_ma': 0.0117,'cor': '#b5651d', 'desc': 'Subdivisão final do Pleistoceno, com registros de megafauna sul-americana extinta (gliptodontes, toxodontes) em depósitos litorâneos e cavernas.'},
    'Pleistoceno–Holoceno':                                  {'ordem': 15, 'era': 'Cenozóico', 'inicio_ma': 0.0117,'fim_ma': 0,     'cor': '#a85a2e', 'desc': 'Transição entre o Pleistoceno e o Holoceno (atual), com depósitos lagunares e aluvionares recentes.'},
    'Quaternário (Pleistoceno–Holoceno)':                    {'ordem': 16, 'era': 'Cenozóico', 'inicio_ma': 2.58,  'fim_ma': 0,     'cor': '#a85a2e', 'desc': 'Período quaternário, abrangendo depósitos superficiais recentes e registros de fauna pleistocênica em diferentes contextos sedimentares.'},
}


def get_era(periodo: str) -> str:
    if 'Ediacarano' in periodo or 'Cambriano' in periodo:
        return 'Neoproterozóico / Cambriano'
    if 'Carbonífero' in periodo:
        return 'Paleozóico — Carbonífero'
    if 'Permiano' in periodo:
        return 'Paleozóico — Permiano'
    if 'Jurássico' in periodo or 'Cretáceo' in periodo:
        return 'Mesozóico'
    return 'Cenozóico — Quaternário'


def main(xlsx_path: str, out_dir: str = 'data'):
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    df = pd.read_excel(xlsx_path, sheet_name='Catálogo de Fósseis SC', header=2)
    df = df.dropna(how='all')

    records = []
    missing_sites = set()

    for idx, row in df.iterrows():
        loc_key = str(row['Local de Coleta (Município / Afloramento)']).strip()
        site_info = SITE_MAP.get(loc_key)
        if site_info is None:
            missing_sites.add(loc_key)
            site_info = {'site': loc_key, 'municipio': 'N/D', 'lat': None, 'lon': None, 'bacia': 'N/D'}

        periodo = str(row['Período Geológico']).strip()
        fonte_raw = str(row['Fonte / URL de Verificação'])
        urls = [u.strip() for u in re.split(r';', fonte_raw) if u.strip()]

        records.append({
            'id': idx + 1,
            'periodo': periodo,
            'era': get_era(periodo),
            'periodo_ordem': PERIOD_INFO.get(periodo, {}).get('ordem', 99),
            'formacao': row['Formação / Grupo'],
            'taxon': row['Táxon / Material'],
            'categoria': row['Categoria'],
            'numero_catalogo': row['Nº de Amostra / Catálogo'],
            'local_coleta': loc_key,
            'site': site_info['site'],
            'municipio': site_info['municipio'],
            'lat': site_info['lat'],
            'lon': site_info['lon'],
            'bacia': site_info['bacia'],
            'armazenamento': row['Local de Armazenamento Atual'],
            'descritor': row['Descritor(es) / Referência'],
            'unidade_pesquisa': row['Unidade de Pesquisa'],
            'idade_ma': row['Idade Estimada (Ma)'],
            'observacoes': row['Observações'],
            'fontes': urls,
        })

    (out / 'fosseis.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')

    # --- sítios para o mapa ---
    sites = defaultdict(lambda: {'taxons': [], 'count': 0, 'periodos': set(), 'bacia': '', 'municipio': '', 'lat': None, 'lon': None})
    for r in records:
        s = sites[r['site']]
        s['count'] += 1
        s['taxons'].append(r['taxon'])
        s['periodos'].add(r['periodo'])
        s['bacia'] = r['bacia']
        s['municipio'] = r['municipio']
        s['lat'] = r['lat']
        s['lon'] = r['lon']

    site_list = [{
        'site': name, 'municipio': s['municipio'], 'bacia': s['bacia'],
        'lat': s['lat'], 'lon': s['lon'], 'count': s['count'],
        'periodos': sorted(s['periodos']), 'taxons_amostra': s['taxons'][:5],
    } for name, s in sites.items()]
    site_list.sort(key=lambda x: -x['count'])
    (out / 'sitios_mapa.json').write_text(json.dumps(site_list, ensure_ascii=False, indent=2), encoding='utf-8')

    # --- períodos ---
    grupos = defaultdict(list)
    for r in records:
        grupos[r['periodo']].append(r)

    periodos_out = []
    for nome, info in PERIOD_INFO.items():
        items = grupos.get(nome, [])
        if not items:
            continue
        taxon_count = defaultdict(int)
        for it in items:
            taxon_count[it['taxon']] += 1
        taxons = [{'taxon': t, 'count': c, 'ids': [i['id'] for i in items if i['taxon'] == t]} for t, c in taxon_count.items()]
        periodos_out.append({
            'nome': nome, 'ordem': info['ordem'], 'era': info['era'],
            'inicio_ma': info['inicio_ma'], 'fim_ma': info['fim_ma'], 'cor': info['cor'],
            'descricao': info['desc'], 'total_registros': len(items),
            'taxons': sorted(taxons, key=lambda x: -x['count']),
        })
    periodos_out.sort(key=lambda x: x['ordem'])
    (out / 'periodos.json').write_text(json.dumps(periodos_out, ensure_ascii=False, indent=2), encoding='utf-8')

    print(f"OK: {len(records)} registros, {len(site_list)} sítios, {len(periodos_out)} períodos.")
    if missing_sites:
        print("\nATENÇÃO — locais de coleta sem coordenadas cadastradas em SITE_MAP:")
        for m in sorted(missing_sites):
            print(f"  - {m}")
        print("Adicione-os ao dicionário SITE_MAP no topo deste script com lat/lon e bacia.")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1])
