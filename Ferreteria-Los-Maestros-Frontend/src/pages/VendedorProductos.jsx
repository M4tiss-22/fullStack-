import { Link } from 'react-router-dom'
import VendedorSidebar from '../components/organisms/VendedorSidebar'
import { obtenerProductos } from '../servicios/tienda'
import { formatearPrecio } from '../utils/validaciones'
import { useCarga } from '../utils/useCarga'

const VendedorProductos = () => {
    const { datos, cargando, error } = useCarga(() => obtenerProductos())
    const productos = datos ?? []

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <VendedorSidebar />

                <main className="col-md-9 col-lg-10 p-4">
                    <h1>Productos</h1>
                    <p className="text-muted">Lista de productos (solo lectura).</p>

                    {cargando && datos === null && <div className="alert alert-info">Cargando productos...</div>}
                    {error !== "" && <div className="alert alert-danger">{error}</div>}

                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle">
                            <thead className="tabla-header-ferreteria">
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.id}>
                                        <td>{producto.codigo}</td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.categoria}</td>
                                        <td>${formatearPrecio(producto.precio)}</td>
                                        <td>{producto.stock}</td>
                                        <td><Link to={'/productos/' + producto.id}>Ver detalle</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default VendedorProductos
