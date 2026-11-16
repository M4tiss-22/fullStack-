export function mensajeError(error) {
    if (error.response?.data?.message) {
        return error.response.data.message
    }
    if (error.response) {
        return 'Error del servidor (' + error.response.status + ')'
    }
    return 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.'
}
