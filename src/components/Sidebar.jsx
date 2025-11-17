import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css'; 
import { useAuthStore } from '../features/auth/stores/authStore';

const Sidebar = ({ className, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    {
      id: 'nueva-formulacion',
      text: 'Nueva Formulación',
      icon: '/images/img_all_icons_filled_small.svg',
      path: '/nueva-formulacion'
    },
    {
      id: 'mis-formulaciones',
      text: 'Mis Formulaciones',
      icon: '/images/img_all_icons_filled_small_white_a700.svg',
      path: '/mis-formulaciones'
    },
    {
      id: 'proveedores',
      text: 'Proveedores',
      icon: '/images/img_all_icons_filled_small_white_a700_18x18.svg',
      path: '/proveedores'
    },
    {
      id: 'eliminados',
      text: 'Eliminados',
      icon: '/images/img_all_icons_filled_small_18x18.svg',
      path: '/eliminados'
    },
    {
      id: 'ayuda',
      text: 'Ayuda',
      icon: '/images/img_all_icons_filled_small_1.svg',
      path: '/help'
    }
  ];

  const bottomMenuItems = [
    {
      id: 'ajustes',
      text: 'Ajustes',
      icon: '/images/img_all_icons_filled_small_2.svg',
      path: '/settings'
    },
    {
      id: 'cerrar-sesion',
      text: 'Cerrar sesión',
      icon: '/images/img_all_icons_filled_small_3.svg',
      path: '/logout'
    }
  ];

  const isMenuItemActive = (path) => {
    if (path === '/nueva-formulacion' && location.pathname === '/') {
        return true;
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={`sidebar ${className}`} 
      {...props}
    >
      <div className="sidebar-content-wrapper">
        <div className="sidebar-logo-container">
          <img 
            src="/images/solinal_formula_logo.svg" 
            alt="Solinal Formula Logo"
            className="sidebar-logo"
          />
        </div>
        
        <div className="sidebar-user-section">
          <div className="sidebar-user-name">{user?.nombre || user?.name || user?.email || 'Usuario'}</div>
          <hr className="sidebar-user-separator" />
        </div>
        
        <div className="sidebar-navigation">
          <nav className="sidebar-menu">
            {menuItems?.map((item) => (
              <Link
                key={item?.id}
                to={item?.path}
                className={`menu-item ${isMenuItemActive(item?.path) ? 'menu-item--active' : ''}`}
                role="menuitem"
                aria-current={isMenuItemActive(item?.path) ? 'page' : undefined}
              >
                <img 
                  src={item?.icon} 
                  alt=""
                  className="menu-icon"
                />
                <span className="menu-text">
                  {item?.text}
                </span>
              </Link>
            ))}
          </nav>

          <nav className="sidebar-menu">
            {bottomMenuItems?.map((item) => {
              if (item.id === 'cerrar-sesion') {
                return (
                  <button
                    key={item?.id}
                    onClick={handleLogout}
                    className="menu-item"
                    role="menuitem"
                  >
                    <img 
                      src={item?.icon} 
                      alt=""
                      className="menu-icon"
                    />
                    <span className="menu-text">
                      {item?.text}
                    </span>
                  </button>
                );
              }
              return (
                <Link
                  key={item?.id}
                  to={item?.path}
                  className={`menu-item ${isMenuItemActive(item?.path) ? 'menu-item--active' : ''}`}
                  role="menuitem"
                  aria-current={isMenuItemActive(item?.path) ? 'page' : undefined}
                >
                  <img 
                    src={item?.icon} 
                    alt=""
                    className="menu-icon"
                  />
                  <span className="menu-text">
                    {item?.text}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;