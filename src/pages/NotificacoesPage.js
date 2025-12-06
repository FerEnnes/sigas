import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import './NotificacoesPage.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      console.warn('Sem token para buscar notificações');
      setLoading(false);
      return;
    }

    const fetchNotificacoes = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/notificacoes/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        if (!resp.ok) {
          const text = await resp.text();
          console.error('Erro ao buscar notificações', resp.status, text);
          setNotificacoes([]);
          return;
        }

        const data = await resp.json();
        setNotificacoes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro geral ao carregar notificações', err);
        setNotificacoes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificacoes();
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <main className="notificacoes-container">
        <h2>Notificações</h2>

        <div className="lista-notificacoes">
          {loading ? (
            <p>Carregando...</p>
          ) : notificacoes.length === 0 ? (
            <p>Nenhuma notificação encontrada.</p>
          ) : (
            notificacoes.map((notif) => (
              <div key={notif.id} className="notificacao-item">
                <div className="avatar-notificacao" />
                <div className="texto-notificacao">
                  <strong>{notif.titulo}</strong>
                  <p>{notif.subtitulo}</p>
                  <small>
                    {(notif.tipo || 'sistema')}{' '}
                    {notif.created_at
                      ? ' · ' +
                        new Date(notif.created_at).toLocaleString('pt-BR')
                      : ''}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default NotificacoesPage;
