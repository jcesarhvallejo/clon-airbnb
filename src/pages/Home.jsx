import { useEffect, useState } from "react";
import CardInmueble from "../components/CardInmueble";
import { obtenerInmuebles } from "../services/inmuebleService";

function Home() {
  const [inmuebles, setInmuebles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarInmuebles() {
      try {
        const datos = await obtenerInmuebles();
        setInmuebles(datos);
      } catch (error) {
        console.error(error);
        setError("No fue posible cargar los alojamientos.");
      } finally {
        setCargando(false);
      }
    }

    cargarInmuebles();
  }, []);

  if (cargando) {
    return <p className="text-center">Cargando alojamientos...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <section className="mb-5">
        <h1 className="mb-3 text-dark">Encuentra tu próximo alojamiento</h1>
        <p className="text-muted">
          Descubre espacios únicos para tu próxima estadía.
        </p>
      </section>

      {inmuebles.length === 0 ? (
        <div className="alert alert-info">
          Aún no hay alojamientos disponibles.
        </div>
      ) : (
        <section className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {inmuebles.map((inmueble) => (
            <CardInmueble
              key={inmueble.id_inmueble}
              inmueble={inmueble}
            />
          ))}
        </section>
      )}
    </>
  );
}

export default Home;