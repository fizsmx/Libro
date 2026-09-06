'use client';

import { useState, useEffect } from 'react';

const MILESTONES = {
  7: {
    title: '¡Primera semana completada!',
    emoji: '🌟',
    message: 'Han dedicado 7 días consecutivos a su relación. ¡Eso es compromiso real!',
    color: '#60A5FA',
  },
  15: {
    title: '¡Mitad del camino!',
    emoji: '🔥',
    message: 'Llevan 15 días trabajando juntos. Ya están viendo resultados, ¿verdad?',
    color: '#F5B041',
  },
  21: {
    title: '¡21 días — Se creó el hábito!',
    emoji: '💪',
    message: 'Dicen que 21 días crean un hábito. La reconexión ya es parte de su rutina.',
    color: '#9B6DAB',
  },
  30: {
    title: '¡30 DÍAS COMPLETADOS!',
    emoji: '🏆',
    message: 'Lo lograron. 30 días de conversaciones profundas, reflexiones y crecimiento juntos. ¡Celebren este logro!',
    color: '#4ADE80',
  },
};

function Confetti({ color }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#E8636F', '#F5B041', '#6C3D7A', '#4ADE80', '#60A5FA', '#F2919A', '#9B6DAB', '#FBBF24'];
    const newParticles = [];
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 300, overflow: 'hidden',
    }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            background: p.color,
            borderRadius: '2px',
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function Celebration({ dayNumber, onClose }) {
  const [show, setShow] = useState(false);
  const milestone = MILESTONES[dayNumber];

  useEffect(() => {
    if (!milestone) return;
    // Check if already celebrated
    const celebrated = JSON.parse(localStorage.getItem('celebrated_milestones') || '[]');
    if (celebrated.includes(dayNumber)) return;

    setShow(true);
    celebrated.push(dayNumber);
    localStorage.setItem('celebrated_milestones', JSON.stringify(celebrated));
  }, [dayNumber, milestone]);

  if (!show || !milestone) return null;

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  return (
    <>
      <Confetti />
      <div
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 250, animation: 'fadeIn 0.3s ease',
          padding: '24px',
        }}
        onClick={handleClose}
      >
        <div
          style={{
            background: 'var(--color-bg-secondary)',
            border: `2px solid ${milestone.color}40`,
            borderRadius: 'var(--radius-xl)',
            padding: '48px 40px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: `0 0 60px ${milestone.color}30`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            fontSize: '4rem',
            marginBottom: '16px',
            animation: 'float 2s ease-in-out infinite',
          }}>
            {milestone.emoji}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            marginBottom: '12px',
            background: `linear-gradient(135deg, ${milestone.color}, var(--color-primary-light))`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {milestone.title}
          </h2>

          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}>
            {milestone.message}
          </p>

          <div style={{
            padding: '12px 20px',
            background: `${milestone.color}15`,
            border: `1px solid ${milestone.color}30`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
          }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: milestone.color }}>
              {dayNumber}/30
            </span>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              días completados
            </span>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleClose}
            style={{ minWidth: '200px' }}
          >
            {dayNumber === 30 ? '🏆 Ver mi Reporte' : '💕 ¡Seguir adelante!'}
          </button>
        </div>
      </div>
    </>
  );
}
