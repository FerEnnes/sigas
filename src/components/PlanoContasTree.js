// src/components/PlanoContasTree.js
import React from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * Renderiza uma árvore hierárquica de contas.
 * @param {Array} contas - Lista de objetos com `descricao`, `id` e `subcontas`.
 * @param {Function} onEdit - Função chamada ao clicar em "Editar".
 */
function PlanoContasTree({ contas, onEdit }) {
  const renderTree = (node) => (
    <TreeItem
      key={node.id}
      nodeId={String(node.id)} // Importante: nodeId deve ser única
      label={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{node.descricao}</span>
          <button onClick={() => onEdit(node)} style={{ marginLeft: 'auto' }}>Editar</button>
        </div>
      }
    >
      {/* Renderiza filhos recursivamente se existirem */}
      {Array.isArray(node.subcontas) &&
        node.subcontas.map((sub) => renderTree(sub))}
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ mt: 2 }}
    >
      {contas.map(renderTree)}
    </TreeView>
  );
}

export default PlanoContasTree;
