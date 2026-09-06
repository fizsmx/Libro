# 💕 30 Días Para Reconectar

> Un programa interactivo de 30 días para que las parejas fortalezcan su conexión emocional a través de conversaciones guiadas, reflexiones profundas y ejercicios prácticos.

---

## 🎯 ¿Qué es?

**30 Días Para Reconectar** es una aplicación web que transforma un cuadernillo de terapia de pareja en una experiencia digital interactiva. Cada día, la pareja responde 10 preguntas de reflexión, evalúa su nivel de conexión y comparte lo aprendido.

### Funcionalidades

- 📘 **300 preguntas** organizadas en 30 temas progresivos
- 💬 **Respuestas privadas** que se comparten cuando ambos terminan
- 📊 **Seguimiento de progreso** con gráficos de conexión emocional
- 🔑 **Sistema de códigos de acceso** para monetización
- 🧠 **Reflexión diaria** (¿cómo me sentí?, ¿qué aprendí?, ¿qué quiero mejorar?)
- 🔐 **Panel de administración** para gestionar códigos y ver estadísticas
- 📱 **PWA** — instalable como app en móvil
- 🌙 **Diseño premium** con glassmorphism y paleta romántica

### Producto incluido (oferta 70 Bs)

1. ✅ Cuadernillo de Terapia de Pareja — 30 días interactivos
2. ✅ Libro: Cómo Manejar Conversaciones Difíciles (PDF)
3. ✅ Chatbot especializado en terapia de pareja
4. ✅ Podcast sobre terapia y conexión de pareja
5. ✅ Video explicativo del programa

---

## 🛠 Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Base de datos | Supabase (PostgreSQL + Auth) |
| Estilos | CSS vanilla (premium, glassmorphism) |
| Fuentes | Playfair Display + Inter (Google Fonts) |
| Deploy | Vercel-ready |

---

## 🚀 Instalación

```bash
# Clonar el repo
git clone https://github.com/fizsmx/Libro.git
cd Libro/treinta-dias

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

La app estará en **http://localhost:3000**

> **Nota:** Sin configurar Supabase, la app funciona en **modo demo** usando localStorage.

---

## ⚙️ Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a Settings → API y copia:
   - `Project URL`
   - `anon public` key
3. Pega los valores en `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
   ```
4. Ve a SQL Editor y ejecuta el contenido de `supabase/migrations/001_initial.sql`
5. Habilita Email/Password en Authentication → Providers
6. Reinicia el servidor

---

## 📁 Estructura del Proyecto

```
treinta-dias/
├── src/
│   ├── app/
│   │   ├── page.js              # Landing page
│   │   ├── globals.css           # Design system completo
│   │   ├── login/page.js         # Login
│   │   ├── registro/page.js      # Registro
│   │   ├── dashboard/page.js     # Programa (grid 30 días)
│   │   ├── dia/[numero]/page.js  # Vista de cada día (10 preguntas)
│   │   ├── progreso/page.js      # Gráficos de progreso
│   │   ├── activar/page.js       # Activar código de acceso
│   │   └── admin/page.js         # Panel de administración
│   ├── data/
│   │   └── program.json          # 300 preguntas (30 × 10)
│   └── lib/
│       └── supabase.js           # Cliente Supabase
├── supabase/
│   └── migrations/
│       └── 001_initial.sql       # Schema completo + RLS
├── public/
│   └── manifest.json             # PWA
└── PENDIENTES.md                 # Mejoras y funcionalidades pendientes
```

---

## 🔐 Credenciales de Demo

| Recurso | Valor |
|---|---|
| Admin Panel (`/admin`) | Contraseña: `admin30dias` |
| Códigos demo | Cualquier código que empiece con `30`, `DEMO` o `FREE` |

> ⚠️ **Cambia la contraseña de admin antes de ir a producción**

---

## 📲 Contacto

- **WhatsApp:** [+591 76419099](https://wa.me/59176419099)
- **Precio:** 70 Bs (promoción)

---

## 📋 Pendientes

Ver [PENDIENTES.md](./PENDIENTES.md) para la lista completa de funcionalidades pendientes y mejoras planificadas.

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.
