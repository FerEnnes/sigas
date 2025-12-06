import React, { useEffect, useMemo, useState } from 'react';
import './SupplierForm.css';
import { toast } from 'react-toastify';
import { getUser, createUser, updateUser, inactivateUser } from '../services/usuarioService';
import { useNavigate } from 'react-router-dom';

function UsuarioForm() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const isEdit = useMemo(() => params.get('edit') === 'true', [params]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
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
    tipousuario: '2',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const id = params.get('id');
      if (!id) return;

      const fetchUser = async () => {
        try {
          const res = await getUser(id);
          const data = res.data;

          const formatCep = data.cep?.replace(/\D/g, '')
            .replace(/^(\d{5})(\d)/, '$1-$2');

          setForm({
            username: data.username || '',
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            cpf: data.cpf || '',
            email: data.email || '',
            telefone: data.telefone || '',
            cep: formatCep || '',
            rua: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            estado: (data.estado || '').toUpperCase(),
            tipousuario: data.tipousuario?.toString() || '2',
          });
        } catch (err) {
          console.error('Erro ao buscar usuário:', err);
        }
      };

      fetchUser();
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
    } else if (name === 'estado') {
      // sempre UF com 2 letras maiúsculas
      setForm({ ...form, estado: value.toUpperCase().slice(0, 2) });
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
        estado: (data.uf || '').toUpperCase(),
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
      'username', 'first_name', 'last_name', 'email', 'cpf', 'telefone',
      'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'
    ];
    const novosErros = {};
    obrigatorios.forEach((campo) => {
      if (!form[campo]?.trim()) novosErros[campo] = 'Campo obrigatório';
    });

    const isCPF = form.cpf.replace(/\D/g, '').length === 11;
    if (!isCPF) {
      novosErros.cpf = 'Informe CPF (11 dígitos)';
    } else if (isCPF && !validateCPF(form.cpf)) {
      novosErros.cpf = 'CPF inválido';
    }

    if (form.estado.trim().length !== 2) {
      novosErros.estado = 'Informe a UF com 2 letras (ex.: SC)';
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

    const cepSemTraco = form.cep.replace(/-/g, '');

    const payload = {
      username: form.username,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      cpf: form.cpf,
      telefone: form.telefone,
      logradouro: form.rua,
      numero: form.numero,
      complemento: form.complemento,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado.toUpperCase().slice(0, 2),
      cep: cepSemTraco,
      tipousuario: parseInt(form.tipousuario, 10)
    };

    try {
      if (isEdit) {
        const id = params.get('id');
        if (!id) {
          toast.error('ID do usuário não encontrado!');
          return;
        }
        await updateUser(id, payload);
        toast.success('Usuário atualizado com sucesso!');
        navigate('/usuarios');
      } else {
        const senhaProvisoria = gerarSenhaProvisoria();

        const novoPayload = {
          ...payload,
          password: senhaProvisoria,
          redefinirSenha: true,
        };

        await createUser(novoPayload);
        toast.success(`Usuário cadastrado com sucesso! Senha provisória: ${senhaProvisoria}`);
        console.log('Senha provisória:', senhaProvisoria);
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      if (error.response) {
        console.error('Detalhes do erro:', error.response.data);
      }
      toast.error('Erro ao salvar usuário');
    }
  };

  const handleInactivate = async () => {
    const id = params.get('id');
    if (!id) {
      toast.error('ID do usuário não encontrado!');
      return;
    }

    try {
      await inactivateUser(id);
      toast.success('Usuário inativado com sucesso!');
      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao inativar usuário:', error);
      toast.error('Erro ao inativar usuário');
    }
  };

  const renderInput = (name, label, onBlur) => (
    <div className="required-wrapper">
      <label htmlFor={name}>
        {label}
        {name === 'estado' ? ' (UF)' : ''}
      </label>
      <span className="asterisk">*</span>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        onBlur={onBlur}
        maxLength={
          name === 'cep'
            ? 9
            : name === 'estado'
            ? 2
            : undefined
        }
      />
      {errors[name] && <small className="error">{errors[name]}</small>}
    </div>
  );

  return (
    <div className="form-container">
      <h3>{isEdit ? 'Editar usuário' : 'Cadastrar usuário'}</h3>
      <form className="form-section" onSubmit={handleSubmit}>
        {renderInput('username', 'Usuário')}
        {renderInput('first_name', 'Nome')}
        {renderInput('last_name', 'Sobrenome')}
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
          <label htmlFor="tipousuario">Tipo de Usuário</label>
          <span className="asterisk">*</span>
          <select name="tipousuario" value={form.tipousuario} onChange={handleChange}>
            <option value="2">Comum</option>
            <option value="1">Admin</option>
          </select>
        </div>

        <p className="note-obrigatorio">* campo obrigatório</p>

        <button type="submit">
          {isEdit ? 'Salvar alterações' : 'Adicionar usuário'}
        </button>

        {isEdit && (
          <button
            type="button"
            className="btn-inactivate"
            onClick={handleInactivate}
            style={{ marginLeft: '10px', backgroundColor: '#e74c3c', color: '#fff' }}
          >
            Inativar Usuário
          </button>
        )}
      </form>
    </div>
  );
}

export default UsuarioForm;
