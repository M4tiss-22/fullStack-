export const ROL_ADMIN = 'ADMINISTRADOR'
export const ROL_VENDEDOR = 'VENDEDOR'
export const ROL_CLIENTE = 'CLIENTE'

export function rutaInicial(rol) {
    if (rol === ROL_ADMIN) {
        return '/admin'
    }
    if (rol === ROL_VENDEDOR) {
        return '/vendedor'
    }
    return '/'
}
