# Ferretería Los Maestros (React + Vite)

Migración de la fase 1 (HTML, CSS y JS) a React.

## Cómo ejecutarlo
    npm install
    npm run dev

## Estructura
- `src/pages`: una página por cada .html de la fase 1
- `src/components`: menú, footer, menú lateral del admin, tarjeta de producto y formulario de usuario
- `src/servicios`: clientes REST (`api.js`, `auth.js`, `usuarios.js`, `productos.js`) y lógica de tienda/carrito (`tienda.js`)
- `src/data`: categorías del inicio, regiones/comunas y artículos del blog
- `src/utils`: validaciones y acceso a localStorage
- `src/context`: sesión del usuario (para el menú)

## Pruebas unitarias (Vitest + React Testing Library)
    npm test               # modo watch: se re-ejecuta al guardar
    npm run test:run       # una sola ejecución (útil para CI)
    npm run test:coverage  # con reporte de cobertura (carpeta coverage/)

- Los tests viven junto al código, con la terminación `.test.js` / `.test.jsx`.
- Configuración en `vite.config.js` (entorno `jsdom`) y `src/setupTests.js` (matchers de jest-dom).

## Conexión con el backend (usuarios-service y productos-service)
1. Levantar `usuarios-service` (puerto 8081). Swagger: http://localhost:8081/swagger-ui.html
2. Levantar `productos-service` (puerto 8082). Swagger: http://localhost:8082/swagger-ui.html
   Ambos usan MySQL y deben compartir el mismo `JWT_SECRET` (o el valor por defecto de `application.properties`).
3. `npm install` y `npm run dev` (puerto 5173, el único origen que permite el CORS del backend).
4. Las URLs se pueden cambiar con `VITE_API_USUARIOS_URL` y `VITE_API_PRODUCTOS_URL` (ver `.env.example`).

Cómo está armada la integración:
- `src/servicios/api.js`: dos clientes axios (`api` → usuarios, `apiProductos` → productos) con el mismo manejo de JWT. Agregan `Authorization: Bearer <accessToken>` a cada petición y, si el backend responde 401, renuevan el token con `/auth/refresh` (una sola vez aunque fallen varias peticiones) y repiten la petición; si no puede, cierra la sesión.
- `src/servicios/productos.js`: CRUD de productos, categorías y descuento de stock contra `productos-service`.
- `src/utils/useCarga.js`: hook que carga datos del backend y entrega `{ datos, cargando, error, recargar }`.
- `src/servicios/almacenSesion.js`: guarda `{ accessToken, refreshToken, usuario }` en localStorage (la sesión sobrevive a recargas).
- `src/context/SesionProvider.jsx`: al abrir la página recupera la sesión y la verifica con `GET /auth/me`.
- `src/App.jsx` → `RutaProtegida`: restringe pantallas por rol (ADMINISTRADOR, VENDEDOR, CLIENTE). La seguridad real la aplica el backend; el front solo oculta pantallas.

Usuarios de prueba (los crea el backend la primera vez): `admin@gmail.com / admin123`, `maria@duoc.cl / vend123` (vendedor), `juan@gmail.com / cli123` (cliente).

Permisos de productos (los aplica el backend; el frontend además oculta las pantallas):
| Acción | Quién |
|---|---|
| Ver catálogo y detalle | Público |
| Descontar stock (al comprar) | Cualquier usuario con sesión |
| Ver stock crítico | ADMINISTRADOR y VENDEDOR |
| Crear / editar / eliminar productos y categorías | Solo ADMINISTRADOR |

El carrito sigue guardándose en localStorage; la compra descuenta el stock en `productos-service` producto por producto.

Pendiente de conectar: órdenes (ordenes-service). Hoy la pantalla de órdenes del vendedor es un aviso.

## Conexión con los 5 microservicios
| Servicio | Puerto | Cliente (`servicios/api.js`) | Archivo de llamadas | Pantallas |
|---|---|---|---|---|
| usuarios | 8081 | `api` | `auth.js`, `usuarios.js` | Login, Registro, Admin → Usuarios |
| productos | 8082 | `apiProductos` | `productos.js`, `tienda.js` | Catálogo, Detalle, Admin → Productos, Vendedor → Productos |
| ordenes | 8083 | `apiOrdenes` | `ordenes.js` | Carrito (compra), Mis órdenes, Vendedor → Órdenes, Admin → Órdenes |
| contenido | 8084 | `apiContenido` | `contenido.js` | Blog, Contacto, Admin → Mensajes |
| inventario | 8085 | `apiInventario` | `inventario.js` | Admin → Inventario |

Todos los clientes agregan el JWT y renuevan la sesión solos (ver `servicios/api.js`). Las URLs se pueden cambiar con las variables de `.env.example`.

**Flujo de compra:** el carrito sigue en localStorage; al confirmar, `tienda.realizarCompra` envía `POST /ordenes` (solo ids, cantidades y dirección). `ordenes-service` valida el stock, toma los precios de productos, descuenta el stock y guarda la orden. El front ya no descuenta stock por su cuenta.

**Pantallas por rol:** cliente → tienda y "Mis órdenes"; vendedor → `/vendedor` (productos y órdenes, solo lectura); administrador → `/admin` (usuarios, productos, órdenes con cambio de estado, inventario y mensajes). Las rutas se protegen en `App.jsx` (`RutaProtegida`) y cada backend aplica los permisos reales con el JWT.
