import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    obtenerCarrito, eliminarDelCarrito, vaciarCarrito, obtenerProductos, realizarCompra,
    actualizarCantidadCarrito
} from '../servicios/tienda'
import { formatearPrecio } from '../utils/validaciones'
import { useSesion } from '../context/useSesion'
import { ROL_CLIENTE } from '../utils/roles'
import { useCarga } from '../utils/useCarga'

const CantidadCarrito = ({ producto, cantidad, onCambiar }) => {
    const [texto, setTexto] = useState(String(cantidad))
    const [aviso, setAviso] = useState("")

    useEffect(() => {
        setTexto(String(cantidad))
    }, [cantidad])

    const manejarCambio = (e) => {
        const crudo = e.target.value

        if (crudo === "") {
            setTexto("")
            return
        }

        const valor = Math.floor(Number(crudo))
        if (Number.isNaN(valor)) return

        if (valor > producto.stock) {
            setAviso(`Solo hay ${producto.stock} unidades disponibles`)
            setTexto(String(producto.stock))
            onCambiar(producto.id, producto.stock)
            return
        }

        setAviso("")
        setTexto(String(Math.max(valor, 0)))
        onCambiar(producto.id, valor)
    }

    const manejarBlur = () => {
        if (texto === "") setTexto(String(cantidad))
    }

    return (
        <div className="mb-2">
            <div className="input-group input-group-sm" style={{ maxWidth: "180px" }}>
                <label htmlFor={`carrito-cantidad-${producto.id}`} className="input-group-text">Cantidad</label>
                <input
                    type="number"
                    id={`carrito-cantidad-${producto.id}`}
                    className="form-control"
                    min={0}
                    max={producto.stock}
                    value={texto}
                    onChange={manejarCambio}
                    onBlur={manejarBlur}
                />
            </div>
            {aviso !== "" && <div className="text-danger small">{aviso}</div>}
        </div>
    )
}

const Carrito = () => {
    const [carrito, setCarrito] = useState(() => obtenerCarrito())
    const { datos: catalogo, cargando, error, recargar } = useCarga(() => obtenerProductos())
    const [comprando, setComprando] = useState(false)
    const [avisoSesion, setAvisoSesion] = useState(false)
    const { usuario } = useSesion()
    const [direccion, setDireccion] = useState(usuario?.direccion ?? "")
    const navigate = useNavigate()

    const manejarEliminar = (id) => {
        setCarrito(eliminarDelCarrito(id))
    }

    const manejarCambiarCantidad = (id, cantidad) => {
        const producto = (catalogo ?? []).find((p) => p.id === id)
        setCarrito(actualizarCantidadCarrito(id, cantidad, producto?.stock).carrito)
    }

    const manejarVaciar = () => {
        vaciarCarrito()
        setCarrito([])
    }

    const manejarComprar = async () => {
        if (usuario === null) {
            setAvisoSesion(true)
            return
        }

        setAvisoSesion(false)
        setComprando(true)
        const nombreCompleto = (usuario.nombre + " " + (usuario.apellidos ?? "")).trim()
        const resultado = await realizarCompra({ nombre: nombreCompleto, direccion })
        setComprando(false)

        if (!resultado.ok) {
            alert(resultado.mensaje)
            recargar()
            return
        }

        alert(resultado.mensaje)
        setCarrito([])
        navigate(usuario.rol === ROL_CLIENTE ? '/mis-ordenes' : '/productos')
    }

    const items = []
    let total = 0

    for (const item of carrito) {
        const producto = (catalogo ?? []).find((p) => p.id === item.id)

        if (producto === undefined) {
            continue
        }

        const subtotal = producto.precio * item.cantidad
        total = total + subtotal
        items.push({ producto, cantidad: item.cantidad, subtotal })
    }

    return (
        <main className="container mt-5 mb-5">
            <h1>Carrito de Compras</h1>

            {/* Aviso cuando se intenta comprar sin haber iniciado sesión */}
            {avisoSesion && (
                <div className="alert alert-warning alert-aviso-sesion d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span>Debes iniciar sesión para poder comprar.</span>
                    <Link to="/login" className="btn btn-sm btn-primary">Iniciar sesión</Link>
                </div>
            )}

            {error !== "" && <div className="alert alert-danger">{error}</div>}

            {/* Lista de productos del carrito */}
            <div id="contenedor-carrito">
                {cargando && catalogo === null ? (
                    <div className="alert alert-info">Cargando carrito...</div>
                ) : items.length === 0 ? (
                    <div className="alert alert-info">
                        El carrito está vacío. <Link to="/productos">Ver productos</Link>
                    </div>
                ) : (
                    items.map(({ producto, cantidad, subtotal }) => (
                        <div className="card mb-3" key={producto.id}>
                            <div className="card-body d-flex align-items-center gap-3">
                                <img src={`/img/icons/${producto.icono}`} alt={producto.nombre} className="icono-img" />
                                <div>
                                    <h5>{producto.nombre}</h5>
                                    <p>Precio: ${formatearPrecio(producto.precio)}</p>
                                    <CantidadCarrito producto={producto} cantidad={cantidad} onCambiar={manejarCambiarCantidad} />
                                    <p>Subtotal: ${formatearPrecio(subtotal)}</p>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => manejarEliminar(producto.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Resumen con el total y los botones para vaciar o comprar */}
            <div className="card mt-4 resumen-carrito">
                <div className="card-body">
                    <h3>total: $<span id="total-carrito">{formatearPrecio(total)}</span></h3>

                    {/* La orden necesita una dirección de entrega */}
                    <div className="mb-3">
                        <label htmlFor="carrito-direccion" className="form-label">Dirección de entrega</label>
                        <input type="text" id="carrito-direccion" className="form-control" maxLength={200}
                               placeholder="Calle, número y comuna" value={direccion}
                               onChange={(e) => setDireccion(e.target.value)} />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-danger" onClick={manejarVaciar}>Vaciar Carrito</button>
                        <button className="btn btn-success" onClick={manejarComprar} disabled={items.length === 0 || comprando}>
                            {comprando ? "Procesando..." : "Comprar"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Carrito
