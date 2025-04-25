import React, { useEffect, useState } from 'react';

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
      <select name="descricao" value={form.descricao} onChange={handleChange} required>
        <option value="">Selecione</option>
        <option value="Compra de sementes">Compra de sementes</option>
        <option value="Venda de soja">Venda de soja</option>
        <option value="Adubo">Adubo</option>
      </select>

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
        <option value="Fazenda Verde">Fazenda Verde</option>
        <option value="Sítio Bom Jesus">Sítio Bom Jesus</option>
      </select>

      {/* Alterna entre Cliente ou Fornecedor */}
      {tipoConta === 'receber' ? (
        <>
          <label>Cliente</label>
          <select name="cliente" value={form.cliente} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="Cliente A">Cliente A</option>
            <option value="Cliente B">Cliente B</option>
          </select>
        </>
      ) : (
        <>
          <label>Fornecedor</label>
          <select name="fornecedor" value={form.fornecedor} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="Fornecedor A">Fornecedor A</option>
            <option value="Fornecedor B">Fornecedor B</option>
          </select>
        </>
      )}

      <label>Plano de contas</label>
      <select name="planoContas" value={form.planoContas} onChange={handleChange}>
        <option value="">Selecione</option>
        <option value="Sementes para plantio">Sementes para plantio</option>
        <option value="Insumos gerais">Insumos gerais</option>
      </select>

      <button type="submit" className="salvar-btn">
        {conta ? 'Salvar alterações' : `Adicionar conta a ${tipoConta === 'receber' ? 'receber' : 'pagar'}`}
      </button>
    </form>
  );
}

export default ContaForm;
