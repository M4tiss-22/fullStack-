import '@testing-library/jest-dom'

class MemoriaStorage {
    #datos = new Map()
    get length() { return this.#datos.size }
    key(indice) { return [...this.#datos.keys()][indice] ?? null }
    getItem(clave) { return this.#datos.has(String(clave)) ? this.#datos.get(String(clave)) : null }
    setItem(clave, valor) { this.#datos.set(String(clave), String(valor)) }
    removeItem(clave) { this.#datos.delete(String(clave)) }
    clear() { this.#datos.clear() }
}

let localStorageRoto = false
try {
    localStorageRoto = typeof globalThis.localStorage?.clear !== 'function'
} catch {
    localStorageRoto = true
}

if (localStorageRoto) {
    Object.defineProperty(globalThis, 'localStorage', {
        value: new MemoriaStorage(),
        configurable: true,
        writable: true
    })
}
