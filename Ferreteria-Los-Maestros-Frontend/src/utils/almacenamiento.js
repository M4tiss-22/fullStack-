export function leerJSON(clave, valorPorDefecto) {
    try {
        const texto = localStorage.getItem(clave)
        if (texto === null) {
            return valorPorDefecto
        }
        return JSON.parse(texto)
    } catch {
        return valorPorDefecto
    }
}

export function guardarJSON(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor))
}

export function borrarClave(clave) {
    localStorage.removeItem(clave)
}
