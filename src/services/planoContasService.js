// src/services/planoContasService.js

/* -------------------------------------------------------
   ARQUIVOS NO /public
   - Coloque "plano-simplificado.csv" e "plano-detalhado.csv"
   - Exemplos: public/plano-simplificado.csv, public/plano-detalhado.csv
------------------------------------------------------- */
const FILES = {
  1: '/plano-simplificado.csv',
  2: '/plano-detalhado.csv',
};

/* -------------------------------------------------------
   MOCKS (usados se o CSV falhar/estiver vazio)
------------------------------------------------------- */
const MOCK_SIMPLIFICADO = [
  { id: '1', codigo: '1', descricao: 'Ativos', subcontas: [] },
  { id: '2', codigo: '2', descricao: 'Passivo', subcontas: [] },
  { id: '3', codigo: '3', descricao: 'Saída de caixa', subcontas: [] },
  { id: '4', codigo: '4', descricao: 'Entrada de caixa', subcontas: [] },
];

// amostra curta — ajuste se quiser algo maior
const MOCK_DETALHADO = [
  {
    id: '1', codigo: '1', descricao: 'Ativo', subcontas: [
      { id: '1.1', codigo: '1.1', descricao: 'Ativo Circulante', subcontas: [] },
    ],
  },
  {
    id: '2', codigo: '2', descricao: 'Passivo', subcontas: [
      { id: '2.1', codigo: '2.1', descricao: 'Circulante', subcontas: [] },
    ],
  },
];

/* -------------------------------------------------------
   CSV helpers (tolerantes)
------------------------------------------------------- */
const norm = (s) =>
  String(s ?? '')
    .replace(/^\uFEFF/, '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]+/g, '_')
    .toLowerCase();

function splitCSVLine(line, sep) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === sep && !inQuotes) {
      out.push(cur.trim()); cur = '';
    } else {
      cur += ch;
    }
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
  return lines.slice(1).map((line) => {
    const cols = splitCSVLine(line, sep);
    const obj = {};
    headers.forEach((h, i) => (obj[h] = (cols[i] ?? '').trim()));
    return obj;
  });
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
    const codigo = pick(r, ['codigo', 'código', 'cod']) || String(idx + 1);
    const descricao =
      pick(r, ['descricao', 'descrição', 'nome', 'conta']) ||
      firstNonEmpty(r) ||
      `Conta ${idx + 1}`;
    return { id: codigo, codigo, descricao, subcontas: [] };
  });
}

function buildTree(rows) {
  const items = rows.map((r, idx) => {
    const codigo = pick(r, ['codigo', 'código', 'cod']) || String(idx + 1);
    const descricao =
      pick(r, ['descricao', 'descrição', 'nome', 'conta']) ||
      firstNonEmpty(r) ||
      `Conta ${idx + 1}`;
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

/* -------------------------------------------------------
   Persistência simples (cache último sucesso)
------------------------------------------------------- */
const LS_KEY = 'plano_contas_cache_v1';
function saveCache(modelo, data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ modelo, data }));
  } catch {}
}
function loadCache(modelo) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (String(parsed?.modelo) === String(modelo) && Array.isArray(parsed?.data)) {
      return parsed.data;
    }
  } catch {}
  return null;
}

/* -------------------------------------------------------
   Serviço principal
   - modelo: 1 (simplificado) | 2 (detalhado)
------------------------------------------------------- */
export async function getPlanoContas(modelo = 1) {
  // monta URL respeitando PUBLIC_URL (hosting em subpath)
  const base = (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) || '';
  const path = FILES[modelo];
  const url = `${base}${path}${path.includes('?') ? '&' : '?'}cb=${Date.now()}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar ${url}`);
    const text = await res.text();

    const rows = csvToRows(text);
    const data = modelo === 1 ? buildFlat(rows) : buildTree(rows);

    if (!data || data.length === 0) {
      // CSV vazio => fallback mock + cache
      const mock = modelo === 1 ? MOCK_SIMPLIFICADO : MOCK_DETALHADO;
      saveCache(modelo, mock);
      return mock;
    }

    saveCache(modelo, data);
    return data;
  } catch (err) {
    // tenta cache e, por fim, mock
    const cached = loadCache(modelo);
    if (cached) return cached;
    return modelo === 1 ? MOCK_SIMPLIFICADO : MOCK_DETALHADO;
  }
}
