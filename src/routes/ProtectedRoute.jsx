import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ rolesPermitidos }) {
  const { usuario, perfil, cargandoAuth } = useAuth();

  if (cargandoAuth) {
    return <p className="text-center mt-4">Verificando sesión...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (
    rolesPermitidos &&
    !rolesPermitidos.includes(perfil?.rol_id)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
