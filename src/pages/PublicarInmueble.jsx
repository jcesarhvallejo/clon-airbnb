import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  crearInmueble,
  subirFotosInmueble,
} from "../services/inmuebleService";

function PublicarInmueble() {
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precioBase: "",
    huespedesBase: "",
  });

  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  function manejarFotos(evento) {
    setArchivos(Array.from(evento.target.files));
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();

    if (archivos.length === 0) {
      setError("Selecciona al menos una foto del alojamiento.");
      return;
    }

    try {
      setCargando(true);
      setError("");

      const inmuebleCreado = await crearInmueble({
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        precioBase: Number(formulario.precioBase),
        huespedesBase: Number(formulario.huespedesBase),
        anfitrionId: perfil.id_usuario,
      });

      await subirFotosInmueble(
        inmuebleCreado.id_inmueble,
        archivos
      );

      navigate(`/detalle/${inmuebleCreado.id_inmueble}`);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h3 mb-4">Publicar alojamiento</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={manejarSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre del alojamiento</label>

                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  placeholder="Ejemplo: Apartamento con vista al mar"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>

                <textarea
                  name="descripcion"
                  className="form-control"
                  rows="5"
                  value={formulario.descripcion}
                  onChange={manejarCambio}
                  placeholder="Describe el alojamiento, ubicación y servicios."
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Precio por noche
                  </label>

                  <input
                    type="number"
                    name="precioBase"
                    className="form-control"
                    value={formulario.precioBase}
                    onChange={manejarCambio}
                    min="1"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Máximo de huéspedes
                  </label>

                  <input
                    type="number"
                    name="huespedesBase"
                    className="form-control"
                    value={formulario.huespedesBase}
                    onChange={manejarCambio}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Fotos del alojamiento
                </label>

                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={manejarFotos}
                  required
                />

                {archivos.length > 0 && (
                  <small className="text-muted">
                    {archivos.length} foto(s) seleccionada(s).
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={cargando}
              >
                {cargando
                  ? "Publicando alojamiento..."
                  : "Publicar alojamiento"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicarInmueble;
