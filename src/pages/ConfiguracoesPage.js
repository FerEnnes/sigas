import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import './ConfiguracoesPage.css';

function ConfiguracoesPage() {
  const nome = localStorage.getItem('nome') || 'Usuário';

  const [form, setForm] = useState({
    nome,
    email: 'usuario@email.com',
    telefone: '',
    senha: '',
    cpf: '000.000.000-00',
    tipoUsuario: 'Admin',
    cep: '',
    numero: '',
    rua: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const stringAvatar = (name) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return {
      children: initials,
      sx: {
        bgcolor: '#f8d7da',
        color: '#721c24',
        width: 75,
        height: 75,
        fontWeight: 'bold',
        fontSize: 22,
      }
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      }));
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔗 BACKEND FUTURO: substituir pela chamada real
      console.log('Dados enviados:', form);
      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleFotoClick = () => {
    // 🔗 BACKEND FUTURO: integração com upload
    toast.info('Funcionalidade de upload ainda será integrada.');
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="config-wrapper">
        <div className="config-header">
          <h2>Configurações do Perfil</h2>
        </div>

        <div className="config-form-wrapper">
          <div className="config-avatar-section">
            <Avatar {...stringAvatar(form.nome)} />
            <div>
              <strong>{form.nome}</strong>
              <p>{form.email}</p>
              <button className="small-btn" type="button" onClick={handleFotoClick}>Alterar foto</button>
            </div>
          </div>

          <form className="config-form" onSubmit={handleSubmit}>
            <label>Nome</label>
            <input name="nome" value={form.nome} onChange={handleChange} required />

            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} required />

            <label>Telefone</label>
            <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-0000" />

            <label>Nova Senha</label>
            <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="Deixe em branco se não quiser trocar" />

            <label>CPF</label>
            <input name="cpf" value={form.cpf} readOnly />

            <label>Tipo de Usuário</label>
            <input name="tipoUsuario" value={form.tipoUsuario} readOnly />

            <div className="row">
              <div>
                <label>CEP</label>
                <input name="cep" value={form.cep} onChange={handleChange} onBlur={handleCepBlur} />
              </div>
              <div>
                <label>Número</label>
                <input name="numero" value={form.numero} onChange={handleChange} />
              </div>
            </div>

            <label>Rua</label>
            <input name="rua" value={form.rua} onChange={handleChange} />

            <label>Complemento</label>
            <input name="complemento" value={form.complemento} onChange={handleChange} />

            <label>Bairro</label>
            <input name="bairro" value={form.bairro} onChange={handleChange} />

            <label>Cidade</label>
            <input name="cidade" value={form.cidade} onChange={handleChange} />

            <label>Estado</label>
            <input name="estado" value={form.estado} onChange={handleChange} />

            <button type="submit" className="save-btn">Salvar alterações</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracoesPage;
