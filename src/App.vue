<script setup>
import { ref, computed, onMounted } from 'vue'

const tareas = ref([])
const filtro = ref('todas')
const nuevaTarea = ref({ titulo: '', descripcion: '' })
const tareaEnEdicion = ref(null)

const tareasFiltradas = computed(() => {
  if (filtro.value === 'todas') return tareas.value
  return tareas.value.filter(t => t.estado === filtro.value)
})

const totalTareas = computed(() => tareas.value.length)
const totalPendientes = computed(() => tareas.value.filter(t => t.estado === 'pendiente').length)
const totalCompletadas = computed(() => tareas.value.filter(t => t.estado === 'completada').length)

const cargarTareas = async () => {
  const res = await fetch('/tareas')
  tareas.value = await res.json()
}

const crearTarea = async () => {
  if (!nuevaTarea.value.titulo.trim()) {
    alert('El título es obligatorio')
    return
  }
  
  const res = await fetch('/tareas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevaTarea.value)
  })
  const tareaCreada = await res.json()
  tareas.value.push(tareaCreada)
  nuevaTarea.value = { titulo: '', descripcion: '' }
}

const eliminarTarea = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
    await fetch(`/tareas/${id}`, { method: 'DELETE' })
    tareas.value = tareas.value.filter(t => t.id !== id)
  }
}

const toggleEstado = async (tarea) => {
  const nuevoEstado = tarea.estado === 'pendiente' ? 'completada' : 'pendiente'
  await fetch(`/tareas/${tarea.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: nuevoEstado })
  })
  tarea.estado = nuevoEstado
}

const iniciarEdicion = (tarea) => {
  tareaEnEdicion.value = { ...tarea }
}

const guardarEdicion = async () => {
  if (!tareaEnEdicion.value.titulo.trim()) return
  
  await fetch(`/tareas/${tareaEnEdicion.value.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tareaEnEdicion.value)
  })
  
  const index = tareas.value.findIndex(t => t.id === tareaEnEdicion.value.id)
  tareas.value[index] = { ...tareaEnEdicion.value }
  tareaEnEdicion.value = null
}

onMounted(() => {
  cargarTareas()
})
</script>

<template>
  <main class="contenedor">
    <h1>Gestión de Tareas (Vue 3 Demo)</h1>

    <div class="contadores">
      <span>Total: <strong>{{ totalTareas }}</strong></span> | 
      <span>Pendientes: <strong>{{ totalPendientes }}</strong></span> | 
      <span>Completadas: <strong>{{ totalCompletadas }}</strong></span>
    </div>

    <!-- Modificador .prevent vital para que la página no se recargue -->
    <form @submit.prevent="crearTarea" class="formulario">
      <input v-model="nuevaTarea.titulo" type="text" placeholder="Título de la tarea" required />
      <input v-model="nuevaTarea.descripcion" type="text" placeholder="Descripción (Opcional)" />
      <button type="submit">Agregar Tarea</button>
    </form>

    <div class="filtros">
      <label><input type="radio" v-model="filtro" value="todas"> Todas</label>
      <label><input type="radio" v-model="filtro" value="pendiente"> Pendientes</label>
      <label><input type="radio" v-model="filtro" value="completada"> Completadas</label>
    </div>

    <ul class="lista-tareas">
      <li v-for="tarea in tareasFiltradas" :key="tarea.id" :class="{ completada: tarea.estado === 'completada' }">
        
        <div v-if="tareaEnEdicion?.id === tarea.id" class="modo-edicion">
          <input v-model="tareaEnEdicion.titulo" type="text" required>
          <input v-model="tareaEnEdicion.descripcion" type="text">
          <button @click="guardarEdicion">Guardar</button>
          <button @click="tareaEnEdicion = null">Cancelar</button>
        </div>

        <div v-else class="modo-lectura">
          <div>
            <input type="checkbox" :checked="tarea.estado === 'completada'" @change="toggleEstado(tarea)" />
            <strong>{{ tarea.titulo }}</strong>
            <p>{{ tarea.descripcion }}</p>
            <span class="etiqueta">{{ tarea.estado }}</span>
          </div>
          <div class="acciones">
            <button @click="iniciarEdicion(tarea)">Editar</button>
            <button @click="eliminarTarea(tarea.id)" class="btn-peligro">Eliminar</button>
          </div>
        </div>

      </li>
    </ul>
  </main>
</template>

<style scoped>
.contenedor { max-width: 600px; margin: 0 auto; font-family: sans-serif; }
.contadores { background: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
.formulario { display: flex; gap: 10px; margin-bottom: 20px; }
.formulario input { flex: 1; padding: 8px; }
.filtros { margin-bottom: 20px; display: flex; gap: 15px; }
.lista-tareas { list-style: none; padding: 0; }
.lista-tareas li { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px; }
.lista-tareas li.completada { background: #e8f5e9; opacity: 0.8; }
.completada strong { text-decoration: line-through; color: #666; }
.modo-lectura { display: flex; justify-content: space-between; align-items: center; }
.acciones { display: flex; gap: 10px; }
.btn-peligro { background: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer; }
.etiqueta { display: inline-block; margin-left: 10px; padding: 2px 6px; background: #eee; border-radius: 10px; font-size: 0.8em; }
</style>