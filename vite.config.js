import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'

// Funkcja do automatycznego znajdowania wszystkich plików HTML
function getHtmlInputs() {
  const files = readdirSync(__dirname)
  const htmlFiles = files.filter(file => file.endsWith('.html'))
  
  const inputs = {}
  htmlFiles.forEach(file => {
    const name = file.replace('.html', '')
    inputs[name] = resolve(__dirname, file)
  })
  
  return inputs
}

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
      input: getHtmlInputs()
    }
  }
})