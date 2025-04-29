import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import logo from '../assets/Logo.png';
import {
  FiUsers, FiUser, FiUserCheck, FiTruck, FiHome, FiDollarSign, FiBell,
  FiCalendar, FiSettings, FiChevronDown, FiChevronUp, FiGrid, FiClipboard, FiFileText,
  FiLogOut
} from 'react-icons/fi';
import './Sidebar.css';

// Função para gerar avatar automático
function stringAvatar(name) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  return {
    children: initials,
    sx: {
      bgcolor: '#f8d7da',
      color: '#721c24',
      width: 40,
      height: 40,
      fontWeight: 'bold',
      fontSize: 14,
      fontFamily: "'Nunito', Helvetica, sans-serif"
    }
  };
}

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cadastrosOpen, setCadastrosOpen] = useState(true);
  const [contasOpen, setContasOpen] = useState(true);

  const tipoUsuario = localStorage.getItem('tipoUsuario');
  const nomeUsuario = localStorage.getItem('nome') || 'Usuário';

  const handleLogout = () => {
    // BACKEND (opcional): POST /api/logout para invalidar token
    // fetch('/api/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleContasClick = () => {
    setContasOpen(!contasOpen);
    navigate('/contas');
  };

  return (
    <div className="sidebar">
      <img src={logo} alt="Logo SAAS AGRO LIGHT" className="logo" />
      <h2>SAAS AGRO LIGHT</h2>

      <ul>
        {/* Dashboard */}
        <li>
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active sidebar-link' : 'sidebar-link'}>
            <FiGrid className="icon" />
            Dashboard
          </Link>
        </li>

        {/* Cadastros */}
        <li className="menu-item" onClick={() => setCadastrosOpen(!cadastrosOpen)}>
          <FiUsers className="icon" />
          Cadastros {cadastrosOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </li>

        {cadastrosOpen && (
          <ul className="submenu">
            {tipoUsuario === '1' && (
              <li>
                <Link to="/usuarios" className={location.pathname === '/usuarios' ? 'active submenu-link' : 'submenu-link'}>
                  <FiUser className="icon" /> Usuários
                </Link>
              </li>
            )}
            <li>
              <Link to="/clientes" className={location.pathname === '/clientes' ? 'active submenu-link' : 'submenu-link'}>
                <FiUserCheck className="icon" /> Clientes
              </Link>
            </li>
            <li>
              <Link to="/fornecedores" className={location.pathname === '/fornecedores' ? 'active submenu-link' : 'submenu-link'}>
                <FiTruck className="icon" /> Fornecedores
              </Link>
            </li>
            <li>
              <Link to="/propriedades" className={location.pathname === '/propriedades' ? 'active submenu-link' : 'submenu-link'}>
                <FiHome className="icon" /> Propriedades
              </Link>
            </li>
            {tipoUsuario === '1' && (
              <li>
                <Link to="/plano-contas" className={location.pathname === '/plano-contas' ? 'active submenu-link' : 'submenu-link'}>
                  <FiDollarSign className="icon" /> Plano de Contas
                </Link>
              </li>
            )}
          </ul>
        )}

        {/* Contas */}
        <li className="menu-item" onClick={handleContasClick}>
          <FiDollarSign className="icon" />
          Contas {contasOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </li>

        {contasOpen && (
          <ul className="submenu">
            <li>
              <Link to="/contas/pagar" className={location.pathname === '/contas/pagar' ? 'active submenu-link' : 'submenu-link'}>
                <FiClipboard className="icon" /> A pagar
              </Link>
            </li>
            <li>
              <Link to="/contas/receber" className={location.pathname === '/contas/receber' ? 'active submenu-link' : 'submenu-link'}>
                <FiFileText className="icon" /> A receber
              </Link>
            </li>
          </ul>
        )}

        {/* Notificações */}
        <li>
          <Link to="/notificacoes" className={location.pathname === '/notificacoes' ? 'active sidebar-link' : 'sidebar-link'}>
            <FiBell className="icon" />
            Notificações
          </Link>
        </li>

        {/* Calendário */}
        <li>
          <Link to="/calendario" className={location.pathname === '/calendario' ? 'active sidebar-link' : 'sidebar-link'}>
            <FiCalendar className="icon" />
            Calendário
          </Link>
        </li>

        {/* Configurações */}
        <li>
          <Link to="/configuracoes" className={location.pathname === '/configuracoes' ? 'active sidebar-link' : 'sidebar-link'}>
            <FiSettings className="icon" />
            Configurações
          </Link>
        </li>
      </ul>

      {/* Rodapé com avatar e botão de logout */}
      <div className="user-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar {...stringAvatar(nomeUsuario)} />
          <div style={{ lineHeight: '1.2' }}>
            <strong style={{ fontSize: 14 }}>{nomeUsuario}</strong>
            <div style={{ fontSize: 12, color: '#888' }}>
              {tipoUsuario === '1' ? 'Admin' : 'Usuário comum'}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <FiLogOut size={18} color="#888" />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
