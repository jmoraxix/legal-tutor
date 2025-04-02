"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Página de inicio de sesión
 *
 * @returns {React.ReactNode} Componente de página
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  /**
   * Maneja el envío del formulario de inicio de sesión
   *
   * @param {Event} e - Evento de formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error: loginError } = await login(email, password);
      
      if (loginError) {
        throw loginError;
      }
      
      // Redirigir al usuario a la página principal
      router.push("/");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(
        err.message === "Invalid login credentials"
          ? "Credenciales inválidas. Verifica tu email y contraseña."
          : "Error al iniciar sesión. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">
            Legal Tutor
          </Link>
          <div className="flex items-center gap-6">
            <nav>
              <ul className="flex gap-6">
                <li>
                  <Link href="/register" className="text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white font-medium">
                    Registrarse
                  </Link>
                </li>
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto shadow-legal">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link 
                    href="/recuperar-contrasena" 
                    className="text-sm text-legal-600 hover:text-legal-900 dark:text-legal-400 dark:hover:text-legal-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-legal-800 hover:bg-legal-700 dark:bg-legal-700 dark:hover:bg-legal-600"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link 
                href="/register" 
                className="text-legal-600 hover:text-legal-900 dark:text-legal-400 dark:hover:text-legal-200 font-medium"
              >
                Regístrate
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>

      <footer className="border-t py-4 bg-white dark:bg-slate-900 shadow-md">
        <div className="container mx-auto text-center text-sm text-legal-500">
          <p>&copy; {new Date().getFullYear()} Ayzek Studio. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 mt-2">
            <Link href="/terminos" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Términos</Link>
            <Link href="/privacidad" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Privacidad</Link>
            <Link href="/contacto" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
