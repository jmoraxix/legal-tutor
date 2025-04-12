import { Inter, Lora } from 'next/font/google';
import '@/styles/globals.css';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth';
import { Toaster } from '@/components/ui/toaster';
import { FloatingFeedback } from '@/components/feedback';

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
      <head>
        {/* CSS scripts using Next.js Script component */}
        {/* Add inline critical CSS to ensure basic styling loads immediately */}
        <style dangerouslySetInnerHTML={{ __html: `
          body { font-family: var(--font-inter), sans-serif; background-color: #fff; color: #000; }
          .dark body { background-color: #1e293b; color: #f8fafc; }
          h1, h2, h3, h4, h5, h6 { font-family: var(--font-lora), serif; }
          .legal-button { background-color: #475569; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; }
          .dark .legal-button { background-color: #94a3b8; color: #1e293b; }
        `}} />
        {/* CSS styles now handled by Next.js */}
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster />
            <FloatingFeedback />
          </ThemeProvider>
        </AuthProvider>
        {/* CSS loading fallback script - using Next.js Script component */}
        <Script id="css-preload" src="/css-preload.js" strategy="beforeInteractive" />
        <Script id="netlify-css-loader" src="/netlify-css-loader.js" strategy="beforeInteractive" />
        <Script id="netlifyconfig" src="/netlifyconfig.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Legal Tutor - Aprende sobre temas legales en Costa Rica',
  description: 'Chatbot para consultas y aprendizaje de temas legales en Costa Rica',
};
