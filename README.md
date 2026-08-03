# PoC Vue — To-Do List

Demo técnica del grupo Vue para la Prueba de Concepto (PoC) del bloque temático "FE Frameworks" — Desarrollo de Software, UTN FRRo (2026).

Compara Vue frente a React y Angular mediante la implementación de una misma mini-aplicación equivalente en cada tecnología. El desarrollo completo del análisis (cómo funciona, aspectos técnicos, ecosistema, ventajas/desventajas) está en el informe del bloque.

## Integrantes

- Corvalan, Sebastian
- Sbuttoni, Candela
- Urquiza, Mariano

## Stack

- Vue 3 (Composition API) + TypeScript
- Vite (bundler y dev server)
- MSW (Mock Service Worker) — simula la API REST sin backend real

## Alcance funcional

Aplicación de gestión de tareas (to-do list):

- CRUD completo de tareas (crear, ver, editar, eliminar)
- Listado con filtro por estado (`pendiente` / `completada`)
- Consumo de una API REST mockeada (`GET /tareas`, `GET /tareas/:id`, `POST /tareas`, `PUT`/`PATCH /tareas/:id`, `DELETE /tareas/:id`)

Fuera de alcance (a propósito, para mantener la comparación acotada entre los 3 grupos): autenticación, roles, categorías/etiquetas y persistencia en base de datos real.

## Estructura del proyecto
```
src/
├── public/
│   └── mockServiceWorker.js       # El script interceptor que se generó al correr 'npx msw init'
├── src/
│   ├── mocks/                     # Tu API REST simulada
│   │   ├── browser.js             # Instancia y arranca el worker de MSW
│   │   └── handlers.js            # Contiene la lista en memoria y las rutas (GET, POST, PUT, DELETE)
│   ├── App.vue                    # Tu aplicación completa (formulario, listado, estilos y toda la lógica Vue)
│   └── main.js                    # El punto de entrada que inicia MSW y luego monta Vue
├── .gitignore                     # Archivos ignorados por git (creado por Vite)
├── index.html                     # Plantilla base (creada por Vite)
├── package.json                   # Listado de tus dependencias (Vue y MSW)
├── vite.config.js                 # Configuración de Vite
└── README.md                      # El archivo con el alcance funcional que generamos hace un momento
```
## Cómo correrlo

```bash
npm install
npm run dev
```

Abre en `http://localhost:5173`. La API mockeada arranca automáticamente al cargar la app (no requiere backend ni base de datos).

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el entorno de desarrollo |


## Documentación relacionada

- Informe completo de la PoC (bloque "FE Frameworks"): React, Vue y Angular — comparación conjunta y conclusiones.
- Repositorio de la cátedra: [utnfrrodsw/poc](https://github.com/utnfrrodsw/poc)
