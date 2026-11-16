import { apiOrdenes } from './api'

export const ESTADOS = ['PENDIENTE', 'CONFIRMADA', 'EN_PREPARACION', 'ENVIADA', 'ENTREGADA', 'CANCELADA']

export const SIGUIENTES_ESTADOS = {
    PENDIENTE: ['CONFIRMADA', 'CANCELADA'],
    CONFIRMADA: ['EN_PREPARACION', 'CANCELADA'],
    EN_PREPARACION: ['ENVIADA', 'CANCELADA'],
    ENVIADA: ['ENTREGADA'],
    ENTREGADA: [],
    CANCELADA: []
}

export async function listarOrdenes(estado) {
    const { data } = await apiOrdenes.get('/ordenes', { params: estado ? { estado } : {} })
    return data
}

export async function obtenerOrden(id) {
    const { data } = await apiOrdenes.get('/ordenes/' + id)
    return data
}

export async function crearOrden(datos) {
    const { data } = await apiOrdenes.post('/ordenes', datos)
    return data
}

export async function cambiarEstadoOrden(id, estado) {
    const { data } = await apiOrdenes.patch('/ordenes/' + id + '/estado', { estado })
    return data
}
