import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  actualizarReserva,
  obtenerReservaPorId,
} from "../services/reservaService";

function EditarReserva() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reserva, setReserva] = useState(null);
  const [fechaEntrada, setFechaEntrada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [numeroHuespedes, setNumeroHuespedes] = useState(1);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const hoy = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function cargarReserva() {
      try {
        const datos = await obtenerReservaPorId(id);

        setReserva(datos);
        setFechaEntrada(datos.fecha_entrada);
        setFechaSalida(datos.fecha_salida);
        setNumeroHuespedes(datos.nro_huespedes);
      } catch (error) {
        console.error(error);
        setError("No fue posible cargar la reserva.");
      } finally {
        setCargandoDatos(false);
      }
    }

    cargarReserva();
  }, [id]);

  const noches = useMemo(() => {
    if (!fechaEntrada || !fechaSalida) return 0;

    const [anioEntrada, mesEntrada, diaEntrada] =
      fechaEntrada.split("-").map(Number);

    const [anioSalida, mesSalida, diaSalida] =
      fechaSalida.split("-").map(Number);

    const entrada = Date.UTC(
      anioEntrada,
      mesEntrada - 1,
      diaEntrada
    );

    const salida = Date.UTC(
      anioSalida,
      mesSalida - 1,
      diaSalida
    );

    return Math.max(
      0,
      Math.floor((salida - entrada) / (1000 * 60 * 60 * 24))
    );
  }, [fechaEntrada, fechaSalida]);

  const precioPorNoche = Number(reserva?.inmueble?.precio_base) || 0;
  const precioTotal = noches * precioPorNoche;

  async function manejarSubmit(evento) {
    evento.preventDefault();

    if (noches <= 0) {
      setError("La fecha de salida debe ser posterior a la entrada.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await actualizarReserva({
        idReserva: id,
        fechaEntrada,
        fechaSalida,
        numeroHuespedes: Number(numeroHuespedes),
        precioFinal: precioTotal,
        inmuebleId: reserva.inmueble.id_inmueble,
      });

      navigate("/reservas");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargandoDatos) {
    return <p className="text-center">Cargando reserva...</p>;
  }

  if (!reserva) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h3 mb-2">Editar reserva</h1>

            <p className="text-muted mb-4">
              {reserva.inmueble.nombre}
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={manejarSubmit}>
              <div className="mb-3">
                <label className="form-label">Fecha de entrada</label>

                <input
                  type="date"
                  className="form-control"
                  value={fechaEntrada}
                  onChange={(evento) => {
                    setFechaEntrada(evento.target.value);

                    if (
                      fechaSalida &&
                      evento.target.value >= fechaSalida
                    ) {
                      setFechaSalida("");
                    }
                  }}
                  min={hoy}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de salida</label>

                <input
                  type="date"
                  className="form-control"
                  value={fechaSalida}
                  onChange={(evento) =>
                    setFechaSalida(evento.target.value)
                  }
                  min={fechaEntrada || hoy}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Número de huéspedes</label>

                <input
                  type="number"
                  className="form-control"
                  value={numeroHuespedes}
                  onChange={(evento) =>
                    setNumeroHuespedes(evento.target.value)
                  }
                  min="1"
                  max={reserva.inmueble.huespedes_base}
                  required
                />
              </div>

              <div className="alert alert-light border">
                <p className="mb-1">
                  Noches: <strong>{noches}</strong>
                </p>

                <p className="mb-0">
                  Total:{" "}
                  <strong>
                    {precioTotal.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    })}
                  </strong>
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={guardando || noches <= 0}
                >
                  {guardando
                    ? "Guardando..."
                    : "Guardar cambios"}
                </button>

                <Link to="/reservas" className="btn btn-outline-secondary">
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarReserva;