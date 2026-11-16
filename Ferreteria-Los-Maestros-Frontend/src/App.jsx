import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'

import NavigationBar from './components/organisms/Navbar'
import Footer from './components/organisms/Footer'
import { useSesion } from './context/useSesion'

import Home from './pages/Home'
import Nosotros from './pages/Nosotros'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Contacto from './pages/Contacto'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Carrito from './pages/Carrito'
import Blog from './pages/Blog'
import DetalleBlog from './pages/DetalleBlog'

import Admin from './pages/Admin'
import AdminProductos from './pages/AdminProductos'
import AdminUsuarios from './pages/AdminUsuarios'
import AdminOrdenes from './pages/AdminOrdenes'
import AdminInventario from './pages/AdminInventario'
import AdminMensajes from './pages/AdminMensajes'

import MisOrdenes from './pages/MisOrdenes'

import Vendedor from './pages/Vendedor'
import VendedorProductos from './pages/VendedorProductos'
import VendedorOrdenes from './pages/VendedorOrdenes'
import { ROL_ADMIN, ROL_VENDEDOR, ROL_CLIENTE } from './utils/roles'

const PublicLayout = () => {
    return (
        <>
            <NavigationBar />
            <Outlet />
            <Footer />
        </>
    )
}

const RutaProtegida = ({ roles }) => {
    const { usuario } = useSesion()

    if (usuario === null) {
        return <Navigate to="/login" replace />
    }

    if (!roles.includes(usuario.rol)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Páginas de la tienda (con menú y footer) */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/productos/:id" element={<DetalleProducto />} />
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<DetalleBlog />} />

                    {/* Historial de compras: solo clientes con sesión */}
                    <Route element={<RutaProtegida roles={[ROL_CLIENTE]} />}>
                        <Route path="/mis-ordenes" element={<MisOrdenes />} />
                    </Route>
                </Route>

                {/* Panel de administración (acceso total): solo administradores */}
                <Route element={<RutaProtegida roles={[ROL_ADMIN]} />}>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/productos" element={<AdminProductos />} />
                    <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                    <Route path="/admin/ordenes" element={<AdminOrdenes />} />
                    <Route path="/admin/inventario" element={<AdminInventario />} />
                    <Route path="/admin/mensajes" element={<AdminMensajes />} />
                </Route>

                {/* Panel del vendedor (solo ver productos y órdenes): vendedores y administradores */}
                <Route element={<RutaProtegida roles={[ROL_VENDEDOR, ROL_ADMIN]} />}>
                    <Route path="/vendedor" element={<Vendedor />} />
                    <Route path="/vendedor/productos" element={<VendedorProductos />} />
                    <Route path="/vendedor/ordenes" element={<VendedorOrdenes />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
