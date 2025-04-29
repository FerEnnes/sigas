import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import './NotificacoesPage.css';

function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    // BACKEND futuramente: buscar notificações do servidor
    // Exemplo de requisição (axios ou fetch):
    // fetch('/api/notificacoes', { headers: { Authorization: `Bearer ${token}` } })
    //   .then(res => res.json())
    //   .then(data => setNotificacoes(data))
    //   .catch(error => console.error('Erro ao carregar notificações:', error));

    // MOCK TEMPORÁRIO:
    setNotificacoes([
      { id: 1, titulo: 'Contas vencendo hoje', subtitulo: 'Contas a pagar' },
      { id: 2, titulo: 'Contas vencendo hoje', subtitulo: 'Contas a receber' },
      { id: 3, titulo: 'Atualizado para versão 2.3', subtitulo: 'Clique para ver as novas atualizações' },
    ]);
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <main className="notificacoes-container">
        <h2>Notificações</h2>

        <div className="lista-notificacoes">
          {notificacoes.length === 0 ? (
            <p>Nenhuma notificação encontrada.</p>
          ) : (
            notificacoes.map((notif) => (
              <div key={notif.id} className="notificacao-item">
                <div className="avatar-notificacao" />
                <div className="texto-notificacao">
                  <strong>{notif.titulo}</strong>
                  <p>{notif.subtitulo}</p>
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
