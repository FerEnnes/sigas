import React, { useEffect, useState, useMemo } from 'react';
import './SupplierForm.css';
import {
  createClient,
  updateClient,
  getClient,
} from '../services/clienteService';

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
    complemento: '',
  });

  const [errors, setErrors] = useState({});

  // Carregar dados do cliente quando for edição
  useEffect(() => {
    if (isEdit) {
      const id = params.get('idcliente');
      if (!id) return;

      const fetchCliente = async () => {
        try {
          const res = await getClient(id);
          const data = res.data ?? res;

          const formatCep = data.cep
            ?.replace(/\D/g, '')
            .replace(/^(\d{5})(\d)/, '$1-$2');

          setForm({
            name: data.nome || '',
            email: data.email || '',
            cpf: data.cpf_cnpj || '',
            telefone: data.telefone || '',
            rua: data.rua || data.logradouro || '',
            numero: data.numero?.toString() || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cep: formatCep || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
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

      setForm((prev) => ({ ...prev, telefone: formatted }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
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
        rua: prev.rua || data.logradouro,
        bairro: prev.bairro || data.bairro,
        cidade: prev.cidade || data.localidade,
        estado: prev.estado || data.uf,
      }));
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const validateCPF = (cpf) => {
    let cleaned = cpf.replace(/[^\d]+/g, '');
    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i += 1) {
      sum += parseInt(cleaned.charAt(i), 10) * (10 - i);
    }
    let rev = 11 - (sum % 11);
    if (rev >= 10) rev = 0;
    if (rev !== parseInt(cleaned.charAt(9), 10)) return false;

    sum = 0;
    for (let i = 0; i < 10; i += 1) {
      sum += parseInt(cleaned.charAt(i), 10) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev >= 10) rev = 0;

    return rev === parseInt(cleaned.charAt(10), 10);
  };

  const validateCNPJ = (cnpj) => {
    let cleaned = cnpj.replace(/[^\d]+/g, '');
    if (cleaned.length !== 14) return false;

    let t = cleaned.length - 2;
    let d1 = parseInt(cleaned.charAt(t), 10);
    let d2 = parseInt(cleaned.charAt(t + 1), 10);

    const calc = (x) => {
      let n = cleaned.substring(0, x);
      let y = x - 7;
      let s = 0;

      for (let i = x; i >= 1; i -= 1) {
        s += n.charAt(x - i) * y;
        y -= 1;
        if (y < 2) y = 9;
      }
      let r = 11 - (s % 11);
      return r > 9 ? 0 : r;
    };

    return calc(t) === d1 && calc(t + 1) === d2;
  };

  const validarCampos = () => {
    const obrigatorios = [
      'name',
      'email',
      'cpf',
      'telefone',
      'rua',
      'numero',
      'bairro',
      'cidade',
      'estado',
      'cep',
    ];

    const novosErros = {};

    obrigatorios.forEach((campo) => {
      if (!form[campo] || !String(form[campo]).trim()) {
        novosErros[campo] = 'Campo obrigatório';
      }
    });

    const digits = form.cpf.replace(/\D/g, '');
    const isCPF = digits.length === 11;
    const isCNPJ = digits.length === 14;

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

    const cepSemMascara = form.cep.replace(/\D/g, '');
    const cpfCnpjSemMascara = form.cpf.replace(/\D/g, '');

    const payload = {
      nome: form.name,
      email: form.email,
      cpf_cnpj: cpfCnpjSemMascara,
      telefone: form.telefone,
      rua: form.rua,
      numero: form.numero,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
      cep: cepSemMascara,
      complemento: form.complemento,
    };

    console.log('🔍 Enviando payload cliente:', payload);

    try {
      if (isEdit) {
        const id = params.get('idcliente');
        if (!id) {
          alert('ID do cliente não encontrado na URL!');
          return;
        }

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
      console.error('❌ Erro ao salvar cliente:', error);

      if (error.response) {
        alert(`Erro ao salvar cliente: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        alert('Erro de conexão com o servidor.');
      } else {
        alert('Erro desconhecido. Tente novamente.');
      }
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
        maxLength={name === 'cep' ? 9 : undefined}
      />
      {errors[name] && <small className="error">{errors[name]}</small>}
    </div>
  );

  return (
    <div className="form-container">
      <h3>{isEdit ? 'Editar cliente' : 'Cadastrar clientes'}</h3>
      <form className="form-section" onSubmit={handleSubmit}>
        {renderInput('name', 'Nome Completo')}
        {renderInput('cpf', 'CPF / CNPJ')}
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
        <button type="submit">
          {isEdit ? 'Salvar alterações' : 'Adicionar cliente'}
        </button>
      </form>
    </div>
  );
}

export default ClienteForm;
