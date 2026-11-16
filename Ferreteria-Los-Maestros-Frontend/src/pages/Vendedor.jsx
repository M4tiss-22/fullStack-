import { Link } from 'react-router-dom'
import VendedorSidebar from '../components/organisms/VendedorSidebar'
import { useSesion } from '../context/useSesion'

const Vendedor = () => {
    const { usuario } = useSesion()

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <VendedorSidebar />

                <main className="col-md-9 col-lg-10 p-4">
                    <h1 className="mb-2">Panel del Vendedor</h1>
                    <p className="text-muted mb-5">
                        Hola, {usuario.nombre}. Desde aquí puedes consultar los productos y las órdenes.
                    </p>

                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <h3>Productos</h3>
                                    <p className="text-muted">Lista de productos y su detalle (solo lectura).</p>
                                    <Link to="/vendedor/productos" className="btn btn-primary">Ver productos</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <h3>Órdenes</h3>
                                    <p className="text-muted">Lista de órdenes y su detalle (solo lectura).</p>
                                    <Link to="/vendedor/ordenes" className="btn btn-primary">Ver órdenes</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Vendedor
