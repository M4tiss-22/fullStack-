import { leerJSON, guardarJSON, borrarClave } from '../utils/almacenamiento'

const CLAVE_SESION = 'sesionFerreteria'

export const EVENTO_SESION_EXPIRADA = 'sesion-expirada'

export function leerSesion() {
    return leerJSON(CLAVE_SESION, null)
}

export function guardarSesion(sesion) {
    guardarJSON(CLAVE_SESION, sesion)
}

export function borrarSesion() {
    borrarClave(CLAVE_SESION)
}

export function obtenerUsuarioActual() {
    const sesion = leerSesion()
    return sesion === null ? null : sesion.usuario
}
