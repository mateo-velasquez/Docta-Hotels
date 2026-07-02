import React from 'react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  onReserve: () => void;
  loading: boolean;
  error: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onReserve,
  loading,
  error
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        width: '90%',
        maxWidth: '400px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          Seleccionar Fechas
        </h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            Fecha de Inicio
          </label>
          <input 
            type="date" 
            value={startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm, 0.375rem)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            Fecha de Fin
          </label>
          <input 
            type="date" 
            value={endDate}
            min={startDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm, 0.375rem)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {error && (
          <div style={{ 
            color: 'var(--error)', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem', 
            fontSize: '0.875rem' 
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Cancelar
          </button>
          <button 
            onClick={onReserve}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => { if(!loading) e.currentTarget.style.backgroundColor = 'var(--accent-hover)' }}
            onMouseOut={(e) => { if(!loading) e.currentTarget.style.backgroundColor = 'var(--accent)' }}
          >
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
