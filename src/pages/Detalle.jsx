import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GaleriaFotos from "../components/GaleriaFotos";
import ReservaForm from "../components/ReservaForm";
import { obtenerInmueblePorId } from "../services/inmuebleService";

function Detalle() {
  const { id } = useParams();

  const [inmueble, setInmueble] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarInmueble() {
      try {
        const datos = await obtenerInmueblePorId(id);
        setInmueble(datos);
      } catch (error) {
        console.error(error);
        setError("No fue posible cargar el alojamiento.");
      } finally {
        setCargando(false);
      }
    }

    cargarInmueble();
  }, [id]);

  if (cargando) {
    return <p className="text-center">Cargando alojamiento...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section>
      <h1 className="mb-3">{inmueble.nombre}</h1>

      <GaleriaFotos fotos={inmueble.foto} />

      <div className="row g-4">
        <div className="col-lg-7">
          <h2>Acerca de este alojamiento</h2>

          <p className="text-muted">{inmueble.descripcion}</p>

          <p className="mt-3">
            Capacidad para {inmueble.huespedes_base} huéspedes.
          </p>
        </div>

        <aside className="col-lg-5">
          <ReservaForm inmueble={inmueble} />
        </aside>
      </div>
    </section>
  );
}

export default Detalle;