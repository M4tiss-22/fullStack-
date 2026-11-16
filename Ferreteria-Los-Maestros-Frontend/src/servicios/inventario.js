import { apiInventario } from './api'

export async function listarAlertas() {
    const { data } = await apiInventario.get('/inventario/alertas')
    return data
}

export async function listarMovimientos(productoId) {
    const { data } = await apiInventario.get('/inventario/movimientos', { params: productoId ? { productoId } : {} })
    return data
}

export async function registrarMovimiento(datos) {
    const { data } = await apiInventario.post('/inventario/movimientos', datos)
    return data
}
