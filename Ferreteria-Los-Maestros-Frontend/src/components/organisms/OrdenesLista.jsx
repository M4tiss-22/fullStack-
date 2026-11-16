import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { listarOrdenes, obtenerOrden, cambiarEstadoOrden, ESTADOS, SIGUIENTES_ESTADOS } from '../../servicios/ordenes'
import { formatearPrecio } from '../../utils/validaciones'
import { mensajeError } from '../../utils/errores'
import { useCarga } from '../../utils/useCarga'

const etiqueta = (estado) => estado.replaceAll('_', ' ')

const colorEstado = (estado) => {
    if (estado === 'ENTREGADA') return 'success'
    if (estado === 'CANCELADA') return 'danger'
    if (estado === 'PENDIENTE') return 'warning'
    return 'primary'
}

const OrdenesLista = ({ puedeCambiarEstado = false }) => {
    const [filtro, setFiltro] = useState('')
    const { datos, cargando, error, recargar } = useCarga(() => listarOrdenes(filtro), [filtro])
    const [detalle, setDetalle] = useState(null)
    const [errorDetalle, setErrorDetalle] = useState('')

    const ordenes = datos ?? []

    const verDetalle = async (id) => {
        try {
            setErrorDetalle('')
            setDetalle(await obtenerOrden(id))
        } catch (e) {
            alert(mensajeError(e))
        }
    }

    const cambiarEstado = async (nuevoEstado) => {
        try {
            setErrorDetalle('')
            setDetalle(await cambiarEstadoOrden(detalle.id, nuevoEstado))
            recargar()
        } catch (e) {
            setErrorDetalle(mensajeError(e))
        }
    }

    return (
        <>
            <div className="mb-3 d-flex align-items-center gap-2" style={{ maxWidth: '320px' }}>
                <label htmlFor="filtro-estado" className="form-label mb-0">Estado:</label>
                <select id="filtro-estado" className="form-select form-select-sm" value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}>
                    <option value="">Todos</option>
                    {ESTADOS.map((estado) => (
                        <option key={estado} value={estado}>{etiqueta(estado)}</option>
                    ))}
                </select>
            </div>

            {error !== '' && <div className="alert alert-danger">{error}</div>}
            {cargando && datos === null && <div className="alert alert-info">Cargando órdenes...</div>}
            {!cargando && error === '' && ordenes.length === 0 && (
                <div className="alert alert-info">No hay órdenes para mostrar.</div>
            )}

            {ordenes.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle">
                        <thead className="tabla-header-ferreteria">
                            <tr>
                                <th>N°</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Unidades</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenes.map((orden) => (
                                <tr key={orden.id}>
                                    <td>{orden.id}</td>
                                    <td>{new Date(orden.fecha).toLocaleString('es-CL')}</td>
                                    <td>{orden.clienteNombre}<br /><small className="text-muted">{orden.clienteCorreo}</small></td>
                                    <td>{orden.cantidadUnidades}</td>
                                    <td>${formatearPrecio(orden.total)}</td>
                                    <td><span className={'badge bg-' + colorEstado(orden.estado)}>{etiqueta(orden.estado)}</span></td>
                                    <td>
                                        <button type="button" className="btn btn-sm btn-outline-primary"
                                                onClick={() => verDetalle(orden.id)}>
                                            Ver detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detalle de la orden (boleta) */}
            <Modal show={detalle !== null} onHide={() => setDetalle(null)} size="lg" centered>
                {detalle !== null && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>Orden N° {detalle.id}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="mb-1"><strong>Cliente:</strong> {detalle.clienteNombre} ({detalle.clienteCorreo})</p>
                            <p className="mb-1"><strong>Dirección de entrega:</strong> {detalle.direccionEntrega}</p>
                            <p><strong>Fecha:</strong> {new Date(detalle.fecha).toLocaleString('es-CL')} &nbsp;
                                <span className={'badge bg-' + colorEstado(detalle.estado)}>{etiqueta(detalle.estado)}</span>
                            </p>

                            <table className="table table-sm">
                                <thead>
                                    <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr>
                                </thead>
                                <tbody>
                                    {detalle.detalles.map((d) => (
                                        <tr key={d.id ?? d.productoId}>
                                            <td>{d.productoNombre}</td>
                                            <td>{d.cantidad}</td>
                                            <td>${formatearPrecio(d.precioUnitario)}</td>
                                            <td>${formatearPrecio(d.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <h5 className="text-end">Total: ${formatearPrecio(detalle.total)}</h5>

                            {errorDetalle !== '' && <div className="alert alert-danger mt-3 mb-0">{errorDetalle}</div>}

                            {puedeCambiarEstado && SIGUIENTES_ESTADOS[detalle.estado].length > 0 && (
                                <div className="mt-3">
                                    <strong>Cambiar estado a:</strong>
                                    <div className="d-flex gap-2 flex-wrap mt-2">
                                        {SIGUIENTES_ESTADOS[detalle.estado].map((estado) => (
                                            <button key={estado} type="button"
                                                    className={'btn btn-sm btn-' + (estado === 'CANCELADA' ? 'outline-danger' : 'primary')}
                                                    onClick={() => cambiarEstado(estado)}>
                                                {etiqueta(estado)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                    </>
                )}
            </Modal>
        </>
    )
}

export default OrdenesLista
