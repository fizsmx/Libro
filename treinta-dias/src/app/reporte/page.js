'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import programData from '@/data/program.json';

import { getCurrentUser } from '@/lib/supabase-auth';

export default function ReportePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState({});
  const [completedDays, setCompletedDays] = useState([]);
  const [reflections, setReflections] = useState({});

  useEffect(() => {
    async function initUser() {
      const currentUser = await getCurrentUser();
      if (!currentUser) { router.push('/login'); return; }
      setUser(currentUser);

      setCompletedDays(JSON.parse(localStorage.getItem('completed_days') || '[]'));
      setScores(JSON.parse(localStorage.getItem('connection_scores') || '{}'));

    // Load all reflections
    const allReflections = {};
    for (let i = 1; i <= 14; i++) {
      const r = localStorage.getItem(`reflection_day_${i}`);
      if (r) allReflections[i] = JSON.parse(r);
    }
    setReflections(allReflections);
  }
  initUser();
}, [router]);

  if (!user) return null;

  const totalCompleted = completedDays.length;
  const percentComplete = Math.round((totalCompleted / 14) * 100);
  const scoreValues = Object.values(scores).map(Number);
  const avgScore = scoreValues.length > 0
    ? (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1)
    : 0;
  const firstScore = scores[1] || 0;
  const lastScore = scores[completedDays.length] || scores[Math.max(...completedDays)] || 0;
  const maxScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;
  const minScore = scoreValues.length > 0 ? Math.min(...scoreValues) : 0;

  // Generate chart data
  const chartHeight = 200;
  const chartWidth = 100;
  const sortedDays = [...completedDays].sort((a, b) => a - b);

  const getConnectionColor = (score) => {
    if (score >= 7) return 'var(--color-connection-high)';
    if (score >= 4) return 'var(--color-connection-medium)';
    return 'var(--color-connection-low)';
  };

  const handleExportCSV = () => {
    let csv = 'Día,Tema,Conexión,Reflexión - Cómo me sentí,Reflexión - Qué aprendí,Reflexión - Qué quiero mejorar\n';
    for (let i = 1; i <= 14; i++) {
      const dia = programData.dias.find(d => d.numero === i);
      const score = scores[i] || '';
      const ref = reflections[i] || {};
      const row = [
        i,
        `"${dia?.titulo || ''}"`,
        score,
        `"${(ref.como_me_senti || '').replace(/"/g, '""')}"`,
        `"${(ref.que_aprendi || '').replace(/"/g, '""')}"`,
        `"${(ref.que_quiero_mejorar || '').replace(/"/g, '""')}"`,
      ];
      csv += row.join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '30_dias_reporte.csv';
    link.click();
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link href="/dashboard" className="header-logo">💕 <span>14 Días</span></Link>
          <nav className="header-nav">
            <Link href="/dashboard">Programa</Link>
            <Link href="/progreso">Progreso</Link>
          </nav>
        </div>
      </header>

      <main style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div className="container-narrow">
          <div style={{ padding: 'var(--space-2xl) 0' }}>
            <Link href="/dashboard" className="page-back">← Volver al programa</Link>

            {/* Header */}
            <div className="text-center" style={{ margin: 'var(--space-2xl) 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>🏆</div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>
                Reporte Final
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                Tu resumen completo del programa 14 Días Para Reconectar
              </p>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
              {[
                { value: `${totalCompleted}/30`, label: 'Días Completados', color: 'var(--color-primary-light)' },
                { value: `${percentComplete}%`, label: 'Progreso', color: 'var(--color-accent)' },
                { value: avgScore, label: 'Conexión Promedio', color: 'var(--color-info)' },
                { value: `${firstScore}→${lastScore}`, label: 'Primer → Último', color: lastScore > firstScore ? 'var(--color-success)' : 'var(--color-warning)' },
              ].map((stat, i) => (
                <div key={i} className="glass-card text-center" style={{ padding: 'var(--space-lg)', animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: stat.color }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Connection Evolution Chart */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>📈 Evolución de Conexión</h3>
              <div style={{
                display: 'flex', alignItems: 'flex-end', gap: '3px',
                height: `${chartHeight}px`, padding: '0 var(--space-sm)',
                borderBottom: '1px solid var(--color-border)',
              }}>
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                  const score = scores[day];
                  const h = score ? (score / 10) * (chartHeight - 20) : 0;
                  const isCompleted = completedDays.includes(day);
                  return (
                    <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                      {score && (
                        <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                          {score}
                        </span>
                      )}
                      <div style={{
                        width: '100%',
                        maxWidth: '24px',
                        height: `${h}px`,
                        background: isCompleted ? getConnectionColor(score) : 'rgba(255,255,255,0.05)',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.5s ease',
                        minHeight: isCompleted ? '4px' : '0',
                        opacity: isCompleted ? 1 : 0.3,
                      }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-sm)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                <span>Día 1</span>
                <span>Día 10</span>
                <span>Día 20</span>
                <span>Día 30</span>
              </div>
            </div>

            {/* Comparison */}
            {firstScore > 0 && lastScore > 0 && (
              <div className="glass-card" style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>🔄 Día 1 vs Último Día</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-2xl)' }}>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: getConnectionColor(firstScore) }}>
                      {firstScore}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Día 1</div>
                  </div>
                  <div style={{ fontSize: '2rem', color: lastScore >= firstScore ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {lastScore >= firstScore ? '📈' : '📉'}
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: getConnectionColor(lastScore) }}>
                      {lastScore}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Último Día</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-md)' }}>
                  {lastScore > firstScore
                    ? `¡Tu nivel de conexión mejoró ${lastScore - firstScore} puntos! 🎉`
                    : lastScore === firstScore
                      ? 'Tu nivel de conexión se mantuvo estable.'
                      : 'No te desanimes — cada día es una oportunidad de reconectar.'}
                </p>
              </div>
            )}

            {/* Topics Covered */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>📋 Temas Trabajados</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                {programData.dias.map(dia => {
                  const isCompleted = completedDays.includes(dia.numero);
                  return (
                    <span key={dia.numero} style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      background: isCompleted ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.03)',
                      color: isCompleted ? 'var(--color-success)' : 'var(--color-text-muted)',
                      border: `1px solid ${isCompleted ? 'rgba(74,222,128,0.2)' : 'var(--color-border)'}`,
                    }}>
                      {isCompleted ? '✓' : '○'} {dia.titulo}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Best Reflections */}
            {Object.keys(reflections).length > 0 && (
              <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>💭 Mis Reflexiones</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {Object.entries(reflections).slice(0, 10).map(([day, ref]) => (
                    <div key={day} style={{
                      padding: 'var(--space-md)',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid var(--color-primary)',
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', marginBottom: '4px', fontWeight: 600 }}>
                        Día {day} — {programData.dias.find(d => d.numero === parseInt(day))?.titulo}
                      </div>
                      {ref.como_me_senti && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                          <em>💭 {ref.como_me_senti}</em>
                        </p>
                      )}
                      {ref.que_aprendi && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                          <em>💡 {ref.que_aprendi}</em>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="text-center" style={{ paddingBottom: 'var(--space-4xl)' }}>
              <button className="btn btn-accent btn-lg" onClick={handleExportCSV} style={{ marginBottom: 'var(--space-md)' }}>
                📥 Descargar Reporte CSV
              </button>
              <br />
              <Link href="/dashboard" className="btn btn-secondary mt-md">
                📘 Volver al Programa
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 14 Días Para Reconectar</p>
      </footer>
    </>
  );
}
