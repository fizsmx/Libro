'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VincularPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    const demoUser = localStorage.getItem('demo_user');
    if (!demoUser) { router.push('/login'); return; }
    setUser(JSON.parse(demoUser));

    const partner = localStorage.getItem('partner_info');
    if (partner) setIsLinked(true);
  }, [router]);

  const handleLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const trimmed = codigo.trim().toUpperCase();

    if (trimmed.length < 6) {
      setMessage({ type: 'error', text: 'El código debe tener al menos 6 caracteres' });
      setLoading(false);
      return;
    }

    // Simulate linking
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In demo mode, accept any INV- code
    if (trimmed.startsWith('INV-') || trimmed.startsWith('DEMO') || trimmed.startsWith('LINK')) {
      const partnerInfo = {
        nombre: 'Tu Pareja',
        codigo: trimmed,
        vinculado_en: new Date().toISOString(),
      };
      localStorage.setItem('partner_info', JSON.stringify(partnerInfo));
      setIsLinked(true);
      setMessage({ type: 'success', text: '🎉 ¡Vinculación exitosa! Ahora están conectados en el programa.' });
    } else {
      setMessage({ type: 'error', text: 'Código no válido. Los códigos de invitación empiezan con "INV-". Pide a tu pareja que te comparta su código.' });
    }

    setLoading(false);
  };

  if (!user) return null;

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
            <span style={{ fontSize: '3rem' }}>{isLinked ? '💑' : '🔗'}</span>
          </div>

          {isLinked ? (
            <div className="text-center">
              <h2 className="auth-title" style={{ color: 'var(--color-success)' }}>
                ¡Vinculados! 💕
              </h2>
              <p className="auth-subtitle">
                Ya están conectados en el programa. Las respuestas se compartirán
                cuando ambos las completen.
              </p>
              <Link href="/dashboard" className="btn btn-primary btn-lg mt-lg">
                📘 Ir al Programa
              </Link>
            </div>
          ) : (
            <>
              <h2 className="auth-title">Vincular con tu Pareja</h2>
              <p className="auth-subtitle">
                Ingresa el código de invitación que te compartió tu pareja
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

              <form className="auth-form" onSubmit={handleLink}>
                <div className="input-group">
                  <label htmlFor="link-code">Código de invitación</label>
                  <input
                    id="link-code"
                    type="text"
                    className="input"
                    placeholder="Ej: INV-A1B2C3D4"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                  style={{ marginTop: 'var(--space-md)' }}
                >
                  {loading ? '⏳ Vinculando...' : '🔗 Vincular'}
                </button>
              </form>

              <div style={{
                marginTop: 'var(--space-2xl)',
                padding: 'var(--space-lg)',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
                  ¿Tu pareja aún no se ha registrado?
                </p>
                <Link href="/invitar" className="btn btn-secondary btn-sm">
                  📤 Invitar a mi pareja
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
