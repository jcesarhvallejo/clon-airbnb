import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { actualizarPassword } from "../services/authService";

function ActualizarPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(evento) {
    evento.preventDefault();

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);
      setError("");

      await actualizarPassword(password);

      navigate("/login");
    } catch (error) {
      console.error(error);
      setError(
        "No fue posible actualizar la contraseña. Solicita un enlace nuevo."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h3 mb-4">Crear nueva contraseña</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={manejarSubmit}>
              <div className="mb-3">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(evento) => setPassword(evento.target.value)}
                  minLength="6"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmarPassword}
                  onChange={(evento) =>
                    setConfirmarPassword(evento.target.value)
                  }
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={cargando}
              >
                {cargando
                  ? "Actualizando..."
                  : "Actualizar contraseña"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActualizarPassword;