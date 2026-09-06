import './globals.css';
import ChatBot from '@/components/ChatBot';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata = {
  title: '30 Días Para Reconectar — Programa de Terapia de Pareja',
  description: 'Un programa de 30 días diseñado para que tú y tu pareja trabajen juntos en fortalecer su conexión emocional a través de conversaciones guiadas, reflexiones y ejercicios prácticos.',
  keywords: 'terapia de pareja, relaciones, conexión emocional, cuadernillo de parejas, programa 30 días',
  openGraph: {
    title: '30 Días Para Reconectar',
    description: 'Fortalece tu relación con 30 días de conversaciones guiadas',
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
