'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="header-logo">
            💕 <span>14 Días</span>
          </Link>
          <nav className="header-nav">
            <a href="#como-funciona">Cómo Funciona</a>
            <a href="#que-incluye">Qué Incluye</a>
            <a href="#precio">Precio</a>
            <Link href="/comprar" className="btn btn-accent btn-sm">
              📲 Comprar
            </Link>
            <Link href="/login" className="btn btn-primary btn-sm">
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            ✨ Programa de 14 Días · Día 1 Gratis
          </div>
          <h1 className="hero-title">
            14 Días Para <em>Reconectar</em>
          </h1>
          <p className="hero-subtitle">
            ¿Sienten que su relación necesita atención? Este programa de 14 días 
            les guiará para fortalecer su conexión emocional con conversaciones 
            guiadas, reflexiones profundas y análisis IA personalizado.
          </p>
          <div className="hero-actions">
            <Link href="/registro" className="btn btn-primary btn-lg">
              🚀 Comenzar Gratis
            </Link>
            <a href="#como-funciona" className="btn btn-secondary btn-lg">
              Saber Más
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">14</div>
              <div className="hero-stat-label">Días</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">140</div>
              <div className="hero-stat-label">Preguntas</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">🧠</div>
              <div className="hero-stat-label">IA Incluida</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gancho emocional */}
      <section className="section" style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', maxWidth: '700px', margin: '0 auto var(--space-lg)' }}>
            💔 ¿Tienen una crisis en su relación? <br />
            <span style={{ color: 'var(--color-primary-light)' }}>Tenemos la solución.</span>
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto var(--space-xl)', color: 'var(--color-text-secondary)' }}>
            Un solo dispositivo. Juntos, en el mismo lugar. 
            Responden por turnos las mismas preguntas y luego descubren 
            qué piensa el otro. La IA analiza sus respuestas y les da retroalimentación real.
          </p>
          <a
            href="https://wa.me/59176419099?text=Hola%2C%20quiero%20información%20sobre%2014%20Días%20Para%20Reconectar%20💕"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent btn-lg"
            style={{ background: '#25D366', borderColor: '#25D366' }}
          >
            📲 Escríbenos al WhatsApp
          </a>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="section" id="como-funciona">
        <div className="container">
          <h2 className="text-center mb-xl">¿Cómo Funciona?</h2>
          <p className="text-center mb-2xl" style={{ maxWidth: '600px', margin: '0 auto var(--space-2xl)' }}>
            Un proceso simple: un dispositivo, dos personas, respuestas por turnos.
          </p>
          <div className="features-grid stagger-children">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">1. Regístrense</h3>
              <p className="feature-desc">
                Creen una cuenta de pareja. Solo necesitan un dispositivo 
                para los dos — celular, tablet o computadora.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3 className="feature-title">2. Persona 1 Responde</h3>
              <p className="feature-desc">
                Cada día hay 10 preguntas. Persona 1 responde primero de forma 
                privada, sin que Persona 2 vea sus respuestas.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">3. Pasa el Dispositivo</h3>
              <p className="feature-desc">
                Al terminar, pasan el dispositivo a la otra persona. 
                Las respuestas de Persona 1 están ocultas.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💑</div>
              <h3 className="feature-title">4. Persona 2 Responde</h3>
              <p className="feature-desc">
                Persona 2 responde las mismas preguntas. Al guardar, 
                ambas respuestas se revelan lado a lado.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3 className="feature-title">5. Análisis IA</h3>
              <p className="feature-desc">
                La IA compara sus respuestas y genera: conclusión, fortalezas, 
                áreas de trabajo, tips, retos y un semáforo 🟢🟡🔴
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">6. Celebren</h3>
              <p className="feature-desc">
                Al completar los 14 días, reciban un reporte final con la 
                evolución de su relación y logros alcanzados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="section" id="que-incluye">
        <div className="container">
          <h2 className="text-center mb-xl">¿Qué Incluye?</h2>
          <div className="features-grid stagger-children">
            <div className="feature-card">
              <div className="feature-icon">📘</div>
              <h3 className="feature-title">Programa de 14 Días</h3>
              <p className="feature-desc">
                140 preguntas diseñadas por expertos en terapia de pareja,
                organizadas en temas progresivos desde la reconexión hasta
                la celebración.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3 className="feature-title">Análisis IA Diario</h3>
              <p className="feature-desc">
                Cada día, la IA analiza las respuestas de ambos y genera 
                conclusiones, fortalezas, áreas de mejora y un semáforo 
                de estado de la relación.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">Chatbot Especializado</h3>
              <p className="feature-desc">
                Un asistente disponible 24/7 para responder dudas sobre
                las preguntas del programa y ofrecer orientación.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚦</div>
              <h3 className="feature-title">Sistema de Semáforo</h3>
              <p className="feature-desc">
                Indicadores visuales 🟢🟡🔴 que muestran el estado de 
                diferentes áreas de la relación día a día.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Reporte Final</h3>
              <p className="feature-desc">
                Al completar los 14 días, un resumen completo con la 
                evolución, logros y recomendaciones personalizadas.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">100% Privado</h3>
              <p className="feature-desc">
                Sus respuestas son privadas. Nadie más que ustedes como 
                pareja puede ver lo que escriben. Ni siquiera nosotros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Precio */}
      <section className="section" id="precio">
        <div className="container">
          <h2 className="text-center mb-xl">Precio Promocional</h2>
          <div className="price-card">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="mb-md" style={{ color: 'var(--color-text-secondary)' }}>
                🔥 Promoción por tiempo limitado
              </p>
              <div className="price-value">70 Bs</div>
              <p className="price-currency">Pago único · Acceso completo a los 14 días</p>
              <ul className="price-list">
                <li>Programa completo de 14 días (140 preguntas)</li>
                <li>Análisis IA diario con semáforo</li>
                <li>Chatbot especializado en terapia de pareja</li>
                <li>Reporte final personalizado</li>
                <li>Día 1 completamente gratis para probar</li>
                <li>Un solo pago, sin suscripciones</li>
              </ul>
              <Link href="/registro" className="btn btn-accent btn-lg w-full" style={{ marginTop: 'var(--space-lg)' }}>
                🚀 Comenzar Ahora
              </Link>
              <p className="mt-lg" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                📲 También puedes escribirnos al WhatsApp:{' '}
                <a
                  href="https://wa.me/59176419099?text=Hola%2C%20quiero%20activar%20mi%20código%20de%20acceso%20para%20el%20programa%2014%20Días%20Para%20Reconectar%20💕"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-success)' }}
                >
                  +591 76419099
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="section">
        <div className="container text-center">
          <h2 className="mb-lg">
            💔 ¿Cansados de intentar y que nada resulte?
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto var(--space-xl)', fontSize: '1.1rem' }}>
            Este programa no es una sesión más de terapia. Es un compromiso de 14 días
            para trabajar de forma <strong>consciente</strong> en su relación.
            Paso a paso, pregunta a pregunta, juntos.
          </p>
          <Link href="/registro" className="btn btn-primary btn-lg">
            Prueba el Día 1 — Es Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 14 Días Para Reconectar · Todos los derechos reservados</p>
        <p className="mt-sm" style={{ fontSize: '0.8rem' }}>
          📲 WhatsApp:{' '}
          <a
            href="https://wa.me/59176419099"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-primary-light)' }}
          >
            +591 76419099
          </a>
        </p>
      </footer>
    </>
  );
}
