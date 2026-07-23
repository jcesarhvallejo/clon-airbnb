import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  eliminarReserva,
  obtenerReservasUsuario,
} from "../services/reservaService";

function Reservas() {
  const { perfil, cargandoAuth } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarReservas() {
      if (!perfil) return;

      try {
        setCargando(true);
        setError("");

        const datos = await obtenerReservasUsuario(perfil.id_usuario);

        setReservas(datos);
      } catch (error) {
        console.error(error);
        setError("No fue posible cargar tus reservas.");
      } finally {
        setCargando(false);
      }
    }

    cargarReservas();
  }, [perfil]);

  function formatearFecha(fecha) {
    return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  async function manejarEliminar(idReserva) {
    const confirmar = window.confirm(
      "¿Seguro que deseas cancelar esta reserva?"
    );

    if (!confirmar) return;

    try {
      setError("");

      await eliminarReserva(idReserva);

      setReservas((actuales) =>
        actuales.filter((reserva) => reserva.id_reserva !== idReserva)
      );
    } catch (error) {
      console.error(error);
      setError("No fue posible cancelar la reserva.");
    }
  }

  if (cargandoAuth || cargando) {
    return <p className="text-center">Cargando reservas...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section>
      <h1 className="mb-4">Mis reservas</h1>

      {reservas.length === 0 ? (
        <div className="alert alert-info">
          Aún no tienes reservas.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {reservas.map((reserva) => {
            const fotos = [...(reserva.inmueble?.foto ?? [])].sort(
              (a, b) => a.imagen_orden - b.imagen_orden
            );

            const imagenPrincipal = fotos[0]?.imagen_url;

            return (
              <div className="col" key={reserva.id_reserva}>
                <div className="card h-100 shadow-sm">
                  {imagenPrincipal && (
                    <img
                      src={imagenPrincipal}
                      className="card-img-top"
                      alt={reserva.inmueble?.nombre}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}

                  <div className="card-body">
                    <h5 className="card-title">
                      {reserva.inmueble?.nombre}
                    </h5>

                    <p className="mb-2">
                      <strong>Entrada:</strong>{" "}
                      {formatearFecha(reserva.fecha_entrada)}
                    </p>

                    <p className="mb-2">
                      <strong>Salida:</strong>{" "}
                      {formatearFecha(reserva.fecha_salida)}
                    </p>

                    <p className="mb-2">
                      <strong>Huéspedes:</strong>{" "}
                      {reserva.nro_huespedes}
                    </p>

                    <p className="fw-bold mb-0">
                      Total:{" "}
                      {Number(reserva.precio_final).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      })}
                    </p>

                    <div className="d-flex gap-2 mt-3">
                      <Link
                        to={`/editar-reserva/${reserva.id_reserva}`}
                        className="btn btn-outline-primary w-100"
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        className="btn btn-outline-danger w-100"
                        onClick={() =>
                          manejarEliminar(reserva.id_reserva)
                        }
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Reservas;
