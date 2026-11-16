import { leerJSON, guardarJSON, borrarClave } from "../utils/almacenamiento"
import { mensajeError } from "../utils/errores"
import { listarProductos, obtenerProducto } from "./productos"
import { crearOrden } from "./ordenes"

const CLAVE_CARRITO = "carritoFerreteria"

const listenersCarrito = new Set()

function notificarCarrito() {
    for (const escuchar of listenersCarrito) {
        escuchar()
    }
}

export function suscribirCarrito(escuchar) {
    listenersCarrito.add(escuchar)
    return () => listenersCarrito.delete(escuchar)
}

export async function obtenerProductos() {
    return listarProductos()
}

export async function buscarProductoPorId(id) {
    try {
        return await obtenerProducto(id)
    } catch (error) {
        if (error.response?.status === 404) {
            return undefined
        }
        throw error
    }
}

export function obtenerCarrito() {
    return leerJSON(CLAVE_CARRITO, [])
}

export function obtenerCantidadCarrito() {
    return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0)
}

export function agregarAlCarrito(id, cantidad = 1) {
    const carrito = obtenerCarrito()
    const item = carrito.find((i) => i.id === id)

    if (item) {
        item.cantidad = item.cantidad + cantidad
    } else {
        carrito.push({ id: id, cantidad: cantidad })
    }

    guardarJSON(CLAVE_CARRITO, carrito)
    notificarCarrito()
}

export function cantidadEnCarrito(id) {
    const item = obtenerCarrito().find((i) => i.id === id)
    return item ? item.cantidad : 0
}

export async function agregarAlCarritoValidado(id, cantidad = 1) {
    let producto

    try {
        producto = await buscarProductoPorId(id)
    } catch (error) {
        return { ok: false, mensaje: mensajeError(error) }
    }

    if (producto === undefined) {
        return { ok: false, mensaje: "El producto ya no existe" }
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
        return { ok: false, mensaje: "La cantidad debe ser al menos 1" }
    }

    const enCarrito = cantidadEnCarrito(id)

    if (enCarrito + cantidad > producto.stock) {
        const disponibles = Math.max(producto.stock - enCarrito, 0)
        return {
            ok: false,
            mensaje: `No puedes superar el stock de ${producto.nombre} (${producto.stock} unidades). ` +
                `Ya tienes ${enCarrito} en el carrito y puedes agregar ${disponibles} más.`
        }
    }

    agregarAlCarrito(id, cantidad)
    return { ok: true, mensaje: "Producto agregado al carrito" }
}

export function actualizarCantidadCarrito(id, cantidad, stock) {
    if (cantidad <= 0) {
        return { carrito: eliminarDelCarrito(id), mensaje: "" }
    }

    let mensaje = ""

    if (stock !== undefined && cantidad > stock) {
        cantidad = stock
        mensaje = `Solo hay ${stock} unidades disponibles`
    }

    const carrito = obtenerCarrito().map((i) => (i.id === id ? { ...i, cantidad } : i))
    guardarJSON(CLAVE_CARRITO, carrito)
    notificarCarrito()
    return { carrito, mensaje }
}

export function eliminarDelCarrito(id) {
    const carritoNuevo = obtenerCarrito().filter((i) => i.id !== id)
    guardarJSON(CLAVE_CARRITO, carritoNuevo)
    notificarCarrito()
    return carritoNuevo
}

export function vaciarCarrito() {
    borrarClave(CLAVE_CARRITO)
    notificarCarrito()
}

export async function realizarCompra({ nombre, direccion }) {
    const carrito = obtenerCarrito()

    if (carrito.length === 0) {
        return { ok: false, mensaje: "El carrito está vacío" }
    }

    if (!direccion || direccion.trim() === "") {
        return { ok: false, mensaje: "Ingresa la dirección de entrega" }
    }

    try {
        const orden = await crearOrden({
            clienteNombre: nombre,
            direccionEntrega: direccion.trim(),
            items: carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad }))
        })

        vaciarCarrito()

        return { ok: true, mensaje: `¡Compra realizada con éxito! Tu orden N° ${orden.id} quedó registrada.`, orden }
    } catch (error) {
        return { ok: false, mensaje: mensajeError(error) }
    }
}
