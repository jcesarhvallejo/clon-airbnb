import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RecuperarPassword from "../pages/RecuperarPassword";
import Detalle from "../pages/Detalle";
import Reservas from "../pages/Reservas";
import Admin from "../pages/Admin";
import ActualizarPassword from "../pages/ActualizarPassword";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/recuperar-password" element={<RecuperarPassword />} />

          <Route path="/actualizar-password" element={<ActualizarPassword />} />

          <Route path="/detalle/:id" element={<Detalle />} />

          <Route path="/reservas" element={<Reservas />} />

          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
