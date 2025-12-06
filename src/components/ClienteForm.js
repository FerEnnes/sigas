import React, { useEffect, useState } from 'react';
import api, { parseApiError } from '../services/api';
import { toast } from 'react-toastify';

const toMoney = (n) => {
  const v = Number(n || 0);
  return Number.isFinite(v) ? v.toFixed(2) : '0.00';
};

export default function ContaForm({ conta, onSave, tipoConta }) {
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
  });

  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [propriedades, setPropriedades] = useState([]);
  const [planos, setPlanos] = useState([]);

  // Preenche o form quando for edição
  useEffect(() => {
    if (conta) {
      setForm({
        id: conta.idcontapagar ?? null,
        descricao: conta.descricao ?? '',
        valorParcela: conta.valorparcela ?? '',
        parcelas: conta.numeroparcela ?? 1,
        total: 0, // recalcula abaixo
        vencimento: conta.datavencimento ?? '',
        quitacao: conta.dataquitacao ?? '',
        juros: conta.valorjuros ?? 0,
        desconto: conta.valordesconto ?? 0,
        // aqui guardo IDs
        propriedade: conta.idpropriedade ?? '',
        fornecedor: conta.idfornecedor ?? '',
        cliente: '', // só vai ser usado em Contas a receber
        planoContas: conta.idplanocontas ?? '',
      });
    } else {
      setForm({
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
      });
    }
  }, [conta]);

  // Calcula total quando valor/juros/desconto/parcelas mudam
  useEffect(() => {
    const valor = Number(form.valorParcela || 0);
    const juros = Number(form.juros || 0);
    const desconto = Number(form.desconto || 0);
    const parcelas = Math.max(1, parseInt(form.parcelas || 1, 10));
    const total = (valor + juros - desconto) * parcelas;
    setForm((prev) => ({ ...prev, total: Number.isFinite(total) ? total : 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.valorParcela, form.juros, form.desconto, form.parcelas]);

  // Carrega combos do backend
  useEffect(() => {
    (async () => {
      try {
        const [cRes, fRes, pRes, pcRes] = await Promise.all([
          api.get('clientes/'),
          api.get('fornecedores/'),
          api.get('propriedades/'),
          api.get('plano-contas/'),
        ]);
        setClientes(Array.isArray(cRes.data) ? cRes.data : []);
        setFornecedores(Array.isArray(fRes.data) ? fRes.data : []);
        setPropriedades(Array.isArray(pRes.data) ? pRes.data : []);
        setPlanos(Array.isArray(pcRes.data) ? pcRes.data : []);
      } catch (err) {
        console.error(err);
        toast.error(`Falha ao carregar listas: ${parseApiError(err)}`);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Monta o payload exatamente no formato do serializer APagar
  const buildPayload = () => {
    const base = {
      descricao: form.descricao?.trim(),
      valorparcela: parseFloat(form.valorParcela || 0),
      numeroparcela: parseInt(form.parcelas || 1, 10),
      datavencimento: form.vencimento || null,
      dataquitacao: form.quitacao || null,
      valorjuros: parseFloat(form.juros || 0),
      valordesconto: parseFloat(form.desconto || 0),
      idpropriedade: form.propriedade ? Number(form.propriedade) : null,
      idfornecedor:
        tipoConta === 'pagar' && form.fornecedor
          ? Number(form.fornecedor)
          : null,
      idplanocontas: form.planoContas
        ? Number(form.planoContas)
        : null,
    };

    if (form.id) {
      base.idcontapagar = form.id;
    }

    return base;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.descricao.trim()) {
      toast.error('Descrição é obrigatória');
      return;
    }
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
          <option
            key={p.idpropriedade ?? p.id}
            value={p.idpropriedade ?? p.id}
          >
            {p.descricao}
          </option>
        ))}
      </select>

      {tipoConta === 'receber' ? (
        <>
          <label>Cliente</label>
          <select
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
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
              <option
                key={f.idfornecedor ?? f.id}
                value={f.idfornecedor ?? f.id}
              >
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
          <option
            key={pc.idplanocontas ?? pc.id}
            value={pc.idplanocontas ?? pc.id}
          >
            {pc.descricao}
          </option>
        ))}
      </select>

      <button type="submit" className="salvar-btn">
        {conta
          ? 'Salvar alterações'
          : `Adicionar conta a ${
              tipoConta === 'receber' ? 'receber' : 'pagar'
            }`}
      </button>
    </form>
  );
}
