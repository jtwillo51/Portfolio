import { createApp as createClientApp, createSSRApp } from 'vue'
import App from '@/App.vue'
import { createAppRouter } from '@/router'
import { vReveal } from '@/directives/reveal'
import '@/assets/site.css'

/**
 * Shared factory: the client hydrates this, the prerender pass renders it.
 * `hydrate` is false only when there is no server markup to adopt (the dev
 * server and the single-file preview send an empty #app), so the client mounts
 * fresh instead of hydrating nothing and reporting a mismatch at the root.
 */
export function createApp(ssr = false, hydrate = true) {
  const app = hydrate ? createSSRApp(App) : createClientApp(App)
  const router = createAppRouter(ssr)
  app.use(router)
  app.directive('reveal', vReveal)
  return { app, router }
}
