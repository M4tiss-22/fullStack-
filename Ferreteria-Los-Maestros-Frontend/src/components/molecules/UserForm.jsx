import { useState } from 'react'
import { comunasPorRegion } from '../../data/productos'
import { validarCorreo, validarRun, validarClave } from '../../utils/validaciones'

const formularioVacio = {
    run: "", nombre: "", apellidos: "", correo: "", clave: "", fecha: "",
    tipo: "", region: "", comuna: "", direccion: ""
}

const UserForm = ({ onGuardar }) => {
    const [datos, setDatos] = useState(formularioVacio)

    const manejarCambio = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value })
    }

    const manejarRegion = (e) => {
        setDatos({ ...datos, region: e.target.value, comuna: "" })
    }

    const manejarEnvio = async (e) => {
        e.preventDefault()

        if (
            datos.run.trim() === "" || datos.nombre.trim() === "" ||
            datos.apellidos.trim() === "" || datos.correo.trim() === "" || datos.clave === "" ||
            datos.tipo === "" || datos.direccion.trim() === ""
        ) {
            alert("Completa los campos obligatorios")
            return
        }

        if (!validarRun(datos.run)) {
            alert("El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion")
            return
        }

        if (!validarCorreo(datos.correo)) {
            alert("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com")
            return
        }

        if (!validarClave(datos.clave)) {
            alert("La contraseña debe tener entre 4 y 10 caracteres")
            return
        }

        const guardado = await onGuardar({
            run: datos.run.trim(),
            nombre: datos.nombre.trim(),
            apellidos: datos.apellidos.trim(),
            correo: datos.correo.trim(),
            clave: datos.clave,
            tipo: datos.tipo,
            fecha: datos.fecha,
            region: datos.region,
            comuna: datos.comuna,
            direccion: datos.direccion.trim()
        })

        if (guardado) {
            setDatos(formularioVacio)
        }
    }

    const comunas = comunasPorRegion[datos.region] || []

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="mb-4">Nuevo Usuario</h4>

                <form onSubmit={manejarEnvio}>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label htmlFor="admin-usuario-run" className="form-label">RUN</label>
                            <input type="text" className="form-control" id="admin-usuario-run" name="run"
                                   minLength={7} maxLength={9} placeholder="19011022K"
                                   value={datos.run} onChange={manejarCambio} required />
                            <div className="form-text">Sin puntos ni guion.</div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="admin-usuario-nombre" className="form-label">Nombre</label>
                            <input type="text" className="form-control" id="admin-usuario-nombre" name="nombre"
                                   maxLength={50} value={datos.nombre} onChange={manejarCambio} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="admin-usuario-apellidos" className="form-label">Apellidos</label>
                            <input type="text" className="form-control" id="admin-usuario-apellidos" name="apellidos"
                                   maxLength={100} value={datos.apellidos} onChange={manejarCambio} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="admin-usuario-correo" className="form-label">Correo</label>
                            <input type="email" className="form-control" id="admin-usuario-correo" name="correo"
                                   maxLength={100} placeholder="usuario@gmail.com"
                                   value={datos.correo} onChange={manejarCambio} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="admin-usuario-fecha" className="form-label">Fecha de nacimiento</label>
                            <input type="date" className="form-control" id="admin-usuario-fecha" name="fecha"
                                   value={datos.fecha} onChange={manejarCambio} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="admin-usuario-clave" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" id="admin-usuario-clave" name="clave"
                                   maxLength={10} value={datos.clave} onChange={manejarCambio} required />
                            <div className="form-text">Entre 4 y 10 caracteres.</div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label htmlFor="admin-usuario-tipo" className="form-label">Tipo de usuario</label>
                            <select className="form-select" id="admin-usuario-tipo" name="tipo"
                                    value={datos.tipo} onChange={manejarCambio} required>
                                <option value="">Seleccionar</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Vendedor">Vendedor</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="admin-usuario-region" className="form-label">Región</label>
                            <select className="form-select" id="admin-usuario-region" name="region"
                                    value={datos.region} onChange={manejarRegion}>
                                <option value="">Seleccionar región</option>
                                {Object.keys(comunasPorRegion).map((region) => (
                                    <option key={region} value={region}>Región de {region}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="admin-usuario-comuna" className="form-label">Comuna</label>
                            <select className="form-select" id="admin-usuario-comuna" name="comuna"
                                    value={datos.comuna} onChange={manejarCambio} disabled={datos.region === ""}>
                                <option value="">Seleccionar comuna</option>
                                {comunas.map((comuna) => (
                                    <option key={comuna} value={comuna}>{comuna}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="admin-usuario-direccion" className="form-label">Dirección</label>
                        <input type="text" className="form-control" id="admin-usuario-direccion" name="direccion"
                               maxLength={300} value={datos.direccion} onChange={manejarCambio} required />
                    </div>

                    <button type="submit" className="btn btn-primary">Guardar usuario</button>
                </form>
            </div>
        </div>
    )
}

export default UserForm
