'use client';

import { useState, useRef, useEffect } from 'react';

const FAQ_RESPONSES = {
  greetings: {
    patterns: ['hola', 'buenas', 'hey', 'hi', 'buenos dias', 'buenas tardes', 'buenas noches'],
    response: '¡Hola! 💕 Soy tu asistente del programa *30 Días Para Reconectar*. Estoy aquí para ayudarte con dudas sobre las preguntas, orientación sobre los ejercicios y tips para fortalecer tu relación. ¿En qué puedo ayudarte?'
  },
  que_es: {
    patterns: ['que es', 'de que se trata', 'como funciona', 'explicame', 'para que sirve'],
    response: '📘 **30 Días Para Reconectar** es un programa interactivo de terapia de pareja. Cada día, tú y tu pareja responden 10 preguntas de reflexión sobre temas como comunicación, confianza, intimidad y más. El objetivo es crear un espacio seguro para conversaciones profundas y fortalecer su conexión emocional durante 30 días consecutivos.'
  },
  como_empezar: {
    patterns: ['como empiezo', 'como inicio', 'por donde empiezo', 'primer paso', 'empezar'],
    response: '🚀 Para empezar:\n\n1. **Regístrate** con tu correo\n2. **Invita a tu pareja** compartiendo tu código de invitación\n3. **Completa el Día 1** (es gratis)\n4. **Activa tu código** de acceso para los 30 días completos\n\nEl Día 1 es completamente gratuito para que pruebes el programa. 💕'
  },
  precio: {
    patterns: ['precio', 'cuanto cuesta', 'costo', 'pagar', 'gratis', 'cobro', 'bolivianos', 'bs'],
    response: '💰 El programa tiene un **precio promocional de 70 Bs** (pago único). Incluye:\n\n✅ 30 días de programa interactivo\n✅ Cuadernillo de terapia de pareja (PDF)\n✅ Libro: Conversaciones difíciles (PDF)\n✅ Este chatbot 24/7\n✅ Podcast y video explicativo\n\n📲 Para comprar, escribe al WhatsApp: **+591 76419099**'
  },
  pareja: {
    patterns: ['mi pareja', 'invitar', 'vincular', 'juntos', 'conectar con', 'otro usuario', 'codigo invitacion'],
    response: '💑 Para vincular a tu pareja:\n\n1. Ve a **"Invitar Pareja"** en tu dashboard\n2. Copia tu **código de invitación** personal\n3. Envíalo por WhatsApp a tu pareja\n4. Tu pareja ingresa el código en **"Vincular"**\n\nUna vez vinculados, ambos comparten el mismo programa y pueden ver las respuestas del otro cuando ambos las completen.'
  },
  respuestas: {
    patterns: ['respuestas', 'ver respuesta', 'compartir', 'privado', 'privacidad', 'quien ve'],
    response: '🔒 **Tus respuestas son privadas** hasta que ambos completen la misma pregunta.\n\nCuando tú Y tu pareja responden una pregunta, se desbloquea la opción de ver la respuesta del otro. Esto fomenta la honestidad: escribes sin la influencia de saber qué dijo tu pareja.\n\n⚠️ Nadie más puede ver sus respuestas. Ni siquiera el administrador.'
  },
  conexion: {
    patterns: ['conexion', 'puntuacion', 'nivel', 'escala', 'medidor', 'como me siento'],
    response: '📊 Al final de cada día, evalúas tu **nivel de conexión** del 1 al 10:\n\n- **1-3:** Desconectado/a (rojo)\n- **4-6:** En proceso (amarillo)\n- **7-10:** Conectado/a (verde)\n\nEsto te permite ver tu evolución a lo largo de los 30 días. No hay respuestas "correctas" — es tu percepción personal de cómo te sientes con tu pareja ese día.'
  },
  dificil: {
    patterns: ['dificil', 'no quiere', 'pelea', 'conflicto', 'enojad', 'problema', 'crisis', 'separar', 'divorcio'],
    response: '💙 Es normal que algunas preguntas generen incomodidad o emociones fuertes. Algunos tips:\n\n1. **No presiones** — Si tu pareja no quiere responder algo, respétalo\n2. **Escucha sin juzgar** — El objetivo es entender, no ganar\n3. **Tómate pausas** — Si la emoción es muy fuerte, respira y retoma después\n4. **Recuerda el propósito** — Están aquí porque quieren mejorar\n\n⚠️ **Importante:** Este programa NO reemplaza terapia profesional. Si están en crisis, busca ayuda de un terapeuta certificado.'
  },
  temas: {
    patterns: ['temas', 'que preguntas', 'de que hablan', 'contenido', 'categorias'],
    response: '📋 Los 30 días cubren estos temas progresivos:\n\n**Semana 1:** Reconexión, Comunicación, Apreciación, Expectativas, Escucha activa\n**Semana 2:** Confianza, Intimidad emocional, Conflictos, Roles, Lenguajes del amor\n**Semana 3:** Perdón, Metas compartidas, Familia, Finanzas, Estrés\n**Semana 4:** Creatividad, Sexualidad, Espiritualidad, Autoconocimiento, Resiliencia\n**Día 26-30:** Gratitud, Vulnerabilidad, Renovación, Futuro, Celebración'
  },
  reflexion: {
    patterns: ['reflexion', 'como me senti', 'que aprendi', 'diario', 'journaling'],
    response: '🧠 La **reflexión diaria** tiene 3 preguntas:\n\n1. ¿Cómo me sentí hoy?\n2. ¿Qué aprendí de mi pareja?\n3. ¿Qué quiero mejorar?\n\nNo hay presión de escribir mucho. Incluso una frase corta te ayuda a procesar lo vivido. Con el tiempo, estas reflexiones son un registro valioso de tu crecimiento como pareja.'
  },
  whatsapp: {
    patterns: ['whatsapp', 'contacto', 'ayuda', 'soporte', 'telefono', 'numero'],
    response: '📲 Puedes contactarnos por **WhatsApp**: [+591 76419099](https://wa.me/59176419099)\n\nHorario de atención:\n- Lunes a Viernes: 9:00 - 20:00\n- Sábados: 10:00 - 15:00\n\nO escríbenos en cualquier momento y te respondemos lo antes posible. 💕'
  },
  codigo: {
    patterns: ['codigo', 'activar', 'desbloquear', 'acceso completo', 'comprar'],
    response: '🔑 Para activar tu código de acceso:\n\n1. Ve a **"Activar Código"** en el menú\n2. Ingresa el código que recibiste\n3. ¡Listo! Se desbloquean los 30 días\n\n¿No tienes código? Escribe al WhatsApp **+591 76419099** para comprarlo por solo **70 Bs**.'
  },
  completar: {
    patterns: ['completar', 'terminar', 'acabar', 'final', 'dia 30', 'termine'],
    response: '🎉 Al completar los 30 días recibirás:\n\n- **Resumen completo** de tu experiencia\n- **Gráfico de evolución** de tu conexión emocional\n- **Tus reflexiones** más significativas\n\n¡Celebren juntos este logro! Completar el programa demuestra un compromiso real con su relación. 💕'
  },
  profesional: {
    patterns: ['terapeuta', 'psicologo', 'profesional', 'terapia real', 'reemplaza'],
    response: '⚠️ **Disclaimer importante:**\n\nEste programa es una herramienta de **apoyo y reflexión** para parejas. **NO reemplaza** la terapia profesional.\n\nSi experimentan:\n- Violencia física o emocional\n- Adicciones\n- Depresión severa\n- Infidelidad reciente traumática\n\n**Busquen ayuda de un profesional certificado.** Este programa puede complementar la terapia, pero no sustituirla.'
  },
  reflexion_ia: {
    patterns: ['reflexion ia', 'pedir reflexion', 'ia', 'inteligencia artificial', 'gemini', 'reflexion personalizada'],
    response: '__IA_REFLEXION__'
  }
};

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: '¡Hola! 💕 Soy tu asistente del programa **30 Días Para Reconectar**. Puedo ayudarte con:\n\n📘 Cómo funciona el programa\n💰 Precios y activación\n👑 Vincular a tu pareja\n🔒 Privacidad de respuestas\n📊 Niveles de conexión\n💙 Tips para conversaciones difíciles\n🤖 **Reflexión IA** — Pide una reflexión personalizada\n\n¿En qué puedo ayudarte?'
};

function findResponse(message) {
  const normalized = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const [key, data] of Object.entries(FAQ_RESPONSES)) {
    for (const pattern of data.patterns) {
      const normalizedPattern = pattern.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalized.includes(normalizedPattern)) {
        return data.response;
      }
    }
  }

  return '🤔 No estoy seguro de entender tu pregunta. Puedo ayudarte con:\n\n• **"¿Cómo funciona?"** — Sobre el programa\n• **"Precio"** — Costos y qué incluye\n• **"Mi pareja"** — Cómo vincularla\n• **"Respuestas"** — Privacidad\n• **"Temas"** — Qué cubre el programa\n• **"Difícil"** — Tips para conversaciones difíciles\n• **"WhatsApp"** — Contacto directo\n\nO escríbeme con más detalle y te ayudo. 💕';
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const responseText = findResponse(userMessage.content);

    // Check if it's an IA reflection request
    if (responseText === '__IA_REFLEXION__') {
      try {
        // Get current day info from localStorage
        const completedDays = JSON.parse(localStorage.getItem('completed_days') || '[]');
        const currentDay = completedDays.length > 0 ? Math.max(...completedDays) : 1;
        const savedAnswers = JSON.parse(localStorage.getItem(`answers_day_${currentDay}`) || '{}');
        const firstAnswer = Object.values(savedAnswers)[0] || 'No tengo una respuesta aún';

        const res = await fetch('/api/reflexion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pregunta: 'Reflexión general del día',
            respuesta: firstAnswer,
            dia: currentDay,
            tema: `Día ${currentDay} del programa`,
          }),
        });
        const data = await res.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `🤖 **Reflexión IA personalizada:**\n\n${data.reflexion}${data.fallback ? '\n\n_(⚠️ Reflexión generada localmente — la IA no está disponible en este momento)_' : ''}`,
        }]);
      } catch {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '🤖 No pude conectar con la IA en este momento. Intenta de nuevo en unos minutos. 💕',
        }]);
      }
    } else {
      // Normal FAQ response with typing delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    }
    setIsTyping(false);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary-light)">$1</a>');
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          boxShadow: '0 4px 20px var(--color-primary-glow)',
          transition: 'all 0.3s ease',
          zIndex: 150,
          transform: isOpen ? 'rotate(45deg) scale(0.9)' : 'scale(1)',
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Notification dot */}
      {!isOpen && messages.length <= 1 && (
        <div style={{
          position: 'fixed',
          bottom: '72px',
          right: '24px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: 'var(--color-danger)',
          border: '2px solid var(--color-bg-primary)',
          zIndex: 151,
          animation: 'pulseBorder 2s infinite',
        }} />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          height: '520px',
          maxHeight: 'calc(100vh - 140px)',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-glass)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 150,
          animation: 'scaleIn 0.3s ease',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(232, 99, 111, 0.1)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
            }}>
              🤖
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Asistente de Pareja</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }}></span>
                En línea
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeInUp 0.3s ease',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? 'var(--gradient-primary)'
                    : 'rgba(255,255,255,0.06)',
                  border: msg.role === 'user'
                    ? 'none'
                    : '1px solid var(--color-border)',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  color: 'var(--color-text-primary)',
                }}>
                  <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.88rem',
                  color: 'var(--color-text-muted)',
                }}>
                  <span style={{ animation: 'float 1s ease-in-out infinite' }}>●</span>
                  <span style={{ animation: 'float 1s ease-in-out 0.2s infinite' }}>●</span>
                  <span style={{ animation: 'float 1s ease-in-out 0.4s infinite' }}>●</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              style={{
                flex: 1,
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--color-text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: input.trim() ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.06)',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
