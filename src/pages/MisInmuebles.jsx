import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  eliminarInmueble,
  obtenerInmueblesAnfitrion,
} from "../services/inmuebleService";

function MisInmuebles() {
  const { perfil, cargandoAuth } = useAuth();

  const [inmuebles, setInmuebles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!perfil) {
      return undefined;
    }

    let activo = true;

    obtenerInmueblesAnfitrion(perfil.id_usuario)
      .then((datos) => {
        if (activo) setInmuebles(datos);
      })
      .catch((error) => {
        console.error(error);
        if (activo) setError("No fue posible cargar tus alojamientos.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [perfil]);

  async function manejarEliminar(idInmueble) {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este alojamiento? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    try {
      await eliminarInmueble(idInmueble);

      setInmuebles((actuales) =>
        actuales.filter(
          (inmueble) => inmueble.id_inmueble !== idInmueble
        )
      );
    } catch (error) {
      console.error(error);
      setError(
        "No fue posible eliminar el alojamiento. Puede tener reservas asociadas."
      );
    }
  }

  if (cargandoAuth || cargando) {
    return <p className="text-center">Cargando alojamientos...</p>;
  }

  if (!perfil) {
    return (
      <div className="alert alert-warning">
        No se pudo cargar tu perfil de anfitrión.
      </div>
    );
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Mis alojamientos</h1>

        <Link to="/publicar-inmueble" className="btn btn-danger">
          Publicar alojamiento
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {inmuebles.length === 0 ? (
        <div className="alert alert-info">
          Aún no has publicado alojamientos.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {inmuebles.map((inmueble) => {
            const fotos = [...(inmueble.foto ?? [])].sort(
              (a, b) => a.imagen_orden - b.imagen_orden
            );

            const imagenPrincipal = fotos[0]?.imagen_url;

            return (
              <div className="col" key={inmueble.id_inmueble}>
                <div className="card h-100 shadow-sm">
                  {imagenPrincipal ? (
                    <img
                      src={imagenPrincipal}
                      alt={inmueble.nombre}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{ height: "200px" }}
                    >
                      Sin imagen
                    </div>
                  )}

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{inmueble.nombre}</h5>

                    <p className="text-muted">
                      {inmueble.descripcion}
                    </p>

                    <p>
                      Hasta {inmueble.huespedes_base} huéspedes
                    </p>

                    <p className="fw-bold mt-auto">
                      {Number(inmueble.precio_base).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      })}{" "}
                      por noche
                    </p>

                    <div className="d-flex gap-2">
                      <Link
                        to={`/editar-inmueble/${inmueble.id_inmueble}`}
                        className="btn btn-outline-primary w-100"
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        className="btn btn-outline-danger w-100"
                        onClick={() =>
                          manejarEliminar(inmueble.id_inmueble)
                        }
                      >
                        Eliminar
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

export default MisInmuebles;
