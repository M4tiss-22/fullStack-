import { apiContenido } from './api'

export async function listarArticulos() {
    const { data } = await apiContenido.get('/articulos')
    return data
}

export async function obtenerArticulo(id) {
    const { data } = await apiContenido.get('/articulos/' + id)
    return data
}

export async function enviarMensaje(datos) {
    const { data } = await apiContenido.post('/contacto', datos)
    return data
}

export async function listarMensajes() {
    const { data } = await apiContenido.get('/contacto')
    return data
}

export async function marcarMensajeLeido(id, leido) {
    const { data } = await apiContenido.patch('/contacto/' + id + '/leido', { leido })
    return data
}

export async function eliminarMensaje(id) {
    await apiContenido.delete('/contacto/' + id)
}
