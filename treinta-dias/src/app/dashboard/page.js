'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import programData from '@/data/program.json';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [connectionScore, setConnectionScore] = useState(0);

  useEffect(() => {
    // Load user from localStorage (demo mode) or Supabase
    const demoUser = localStorage.getItem('demo_user');
    if (demoUser) {
      const parsed = JSON.parse(demoUser);
      setUser(parsed);
      setHasAccess(parsed.tiene_acceso_completo || false);
    } else {
      router.push('/login');
      return;
    }

    // Load completed days
    const savedCompleted = localStorage.getItem('completed_days');
    if (savedCompleted) {
      setCompletedDays(JSON.parse(savedCompleted));
    }

    // Load connection scores
    const savedScores = localStorage.getItem('connection_scores');
    if (savedScores) {
      const scores = JSON.parse(savedScores);
      const values = Object.values(scores);
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        setConnectionScore(Math.round(avg * 10) / 10);
      }
    }
  }, [router]);

  const getDayStatus = (dayNum) => {
    if (completedDays.includes(dayNum)) return 'completed';
    if (dayNum === 1) return 'available'; // Day 1 always free
    if (hasAccess) return 'available';
    return 'locked';
  };

  const getCurrentDay = () => {
    if (completedDays.length === 0) return 1;
    const maxCompleted = Math.max(...completedDays);
    return Math.min(maxCompleted + 1, 30);
  };

  const handleDayClick = (dayNum) => {
    const status = getDayStatus(dayNum);
    if (status === 'locked') return;
    router.push(`/dia/${dayNum}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('demo_user');
    localStorage.removeItem('completed_days');
    localStorage.removeItem('connection_scores');
    router.push('/');
  };

  const progressPercent = (completedDays.length / 30) * 100;
  const currentDay = getCurrentDay();

  const getConnectionColor = () => {
    if (connectionScore >= 7) return 'var(--color-connection-high)';
    if (connectionScore >= 4) return 'var(--color-connection-medium)';
    return 'var(--color-connection-low)';
  };

  if (!user) return null;

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <Link href="/dashboard" className="header-logo">
            💕 <span>30 Días</span>
          </Link>
          <nav className="header-nav">
            <Link href="/dashboard">Programa</Link>
            <Link href="/progreso">Progreso</Link>
            <Link href="/recursos">Recursos</Link>
            <Link href="/invitar">💑 Pareja</Link>
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
            >
              Salir
            </button>
          </nav>
        </div>
      </header>

      <main style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div className="container">
          {/* Welcome */}
          <div style={{ padding: 'var(--space-2xl) 0' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 'var(--space-sm)' }}>
              Hola, {user.nombre || 'Compañero/a'} 💕
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {completedDays.length === 0
                ? 'Bienvenido/a a tu programa de 30 días. ¡Comienza con el Día 1!'
                : `Llevas ${completedDays.length} de 30 días completados. ¡Sigue así!`
              }
            </p>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
            {/* Progress */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Progreso General</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{Math.round(progressPercent)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
                {completedDays.length}/30 días
              </p>
            </div>

            {/* Connection Score */}
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Nivel de Conexión</span>
              <div style={{
                fontSize: '2.5rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: getConnectionColor(),
                margin: 'var(--space-sm) 0',
              }}>
                {connectionScore || '—'}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>de 10</span>
            </div>

            {/* Current Day */}
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Día Actual</span>
              <div style={{
                fontSize: '2.5rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-accent)',
                margin: 'var(--space-sm) 0',
              }}>
                {currentDay}
              </div>
              <Link
                href={`/dia/${currentDay}`}
                className="btn btn-primary btn-sm"
                style={{ marginTop: 'var(--space-sm)' }}
              >
                {completedDays.includes(currentDay) ? 'Revisar' : 'Continuar'} →
              </Link>
            </div>

            {/* Access Status */}
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Acceso</span>
              <div style={{
                fontSize: '1.5rem',
                margin: 'var(--space-sm) 0',
              }}>
                {hasAccess ? '🔓' : '🔒'}
              </div>
              <span style={{
                fontSize: '0.85rem',
                color: hasAccess ? 'var(--color-success)' : 'var(--color-warning)',
                fontWeight: 600,
              }}>
                {hasAccess ? 'Acceso Completo' : 'Solo Día 1'}
              </span>
              {!hasAccess && (
                <Link
                  href="/activar"
                  className="btn btn-accent btn-sm"
                  style={{ marginTop: 'var(--space-sm)', display: 'block' }}
                >
                  Activar
                </Link>
              )}
            </div>
          </div>

          {/* Day Grid */}
          <h2 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.5rem' }}>
            Programa de 30 Días
          </h2>

          <div className="day-grid stagger-children">
            {programData.dias.map((dia) => {
              const status = getDayStatus(dia.numero);
              const isCurrent = dia.numero === currentDay && !completedDays.includes(currentDay);

              return (
                <div
                  key={dia.numero}
                  className={`day-card ${status} ${isCurrent ? 'current' : ''}`}
                  onClick={() => handleDayClick(dia.numero)}
                  role="button"
                  tabIndex={0}
                  title={status === 'locked' ? 'Activa tu código para desbloquear' : dia.titulo}
                >
                  {dia.gratuito && <div className="day-card-badge free">FREE</div>}

                  <div className="day-card-icon">
                    {status === 'completed' ? '✅' : status === 'locked' ? '🔒' : isCurrent ? '📖' : '💬'}
                  </div>
                  <div className="day-card-number">{dia.numero}</div>
                  <div className="day-card-title">{dia.titulo}</div>
                </div>
              );
            })}
          </div>

          {/* WhatsApp CTA */}
          {!hasAccess && (
            <div className="glass-card mt-2xl" style={{ textAlign: 'center', borderColor: 'rgba(74, 222, 128, 0.3)' }}>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>
                🔓 Desbloquea los 30 días completos
              </h3>
              <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
                Obtén tu código de acceso por solo <strong style={{ color: 'var(--color-accent)' }}>70 Bs</strong>.
                Incluye todo el programa + materiales adicionales.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/59176419099?text=Hola%2C%20quiero%20activar%20mi%20c%C3%B3digo%20de%20acceso%20para%20el%20programa%2030%20D%C3%ADas%20Para%20Reconectar%20%F0%9F%93%98"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent"
                >
                  📲 WhatsApp: +591 76419099
                </a>
                <Link href="/activar" className="btn btn-secondary">
                  🔑 Ya tengo un código
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer" style={{ marginTop: 'var(--space-2xl)' }}>
        <p>© 2024 30 Días Para Reconectar</p>
      </footer>
    </>
  );
}
