import React from 'react';
import Sidebar from '../components/Sidebar';

function GerminAiPage() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f5f6f8',
        fontFamily: "'Nunito', Helvetica, sans-serif",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: '32px 40px',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#333',
          }}
        >
          Assistente GerminAI
        </h1>

        <p
          style={{
            marginBottom: '24px',
            color: '#666',
          }}
        >
          Chatbot para apoiar o planejamento de agricultura sintrópica.
        </p>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            padding: '8px',
            height: 'calc(100vh - 140px)',
            boxSizing: 'border-box',
          }}
        >
          <iframe
            src="https://germinai.streamlit.app/?embed=true"
            title="Assistente GerminAI"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default GerminAiPage;

