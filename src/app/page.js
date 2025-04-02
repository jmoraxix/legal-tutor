"use client";

import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";

/**
 * Home page component.
 *
 * @returns {React.ReactNode} The rendered component.
 */
export default function Home() {
  return (
    <PageLayout>
      
      <main className="flex-1">
        <section className="py-20 text-center bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-serif font-bold mb-6 text-legal-800 dark:text-legal-200">Tu asistente legal en Costa Rica</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-legal-600 dark:text-legal-300">
              Aprende sobre temas legales y obtén respuestas a tus consultas mediante un chatbot especializado en legislación costarricense.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat" className="bg-legal-800 hover:bg-legal-700 text-white dark:bg-legal-700 dark:hover:bg-legal-600 px-6 py-3 rounded-md transition-colors shadow-md">
                Iniciar Chat
              </Link>
              <Link href="/quiz" className="bg-white text-legal-800 px-6 py-3 rounded-md hover:bg-legal-50 border border-legal-300 dark:bg-legal-800 dark:text-white dark:hover:bg-legal-700 dark:border-legal-600 transition-colors shadow-md">
                Modo Quiz
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold mb-10 text-center text-legal-800 dark:text-legal-200">Características</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-legal-800 p-6 rounded-lg shadow-legal border border-legal-200 dark:border-legal-700">
                <h3 className="text-xl font-serif font-bold mb-3 text-legal-800 dark:text-legal-200">Chat General</h3>
                <p className="text-legal-600 dark:text-legal-300">Consulta cualquier tema legal y recibe respuestas basadas en la legislación costarricense.</p>
              </div>
              <div className="bg-white dark:bg-legal-800 p-6 rounded-lg shadow-legal border border-legal-200 dark:border-legal-700">
                <h3 className="text-xl font-serif font-bold mb-3 text-legal-800 dark:text-legal-200">Modo Quiz</h3>
                <p className="text-legal-600 dark:text-legal-300">Pon a prueba tus conocimientos legales con preguntas interactivas y explicaciones detalladas.</p>
              </div>
              <div className="bg-white dark:bg-legal-800 p-6 rounded-lg shadow-legal border border-legal-200 dark:border-legal-700">
                <h3 className="text-xl font-serif font-bold mb-3 text-legal-800 dark:text-legal-200">Documentos Actualizados</h3>
                <p className="text-legal-600 dark:text-legal-300">Respuestas basadas en legislación vigente y actualizada del sistema legal costarricense.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold mb-6 text-legal-800 dark:text-legal-200">¿Listo para empezar?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-legal-600 dark:text-legal-300">
              Comienza a explorar el mundo legal de Costa Rica con nuestra plataforma intuitiva y educativa.
            </p>
            <Link href="/register" className="bg-legal-800 hover:bg-legal-700 text-white dark:bg-legal-700 dark:hover:bg-legal-600 px-6 py-3 rounded-md transition-colors shadow-md inline-block">
              Crear una cuenta
            </Link>
          </div>
        </section>
      </main>
      
    </PageLayout>
  );
}
