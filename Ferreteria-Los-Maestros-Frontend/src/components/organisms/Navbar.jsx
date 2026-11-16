import { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useSesion } from '../../context/useSesion'
import { obtenerCantidadCarrito, suscribirCarrito } from '../../servicios/tienda'
import { ROL_ADMIN, ROL_VENDEDOR, ROL_CLIENTE } from '../../utils/roles'

const NavigationBar = () => {
    const { usuario, cerrarSesion } = useSesion()
    const navigate = useNavigate()
    const [cantidadCarrito, setCantidadCarrito] = useState(() => obtenerCantidadCarrito())

    useEffect(() => {
        const actualizar = () => setCantidadCarrito(obtenerCantidadCarrito())
        return suscribirCarrito(actualizar)
    }, [])

    const manejarCerrarSesion = () => {
        cerrarSesion()
        navigate('/')
    }

    return (
        <Navbar bg="light" expand="lg" className="navbar-light">
            <Container>
                <Navbar.Brand as={Link} to="/">Ferretería Los Maestros</Navbar.Brand>

                {/* Botón hamburguesa (solo se ve en pantallas chicas) */}
                <Navbar.Toggle aria-controls="navbarNav" />
                <Navbar.Collapse id="navbarNav">
                    <Nav className="ms-auto align-items-lg-center">
                        {/* NavLink marca como activa la página en la que estás */}
                        <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
                        <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
                        <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
                        <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
                        <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
                        <Nav.Link as={NavLink} to="/carrito">
                            Carrito
                            {cantidadCarrito > 0 && <span className="badge-carrito ms-1">{cantidadCarrito}</span>}
                        </Nav.Link>

                        {usuario === null ? (
                            <>
                                {/* Sin sesión: botones para iniciar sesión o registrarse */}
                                <Nav.Item className="ms-lg-2">
                                    <Button variant="outline-primary" size="sm" as={Link} to="/login">
                                        Iniciar Sesión
                                    </Button>
                                </Nav.Item>
                                <Nav.Item className="ms-lg-2 mt-2 mt-lg-0">
                                    <Button variant="primary" size="sm" as={Link} to="/registro">
                                        Registrarse
                                    </Button>
                                </Nav.Item>
                            </>
                        ) : (
                            <>
                                {/* Con sesión: saludo, acceso al panel según el rol y botón para cerrar sesión */}
                                {usuario.rol === ROL_CLIENTE && (
                                    <Nav.Item className="ms-lg-2 mt-2 mt-lg-0">
                                        <Button variant="outline-secondary" size="sm" as={Link} to="/mis-ordenes">
                                            Mis órdenes
                                        </Button>
                                    </Nav.Item>
                                )}
                                {usuario.rol === ROL_VENDEDOR && (
                                    <Nav.Item className="ms-lg-2 mt-2 mt-lg-0">
                                        <Button variant="outline-secondary" size="sm" as={Link} to="/vendedor">
                                            Panel vendedor
                                        </Button>
                                    </Nav.Item>
                                )}
                                {usuario.rol === ROL_ADMIN && (
                                    <Nav.Item className="ms-lg-2 mt-2 mt-lg-0">
                                        <Button variant="outline-secondary" size="sm" as={Link} to="/admin">
                                            Panel admin
                                        </Button>
                                    </Nav.Item>
                                )}
                                <Nav.Item className="ms-lg-3">
                                    <span className="fw-bold">Hola, {usuario.nombre}</span>
                                </Nav.Item>
                                <Nav.Item className="ms-lg-2 mt-2 mt-lg-0">
                                    <Button variant="outline-secondary" size="sm" onClick={manejarCerrarSesion}>
                                        Cerrar sesión
                                    </Button>
                                </Nav.Item>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar
