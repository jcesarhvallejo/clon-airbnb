import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { obtenerPerfilUsuario } from "../services/usuarioService";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [errorPerfil, setErrorPerfil] = useState("");
  const [cargandoAuth, setCargandoAuth] = useState(true);

  async function procesarSesion(session) {
    const usuarioAuth = session?.user ?? null;

    setUsuario(usuarioAuth);

    if (usuarioAuth) {
      try {
        setErrorPerfil("");
        const datosPerfil = await obtenerPerfilUsuario(usuarioAuth.id);
        setPerfil(datosPerfil);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setPerfil(null);
        setErrorPerfil(
          "No se pudo cargar tu perfil. Verifica la política SELECT de usuario y que auth_user_id coincida."
        );
      }
    } else {
      setPerfil(null);
      setErrorPerfil("");
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
        errorPerfil,
        cargandoAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
