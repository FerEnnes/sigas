import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../assets/Logo.png';
import imagemRural from '../assets/bg-fazenda.jpg';
import { toast } from 'react-toastify';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  //const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/api/token/', {
      username: username,
      password: senha,
    }).then((response) => {
      //toast.success('Login realizado com sucesso!');
      localStorage.setItem("token", response.data.access);
      window.location.href = "/dashboard";
    }).catch((error) => {
      console.error('Erro no login:', error);
      toast.error('Username ou senha inválidos!');
    });
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>SAAS AGRO LIGHT</h2>

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