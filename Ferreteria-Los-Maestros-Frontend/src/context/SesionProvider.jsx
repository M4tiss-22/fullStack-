import { useState, useEffect } from 'react'
import { SesionContext } from './sesion'
import { perfil } from '../servicios/auth'
import {
    leerSesion, guardarSesion, borrarSesion, obtenerUsuarioActual, EVENTO_SESION_EXPIRADA
} from '../servicios/almacenSesion'

export function SesionProvider({ children }) {

    const [usuario, setUsuario] = useState(() => obtenerUsuarioActual())

    useEffect(() => {
        if (leerSesion() === null) {
            return
        }

        let activo = true
        perfil()
            .then((datos) => {
                const sesion = leerSesion()
                if (activo && sesion !== null) {
                    guardarSesion({ ...sesion, usuario: datos })
                    setUsuario(datos)
                }
            })
            .catch(() => {})

        return () => { activo = false }
    }, [])

    useEffect(() => {
        const expirar = () => setUsuario(null)
        window.addEventListener(EVENTO_SESION_EXPIRADA, expirar)
        return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, expirar)
    }, [])

    const iniciarSesion = ({ accessToken, refreshToken, usuario: usuarioNuevo }) => {
        guardarSesion({ accessToken, refreshToken, usuario: usuarioNuevo })
        setUsuario(usuarioNuevo)
    }

    const cerrarSesion = () => {
        borrarSesion()
        setUsuario(null)
    }

    return (
        <SesionContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
            {children}
        </SesionContext.Provider>
    )
}
