import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SupplierListPage from './pages/SupplierListPage';
import SupplierFormPage from './pages/SupplierFormPage';
import PropertyListPage from './pages/PropertyListPage';
import PropertyFormPage from './pages/PropertyFormPage';
import CalendarioPage from './pages/CalendarioPage';
import NotFoundPage from './pages/NotFoundPage'; 

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/fornecedores" />} />

        {/* Fornecedores */}
        <Route path="/fornecedores" element={<SupplierListPage />} />
        <Route path="/fornecedores/cadastrar" element={<SupplierFormPage />} />

        {/* Propriedades */}
        <Route path="/propriedades" element={<PropertyListPage />} />
        <Route path="/propriedades/cadastrar" element={<PropertyFormPage />} />

        {/* Calendário */}
        <Route path="/calendario" element={<CalendarioPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;









