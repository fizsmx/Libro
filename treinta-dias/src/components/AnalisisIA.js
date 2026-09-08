'use client';

import Semaforo from './Semaforo';

export default function AnalisisIA({ analisis, loading = false }) {
  if (loading) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-md)', animation: 'spin 2s linear infinite' }}>🧠</div>
        <h3 style={{ marginBottom: 'var(--space-sm)' }}>Analizando sus respuestas...</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          La IA está comparando las respuestas de ambos para generar un análisis personalizado
        </p>
        <div style={{
          width: '60%', maxWidth: '200px', height: '4px',
          background: 'var(--color-border)', borderRadius: 'var(--radius-full)',
          margin: '24px auto 0', overflow: 'hidden',
        }}>
          <div style={{
            width: '40%', height: '100%',
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-full)',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }} />
        </div>
        <style jsx>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
        `}</style>
      </div>
    );
  }

  if (!analisis) return null;

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Semáforo principal */}
      <div className="glass-card" style={{
        textAlign: 'center',
        padding: 'var(--space-2xl)',
        borderColor: analisis.semaforo === 'verde' ? 'rgba(34,197,94,0.3)' :
          analisis.semaforo === 'amarillo' ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)',
      }}>
        <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.1rem' }}>
          🔍 Análisis del Día
        </h3>
        <Semaforo color={analisis.semaforo} size="xl" />
      </div>

      {/* Conclusión */}
      <div className="glass-card" style={{ animationDelay: '0.1s' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
          📝 Conclusión
        </h4>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {analisis.conclusion}
        </p>
      </div>

      {/* Fortalezas */}
      {analisis.fortalezas && analisis.fortalezas.length > 0 && (
        <div className="glass-card" style={{ animationDelay: '0.2s' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
            💪 Fortalezas de la Pareja
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {analisis.fortalezas.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '10px 14px',
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.15)',
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ color: '#22c55e', fontSize: '1.1rem', flexShrink: 0 }}>✓</span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Área de trabajo */}
      {analisis.area_trabajo && (
        <div className="glass-card" style={{
          animationDelay: '0.3s',
          borderLeft: '3px solid #eab308',
        }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
            🎯 Área para Trabajar
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>
            {analisis.area_trabajo}
          </p>
        </div>
      )}

      {/* Tip */}
      {analisis.tip && (
        <div className="glass-card" style={{
          animationDelay: '0.4s',
          background: 'linear-gradient(135deg, rgba(232,99,111,0.05) 0%, rgba(168,85,247,0.05) 100%)',
          borderColor: 'rgba(232,99,111,0.2)',
        }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
            💡 Tip del Día
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>
            {analisis.tip}
          </p>
        </div>
      )}

      {/* Reto */}
      {analisis.reto && (
        <div className="glass-card" style={{
          animationDelay: '0.5s',
          background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(99,102,241,0.08) 100%)',
          borderColor: 'rgba(168,85,247,0.25)',
          textAlign: 'center',
        }}>
          <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
            🏆 Reto para las Próximas 24h
          </h4>
          <p style={{
            color: 'var(--color-text-primary)',
            lineHeight: 1.7,
            fontSize: '1rem',
            fontWeight: 500,
          }}>
            {analisis.reto}
          </p>
        </div>
      )}

      {/* Alerta profesional */}
      {analisis.alerta_profesional && (
        <div style={{
          padding: 'var(--space-lg)',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--radius-lg)',
          borderLeft: '4px solid #ef4444',
          animationDelay: '0.6s',
        }}>
          <h4 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-sm)' }}>
            ⚠️ Nota Importante
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {analisis.alerta_profesional}
          </p>
        </div>
      )}
    </div>
  );
}
