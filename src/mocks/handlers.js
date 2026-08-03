import { http, HttpResponse } from 'msw'

let tareas = [
  { id: '1', titulo: 'Aprender Vue 3', descripcion: 'Estudiar Composition API', estado: 'completada', fechaCreacion: new Date().toISOString() },
  { id: '2', titulo: 'Armar demo comparativa', descripcion: 'Vue vs React vs Angular', estado: 'pendiente', fechaCreacion: new Date().toISOString() }
]

export const handlers = [
  http.get('/tareas', () => HttpResponse.json(tareas)),

  http.post('/tareas', async ({ request }) => {
    const nuevaTarea = await request.json()
    nuevaTarea.id = Math.random().toString(36).substring(2, 9)
    nuevaTarea.fechaCreacion = new Date().toISOString()
    nuevaTarea.estado = 'pendiente'
    tareas.push(nuevaTarea)
    return HttpResponse.json(nuevaTarea, { status: 201 })
  }),

  http.put('/tareas/:id', async ({ request, params }) => {
    const { id } = params
    const datosActualizados = await request.json()
    const index = tareas.findIndex(t => t.id === id)
    if (index > -1) {
      tareas[index] = { ...tareas[index], ...datosActualizados }
      return HttpResponse.json(tareas[index])
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.delete('/tareas/:id', ({ params }) => {
    tareas = tareas.filter(t => t.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  })
]