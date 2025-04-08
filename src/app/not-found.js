import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Página No Encontrada</h1>
      <p className="text-lg mb-6">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-colors"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
