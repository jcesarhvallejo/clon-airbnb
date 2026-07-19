import { supabase } from "../supabase/client";

export async function obtenerInmuebles() {
  const { data, error } = await supabase
    .from("inmueble")
    .select(
      `
      id_inmueble,
      nombre,
      descripcion,
      precio_base,
      huespedes_base,
      foto (
        imagen_url,
        imagen_orden
      )
    `,
    )
    .order("id_inmueble");

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerInmueblePorId(id) {
  const { data, error } = await supabase
    .from("inmueble")
    .select(
      `
      id_inmueble,
      nombre,
      descripcion,
      precio_base,
      huespedes_base,
      foto (
        imagen_url,
        imagen_orden
      )
    `,
    )
    .eq("id_inmueble", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function crearInmueble({
  nombre,
  descripcion,
  precioBase,
  huespedesBase,
  anfitrionId,
}) {
  const { data, error } = await supabase
    .from("inmueble")
    .insert({
      nombre,
      descripcion,
      precio_base: precioBase,
      huespedes_base: huespedesBase,
      anfitrion_id: anfitrionId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function subirFotosInmueble(inmuebleId, archivos) {
  const fotosGuardadas = [];

  for (const [indice, archivo] of archivos.entries()) {
    const extension = archivo.name.split(".").pop();
    const nombreArchivo = `${crypto.randomUUID()}.${extension}`;
    const ruta = `inmueble-${inmuebleId}/${nombreArchivo}`;

    const { error: errorSubida } = await supabase.storage
      .from("inmuebles")
      .upload(ruta, archivo, {
        cacheControl: "3600",
        upsert: false,
      });

    if (errorSubida) {
      throw errorSubida;
    }

    const { data: urlData } = supabase.storage
      .from("inmuebles")
      .getPublicUrl(ruta);

    const { data: foto, error: errorFoto } = await supabase
      .from("foto")
      .insert({
        imagen_url: urlData.publicUrl,
        storage_path: ruta,
        imagen_orden: indice + 1,
        inmueble_id: inmuebleId,
      })
      .select()
      .single();

    if (errorFoto) {
      throw errorFoto;
    }

    fotosGuardadas.push(foto);
  }

  return fotosGuardadas;
}


export async function obtenerInmueblesAnfitrion(anfitrionId) {
  const { data, error } = await supabase
    .from("inmueble")
    .select(`
      id_inmueble,
      nombre,
      descripcion,
      precio_base,
      huespedes_base,
      foto (
        id_foto,
        imagen_url,
        imagen_orden,
        storage_path
      )
    `)
    .eq("anfitrion_id", anfitrionId)
    .order("id_inmueble", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarInmueble(idInmueble, datos) {
  const { data, error } = await supabase
    .from("inmueble")
    .update({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio_base: datos.precioBase,
      huespedes_base: datos.huespedesBase,
    })
    .eq("id_inmueble", idInmueble)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarInmueble(idInmueble) {
  const { data: fotos, error: errorFotos } = await supabase
    .from("foto")
    .select("id_foto, storage_path")
    .eq("inmueble_id", idInmueble);

  if (errorFotos) {
    throw errorFotos;
  }

  const rutas = fotos
    .map((foto) => foto.storage_path)
    .filter(Boolean);

  if (rutas.length > 0) {
    const { error: errorStorage } = await supabase.storage
      .from("inmuebles")
      .remove(rutas);

    if (errorStorage) {
      throw errorStorage;
    }
  }

  const { error: errorEliminarFotos } = await supabase
    .from("foto")
    .delete()
    .eq("inmueble_id", idInmueble);

  if (errorEliminarFotos) {
    throw errorEliminarFotos;
  }

  const { error: errorEliminarInmueble } = await supabase
    .from("inmueble")
    .delete()
    .eq("id_inmueble", idInmueble);

  if (errorEliminarInmueble) {
    throw errorEliminarInmueble;
  }
}