import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $user, $token } from '../../store/auth';
import { ReservationModal } from '../ui/ReservationModal';

interface ReserveButtonProps {
  hotelId: string;
  price: number;
}

export const ReserveButton = ({ hotelId, price }: ReserveButtonProps) => {
  const user = useStore($user);
  const token = useStore($token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleOpenModal = () => {
    if (!user) {
      window.location.href = '/login?redirect=/hotel/' + hotelId;
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleReserve = async () => {
    if (!user) {
      window.location.href = '/login?redirect=/hotel/' + hotelId;
      return;
    }

    if (!startDate || !endDate) {
      setError('Por favor, selecciona las fechas de inicio y fin.');
      return;
    }
    
    // Ajustar las fechas para evitar problemas con la zona horaria (UTC)
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Las fechas ingresadas no son válidas.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setError('La fecha de inicio no puede estar en el pasado.');
      return;
    }
    
    if (end <= start) {
      setError('La fecha de fin debe ser posterior a la de inicio.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.PUBLIC_RESERVATIONS_API_URL || 'http://localhost:8001';
      
      const res = await fetch(`${apiUrl}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          hotel_id: hotelId,
          start_date: start.toISOString(),
          end_date: end.toISOString(),
          amount: price // The price can optionally be multiplied by days
        })
      });

      if (!res.ok) {
        throw new Error('Error al crear la reserva');
      }

      window.location.href = '/congrats?status=success&message=Tu reserva ha sido confirmada con éxito.';
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <button 
        onClick={handleOpenModal}
        disabled={loading}
        style={{
          backgroundColor: 'var(--accent)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          fontSize: '1.125rem',
          opacity: loading ? 0.7 : 1,
          transition: 'background-color 0.2s ease'
        }}
      >
        Reservar Ahora
      </button>

      <ReservationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onReserve={handleReserve}
        loading={loading}
        error={error}
      />
    </div>
  );
};
