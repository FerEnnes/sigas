import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import logo from '../assets/Logo.png';
import {
  FiUsers, FiUser, FiUserCheck, FiTruck, FiHome, FiDollarSign, FiBell,
  FiCalendar, FiSettings, FiChevronDown, FiChevronUp, FiGrid, FiClipboard, FiFileText,
  FiLogOut
} from 'react-icons/fi';
import './Sidebar.css';
import { IS_DEMO } from '../services/demoFlags';

/* ----------------------------- utils ----------------------------------- */
const clean = (v, fallback = '') => {
  if (v === undefined || v === null) return fallback;
  const s = String(v).trim();
  if (!s || s.toLowerCase() === 'undefined' || s.toLowerCase() === 'null') return fallback;
  return s;
};

const getBoth = (k) =>
  clean(localStorage.getItem(k)) || clean(sessionStorage.getItem(k));

const getUserObj = () => {
  try {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Avatar com iniciais
function stringAvatar(name) {
  const initials = clean(name, 'U')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase();
  return {
    children: initials || 'U',
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
/* ----------------------------------------------------------------------- */

function Sidebar() {
  const location = useLocation();
  const [cadastrosOpen, setCadastrosOpen] = useState(true);
  const [contasOpen, setContasOpen] = useState(true);

  const userObj = getUserObj();

  // nome com fallback; em DEMO força admin_dev
  const nomeUsuario = IS_DEMO
    ? 'admin_dev'
    : clean(userObj?.nome) ||
      getBoth('nome') ||
      clean(userObj?.username) ||
      getBoth('username') ||
      'Usuario';

  // tipo de usuário; em DEMO força '1'
  const tipoStorage = IS_DEMO
    ? '1'
    : clean(userObj?.tipoUsuario) ||
      getBoth('tipoUsuario') ||
      getBoth('tipousuario') ||
      '';

  const isAdmin =
    IS_DEMO ||
    tipoStorage.toLowerCase() === '1' ||
    tipoStorage.toLowerCase() === 'admin';

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <img src={logo} alt="Logo SIGAS" className="logo" />

      <ul>
        {/* Dashboard */}
        <li>
          <Link
            to="/dashboard"
            className={isActive('/dashboard') ? 'active sidebar-link' : 'sidebar-link'}
          >
            <FiGrid className="icon" />
            Dashboard
          </Link>
        </li>

        {/* Cadastros (toggle alinhado à grade dos itens) */}
        <li className="menu-header">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setCadastrosOpen(!cadastrosOpen)}
            aria-expanded={cadastrosOpen}
            aria-controls="submenu-cadastros"
          >
            <span className="menu-left">
              <FiUsers className="icon" />
              <span>Cadastros</span>
            </span>
            {cadastrosOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
        </li>

        {cadastrosOpen && (
          <ul className="submenu" id="submenu-cadastros">
            {isAdmin && (
              <li>
                <Link
                  to="/usuarios"
                  className={isActive('/usuarios') ? 'active submenu-link' : 'submenu-link'}
                >
                  <FiUser className="icon" /> Usuários
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/clientes"
                className={isActive('/clientes') ? 'active submenu-link' : 'submenu-link'}
              >
                <FiUserCheck className="icon" /> Clientes
              </Link>
            </li>
            <li>
              <Link
                to="/fornecedores"
                className={isActive('/fornecedores') ? 'active submenu-link' : 'submenu-link'}
              >
                <FiTruck className="icon" /> Fornecedores
              </Link>
            </li>
            <li>
              <Link
                to="/propriedades"
                className={isActive('/propriedades') ? 'active submenu-link' : 'submenu-link'}
              >
                <FiHome className="icon" /> Propriedades
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/plano-contas"
                  className={isActive('/plano-contas') ? 'active submenu-link' : 'submenu-link'}
                >
                  <FiDollarSign className="icon" /> Plano de Contas
                </Link>
              </li>
            )}
          </ul>
        )}

        {/* Contas – link principal + caret para abrir submenu */}
        <li className="menu-header">
          <div className="menu-split">
            <Link
              to="/contas"
              className={isActive('/contas') ? 'active sidebar-link' : 'sidebar-link'}
            >
              <FiDollarSign className="icon" />
              <span>Contas</span>
            </Link>

            <button
              type="button"
              aria-label={contasOpen ? 'Recolher' : 'Expandir'}
              className={`caret-btn ${contasOpen ? 'open' : ''}`}
              onClick={() => setContasOpen(v => !v)}
              aria-expanded={contasOpen}
              aria-controls="submenu-contas"
            >
              {contasOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </button>
          </div>
        </li>

        {contasOpen && (
          <ul className="submenu" id="submenu-contas">
            <li>
              <Link
                to="/contas/pagar"
                className={isActive('/contas/pagar') ? 'active submenu-link' : 'submenu-link'}
              >
                <FiClipboard className="icon" /> A pagar
              </Link>
            </li>
            <li>
              <Link
                to="/contas/receber"
                className={isActive('/contas/receber') ? 'active submenu-link' : 'submenu-link'}
              >
                <FiFileText className="icon" /> A receber
              </Link>
            </li>
          </ul>
        )}

        {/* Notificações */}
        <li>
          <Link
            to="/notificacoes"
            className={isActive('/notificacoes') ? 'active sidebar-link' : 'sidebar-link'}
          >
            <FiBell className="icon" />
            Notificações
          </Link>
        </li>

        {/* Calendário */}
        <li>
          <Link
            to="/calendario"
            className={isActive('/calendario') ? 'active sidebar-link' : 'sidebar-link'}
          >
            <FiCalendar className="icon" />
            Calendário
          </Link>
        </li>

        {/* Configurações */}
        <li>
          <Link
            to="/configuracoes"
            className={isActive('/configuracoes') ? 'active sidebar-link' : 'sidebar-link'}
          >
            <FiSettings className="icon" />
            Configurações
          </Link>
        </li>
      </ul>

      {/* Rodapé */}
      <div className="user-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar {...stringAvatar(nomeUsuario)} />
          <div style={{ lineHeight: '1.2' }}>
            <strong style={{ fontSize: 14 }}>{nomeUsuario}</strong>
            <small>{isAdmin ? 'Admin' : 'Usuário comum'}</small>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          aria-label="Sair"
        >
          <FiLogOut size={18} color="#888" />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
