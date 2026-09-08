'use client';

import { useState } from 'react';

/**
 * TurnHandler manages the turn-based answering flow for couples.
 * 
 * Flow:
 * 1. Show question
 * 2. "Persona 1, responde" → textarea → Save
 * 3. Response hidden → transition screen "Pass device to partner"
 * 4. "Persona 2, responde" → textarea → Save
 * 5. Both responses revealed side by side
 * 6. Next question
 */
export default function TurnHandler({ 
  pregunta, 
  questionIndex, 
  savedAnswers,
  onSaveAnswer,
  getQuestionTypeLabel,
}) {
  const [currentTurn, setCurrentTurn] = useState(() => {
    // Determine initial turn state based on saved answers
    const p1 = savedAnswers?.persona1;
    const p2 = savedAnswers?.persona2;
    if (p1 && p2) return 'complete';
    if (p1) return 'transition';
    return 'persona1';
  });
  const [answer, setAnswer] = useState('');
  const [showReveal, setShowReveal] = useState(() => {
    return savedAnswers?.persona1 && savedAnswers?.persona2;
  });

  const handleSave = (persona) => {
    if (!answer.trim()) return;
    onSaveAnswer(questionIndex, persona, answer.trim());
    setAnswer('');
    
    if (persona === 1) {
      setCurrentTurn('transition');
    } else {
      setCurrentTurn('complete');
      setShowReveal(true);
    }
  };

  const handleStartPersona2 = () => {
    setCurrentTurn('persona2');
  };

  return (
    <div className="question-card" style={{ animationDelay: `${questionIndex * 0.05}s` }}>
      {/* Question Header */}
      <div className="question-header">
        <div className="question-number">{questionIndex + 1}</div>
        <span className={`question-type ${pregunta.tipo}`}>
          {getQuestionTypeLabel(pregunta.tipo)}
        </span>
      </div>

      <p className="question-text">{pregunta.texto}</p>

      {/* === PERSONA 1 TURN === */}
      {currentTurn === 'persona1' && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', marginBottom: 'var(--space-md)',
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: '#818cf8',
            fontWeight: 600,
          }}>
            👤 Persona 1 — Tu turno de responder
          </div>
          <textarea
            className="input w-full"
            placeholder="Escribe tu respuesta aquí..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ minHeight: '100px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleSave(1)}
              disabled={!answer.trim()}
            >
              💾 Guardar y pasar a Persona 2
            </button>
          </div>
        </div>
      )}

      {/* === TRANSITION SCREEN === */}
      {currentTurn === 'transition' && (
        <div style={{
          animation: 'fadeInUp 0.3s ease',
          textAlign: 'center',
          padding: 'var(--space-xl)',
          background: 'linear-gradient(135deg, rgba(232,99,111,0.06) 0%, rgba(168,85,247,0.06) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed rgba(232,99,111,0.25)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>📱</div>
          <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-primary-light)' }}>
            ¡Pasa el dispositivo a tu pareja!
          </h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}>
            Persona 1 ya respondió. Ahora es el turno de Persona 2.
            <br />La respuesta de Persona 1 está oculta hasta que ambos terminen.
          </p>
          <button
            className="btn btn-accent btn-sm"
            onClick={handleStartPersona2}
          >
            👤 Soy Persona 2, continuar →
          </button>
        </div>
      )}

      {/* === PERSONA 2 TURN === */}
      {currentTurn === 'persona2' && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', marginBottom: 'var(--space-md)',
            background: 'rgba(232,99,111,0.08)', border: '1px solid rgba(232,99,111,0.2)',
            borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--color-primary-light)',
            fontWeight: 600,
          }}>
            💑 Persona 2 — Tu turno de responder
          </div>
          <textarea
            className="input w-full"
            placeholder="Escribe tu respuesta aquí..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ minHeight: '100px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleSave(2)}
              disabled={!answer.trim()}
            >
              💾 Guardar y revelar ambas respuestas
            </button>
          </div>
        </div>
      )}

      {/* === COMPLETE: REVEAL BOTH === */}
      {currentTurn === 'complete' && showReveal && savedAnswers && (
        <div style={{
          animation: 'fadeInUp 0.4s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          marginTop: 'var(--space-md)',
        }}>
          {/* Persona 1 response */}
          <div style={{
            padding: 'var(--space-md)',
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid #818cf8',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#818cf8', marginBottom: '6px', fontWeight: 600 }}>
              👤 Persona 1
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', margin: 0 }}>
              {savedAnswers.persona1}
            </p>
          </div>

          {/* Persona 2 response */}
          <div style={{
            padding: 'var(--space-md)',
            background: 'rgba(232,99,111,0.06)',
            border: '1px solid rgba(232,99,111,0.15)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--color-primary)',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', marginBottom: '6px', fontWeight: 600 }}>
              💑 Persona 2
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', margin: 0 }}>
              {savedAnswers.persona2}
            </p>
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--color-success)',
            fontWeight: 500,
          }}>
            ✅ Ambos respondieron
          </div>
        </div>
      )}
    </div>
  );
}
