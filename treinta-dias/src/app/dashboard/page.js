'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import programData from '@/data/program.json';
import { SemaforoTimeline, SemaforoMini } from '@/components/Semaforo';

import { getCurrentUser, signOutUser } from '@/lib/supabase-auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [semaforoHistory, setSemaforoHistory] = useState([]);

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);
      setHasAccess(currentUser.tiene_acceso_completo || false);

      // Load completed days
      const savedCompleted = localStorage.getItem('completed_days');
      if (savedCompleted) {
        setCompletedDays(JSON.parse(savedCompleted));
      }

      // Load semáforo history from analysis data
      const history = [];
      for (let i = 1; i <= 14; i++) {
        const savedAnalisis = localStorage.getItem(`analisis_day_${i}`);
        if (savedAnalisis) {
          const parsed = JSON.parse(savedAnalisis);
          history.push({ dia: i, semaforo: parsed.semaforo });
        }
      }
      setSemaforoHistory(history);
    }

    loadData();
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
    return Math.min(maxCompleted + 1, 14);
  };

  const handleDayClick = (dayNum) => {
    const status = getDayStatus(dayNum);
    if (status === 'locked') return;
    router.push(`/dia/${dayNum}`);
  };

  const handleLogout = async () => {
    await signOutUser();
    router.push('/login');
  };

  const progressPercent = (completedDays.length / 14) * 100;
  const currentDay = getCurrentDay();

  // Count semáforo colors
  const greenCount = semaforoHistory.filter(s => s.semaforo === 'verde').length;
  const yellowCount = semaforoHistory.filter(s => s.semaforo === 'amarillo').length;
  const redCount = semaforoHistory.filter(s => s.semaforo === 'rojo').length;

  if (!user) return null;

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <Link href="/dashboard" className="header-logo">
            💕 <span>14 Días</span>
          </Link>
          <nav className="header-nav">
            <Link href="/dashboard">Programa</Link>
            <Link href="/progreso">Progreso</Link>
            <Link href="/recursos">Recursos</Link>
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
                ? 'Bienvenidos a su programa de 14 días. ¡Comiencen con el Día 1!'
                : `Llevan ${completedDays.length} de 14 días completados. ¡Sigan así!`
              }
            </p>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
            {/* Progress */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Progreso</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{Math.round(progressPercent)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
                {completedDays.length}/14 días
              </p>
            </div>

            {/* Semáforo Summary */}
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Semáforo</span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', margin: 'var(--space-md) 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SemaforoMini color="verde" />
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#22c55e' }}>{greenCount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SemaforoMini color="amarillo" />
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#eab308' }}>{yellowCount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SemaforoMini color="rojo" />
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ef4444' }}>{redCount}</span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>resultado IA diario</span>
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

          {/* Semáforo Timeline */}
          {semaforoHistory.length > 0 && (
            <div className="glass-card mb-xl">
              <h3 style={{ marginBottom: 'var(--space-sm)', fontSize: '1rem' }}>🚦 Evolución del Semáforo</h3>
              <SemaforoTimeline dias={semaforoHistory} />
            </div>
          )}

          {/* Day Grid */}
          <h2 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.5rem' }}>
            Programa de 14 Días
          </h2>

          <div className="day-grid stagger-children">
            {programData.dias.map((dia) => {
              const status = getDayStatus(dia.numero);
              const isCurrent = dia.numero === currentDay && !completedDays.includes(currentDay);
              const dayAnalisis = semaforoHistory.find(s => s.dia === dia.numero);

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
                  {dayAnalisis && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                      <SemaforoMini color={dayAnalisis.semaforo} />
                    </div>
                  )}

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
                🔓 Desbloquea los 14 días completos
              </h3>
              <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
                Obtén tu código de acceso por solo <strong style={{ color: 'var(--color-accent)' }}>70 Bs</strong>.
                Incluye todo el programa + análisis IA diario.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/59176419099?text=Hola%2C%20quiero%20activar%20mi%20código%20de%20acceso%20para%20el%20programa%2014%20Días%20Para%20Reconectar%20💕"
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
        <p>© 2025 14 Días Para Reconectar</p>
      </footer>
    </>
  );
}
