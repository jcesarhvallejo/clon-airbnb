import { Link, useNavigate } from "react-router-dom";
import { cerrarSesion } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { usuario, perfil, cargandoAuth } = useAuth();

  async function manejarCerrarSesion() {
    try {
      await cerrarSesion();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Airbnb Clone
        </Link>

        <div className="navbar-nav ms-auto align-items-lg-center">
          <Link className="nav-link" to="/">
            Inicio
          </Link>

          {!cargandoAuth && usuario ? (
            <>
              <Link className="nav-link" to="/reservas">
                Mis reservas
              </Link>

              {perfil?.rol_id === 4 && (
                <>
                  <Link className="nav-link" to="/publicar-inmueble">
                    Publicar alojamiento
                  </Link>

                  <Link className="nav-link" to="/mis-inmuebles">
                    Mis alojamientos
                  </Link>
                </>
              )}

              {perfil?.rol_id === 1 && (
                <Link className="nav-link" to="/admin">
                  Administración
                </Link>
              )}

              <span className="navbar-text mx-lg-3">
                Hola, {perfil?.nombre ?? usuario.email}
              </span>

              <button
                type="button"
                className="btn btn-outline-light btn-sm ms-lg-2"
                onClick={manejarCerrarSesion}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            !cargandoAuth && (
              <>
                <Link className="nav-link" to="/login">
                  Login
                </Link>

                <Link className="nav-link" to="/register">
                  Registro
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;