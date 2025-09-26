import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PlanoContasTree from '../components/PlanoContasTree';
import PlanoContasModal from '../components/PlanoContasModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PlanoContasPage.css';
import { getPlanoContas } from '../services/planoContasService';
/* -------------------------------------------------------
   LER DIRETO DA RAIZ DO /public
------------------------------------------------------- */
const FILES = { 1: '/plano-simplificado.csv', 2: '/plano-detalhado.csv' };


/* -------------------------------------------------------
   MOCKS (fallback se o CSV não renderizar nada)
------------------------------------------------------- */
const MOCK_SIMPLIFICADO = [
  { id: '1', codigo: '1', descricao: 'Ativos', subcontas: [] },
  { id: '2', codigo: '2', descricao: 'Passivo', subcontas: [] },
  { id: '3', codigo: '3', descricao: 'Saída de caixa', subcontas: [] },
  { id: '4', codigo: '4', descricao: 'Entrada de caixa', subcontas: [] },
];

const MOCK_DETALHADO = [ {
    id: 101, codigo: '1', descricao: 'Ativo', natureza: 'D',
    subcontas: [
      {
        id: 111, codigo: '1.1', descricao: 'Ativo Circulante', natureza: 'D',
        subcontas: [
          { id: 1111, codigo: '1.1.1', descricao: 'Disponível', natureza: 'D',
            subcontas: [
              { id: 11111, codigo: '1.1.1.1', descricao: 'Caixa', natureza: 'D', subcontas: [] },
              { id: 11112, codigo: '1.1.1.2', descricao: 'Movimentação na conta', natureza: 'D', subcontas: [] },
              { id: 11113, codigo: '1.1.1.3', descricao: 'Aplicações financeiras', natureza: 'D', subcontas: [] },
            ]
          },
          {
            id: 112, codigo: '1.1.2', descricao: 'Recebimentos', natureza: 'D',
            subcontas: [
              { id: 1121, codigo: '1.1.2.1', descricao: 'Clientes', natureza: 'D', subcontas: [] },
              { id: 1122, codigo: '1.1.2.2', descricao: 'Pagamentos a receber', natureza: 'D', subcontas: [] },
              { id: 1123, codigo: '1.1.2.3', descricao: 'Ações da empresa', natureza: 'D', subcontas: [] },
              { id: 1124, codigo: '1.1.2.4', descricao: 'Possíveis inadimplentes', natureza: 'D', subcontas: [] },
              { id: 1125, codigo: '1.1.2.5', descricao: 'Empréstimos a receber', natureza: 'D', subcontas: [] },
              { id: 1126, codigo: '1.1.2.6', descricao: 'Cheques com cobrança', natureza: 'D', subcontas: [] },
              { id: 1127, codigo: '1.1.2.7', descricao: 'Adiantamentos Salariais', natureza: 'D', subcontas: [] },
            ]
          },
          {
            id: 113, codigo: '1.1.3', descricao: 'Estoques', natureza: 'D',
            subcontas: [
              { id: 1131, codigo: '1.1.3.1', descricao: 'Mercadorias para venda', natureza: 'D', subcontas: [] },
              { id: 1132, codigo: '1.1.3.2', descricao: 'Produtos Finais', natureza: 'D', subcontas: [] },
              { id: 1133, codigo: '1.1.3.3', descricao: 'Produtos em processo', natureza: 'D', subcontas: [] },
            ]
          },
          { id: 114,  codigo: '1.1.4', descricao: 'Despesas',   natureza: 'D',
            subcontas: [{ id: 1141, codigo: '1.1.4.1', descricao: 'Produção', natureza: 'D', subcontas: [] }] },
          {
            id: 115, codigo: '1.1.5', descricao: 'Ativo não circulante', natureza: 'D',
            subcontas: [
              {
                id: 1151, codigo: '1.1.5.1', descricao: 'Direitos a longo prazo', natureza: 'D',
                subcontas: [
                  { id: 11511, codigo: '1.1.5.1.1', descricao: 'Títulos a receber', natureza: 'D', subcontas: [] },
                  { id: 11512, codigo: '1.1.5.1.2', descricao: 'Fundo de reserva', natureza: 'D', subcontas: [] },
                  { id: 11513, codigo: '1.1.5.1.3', descricao: 'Consórcios', natureza: 'D', subcontas: [] },
                  { id: 11514, codigo: '1.1.5.1.4', descricao: 'Investimentos', natureza: 'D', subcontas: [] },
                  { id: 11515, codigo: '1.1.5.1.5', descricao: 'Participações em outras empresas', natureza: 'D', subcontas: [] },
                ]
              },
              {
                id: 1152, codigo: '1.1.5.2', descricao: 'Imobilizados', natureza: 'D',
                subcontas: [
                  { id: 11521, codigo: '1.1.5.2.1', descricao: 'Terrenos', natureza: 'D', subcontas: [] },
                  { id: 11522, codigo: '1.1.5.2.2', descricao: 'Edificadores', natureza: 'D', subcontas: [] },
                  { id: 11523, codigo: '1.1.5.2.3', descricao: 'Imóveis para renda', natureza: 'D', subcontas: [] },
                  { id: 11524, codigo: '1.1.5.2.4', descricao: 'Veículos', natureza: 'D', subcontas: [] },
                  { id: 11525, codigo: '1.1.5.2.5', descricao: 'Marcas e patentes', natureza: 'D', subcontas: [] },
                  { id: 11526, codigo: '1.1.5.2.6', descricao: 'Amortizações', natureza: 'D', subcontas: [] },
                ]
              },
              {
                id: 1153, codigo: '1.1.5.3', descricao: 'Tecnologia', natureza: 'D',
                subcontas: [
                  { id: 11531, codigo: '1.1.5.3.1', descricao: 'Despesas com pesquisas', natureza: 'D', subcontas: [] },
                  { id: 11532, codigo: '1.1.5.3.2', descricao: 'Desenvolvimento de produtos', natureza: 'D', subcontas: [] },
                  { id: 11533, codigo: '1.1.5.3.3', descricao: 'Automação de processos na empresa', natureza: 'D', subcontas: [] },
                ]
              },
            ]
          },
        ]
      },
      // 2 Passivo (parcial do material)
      {
        id: 201, codigo: '2', descricao: 'Passivo', natureza: 'C',
        subcontas: [
          {
            id: 211, codigo: '2.1', descricao: 'Circulante', natureza: 'C',
            subcontas: [
              { id: 2111, codigo: '2.1.1', descricao: 'Obrigações fiscais', natureza: 'C',
                subcontas: [
                  { id: 21111, codigo: '2.1.1.1', descricao: 'ICMS',  natureza: 'C', subcontas: [] },
                  { id: 21112, codigo: '2.1.1.2', descricao: 'ISS',   natureza: 'C', subcontas: [] },
                  { id: 21113, codigo: '2.1.1.3', descricao: 'INSS',  natureza: 'C', subcontas: [] },
                  { id: 21114, codigo: '2.1.1.4', descricao: 'Cofins',natureza: 'C', subcontas: [] },
                  { id: 21115, codigo: '2.1.1.5', descricao: 'IRPJ',  natureza: 'C', subcontas: [] },
                  { id: 21116, codigo: '2.1.1.6', descricao: 'CSLL',  natureza: 'C', subcontas: [] },
                  { id: 21117, codigo: '2.1.1.7', descricao: 'CPP',   natureza: 'C', subcontas: [] },
                ] },
              { id: 212, codigo: '2.1.2', descricao: 'Contas a pagar', natureza: 'C',
                subcontas: [
                  { id: 2121, codigo: '2.1.2.1', descricao: 'Fornecedores', natureza: 'C', subcontas: [] },
                  { id: 2122, codigo: '2.1.2.2', descricao: 'Salários',     natureza: 'C', subcontas: [] },
                  { id: 2123, codigo: '2.1.2.3', descricao: '13º Salário',  natureza: 'C', subcontas: [] },
                  { id: 2124, codigo: '2.1.2.4', descricao: 'Férias',       natureza: 'C', subcontas: [] },
                ] },
              { id: 213, codigo: '2.1.3', descricao: 'Empréstimos', natureza: 'C', subcontas: [] },
            ]
          },
          {
            id: 22, codigo: '2.2', descricao: 'Não Circulante', natureza: 'C',
            subcontas: [
              { id: 2221, codigo: '2.2.2.1', descricao: 'Capital', natureza: 'C', subcontas: [] },
              { id: 2222, codigo: '2.2.2.2', descricao: 'Reservas', natureza: 'C', subcontas: [] },
              { id: 2223, codigo: '2.2.2.3', descricao: 'Prejuízos', natureza: 'C', subcontas: [] },
            ]
          },
        ]
      },
      // 3 Custos (amostra)
      {
        id: 301, codigo: '3', descricao: 'Custos', natureza: 'D',
        subcontas: [
          { id: 311, codigo: '3.1', descricao: 'Custos das mercadorias', natureza: 'D',
            subcontas: [
              { id: 3111, codigo: '3.1.1', descricao: 'Compra de mercadoria', natureza: 'D', subcontas: [] },
              { id: 3112, codigo: '3.1.2', descricao: 'Frete', natureza: 'D', subcontas: [] },
              { id: 3113, codigo: '3.1.3', descricao: 'Mão de obra', natureza: 'D', subcontas: [] },
            ] },
          { id: 321, codigo: '3.2', descricao: 'Custo de Produção', natureza: 'D',
            subcontas: [
              { id: 3211, codigo: '3.2.1', descricao: 'Matéria-prima', natureza: 'D', subcontas: [] },
              { id: 3212, codigo: '3.2.2', descricao: 'Material de consumo', natureza: 'D', subcontas: [] },
              { id: 3213, codigo: '3.2.3', descricao: 'Combustível', natureza: 'D', subcontas: [] },
              { id: 3214, codigo: '3.2.4', descricao: 'Mão de obra', natureza: 'D', subcontas: [] },
            ] },
        ]
      },
      // 4 Receitas e Despesas (amostra conforme imagem)
      {
        id: 401, codigo: '4', descricao: 'Despesas', natureza: 'D',
        subcontas: [
          { id: 41,  codigo: '4.1', descricao: 'Administrativas', natureza: 'D',
            subcontas: [
              { id: 411, codigo: '4.1.1', descricao: 'Aluguel', natureza: 'D', subcontas: [] },
              { id: 412, codigo: '4.1.2', descricao: 'Energia e Água', natureza: 'D', subcontas: [] },
              { id: 413, codigo: '4.1.3', descricao: 'Internet', natureza: 'D', subcontas: [] },
              { id: 414, codigo: '4.1.4', descricao: 'Correios', natureza: 'D', subcontas: [] },
              { id: 415, codigo: '4.1.5', descricao: 'Honorários', natureza: 'D', subcontas: [] },
              { id: 416, codigo: '4.1.6', descricao: 'Serviços terceirizados', natureza: 'D', subcontas: [] },
            ] },
          { id: 42,  codigo: '4.2', descricao: 'Despesas financeiras', natureza: 'D',
            subcontas: [
              { id: 421, codigo: '4.2.1', descricao: 'Juros passivos', natureza: 'D', subcontas: [] },
              { id: 422, codigo: '4.2.2', descricao: 'Despesas com banco', natureza: 'D', subcontas: [] },
              { id: 423, codigo: '4.2.3', descricao: 'Comissões e juros', natureza: 'D', subcontas: [] },
              { id: 424, codigo: '4.2.4', descricao: 'Descontos', natureza: 'D', subcontas: [] },
            ] },
          { id: 43,  codigo: '4.3', descricao: 'Despesas comerciais', natureza: 'D',
            subcontas: [
              { id: 431, codigo: '4.3.1', descricao: 'Publicidade', natureza: 'D', subcontas: [] },
              { id: 432, codigo: '4.3.2', descricao: 'Brindes', natureza: 'D', subcontas: [] },
            ] },
        ]
      },
      {
        id: 501, codigo: '5', descricao: 'Receitas', natureza: 'C',
        subcontas: [
          { id: 51, codigo: '5.1', descricao: 'Receita de vendas', natureza: 'C',
            subcontas: [
              { id: 511, codigo: '5.1.1', descricao: 'Vendas de produto à vista', natureza: 'C', subcontas: [] },
              { id: 512, codigo: '5.1.2', descricao: 'Vendas de produto a prazo', natureza: 'C', subcontas: [] },
            ] },
          { id: 52, codigo: '5.2', descricao: 'Receita de prestação de serviço', natureza: 'C',
            subcontas: [
              { id: 521, codigo: '5.2.1', descricao: 'Vendas de produto à vista', natureza: 'C', subcontas: [] },
              { id: 522, codigo: '5.2.2', descricao: 'Vendas de produto a prazo', natureza: 'C', subcontas: [] },
            ] },
          { id: 53, codigo: '5.3', descricao: 'Receitas financeiras', natureza: 'C',
            subcontas: [
              { id: 531, codigo: '5.3.1', descricao: 'Juros ativos', natureza: 'C', subcontas: [] },
              { id: 532, codigo: '5.3.2', descricao: 'Descontos obtidos', natureza: 'C', subcontas: [] },
              { id: 533, codigo: '5.3.3', descricao: 'Juros em aplicações financeiras', natureza: 'C', subcontas: [] },
              { id: 534, codigo: '5.3.4', descricao: 'Despesas recuperadas', natureza: 'C', subcontas: [] },
            ] },
        ]
      },
    ],
  },
];
/*---------------- CSV helpers robustos ---------------- 

const norm = (s) =>
  String(s ?? '')
    .replace(/^\uFEFF/, '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]+/g, '_')
    .toLowerCase();

function splitCSVLine(line, sep) {
  const out = []; let cur = ''; let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === sep && !inQuotes) { out.push(cur.trim()); cur = ''; }
    else { cur += ch; }
  }
  out.push(cur.trim());
  return out;
}

function csvToRows(text) {
  const clean = text.replace(/^\uFEFF/, '').replace(/\r/g, '');
  const lines = clean.split('\n').filter((l) => l.trim().length > 0);
  if (!lines.length) return [];
  const rawHeader = lines[0];
  const sep = rawHeader.includes(';') ? ';' : ',';
  const headers = splitCSVLine(rawHeader, sep).map((h) => norm(h));
  const rows = lines.slice(1).map((line) => {
    const cols = splitCSVLine(line, sep);
    const obj = {};
    headers.forEach((h, i) => (obj[h] = (cols[i] ?? '').trim()));
    return obj;
  });
  console.log('[PlanoContas] sep:', sep);
  console.log('[PlanoContas] header:', headers);
  console.table(rows.slice(0, 3));
  return rows;
}

const pick = (row, keys, fallback = '') => {
  for (const k of keys) {
    const v = row[norm(k)];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return fallback;
};

const firstNonEmpty = (row) => {
  for (const k of Object.keys(row)) {
    const v = String(row[k] ?? '').trim();
    if (v) return v;
  }
  return '';
};

function buildFlat(rows) {
  return rows.map((r, idx) => {
    let codigo = pick(r, ['codigo', 'código', 'cod']) || String(idx + 1);
    let descricao = pick(r, ['descricao', 'descrição', 'nome', 'conta']) || firstNonEmpty(r) || `Conta ${idx + 1}`;
    return { id: codigo, codigo, descricao, subcontas: [] };
  });
}

function buildTree(rows) {
  const items = rows.map((r, idx) => {
    let codigo = pick(r, ['codigo', 'código', 'cod']) || String(idx + 1);
    let descricao = pick(r, ['descricao', 'descrição', 'nome', 'conta']) || firstNonEmpty(r) || `Conta ${idx + 1}`;
    let pai = pick(r, ['pai', 'parent', 'codigo_pai', 'código_pai']);
    if (!pai && /\./.test(codigo)) pai = codigo.split('.').slice(0, -1).join('.');
    return { id: codigo, codigo, descricao, pai: pai || null, subcontas: [] };
  });
  const byId = new Map(items.map((it) => [it.id, it]));
  const roots = [];
  for (const it of items) {
    if (it.pai && byId.has(it.pai)) byId.get(it.pai).subcontas.push(it);
    else roots.push(it);
  }
  return roots;
}
/* 

/* ---------------- Página ---------------- */

function PlanoContasPage() {
  const [modelo, setModelo] = useState(1);
  const [contas, setContas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [userTipo] = useState(1);


 useEffect(() => {
  (async () => {
    try {
      const data = await getPlanoContas(modelo);

      if (!data || data.length === 0) {
        console.warn('[PlanoContas] CSV vazio – usando MOCK.');
        setContas(modelo === 1 ? MOCK_SIMPLIFICADO : MOCK_DETALHADO);
        toast.info('Exibindo plano de contas mockado (CSV vazio).');
      } else {
        console.log('[PlanoContas] itens carregados:', data.length);
        setContas(data);
      }
    } catch (err) {
      console.error('Erro ao carregar CSV:', err);
      toast.error('Não foi possível carregar o plano de contas (CSV). Usando mock.');
      setContas(modelo === 1 ? MOCK_SIMPLIFICADO : MOCK_DETALHADO);
    }
  })();
}, [modelo]);



  const handleModeloChange = (novo) => {
    setModelo(novo);
    toast.info(novo === 1 ? 'Visualizando: Simplificado' : 'Visualizando: Detalhado');
  };

  const allIds = useMemo(() => {
    const collect = (arr) => arr.flatMap((n) => [n.id, ...collect(n.subcontas || [])]);
    return collect(contas);
  }, [contas]);

  const nextId = () => {
    const nums = allIds.map((x) => Number(x)).filter(Number.isFinite);
    if (nums.length === allIds.length) return String(Math.max(0, ...nums) + 1);
    return `new_${allIds.length + 1}`;
  };

  const updateTreeInPlace = (list, updated) =>
    list.map((n) => {
      if (n.id === updated.id) return { ...updated };
      if (n.subcontas?.length) return { ...n, subcontas: updateTreeInPlace(n.subcontas, updated) };
      return n;
    });

  const handleSave = (payload) => {
    if (payload.id) {
      setContas((prev) => updateTreeInPlace(prev, payload));
      toast.success('Conta atualizada (mock)');
    } else {
      const nova = { ...payload, id: nextId(), codigo: payload.codigo || nextId(), subcontas: [] };
      setContas((prev) => [...prev, nova]);
      toast.success('Conta criada (mock)');
    }
    setOpenModal(false);
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="plano-container">
        <h2>
          Plano de Contas ({modelo === 1 ? 'Simplificado' : 'Detalhado'})
          <span style={{ marginLeft: 12, fontSize: 12, color: '#6b7280' }}>
            {contas.length} raiz(es)
          </span>
        </h2>

        {userTipo === 1 && (
          <div className="modelo-toggle">
            <button className={modelo === 1 ? 'active' : ''} onClick={() => handleModeloChange(1)}>
              Simplificado
            </button>
            <button className={modelo === 2 ? 'active' : ''} onClick={() => handleModeloChange(2)}>
              Detalhado
            </button>
          </div>
        )}


        {contas.length === 0 ? (
          <div style={{ marginTop: 16, color: '#6b7280' }}>Nenhuma conta para mostrar.</div>
        ) : (
          <PlanoContasTree
            contas={contas}
            onEdit={(data) => {
              setEditData(data);
              setOpenModal(true);
            }}
          />
        )}

        {userTipo === 1 && (
          <button className="add-button" onClick={() => { setEditData(null); setOpenModal(true); }}>
            + Nova conta
          </button>
        )}
        {openModal && (
        <PlanoContasModal
          modelo={modelo}
          data={editData}
          onClose={() => setOpenModal(false)}
          onSave={handleSave}
        />
      )}
        <ToastContainer position="top-right" autoClose={2500} />
      </div>
    </div>
  );
}

export default PlanoContasPage;



/*import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PlanoContasTree from '../components/PlanoContasTree';
import PlanoContasModal from '../components/PlanoContasModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PlanoContasPage.css';

function PlanoContasPage() {
  const [modelo, setModelo] = useState(1); // 1 = Simplificado, 2 = Detalhado
  const [contas, setContas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [userTipo] = useState(1); // 1 = Admin, 2 = Colaborador

  // Carrega o plano de contas conforme o modelo selecionado
  useEffect(() => {
    fetch(`/api/plano-de-contas/?modelo=${modelo}`)
      .then(res => res.json())
      .then(data => setContas(data))
      .catch(err => {
        console.error('Erro ao buscar plano de contas:', err);
        toast.error('Erro ao carregar plano de contas');
      });
  }, [modelo]);

  const handleModeloChange = (novoModelo) => {
    setModelo(novoModelo);
    toast.info(`Visualizando: ${novoModelo === 1 ? 'Simplificado' : 'Detalhado'}`);
  };

  const atualizarLista = (novaConta) => {
    const novoId = Math.max(...flattenIds(contas)) + 1;

    if (novaConta.id) {
      setContas(updateConta(contas, novaConta));
      toast.success('Conta atualizada!');
    } else {
      const novaComId = { ...novaConta, id: novoId, subcontas: [] };
      setContas([...contas, novaComId]);
      toast.success('Conta criada!');
    }
  };

  const flattenIds = (items) => {
    let ids = [];
    items.forEach(item => {
      ids.push(item.id);
      if (Array.isArray(item.subcontas)) ids = [...ids, ...flattenIds(item.subcontas)];
    });
    return ids;
  };

  const updateConta = (lista, nova) =>
    lista.map(item => {
      if (item.id === nova.id) return nova;
      if (item.subcontas) {
        return { ...item, subcontas: updateConta(item.subcontas, nova) };
      }
      return item;
    });

  return (
    <div className="app">
      <Sidebar />
      <div className="plano-container">
        <h2>Plano de Contas ({modelo === 1 ? 'Simplificado' : 'Detalhado'})</h2>

        {userTipo === 1 && (
          <div className="modelo-toggle">
            <button
              className={modelo === 1 ? 'active' : ''}
              onClick={() => handleModeloChange(1)}
            >
              Simplificado
            </button>
            <button
              className={modelo === 2 ? 'active' : ''}
              onClick={() => handleModeloChange(2)}
            >
              Detalhado
            </button>
          </div>
        )}

        <PlanoContasTree
          contas={contas}
          onEdit={(data) => {
            setEditData(data);
            setOpenModal(true);
          }}
        />

        {userTipo === 1 && (
          <button
            className="add-button"
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
          >
            + Nova conta
          </button>
        )}

        {openModal && (
          <PlanoContasModal
            modelo={modelo}
            data={editData}
            onClose={() => setOpenModal(false)}
            onSave={(nova) => {
              atualizarLista(nova);
              setOpenModal(false);
            }}
          />
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default PlanoContasPage;
*/