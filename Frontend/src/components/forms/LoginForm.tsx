import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { loginStore } from '../../store/auth';

export const LoginForm = () => {
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
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await res.json();

      loginStore(data.token, {
        id: data.user_id || data.id,
        email: email,
        role: data.role || 'user'
      });

      window.location.href = '/';

    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div style={{ color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>{error}</div>}
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
      />
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
      </Button>
      <div className="text-center mt-4 text-sm text-secondary">
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </div>
    </form>
  );
};
