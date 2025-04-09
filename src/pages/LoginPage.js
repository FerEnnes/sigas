import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../assets/Logo.png';
import imagemRural from '../assets/bg-fazenda.jpg';
import { toast } from 'react-toastify'; 
function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    //  MOCK temporário - remover quando backend estiver pronto
    if (email === 'admin@email.com' && senha === '123456') {
      const storage = lembrar ? localStorage : sessionStorage;
      storage.setItem('token', 'mock-token');
      storage.setItem('nome', 'Administrador');
      storage.setItem('tipoUsuario', '1');

      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
      return;
    }

    try {
      const res = await fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      //  BACKEND DJANGO:
      // POST /api/login/
      // body: { email, senha }
      // response: { token, usuario: { nome, tipoUsuario, redefinirSenha } }

      if (!res.ok) {
        toast.error('Usuário ou senha inválidos');
        return;
      }

      const data = await res.json();
      const storage = lembrar ? localStorage : sessionStorage;

      // Armazena dados no local/sessionStorage
      storage.setItem('token', data.token);
      storage.setItem('nome', data.usuario.nome);
      storage.setItem('tipoUsuario', data.usuario.tipoUsuario);

      // Redireciona caso precise alterar senha
      if (data.usuario.redefinirSenha) {
        toast.info('Redefina sua senha para continuar');
        navigate('/redefinir-senha');
        return;
      }

      toast.success('Login realizado com sucesso');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>SAAS AGRO LIGHT</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@email.com"
          />

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            required
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
          />

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={lembrar}
                onChange={() => setLembrar(!lembrar)}
              />
              Lembrar-me
            </label>
            <a href="/recuperar-senha">Esqueceu a senha?</a>
          </div>

          <button type="submit">Entrar</button>
        </form>
      </div>

      <div className="login-right">
        <img src={imagemRural} alt="Imagem rural" className="login-background" />
      </div>
    </div>
  );
}

export default LoginPage;
