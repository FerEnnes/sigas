import React from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * Renderiza uma árvore hierárquica de contas.
 * @param {Array} contas - Lista de objetos com `descricao`, `id`, e opcionalmente `subcontas`.
 * @param {Function} onEdit - Função chamada ao clicar em "Editar".
 */
function PlanoContasTree({ contas, onEdit }) {
  // Render recursivo para cada nó da árvore
  const renderTree = (node) => (
    <TreeItem
      key={node.id}
      nodeId={String(node.id)}
      label={
        <div className="tree-node">
          <span>{node.descricao}</span>
          <button onClick={() => onEdit(node)}>Editar</button>
        </div>
      }
    >
      {/* Garante que subcontas é um array */}
      {(Array.isArray(node.subcontas) ? node.subcontas : []).map((child) =>
        renderTree(child)
      )}
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
