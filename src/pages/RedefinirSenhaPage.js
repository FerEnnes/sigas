import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LoginPage.css'; 
import logo from '../assets/Logo.png';
import imagemRural from '../assets/adult-harvesting-coffee1.jpg';

function RedefinirSenhaPage() {
  const { uid, token } = useParams(); // Token do link enviado por email
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const validarSenha = (senha) => {
    // Regras de senha forte
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (!validarSenha(novaSenha)) {
      setErro('A senha deve ter pelo menos 8 caracteres, incluindo número, letra maiúscula e símbolo.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/redefinir-senha/${uid}/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha: novaSenha }),
      });

      // BACKEND (Django):
      // Endpoint deve validar o token e atualizar a senha do usuário

      if (!res.ok) {
        setErro('Token inválido ou expirado. Solicite nova recuperação.');
        return;
      }

      setMensagem('Senha redefinida com sucesso! Redirecionando para login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setErro('Erro ao redefinir a senha. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Nova senha</h2>

        <form onSubmit={handleSubmit}>
          <label>Nova senha</label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="••••••••"
            required
          />

          <label>Confirmar senha</label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="••••••••"
            required
          />

          {erro && <p className="error-msg">{erro}</p>}
          {mensagem && <p style={{ color: 'green', fontSize: 13 }}>{mensagem}</p>}

          <button type="submit">Redefinir senha</button>
        </form>
      </div>

      <div className="login-right">
        <img src={imagemRural} alt="Imagem rural" className="login-background" />
      </div>
    </div>
  );
}

export default RedefinirSenhaPage;
