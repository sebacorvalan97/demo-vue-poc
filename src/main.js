import { createApp } from 'vue'
import App from './App.vue'

async function enableMocking() {

  if (!import.meta.env.DEV) {
    return
  }
  const { worker } = await import('./mocks/browser.js')
  return worker.start()
}

enableMocking().then(() => {
  createApp(App).mount('#app')
})