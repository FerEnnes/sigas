import React, { useEffect, useState, useMemo } from 'react';
import './SupplierForm.css'; 
import { createClient, updateClient, getClient } from '../services/clienteService';

function ClienteForm({ onSaveSuccess }) {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const isEdit = useMemo(() => params.get('edit') === 'true', [params]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
  if (isEdit) {
    const id = params.get('idcliente');
    if (!id) return;

    const fetchCliente = async () => {
      try {
        const res = await getClient(id);
        const data = res.data;

        const formatCep = data.cep?.replace(/\D/g, '')
          .replace(/^(\d{5})(\d)/, '$1-$2');

        setForm({
          name: data.nome || '',
          email: data.email || '',
          cpf: data.cpf_cnpj || '',
          telefone: '',
          rua: data.logradouro || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cep: formatCep || '',
          cidade: data.cidade || '',
          estado: data.estado || ''
        });
      } catch (err) {
        console.error('Erro ao buscar cliente:', err);
      }
    };

    fetchCliente();
  }
}, [isEdit, params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})/, '$1-$2')
        .substring(0, 15);
      setForm({ ...form, telefone: formatted });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) return;
      setForm((prev) => ({
        ...prev,
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf
      }));
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const handleCNPJBlur = async () => {
    const cnpj = form.cpf.replace(/\D/g, '');
    if (cnpj.length !== 14) return;
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (!res.ok) throw new Error('CNPJ não encontrado');
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        name: data.razao_social || prev.name,
        rua: data.logradouro || prev.rua,
        bairro: data.bairro || prev.bairro,
        cidade: data.municipio || prev.cidade,
        estado: data.uf || prev.estado,
        cep: data.cep?.replace(/\D/g, '') || prev.cep
      }));
    } catch (err) {
      console.error('Erro ao buscar CNPJ:', err);
    }
  };

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev >= 10) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev >= 10) rev = 0;
    return rev === parseInt(cpf.charAt(10));
  };

  const validateCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    let t = cnpj.length - 2;
    const d1 = parseInt(cnpj.charAt(t));
    const d2 = parseInt(cnpj.charAt(t + 1));
    const calc = (x) => {
      let n = cnpj.substring(0, x);
      let y = x - 7;
      let s = 0;
      for (let i = x; i >= 1; i--) {
        s += n.charAt(x - i) * y--;
        if (y < 2) y = 9;
      }
      let r = 11 - (s % 11);
      return r > 9 ? 0 : r;
    };
    return calc(t) === d1 && calc(t + 1) === d2;
  };

  const validarCampos = () => {
    const obrigatorios = ['name', 'email', 'cpf', 'telefone', 'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'];
    const novosErros = {};
    obrigatorios.forEach((campo) => {
      if (!form[campo]?.trim()) novosErros[campo] = 'Campo obrigatório';
    });
    const isCPF = form.cpf.replace(/\D/g, '').length === 11;
    const isCNPJ = form.cpf.replace(/\D/g, '').length === 14;
    if (!isCPF && !isCNPJ) {
      novosErros.cpf = 'Informe CPF (11 dígitos) ou CNPJ (14 dígitos)';
    } else if (isCPF && !validateCPF(form.cpf)) {
      novosErros.cpf = 'CPF inválido';
    } else if (isCNPJ && !validateCNPJ(form.cpf)) {
      novosErros.cpf = 'CNPJ inválido';
    }
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    const payload = {
      nome: form.name,
      email: form.email,
      cpf_cnpj: form.cpf,
      telefone: form.telefone,
      logradouro: form.rua,
      numero: form.numero,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
      cep: form.cep,
      complemento: form.complemento
    };

    try {
      if (isEdit) {
        const id = params.get('idcliente');
        await updateClient(id, payload);
        alert('Cliente editado com sucesso!');
      } else {
        await createClient(payload);
        alert('Cliente cadastrado com sucesso!');
      }

      if (typeof onSaveSuccess === 'function') {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente. Verifique os dados e tente novamente.');
    }
  };

  const renderInput = (name, label, onBlur) => (
    <div className="required-wrapper">
      <label htmlFor={name}>{label}</label>
      <span className="asterisk">*</span>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        onBlur={onBlur}
      />
      {errors[name] && <small className="error">{errors[name]}</small>}
    </div>
  );

  return (
    <div className="form-container">
      <h3>{isEdit ? 'Editar cliente' : 'Cadastrar cliente'}</h3>
      <form className="form-section" onSubmit={handleSubmit}>
        {renderInput('name', 'Nome Completo')}
        {renderInput('cpf', 'CPF / CNPJ', handleCNPJBlur)}
        {renderInput('email', 'Email')}

        <div className="input-row">
          <div className="telefone-field">
            {renderInput('telefone', 'Telefone')}
          </div>
          <div className="cep-field">
            {renderInput('cep', 'CEP', handleCepBlur)}
          </div>
        </div>

        {renderInput('rua', 'Logradouro')}

        <div className="input-row">
          {renderInput('numero', 'Número')}
          {renderInput('complemento', 'Complemento')}
        </div>

        {renderInput('bairro', 'Bairro')}
        {renderInput('cidade', 'Cidade')}
        {renderInput('estado', 'Estado')}

        <p className="note-obrigatorio">* campo obrigatório</p>
        <button type="submit">{isEdit ? 'Salvar alterações' : 'Adicionar cliente'}</button>
      </form>
    </div>
  );
}

export default ClienteForm;
