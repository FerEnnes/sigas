// src/components/ContaForm.js
import React, { useEffect, useState } from 'react';

function toMoney(n) {
  const v = Number(n || 0);
  return isFinite(v) ? v.toFixed(2) : '0.00';
}

export default function ContaForm({
  conta,
  onSave,
  tipoConta, // 'pagar' | 'receber'
  // listas vindas da página (também mock)
  clientes = [],
  fornecedores = [],
  propriedades = [],
  planos = [],
}) {
  const [form, setForm] = useState({
    id: null,
    descricao: '',
    valorParcela: '',
    parcelas: 1,
    total: 0,
    vencimento: '',
    quitacao: '',
    juros: 0,
    desconto: 0,
    propriedade: '',
    fornecedor: '',
    cliente: '',
    planoContas: '',
    status: 'Ativa',
  });

  useEffect(() => {
    if (conta) {
      setForm({
        id: conta.id ?? null,
        descricao: conta.descricao ?? '',
        valorParcela: conta.valorParcela ?? conta.valor_parcela ?? '',
        parcelas: conta.parcelas ?? 1,
        total: conta.total ?? 0,
        vencimento: conta.vencimento ?? '',
        quitacao: conta.quitacao ?? '',
        juros: conta.juros ?? 0,
        desconto: conta.desconto ?? 0,
        propriedade: conta.propriedade ?? '',
        fornecedor: conta.fornecedor ?? '',
        cliente: conta.cliente ?? '',
        planoContas: conta.planoContas ?? conta.plano_contas ?? '',
        status: conta.status ?? 'Ativa',
      });
    } else {
      setForm((prev) => ({ ...prev, id: null, status: 'Ativa' }));
    }
  }, [conta]);

  // recalcula total quando valor/juros/desconto/parcelas mudam
  useEffect(() => {
    const valor = Number(form.valorParcela || 0);
    const juros = Number(form.juros || 0);
    const desconto = Number(form.desconto || 0);
    const parcelas = Math.max(1, parseInt(form.parcelas || 1, 10));
    const total = (valor + juros - desconto) * parcelas;
    setForm((prev) => ({ ...prev, total: isFinite(total) ? total : 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.valorParcela, form.juros, form.desconto, form.parcelas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e) => {
  e.preventDefault();
  const payload = {
    ...form,
    status: form.status || 'Ativa',
    parcelas: Number(form.parcelas || 1),
    valorParcela: Number(form.valorParcela || 0),
    juros: Number(form.juros || 0),
    desconto: Number(form.desconto || 0),
    total: Number(form.total || 0),
  };
  onSave(payload);
};


  return (
    <form onSubmit={handleSubmit}>
      <label>Descrição</label>
      <input
        type="text"
        name="descricao"
        value={form.descricao}
        onChange={handleChange}
        required
      />

      <label>Valor da parcela</label>
      <input
        type="number"
        step="0.01"
        name="valorParcela"
        value={form.valorParcela}
        onChange={handleChange}
        required
      />

      <label>Nº de parcelas</label>
      <input
        type="number"
        name="parcelas"
        min="1"
        value={form.parcelas}
        onChange={handleChange}
      />

      <label>Total</label>
      <input type="text" value={`R$ ${toMoney(form.total)}`} readOnly />

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label>Data vencimento</label>
          <input
            type="date"
            name="vencimento"
            value={form.vencimento}
            onChange={handleChange}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Data quitação</label>
          <input
            type="date"
            name="quitacao"
            value={form.quitacao}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label>Juros</label>
          <input
            type="number"
            step="0.01"
            name="juros"
            value={form.juros}
            onChange={handleChange}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Desconto</label>
          <input
            type="number"
            step="0.01"
            name="desconto"
            value={form.desconto}
            onChange={handleChange}
          />
        </div>
      </div>

      <label>Propriedade</label>
      <select
        name="propriedade"
        value={form.propriedade}
        onChange={handleChange}
      >
        <option value="">Selecione</option>
        {propriedades.map((p) => (
          <option key={p.id} value={p.descricao}>
            {p.descricao}
          </option>
        ))}
      </select>

      {tipoConta === 'receber' ? (
        <>
          <label>Cliente</label>
          <select name="cliente" value={form.cliente} onChange={handleChange}>
            <option value="">Selecione</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <label>Fornecedor</label>
          <select
            name="fornecedor"
            value={form.fornecedor}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.nome}>
                {f.nome}
              </option>
            ))}
          </select>
        </>
      )}

      <label>Plano de contas</label>
      <select
        name="planoContas"
        value={form.planoContas}
        onChange={handleChange}
      >
        <option value="">Selecione</option>
        {planos.map((pc) => (
          <option key={pc.id} value={pc.descricao}>
            {pc.descricao}
          </option>
        ))}
      </select>

      <button type="submit" className="salvar-btn">
        {conta ? 'Salvar alterações' : `Adicionar conta a ${tipoConta === 'receber' ? 'receber' : 'pagar'}`}
      </button>
    </form>
  );
}



/*import React, { useEffect, useState } from 'react';
import api, { parseApiError } from '../services/api';
import { toast } from 'react-toastify';


function ContaForm({ conta, onSave, tipoConta }) {
  const [form, setForm] = useState({
    id: null,
    descricao: '',
    valorParcela: '',
    parcelas: 1,
    total: 0,
    vencimento: '',
    quitacao: '',
    juros: 0,
    desconto: 0,
    propriedade: '',
    fornecedor: '',
    cliente: '',
    planoContas: '',
    status: 'Ativa',
  });

  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [propriedades, setPropriedades] = useState([]);
  const [planos, setPlanos] = useState([]);

  // Preenche o form quando editar
  useEffect(() => {
    if (conta) {
      setForm({
        id: conta.id ?? null,
        descricao: conta.descricao ?? '',
        valorParcela: conta.valor_parcela ?? conta.valorParcela ?? '',
        parcelas: conta.parcelas ?? 1,
        total: conta.total ?? 0,
        vencimento: conta.vencimento ?? '',
        quitacao: conta.quitacao ?? '',
        juros: conta.juros ?? 0,
        desconto: conta.desconto ?? 0,
        propriedade: conta.propriedade ?? '',
        fornecedor: conta.fornecedor ?? '',
        cliente: conta.cliente ?? '',
        planoContas: conta.plano_contas ?? conta.planoContas ?? '',
        status: conta.status ?? 'Ativa',
      });
    } else {
      setForm((prev) => ({ ...prev, id: null }));
    }
  }, [conta]);

  // Calcula total sempre que campos relacionados mudarem
  useEffect(() => {
    const valor = parseFloat(form.valorParcela || 0);
    const juros = parseFloat(form.juros || 0);
    const desconto = parseFloat(form.desconto || 0);
    const parcelas = parseInt(form.parcelas || 1, 10);
    const total = (valor + juros - desconto) * parcelas;
    setForm((prev) => ({ ...prev, total: isFinite(total) ? total : 0 }));
  }, [form.valorParcela, form.juros, form.desconto, form.parcelas]);

  // Carrega combos do backend
  useEffect(() => {
    (async () => {
      try {
        const [cRes, fRes, pRes, pcRes] = await Promise.all([
          api.get('clientes/'),
          api.get('fornecedores/'),
          api.get('propriedades/'),
          api.get('plano-de-contas/'),
        ]);
        setClientes(Array.isArray(cRes.data) ? cRes.data : []);
        setFornecedores(Array.isArray(fRes.data) ? fRes.data : []);
        setPropriedades(Array.isArray(pRes.data) ? pRes.data : []);
        setPlanos(Array.isArray(pcRes.data) ? pcRes.data : []);
      } catch (err) {
        toast.error(`Falha ao carregar listas: ${parseApiError(err)}`);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Normaliza para o contrato do backend
  const buildPayload = () => ({
    id: form.id ?? undefined,
    descricao: form.descricao,
    valor_parcela: parseFloat(form.valorParcela || 0),
    parcelas: parseInt(form.parcelas || 1, 10),
    total: parseFloat(form.total || 0),
    vencimento: form.vencimento || null,
    quitacao: form.quitacao || null,
    juros: parseFloat(form.juros || 0),
    desconto: parseFloat(form.desconto || 0),
    // Obs: se seu backend espera IDs, troque value dos <option> para id e envie os IDs aqui
    propriedade: form.propriedade || null,
    fornecedor: tipoConta === 'pagar' ? (form.fornecedor || null) : null,
    cliente: tipoConta === 'receber' ? (form.cliente || null) : null,
    plano_contas: form.planoContas || null,
    status: form.status || 'Ativa',
    tipo: tipoConta, // útil se o backend usa o mesmo endpoint/modelo
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(buildPayload());
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Descrição</label>
      <input
        type="text"
        name="descricao"
        value={form.descricao}
        onChange={handleChange}
        required
      />

      <label>Valor da parcela</label>
      <input
        type="number"
        name="valorParcela"
        value={form.valorParcela}
        onChange={handleChange}
        min="0"
        step="0.01"
        required
      />

      <label>Nº de parcelas</label>
      <input
        type="number"
        name="parcelas"
        value={form.parcelas}
        onChange={handleChange}
        min="1"
      />

      <label>Total</label>
      <input type="text" value={`R$ ${Number(form.total).toFixed(2)}`} readOnly />

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <label>Data vencimento</label>
          <input
            type="date"
            name="vencimento"
            value={form.vencimento || ''}
            onChange={handleChange}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Data quitação</label>
          <input
            type="date"
            name="quitacao"
            value={form.quitacao || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <label>Juros</label>
          <input
            type="number"
            name="juros"
            value={form.juros}
            onChange={handleChange}
            step="0.01"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Desconto</label>
          <input
            type="number"
            name="desconto"
            value={form.desconto}
            onChange={handleChange}
            step="0.01"
          />
        </div>
      </div>

      <label>Propriedade</label>
      <select
        name="propriedade"
        value={form.propriedade || ''}
        onChange={handleChange}
      >
        <option value="">Selecione</option>
        {propriedades.map((p) => (
          <option key={p.idpropriedade ?? p.id ?? p.descricao} value={p.descricao}>
            {p.descricao}
          </option>
        ))}
      </select>

      {tipoConta === 'receber' ? (
        <>
          <label>Cliente</label>
          <select
            name="cliente"
            value={form.cliente || ''}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {clientes.map((c) => (
              <option key={c.idcliente ?? c.id ?? c.nome} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <label>Fornecedor</label>
          <select
            name="fornecedor"
            value={form.fornecedor || ''}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {fornecedores.map((f) => (
              <option key={f.idfornecedor ?? f.id ?? f.nome} value={f.nome}>
                {f.nome}
              </option>
            ))}
          </select>
        </>
      )}

      <label>Plano de contas</label>
      <select
        name="planoContas"
        value={form.planoContas || ''}
        onChange={handleChange}
      >
        <option value="">Selecione</option>
        {planos.map((pc) => (
          <option
            key={pc.idplanocontas ?? pc.id ?? pc.descricao}
            value={pc.descricao}
          >
            {pc.descricao}
          </option>
        ))}
      </select>

      <button type="submit" className="salvar-btn">
        {conta ? 'Salvar alterações' : `Adicionar conta a ${tipoConta === 'receber' ? 'receber' : 'pagar'}`}
      </button>
    </form>
  );
}

export default ContaForm;

*/


/*import React, { useEffect, useState } from 'react';

function ContaForm({ conta, onSave, tipoConta }) {
  const [form, setForm] = useState({
    id: null,
    descricao: '',
    valorParcela: '',
    parcelas: 1,
    total: 0,
    vencimento: '',
    quitacao: '',
    juros: 0,
    desconto: 0,
    propriedade: '',
    fornecedor: '',
    cliente: '',
    planoContas: ''
  });

  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [propriedades, setPropriedades] = useState([]);
  const [planos, setPlanos] = useState([]);

  useEffect(() => {
    if (conta) setForm({ ...conta });
  }, [conta]);

  useEffect(() => {
    const valor = parseFloat(form.valorParcela || 0);
    const juros = parseFloat(form.juros || 0);
    const desconto = parseFloat(form.desconto || 0);
    const parcelas = parseInt(form.parcelas || 1);
    const total = (valor + juros - desconto) * parcelas;
    setForm((prev) => ({ ...prev, total }));
  }, [form.valorParcela, form.juros, form.desconto, form.parcelas]);

  useEffect(() => {
    fetch('/api/clientes/').then(res => res.json()).then(setClientes);
    fetch('/api/fornecedores/').then(res => res.json()).then(setFornecedores);
    fetch('/api/propriedades/').then(res => res.json()).then(setPropriedades);
    fetch('/api/plano-de-contas/').then(res => res.json()).then(setPlanos);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Descrição</label>
      <input type="text" name="descricao" value={form.descricao} onChange={handleChange} required />

      <label>Valor da parcela</label>
      <input type="number" name="valorParcela" value={form.valorParcela} onChange={handleChange} required />

      <label>Nº de parcelas</label>
      <input type="number" name="parcelas" value={form.parcelas} onChange={handleChange} min="1" />

      <label>Total</label>
      <input type="text" value={`R$ ${form.total.toFixed(2)}`} readOnly />

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <label>Data vencimento</label>
          <input type="date" name="vencimento" value={form.vencimento} onChange={handleChange} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Data quitação</label>
          <input type="date" name="quitacao" value={form.quitacao} onChange={handleChange} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <label>Juros</label>
          <input type="number" name="juros" value={form.juros} onChange={handleChange} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Desconto</label>
          <input type="number" name="desconto" value={form.desconto} onChange={handleChange} />
        </div>
      </div>

      <label>Propriedade</label>
      <select name="propriedade" value={form.propriedade} onChange={handleChange}>
        <option value="">Selecione</option>
        {propriedades.map(p => (
          <option key={p.idpropriedade} value={p.descricao}>{p.descricao}</option>
        ))}
      </select>

      {tipoConta === 'receber' ? (
        <>
          <label>Cliente</label>
          <select name="cliente" value={form.cliente} onChange={handleChange}>
            <option value="">Selecione</option>
            {clientes.map(c => (
              <option key={c.idcliente} value={c.nome}>{c.nome}</option>
            ))}
          </select>
        </>
      ) : (
        <>
          <label>Fornecedor</label>
          <select name="fornecedor" value={form.fornecedor} onChange={handleChange}>
            <option value="">Selecione</option>
            {fornecedores.map(f => (
              <option key={f.idfornecedor} value={f.nome}>{f.nome}</option>
            ))}
          </select>
        </>
      )}

      <label>Plano de contas</label>
      <select name="planoContas" value={form.planoContas} onChange={handleChange}>
        <option value="">Selecione</option>
        {planos.map(pc => (
          <option key={pc.idplanocontas} value={pc.descricao}>{pc.descricao}</option>
        ))}
      </select>

      <button type="submit" className="salvar-btn">
        {conta ? 'Salvar alterações' : `Adicionar conta a ${tipoConta === 'receber' ? 'receber' : 'pagar'}`}
      </button>
    </form>
  );
}

export default ContaForm;
*/
