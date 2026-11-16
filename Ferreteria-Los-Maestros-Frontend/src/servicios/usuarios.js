import { api } from './api'

export async function listarUsuarios() {
    const { data } = await api.get('/usuarios')
    return data
}

export async function crearUsuario(datos) {
    const cuerpo = {
        run: datos.run,
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        correo: datos.correo,
        clave: datos.clave,
        rol: datos.tipo.toUpperCase(),            
        fechaNacimiento: datos.fecha || null,
        region: datos.region || null,
        comuna: datos.comuna || null,
        direccion: datos.direccion || null
    }
    const { data } = await api.post('/usuarios', cuerpo)
    return data
}

export async function eliminarUsuario(id) {
    await api.delete('/usuarios/' + id)
}
