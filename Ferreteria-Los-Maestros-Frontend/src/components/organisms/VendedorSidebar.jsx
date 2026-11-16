import { NavLink } from 'react-router-dom'

const VendedorSidebar = () => {
    const claseLink = ({ isActive }) => 'nav-link admin-link ' + (isActive ? 'admin-link-activo' : '')

    return (
        <aside className="col-md-3 col-lg-2 admin-sidebar p-4">
            <h4 className="mb-4 admin-sidebar-titulo">
                Ferretería<br />Los Maestros
            </h4>
            <h6 className="admin-sidebar-subtitulo">Vendedor</h6>

            <nav className="nav flex-column">
                <NavLink className={claseLink} to="/vendedor" end>Inicio</NavLink>
                <NavLink className={claseLink} to="/vendedor/productos">Productos</NavLink>
                <NavLink className={claseLink} to="/vendedor/ordenes">Órdenes</NavLink>
                <hr />
                <NavLink className="nav-link admin-link" to="/">Volver a la tienda</NavLink>
            </nav>
        </aside>
    )
}

export default VendedorSidebar
