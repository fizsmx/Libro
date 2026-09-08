import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Eres un asistente de bienestar relacional especializado en terapia de pareja. 
Tu tono es cálido, empático, profesional y esperanzador.

REGLAS:
- Responde en español (Bolivia/Latinoamérica).
- Máximo 200 palabras por respuesta.
- No diagnostiques ni reemplaces a un terapeuta profesional.
- Menciona que siempre es buena idea consultar con un profesional si los problemas persisten.
- Ofrece reflexiones prácticas y accionables.
- Usa lenguaje inclusivo.
- Celebra los logros pequeños.
- Si mencionan violencia o abuso, sugiere buscar ayuda profesional inmediatamente.`;

export async function POST(request) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada', reflexion: getFallbackReflection() },
        { status: 200 }
      );
    }

    const { pregunta, respuesta, dia, tema } = await request.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `${SYSTEM_PROMPT}

CONTEXTO:
- El usuario está en el Día ${dia} del programa "14 Días Para Reconectar" (terapia de pareja).
- Tema del día: ${tema}
- Pregunta que respondió: "${pregunta}"
- Su respuesta: "${respuesta}"

Genera una reflexión personalizada y empática basada en su respuesta. 
Incluye una sugerencia práctica que puedan hacer como pareja hoy.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ reflexion: text });
  } catch (error) {
    console.error('Error en reflexión IA:', error);
    return NextResponse.json(
      { reflexion: getFallbackReflection(), fallback: true },
      { status: 200 }
    );
  }
}

function getFallbackReflection() {
  const reflexiones = [
    '💭 Tu respuesta muestra que te importa profundamente tu relación. El solo hecho de reflexionar sobre esto ya es un paso valioso. Hoy, tómate 5 minutos para decirle a tu pareja algo que aprecias de ella/él.',
    '💭 Cada pregunta que responden juntos fortalece su conexión. La vulnerabilidad es una forma de valentía. Esta noche, compartan un momento de silencio juntos — a veces la presencia dice más que las palabras.',
    '💭 Lo que expresaste es más común de lo que piensas. Muchas parejas atraviesan situaciones similares. Lo importante es que están trabajando en ello. Intenten hacer algo que disfrutaban al principio de la relación.',
    '💭 Tu honestidad al responder estas preguntas demuestra compromiso. Recuerda: no se trata de ser perfectos, sino de estar presentes el uno para el otro. Hoy, practiquen la escucha activa durante 10 minutos.',
  ];
  return reflexiones[Math.floor(Math.random() * reflexiones.length)];
}
