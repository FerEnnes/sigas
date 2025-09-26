import React, { useMemo, useState } from 'react';
import './PlanoContasModal.css';

/**
 * Campos suportados:
 * - descricao (string)
 * - tipo ( 'C' | 'D' )  // Crédito/Débito
 * - categoria ('Ativo' | 'Passivo' | 'Receita' | 'Despesa' | 'Patrimônio' | 'Outros')
 * - codigo (string)
 * - parentId (number|null) // conta-pai
 * - modelo (1 simplificado | 2 detalhado) [vem via prop]
 */
function PlanoContasModal({ data, onClose, onSave, modelo, contas = [] }) {
  const isEdit = Boolean(data?.id);

  const [descricao, setDescricao]   = useState(data?.descricao ?? '');
  const [tipo, setTipo]             = useState(data?.tipo ?? 'D');
  const [categoria, setCategoria]   = useState(data?.categoria ?? 'Outros');
  const [codigo, setCodigo]         = useState(data?.codigo ?? '');
  const [parentId, setParentId]     = useState(data?.parentId ?? '');

  // lista linear de contas para combo "Conta-pai"
  const flat = useMemo(() => {
    const out = [];
    const dfs = (nodes, depth=0) => {
      (nodes||[]).forEach(n => {
        out.push({ id:n.id, label:`${'— '.repeat(depth)}${n.descricao}` });
        if (Array.isArray(n.subcontas)) dfs(n.subcontas, depth+1);
      });
    };
    dfs(contas, 0);
    return out;
  }, [contas]);

  const handleSubmit = () => {
    if (!descricao.trim()) { alert('Descrição é obrigatória'); return; }

    const payload = {
      ...(data||{}),
      descricao: descricao.trim(),
      tipo,
      categoria,
      codigo: codigo.trim(),
      parentId: parentId ? Number(parentId) : null,
      modelo,
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{isEdit ? 'Editar Conta' : 'Nova Conta'}</h3>

        <label>Descrição *</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Caixa, Duplicatas a Receber…"
        />

        <div className="grid-2">
          <div>
            <label>Crédito/Débito *</label>
            <select value={tipo} onChange={(e)=>setTipo(e.target.value)}>
              <option value="D">Débito</option>
              <option value="C">Crédito</option>
            </select>
          </div>

          <div>
            <label>Código</label>
            <input
              value={codigo}
              onChange={(e)=>setCodigo(e.target.value)}
              placeholder="Ex: 1.1.01.01"
            />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label>Categoria *</label>
            <select value={categoria} onChange={(e)=>setCategoria(e.target.value)}>
              <option>Ativo</option>
              <option>Passivo</option>
              <option>Patrimônio</option>
              <option>Receita</option>
              <option>Despesa</option>
              <option>Outros</option>
            </select>
          </div>

          <div>
            <label>Conta-pai</label>
            <select value={parentId ?? ''} onChange={(e)=>setParentId(e.target.value)}>
              <option value="">(sem pai)</option>
              {flat.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSubmit}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default PlanoContasModal;




/*import React, { useState } from 'react';
import './PlanoContasModal.css';

/*
 * Modal para criar ou editar uma conta do plano.
 * @param {Object} props
 * @param {Object|null} props.data - Conta a ser editada (ou null para nova).
 * @param {Function} props.onClose - Fecha o modal.
 * @param {Function} props.onSave - Salva nova ou editada.
 * @param {number} props.modelo - 1 = Simplificado | 2 = Detalhado (futuro uso).
 */
/*function PlanoContasModal({ data, onClose, onSave, modelo }) {
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
*/
