import { api } from './api'

export async function login(correo, clave) {
    const { data } = await api.post('/auth/login', { correo, clave })
    return data
}

export async function registrar(nombre, correo, clave) {
    const { data } = await api.post('/auth/registro', { nombre, correo, clave })
    return data
}

export async function perfil() {
    const { data } = await api.get('/auth/me')
    return data
}
