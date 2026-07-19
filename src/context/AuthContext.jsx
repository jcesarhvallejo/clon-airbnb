import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { obtenerPerfilUsuario } from "../services/usuarioService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  async function procesarSesion(session) {
    const usuarioAuth = session?.user ?? null;

    setUsuario(usuarioAuth);

    if (usuarioAuth) {
      try {
        const datosPerfil = await obtenerPerfilUsuario(usuarioAuth.id);
        setPerfil(datosPerfil);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setPerfil(null);
      }
    } else {
      setPerfil(null);
    }

    setCargandoAuth(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      procesarSesion(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      procesarSesion(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        perfil,
        cargandoAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}