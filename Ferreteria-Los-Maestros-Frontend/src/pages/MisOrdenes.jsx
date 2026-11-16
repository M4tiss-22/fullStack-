import OrdenesLista from '../components/organisms/OrdenesLista'

const MisOrdenes = () => {
    return (
        <main className="container mt-5 mb-5">
            <h1>Mis órdenes</h1>
            <p className="text-muted">Aquí puedes revisar tus compras y su estado.</p>
            <OrdenesLista />
        </main>
    )
}

export default MisOrdenes
