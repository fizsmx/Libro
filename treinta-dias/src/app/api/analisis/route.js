import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Eres un analista de bienestar relacional especializado en terapia de pareja.
Tu rol es analizar las respuestas de AMBAS personas de una pareja que están haciendo un ejercicio de reconexión emocional.

REGLAS ESTRICTAS:
- Responde SOLO en formato JSON válido, sin markdown ni texto adicional.
- Idioma: español (Bolivia/Latinoamérica).
- NO diagnostiques ni reemplaces a un terapeuta profesional.
- NO determines compatibilidad ni éxito/fracaso de la relación.
- Sé cálido, empático, profesional y esperanzador.
- Celebra los logros pequeños.
- Compara las respuestas de ambas personas buscando puntos de encuentro y divergencias.
- Si detectas señales de violencia, abuso, manipulación o control, activa el campo "alerta_profesional".
- Usa lenguaje inclusivo.

FORMATO DE RESPUESTA (JSON estricto):
{
  "conclusion": "Análisis general de 2-3 párrafos sobre lo que revelan las respuestas de ambos",
  "fortalezas": ["fortaleza 1 específica basada en las respuestas", "fortaleza 2", "fortaleza 3"],
  "area_trabajo": "Un área específica que ambos podrían mejorar, basada en lo que expresaron",
  "tip": "Un consejo práctico y accionable para hoy basado en el análisis",
  "reto": "Una actividad concreta para hacer juntos en las próximas 24 horas",
  "semaforo": "verde|amarillo|rojo",
  "alerta_profesional": null
}

CRITERIOS DEL SEMÁFORO:
- VERDE: Ambos muestran apertura, empatía, disposición a trabajar, sus respuestas se complementan.
- AMARILLO: Hay divergencias significativas, temas no resueltos, o uno de los dos muestra resistencia.
- ROJO: Se detectan señales de desconexión grave, evasión total, dolor profundo no procesado, o posible situación de riesgo.`;

export async function POST(request) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada', analisis: getFallbackAnalisis() },
        { status: 200 }
      );
    }

    const { dia, tema, respuestas, historial } = await request.json();

    if (!respuestas || respuestas.length === 0) {
      return NextResponse.json(
        { error: 'No hay respuestas para analizar', analisis: getFallbackAnalisis() },
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build context from responses
    const respuestasTexto = respuestas.map((r, i) => 
      `Pregunta ${i + 1}: "${r.pregunta}"\n  Persona 1: "${r.persona1 || '(no respondió)'}"\n  Persona 2: "${r.persona2 || '(no respondió)'}"`
    ).join('\n\n');

    // Build history context
    let historialTexto = '';
    if (historial && historial.length > 0) {
      historialTexto = `\n\nHISTORIAL DE DÍAS ANTERIORES:\n${historial.map(h => 
        `- Día ${h.dia}: Semáforo ${h.semaforo} — ${h.resumen || 'Sin resumen'}`
      ).join('\n')}`;
    }

    const prompt = `${SYSTEM_PROMPT}

CONTEXTO:
- Programa: "14 Días Para Reconectar" (terapia de pareja interactiva)
- Día actual: ${dia} de 14
- Tema del día: ${tema}
${historialTexto}

RESPUESTAS DE HOY (ambas personas respondieron a las mismas preguntas):
${respuestasTexto}

Analiza las respuestas de ambas personas comparándolas entre sí. Busca patrones, coincidencias, divergencias y oportunidades de crecimiento. Responde EXCLUSIVAMENTE con el JSON especificado.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean markdown code block if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const analisis = JSON.parse(text);
      
      // Validate required fields
      const requiredFields = ['conclusion', 'fortalezas', 'area_trabajo', 'tip', 'reto', 'semaforo'];
      for (const field of requiredFields) {
        if (!analisis[field]) {
          analisis[field] = field === 'fortalezas' ? ['Están trabajando juntos en su relación'] 
            : field === 'semaforo' ? 'amarillo' 
            : 'Información no disponible';
        }
      }

      // Validate semaforo value
      if (!['verde', 'amarillo', 'rojo'].includes(analisis.semaforo)) {
        analisis.semaforo = 'amarillo';
      }

      return NextResponse.json({ analisis });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError, 'Raw:', text);
      return NextResponse.json({ analisis: getFallbackAnalisis() });
    }
  } catch (error) {
    console.error('Error en análisis IA:', error);
    return NextResponse.json(
      { analisis: getFallbackAnalisis(), fallback: true },
      { status: 200 }
    );
  }
}

function getFallbackAnalisis() {
  return {
    conclusion: 'El solo hecho de estar aquí, respondiendo estas preguntas juntos, ya demuestra un compromiso genuino con su relación. Cada pregunta que responden es un paso hacia una conexión más profunda.',
    fortalezas: [
      'Están dedicando tiempo de calidad a su relación',
      'Muestran disposición para ser vulnerables el uno con el otro',
      'Están comprometidos con el proceso de reconexión',
    ],
    area_trabajo: 'Continúen practicando la honestidad emocional. A veces las respuestas más difíciles son las que más fortalecen la relación.',
    tip: 'Esta noche, antes de dormir, compartan una cosa que apreciaron del otro hoy. No tiene que ser grande — los pequeños gestos construyen grandes conexiones.',
    reto: 'Mañana, sorprendan al otro con un gesto inesperado de cariño. Puede ser una nota, un abrazo extra largo, o preparar algo especial.',
    semaforo: 'verde',
    alerta_profesional: null,
  };
}
