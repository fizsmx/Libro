# 30 DÍAS PARA RECONECTAR — Web Application

## Contexto del Proyecto

Basándome en la conversación completa de ChatGPT, el proyecto consiste en transformar el contenido de un **Cuadernillo de Terapia de Pareja** (30 conversaciones diarias) en una **aplicación web interactiva** donde parejas trabajan juntas durante 30 días respondiendo preguntas de reflexión, con un sistema de monetización por códigos de acceso.

---

## Arquitectura Propuesta

### Stack Tecnológico

| Componente | Tecnología |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Base de datos & Auth** | Supabase (PostgreSQL + Auth) |
| **Estilos** | CSS vanilla (diseño premium, glassmorphism, modo oscuro) |
| **Deploy** | Preparado para Vercel |
| **PWA** | Service Worker + manifest.json |

---

## Funcionalidades Principales

### 1. Sistema de Parejas
- Registro individual con email/contraseña
- Código de invitación para vincular parejas
- Cada pareja tiene un "espacio compartido" privado

### 2. Programa de 30 Días
- **10 preguntas progresivas por día** (300 preguntas totales en `program.json`)
- **Día 1:** 100% gratuito (demo completa)
- **Días 2–30:** Bloqueados hasta activar código de acceso
- Cada día incluye preguntas de reflexión personal y compartida

### 3. Dinámica de Respuestas
- Cada partner responde las preguntas **de forma privada** primero
- Una vez ambos responden, se desbloquea la **reflexión conjunta**
- Prompts de reflexión diaria:
  - *"¿Cómo me sentí hoy?"*
  - *"¿Qué aprendí de mi pareja?"*
  - *"¿Qué quiero mejorar?"*

### 4. Seguimiento y Progreso
- **Nivel de conexión** (escala 1–10) con historial visual
- Indicador tipo **semáforo** (verde/amarillo/rojo)
- Gráfico de progreso a lo largo de los 30 días
- **Reflexión diaria generada por IA** (no diagnóstica, no clínica)

### 5. Contenido Adicional
- Videos embebidos sobre terapia de pareja
- Chatbot asistente integrado
- Al completar el **Día 30**: felicitación + reporte resumen de la experiencia

### 6. Monetización
- **Códigos de acceso de un solo uso** generados desde el admin
- Precio configurable (inicial ~100 Bs)
- QR para pago vía WhatsApp (+591 76419099)

### 7. Panel de Administración (`/admin`)
- Login separado (usuario/contraseña)
- Crear, activar/desactivar códigos de acceso
- Ver progreso de parejas (sin acceso a respuestas privadas)
- Configurar precio, WhatsApp, recursos

---

## Estructura de Archivos Propuesta

```
Libro/
├── src/
│   ├── app/
│   │   ├── layout.js              # Layout principal + PWA meta
│   │   ├── page.js                # Landing page
│   │   ├── globals.css            # Design system completo
│   │   ├── login/
│   │   │   └── page.js            # Login/Registro
│   │   ├── registro/
│   │   │   └── page.js            # Registro de usuario
│   │   ├── invitar/
│   │   │   └── page.js            # Vincular pareja con código
│   │   ├── dashboard/
│   │   │   └── page.js            # Vista principal del programa
│   │   ├── dia/
│   │   │   └── [numero]/
│   │   │       └── page.js        # Vista de cada día (preguntas)
│   │   ├── progreso/
│   │   │   └── page.js            # Historial y gráficos
│   │   ├── reflexion/
│   │   │   └── page.js            # Reflexiones compartidas
│   │   ├── activar/
│   │   │   └── page.js            # Activar código de acceso
│   │   └── admin/
│   │       ├── page.js            # Panel admin principal
│   │       ├── codigos/
│   │       │   └── page.js        # Gestión de códigos
│   │       └── parejas/
│   │           └── page.js        # Ver progreso de parejas
│   ├── components/
│   │   ├── Header.js
│   │   ├── DayCard.js
│   │   ├── QuestionCard.js
│   │   ├── ProgressChart.js
│   │   ├── ConnectionMeter.js
│   │   ├── ReflectionPanel.js
│   │   ├── ChatBot.js
│   │   └── AdminSidebar.js
│   ├── data/
│   │   └── program.json           # 300 preguntas (30 días × 10)
│   └── lib/
│       ├── supabase.js            # Cliente Supabase
│       └── utils.js               # Utilidades
├── supabase/
│   └── migrations/
│       └── 001_initial.sql        # Schema completo
├── public/
│   ├── manifest.json              # PWA manifest
│   └── icons/                     # PWA icons
├── package.json
├── next.config.js
└── README.md
```

---

## Schema de Base de Datos (Supabase)

```sql
-- Tablas principales:
-- usuarios          → Datos del usuario (auth link)
-- parejas           → Vinculación de 2 usuarios  
-- codigos_acceso    → Códigos de un solo uso
-- dias              → Configuración de cada día
-- preguntas         → 300 preguntas del programa
-- respuestas        → Respuestas privadas de cada usuario
-- puntuaciones      → Nivel de conexión diario (1-10)
-- reflexiones_ia    → Reflexiones generadas por IA
-- recursos          → Videos, podcasts, enlaces
```

---

## User Review Required

> [!IMPORTANT]
> **Supabase:** Necesitaré las credenciales de tu proyecto Supabase (URL y anon key) para conectar la base de datos. ¿Ya tienes un proyecto creado en Supabase, o debo preparar todo para que lo configures después?

> [!IMPORTANT]
> **Contenido del Programa:** Las 300 preguntas (30 días × 10 preguntas) del cuadernillo de terapia — ¿tienes el contenido ya traducido al español, o debo crear preguntas de ejemplo basadas en la estructura del libro original?

> [!WARNING]
> **IA para Reflexiones:** La funcionalidad de "reflexión diaria generada por IA" requiere una API key de un modelo de lenguaje (OpenAI, Google AI, etc.). ¿Quieres que implemente esto o que deje un placeholder para configurarlo después?

---

## Open Questions

1. **¿Quieres que empiece con el MVP completo** (todas las funcionalidades listadas arriba) **o prefieres una versión inicial más simple** (login, programa de 30 días, y activación por código)?

2. **¿El precio actual del producto es 100 Bs o 70 Bs?** En la conversación aparecen ambos precios en diferentes momentos.

3. **¿Tienes dominio propio** para el deploy, o será desplegado temporalmente en Vercel con un subdominio?

4. **¿El chatbot asistente** debe responder preguntas específicas del cuadernillo, o es un chatbot general de soporte?

---

## Plan de Ejecución

### Fase 1 — Fundación
- [x] Investigación y plan
- [ ] Scaffolding del proyecto Next.js
- [ ] Design system (CSS variables, tipografía, colores, glassmorphism)
- [ ] Configuración de Supabase (schema SQL)

### Fase 2 — Core
- [ ] Landing page premium
- [ ] Sistema de auth (login/registro)
- [ ] Vinculación de parejas (código de invitación)
- [ ] `program.json` con las 300 preguntas
- [ ] Vista de programa (30 días)
- [ ] Vista de día individual (10 preguntas)
- [ ] Sistema de respuestas privadas

### Fase 3 — Engagement
- [ ] Progreso y gráficos
- [ ] Indicador de conexión (semáforo)
- [ ] Reflexiones compartidas
- [ ] Reflexión IA (placeholder/integración)
- [ ] Chatbot asistente

### Fase 4 — Monetización & Admin
- [ ] Sistema de códigos de acceso
- [ ] Panel admin completo
- [ ] QR de pago + WhatsApp
- [ ] PWA (Service Worker, manifest)

### Fase 5 — Pulido
- [ ] Animaciones y micro-interacciones
- [ ] Responsive completo
- [ ] Testing y verificación
- [ ] Documentación (README)

---

## Verificación

### Tests Manuales
- Flujo completo: registro → vincular pareja → día 1 gratis → activar código → días 2-30
- Panel admin: crear código, ver progreso
- Responsive: móvil, tablet, desktop

### Verificación Técnica
- `npm run build` sin errores
- Navegación entre todas las rutas
- Supabase: queries de lectura/escritura
