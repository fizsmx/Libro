import './globals.css';
import ChatBot from '@/components/ChatBot';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata = {
  title: '14 Días Para Reconectar — Programa de Terapia de Pareja',
  description: 'Un programa de 14 días diseñado para que tú y tu pareja trabajen juntos en fortalecer su conexión emocional a través de conversaciones guiadas, reflexiones profundas y análisis IA personalizado.',
  keywords: 'terapia de pareja, relaciones, conexión emocional, cuadernillo de parejas, programa 14 días, análisis IA parejas',
  openGraph: {
    title: '14 Días Para Reconectar',
    description: 'Fortalece tu relación con 14 días de conversaciones guiadas y análisis IA',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <ChatBot />
        <ThemeToggle />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
