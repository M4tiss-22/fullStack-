import { apiProductos } from './api'

export async function listarProductos() {
    const { data } = await apiProductos.get('/productos')
    return data
}

export async function obtenerProducto(id) {
    const { data } = await apiProductos.get('/productos/' + id)
    return data
}

export async function listarStockCritico() {
    const { data } = await apiProductos.get('/productos/stock-critico')
    return data
}

function aCuerpoProducto(datos) {
    return {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion || null,
        precio: datos.precio,
        stock: datos.stock,
        stockCritico: datos.stockCritico ?? null,
        categoriaId: datos.categoriaId
    }
}

export async function crearProducto(datos) {
    const { data } = await apiProductos.post('/productos', aCuerpoProducto(datos))
    return data
}

export async function actualizarProducto(id, datos) {
    const { data } = await apiProductos.put('/productos/' + id, aCuerpoProducto(datos))
    return data
}

export async function eliminarProducto(id) {
    await apiProductos.delete('/productos/' + id)
}

export async function listarCategorias() {
    const { data } = await apiProductos.get('/categorias')
    return data
}
