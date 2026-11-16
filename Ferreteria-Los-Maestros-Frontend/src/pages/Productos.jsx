import { Link, useSearchParams } from 'react-router-dom'
import ProductoCard from '../components/molecules/ProductoCard'
import { obtenerProductos } from '../servicios/tienda'
import { useCarga } from '../utils/useCarga'
const Productos = () => {
    const [parametros] = useSearchParams()
    const categoriaFiltro = parametros.get("categoria")
    const { datos, cargando, error } = useCarga(() => obtenerProductos())
    const productos = datos ?? []
    const productosAMostrar = productos.filter(
        (p) => categoriaFiltro === null || p.categoriaSlug.toLowerCase() === categoriaFiltro.toLowerCase()
    )

    let tituloCategoria = null
    if (categoriaFiltro !== null && datos !== null) {
        tituloCategoria = productosAMostrar.length > 0
            ? <>Mostrando: {productosAMostrar[0].categoria} — <Link to="/productos">Ver todos los productos</Link></>
            : <>No hay productos en esa categoría. <Link to="/productos">Ver todos los productos</Link></>
    }

    return (
        <div className="container mt-5 mb-5">
            <h1 className="mb-1">Catálogo de Productos</h1>
            <p className="text-body-secondary mb-4">{tituloCategoria}</p>

            {cargando && datos === null && <div className="alert alert-info">Cargando productos...</div>}
            {error !== "" && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {productosAMostrar.map((producto) => (
                    <ProductoCard key={producto.id} producto={producto} />
                ))}
            </div>
        </div>
    )
}

export default Productos
