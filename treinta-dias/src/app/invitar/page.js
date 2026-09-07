'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getCurrentUser } from '@/lib/supabase-auth';

export default function InvitarPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function initUser() {
      const currentUser = await getCurrentUser();
      if (!currentUser) { router.push('/login'); return; }

      // Generate invite code if not exists
      if (!currentUser.codigo_invitacion) {
        currentUser.codigo_invitacion = 'INV-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        localStorage.setItem('demo_user', JSON.stringify(currentUser));
      }

      setUser(currentUser);

      // Check if already linked
      const partner = localStorage.getItem('partner_info');
      if (partner) {
        try {
          setPartnerName(JSON.parse(partner).nombre);
        } catch (e) {}
      }
    }
    initUser();
  }, [router]);

  const handleCopy = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.codigo_invitacion);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    if (!user) return;
    const text = encodeURIComponent(
      `💕 ¡Te invito a hacer el programa *30 Días Para Reconectar* conmigo!\n\n` +
      `Es un programa de 30 días para fortalecer nuestra relación a través de conversaciones guiadas.\n\n` +
      `📲 Regístrate aquí: ${typeof window !== 'undefined' ? window.location.origin : ''}/registro\n\n` +
      `🔗 Luego ve a "Vincular Pareja" e ingresa este código:\n*${user.codigo_invitacion}*\n\n` +
      `El Día 1 es gratis 💕`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
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
        <div className="auth-card" style={{ maxWidth: '520px' }}>
          <div className="text-center mb-xl">
            <span style={{ fontSize: '3.5rem' }}>💑</span>
          </div>

          {partnerName ? (
            /* Already linked */
            <div className="text-center">
              <h2 className="auth-title" style={{ color: 'var(--color-success)' }}>
                ¡Vinculados!
              </h2>
              <p className="auth-subtitle">
                Estás vinculado/a con <strong style={{ color: 'var(--color-primary-light)' }}>{partnerName}</strong>
              </p>
              <div className="glass-card mt-lg" style={{ textAlign: 'left', borderColor: 'rgba(74,222,128,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem',
                  }}>
                    {partnerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{partnerName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>✅ Vinculado/a</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  Ahora pueden ver las respuestas del otro cuando ambos completen las mismas preguntas.
                </p>
              </div>
              <Link href="/dashboard" className="btn btn-primary btn-lg mt-xl">
                📘 Ir al Programa
              </Link>
            </div>
          ) : (
            /* Not linked yet */
            <>
              <h2 className="auth-title">Invita a tu Pareja</h2>
              <p className="auth-subtitle">
                Comparte tu código de invitación para que ambos estén conectados en el programa
              </p>

              {/* Invite Code Display */}
              <div style={{
                margin: 'var(--space-xl) 0',
                padding: 'var(--space-xl)',
                background: 'rgba(232,99,111,0.08)',
                border: '2px dashed rgba(232,99,111,0.3)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Tu código de invitación
                </div>
                <div style={{
                  fontSize: '1.8rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  color: 'var(--color-primary-light)',
                  marginBottom: 'var(--space-md)',
                  userSelect: 'all',
                }}>
                  {user.codigo_invitacion}
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleCopy}
                  style={{ minWidth: '140px' }}
                >
                  {copied ? '✅ ¡Copiado!' : '📋 Copiar Código'}
                </button>
              </div>

              {/* Share Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <button
                  className="btn btn-accent w-full"
                  onClick={handleShareWhatsApp}
                  style={{ fontSize: '1rem', padding: '16px' }}
                >
                  📲 Enviar por WhatsApp
                </button>

                <Link href="/vincular" className="btn btn-secondary w-full" style={{ textAlign: 'center' }}>
                  🔗 Ya tengo un código de mi pareja
                </Link>
              </div>

              {/* Instructions */}
              <div style={{
                marginTop: 'var(--space-2xl)',
                padding: 'var(--space-lg)',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
                  📋 Instrucciones
                </h4>
                <ol style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <li>Envía el código a tu pareja</li>
                  <li>Tu pareja se registra en la app</li>
                  <li>Tu pareja ingresa el código en "Vincular Pareja"</li>
                  <li>¡Listo! Ahora están conectados 💕</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </>
  );
}
