import AdminSidebar from '../components/organisms/AdminSidebar'
import { listarMensajes, marcarMensajeLeido, eliminarMensaje } from '../servicios/contenido'
import { mensajeError } from '../utils/errores'
import { useCarga } from '../utils/useCarga'

const AdminMensajes = () => {
    const { datos, cargando, error, recargar } = useCarga(() => listarMensajes())
    const mensajes = datos ?? []

    const alternarLeido = async (mensaje) => {
        try {
            await marcarMensajeLeido(mensaje.id, !mensaje.leido)
            recargar()
        } catch (e) {
            alert(mensajeError(e))
        }
    }

    const borrar = async (mensaje) => {
        if (!window.confirm('¿Eliminar el mensaje de ' + mensaje.nombre + '?')) {
            return
        }

        try {
            await eliminarMensaje(mensaje.id)
            recargar()
        } catch (e) {
            alert(mensajeError(e))
        }
    }

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <AdminSidebar />

                <main className="col-md-9 col-lg-10 p-4">
                    <h1>Mensajes de contacto</h1>
                    <p className="text-muted">Consultas enviadas desde el formulario de la tienda.</p>

                    {error !== '' && <div className="alert alert-danger">{error}</div>}
                    {cargando && datos === null && <div className="alert alert-info">Cargando mensajes...</div>}
                    {!cargando && error === '' && mensajes.length === 0 && (
                        <div className="alert alert-info">No hay mensajes.</div>
                    )}

                    {mensajes.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered align-middle">
                                <thead className="tabla-header-ferreteria">
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Comentario</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mensajes.map((mensaje) => (
                                        <tr key={mensaje.id}>
                                            <td>{new Date(mensaje.fecha).toLocaleString('es-CL')}</td>
                                            <td>{mensaje.nombre}</td>
                                            <td>{mensaje.correo}</td>
                                            <td>{mensaje.comentario}</td>
                                            <td>
                                                <span className={'badge bg-' + (mensaje.leido ? 'secondary' : 'primary')}>
                                                    {mensaje.leido ? 'Leído' : 'Nuevo'}
                                                </span>
                                            </td>
                                            <td className="d-flex gap-2">
                                                <button type="button" className="btn btn-sm btn-outline-primary"
                                                        onClick={() => alternarLeido(mensaje)}>
                                                    {mensaje.leido ? 'Marcar como nuevo' : 'Marcar como leído'}
                                                </button>
                                                <button type="button" className="btn btn-sm btn-outline-danger"
                                                        onClick={() => borrar(mensaje)}>
                                                    Eliminar
                                                </button>
                                            </td>
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

export default AdminMensajes
