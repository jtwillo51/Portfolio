import { renderToString } from 'vue/server-renderer'
import { createApp } from '@/main'
import { renderHead } from '@/lib/head'

/** Re-exported so the prerender script reads the route list from one place. */
export { PRERENDER_ROUTES } from '@/router'

export interface Rendered {
  html: string
  head: string
}

export async function render(url: string): Promise<Rendered> {
  const { app, router } = createApp(true)
  await router.push(url)
  await router.isReady()
  const html = await renderToString(app)
  return { html, head: renderHead(router.currentRoute.value.meta, url) }
}
