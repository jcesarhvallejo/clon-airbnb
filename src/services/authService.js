import { supabase } from "../supabase/client";

export async function registrarUsuario({
  cedula,
  nombre,
  apellido,
  fechaNacimiento,
  genero,
  telefono,
  correo,
  password,
  rolId,
}) {
  const { data, error } = await supabase.auth.signUp({
    email: correo,
    password,
    options: {
      data: {
        cedula,
        nombre,
        apellido,
        fecha_nacimiento: fechaNacimiento,
        genero,
        telefono,
        rol_id: rolId,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function iniciarSesion(correo, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function obtenerSesion() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function solicitarRecuperacion(correo) {
  const { error } = await supabase.auth.resetPasswordForEmail(correo, {
    redirectTo: `${window.location.origin}/actualizar-password`,
  });

  if (error) {
    throw error;
  }
}

export async function actualizarPassword(password) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}