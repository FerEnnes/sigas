import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import './ConfiguracoesPage.css';

const API_BASE = 'http://127.0.0.1:8000';

function ConfiguracoesPage() {
  const storedNome = localStorage.getItem('nome') || 'Usuário';
  const token = localStorage.getItem('token') || '';
  const userId = localStorage.getItem('userId') || '';

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nome: storedNome,
    email: '',
    telefone: '',
    senha: '',
    cpf: '',
    tipoUsuario: '',
    cep: '',
    numero: '',
    rua: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const stringAvatar = (name) => {
    const initials = (name || 'U')
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    return {
      children: initials || 'U',
      sx: {
        bgcolor: '#f8d7da',
        color: '#721c24',
        width: 75,
        height: 75,
        fontWeight: 'bold',
        fontSize: 22,
      },
    };
  };

  useEffect(() => {
    const loadUser = async () => {
      if (!token || !userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/usuarios/${userId}/`, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Erro ao buscar dados do usuário');
        }

        const data = await res.json();

        const nomeCompleto =
          (data.first_name || data.username || storedNome) +
          (data.last_name ? ` ${data.last_name}` : '');

        setForm((prev) => ({
          ...prev,
          nome: nomeCompleto,
          email: data.email || '',
          telefone: data.telefone || '',
          cpf: data.cpf || '',
          tipoUsuario: data.tipousuario === 1 ? 'Admin' : 'Comum',
          cep: data.cep || '',
          numero: data.numero || '',
          rua: data.logradouro || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
        }));
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar dados do perfil.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token, userId, storedNome]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepBlur = async () => {
    const cep = (form.cep || '').replace(/\D/g, '');
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

    if (!token || !userId) {
      toast.error('Sessão expirada. Faça login novamente.');
      return;
    }

    const payload = {
      first_name: form.nome, 
      email: form.email,
      telefone: form.telefone,
      logradouro: form.rua,
      numero: form.numero,
      complemento: form.complemento,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
      cep: form.cep,
    };

    if (form.senha) {
      payload.password = form.senha;
    }

    try {
      const res = await fetch(`${API_BASE}/api/usuarios/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Erro ao atualizar perfil:', errData);
        toast.error('Erro ao atualizar perfil.');
        return;
      }

      localStorage.setItem('nome', form.nome);

      toast.success('Perfil atualizado com sucesso!');

      setForm((prev) => ({ ...prev, senha: '' }));
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar perfil.');
    }
  };

  const handleFotoClick = () => {
    toast.info('Funcionalidade de upload ainda será integrada.');
  };

  if (loading) {
    return (
      <div className="app">
        <Sidebar />
        <div className="config-wrapper">
          <p>Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

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
              <button className="small-btn" type="button" onClick={handleFotoClick}>
                Alterar foto
              </button>
            </div>
          </div>

          <form className="config-form" onSubmit={handleSubmit}>
            <label>Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Telefone</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(47) 99999-0000"
            />

            <label>Nova Senha</label>
            <input
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              placeholder="Deixe em branco se não quiser trocar"
            />

            <label>CPF</label>
            <input name="cpf" value={form.cpf} readOnly />

            <label>Tipo de Usuário</label>
            <input name="tipoUsuario" value={form.tipoUsuario} readOnly />

            <div className="row">
              <div>
                <label>CEP</label>
                <input
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                />
              </div>
              <div>
                <label>Número</label>
                <input
                  name="numero"
                  value={form.numero}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label>Rua</label>
            <input
              name="rua"
              value={form.rua}
              onChange={handleChange}
            />

            <label>Complemento</label>
            <input
              name="complemento"
              value={form.complemento}
              onChange={handleChange}
            />

            <label>Bairro</label>
            <input
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
            />

            <label>Cidade</label>
            <input
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
            />

            <label>Estado</label>
            <input
              name="estado"
              value={form.estado}
              onChange={handleChange}
            />

            <button type="submit" className="save-btn">
              Salvar alterações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracoesPage;
