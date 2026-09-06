'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, isConfigured } from '@/lib/supabase';

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isConfigured()) {
      const demoCode = 'INV-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      localStorage.setItem('demo_user', JSON.stringify({
        email,
        nombre,
        codigo_invitacion: demoCode,
        tiene_acceso_completo: false,
        dia_actual: 1,
      }));
      router.push('/dashboard');
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre },
        },
      });

      if (authError) throw authError;

      // Create profile
      if (data.user) {
        await supabase.from('perfiles').insert({
          id: data.user.id,
          nombre,
          email,
        });
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
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
        <h2 className="auth-title">Crea tu cuenta</h2>
        <p className="auth-subtitle">
          Comienza tu programa de 30 días — el Día 1 es completamente gratis
        </p>

        {error && (
          <div style={{
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

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="nombre">Tu nombre</label>
            <input
              id="nombre"
              type="text"
              className="input"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ marginTop: 'var(--space-md)' }}
          >
            {loading ? '⏳ Creando cuenta...' : '🚀 Comenzar Gratis'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
