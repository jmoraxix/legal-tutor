"use client";

import Link from 'next/link';

/**
 * Shared Footer component for consistent footer across the app.
 *
 * @returns {React.ReactNode} The rendered footer component
 */
export default function Footer() {
  return (
    <footer className="border-t py-4 bg-white dark:bg-slate-900 shadow-md relative">
      <div className="container mx-auto text-center text-sm text-legal-500">
        <p>&copy; {new Date().getFullYear()} Ayzek Studio. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/terminos" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Términos</Link>
          <Link href="/privacidad" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Privacidad</Link>
          <Link href="/contacto" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}
