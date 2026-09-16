import { createApp } from '@/main'
import { applyHead } from '@/lib/head'

// Prerendered pages arrive with markup to adopt; an empty #app has none.
const hydrate = document.getElementById('app')?.firstElementChild != null
const { app, router } = createApp(false, hydrate)

// The prerendered HTML already carries the correct head; keep it in step from
// the first client-side navigation onwards.
router.afterEach((to) => {
  applyHead(to.meta, to.path)
})

router.isReady().then(() => app.mount('#app'))
