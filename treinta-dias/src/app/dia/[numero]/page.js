'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import programData from '@/data/program.json';

export default function DiaPage({ params }) {
  const { numero } = use(params);
  const dayNum = parseInt(numero, 10);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [answers, setAnswers] = useState({});
  const [connectionScore, setConnectionScore] = useState(5);
  const [reflection, setReflection] = useState({ como_me_senti: '', que_aprendi: '', que_quiero_mejorar: '' });
  const [saved, setSaved] = useState({});
  const [showReflection, setShowReflection] = useState(false);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [toast, setToast] = useState(null);

  const dia = programData.dias.find(d => d.numero === dayNum);

  useEffect(() => {
    const demoUser = localStorage.getItem('demo_user');
    if (!demoUser) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(demoUser);
    setUser(parsed);

    // Check access
    if (dayNum > 1 && !parsed.tiene_acceso_completo) {
      router.push('/activar');
      return;
    }

    // Load saved answers
    const savedAnswers = localStorage.getItem(`answers_day_${dayNum}`);
    if (savedAnswers) {
      const parsed = JSON.parse(savedAnswers);
      setAnswers(parsed);
      setSaved(Object.keys(parsed).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }

    // Load saved reflection
    const savedReflection = localStorage.getItem(`reflection_day_${dayNum}`);
    if (savedReflection) {
      setReflection(JSON.parse(savedReflection));
    }

    // Load connection score
    const savedScores = localStorage.getItem('connection_scores');
    if (savedScores) {
      const scores = JSON.parse(savedScores);
      if (scores[dayNum]) {
        setConnectionScore(scores[dayNum]);
      }
    }

    // Check if day is completed
    const completedDays = JSON.parse(localStorage.getItem('completed_days') || '[]');
    setDayCompleted(completedDays.includes(dayNum));
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

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSaveAnswer = (index) => {
    if (!answers[index] || answers[index].trim() === '') return;

    const updatedAnswers = { ...answers, [index]: answers[index] };
    localStorage.setItem(`answers_day_${dayNum}`, JSON.stringify(updatedAnswers));
    setSaved(prev => ({ ...prev, [index]: true }));
    showToast('Respuesta guardada ✓', 'success');
  };

  const handleSaveReflection = () => {
    localStorage.setItem(`reflection_day_${dayNum}`, JSON.stringify(reflection));
    showToast('Reflexión guardada ✓', 'success');
  };

  const handleSaveConnectionScore = (score) => {
    setConnectionScore(score);
    const savedScores = JSON.parse(localStorage.getItem('connection_scores') || '{}');
    savedScores[dayNum] = score;
    localStorage.setItem('connection_scores', JSON.stringify(savedScores));
    showToast(`Nivel de conexión: ${score}/10`, 'success');
  };

  const handleCompleteDay = () => {
    const completedDays = JSON.parse(localStorage.getItem('completed_days') || '[]');
    if (!completedDays.includes(dayNum)) {
      completedDays.push(dayNum);
      localStorage.setItem('completed_days', JSON.stringify(completedDays));
    }
    setDayCompleted(true);
    showToast('¡Día completado! 🎉', 'success');

    // If day 30, show celebration
    if (dayNum === 30) {
      setTimeout(() => {
        showToast('🎉 ¡Felicidades! Han completado los 30 días. ¡Celebren juntos!', 'success');
      }, 1500);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const answeredCount = Object.keys(saved).length;
  const totalQuestions = dia.preguntas.length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  const getQuestionTypeLabel = (tipo) => {
    const labels = {
      reflexion: '🪞 Reflexión',
      compartida: '💕 Compartida',
      profunda: '🌊 Profunda',
      evaluacion: '📊 Evaluación',
      compromiso: '🤝 Compromiso',
    };
    return labels[tipo] || tipo;
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

            {/* Progress */}
            <div style={{ marginTop: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {answeredCount} de {totalQuestions} preguntas respondidas
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

          {/* Questions */}
          <div className="stagger-children">
            {dia.preguntas.map((pregunta) => (
              <div key={pregunta.index} className="question-card" style={{ animationDelay: `${pregunta.index * 0.05}s` }}>
                <div className="question-header">
                  <div className="question-number">{pregunta.index + 1}</div>
                  <span className={`question-type ${pregunta.tipo}`}>
                    {getQuestionTypeLabel(pregunta.tipo)}
                  </span>
                </div>

                <p className="question-text">{pregunta.texto}</p>

                <textarea
                  className="input w-full"
                  placeholder="Escribe tu respuesta aquí..."
                  value={answers[pregunta.index] || ''}
                  onChange={(e) => handleAnswerChange(pregunta.index, e.target.value)}
                  style={{ minHeight: '100px' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSaveAnswer(pregunta.index)}
                    disabled={!answers[pregunta.index] || answers[pregunta.index].trim() === ''}
                  >
                    💾 Guardar
                  </button>
                  {saved[pregunta.index] && (
                    <span className="question-saved">
                      ✅ Guardada
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Connection Score */}
          <div className="glass-card mt-2xl" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>
              📊 ¿Cómo te sientes de conectado/a hoy?
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
              {[1,2,3,4,5,6,7,8,9,10].map((score) => (
                <button
                  key={score}
                  onClick={() => handleSaveConnectionScore(score)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-full)',
                    border: connectionScore === score ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: connectionScore === score ? 'var(--gradient-primary)' : 'var(--color-bg-card)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {score}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              1 = muy desconectado/a · 10 = completamente conectado/a
            </p>
          </div>

          {/* Daily Reflection */}
          <div className="glass-card mt-lg">
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setShowReflection(!showReflection)}
            >
              <h3>🧠 Reflexión del Día</h3>
              <span style={{ fontSize: '1.2rem', transition: 'transform var(--transition-fast)', transform: showReflection ? 'rotate(180deg)' : 'rotate(0)' }}>
                ▼
              </span>
            </div>

            {showReflection && (
              <div style={{ marginTop: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div className="input-group">
                  <label>¿Cómo me sentí hoy?</label>
                  <textarea
                    className="input"
                    placeholder="Describe tus emociones..."
                    value={reflection.como_me_senti}
                    onChange={(e) => setReflection(prev => ({ ...prev, como_me_senti: e.target.value }))}
                    style={{ minHeight: '80px' }}
                  />
                </div>
                <div className="input-group">
                  <label>¿Qué aprendí de mi pareja?</label>
                  <textarea
                    className="input"
                    placeholder="Algo nuevo que descubrí..."
                    value={reflection.que_aprendi}
                    onChange={(e) => setReflection(prev => ({ ...prev, que_aprendi: e.target.value }))}
                    style={{ minHeight: '80px' }}
                  />
                </div>
                <div className="input-group">
                  <label>¿Qué quiero mejorar?</label>
                  <textarea
                    className="input"
                    placeholder="Un aspecto en el que quiero trabajar..."
                    value={reflection.que_quiero_mejorar}
                    onChange={(e) => setReflection(prev => ({ ...prev, que_quiero_mejorar: e.target.value }))}
                    style={{ minHeight: '80px' }}
                  />
                </div>
                <button className="btn btn-secondary" onClick={handleSaveReflection}>
                  💾 Guardar Reflexión
                </button>
              </div>
            )}
          </div>

          {/* Complete Day Button */}
          <div className="text-center mt-2xl" style={{ paddingBottom: 'var(--space-4xl)' }}>
            {!dayCompleted ? (
              <button
                className="btn btn-accent btn-lg"
                onClick={handleCompleteDay}
                disabled={answeredCount < 5}
              >
                {answeredCount < 5
                  ? `Responde al menos 5 preguntas (${answeredCount}/${totalQuestions})`
                  : `✅ Completar Día ${dia.numero}`
                }
              </button>
            ) : (
              <div>
                <p style={{ color: 'var(--color-success)', fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
                  🎉 ¡Día {dia.numero} completado!
                </p>
                {dayNum < 30 ? (
                  <Link href={`/dia/${dayNum + 1}`} className="btn btn-primary btn-lg">
                    Siguiente: Día {dayNum + 1} →
                  </Link>
                ) : (
                  <div className="glass-card" style={{ borderColor: 'var(--color-accent)', padding: 'var(--space-2xl)' }}>
                    <h2 style={{ marginBottom: 'var(--space-md)' }}>🎉 ¡FELICIDADES!</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
                      Han completado los 30 días del programa. Han demostrado un compromiso
                      real con su relación. ¡Celebren juntos este logro!
                    </p>
                    <Link href="/progreso" className="btn btn-accent btn-lg mt-lg">
                      📊 Ver Resumen Final
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
              {dayNum < 30 && dayCompleted && (
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
