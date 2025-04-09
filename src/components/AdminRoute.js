import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const tipoUsuario = localStorage.getItem('tipoUsuario') || sessionStorage.getItem('tipoUsuario');

  // Se não for admin, manda para "não autorizado" ou home
  if (tipoUsuario !== '1') {
    return <Navigate to="/fornecedores" replace />;
  }

  return children;
}

export default AdminRoute;
