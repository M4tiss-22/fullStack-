import { useEffect, useState } from 'react'
import { agregarAlCarritoValidado, cantidadEnCarrito, suscribirCarrito } from '../servicios/tienda'

export function useSelectorCantidad(producto) {
    const [texto, setTexto] = useState("1")
    const [enCarrito, setEnCarrito] = useState(() => cantidadEnCarrito(producto.id))

    useEffect(() => {
        const actualizar = () => setEnCarrito(cantidadEnCarrito(producto.id))
        actualizar()
        return suscribirCarrito(actualizar)
    }, [producto.id])

    const maximo = Math.max(producto.stock - enCarrito, 0)

    const cantidad = texto === "" ? 1 : Math.min(Math.max(Number(texto), 1), Math.max(maximo, 1))

    const manejarCambio = (e) => {
        const crudo = e.target.value

        if (crudo === "") {
            setTexto("")
            return
        }

        const valor = Math.floor(Number(crudo))
        if (Number.isNaN(valor)) return

        if (valor < 1) {
            setTexto("")
        } else if (valor > maximo) {
            setTexto(String(Math.max(maximo, 1)))
        } else {
            setTexto(String(valor))
        }
    }

    const manejarBlur = () => {
        if (texto === "") setTexto("1")
    }

    const agregar = async () => {
        const resultado = await agregarAlCarritoValidado(producto.id, cantidad)
        alert(resultado.mensaje)

        if (resultado.ok) setTexto("1")
    }

    return { texto, maximo, enCarrito, manejarCambio, manejarBlur, agregar }
}
