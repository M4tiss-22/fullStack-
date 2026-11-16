import { useState } from 'react'
import AdminSidebar from '../components/organisms/AdminSidebar'
import { listarAlertas, listarMovimientos, registrarMovimiento } from '../servicios/inventario'
import { listarProductos } from '../servicios/productos'
import { mensajeError } from '../utils/errores'
import { useCarga } from '../utils/useCarga'

const formularioVacio = { productoId: '', tipo: 'ENTRADA', cantidad: '1', motivo: '' }

const AdminInventario = () => {
    const alertas = useCarga(() => listarAlertas())
    const movimientos = useCarga(() => listarMovimientos())
    const productos = useCarga(() => listarProductos())
    const [datos, setDatos] = useState(formularioVacio)
    const [error, setError] = useState('')
    const [enviando, setEnviando] = useState(false)

    const manejarCambio = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

    const manejarEnvio = async (e) => {
        e.preventDefault()
        setError('')

        if (datos.productoId === '') {
            setError('Elige un producto')
            return
        }

        setEnviando(true)

        try {
            await registrarMovimiento({
                productoId: Number(datos.productoId),
                tipo: datos.tipo,
                cantidad: Number(datos.cantidad),
                motivo: datos.motivo.trim() === '' ? null : datos.motivo.trim()
            })
            setDatos(formularioVacio)
            alertas.recargar()
            movimientos.recargar()
            productos.recargar()
        } catch (e2) {
            setError(mensajeError(e2))
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <AdminSidebar />

                <main className="col-md-9 col-lg-10 p-4">
                    <h1>Inventario</h1>
                    <p className="text-muted">Control de stock: alertas, entradas y salidas de mercadería.</p>

                    {/* Alertas de stock crítico */}
                    <h4 className="mt-4">Alertas de stock crítico</h4>
                    {alertas.error !== '' && <div className="alert alert-danger">{alertas.error}</div>}
                    {alertas.datos !== null && alertas.datos.length === 0 && (
                        <div className="alert alert-success">Todos los productos tienen stock suficiente.</div>
                    )}
                    {alertas.datos !== null && alertas.datos.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle">
                                <thead className="tabla-header-ferreteria">
                                    <tr><th>Código</th><th>Producto</th><th>Stock</th><th>Stock crítico</th><th>Nivel</th></tr>
                                </thead>
                                <tbody>
                                    {alertas.datos.map((a) => (
                                        <tr key={a.productoId}>
                                            <td>{a.codigo}</td>
                                            <td>{a.nombre}</td>
                                            <td>{a.stock}</td>
                                            <td>{a.stockCritico}</td>
                                            <td><span className={'badge bg-' + (a.stock === 0 ? 'danger' : 'warning')}>{a.nivel}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Registrar un movimiento */}
                    <h4 className="mt-4">Registrar movimiento</h4>
                    <div className="card mb-4">
                        <div className="card-body">
                            <form onSubmit={manejarEnvio} noValidate>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="inv-producto" className="form-label">Producto</label>
                                        <select id="inv-producto" name="productoId" className="form-select"
                                                value={datos.productoId} onChange={manejarCambio}>
                                            <option value="">Selecciona...</option>
                                            {(productos.datos ?? []).map((p) => (
                                                <option key={p.id} value={p.id}>{p.nombre} (stock {p.stock})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="inv-tipo" className="form-label">Tipo</label>
                                        <select id="inv-tipo" name="tipo" className="form-select"
                                                value={datos.tipo} onChange={manejarCambio}>
                                            <option value="ENTRADA">Entrada</option>
                                            <option value="SALIDA">Salida</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="inv-cantidad" className="form-label">Cantidad</label>
                                        <input id="inv-cantidad" name="cantidad" type="number" min={1} className="form-control"
                                               value={datos.cantidad} onChange={manejarCambio} />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="inv-motivo" className="form-label">Motivo (opcional)</label>
                                        <input id="inv-motivo" name="motivo" type="text" maxLength={200} className="form-control"
                                               value={datos.motivo} onChange={manejarCambio} />
                                    </div>
                                </div>

                                {error !== '' && <div className="alert alert-danger">{error}</div>}

                                <button type="submit" className="btn btn-primary" disabled={enviando}>
                                    {enviando ? 'Registrando...' : 'Registrar movimiento'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Historial */}
                    <h4>Historial de movimientos</h4>
                    {movimientos.error !== '' && <div className="alert alert-danger">{movimientos.error}</div>}
                    {movimientos.datos !== null && movimientos.datos.length === 0 && (
                        <div className="alert alert-info">Aún no hay movimientos.</div>
                    )}
                    {movimientos.datos !== null && movimientos.datos.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered align-middle">
                                <thead className="tabla-header-ferreteria">
                                    <tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Stock resultante</th><th>Motivo</th></tr>
                                </thead>
                                <tbody>
                                    {movimientos.datos.map((m) => (
                                        <tr key={m.id}>
                                            <td>{new Date(m.fecha).toLocaleString('es-CL')}</td>
                                            <td>{m.productoNombre}</td>
                                            <td>{m.tipo}</td>
                                            <td>{m.cantidad}</td>
                                            <td>{m.stockResultante}</td>
                                            <td>{m.motivo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default AdminInventario
