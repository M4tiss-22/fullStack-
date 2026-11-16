import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Carrito from './Carrito'
import { SesionProvider } from '../context/SesionProvider'
import { obtenerUsuarioActual } from '../servicios/almacenSesion'
import { agregarAlCarrito } from '../servicios/tienda'
import { login } from '../servicios/auth'
import { listarProductos } from '../servicios/productos'

vi.mock('../servicios/auth', () => ({ login: vi.fn(), registrar: vi.fn(), perfil: vi.fn() }))
vi.mock('../servicios/productos', () => ({
    listarProductos: vi.fn(), obtenerProducto: vi.fn()
}))

const enviarFormulario = (textoBoton) =>
    fireEvent.submit(screen.getByText(textoBoton).closest('form'))

describe('Login', () => {
    beforeEach(() => localStorage.clear())

    const renderLogin = () => render(
        <MemoryRouter initialEntries={['/login']}>
            <SesionProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<div>PAGINA INICIO</div>} />
                    <Route path="/admin" element={<div>PANEL ADMIN</div>} />
                </Routes>
            </SesionProvider>
        </MemoryRouter>
    )

    it('con userEvent: escribir un correo inválido y presionar Ingresar muestra el error', async () => {
        const user = userEvent.setup()
        renderLogin()
        await user.type(screen.getByLabelText('Correo electrónico'), 'ana')
        await user.type(screen.getByLabelText('Contraseña'), '1234')
        await user.click(screen.getByRole('button', { name: 'Ingresar' }))
        expect(screen.getByText('El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com')).toBeInTheDocument()
        expect(login).not.toHaveBeenCalled() 
    })

    it('cliente: el backend responde OK, se guarda la sesión y navega al inicio', async () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
        login.mockResolvedValue({
            accessToken: 'a', refreshToken: 'r',
            usuario: { id: 3, nombre: 'Ana', correo: 'ana@gmail.com', rol: 'CLIENTE', tipo: 'Cliente' }
        })
        renderLogin()
        fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@gmail.com' } })
        fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '1234' } })
        enviarFormulario('Ingresar')
        expect(await screen.findByText('PAGINA INICIO')).toBeInTheDocument()
        expect(login).toHaveBeenCalledWith('ana@gmail.com', '1234')
        expect(alertSpy).toHaveBeenCalledWith('Bienvenido, Ana')
        expect(obtenerUsuarioActual().nombre).toBe('Ana')
    })

    it('administrador: si el backend responde rol ADMINISTRADOR, redirige al panel /admin', async () => {
        vi.spyOn(window, 'alert').mockImplementation(() => {})
        login.mockResolvedValue({
            accessToken: 'a', refreshToken: 'r',
            usuario: { id: 1, nombre: 'Administrador', correo: 'admin@gmail.com', rol: 'ADMINISTRADOR', tipo: 'Administrador' }
        })
        renderLogin()
        fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'admin@gmail.com' } })
        fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'admin123' } })
        enviarFormulario('Ingresar')
        expect(await screen.findByText('PANEL ADMIN')).toBeInTheDocument()
    })
})

describe('Carrito', () => {
    beforeEach(() => {
        localStorage.clear()
        listarProductos.mockResolvedValue([
            { id: 1, codigo: 'MAR001', nombre: 'Martillo Carpintero', precio: 6990, stock: 25, icono: 'martillo.svg' },
            { id: 3, codigo: 'CEM003', nombre: 'Saco de Cemento 25kg', precio: 5490, stock: 40, icono: 'ladrillos.svg' }
        ])
        agregarAlCarrito(1)
        agregarAlCarrito(1)
        agregarAlCarrito(3)
    })

    it('calcula el total (2 x 6.990 + 5.490 = 19.470) con los precios que entrega el backend', async () => {
        render(
            <MemoryRouter>
                <SesionProvider>
                    <Carrito />
                </SesionProvider>
            </MemoryRouter>
        )
        expect(await screen.findByText('Martillo Carpintero')).toBeInTheDocument()
        expect(document.getElementById('total-carrito').textContent).toBe('19.470')
    })
})
