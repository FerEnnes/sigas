import React, { useEffect, useMemo, useState } from 'react';
import './SupplierForm.css';
import { toast } from 'react-toastify';

function UsuarioForm() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const isEdit = useMemo(() => params.get('edit') === 'true', [params]);

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    tipoUsuario: '2'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      //  BACKEND: Substituir com GET real se for o caso
      setForm({
        nome: params.get('nome') || '',
        cpf: params.get('cpf') || '',
        email: params.get('email') || '',
        telefone: params.get('telefone') || '',
        cep: params.get('cep') || '',
        rua: params.get('rua') || '',
        numero: params.get('numero') || '',
        complemento: params.get('complemento') || '',
        bairro: params.get('bairro') || '',
        cidade: params.get('cidade') || '',
        estado: params.get('estado') || '',
        tipoUsuario: params.get('tipoUsuario') || '2'
      });
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
        estado: data.uf,
      }));
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
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

  const validarCampos = () => {
    const obrigatorios = [
      'nome', 'email', 'cpf', 'telefone',
      'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'
    ];
    const novosErros = {};

    obrigatorios.forEach((campo) => {
      if (!form[campo]?.trim()) {
        novosErros[campo] = 'Campo obrigatório';
      }
    });

    if (!validateCPF(form.cpf)) {
      novosErros.cpf = 'CPF inválido';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const gerarSenhaProvisoria = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      if (isEdit) {
        //  BACKEND: Atualização de usuário
        await fetch(`/api/usuarios/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        toast.success('Usuário atualizado com sucesso!');
      } else {
        // BACKEND: Criação de novo usuário com senha provisória
        const senhaProvisoria = gerarSenhaProvisoria();

        const payload = {
          ...form,
          senha: senhaProvisoria,            //  Envia senha provisória
          redefinirSenha: true               //  Backend força troca no primeiro login
        };

        const res = await fetch(`/api/usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Erro ao cadastrar usuário');

        toast.success(`Usuário cadastrado com sucesso! Senha provisória: ${senhaProvisoria}`);
        console.log('Senha provisória:', senhaProvisoria);
      }
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      toast.error('Erro ao salvar usuário');
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
      <h3>{isEdit ? 'Editar usuário' : 'Cadastrar usuário'}</h3>
      <form className="form-section" onSubmit={handleSubmit}>
        {renderInput('nome', 'Nome Completo')}
        {renderInput('cpf', 'CPF')}
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

        <div className="required-wrapper">
          <label htmlFor="tipoUsuario">Tipo de Usuário</label>
          <span className="asterisk">*</span>
          <select name="tipoUsuario" value={form.tipoUsuario} onChange={handleChange}>
            <option value="2">Comum</option>
            <option value="1">Admin</option>
          </select>
        </div>

        <p className="note-obrigatorio">* campo obrigatório</p>
        <button type="submit">
          {isEdit ? 'Salvar alterações' : 'Adicionar usuário'}
        </button>
      </form>
    </div>
  );
}

export default UsuarioForm;
