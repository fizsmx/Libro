# 📋 PENDIENTES Y MEJORAS — 30 Días Para Reconectar

Este documento detalla todas las funcionalidades pendientes, mejoras planificadas y tareas
por completar, basadas en el contexto original del proyecto.

---

## 🔴 PRIORIDAD ALTA — Funcionalidades Core Pendientes

### 1. Conexión con Supabase (Base de Datos Real)
**Estado:** La app funciona en modo demo con `localStorage`. Falta conectar con Supabase para persistencia real.

**Qué hacer:**
1. Crear un proyecto en [supabase.com](https://supabase.com)
2. Copiar `Project URL` y `anon public key` desde Settings → API
3. Crear archivo `.env.local` en la raíz:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
   ```
4. Ejecutar el SQL de `supabase/migrations/001_initial.sql` en el SQL Editor de Supabase
5. Habilitar Auth → Email/Password en Supabase Dashboard
6. Reiniciar el servidor de desarrollo

**Archivos afectados:** `src/lib/supabase.js`, todos los pages que usan `localStorage`

---

### 2. Sistema de Vinculación de Parejas
**Estado:** El schema SQL y la función `vincular_pareja()` están creados, pero la UI no está implementada.

**Qué hacer:**
- Crear página `/invitar` donde el usuario vea su código de invitación personal
- Botón para copiar/compartir código por WhatsApp
- Crear página `/vincular` donde el partner ingresa el código
- Al vincularse, ambos comparten el mismo espacio de programa
- En el dashboard, mostrar el nombre del partner y su estado de avance

**Archivos por crear:**
- `src/app/invitar/page.js` — Mostrar/compartir código de invitación
- `src/app/vincular/page.js` — Ingresar código del partner

---

### 3. Respuestas Compartidas entre Parejas
**Estado:** Actualmente cada usuario ve solo sus propias respuestas. Falta la mecánica de "desbloqueo mutuo".

**Qué hacer:**
- Cuando un usuario responde una pregunta, su respuesta queda privada
- Cuando AMBOS partners responden la misma pregunta, se desbloquea la opción de ver la respuesta del otro
- Agregar sección "Respuestas de tu pareja" debajo de cada pregunta respondida por ambos
- Indicador visual de cuántas preguntas ha respondido cada uno en el día
- Notificación: "Tu pareja ha completado el Día X — ¡pueden compartir respuestas!"

**Cambios en:** `src/app/dia/[numero]/page.js`

---

### 4. Chatbot Especializado
**Estado:** Mencionado en la oferta comercial (uno de los 5 entregables) pero no implementado.

**Qué hacer:**
- Crear componente `src/components/ChatBot.js` — widget flotante tipo burbuja
- El chatbot debe responder preguntas sobre:
  - El contenido del cuadernillo
  - Temas de terapia de pareja
  - Orientación sobre cómo abordar las conversaciones diarias
- **Opción 1 (simple):** Chatbot con respuestas predefinidas (FAQ) basado en las temáticas de los 30 días
- **Opción 2 (IA):** Integrar API de OpenAI/Google AI con un prompt system enfocado en terapia de pareja
  - Requiere API key en `.env.local`: `OPENAI_API_KEY=sk-...`
  - Crear endpoint API `/api/chat/route.js`
  - **IMPORTANTE:** El chatbot NO debe dar diagnósticos clínicos ni reemplazar terapia profesional. Debe incluir disclaimer.

**Archivos por crear:**
- `src/components/ChatBot.js`
- `src/app/api/chat/route.js` (si se usa IA)

---

### 5. Contenido Multimedia (Podcast + Video)
**Estado:** Mencionados como entregables en la oferta de 70 Bs pero sin contenido real.

**Qué hacer:**
- **Podcast:** Crear/grabar episodios sobre temas de terapia de pareja y subirlos (Spotify, YouTube, o directo)
  - Embeder reproductor en una nueva página `/recursos` o dentro de cada día relevante
- **Video explicativo:** Crear un video de introducción al programa
  - Embeder en la landing page y en el dashboard (primer acceso)
- Crear página `/recursos` que agrupe todos los materiales adicionales

**Archivos por crear:**
- `src/app/recursos/page.js` — Página de recursos (podcast, videos, PDFs)

---

## 🟡 PRIORIDAD MEDIA — Mejoras de Experiencia

### 6. PDFs Descargables
**Estado:** La oferta incluye el cuadernillo y el libro de conversaciones difíciles como PDFs descargables.

**Qué hacer:**
- Agregar los PDFs traducidos al español en `/public/downloads/`
- Crear sección de descarga en la página de recursos o en el dashboard (solo para usuarios con acceso completo)
- **Libro 1:** "Couples Therapy Workbook — 30 Guiding Conversations" (Kathleen Mates-Youngman) — traducido
- **Libro 2:** "Couples Therapy Workbook for Healing" (Lori Cluff Schade) — traducción pendiente (solo se hicieron 20 páginas de 205)

---

### 7. Reflexiones Generadas por IA
**Estado:** Placeholder en la estructura pero sin integración real.

**Qué hacer:**
- Al completar un día, generar automáticamente una reflexión personalizada basada en:
  - Las respuestas del usuario
  - El tema del día
  - La puntuación de conexión
- **Requiere:** API key de IA (OpenAI, Google AI, etc.)
- Mostrar la reflexión como una tarjeta especial al final del día
- **Disclaimer obligatorio:** "Esta reflexión es orientativa y no reemplaza la terapia profesional"

---

### 8. Notificaciones y Recordatorios
**Estado:** No implementado.

**Qué hacer:**
- Push notifications (PWA) para recordar al usuario completar el día
- Email de recordatorio (via Supabase Edge Functions o servicio externo)
- Notificación cuando el partner completa un día
- Celebraciones automáticas en hitos: día 7, 15, 21, 30

---

### 9. Reporte Final (Día 30)
**Estado:** Hay un mensaje de felicitación básico pero sin reporte real.

**Qué hacer:**
- Al completar el Día 30, generar un PDF o vista con:
  - Gráfico completo de evolución de conexión (30 puntos)
  - Resumen de temas trabajados
  - Citas de las respuestas más significativas
  - Compromisos establecidos a lo largo del programa
  - Comparación Día 1 vs Día 30
- Opción de descargar como PDF o compartir

---

### 10. Afiche y Material de Marketing
**Estado:** Se generaron afiches para Facebook en el chat original (precio 100 Bs, luego 70 Bs).

**Qué hacer:**
- Crear un afiche profesional actualizado para Facebook/Instagram
- Incluir en la página `/admin` una sección de materiales de marketing descargables
- Crear variantes para: Stories (9:16), Feed (1:1), y portada (16:9)
- Incorporar la segmentación de Facebook Ads definida en el chat:
  - **Público 1:** Parejas y relaciones (Relaciones, Matrimonio, Psicología, Salud mental)
  - **Público 2:** Psicología + desarrollo personal (Autoayuda, Mindfulness, Comunicación)
  - **Público 3:** Matrimonio/familia (Familia, Padres)
  - **Ubicación:** Santa Cruz, Bolivia
  - **Edad:** 25-55 años
  - **Género:** Hombres y Mujeres

---

## 🟢 PRIORIDAD BAJA — Nice to Have

### 11. Multi-idioma
- Soporte para inglés (el libro original es en inglés)
- Toggle español/inglés en la landing page

### 12. Modo Offline (PWA completo)
- Service Worker para funcionar sin conexión
- Sincronización cuando vuelve la conexión
- Cacheo del program.json y respuestas pendientes

### 13. Temas Visuales
- Light mode / Dark mode toggle
- Tema "romántico" vs "profesional" seleccionable

### 14. Sistema de Pagos Integrado
- Integración con pasarela de pagos (QR Bolivia, PayPal, Stripe)
- Generación automática de códigos de acceso al pagar
- Actualmente el flujo es manual vía WhatsApp

### 15. Dashboard Admin Avanzado
- Estadísticas de uso: usuarios activos, retención por día, tasa de completado
- Exportar datos a CSV
- Ver progreso detallado de cada pareja (sin ver respuestas privadas)
- Gráficos de ingresos por fecha

### 16. Segundo Libro Integrado
- El segundo libro ("Couples Therapy Workbook for Healing" de Lori Cluff Schade) quedó con solo 20 de 205 páginas traducidas
- Crear un segundo programa de 30 días basado en Terapia Emocionalmente Focalizada (EFT)
- Venderlo como upgrade o como pack junto al primero

---

## 📱 Textos de Marketing Listos (del chat original)

### WhatsApp — Opción 1 (profesional)
```
📘 CUADERNILLO DE TERAPIA DE PAREJA – PROGRAMA DE 30 DÍAS

Un material práctico para trabajar juntos temas importantes de la relación,
reflexionar, conversar y fortalecer la conexión.

🎁 POR PROMOCIÓN: SOLO 70 Bs

Además, recibirás:
✅ Cuadernillo de Terapia de Pareja – 30 días
✅ Libro: Cómo manejar conversaciones difíciles
✅ 🤖 Chatbot especializado
✅ 🎧 Podcast sobre terapia y conexión de pareja
✅ 🎥 Video explicativo

📲 Escríbeme "QUIERO EL CUADERNILLO" al 76419099
```

### WhatsApp — Opción 2 (agresiva)
```
💔 ¿Han intentado de todo y sienten que su relación sigue igual?

💡 Ahora pueden probar algo diferente:
30 días dedicados conscientemente a trabajar en su relación.

📘 CUADERNILLO DE TERAPIA DE PAREJA – 30 DÍAS
🔥 PRECIO PROMOCIONAL: 70 Bs

Incluye 5 recursos:
✅ Cuadernillo ✅ Libro ✅ Chatbot ✅ Podcast ✅ Video

📲 Escribe "QUIERO" al 76419099
```

### Facebook Ads — Segmentación Recomendada
- **Ubicación:** Santa Cruz, Bolivia
- **Edad:** 25–55 años
- **Género:** Hombres y Mujeres
- **Público 1:** Relaciones, Matrimonio, Parejas, Psicología, Salud mental, Bienestar
- **Público 2:** Psicología, Psicoterapia, Autoayuda, Inteligencia emocional, Mindfulness
- **Público 3:** Matrimonio, Familia, Padres

---

## 🔧 Configuración Técnica Pendiente

| Tarea | Prioridad | Notas |
|---|---|---|
| Configurar Supabase | 🔴 Alta | Sin esto la app solo funciona en modo demo |
| Crear `.env.local` | 🔴 Alta | Copiar de `.env.local.example` |
| Cambiar contraseña admin | 🔴 Alta | Default es `admin30dias` — cambiarla inmediatamente |
| Comprar dominio | 🟡 Media | Sugerencias: `30diasparareconectar.com`, `reconecta30.com` |
| Deploy en Vercel | 🟡 Media | `npx vercel` o conectar repo GitHub |
| Configurar API de IA | 🟢 Baja | Para chatbot y reflexiones |
| Crear íconos PWA | 🟢 Baja | `icon-192.png` y `icon-512.png` en `/public/` |

---

## 📊 Estado Actual del Proyecto

### ✅ Completado
- Landing page premium (hero, features, pricing, WhatsApp CTA)
- Design system (glassmorphism, paleta romántica, animaciones)
- 300 preguntas originales (30 días × 10 preguntas)
- Dashboard con grid de 30 días
- Vista de día individual con 10 preguntas tipificadas
- Sistema de respuestas con guardado
- Puntuación de conexión (1-10) por día
- Reflexión diaria (3 preguntas)
- Gráfico de progreso
- Sistema de códigos de acceso
- Panel de administración
- Schema SQL de Supabase con RLS
- PWA manifest
- Responsive design
- Build exitoso sin errores

### 🔨 En Progreso / Demo
- Auth funciona en modo demo (localStorage)
- Códigos de acceso funcionan en modo demo
- Progreso se guarda en localStorage

### ❌ Pendiente
- Conexión real con Supabase
- Vinculación de parejas
- Respuestas compartidas
- Chatbot
- Podcast y video (contenido)
- PDFs descargables
- Reflexiones IA
- Notificaciones
- Reporte final
- Material de marketing digital
- Deploy a producción
