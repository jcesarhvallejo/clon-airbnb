import { useState } from "react";
import { solicitarRecuperacion } from "../services/authService";

function RecuperarPassword() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(evento) {
    evento.preventDefault();

    try {
      setCargando(true);
      setError("");
      setMensaje("");

      await solicitarRecuperacion(correo);

      setMensaje(
        "Si el correo existe, recibirás un enlace para restablecer tu contraseña."
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h3 mb-3">Recuperar contraseña</h1>

            <p className="text-muted mb-4">
              Escribe tu correo y te enviaremos un enlace.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            {mensaje && (
              <div className="alert alert-success">{mensaje}</div>
            )}

            <form onSubmit={manejarSubmit}>
              <div className="mb-4">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  value={correo}
                  onChange={(evento) => setCorreo(evento.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={cargando}
              >
                {cargando ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecuperarPassword;