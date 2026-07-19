import { Link } from "react-router-dom";

function CardInmueble({ inmueble }) {
  const fotosOrdenadas = [...(inmueble.foto ?? [])].sort(
    (a, b) => a.imagen_orden - b.imagen_orden
  );

  const carruselId = `carrusel-inmueble-${inmueble.id_inmueble}`;

  return (
    <div className="col">
      <div className="card h-100 shadow-sm">
        {fotosOrdenadas.length > 0 ? (
          <div id={carruselId} className="carousel slide">
            <div className="carousel-inner">
              {fotosOrdenadas.map((foto, index) => (
                <div
                  key={`${foto.imagen_url}-${index}`}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={foto.imagen_url}
                    className="d-block w-100"
                    alt={`${inmueble.nombre} - foto ${index + 1}`}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>

            {fotosOrdenadas.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target={`#${carruselId}`}
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" />
                  <span className="visually-hidden">Anterior</span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target={`#${carruselId}`}
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" />
                  <span className="visually-hidden">Siguiente</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <div
            className="bg-light d-flex align-items-center justify-content-center"
            style={{ height: "220px" }}
          >
            Sin imagen
          </div>
        )}

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{inmueble.nombre}</h5>

          <p className="card-text text-muted">
            {inmueble.descripcion}
          </p>

          <p className="mb-2">
            Hasta {inmueble.huespedes_base} huéspedes
          </p>

          <p className="fw-bold mt-auto">
            {(inmueble.precio_base).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            })}{" "}
            por noche
          </p>

          <Link
            to={`/detalle/${inmueble.id_inmueble}`}
            className="btn btn-danger"
          >
            Ver alojamiento
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CardInmueble;