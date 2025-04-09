// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';  

import SupplierListPage from './pages/SupplierListPage';
import SupplierFormPage from './pages/SupplierFormPage';
import PropertyListPage from './pages/PropertyListPage';
import PropertyFormPage from './pages/PropertyFormPage';
import ClienteListPage from './pages/ClienteListPage';
import ClienteFormPage from './pages/ClienteFormPage';
import CalendarioPage from './pages/CalendarioPage';
import PlanoContasPage from './pages/PlanoContasPage';
import ContasPagarPage from './pages/ContasPagarPage';
import ContasReceberPage from './pages/ContasReceberPage';
import UsuarioListPage from './pages/UsuarioListPage';
import UsuarioFormPage from './pages/UsuarioFormPage';
import LoginPage from './pages/LoginPage';
import RecuperarSenhaPage from './pages/RecuperarSenhaPage';
import RedefinirSenhaPage from './pages/RedefinirSenhaPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login e recuperação */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
        <Route path="/redefinir-senha/:token" element={<RedefinirSenhaPage />} />

        {/* Redirecionamento padrão */}
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

        {/* Página 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/*  Toast container global */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;

