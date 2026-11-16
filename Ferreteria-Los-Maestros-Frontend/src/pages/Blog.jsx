import { Link } from 'react-router-dom'
import { listarArticulos } from '../servicios/contenido'
import { useCarga } from '../utils/useCarga'

const Blog = () => {
    const { datos: articulos, cargando, error } = useCarga(() => listarArticulos())

    return (
        <>
            <div className="hero-ferreteria mb-5">
                <div className="container py-5 text-center">
                    <h1 className="display-5 fw-bold">Blog Ferretería Los Maestros</h1>
                    <p className="fs-5">Descubre consejos, datos útiles y recomendaciones para tus proyectos</p>
                </div>
            </div>

            <main className="container mb-5">
                {error !== '' && <div className="alert alert-danger">{error}</div>}
                {cargando && articulos === null && <div className="alert alert-info">Cargando artículos...</div>}

                <div className="row">
                    {(articulos ?? []).map((articulo) => (
                        <div className="col-md-6 mb-4" key={articulo.id}>
                            <div className="card h-100">
                                <img src={articulo.imagen} className="card-img-top" alt={articulo.imagenAlt} />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{articulo.titulo}</h5>
                                    <p className="card-text">{articulo.resumen}</p>
                                    <Link to={`/blog/${articulo.id}`} className="btn btn-primary mt-auto">Leer más</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}

export default Blog
