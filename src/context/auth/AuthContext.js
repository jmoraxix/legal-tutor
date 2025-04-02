"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  getCurrentUser, 
  getUserProfile, 
  onAuthStateChange, 
  signIn, 
  signOut, 
  signUp, 
  updateUserProfile 
} from '@/lib/auth';

// Creamos el contexto de autenticación
const AuthContext = createContext();

/**
 * Proveedor de contexto de autenticación
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactNode} Componente proveedor
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga el usuario inicial
  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        
        // Obtener usuario actual
        const { user: currentUser, error: userError } = await getCurrentUser();
        
        if (userError) {
          throw userError;
        }
        
        if (currentUser) {
          setUser(currentUser);
          
          // Obtener perfil del usuario
          const { profile: userProfile, error: profileError } = await getUserProfile(currentUser.id);
          
          if (profileError) {
            throw profileError;
          }
          
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Error al cargar el usuario:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
    
    // Configurar listener para cambios en la autenticación
    const unsubscribe = onAuthStateChange(async (session) => {
      if (session?.user) {
        setUser(session.user);
        const { profile: userProfile } = await getUserProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }

      // Actualizar el estado de carga
      setLoading(false);
    });
    
    // Limpiar listener al desmontar
    return () => unsubscribe();
  }, []);

  /**
   * Registra un nuevo usuario
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise} Resultado de la operación
   */
  const register = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: signUpError } = await signUp(email, password);
      
      if (signUpError) throw signUpError;
      
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inicia sesión con un usuario existente
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise} Resultado de la operación
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) throw signInError;
      
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra la sesión del usuario actual
   * 
   * @returns {Promise} Resultado de la operación
   */
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signOutError } = await signOut();
      
      if (signOutError) throw signOutError;
      
      setUser(null);
      setProfile(null);
      
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza el perfil del usuario
   * 
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise} Resultado de la operación
   */
  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('No hay usuario autenticado') };
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: updateError } = await updateUserProfile(user.id, updates);
      
      if (updateError) throw updateError;
      
      // Actualizamos el perfil en el estado
      setProfile({ ...profile, ...updates });
      
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    user,
    profile,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 * 
 * @returns {Object} Contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}
