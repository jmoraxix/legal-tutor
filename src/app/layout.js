import { Inter, Lora } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lora = Lora({ 
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

/**
 * Root layout component that wraps all pages.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.ReactNode} The rendered component.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${lora.variable}`}>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Legal Tutor - Aprende sobre temas legales en Costa Rica',
  description: 'Chatbot para consultas y aprendizaje de temas legales en Costa Rica',
};
