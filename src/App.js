import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SupplierListPage from './pages/SupplierListPage';
import SupplierFormPage from './pages/SupplierFormPage';
import PropertyListPage from './pages/PropertyListPage';
import PropertyFormPage from './pages/PropertyFormPage';
import ClienteListPage from './pages/ClienteListPage';
import ClienteFormPage from './pages/ClienteFormPage';
import CalendarioPage from './pages/CalendarioPage';
import PlanoSimplificadoPage from './pages/PlanoSimplificadoPage';
import PlanoDetalhadoPage from './pages/PlanoDetalhadoPage';
import NotFoundPage from './pages/NotFoundPage';
import UsuarioListPage from './pages/UsuarioListPage';       // ✅
import UsuarioFormPage from './pages/UsuarioFormPage';       // ✅

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/fornecedores" />} />

        {/* Usuários */}
        <Route path="/usuarios" element={<UsuarioListPage />} />
        <Route path="/usuarios/cadastrar" element={<UsuarioFormPage />} /> {/* ✅ nova rota */}

        {/* Fornecedores */}
        <Route path="/fornecedores" element={<SupplierListPage />} />
        <Route path="/fornecedores/cadastrar" element={<SupplierFormPage />} />

        {/* Propriedades */}
        <Route path="/propriedades" element={<PropertyListPage />} />
        <Route path="/propriedades/cadastrar" element={<PropertyFormPage />} />

        {/* Clientes */}
        <Route path="/clientes" element={<ClienteListPage />} />
        <Route path="/clientes/cadastrar" element={<ClienteFormPage />} />

        {/* Calendário */}
        <Route path="/calendario" element={<CalendarioPage />} />

        {/* Plano de Contas */}
        <Route path="/plano/simplificado" element={<PlanoSimplificadoPage />} />
        <Route path="/plano/detalhado" element={<PlanoDetalhadoPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
