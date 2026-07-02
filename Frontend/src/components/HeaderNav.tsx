import React from 'react';
import { useStore } from '@nanostores/react';
import { $user, logoutStore } from '../store/auth';
import { ThemeToggle } from './ThemeToggle';

export const HeaderNav = () => {
  const user = useStore($user);

  return (
    <nav className="flex items-center gap-6">
      <a href="/results" className="nav-link" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Hoteles</a>
      {user && (
        <a href="/reservations" className="nav-link" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Mis Reservas</a>
      )}
      <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>
      <ThemeToggle />
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            {user.email}
          </span>
          <button 
            onClick={logoutStore} 
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid var(--border)', 
              color: 'var(--text-primary)', 
              padding: '0.5rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              fontWeight: 500, 
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Salir
          </button>
        </div>
      ) : (
        <a href="/login" style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 500, transition: 'background-color 0.2s ease' }}>
          Iniciar Sesión
        </a>
      )}
    </nav>
  );
};
