import React, { useState } from 'react';
import './LoginPage.css';
import logo from '../assets/Logo.png';
import imagemRural from '../assets/bg-fazenda.png';
import { toast } from 'react-toastify';

//  use o serviço
import { login as loginService } from '../services/authService';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // No DEMO isso já ignora o backend e grava admin_dev (tipo 1)
      await loginService({
        // passe os dois por compatibilidade
        email: username,
        username,
        password: senha,
        remember: lembrar,
      });

      // redireciona
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Erro no login:', err);
      toast.error('Username ou senha inválidos!');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>SIGAS</h2>

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Insira seu username. Exemplo: giovana"
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
            <label htmlFor="lembrar">
              <input
                id="lembrar"
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
