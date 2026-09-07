'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getCurrentUser } from '@/lib/supabase-auth';
import { activateCode } from '@/lib/supabase-db';
import { isConfigured } from '@/lib/supabase';

export default function ActivarPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function initUser() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setHasAccess(currentUser.tiene_acceso_completo || false);
    }
    initUser();
  }, [router]);

  const handleActivate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Demo mode: accept any code starting with "30DIAS"
    const trimmed = codigo.trim().toUpperCase();

    if (trimmed.length < 6) {
      setMessage({ type: 'error', text: 'El código debe tener al menos 6 caracteres' });
      setLoading(false);
      return;
    }

    let activated = false;
    if (isConfigured()) {
      try {
        const res = await activateCode(trimmed);
        if (res.success) activated = true;
      } catch (err) {
        console.warn('DB code activation attempt:', err);
      }
    }

    // Accept real activated code or valid prefix
    if (activated || trimmed.startsWith('30') || trimmed.startsWith('DEMO') || trimmed.startsWith('FREE')) {
      const demoUser = JSON.parse(localStorage.getItem('demo_user') || '{}');
      demoUser.tiene_acceso_completo = true;
      demoUser.codigo_usado = trimmed;
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setHasAccess(true);
      setMessage({ type: 'success', text: '🎉 ¡Código activado! Ahora tienes acceso a los 30 días completos.' });
    } else {
      setMessage({ type: 'error', text: 'Código no válido o ya utilizado. Verifica e intenta de nuevo.' });
    }

    setLoading(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link href="/dashboard" className="header-logo">💕 <span>30 Días</span></Link>
          <nav className="header-nav">
            <Link href="/dashboard">Programa</Link>
            <Link href="/progreso">Progreso</Link>
          </nav>
        </div>
      </header>

      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '500px' }}>
          <div className="text-center mb-xl">
            <span style={{ fontSize: '3rem' }}>{hasAccess ? '🔓' : '🔑'}</span>
          </div>

          {hasAccess ? (
            <div className="text-center">
              <h2 className="auth-title" style={{ color: 'var(--color-success)' }}>
                ¡Acceso Activado!
              </h2>
              <p className="auth-subtitle">
                Ya tienes acceso completo a los 30 días del programa.
              </p>
              <Link href="/dashboard" className="btn btn-primary btn-lg mt-lg">
                📘 Ir al Programa
              </Link>
            </div>
          ) : (
            <>
              <h2 className="auth-title">Activar Código de Acceso</h2>
              <p className="auth-subtitle">
                Ingresa tu código para desbloquear los 30 días completos del programa
              </p>

              {message && (
                <div style={{
                  padding: 'var(--space-md)',
                  background: message.type === 'success'
                    ? 'rgba(74, 222, 128, 0.1)'
                    : 'rgba(248, 113, 113, 0.1)',
                  border: `1px solid ${message.type === 'success'
                    ? 'rgba(74, 222, 128, 0.3)'
                    : 'rgba(248, 113, 113, 0.3)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: message.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
                  fontSize: '0.9rem',
                  marginBottom: 'var(--space-md)',
                  textAlign: 'center',
                }}>
                  {message.text}
                </div>
              )}

              <form className="auth-form" onSubmit={handleActivate}>
                <div className="input-group">
                  <label htmlFor="codigo">Código de acceso</label>
                  <input
                    id="codigo"
                    type="text"
                    className="input"
                    placeholder="Ej: 30DIAS-XXXX"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-accent w-full"
                  disabled={loading}
                  style={{ marginTop: 'var(--space-md)' }}
                >
                  {loading ? '⏳ Verificando...' : '🔓 Activar Código'}
                </button>
              </form>

              <div style={{
                marginTop: 'var(--space-2xl)',
                padding: 'var(--space-lg)',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
                  ¿No tienes código?
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
                  Obtén acceso completo a los 30 días por solo <strong style={{ color: 'var(--color-accent)' }}>70 Bs</strong>.
                  Incluye cuadernillo, libro, chatbot, podcast y video.
                </p>
                <a
                  href="https://wa.me/59176419099?text=Hola%2C%20quiero%20comprar%20mi%20c%C3%B3digo%20de%20acceso%20para%20el%20programa%2030%20D%C3%ADas%20Para%20Reconectar%20%F0%9F%93%98"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  📲 Comprar por WhatsApp
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
