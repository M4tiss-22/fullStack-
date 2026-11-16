import axios from 'axios'
import { leerSesion, guardarSesion, borrarSesion, EVENTO_SESION_EXPIRADA } from './almacenSesion'

export const URL_USUARIOS = import.meta.env.VITE_API_USUARIOS_URL ?? 'http://localhost:8081/api/v1'
export const URL_PRODUCTOS = import.meta.env.VITE_API_PRODUCTOS_URL ?? 'http://localhost:8082/api/v1'
export const URL_ORDENES = import.meta.env.VITE_API_ORDENES_URL ?? 'http://localhost:8083/api/v1'
export const URL_CONTENIDO = import.meta.env.VITE_API_CONTENIDO_URL ?? 'http://localhost:8084/api/v1'
export const URL_INVENTARIO = import.meta.env.VITE_API_INVENTARIO_URL ?? 'http://localhost:8085/api/v1'

const RUTAS_PUBLICAS = ['/auth/login', '/auth/registro', '/auth/refresh']
const esPublica = (url) => RUTAS_PUBLICAS.some((ruta) => url?.startsWith(ruta))

function cerrarPorExpiracion() {
    borrarSesion()
    window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
}

let renovacionEnCurso = null

function crearCliente(baseURL) {
    const cliente = axios.create({
        baseURL,
        headers: { 'Content-Type': 'application/json' }
    })

    cliente.interceptors.request.use((config) => {
        const sesion = leerSesion()
        if (sesion?.accessToken && !esPublica(config.url)) {
            config.headers.Authorization = 'Bearer ' + sesion.accessToken
        }
        return config
    })

    cliente.interceptors.response.use(
        (respuesta) => respuesta,
        async (error) => {
            const original = error.config
            const status = error.response?.status

            if (status !== 401 || !original || original._reintentada || esPublica(original.url)) {
                return Promise.reject(error)
            }

            const sesion = leerSesion()
            if (!sesion?.refreshToken) {
                cerrarPorExpiracion()
                return Promise.reject(error)
            }

            original._reintentada = true

            try {
                if (renovacionEnCurso === null) {
                    renovacionEnCurso = axios
                        .post(URL_USUARIOS + '/auth/refresh', { refreshToken: sesion.refreshToken })
                        .then((respuesta) => respuesta.data)
                        .finally(() => { renovacionEnCurso = null })
                }

                const nueva = await renovacionEnCurso
                guardarSesion({
                    accessToken: nueva.accessToken,
                    refreshToken: nueva.refreshToken,
                    usuario: nueva.usuario
                })

                original.headers.Authorization = 'Bearer ' + nueva.accessToken
                return cliente(original)
            } catch {
                cerrarPorExpiracion()
                return Promise.reject(error)
            }
        }
    )

    return cliente
}

export const api = crearCliente(URL_USUARIOS)

export const apiProductos = crearCliente(URL_PRODUCTOS)

export const apiOrdenes = crearCliente(URL_ORDENES)

export const apiContenido = crearCliente(URL_CONTENIDO)

export const apiInventario = crearCliente(URL_INVENTARIO)
