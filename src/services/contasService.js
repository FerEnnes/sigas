const LS_KEYS = {
  PAGAR: 'sigas_contas_pagar',
  RECEBER: 'sigas_contas_receber',
};

const uid = () => Math.random().toString(36).slice(2, 9);

const load = (tipo) => {
  const raw = localStorage.getItem(LS_KEYS[tipo]) || '[]';
  try { return JSON.parse(raw); } catch { return []; }
};
const save = (tipo, arr) => {
  localStorage.setItem(LS_KEYS[tipo], JSON.stringify(arr));
  return arr;
};

const normalizeMoney = (v) => Number(String(v).replace(/[^\d.,-]/g, '').replace('.', '').replace(',', '.')) || 0;

export function listContas(tipo) {
  return Promise.resolve(load(tipo));
}

export function createConta(tipo, payload) {
  const arr = load(tipo);
  const total = normalizeMoney(payload.total ?? payload.valor ?? 0);
  const valorParcela = normalizeMoney(payload.valorParcela ?? payload.valor_parcela ?? payload.valor ?? total);
  const parcelas = Number(payload.parcelas ?? payload.nParcelas ?? 1) || 1;

  const item = {
    id: uid(),
    descricao: payload.descricao?.trim() || '(sem descrição)',
    valorParcela,
    parcelas,
    total: total || (valorParcela * parcelas),
    vencimento: payload.vencimento || payload.dataVenc || null,
    quitacao: payload.quitacao || payload.dataQuitacao || null,
    juros: normalizeMoney(payload.juros || 0),
    desconto: normalizeMoney(payload.desconto || 0),
    propriedadeId: payload.propriedadeId || null,
    fornecedorId: payload.fornecedorId || null,        // em RECEBER pode ser "clienteId"
    planoCodigo: payload.planoCodigo || payload.plano || null,
    status: payload.status || 'pendente', // 'pendente' | 'liquidado' | 'atrasado'
    createdAt: new Date().toISOString(),
  };

  arr.unshift(item);
  save(tipo, arr);
  return Promise.resolve(item);
}

export function removeConta(tipo, id) {
  const arr = load(tipo).filter((x) => x.id !== id);
  save(tipo, arr);
  return Promise.resolve();
}

export function liquidarConta(tipo, id, data = new Date().toISOString().slice(0,10)) {
  const arr = load(tipo).map((x) => x.id === id ? { ...x, status: 'liquidado', quitacao: data } : x);
  save(tipo, arr);
  return Promise.resolve();
}

/* ---------- Seeds opcionais (chame uma vez se quiser) ---------- */
export function seedContasDemo() {
  if (!load('PAGAR').length) {
    createConta('PAGAR', {
      descricao: 'Fertilizantes – Fazenda Boa Vista',
      valorParcela: 1250, parcelas: 2, vencimento: '2025-10-10',
      propriedadeId: 'faz_boa_vista', fornecedorId: 'forn_agro_x', planoCodigo: '3.2.1',
    });
  }
  if (!load('RECEBER').length) {
    createConta('RECEBER', {
      descricao: 'Venda café microlote – Cliente A',
      valorParcela: 3500, parcelas: 1, vencimento: '2025-10-15',
      propriedadeId: 'faz_boa_vista', fornecedorId: 'cli_A', planoCodigo: '5.1.1',
    });
  }
}
