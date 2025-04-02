"use client";

import Header from './Header';
import Footer from './Footer';

/**
 * Page layout component that applies a consistent layout with header and footer.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactNode} The rendered page layout
 */
export default function PageLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
