import { supabase } from "../supabase/client";

export async function obtenerInmuebles() {
  const { data, error } = await supabase
    .from("inmueble")
    .select(`
      id_inmueble,
      nombre,
      descripcion,
      precio_base,
      huespedes_base,
      foto (
        imagen_url,
        imagen_orden
      )
    `)
    .order("id_inmueble");

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerInmueblePorId(id) {
  const { data, error } = await supabase
    .from("inmueble")
    .select(`
      id_inmueble,
      nombre,
      descripcion,
      precio_base,
      huespedes_base,
      foto (
        imagen_url,
        imagen_orden
      )
    `)
    .eq("id_inmueble", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}