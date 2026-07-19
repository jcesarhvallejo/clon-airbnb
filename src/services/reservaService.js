import { supabase } from "../supabase/client";

export async function crearReserva({
  fechaEntrada,
  fechaSalida,
  numeroHuespedes,
  precioFinal,
  usuarioId,
  inmuebleId,
}) {
  const { data: reservasExistentes, error: errorDisponibilidad } =
    await supabase
      .from("reserva")
      .select("id_reserva")
      .eq("inmueble_id", inmuebleId)
      .lt("fecha_entrada", fechaSalida)
      .gt("fecha_salida", fechaEntrada);

  if (errorDisponibilidad) {
    throw errorDisponibilidad;
  }

  if (reservasExistentes.length > 0) {
    throw new Error(
      "El alojamiento ya tiene una reserva en las fechas seleccionadas."
    );
  }

  const { data, error } = await supabase
    .from("reserva")
    .insert({
      fecha_entrada: fechaEntrada,
      fecha_salida: fechaSalida,
      nro_huespedes: numeroHuespedes,
      precio_final: precioFinal,
      usuario_id: usuarioId,
      inmueble_id: inmuebleId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerReservasUsuario(usuarioId) {
  const { data, error } = await supabase
    .from("reserva")
    .select(`
      id_reserva,
      fecha_entrada,
      fecha_salida,
      nro_huespedes,
      precio_final,
      inmueble (
        id_inmueble,
        nombre,
        foto (
          imagen_url,
          imagen_orden
        )
      )
    `)
    .eq("usuario_id", usuarioId)
    .order("fecha_entrada", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerReservaPorId(idReserva) {
  const { data, error } = await supabase
    .from("reserva")
    .select(`
      id_reserva,
      fecha_entrada,
      fecha_salida,
      nro_huespedes,
      precio_final,
      inmueble (
        id_inmueble,
        nombre,
        precio_base,
        huespedes_base
      )
    `)
    .eq("id_reserva", idReserva)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarReserva({
  idReserva,
  fechaEntrada,
  fechaSalida,
  numeroHuespedes,
  precioFinal,
  inmuebleId,
}) {
  const { data: reservasExistentes, error: errorDisponibilidad } =
    await supabase
      .from("reserva")
      .select("id_reserva")
      .eq("inmueble_id", inmuebleId)
      .neq("id_reserva", idReserva)
      .lt("fecha_entrada", fechaSalida)
      .gt("fecha_salida", fechaEntrada);

  if (errorDisponibilidad) {
    throw errorDisponibilidad;
  }

  if (reservasExistentes.length > 0) {
    throw new Error(
      "El alojamiento ya tiene una reserva en las fechas seleccionadas."
    );
  }

  const { data, error } = await supabase
    .from("reserva")
    .update({
      fecha_entrada: fechaEntrada,
      fecha_salida: fechaSalida,
      nro_huespedes: numeroHuespedes,
      precio_final: precioFinal,
    })
    .eq("id_reserva", idReserva)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarReserva(idReserva) {
  const { error } = await supabase
    .from("reserva")
    .delete()
    .eq("id_reserva", idReserva);

  if (error) {
    throw error;
  }
}