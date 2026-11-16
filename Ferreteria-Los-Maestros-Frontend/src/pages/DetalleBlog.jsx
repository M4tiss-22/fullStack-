import { Link, useParams } from 'react-router-dom'
import { obtenerArticulo } from '../servicios/contenido'
import { useCarga } from '../utils/useCarga'

const DetalleBlog = () => {
    const { id } = useParams()
    const { datos: articulo, cargando, error } = useCarga(() => obtenerArticulo(id), [id])

    return (
        <main className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <Link to="/blog" className="btn btn-outline-secondary mb-4">← Volver al Blog</Link>

                    {cargando && articulo === null && error === '' && <div className="alert alert-info">Cargando artículo...</div>}
                    {error !== '' && <div className="alert alert-danger">{error}</div>}

                    {articulo !== null && (
                        <>
                            <h1 className="mb-4">{articulo.titulo}</h1>
                            <img src={articulo.imagen} className="img-fluid rounded mb-4" alt={articulo.imagenAlt} />
                            {articulo.parrafos.map((parrafo, i) => (
                                <p key={i}>{parrafo}</p>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}

export default DetalleBlog
