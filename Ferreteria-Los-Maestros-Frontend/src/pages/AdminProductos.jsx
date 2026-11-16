import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import AdminSidebar from '../components/organisms/AdminSidebar'
import {
    listarProductos, listarCategorias, crearProducto, actualizarProducto, eliminarProducto
} from '../servicios/productos'
import { formatearPrecio } from '../utils/validaciones'
import { mensajeError } from '../utils/errores'
import { useCarga } from '../utils/useCarga'

const formularioVacio = {
    codigo: "", nombre: "", descripcion: "", precio: "", stock: "", stockCritico: "", categoriaId: ""
}

const AdminProductos = () => {
    const { datos: listaProductos, cargando, error, recargar } = useCarga(() => listarProductos())
    const { datos: listaCategorias } = useCarga(() => listarCategorias())
    const productos = listaProductos ?? []
    const categorias = listaCategorias ?? []
    const [mostrarForm, setMostrarForm] = useState(false)
    const [datos, setDatos] = useState(formularioVacio)

    const [indiceEdicion, setIndiceEdicion] = useState(null)
    const [datosEdicion, setDatosEdicion] = useState(formularioVacio)

    const manejarCambio = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value })
    }

    const guardarProducto = async (e) => {
        e.preventDefault()

        if (
            datos.codigo.trim() === "" || datos.nombre.trim() === "" ||
            datos.precio === "" || datos.stock === "" || datos.categoriaId === ""
        ) {
            alert("Completa los campos obligatorios")
            return
        }

        const precio = Number(datos.precio)
        const stock = Number(datos.stock)
        const stockCritico = datos.stockCritico === "" ? null : Number(datos.stockCritico)

        if (datos.codigo.trim().length < 3) {
            alert("El código debe tener al menos 3 caracteres")
            return
        }

        if (!Number.isInteger(precio) || precio < 0 || !Number.isInteger(stock) || stock < 0) {
            alert("El precio y el stock deben ser números enteros desde 0")
            return
        }

        if (productos.some((p) => p.codigo === datos.codigo.trim())) {
            alert("Ya existe un producto con ese código")
            return
        }

        try {
            await crearProducto({
                codigo: datos.codigo.trim(),
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                stockCritico: stockCritico,
                precio: precio,
                stock: stock,
                categoriaId: Number(datos.categoriaId)
            })
        } catch (err) {
            alert(mensajeError(err))
            return
        }

        recargar()
        setDatos(formularioVacio)
        alert("Producto creado correctamente")

        if (stockCritico !== null && stock <= stockCritico) {
            alert("Atención: el stock de este producto está en nivel crítico")
        }
    }

    const abrirEdicion = (indice) => {
        const p = productos[indice]
        setDatosEdicion({
            codigo: p.codigo,
            nombre: p.nombre,
            descripcion: p.descripcion ?? "",
            precio: String(p.precio),
            stock: String(p.stock),
            stockCritico: p.stockCritico === null || p.stockCritico === undefined ? "" : String(p.stockCritico),
            categoriaId: String(p.categoriaId)
        })
        setIndiceEdicion(indice)
    }

    const cerrarEdicion = () => setIndiceEdicion(null)

    const manejarCambioEdicion = (e) => {
        setDatosEdicion({ ...datosEdicion, [e.target.name]: e.target.value })
    }

    const guardarEdicion = async (e) => {
        e.preventDefault()

        const precio = Number(datosEdicion.precio)
        const stock = Number(datosEdicion.stock)
        const stockCritico = datosEdicion.stockCritico === "" ? null : Number(datosEdicion.stockCritico)

        if (datosEdicion.nombre.trim() === "" || datosEdicion.categoriaId === "" ||
            datosEdicion.precio === "" || datosEdicion.stock === "") {
            alert("Completa los campos obligatorios")
            return
        }

        if (!Number.isInteger(precio) || precio < 0 || !Number.isInteger(stock) || stock < 0) {
            alert("El precio y el stock deben ser números enteros desde 0")
            return
        }

        if (stockCritico !== null && (!Number.isInteger(stockCritico) || stockCritico < 0)) {
            alert("El stock crítico debe ser un número entero desde 0")
            return
        }

        try {
            await actualizarProducto(productos[indiceEdicion].id, {
                codigo: datosEdicion.codigo,
                nombre: datosEdicion.nombre,
                descripcion: datosEdicion.descripcion,
                stockCritico: stockCritico,
                precio: precio,
                stock: stock,
                categoriaId: Number(datosEdicion.categoriaId)
            })
        } catch (err) {
            alert(mensajeError(err))
            return
        }

        recargar()
        cerrarEdicion()
        alert("Producto modificado correctamente")

        if (stockCritico !== null && stock <= stockCritico) {
            alert("Atención: el stock de este producto está en nivel crítico")
        }
    }

    const manejarEliminar = async (indice) => {
        const producto = productos[indice]

        if (!confirm("¿Seguro que quieres eliminar " + producto.nombre + "?")) {
            return
        }

        try {
            await eliminarProducto(producto.id)
        } catch (err) {
            alert(mensajeError(err))
            return
        }

        recargar()
        alert("Producto eliminado correctamente")
    }

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <AdminSidebar />

                <main className="col-md-9 col-lg-10 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1>Administrar Productos</h1>
                            <p className="text-muted">Listado de productos disponibles en la tienda.</p>
                        </div>

                        {/* Muestra u oculta el formulario */}
                        <button className="btn btn-primary" type="button"
                                onClick={() => setMostrarForm(!mostrarForm)}>
                            Nuevo producto
                        </button>
                    </div>

                    {/* Formulario de nuevo producto */}
                    {mostrarForm && (
                        <div className="mb-5">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="mb-4">Nuevo Producto</h4>

                                    <form onSubmit={guardarProducto}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="admin-producto-codigo" className="form-label">Código</label>
                                                <input type="text" className="form-control" id="admin-producto-codigo"
                                                       name="codigo" minLength={3} value={datos.codigo}
                                                       onChange={manejarCambio} required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="admin-producto-nombre" className="form-label">Nombre</label>
                                                <input type="text" className="form-control" id="admin-producto-nombre"
                                                       name="nombre" maxLength={100} value={datos.nombre}
                                                       onChange={manejarCambio} required />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="admin-producto-descripcion" className="form-label">Descripción</label>
                                            <textarea className="form-control" id="admin-producto-descripcion"
                                                      name="descripcion" maxLength={500} rows={3}
                                                      value={datos.descripcion} onChange={manejarCambio}></textarea>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="admin-producto-precio" className="form-label">Precio</label>
                                                <input type="number" className="form-control" id="admin-producto-precio"
                                                       name="precio" min={0} step={1} value={datos.precio}
                                                       onChange={manejarCambio} required />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="admin-producto-stock" className="form-label">Stock</label>
                                                <input type="number" className="form-control" id="admin-producto-stock"
                                                       name="stock" min={0} step={1} value={datos.stock}
                                                       onChange={manejarCambio} required />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="admin-producto-stock-critico" className="form-label">Stock crítico</label>
                                                <input type="number" className="form-control" id="admin-producto-stock-critico"
                                                       name="stockCritico" min={0} step={1} value={datos.stockCritico}
                                                       onChange={manejarCambio} />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="admin-producto-categoria" className="form-label">Categoría</label>
                                                <select className="form-select" id="admin-producto-categoria"
                                                        name="categoriaId" value={datos.categoriaId}
                                                        onChange={manejarCambio} required>
                                                    <option value="">Seleccionar</option>
                                                    {categorias.map((categoria) => (
                                                        <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="admin-producto-imagen" className="form-label">Imagen</label>
                                                <input type="file" className="form-control" id="admin-producto-imagen" />
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-primary">Guardar producto</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {cargando && listaProductos === null && <div className="alert alert-info">Cargando productos...</div>}
                    {error !== "" && <div className="alert alert-danger">{error}</div>}

                    {/* Tabla de productos */}
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle">
                            <thead className="tabla-header-ferreteria">
                                <tr>
                                    <th>Código</th>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto, i) => (
                                    <tr key={producto.id}>
                                        <td>{producto.codigo}</td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.categoria}</td>
                                        <td>${formatearPrecio(producto.precio)}</td>
                                        <td>{producto.stock}</td>
                                        <td>
                                            <button className="btn btn-sm btn-warning me-1" onClick={() => abrirEdicion(i)}>
                                                Editar
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => manejarEliminar(i)}>
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
            {/* Cuadro para modificar todos los datos del producto de una vez */}
            <Modal show={indiceEdicion !== null} onHide={cerrarEdicion} centered size="lg">
                <form onSubmit={guardarEdicion}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modificar producto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="editar-producto-codigo" className="form-label">Código</label>
                                <input type="text" className="form-control" id="editar-producto-codigo"
                                       value={datosEdicion.codigo} disabled readOnly />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="editar-producto-nombre" className="form-label">Nombre</label>
                                <input type="text" className="form-control" id="editar-producto-nombre"
                                       name="nombre" maxLength={100} value={datosEdicion.nombre}
                                       onChange={manejarCambioEdicion} required />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="editar-producto-descripcion" className="form-label">Descripción</label>
                            <textarea className="form-control" id="editar-producto-descripcion"
                                      name="descripcion" maxLength={500} rows={3}
                                      value={datosEdicion.descripcion} onChange={manejarCambioEdicion}></textarea>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="editar-producto-precio" className="form-label">Precio</label>
                                <input type="number" className="form-control" id="editar-producto-precio"
                                       name="precio" min={0} step={1} value={datosEdicion.precio}
                                       onChange={manejarCambioEdicion} required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="editar-producto-stock" className="form-label">Stock</label>
                                <input type="number" className="form-control" id="editar-producto-stock"
                                       name="stock" min={0} step={1} value={datosEdicion.stock}
                                       onChange={manejarCambioEdicion} required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="editar-producto-stock-critico" className="form-label">Stock crítico</label>
                                <input type="number" className="form-control" id="editar-producto-stock-critico"
                                       name="stockCritico" min={0} step={1} value={datosEdicion.stockCritico}
                                       onChange={manejarCambioEdicion} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="editar-producto-categoria" className="form-label">Categoría</label>
                            <select className="form-select" id="editar-producto-categoria"
                                    name="categoriaId" value={datosEdicion.categoriaId}
                                    onChange={manejarCambioEdicion} required>
                                <option value="">Seleccionar</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-secondary" onClick={cerrarEdicion}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Guardar cambios</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default AdminProductos
