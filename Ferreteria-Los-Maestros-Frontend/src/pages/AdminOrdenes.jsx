import AdminSidebar from '../components/organisms/AdminSidebar'
import OrdenesLista from '../components/organisms/OrdenesLista'

const AdminOrdenes = () => {
    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <AdminSidebar />

                <main className="col-md-9 col-lg-10 p-4">
                    <h1>Administrar Órdenes</h1>
                    <p className="text-muted">Abre el detalle de una orden para cambiar su estado. Al cancelar, el stock se devuelve.</p>
                    <OrdenesLista puedeCambiarEstado />
                </main>
            </div>
        </div>
    )
}

export default AdminOrdenes
