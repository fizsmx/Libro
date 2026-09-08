'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import programData from '@/data/program.json';
import Celebration from '@/components/Celebration';
import TurnHandler from '@/components/TurnHandler';
import AnalisisIA from '@/components/AnalisisIA';
import { getCurrentUser } from '@/lib/supabase-auth';

export default function DiaPage({ params }) {
  const { numero } = use(params);
  const dayNum = parseInt(numero, 10);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [allAnswers, setAllAnswers] = useState({}); // {0: {persona1: '...', persona2: '...'}, 1: ...}
  const [dayCompleted, setDayCompleted] = useState(false);
  const [toast, setToast] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [analisis, setAnalisis] = useState(null);
  const [loadingAnalisis, setLoadingAnalisis] = useState(false);

  const dia = programData.dias.find(d => d.numero === dayNum);

  useEffect(() => {
    async function loadDia() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Check access
      if (dayNum > 1 && !currentUser.tiene_acceso_completo) {
        router.push('/activar');
        return;
      }

      // Load saved answers (new format: {questionIndex: {persona1, persona2}})
      const savedAnswers = localStorage.getItem(`turns_day_${dayNum}`);
      if (savedAnswers) {
        setAllAnswers(JSON.parse(savedAnswers));
      }

      // Check if day is completed
      const completedDays = JSON.parse(localStorage.getItem('completed_days') || '[]');
      setDayCompleted(completedDays.includes(dayNum));

      // Load saved analysis
      const savedAnalisis = localStorage.getItem(`analisis_day_${dayNum}`);
      if (savedAnalisis) {
        setAnalisis(JSON.parse(savedAnalisis));
      }
    }

    loadDia();
  }, [dayNum, router]);

  if (!dia) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <h2>Día no encontrado</h2>
          <p className="mt-md" style={{ color: 'var(--color-text-secondary)' }}>
            El día {numero} no existe en el programa.
          </p>
          <Link href="/dashboard" className="btn btn-primary mt-lg">
            Volver al programa
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveAnswer = (questionIndex, persona, answer) => {
    const updated = {
      ...allAnswers,
      [questionIndex]: {
        ...(allAnswers[questionIndex] || {}),
        [`persona${persona}`]: answer,
      },
    };
    setAllAnswers(updated);
    localStorage.setItem(`turns_day_${dayNum}`, JSON.stringify(updated));
    showToastMsg(
      persona === 1 ? '✓ Respuesta de Persona 1 guardada' : '✓ ¡Ambas respuestas guardadas!',
      'success'
    );
  };

  const getCompletedCount = () => {
    return Object.values(allAnswers).filter(a => a.persona1 && a.persona2).length;
  };

  const handleCompleteDay = async () => {
    const completedDays = JSON.parse(localStorage.getItem('completed_days') || '[]');
    if (!completedDays.includes(dayNum)) {
      completedDays.push(dayNum);
      localStorage.setItem('completed_days', JSON.stringify(completedDays));
    }
    setDayCompleted(true);

    // Check for milestones
    if ([7, 14].includes(dayNum)) {
      setShowCelebration(true);
    } else {
      showToastMsg('¡Día completado! 🎉', 'success');
    }

    // Trigger AI analysis
    await requestAnalisis();
  };

  const requestAnalisis = async () => {
    setLoadingAnalisis(true);
    try {
      // Build responses array
      const respuestas = dia.preguntas.map((p, i) => ({
        pregunta: p.texto,
        persona1: allAnswers[i]?.persona1 || '',
        persona2: allAnswers[i]?.persona2 || '',
      }));

      // Build history from previous days
      const historial = [];
      for (let i = 1; i < dayNum; i++) {
        const savedAnalisis = localStorage.getItem(`analisis_day_${i}`);
        if (savedAnalisis) {
          const parsed = JSON.parse(savedAnalisis);
          historial.push({
            dia: i,
            semaforo: parsed.semaforo,
            resumen: parsed.conclusion?.substring(0, 100),
          });
        }
      }

      const response = await fetch('/api/analisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dia: dayNum, tema: dia.tema, respuestas, historial }),
      });

      const data = await response.json();
      const result = data.analisis;
      setAnalisis(result);
      localStorage.setItem(`analisis_day_${dayNum}`, JSON.stringify(result));
    } catch (error) {
      console.error('Error requesting analysis:', error);
      showToastMsg('Error al generar análisis IA', 'error');
    } finally {
      setLoadingAnalisis(false);
    }
  };

  const showToastMsg = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const completedCount = getCompletedCount();
  const totalQuestions = dia.preguntas.length;
  const progressPercent = (completedCount / totalQuestions) * 100;

  const getQuestionTypeLabel = (tipo) => {
    const labels = {
      reflexion: '🪞 Reflexión',
      compartida: '💕 Compartida',
      profunda: '🌊 Profunda',
      compromiso: '🤝 Compromiso',
    };
    return labels[tipo] || tipo;
  };

  if (!user) return null;

  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && (
        <Celebration
          dayNumber={dayNum}
          onClose={() => {
            setShowCelebration(false);
            if (dayNum === 14) router.push('/reporte');
          }}
        />
      )}

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <Link href="/dashboard" className="header-logo">
            💕 <span>14 Días</span>
          </Link>
          <nav className="header-nav">
            <Link href="/dashboard">Programa</Link>
            <Link href="/progreso">Progreso</Link>
          </nav>
        </div>
      </header>

      <main style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div className="container-narrow">
          {/* Page Header */}
          <div className="page-header" style={{ padding: 'var(--space-xl) 0' }}>
            <Link href="/dashboard" className="page-back">
              ← Volver al programa
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
              <span className={`badge ${dia.gratuito ? 'badge-free' : dayCompleted ? 'badge-complete' : ''}`}>
                {dia.gratuito ? '✨ Gratis' : dayCompleted ? '✅ Completado' : `Día ${dia.numero}`}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {dia.tema}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginBottom: 'var(--space-sm)' }}>
              Día {dia.numero}: {dia.titulo}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '600px' }}>
              {dia.descripcion}
            </p>

            {/* Turn-based indicator */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)',
              marginTop: 'var(--space-md)', padding: '8px 16px',
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: '#818cf8',
            }}>
              📱 Un dispositivo, dos voces — responden por turnos
            </div>

            {/* Progress */}
            <div style={{ marginTop: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {completedCount} de {totalQuestions} preguntas completadas (ambos)
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-light)' }}>
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Questions with Turn Handler */}
          <div className="stagger-children">
            {dia.preguntas.map((pregunta) => (
              <TurnHandler
                key={pregunta.index}
                pregunta={pregunta}
                questionIndex={pregunta.index}
                savedAnswers={allAnswers[pregunta.index]}
                onSaveAnswer={handleSaveAnswer}
                getQuestionTypeLabel={getQuestionTypeLabel}
              />
            ))}
          </div>

          {/* AI Analysis Section (shown after completing or when saved) */}
          {(dayCompleted || analisis || loadingAnalisis) && (
            <div style={{ marginTop: 'var(--space-2xl)' }}>
              <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)', fontSize: '1.4rem' }}>
                🧠 Análisis de la IA
              </h2>
              <AnalisisIA analisis={analisis} loading={loadingAnalisis} />
            </div>
          )}

          {/* Complete Day Button */}
          <div className="text-center mt-2xl" style={{ paddingBottom: 'var(--space-4xl)' }}>
            {!dayCompleted ? (
              <button
                className="btn btn-accent btn-lg"
                onClick={handleCompleteDay}
                disabled={completedCount < 5}
              >
                {completedCount < 5
                  ? `Ambos deben responder al menos 5 preguntas (${completedCount}/${totalQuestions})`
                  : `✅ Completar Día ${dia.numero} y ver análisis`
                }
              </button>
            ) : (
              <div>
                <p style={{ color: 'var(--color-success)', fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
                  🎉 ¡Día {dia.numero} completado!
                </p>
                {!analisis && !loadingAnalisis && (
                  <button className="btn btn-primary mb-lg" onClick={requestAnalisis}>
                    🧠 Generar Análisis IA
                  </button>
                )}
                {dayNum < 14 ? (
                  <Link href={`/dia/${dayNum + 1}`} className="btn btn-primary btn-lg">
                    Siguiente: Día {dayNum + 1} →
                  </Link>
                ) : (
                  <div className="glass-card" style={{ borderColor: 'var(--color-accent)', padding: 'var(--space-2xl)' }}>
                    <h2 style={{ marginBottom: 'var(--space-md)' }}>🏆 ¡PROGRAMA COMPLETADO!</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                      Han completado los 14 días del programa. ¡Celebren juntos este logro increíble!
                    </p>
                    <Link href="/reporte" className="btn btn-accent btn-lg">
                      📊 Ver Reporte Final
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Nav between days */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2xl)' }}>
              {dayNum > 1 && (
                <Link href={`/dia/${dayNum - 1}`} className="btn btn-secondary btn-sm">
                  ← Día {dayNum - 1}
                </Link>
              )}
              <div style={{ flex: 1 }}></div>
              {dayNum < 14 && dayCompleted && (
                <Link href={`/dia/${dayNum + 1}`} className="btn btn-secondary btn-sm">
                  Día {dayNum + 1} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
