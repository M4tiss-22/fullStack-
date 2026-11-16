import VendedorSidebar from '../components/organisms/VendedorSidebar'
import OrdenesLista from '../components/organisms/OrdenesLista'

const VendedorOrdenes = () => {
    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <VendedorSidebar />

                <main className="col-md-9 col-lg-10 p-4">
                    <h1>Órdenes</h1>
                    <p className="text-muted">Lista de órdenes y su detalle (solo lectura).</p>
                    <OrdenesLista />
                </main>
            </div>
        </div>
    )
}

export default VendedorOrdenes
