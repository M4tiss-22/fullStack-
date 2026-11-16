export function validarCorreo(correo) {
    return (
        correo.endsWith("@duoc.cl") ||
        correo.endsWith("@profesor.duoc.cl") ||
        correo.endsWith("@gmail.com")
    )
}

export function validarClave(clave) {
    return clave.length >= 4 && clave.length <= 10
}

export function validarRun(run) {
    return /^[0-9]{6,8}[0-9kK]$/.test(run)
}

export function formatearPrecio(numero) {
    return Number(numero).toLocaleString("es-CL")
}
