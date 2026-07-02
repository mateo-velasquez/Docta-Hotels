import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.PUBLIC_USERS_API_URL || 'http://localhost:8002';
      const res = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, last_name: lastName, email, password })
      });

      if (!res.ok) {
        throw new Error('Error al registrar usuario. Verifica los datos.');
      }

      // On successful registration, redirect to login
      window.location.href = '/login?registered=true';

    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div style={{ color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>{error}</div>}

      <div className="flex gap-4" style={{ flexDirection: 'row' }}>
        <Input
          label="Nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <Input
          label="Apellido"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          fullWidth
        />
      </div>

      <Input
        label="Correo Electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        minLength={6}
      />
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </Button>
      <div className="text-center mt-4 text-sm text-secondary">
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </div>
    </form>
  );
};
