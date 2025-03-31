import React, { useState } from 'react';
import './Sidebar.css';
import logo from '../assets/Logo.png';
import { Link, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { FiLogOut } from 'react-icons/fi';

import {
  FiUsers,
  FiUser,
  FiUserCheck,
  FiTruck,
  FiHome,
  FiDollarSign,
  FiBell,
  FiCalendar,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiGrid
} from 'react-icons/fi';

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
    }
  };
}

function Sidebar() {
  const location = useLocation();
  const [cadastrosOpen, setCadastrosOpen] = useState(true);
  const [planoContasOpen, setPlanoContasOpen] = useState(false); // submenu novo

  const handleLogout = () => {
    console.log('Logout clicado');
  };

  return (
    <div className="sidebar">
      <img src={logo} alt="Logo SAAS AGRO LIGHT" className="logo" />
      <h2>SAAS AGRO LIGHT</h2>
      <ul>
        <li>
          <Link
            to="/dashboard"
            className={location.pathname === '/dashboard' ? 'active sidebar-link' : 'sidebar-link'}
          >
            <FiGrid className="icon" />
            Dashboard
          </Link>
        </li>

        <li
          className="menu-item"
          onClick={() => setCadastrosOpen(!cadastrosOpen)}
        >
          <FiUsers className="icon" />
          Cadastros {cadastrosOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </li>

        {cadastrosOpen && (
          <ul className="submenu">
            <li>
              <Link to="/usuarios" className={location.pathname === '/usuarios' ? 'active submenu-link' : 'submenu-link'}>
                <FiUser className="icon" /> Usuários
              </Link>
            </li>
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
          </ul>
        )}

        <li
          className="menu-item"
          onClick={() => setPlanoContasOpen(!planoContasOpen)}
        >
          <FiDollarSign className="icon" />
          Plano de Contas {planoContasOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </li>

        {planoContasOpen && (
          <ul className="submenu">
            <li>
              <Link to="/plano/simplificado" className={location.pathname === '/plano/simplificado' ? 'active submenu-link' : 'submenu-link'}>
                Simplificado
              </Link>
            </li>
            <li>
              <Link to="/plano/detalhado" className={location.pathname === '/plano/detalhado' ? 'active submenu-link' : 'submenu-link'}>
                Detalhado
              </Link>
            </li>
          </ul>
        )}

        <li>
          <Link to="/notificacoes" className="sidebar-link">
            <FiBell className="icon" />
            Notificações
          </Link>
        </li>
        <li>
          <Link to="/calendario" className="sidebar-link">
            <FiCalendar className="icon" />
            Calendário
          </Link>
        </li>
        <li>
          <Link to="/configuracoes" className="sidebar-link">
            <FiSettings className="icon" />
            Configurações
          </Link>
        </li>
      </ul>

      <div
        className="user-footer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar {...stringAvatar('João Silva')} />
          <div style={{ lineHeight: '1.2' }}>
            <strong style={{ fontSize: 14 }}>João Silva</strong>
            <div style={{ fontSize: 12, color: '#888' }}>Admin</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 4
        }}>
          <FiLogOut size={18} color="#888" />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;


