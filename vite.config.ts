import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const preview = mode === 'preview'
  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    base: preview ? './' : '/',
    build: {
      // One stylesheet for the whole site: it is small enough that a second
      // round trip costs more than the bytes it would save.
      cssCodeSplit: false,
      target: 'es2022',
      outDir: preview ? 'dist-preview' : 'dist',
      // The preview is packed into a single HTML file, so everything has to
      // land in one chunk with nothing left to fetch.
      assetsInlineLimit: preview ? 1_000_000_000 : 4096,
      rollupOptions: preview ? { output: { inlineDynamicImports: true } } : {},
    },
  }
})
