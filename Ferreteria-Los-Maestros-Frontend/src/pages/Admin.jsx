import { Link } from 'react-router-dom'
import AdminSidebar from '../components/organisms/AdminSidebar'

const Admin = () => {
    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <AdminSidebar />

                <main className="col-md-9 col-lg-10 p-4">
                    <h1 className="mb-2">Panel de Administración</h1>
                    <p className="text-muted mb-5">
                        Gestión de productos, usuarios, órdenes, inventario y mensajes de Ferretería Los Maestros.
                    </p>

                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <img src="/img/icons/caja.svg" alt="Productos" className="icono-img mb-3" />
                                    <h3>Productos</h3>
                                    <p className="text-muted">Visualiza y administra los productos disponibles en la tienda.</p>
                                    <Link to="/admin/productos" className="btn btn-primary">Gestionar productos</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <img src="/img/icons/usuarios.svg" alt="Usuarios" className="icono-img mb-3" />
                                    <h3>Usuarios</h3>
                                    <p className="text-muted">Visualiza y administra los usuarios del sistema.</p>
                                    <Link to="/admin/usuarios" className="btn btn-primary">Gestionar usuarios</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <h3>Órdenes</h3>
                                    <p className="text-muted">Revisa las compras y cambia su estado.</p>
                                    <Link to="/admin/ordenes" className="btn btn-primary">Gestionar órdenes</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <h3>Inventario</h3>
                                    <p className="text-muted">Alertas de stock y movimientos de mercadería.</p>
                                    <Link to="/admin/inventario" className="btn btn-primary">Ver inventario</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <h3>Mensajes</h3>
                                    <p className="text-muted">Consultas enviadas desde el formulario de contacto.</p>
                                    <Link to="/admin/mensajes" className="btn btn-primary">Ver mensajes</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Admin
