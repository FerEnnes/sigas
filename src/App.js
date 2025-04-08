import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import SupplierListPage from './pages/SupplierListPage';
import SupplierFormPage from './pages/SupplierFormPage';

import PropertyListPage from './pages/PropertyListPage';
import PropertyFormPage from './pages/PropertyFormPage';

import ClienteListPage from './pages/ClienteListPage';
import ClienteFormPage from './pages/ClienteFormPage';

import CalendarioPage from './pages/CalendarioPage';

import NotFoundPage from './pages/NotFoundPage';

import UsuarioListPage from './pages/UsuarioListPage';
import UsuarioFormPage from './pages/UsuarioFormPage';

import PlanoContasPage from './pages/PlanoContasPage'; // ✅ nova rota unificada

import ContasPagarPage from './pages/ContasPagarPage';     // ✅ novo
import ContasReceberPage from './pages/ContasReceberPage'; // ✅ novo

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirecionamento inicial */}
        <Route path="/" element={<Navigate to="/fornecedores" />} />

        {/* Usuários */}
        <Route path="/usuarios" element={<UsuarioListPage />} />
        <Route path="/usuarios/cadastrar" element={<UsuarioFormPage />} />

        {/* Clientes */}
        <Route path="/clientes" element={<ClienteListPage />} />
        <Route path="/clientes/cadastrar" element={<ClienteFormPage />} />

        {/* Fornecedores */}
        <Route path="/fornecedores" element={<SupplierListPage />} />
        <Route path="/fornecedores/cadastrar" element={<SupplierFormPage />} />

        {/* Propriedades */}
        <Route path="/propriedades" element={<PropertyListPage />} />
        <Route path="/propriedades/cadastrar" element={<PropertyFormPage />} />

        {/* Plano de Contas */}
        <Route path="/plano-contas" element={<PlanoContasPage />} />

        {/* Contas */}
        <Route path="/contas/pagar" element={<ContasPagarPage />} />
        <Route path="/contas/receber" element={<ContasReceberPage />} />

        {/* Calendário */}
        <Route path="/calendario" element={<CalendarioPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
