'use client';

import { useState } from 'react';

export default function Semaforo({ color, size = 'md', showLabel = true, animated = true }) {
  const colors = {
    verde: { bg: '#22c55e', glow: 'rgba(34,197,94,0.4)', label: 'Bien encaminados', emoji: '🟢' },
    amarillo: { bg: '#eab308', glow: 'rgba(234,179,8,0.4)', label: 'Hay aspectos a trabajar', emoji: '🟡' },
    rojo: { bg: '#ef4444', glow: 'rgba(239,68,68,0.4)', label: 'Necesitan atención urgente', emoji: '🔴' },
  };

  const sizes = {
    sm: { dot: 16, font: '0.7rem' },
    md: { dot: 28, font: '0.85rem' },
    lg: { dot: 40, font: '1rem' },
    xl: { dot: 56, font: '1.1rem' },
  };

  const c = colors[color] || colors.verde;
  const s = sizes[size] || sizes.md;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-sm, 8px)',
    }}>
      <div style={{
        width: s.dot,
        height: s.dot,
        borderRadius: '50%',
        background: c.bg,
        boxShadow: animated ? `0 0 ${s.dot / 2}px ${c.glow}, 0 0 ${s.dot}px ${c.glow}` : 'none',
        animation: animated ? 'semaforoPulse 2s ease-in-out infinite' : 'none',
        flexShrink: 0,
      }} />
      {showLabel && (
        <span style={{
          fontSize: s.font,
          color: 'var(--color-text-secondary, #94a3b8)',
          fontWeight: 500,
        }}>
          {c.label}
        </span>
      )}
      <style jsx>{`
        @keyframes semaforoPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

// Mini semáforo para timeline/historial
export function SemaforoMini({ color }) {
  const colors = {
    verde: '#22c55e',
    amarillo: '#eab308',
    rojo: '#ef4444',
  };

  return (
    <span style={{
      display: 'inline-block',
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: colors[color] || '#475569',
      flexShrink: 0,
    }} />
  );
}

// Timeline de semáforos para el progreso
export function SemaforoTimeline({ dias }) {
  // dias = [{dia: 1, semaforo: 'verde'}, {dia: 2, semaforo: 'amarillo'}, ...]
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      flexWrap: 'wrap',
      padding: 'var(--space-md, 12px) 0',
    }}>
      {Array.from({ length: 14 }, (_, i) => {
        const diaData = dias.find(d => d.dia === i + 1);
        return (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}>
            <SemaforoMini color={diaData?.semaforo} />
            <span style={{
              fontSize: '0.65rem',
              color: 'var(--color-text-muted, #64748b)',
            }}>
              {i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}
