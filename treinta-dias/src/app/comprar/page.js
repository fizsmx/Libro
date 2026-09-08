'use client';

import Link from 'next/link';

export default function ComprarPage() {
  const whatsappMessage = encodeURIComponent(
    '¡Hola! 👋 Quiero activar mi código para el programa *14 Días Para Reconectar* 📘💕\n\n¿Cómo puedo realizar el pago?'
  );
  const whatsappLink = `https://wa.me/59176419099?text=${whatsappMessage}`;

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="header-logo">💕 <span>14 Días</span></Link>
          <nav className="header-nav">
            <Link href="/">Inicio</Link>
            <Link href="/login">Iniciar Sesión</Link>
          </nav>
        </div>
      </header>

      <main style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div className="container-narrow">
          <div style={{ padding: 'var(--space-2xl) 0' }}>

            {/* Hero */}
            <div className="text-center" style={{ marginBottom: 'var(--space-3xl)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-md)' }}>📘💕</div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: 'var(--space-md)' }}>
                Adquiere tu Cuadernillo
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '1.05rem' }}>
                14 días de conversaciones guiadas para reconectar con tu pareja
              </p>
            </div>

            {/* Price Card */}
            <div className="glass-card" style={{
              maxWidth: '440px', margin: '0 auto var(--space-2xl)',
              textAlign: 'center', padding: 'var(--space-2xl) var(--space-xl)',
              border: '2px solid rgba(232,99,111,0.3)',
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
                🎁 PRECIO DE LANZAMIENTO
              </div>
              <div style={{
                fontSize: '3.5rem', fontWeight: 800,
                fontFamily: 'var(--font-display)',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                marginBottom: 'var(--space-sm)',
              }}>
                70 Bs
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'line-through', marginBottom: 'var(--space-lg)' }}>
                Precio regular: 120 Bs
              </div>

              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
                {[
                  '📘 Cuadernillo de Terapia de Pareja — 14 días',
                  '📖 Libro: Cómo manejar conversaciones difíciles',
                  '🤖 Chatbot especializado con IA',
                  '🎧 Podcast sobre terapia y conexión',
                  '🎥 Video explicativo',
                  '💑 Vinculación con tu pareja en la app',
                  '📊 Reporte final con gráficos de progreso',
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)',
                    padding: '8px 12px',
                    background: 'rgba(74,222,128,0.05)',
                    border: '1px solid rgba(74,222,128,0.1)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    color: 'var(--color-text-secondary)',
                  }}>
                    <span style={{ color: 'var(--color-success)', flexShrink: 0 }}>✅</span>
                    {item}
                  </div>
                ))}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-lg w-full"
                style={{
                  fontSize: '1.1rem',
                  padding: '16px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                📲 Comprar por WhatsApp
              </a>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-md)' }}>
                Te responderemos al instante con tu código de acceso
              </p>
            </div>

            {/* How it works */}
            <div className="glass-card" style={{ maxWidth: '440px', margin: '0 auto var(--space-2xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>📋 ¿Cómo funciona?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                {[
                  { step: '1', icon: '📲', title: 'Escríbenos por WhatsApp', desc: 'Haz clic en el botón de arriba' },
                  { step: '2', icon: '💳', title: 'Realiza el pago', desc: 'Transferencia, QR o Tigo Money — 70 Bs' },
                  { step: '3', icon: '🔑', title: 'Recibe tu código', desc: 'Te enviamos un código de activación al instante' },
                  { step: '4', icon: '💕', title: '¡Comienza!', desc: 'Activa tu código y empieza los 14 días con tu pareja' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: 'var(--radius-full)',
                      background: 'var(--gradient-primary)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="glass-card" style={{ maxWidth: '440px', margin: '0 auto var(--space-2xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>❓ Preguntas Frecuentes</h3>
              {[
                { q: '¿El pago es por pareja o por persona?', a: 'Por pareja. Con un solo código ambos acceden al programa completo.' },
                { q: '¿Qué métodos de pago aceptan?', a: 'Transferencia bancaria, QR, Tigo Money o depósito bancario.' },
                { q: '¿Puedo probarlo antes de pagar?', a: '¡Sí! El Día 1 es completamente gratis para que pruebes.' },
                { q: '¿Cuánto dura el acceso?', a: 'El acceso es permanente. Pueden repetir el programa las veces que quieran.' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: 'var(--space-md) 0',
                  borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{item.q}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{item.a}</div>
                </div>
              ))}
            </div>

            {/* CTA Final */}
            <div className="text-center" style={{ paddingBottom: 'var(--space-4xl)' }}>
              <Link href="/registro" className="btn btn-secondary btn-lg">
                Probar Día 1 Gratis →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
