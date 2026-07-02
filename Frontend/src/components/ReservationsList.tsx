import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $user, $token } from '../store/auth';
import { Card } from './ui/Card';
import { Calendar, MapPin, Loader2, Trash2 } from 'lucide-react';

interface Reservation {
  id: string;
  hotel_id: string;
  start_date: string;
  end_date: string;
  amount?: number;
  status?: string;
  // Other fields returned by reservations-api
}

export const ReservationsList = () => {
  const user = useStore($user);
  const token = useStore($token);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro que deseas cancelar esta reserva?')) return;

    try {
      const apiUrl = import.meta.env.PUBLIC_RESERVATIONS_API_URL || 'http://localhost:8001';
      const res = await fetch(`${apiUrl}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Error al cancelar la reserva');
      }

      setReservations(prev => prev.filter(r => r.id !== id));
      alert('Reserva cancelada con éxito');
    } catch (err: any) {
      alert(err.message || 'Error de conexión al cancelar');
    }
  };

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const fetchReservations = async () => {
      try {
        const apiUrl = import.meta.env.PUBLIC_RESERVATIONS_API_URL || 'http://localhost:8001';
        const res = await fetch(`${apiUrl}/reservations/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Error al obtener las reservas');
        }

        const data = await res.json();
        setReservations(data);
      } catch (err: any) {
        setError(err.message || 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height: '300px' }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent)" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
        {error}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <Card style={{ padding: '3rem', textAlign: 'center' }}>
        <h3 className="text-xl font-bold mb-2">No tienes reservas activas</h3>
        <p className="text-secondary mb-6">Parece que aún no has reservado ningún hotel.</p>
        <a href="/results" style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'inline-block' }}>
          Buscar Hoteles
        </a>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reservations.map((res) => (
        <Card key={res.id} style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <MapPin size={18} color="var(--accent)" />
              Hotel ID: {res.hotel_id}
            </h3>
            <div className="flex items-center gap-4 text-secondary text-sm">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Llegada: {new Date(res.start_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Salida: {new Date(res.end_date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {res.status && (
              <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                {res.status}
              </span>
            )}
            {res.amount && <div className="font-bold text-xl">${res.amount}</div>}
            <button
              onClick={() => handleCancel(res.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.75rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'background-color 0.2s',
                marginLeft: 'auto'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
            >
              <Trash2 size={16} />
              Cancelar
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};
