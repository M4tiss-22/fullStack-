import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductoCard from './molecules/ProductoCard'
import NavigationBar from './organisms/Navbar'
import { SesionProvider } from '../context/SesionProvider'
import { useSesion } from '../context/useSesion'
import { guardarSesion, obtenerUsuarioActual } from '../servicios/almacenSesion'
import { perfil } from '../servicios/auth'

vi.mock('../servicios/auth', () => ({ login: vi.fn(), registrar: vi.fn(), perfil: vi.fn() }))

const producto = {
    id: 1, codigo: 'MAR001', nombre: 'Martillo Carpintero', categoria: 'Herramientas manuales',
    categoriaSlug: 'manuales', precio: 6990, stock: 25, icono: 'martillo.svg'
}

const usuarioAna = { id: 3, nombre: 'Ana', correo: 'ana@gmail.com', rol: 'CLIENTE', tipo: 'Cliente' }

describe('ProductoCard', () => {
    beforeEach(() => localStorage.clear())

    it('muestra el nombre, la categoría y el stock recibidos por props', () => {
        render(<MemoryRouter><ProductoCard producto={producto} /></MemoryRouter>)
        expect(screen.getByText('Martillo Carpintero')).toBeInTheDocument()
        expect(screen.getByText('Categoría: Herramientas manuales')).toBeInTheDocument()
        expect(screen.getByText('Stock: 25 unidades')).toBeInTheDocument()
    })
})

describe('Navbar (renderizado condicional según la sesión)', () => {
    beforeEach(() => {
        localStorage.clear()
        perfil.mockResolvedValue(usuarioAna)
    })

    it('al cerrar sesión borra los tokens guardados y vuelve a mostrar "Iniciar Sesión"', async () => {
        guardarSesion({ accessToken: 'a', refreshToken: 'r', usuario: usuarioAna })
        render(
            <MemoryRouter>
                <SesionProvider>
                    <NavigationBar />
                </SesionProvider>
            </MemoryRouter>
        )
        expect(await screen.findByText('Hola, Ana')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Cerrar sesión'))
        expect(obtenerUsuarioActual()).toBeNull()
        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    })
})

describe('SesionProvider (contexto)', () => {
    beforeEach(() => {
        localStorage.clear()
        perfil.mockResolvedValue({ id: 9, nombre: 'Luis', rol: 'CLIENTE', tipo: 'Cliente' })
    })

    const Consumidor = () => {
        const { usuario } = useSesion()
        return <span>{usuario === null ? 'sin sesion' : 'usuario: ' + usuario.nombre}</span>
    }

    it('recupera la sesión guardada al montarse y la verifica con el backend', async () => {
        guardarSesion({ accessToken: 'a', refreshToken: 'r', usuario: { nombre: 'Luis' } })
        render(<SesionProvider><Consumidor /></SesionProvider>)
        expect(screen.getByText('usuario: Luis')).toBeInTheDocument()
        await waitFor(() => expect(perfil).toHaveBeenCalledTimes(1))
    })
})
