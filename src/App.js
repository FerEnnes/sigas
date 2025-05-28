import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Importações das páginas
import SupplierListPage from './pages/SupplierListPage';
import SupplierFormPage from './pages/SupplierFormPage';
import PropertyListPage from './pages/PropertyListPage';
import PropertyFormPage from './pages/PropertyFormPage';
import ClienteListPage from './pages/ClienteListPage';
import ClienteFormPage from './pages/ClienteFormPage';
import CalendarioPage from './pages/CalendarioPage';
import PlanoContasPage from './pages/PlanoContasPage';
import ContasResumoPage from './pages/ContasResumoPage';
import ContasPagarPage from './pages/ContasPagarPage';
import ContasReceberPage from './pages/ContasReceberPage';
import UsuarioListPage from './pages/UsuarioListPage';
import UsuarioFormPage from './pages/UsuarioFormPage';
import DashboardPage from './pages/DashboardPage';
import NotificacoesPage from './pages/NotificacoesPage'; // Importado
import LoginPage from './pages/LoginPage';
import RecuperarSenhaPage from './pages/RecuperarSenhaPage';
import RedefinirSenhaPage from './pages/RedefinirSenhaPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import NotFoundPage from './pages/NotFoundPage';
import CadastroUsuario from './pages/NotFoundPage';
/*import ListaUsuarios from './components/ListaUsuarios';*/


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />          
          <Route path="/primeiro-cadastro" element={<CadastroUsuario />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
          <Route path="/redefinir-senha/:uid/:token" element={<RedefinirSenhaPage />} />
          {/*<Route path="/usuarios" element={<ListaUsuarios />} />}

          {/* Protegidas */}
          <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><UsuarioListPage /></PrivateRoute>} />
          <Route path="/usuarios/cadastrar" element={<PrivateRoute><UsuarioFormPage /></PrivateRoute>} />
          <Route path="/clientes" element={<PrivateRoute><ClienteListPage /></PrivateRoute>} />
          <Route path="/clientes/cadastrar" element={<PrivateRoute><ClienteFormPage /></PrivateRoute>} />
          <Route path="/fornecedores" element={<PrivateRoute><SupplierListPage /></PrivateRoute>} />
          <Route path="/fornecedores/cadastrar" element={<PrivateRoute><SupplierFormPage /></PrivateRoute>} />
          <Route path="/propriedades" element={<PrivateRoute><PropertyListPage /></PrivateRoute>} />
          <Route path="/propriedades/cadastrar" element={<PrivateRoute><PropertyFormPage /></PrivateRoute>} />
          <Route path="/plano-contas" element={<PrivateRoute><PlanoContasPage /></PrivateRoute>} />
          <Route path="/contas" element={<PrivateRoute><ContasResumoPage /></PrivateRoute>} />
          <Route path="/contas/pagar" element={<PrivateRoute><ContasPagarPage /></PrivateRoute>} />
          <Route path="/contas/receber" element={<PrivateRoute><ContasReceberPage /></PrivateRoute>} />
          <Route path="/calendario" element={<PrivateRoute><CalendarioPage /></PrivateRoute>} />
          <Route path="/notificacoes" element={<PrivateRoute><NotificacoesPage /></PrivateRoute>} /> {/* Nova Rota */}
          <Route path="/configuracoes" element={<PrivateRoute><ConfiguracoesPage /></PrivateRoute>} />

          {/* Página não encontrada */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
