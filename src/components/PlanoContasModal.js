import React, { useState } from 'react';
import './PlanoContasModal.css';

/**
 * Modal para criar ou editar uma conta do plano.
 * @param {Object} props
 * @param {Object|null} props.data - Conta a ser editada (ou null para nova).
 * @param {Function} props.onClose - Fecha o modal.
 * @param {Function} props.onSave - Salva nova ou editada.
 * @param {number} props.modelo - 1 = Simplificado | 2 = Detalhado (futuro uso).
 */
function PlanoContasModal({ data, onClose, onSave, modelo }) {
  const [descricao, setDescricao] = useState(data?.descricao || '');

  const isEdit = Boolean(data?.id);

  const handleSubmit = () => {
    if (!descricao.trim()) {
      alert('Descrição é obrigatória');
      return;
    }

    // Retorna os dados com ID se for edição
    const payload = { ...data, descricao };

    // Aqui será enviado ao backend futuramente
    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{isEdit ? 'Editar Conta' : 'Nova Conta'}</h3>

        <label>Descrição</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Caixa, Empréstimos..."
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSubmit}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default PlanoContasModal;
