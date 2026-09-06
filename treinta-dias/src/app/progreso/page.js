'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import programData from '@/data/program.json';

export default function ProgresoPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    const demoUser = localStorage.getItem('demo_user');
    if (!demoUser) { router.push('/login'); return; }
    setUser(JSON.parse(demoUser));

    const savedCompleted = localStorage.getItem('completed_days');
    if (savedCompleted) setCompletedDays(JSON.parse(savedCompleted));

    const savedScores = localStorage.getItem('connection_scores');
    if (savedScores) setScores(JSON.parse(savedScores));
  }, [router]);

  const scoreValues = Object.entries(scores).sort(([a], [b]) => Number(a) - Number(b));
  const avgScore = scoreValues.length > 0
    ? (scoreValues.reduce((acc, [, v]) => acc + v, 0) / scoreValues.length).toFixed(1)
    : 0;
  const maxScore = scoreValues.length > 0 ? Math.max(...scoreValues.map(([, v]) => v)) : 0;
  const minScore = scoreValues.length > 0 ? Math.min(...scoreValues.map(([, v]) => v)) : 0;
  const trend = scoreValues.length >= 2
    ? scoreValues[scoreValues.length - 1][1] - scoreValues[0][1]
    : 0;

  const getBarColor = (score) => {
    if (score >= 7) return 'var(--color-connection-high)';
    if (score >= 4) return 'var(--color-connection-medium)';
    return 'var(--color-connection-low)';
  };

  if (!user) return null;

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link href="/dashboard" className="header-logo">💕 <span>30 Días</span></Link>
          <nav className="header-nav">
            <Link href="/dashboard">Programa</Link>
            <Link href="/progreso" className="active">Progreso</Link>
          </nav>
        </div>
      </header>

      <main style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ padding: 'var(--space-2xl) 0' }}>
            <Link href="/dashboard" className="page-back">← Volver al programa</Link>
            <h1 style={{ marginTop: 'var(--space-lg)' }}>📊 Tu Progreso</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Visualiza tu evolución durante el programa de 30 días
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
            <div className="glass-card text-center">
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                {completedDays.length}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Días Completados</div>
            </div>
            <div className="glass-card text-center">
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-accent)' }}>
                {avgScore}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Promedio Conexión</div>
            </div>
            <div className="glass-card text-center">
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: trend >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {trend > 0 ? '+' : ''}{trend}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Tendencia</div>
            </div>
            <div className="glass-card text-center">
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-info)' }}>
                {Math.round((completedDays.length / 30) * 100)}%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Programa Completo</div>
            </div>
          </div>

          {/* Connection Chart */}
          <div className="glass-card mb-xl">
            <h3 style={{ marginBottom: 'var(--space-xl)' }}>📈 Evolución del Nivel de Conexión</h3>
            {scoreValues.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
                Aún no tienes puntuaciones registradas. Completa al menos un día para ver tu gráfico.
              </p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '200px', padding: '0 var(--space-md)' }}>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const score = scores[day];
                  const height = score ? (score / 10) * 100 : 0;
                  return (
                    <div
                      key={day}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {score && (
                        <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                          {score}
                        </span>
                      )}
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '24px',
                          height: `${height}%`,
                          background: score ? getBarColor(score) : 'rgba(255,255,255,0.03)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.5s ease',
                          minHeight: score ? '4px' : '2px',
                        }}
                        title={score ? `Día ${day}: ${score}/10` : `Día ${day}: sin dato`}
                      />
                      <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Day-by-day breakdown */}
          <div className="glass-card">
            <h3 style={{ marginBottom: 'var(--space-xl)' }}>📅 Detalle por Día</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {programData.dias.map((dia) => {
                const isCompleted = completedDays.includes(dia.numero);
                const score = scores[dia.numero];
                return (
                  <div
                    key={dia.numero}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      background: isCompleted ? 'rgba(74,222,128,0.05)' : 'transparent',
                      border: '1px solid',
                      borderColor: isCompleted ? 'rgba(74,222,128,0.15)' : 'var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <span>{isCompleted ? '✅' : '⬜'}</span>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Día {dia.numero}</span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginLeft: 'var(--space-sm)' }}>
                          {dia.titulo}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      {score && (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          background: `${getBarColor(score)}22`,
                          color: getBarColor(score),
                          fontWeight: 600,
                          fontSize: '0.8rem',
                        }}>
                          {score}/10
                        </span>
                      )}
                      {isCompleted && (
                        <Link href={`/dia/${dia.numero}`} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                          Revisar
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer mt-2xl">
        <p>© 2024 30 Días Para Reconectar</p>
      </footer>
    </>
  );
}
