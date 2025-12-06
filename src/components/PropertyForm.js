import React, { useEffect, useState, useMemo } from 'react';
import './PropertyForm.css';
import { createProperty, updateProperty, getProperty } from '../services/propriedadeService';

function PropertyForm({ onSaveSuccess }) {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const isEdit = useMemo(() => params.get('edit') === 'true', [params]);

  const [form, setForm] = useState({
    name: '',
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

  useEffect(() => {
    if (!isEdit) return;

    const id = params.get('idpropriedade');
    if (!id) return;

    const fetchPropriedade = async () => {
      try {
        const res = await getProperty(id);
        const data = res.data ?? res;

        const formatCep = data.cep
          ? String(data.cep).replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2')
          : '';

        setForm({
          name: data.descricao || '',
          telefone: data.telefone || '',
          rua: data.logradouro || '',
          numero: data.numero != null ? String(data.numero) : '',
          bairro: data.bairro || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
          cep: formatCep,
          complemento: data.complemento || '',
        });
      } catch (err) {
        console.error('Erro ao buscar propriedade:', err);
      }
    };

    fetchPropriedade();
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
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      }));
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const validarCampos = () => {
    const obrigatorios = [
      'name',
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
      const valor = form[campo];
      const texto = String(valor ?? '').trim();
      if (!texto) {
        novosErros[campo] = 'Campo obrigatório';
      }
    });

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    const cepSemTraco = form.cep.replace(/-/g, '');

    const payload = {
      descricao: form.name,
      telefone: form.telefone,
      logradouro: form.rua,
      numero: form.numero ? parseInt(form.numero, 10) : null,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
      cep: cepSemTraco,
      complemento: form.complemento,
    };

    try {
      if (isEdit) {
        const id = params.get('idpropriedade');
        if (!id) {
          alert('ID da propriedade não encontrado na URL!');
          return;
        }

        await updateProperty(id, payload);
        alert('Propriedade editada com sucesso!');
      } else {
        await createProperty(payload);
        alert('Propriedade cadastrada com sucesso!');
      }

      if (typeof onSaveSuccess === 'function') {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar propriedade:', error);

      if (error.response) {
        alert(`Erro ao salvar propriedade: ${JSON.stringify(error.response.data)}`);
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
      <h3>{isEdit ? 'Editar propriedade' : 'Cadastrar propriedades'}</h3>
      <form className="form-section" onSubmit={handleSubmit}>
        {renderInput('name', 'Nome (descrição)')}

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
          {isEdit ? 'Salvar alterações' : 'Adicionar propriedade'}
        </button>
      </form>
    </div>
  );
}

export default PropertyForm;
