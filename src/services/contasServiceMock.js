// src/services/contasServiceMock.js
const KEYS = {
  pagar: 'contas_pagar_v1',
  receber: 'contas_receber_v1',
};

function load(tipo) {
  try {
    const raw = localStorage.getItem(KEYS[tipo]);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(tipo, data) {
  try {
    localStorage.setItem(KEYS[tipo], JSON.stringify(data));
  } catch {}
}

function nextId(items) {
  const nums = items.map((i) => Number(i.id)).filter(Number.isFinite);
  return String(nums.length ? Math.max(...nums) + 1 : 1);
}

export function listContas(tipo /* 'pagar' | 'receber' */) {
  const data = load(tipo);
  return [...data].sort((a, b) => {
    const av = a.vencimento || '';
    const bv = b.vencimento || '';
    if (av === bv) return (a.descricao || '').localeCompare(b.descricao || '');
    return av.localeCompare(bv);
  });
}

export function upsertConta(tipo, conta) {
  const data = load(tipo);

  const normalizada = {
    ...conta,
    id: conta.id || nextId(data),
    parcelas: Number(conta.parcelas || 1),
    valorParcela: Number(conta.valorParcela || 0),
    juros: Number(conta.juros || 0),
    desconto: Number(conta.desconto || 0),
    total: Number(conta.total || 0),
    status: conta.status || 'Ativa',
  };

  const idx = data.findIndex((c) => String(c.id) === String(normalizada.id));
  if (idx >= 0) data[idx] = normalizada;
  else data.push(normalizada);

  save(tipo, data);
  return normalizada;
}

export function inativarConta(tipo, id) {
  const data = load(tipo);
  const idx = data.findIndex((c) => String(c.id) === String(id));
  if (idx >= 0) {
    data[idx] = { ...data[idx], status: 'Inativa' };
    save(tipo, data);
    return true;
  }
  return false;
}
