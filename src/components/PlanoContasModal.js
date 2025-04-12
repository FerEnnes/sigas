import React, { useState } from 'react';
import './PlanoContasModal.css';

function PlanoContasModal({ data, onClose, onSave, modelo }) {
  const [descricao, setDescricao] = useState(data?.descricao || '');

  const isEdit = Boolean(data?.id);

  const handleSubmit = () => {
    if (!descricao.trim()) return alert('Descrição é obrigatória');
    onSave({ ...data, descricao });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{isEdit ? 'Editar Conta' : 'Nova Conta'}</h3>
        <label>Descrição</label>
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSubmit}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default PlanoContasModal;
