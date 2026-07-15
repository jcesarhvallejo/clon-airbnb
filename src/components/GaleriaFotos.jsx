import { useState } from "react";

function GaleriaFotos({ fotos }) {
  const fotosOrdenadas = [...(fotos ?? [])].sort(
    (a, b) => a.imagen_orden - b.imagen_orden
  );

  const [imagenActiva, setImagenActiva] = useState(
    fotosOrdenadas[0]?.imagen_url
  );

  if (fotosOrdenadas.length === 0) {
    return (
      <div
        className="bg-light d-flex align-items-center justify-content-center rounded"
        style={{ height: "400px" }}
      >
        Este alojamiento no tiene fotos.
      </div>
    );
  }

  return (
    <section className="mb-4">
      <img
        src={imagenActiva}
        alt="Vista del alojamiento"
        className="img-fluid rounded w-100 mb-3"
        style={{ height: "420px", objectFit: "cover" }}
      />

      <div className="d-flex gap-2 flex-wrap">
        {fotosOrdenadas.map((foto) => (
          <button
            key={foto.imagen_url}
            type="button"
            className="border-0 bg-transparent p-0"
            onClick={() => setImagenActiva(foto.imagen_url)}
          >
            <img
              src={foto.imagen_url}
              alt="Miniatura del alojamiento"
              className={`rounded ${
                imagenActiva === foto.imagen_url
                  ? "border border-danger border-3"
                  : ""
              }`}
              style={{
                width: "100px",
                height: "70px",
                objectFit: "cover",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default GaleriaFotos;