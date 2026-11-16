import { useEffect, useState } from 'react'
import { mensajeError } from './errores'

export function useCarga(cargar, dependencias = []) {
    const [datos, setDatos] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let activo = true
        setCargando(true)

        cargar()
            .then((resultado) => {
                if (activo) {
                    setDatos(resultado)
                    setError('')
                }
            })
            .catch((e) => {
                if (activo) setError(mensajeError(e))
            })
            .finally(() => {
                if (activo) setCargando(false)
            })

        return () => { activo = false }
    }, [version, ...dependencias])

    return { datos, cargando, error, recargar: () => setVersion((v) => v + 1) }
}
