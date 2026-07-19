import { supabase } from "../supabase/client";

export async function obtenerPerfilUsuario(authUserId) {
  const { data, error } = await supabase
    .from("usuario")
    .select("id_usuario, nombre, apellido, rol_id")
    .eq("auth_user_id", authUserId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}