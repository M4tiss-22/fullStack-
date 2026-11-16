import { describe, it, expect } from 'vitest'
import { validarCorreo } from './validaciones'

describe('utils/validaciones', () => {
    it('validarCorreo rechaza dominios no permitidos', () => {
        expect(validarCorreo('ana@hotmail.com')).toBe(false)
        expect(validarCorreo('sin-dominio')).toBe(false)
    })
})
