import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 3001, 
    host: true,
    open: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        material: resolve(__dirname, 'material-showcase.html'),
        components: resolve(__dirname, 'components-demo.html'),
        basic: resolve(__dirname, 'basic-examples.html')
        // Dodaj tutaj wszystkie swoje pliki HTML
      }
    }
  }
})