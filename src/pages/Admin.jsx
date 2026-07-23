function Admin() {
  return (
    <section>
      <h1>Panel de administración</h1>
      <p className="text-muted">
        Desde aquí podrás gestionar usuarios, alojamientos y reservas.
      </p>

      <div className="row g-4 mt-2">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5">Usuarios</h2>
              <p className="text-muted mb-0">
                Gestión de cuentas y roles.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5">Alojamientos</h2>
              <p className="text-muted mb-0">
                Revisión de publicaciones.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5">Reservas</h2>
              <p className="text-muted mb-0">
                Consulta de reservas del sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Admin;
