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
 * Página de registro de usuario
 *
 * @returns {React.ReactNode} Componente de página
 */
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  /**
   * Maneja el envío del formulario de registro
   *
   * @param {Event} e - Evento de formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    // Validación
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    setIsLoading(true);

    try {
      const { error: registerError } = await register(email, password);
      
      if (registerError) {
        throw registerError;
      }
      
      setSuccessMessage("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
      
      // Opcional: redirigir después de un tiempo o esperar a que el usuario haga clic en un enlace
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      console.error("Error al registrarse:", err);
      
      if (err.message.includes("already registered")) {
        setError("Este correo ya está registrado. Intenta iniciar sesión.");
      } else {
        setError("Error al crear la cuenta. Por favor, intenta de nuevo más tarde.");
      }
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
                  <Link href="/login" className="text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white font-medium">
                    Iniciar Sesión
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
            <CardTitle className="text-2xl font-serif text-center">Crear una cuenta</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus datos para registrarte en Legal Tutor
            </CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage ? (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-green-700 dark:text-green-300">
                <p className="text-center font-medium">{successMessage}</p>
                <p className="text-center text-sm mt-2">Redirigiendo al inicio de sesión...</p>
              </div>
            ) : (
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
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-legal-500">La contraseña debe tener al menos 6 caracteres</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {isLoading ? "Procesando..." : "Registrarse"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link 
                href="/login" 
                className="text-legal-600 hover:text-legal-900 dark:text-legal-400 dark:hover:text-legal-200 font-medium"
              >
                Inicia sesión
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
