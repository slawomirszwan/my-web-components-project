import { defineConfig } from 'vite'
//import { resolve } from 'path'
import { resolve, join, dirname } from 'path'

//import { readdirSync } from 'fs'
import { readdirSync, statSync } from 'fs'

/*
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
*/

//-----------------------------------
function getHtmlInputs() {
  function findHtmlFiles(dir) {
    let htmlFiles = []
    const entries = readdirSync(dir)
    
    entries.forEach(entry => {
      if (entry === 'node_modules' || entry === 'dist') return
      
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        htmlFiles = htmlFiles.concat(findHtmlFiles(fullPath))
      } else if (entry.endsWith('.html')) {
        htmlFiles.push(fullPath)
      }
    })
    
    return htmlFiles
  }
  
  const allHtmlFiles = findHtmlFiles(__dirname)
  const inputs = {}
  
  allHtmlFiles.forEach(file => {  
    // Użyj pełnej ścieżki względnej jako klucza    
    //const relativePath = file.replace(__dirname + '/', '')
    // Pobierz ścieżkę względną od katalogu projektu
    const relativePath = file.replace(__dirname + '/', '').replace(/\\/g, '/')

    // Normalizuj nazwę - zamień backslashe na forward slashe i usuń .html
    //const normalizedPath = relativePath.replace(/\\/g, '/')

    //const name = relativePath.replace('.html', '')
    //const name = normalizedPath.replace('.html', '')
    // Stwórz poprawną nazwę dla Vite - tylko alfanumeryczne znaki i myślniki
    let name = relativePath
      .replace('.html', '')
      .replace(/[\/\\]/g, '-')  // zamień wszystkie slashe na myślniki
      .replace(/[^a-zA-Z0-9_-]/g, '') // usuń wszystkie inne niebezpieczne znaki
    
    // Jeśli nazwa jest pusta, użyj 'index'
    if (!name) name = 'index'


    inputs[name] = resolve(file)
  })
  
  return inputs
}
//-----------------------------------


console.log(getHtmlInputs())

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