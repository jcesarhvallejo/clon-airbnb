import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { crearReserva } from "../services/reservaService";

function ReservaForm({ inmueble }) {
  const { usuario, perfil, errorPerfil } = useAuth();

  const [fechaEntrada, setFechaEntrada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [numeroHuespedes, setNumeroHuespedes] = useState(1);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const hoy = new Date().toISOString().split("T")[0];

  const noches = useMemo(() => {
    if (!fechaEntrada || !fechaSalida) {
      return 0;
    }

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

    const diferenciaMilisegundos = salida - entrada;

    return Math.max(
      0,
      Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24))
    );
  }, [fechaEntrada, fechaSalida]);

  const precioPorNoche = Number(inmueble.precio_base) || 0;
  const precioTotal = noches * precioPorNoche;

  async function manejarSubmit(evento) {
    evento.preventDefault();

    if (noches <= 0) {
      setError("La fecha de salida debe ser posterior a la fecha de entrada.");
      return;
    }

    try {
      setCargando(true);
      setError("");
      setMensaje("");

      await crearReserva({
        fechaEntrada,
        fechaSalida,
        numeroHuespedes: Number(numeroHuespedes),
        precioFinal: precioTotal,
        usuarioId: perfil.id_usuario,
        inmuebleId: inmueble.id_inmueble,
      });

      setMensaje("Reserva creada correctamente.");
      setFechaEntrada("");
      setFechaSalida("");
      setNumeroHuespedes(1);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  if (!usuario) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <p className="mb-3">Inicia sesión para realizar una reserva.</p>

          <Link to="/login" className="btn btn-danger w-100">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="alert alert-warning">
        {errorPerfil || "Cargando perfil..."}
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h4 className="mb-3">
          {precioPorNoche.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
          })}{" "}
          por noche
        </h4>

        {error && <div className="alert alert-danger">{error}</div>}

        {mensaje && <div className="alert alert-success">{mensaje}</div>}

        <form onSubmit={manejarSubmit}>
          <div className="mb-3">
            <label className="form-label">Fecha de entrada</label>

            <input
              type="date"
              className="form-control"
              value={fechaEntrada}
              onChange={(evento) => {
                setFechaEntrada(evento.target.value);

                if (fechaSalida && evento.target.value >= fechaSalida) {
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
              onChange={(evento) => setFechaSalida(evento.target.value)}
              min={fechaEntrada || hoy}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Número de huéspedes</label>

            <input
              type="number"
              className="form-control"
              value={numeroHuespedes}
              onChange={(evento) => setNumeroHuespedes(evento.target.value)}
              min="1"
              max={inmueble.huespedes_base}
              required
            />
          </div>

          <hr />

          {noches > 0 ? (
            <>
              <p className="mb-2">
                {precioPorNoche.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                })}{" "}
                × {noches} noche{noches > 1 ? "s" : ""}
              </p>

              <p className="h5 mb-3">
                Total:{" "}
                {precioTotal.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                })}
              </p>
            </>
          ) : (
            <p className="text-muted mb-3">
              Selecciona las fechas para calcular el total.
            </p>
          )}

          <button
            type="submit"
            className="btn btn-danger w-100"
            disabled={cargando || noches <= 0}
          >
            {cargando ? "Reservando..." : "Reservar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReservaForm;
