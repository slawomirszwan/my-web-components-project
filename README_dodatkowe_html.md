=================================
wiele stron uruchamianych
!!!!!!!!!!!!!!!
Vite domyślnie obsługuje multi-page applications. Oto jak skonfigurować wiele stron HTML:



http://localhost:3000/index.html
http://localhost:3000/material-showcase.html
http://localhost:3000/components-demo.html

uruchamianie
----------------------------
przez skrypt w package.json

{
  "scripts": {
    "dev": "vite",
    "dev:material": "vite --open /material-showcase.html",
    "dev:components": "vite --open /components-demo.html",
    "dev:basic": "vite --open /basic-examples.html",
    "build": "vite build",
    "preview": "vite preview"
  }
}

==============================
# Domyślnie otwiera index.html
npm run dev

# Lub bezpośrednio
npm run dev:material
npm run dev:components

-----------
Build dla produkcji
bash
npm run build
Po buildzie w folderze dist/ znajdą się wszystkie strony:

index.html

material-showcase.html

components-demo.html

basic-examples.html

--------------------------------------------------------
mam taki vite.config.js i nie zbuildowało wszystkich html do \dist
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3001, 
    host: true,
    open: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    outDir: 'dist'
  }
})
poprawiony vite!!!!!!!!!!!!

-----------------------
Poprawiony vite.config.js
javascript
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

----------------------------------------------
ale nie wykrywa sam wszystkich html!!!!!!!!!!!



 Alternatywna konfiguracja - automatyczne wykrywanie HTML
Jeśli chcesz żeby Vite automatycznie wykrywał wszystkie pliki HTML:

javascript
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
3. Prostsza konfiguracja - ręczna lista
javascript
import { defineConfig } from 'vite'

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
        main: 'index.html',
        material: 'material-showcase.html',
        components: 'components-demo.html',
        basic: 'basic-examples.html'
      }
    }
  }
})


=======================================================
Przebuduj projekt
bash
# Usuń stary dist folder
rm -rf dist

# Przebuduj
npm run build

# Sprawdź czy wszystkie pliki są w dist
ls -la dist/
6. Sprawdź wynik budowania
Po npm run build w folderze dist/ powinieneś zobaczyć:

text
dist/
├── index.html
├── material-showcase.html
├── components-demo.html
├── basic-examples.html
├── assets/
│   ├── index-[hash].js
│   ├── material-showcase-[hash].js
│   └── ...
7. Jeśli nadal nie działa - rozszerzona konfiguracja
javascript
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 3001, 
    host: true,
    open: '/index.html'
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
      },
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  // Upewnij się że publiczny folder jest poprawnie ustawiony
  publicDir: 'public'
})
8. Sprawdzenie czy Vite widzi pliki
Możesz tymczasowo dodać logowanie żeby sprawdzić konfigurację:

javascript
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { existsSync } from 'fs'

const htmlFiles = {
  main: 'index.html',
  material: 'material-showcase.html', 
  components: 'components-demo.html',
  basic: 'basic-examples.html'
}

// Sprawdź czy pliki istnieją
Object.entries(htmlFiles).forEach(([key, file]) => {
  if (!existsSync(resolve(__dirname, file))) {
    console.warn(`⚠️  Plik ${file} nie istnieje!`)
  } else {
    console.log(`✅ Znaleziono ${file}`)
  }
})

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
      input: Object.fromEntries(
        Object.entries(htmlFiles).map(([key, file]) => [
          key, 
          resolve(__dirname, file)
        ])
      )
    }
  }
})
Najważniejsze: Użyj pierwszej konfiguracji z rollupOptions.input i upewnij się że wszystkie pliki HTML są w głównym folderze projektu. Po tym npm run build powinien zbudować wszystkie strony. 🚀