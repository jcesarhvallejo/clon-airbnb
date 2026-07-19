import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  actualizarInmueble,
  obtenerInmueblePorId,
} from "../services/inmuebleService";

function EditarInmueble() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precioBase: "",
    huespedesBase: "",
  });

  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarInmueble() {
      try {
        const inmueble = await obtenerInmueblePorId(id);

        setFormulario({
          nombre: inmueble.nombre,
          descripcion: inmueble.descripcion,
          precioBase: inmueble.precio_base,
          huespedesBase: inmueble.huespedes_base,
        });
      } catch (error) {
        console.error(error);
        setError("No fue posible cargar el alojamiento.");
      } finally {
        setCargandoDatos(false);
      }
    }

    cargarInmueble();
  }, [id]);

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
      setGuardando(true);
      setError("");

      await actualizarInmueble(id, {
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        precioBase: Number(formulario.precioBase),
        huespedesBase: Number(formulario.huespedesBase),
      });

      navigate("/mis-inmuebles");
    } catch (error) {
      console.error(error);
      setError(
        "No fue posible actualizar el alojamiento. Verifica que seas su anfitrión."
      );
    } finally {
      setGuardando(false);
    }
  }

  if (cargandoDatos) {
    return <p className="text-center">Cargando alojamiento...</p>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h3 mb-4">Editar alojamiento</h1>

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
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label">Precio por noche</label>

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

                <div className="col-md-6 mb-4">
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

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando cambios..."
                    : "Guardar cambios"}
                </button>

                <Link
                  to="/mis-inmuebles"
                  className="btn btn-outline-secondary"
                >
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

export default EditarInmueble;