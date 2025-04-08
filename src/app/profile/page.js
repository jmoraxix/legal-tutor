"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import _Link from "next/link";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, _CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageLayout from "@/components/layout/PageLayout";

/**
 * User profile page component
 * 
 * @returns {React.ReactNode} Page component
 */
export default function ProfilePage() {
  const { user, profile, updateProfile, loading, isAuthenticated } = useAuth();
  
  // Log authentication state for debugging
  console.log('Profile page loaded, auth state:', { loading, isAuthenticated, hasUser: !!user });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    // First check ensures the auth state has been loaded
    if (!loading) {
      // Then check if the user is actually authenticated
      if (!isAuthenticated) {
        
        console.log('No user authenticated, redirecting to login');
        router.push('/login');
      } else {
        console.log('User authenticated, profile accessible');
      }
    }
  }, [loading, isAuthenticated, router]);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [profile]);

  /**
   * Handle profile update
   * 
   * @param {Event} e - Form event
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMessage("");
    setIsUpdating(true);

    try {
      const { error } = await updateProfile({
        first_name: firstName,
        last_name: lastName
      });

      if (error) throw error;

      setUpdateMessage("Perfil actualizado correctamente");
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      setUpdateMessage("Error al actualizar el perfil. Intenta de nuevo más tarde.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Show spinner while loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-legal-600 border-r-transparent dark:border-legal-400 dark:border-r-transparent"></div>
          <p className="mt-4 text-legal-600 dark:text-legal-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="w-full max-w-2xl mx-auto shadow-legal">
          <CardHeader className="border-b bg-white dark:bg-slate-900">
            <CardTitle className="font-serif text-legal-800 dark:text-legal-200">Perfil de Usuario</CardTitle>
            <CardDescription>
              Actualiza tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="p-4 bg-legal-50 dark:bg-legal-800/30 rounded-md border border-legal-200 dark:border-legal-700">
              <h3 className="text-sm font-medium text-legal-600 dark:text-legal-300 mb-1">Correo electrónico</h3>
              <p className="text-legal-800 dark:text-legal-200">{user?.email}</p>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                />
              </div>
              
              {updateMessage && (
                <div className={`p-2 rounded text-sm ${
                  updateMessage.includes("Error") 
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300"
                    : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300"
                }`}>
                  {updateMessage}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="bg-legal-600 hover:bg-legal-500 dark:bg-legal-400 dark:hover:bg-legal-300 dark:text-slate-900"
                disabled={isUpdating}
              >
                {isUpdating ? "Actualizando..." : "Actualizar Perfil"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

    </PageLayout>
  );
}
