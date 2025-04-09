import React, { useState } from 'react';
import './LoginPage.css'; 
import imagemRural from '../assets/adult-harvesting-coffee.jpg'; 
import logo from '../assets/Logo.png';

function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      const res = await fetch('/api/recuperar-senha/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // 🔗 BACKEND DJANGO:
      // Endpoint deve validar o email, gerar token e enviar link via email

      if (!res.ok) {
        setErro('Email não encontrado ou erro na solicitação.');
        return;
      }

      setMensagem('Se o email estiver cadastrado, enviaremos instruções para redefinir sua senha.');
    } catch (err) {
      console.error(err);
      setErro('Erro ao tentar recuperar senha. Tente novamente.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Recuperação da conta</h2>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@email.com"
          />

          {mensagem && <p style={{ color: 'green', fontSize: 13 }}>{mensagem}</p>}
          {erro && <p className="error-msg">{erro}</p>}

          <button type="submit">Criar nova senha</button>
        </form>
      </div>

      <div className="login-right">
        <img src={imagemRural} alt="Imagem rural" className="login-background" />
      </div>
    </div>
  );
}

export default RecuperarSenhaPage;
