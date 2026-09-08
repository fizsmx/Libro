'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase-auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn(email.trim(), password);

      if (res.error) {
        setError(res.error);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-xl">
          <Link href="/" style={{ fontSize: '2.5rem', textDecoration: 'none' }}>💕</Link>
        </div>
        <h2 className="auth-title">Bienvenido/a de vuelta</h2>
        <p className="auth-subtitle">
          Inicia sesión para continuar tu programa de 14 días
        </p>

        {error && (
          <div className="toast-inline" style={{
            padding: 'var(--space-md)',
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            fontSize: '0.9rem',
            marginBottom: 'var(--space-md)',
          }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ marginTop: 'var(--space-md)' }}
          >
            {loading ? '⏳ Ingresando...' : '💕 Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link href="/registro">Regístrate gratis</Link>
        </div>
      </div>
    </div>
  );
}
