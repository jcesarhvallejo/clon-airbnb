import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    rolId: "2",
    correo: "",
    password: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();

    try {
      setCargando(true);
      setError("");
      setMensaje("");

      const resultado = await registrarUsuario(formulario);

      if (!resultado.session) {
        throw new Error(
          "La cuenta fue creada, pero Supabase todavía exige confirmar el correo. Desactiva 'Confirm email' en Authentication > Providers > Email."
        );
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h3 mb-4">Crear cuenta</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            {mensaje && (
              <div className="alert alert-success">{mensaje}</div>
            )}

            <form onSubmit={manejarSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Cédula</label>
                  <input
                    type="text"
                    name="cedula"
                    className="form-control"
                    value={formulario.cedula}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    className="form-control"
                    value={formulario.telefono}
                    onChange={manejarCambio}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    className="form-control"
                    value={formulario.apellido}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    className="form-control"
                    value={formulario.fechaNacimiento}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Género</label>
                  <select
                    name="genero"
                    className="form-select"
                    value={formulario.genero}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Tipo de cuenta</label>
                <select
                  name="rolId"
                  className="form-select"
                  value={formulario.rolId}
                  onChange={manejarCambio}
                  required
                >
                  <option value="2">Huésped</option>
                  <option value="4">Anfitrión</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  name="correo"
                  className="form-control"
                  value={formulario.correo}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formulario.password}
                  onChange={manejarCambio}
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={cargando}
              >
                {cargando ? "Creando cuenta..." : "Registrarme"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
