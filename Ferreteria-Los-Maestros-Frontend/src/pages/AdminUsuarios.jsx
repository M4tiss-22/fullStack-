import { useState, useEffect } from 'react'
import AdminSidebar from '../components/organisms/AdminSidebar'
import UserForm from '../components/molecules/UserForm'
import { listarUsuarios, crearUsuario, eliminarUsuario } from '../servicios/usuarios'
import { mensajeError } from '../utils/errores'
import { useSesion } from '../context/useSesion'

const AdminUsuarios = () => {
    const { usuario: sesion } = useSesion()
    const [usuarios, setUsuarios] = useState([])
    const [error, setError] = useState('')
    const [mostrarForm, setMostrarForm] = useState(false)
    const [version, setVersion] = useState(0)   

    useEffect(() => {
        let activo = true

        listarUsuarios()
            .then((lista) => {
                if (activo) {
                    setUsuarios(lista)
                    setError('')
                }
            })
            .catch((e) => {
                if (activo) {
                    setError(mensajeError(e))
                }
            })

        return () => { activo = false }
    }, [version])

    const recargar = () => setVersion((v) => v + 1)

    const guardarUsuario = async (datos) => {
        try {
            await crearUsuario(datos)
            alert("Usuario creado correctamente")
            recargar()
            return true
        } catch (e) {
            alert(mensajeError(e))
            return false
        }
    }

    const borrarUsuario = async (usuario) => {
        if (!window.confirm("¿Eliminar a " + usuario.nombre + "?")) {
            return
        }

        try {
            await eliminarUsuario(usuario.id)
            recargar()
        } catch (e) {
            alert(mensajeError(e))
        }
    }

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <AdminSidebar />

                <main className="col-md-9 col-lg-10 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1>Administrar Usuarios</h1>
                            <p className="text-muted">Listado de usuarios registrados en el sistema. Los clientes se registran desde la tienda; aquí solo se crean vendedores y administradores.</p>
                        </div>

                        {/* Muestra u oculta el formulario */}
                        <button className="btn btn-primary" type="button"
                                onClick={() => setMostrarForm(!mostrarForm)}>
                            Nuevo usuario
                        </button>
                    </div>

                    {error !== '' && <div className="alert alert-danger">{error}</div>}

                    {mostrarForm && (
                        <div className="mb-5">
                            <UserForm onGuardar={guardarUsuario} />
                        </div>
                    )}

                    {/* Tabla de usuarios */}
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle">
                            <thead className="tabla-header-ferreteria">
                                <tr>
                                    <th>RUN</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Tipo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.run ?? '—'}</td>
                                        <td>{usuario.nombre} {usuario.apellidos}</td>
                                        <td>{usuario.correo}</td>
                                        <td>{usuario.tipo}</td>
                                        <td>
                                            {/* No puedes eliminar tu propia cuenta (el backend también lo impide) */}
                                            <button className="btn btn-sm btn-outline-danger" type="button"
                                                    disabled={usuario.id === sesion.id}
                                                    onClick={() => borrarUsuario(usuario)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminUsuarios
