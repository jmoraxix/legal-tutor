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
        {/* Add inline critical CSS to ensure basic styling loads immediately */}
        <style dangerouslySetInnerHTML={{ __html: `
          body { font-family: var(--font-inter), sans-serif; background-color: #fff; color: #000; }
          .dark body { background-color: #1e293b; color: #f8fafc; }
          h1, h2, h3, h4, h5, h6 { font-family: var(--font-lora), serif; }
          .legal-button { background-color: #475569; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; }
          .dark .legal-button { background-color: #94a3b8; color: #1e293b; }
        `}} />
        {/* Add fallback CSS for Netlify */}
        <link rel="stylesheet" href="/netlify-fixes.css" />
        <link rel="stylesheet" href="/critical.css" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster />
            <FloatingFeedback />
          </ThemeProvider>
        </AuthProvider>
        {/* CSS loading fallback script */}
        <Script id="css-fallback" strategy="afterInteractive">
          {`
          (function() {
            function checkStylesheets() {
              const styles = document.querySelectorAll('link[rel="stylesheet"]');
              let needsReload = false;
              
              styles.forEach(style => {
                try {
                  const sheet = style.sheet;
                  if (!sheet || sheet.cssRules.length === 0) {
                    needsReload = true;
                  }
                } catch (e) {
                  // Cross-origin stylesheet access error - normal
                }
              });
              
              if (needsReload) {
                console.log('Reloading stylesheets...');
                styles.forEach(style => {
                  const href = style.href;
                  if (href) {
                    const url = new URL(href);
                    url.searchParams.set('t', new Date().getTime());
                    const newLink = document.createElement('link');
                    newLink.rel = 'stylesheet';
                    newLink.href = url.toString();
                    document.head.appendChild(newLink);
                  }
                });
              }
            }
            
            // Check stylesheets after page loads
            window.addEventListener('load', checkStylesheets);
            
            // Also check after a short delay to catch any race conditions
            setTimeout(checkStylesheets, 1000);
          })();
          `}
        </Script>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Legal Tutor - Aprende sobre temas legales en Costa Rica',
  description: 'Chatbot para consultas y aprendizaje de temas legales en Costa Rica',
};
