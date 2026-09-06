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
            💕 <span>30 Días</span>
          </Link>
          <nav className="header-nav">
            <a href="#como-funciona">Cómo Funciona</a>
            <a href="#que-incluye">Qué Incluye</a>
            <a href="#precio">Precio</a>
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
            ✨ Programa de 30 Días · Día 1 Gratis
          </div>
          <h1 className="hero-title">
            30 Días Para <em>Reconectar</em>
          </h1>
          <p className="hero-subtitle">
            Un programa diseñado para que tú y tu pareja trabajen juntos en fortalecer
            su conexión emocional a través de conversaciones guiadas, reflexiones
            profundas y ejercicios prácticos.
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
              <div className="hero-stat-value">30</div>
              <div className="hero-stat-label">Días</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">300</div>
              <div className="hero-stat-label">Preguntas</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">10</div>
              <div className="hero-stat-label">Por Día</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="section" id="como-funciona">
        <div className="container">
          <h2 className="text-center mb-xl">¿Cómo Funciona?</h2>
          <p className="text-center mb-2xl" style={{ maxWidth: '600px', margin: '0 auto var(--space-2xl)' }}>
            Un proceso simple y guiado para que ambos se comprometan a trabajar
            en su relación durante 30 días consecutivos.
          </p>
          <div className="features-grid stagger-children">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">1. Regístrate</h3>
              <p className="feature-desc">
                Crea tu cuenta y envía el código de invitación a tu pareja para
                que ambos estén conectados.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">2. Responde</h3>
              <p className="feature-desc">
                Cada día recibes 10 preguntas de reflexión. Responde de forma
                privada antes de ver las respuestas de tu pareja.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">3. Comparte</h3>
              <p className="feature-desc">
                Cuando ambos terminan, se desbloquean las respuestas para que
                lean, reflexionen y conversen juntos.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">4. Mide tu Progreso</h3>
              <p className="feature-desc">
                Evalúa tu nivel de conexión diariamente y observa cómo crece
                a lo largo de los 30 días.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3 className="feature-title">5. Reflexiona</h3>
              <p className="feature-desc">
                Al final de cada día, responde: ¿cómo me sentí?, ¿qué aprendí?,
                ¿qué quiero mejorar?
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎉</div>
              <h3 className="feature-title">6. Celebra</h3>
              <p className="feature-desc">
                Al completar los 30 días, recibe un resumen de tu experiencia
                y celebra el camino recorrido juntos.
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
              <h3 className="feature-title">Cuadernillo de 30 Días</h3>
              <p className="feature-desc">
                300 preguntas diseñadas por expertos en terapia de pareja,
                organizadas en temas progresivos desde la reconexión hasta
                la celebración.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3 className="feature-title">Libro: Conversaciones Difíciles</h3>
              <p className="feature-desc">
                Guía complementaria sobre cómo manejar las conversaciones
                más difíciles en la relación con empatía y claridad.
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
              <div className="feature-icon">🎧</div>
              <h3 className="feature-title">Podcast</h3>
              <p className="feature-desc">
                Episodios sobre terapia de pareja, comunicación efectiva
                y fortalecimiento de la conexión emocional.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎥</div>
              <h3 className="feature-title">Video Explicativo</h3>
              <p className="feature-desc">
                Video guía sobre cómo aprovechar al máximo el cuadernillo
                y cómo abordar cada conversación diaria.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Seguimiento de Progreso</h3>
              <p className="feature-desc">
                Gráficos y métricas visuales que muestran la evolución
                de su conexión emocional durante los 30 días.
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
              <p className="price-currency">Pago único · Acceso completo</p>
              <ul className="price-list">
                <li>Cuadernillo de Terapia de Pareja — 30 Días (PDF)</li>
                <li>Libro: Cómo Manejar Conversaciones Difíciles (PDF)</li>
                <li>Chatbot especializado en terapia de pareja</li>
                <li>Podcast sobre terapia y conexión de pareja</li>
                <li>Video explicativo del programa</li>
                <li>Acceso a los 30 días del programa interactivo</li>
                <li>Seguimiento y métricas de progreso</li>
              </ul>
              <Link href="/registro" className="btn btn-accent btn-lg w-full" style={{ marginTop: 'var(--space-lg)' }}>
                🚀 Comenzar Ahora
              </Link>
              <p className="mt-lg" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                📲 También puedes escribirnos al WhatsApp:{' '}
                <a
                  href="https://wa.me/59176419099?text=Hola%2C%20quiero%20activar%20mi%20c%C3%B3digo%20de%20acceso%20para%20el%20programa%2030%20D%C3%ADas%20Para%20Reconectar%20%F0%9F%93%98"
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
            Este programa no es una sesión más de terapia. Es un compromiso de 30 días
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
        <p>© 2024 30 Días Para Reconectar · Todos los derechos reservados</p>
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
