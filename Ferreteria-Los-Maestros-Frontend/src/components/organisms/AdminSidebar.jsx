import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {
    const claseLink = ({ isActive }) => 'nav-link admin-link ' + (isActive ? 'admin-link-activo' : '')

    return (
        <aside className="col-md-3 col-lg-2 admin-sidebar p-4">
            <h4 className="mb-4 admin-sidebar-titulo">
                Ferretería<br />Los Maestros
            </h4>
            <h6 className="admin-sidebar-subtitulo">Administración</h6>

            <nav className="nav flex-column">
                <NavLink className={claseLink} to="/admin" end>Inicio</NavLink>
                <NavLink className={claseLink} to="/admin/productos">Productos</NavLink>
                <NavLink className={claseLink} to="/admin/usuarios">Usuarios</NavLink>
                <NavLink className={claseLink} to="/admin/ordenes">Órdenes</NavLink>
                <NavLink className={claseLink} to="/admin/inventario">Inventario</NavLink>
                <NavLink className={claseLink} to="/admin/mensajes">Mensajes</NavLink>
                <hr />
                <NavLink className="nav-link admin-link" to="/">Volver a la tienda</NavLink>
            </nav>
        </aside>
    )
}

export default AdminSidebar
