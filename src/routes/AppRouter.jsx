import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RecuperarPassword from "../pages/RecuperarPassword";
import ActualizarPassword from "../pages/ActualizarPassword";
import Detalle from "../pages/Detalle";
import Reservas from "../pages/Reservas";
import EditarReserva from "../pages/EditarReserva";
import Admin from "../pages/Admin";
import PublicarInmueble from "../pages/PublicarInmueble";
import MisInmuebles from "../pages/MisInmuebles";
import EditarInmueble from "../pages/EditarInmueble";
import NotFound from "../pages/NotFound";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/recuperar-password"
            element={<RecuperarPassword />}
          />

          <Route
            path="/actualizar-password"
            element={<ActualizarPassword />}
          />

          <Route path="/detalle/:id" element={<Detalle />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/reservas" element={<Reservas />} />

            <Route
              path="/editar-reserva/:id"
              element={<EditarReserva />}
            />
          </Route>

          <Route element={<ProtectedRoute rolesPermitidos={[4]} />}>
            <Route
              path="/publicar-inmueble"
              element={<PublicarInmueble />}
            />

            <Route
              path="/mis-inmuebles"
              element={<MisInmuebles />}
            />

            <Route
              path="/editar-inmueble/:id"
              element={<EditarInmueble />}
            />
          </Route>

          <Route element={<ProtectedRoute rolesPermitidos={[1]} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
