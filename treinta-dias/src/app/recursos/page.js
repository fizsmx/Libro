'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getCurrentUser } from '@/lib/supabase-auth';

export default function RecursosPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function initUser() {
      const currentUser = await getCurrentUser();
      if (!currentUser) { router.push('/login'); return; }
      setUser(currentUser);
      setHasAccess(currentUser.tiene_acceso_completo || false);
    }
    initUser();
  }, [router]);

  if (!user) return null;

  const recursos = [
    {
      icon: '📘',
      title: 'Cuadernillo de Terapia de Pareja',
      description: 'El cuadernillo completo con las 30 conversaciones guiadas. Cada conversación incluye 10 preguntas de reflexión organizadas por temas progresivos.',
      type: 'PDF',
      size: '~5 MB',
      available: hasAccess,
      color: 'var(--color-primary)',
      downloadUrl: '/recursos/cuadernillo.html',
    },
    {
      icon: '📖',
      title: 'Cómo Manejar Conversaciones Difíciles',
      description: 'Guía práctica sobre técnicas de comunicación asertiva, manejo de conflictos y cómo abordar temas sensibles con empatía.',
      type: 'PDF',
      size: '~3 MB',
      available: hasAccess,
      color: 'var(--color-secondary-light)',
      downloadUrl: '/recursos/guia_conversaciones.html',
    },
    {
      icon: '🎧',
      title: 'Podcast: Reconectando',
      description: 'Episodios sobre terapia de pareja, comunicación efectiva, lenguajes del amor y fortalecimiento de la conexión emocional.',
      type: 'Audio',
      episodes: '5 episodios',
      available: hasAccess,
      color: 'var(--color-accent)',
      items: [
        { ep: 1, title: '¿Por qué se desconectan las parejas?', duration: '25 min' },
        { ep: 2, title: 'Los 5 lenguajes del amor en la práctica', duration: '30 min' },
        { ep: 3, title: 'Cómo pelear de forma constructiva', duration: '22 min' },
        { ep: 4, title: 'Intimidad emocional vs. intimidad física', duration: '28 min' },
        { ep: 5, title: 'Mantener la conexión después de los 14 días', duration: '20 min' },
      ],
    },
    {
      icon: '🎥',
      title: 'Video Explicativo del Programa',
      description: 'Video guía sobre cómo aprovechar al máximo el cuadernillo, cómo abordar cada conversación diaria y tips para crear un ambiente propicio.',
      type: 'Video',
      duration: '15 minutos',
      available: hasAccess,
      color: 'var(--color-info)',
    },
    {
      icon: '🤖',
      title: 'Chatbot Especializado',
      description: 'Asistente virtual disponible 24/7 para responder dudas sobre las preguntas del programa, ofrecer orientación y tips para conversaciones difíciles.',
      type: 'Integrado',
      available: true,
      color: 'var(--color-success)',
      isActive: true,
    },
  ];

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link href="/dashboard" className="header-logo">💕 <span>14 Días</span></Link>
          <nav className="header-nav">
            <Link href="/dashboard">Programa</Link>
            <Link href="/progreso">Progreso</Link>
            <Link href="/recursos" className="active">Recursos</Link>
          </nav>
        </div>
      </header>

      <main style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ padding: 'var(--space-2xl) 0' }}>
            <Link href="/dashboard" className="page-back">← Volver al programa</Link>
            <h1 style={{ marginTop: 'var(--space-lg)' }}>📚 Recursos Incluidos</h1>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px' }}>
              Todo el material complementario incluido con tu programa de 14 días
            </p>
          </div>

          {/* Access banner */}
          {!hasAccess && (
            <div className="glass-card mb-xl" style={{ borderColor: 'rgba(245,176,65,0.3)', textAlign: 'center' }}>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>🔒 Acceso Completo Requerido</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                Activa tu código de acceso para desbloquear todos los recursos por solo{' '}
                <strong style={{ color: 'var(--color-accent)' }}>70 Bs</strong>
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/59176419099?text=Hola%2C%20quiero%20comprar%20el%20programa%2030%20D%C3%ADas%20Para%20Reconectar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent"
                >
                  📲 Comprar por WhatsApp
                </a>
                <Link href="/activar" className="btn btn-secondary">
                  🔑 Ya tengo un código
                </Link>
              </div>
            </div>
          )}

          {/* Resources Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
            {recursos.map((recurso, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  borderColor: recurso.isActive ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)',
                  opacity: recurso.available === false ? 0.6 : 1,
                  animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
                }}
              >
                <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Icon */}
                  <div style={{
                    width: '72px', height: '72px', borderRadius: 'var(--radius-lg)',
                    background: `${recurso.color}15`,
                    border: `1px solid ${recurso.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', flexShrink: 0,
                  }}>
                    {recurso.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.15rem' }}>{recurso.title}</h3>
                      <span style={{
                        padding: '2px 10px', borderRadius: 'var(--radius-full)',
                        fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
                        background: `${recurso.color}20`, color: recurso.color,
                      }}>
                        {recurso.type}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
                      {recurso.description}
                    </p>

                    {/* Metadata */}
                    <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
                      {recurso.size && <span>📦 {recurso.size}</span>}
                      {recurso.duration && <span>⏱ {recurso.duration}</span>}
                      {recurso.episodes && <span>🎙 {recurso.episodes}</span>}
                    </div>

                    {/* Podcast episodes */}
                    {recurso.items && hasAccess && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                        {recurso.items.map((item) => (
                          <div
                            key={item.ep}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: 'var(--space-sm) var(--space-md)',
                              background: 'rgba(255,255,255,0.03)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--color-border)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                              <span style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: 'var(--gradient-accent)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', fontWeight: 700,
                              }}>
                                {item.ep}
                              </span>
                              <span style={{ fontSize: '0.85rem' }}>{item.title}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action */}
                    {recurso.isActive ? (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600 }}>
                        ✅ Disponible — usa el botón 🤖 en la esquina inferior derecha
                      </span>
                    ) : recurso.available && recurso.downloadUrl ? (
                      <a
                        href={recurso.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                      >
                        📥 Abrir / Imprimir como PDF
                      </a>
                    ) : recurso.available ? (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        🎧 Próximamente — contenido en preparación
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        🔒 Requiere acceso completo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 14 Días Para Reconectar</p>
      </footer>
    </>
  );
}
