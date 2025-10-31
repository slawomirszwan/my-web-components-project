projekt w vite do obsługi   js  a potem do obsługi czystego web component w js
ze strukturą dla web componentów i innych kodów js
Oto kompletna struktura projektu Vite do obsługi Web Components w czystym JavaScript:

Struktura projektu
text
my-web-components-project/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── my-button/
│   │   │   │   ├── my-button.js
│   │   │   │   └── my-button.css
│   │   │   ├── my-card/
│   │   │   │   ├── my-card.js
│   │   │   │   └── my-card.css
│   │   │   └── index.js
│   │   ├── layout/
│   │   │   ├── app-header/
│   │   │   │   ├── app-header.js
│   │   │   │   └── app-header.css
│   │   │   └── index.js
│   │   └── index.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── index.js
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   ├── main.js
│   └── index.html
├── package.json
├── vite.config.js
└── README.md
Pliki konfiguracyjne
package.json
json
{
  "name": "web-components-project",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
vite.config.js
javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    outDir: 'dist'
  }
})
Pliki źródłowe
src/index.html
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Components Project</title>
    <link rel="stylesheet" href="/src/styles/global.css">
</head>
<body>
    <div id="app">
        <app-header title="Moja Aplikacja Web Components"></app-header>
        
        <main class="container">
            <h1>Demo Web Components</h1>
            
            <section class="demo-section">
                <h2>Przyciski</h2>
                <my-button variant="primary">Primary Button</my-button>
                <my-button variant="secondary">Secondary Button</my-button>
                <my-button variant="danger">Danger Button</my-button>
            </section>
            
            <section class="demo-section">
                <h2>Karty</h2>
                <my-card 
                    title="Przykładowa karta" 
                    description="To jest przykładowa karta stworzona jako Web Component">
                    <span slot="footer">Stopka karty</span>
                </my-card>
            </section>
        </main>
    </div>

    <script type="module" src="/src/main.js"></script>
</body>
</html>
src/main.js
javascript
// Import wszystkich komponentów
import './components/index.js';

// Kod inicjalizacyjny aplikacji
console.log('Aplikacja Web Components uruchomiona!');

// Przykładowe API do zarządzania komponentami
export const ComponentManager = {
  registeredComponents: new Set(),
  
  register(componentName) {
    this.registeredComponents.add(componentName);
    console.log(`Zarejestrowano komponent: ${componentName}`);
  },
  
  listComponents() {
    return Array.from(this.registeredComponents);
  }
};
Komponenty
src/components/ui/my-button/my-button.js
javascript
import './my-button.css';

class MyButton extends HTMLElement {
  static observedAttributes = ['variant', 'disabled'];
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }
  
  connectedCallback() {
    this.addEventListener('click', this.handleClick);
    ComponentManager.register('my-button');
  }
  
  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
  
  handleClick = (event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    this.dispatchEvent(new CustomEvent('button-click', {
      detail: { message: 'Button clicked!' },
      bubbles: true,
      composed: true
    }));
  }
  
  get variant() {
    return this.getAttribute('variant') || 'primary';
  }
  
  get disabled() {
    return this.hasAttribute('disabled');
  }
  
  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
  
  render() {
    const variant = this.variant;
    const isDisabled = this.disabled;
    
    this.shadowRoot.innerHTML = `
      <button class="btn ${variant}" ?disabled="${isDisabled}">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('my-button', MyButton);
export default MyButton;
src/components/ui/my-button/my-button.css
css
:host {
  display: inline-block;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background-color: var(--color-primary);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.btn.secondary {
  background-color: var(--color-secondary);
  color: white;
}

.btn.secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-dark);
}

.btn.danger {
  background-color: var(--color-danger);
  color: white;
}

.btn.danger:hover:not(:disabled) {
  background-color: var(--color-danger-dark);
}
src/components/ui/my-card/my-card.js
javascript
import './my-card.css';

class MyCard extends HTMLElement {
  static observedAttributes = ['title', 'description'];
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.render();
    ComponentManager.register('my-card');
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
  
  get title() {
    return this.getAttribute('title') || '';
  }
  
  get description() {
    return this.getAttribute('description') || '';
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3>${this.title}</h3>
        </div>
        <div class="card-body">
          <p>${this.description}</p>
          <slot name="content"></slot>
        </div>
        <div class="card-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('my-card', MyCard);
export default MyCard;
src/components/ui/my-card/my-card.css
css
:host {
  display: block;
  margin: 1rem 0;
}

.card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.card-body {
  padding: 1.5rem;
}

.card-body p {
  margin: 0 0 1rem 0;
  color: var(--color-text);
}

.card-footer {
  padding: 1rem 1.5rem;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
}
src/components/layout/app-header/app-header.js
javascript
import './app-header.css';

class AppHeader extends HTMLElement {
  static observedAttributes = ['title'];
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.render();
    ComponentManager.register('app-header');
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
  
  get title() {
    return this.getAttribute('title') || 'Aplikacja';
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <header class="app-header">
        <div class="container">
          <h1>${this.title}</h1>
          <nav class="nav">
            <slot name="navigation"></slot>
          </nav>
        </div>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);
export default AppHeader;
src/components/layout/app-header/app-header.css
css
:host {
  display: block;
}

.app-header {
  background-color: var(--color-primary);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav {
  display: flex;
  gap: 1rem;
}
Pliki indeksujące
src/components/ui/index.js
javascript
// Import i eksport wszystkich komponentów UI
export { default as MyButton } from './my-button/my-button.js';
export { default as MyCard } from './my-card/my-card.js';

// Automatyczna rejestracja komponentów
import './my-button/my-button.js';
import './my-card/my-card.js';
src/components/layout/index.js
javascript
// Import i eksport wszystkich komponentów layoutu
export { default as AppHeader } from './app-header/app-header.js';

// Automatyczna rejestracja komponentów
import './app-header/app-header.js';
src/components/index.js
javascript
// Główny plik eksportujący wszystkie komponenty
export * from './ui/index.js';
export * from './layout/index.js';

// Import dla automatycznej rejestracji
import './ui/index.js';
import './layout/index.js';
Utils
src/utils/helpers.js
javascript
// Pomocnicze funkcje dla Web Components
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function generateId(prefix = 'comp') {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export function dispatchCustomEvent(element, eventName, detail = {}) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true
  });
  element.dispatchEvent(event);
}
src/utils/constants.js
javascript
// Stałe dla aplikacji
export const EVENTS = {
  BUTTON_CLICK: 'button-click',
  CARD_SELECT: 'card-select',
  FORM_SUBMIT: 'form-submit'
};

export const CSS_CLASSES = {
  LOADING: 'loading',
  DISABLED: 'disabled',
  ACTIVE: 'active'
};
src/utils/index.js
javascript
// Eksport wszystkich utilitów
export * from './helpers.js';
export * from './constants.js';
Style
src/styles/variables.css
css
:root {
  /* Kolory */
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-secondary: #6c757d;
  --color-secondary-dark: #545b62;
  --color-danger: #dc3545;
  --color-danger-dark: #c82333;
  --color-success: #28a745;
  --color-warning: #ffc107;
  
  /* Kolory tekstu */
  --color-text: #333;
  --color-text-light: #666;
  --color-text-lighter: #999;
  
  /* Tła */
  --color-background: #f8f9fa;
  --color-background-dark: #e9ecef;
  
  /* Obramowania */
  --color-border: #dee2e6;
  --color-border-dark: #adb5bd;
  
  /* Cienie */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Zaokrąglenia */
  --border-radius-sm: 4px;
  --border-radius: 6px;
  --border-radius-lg: 8px;
  
  /* Przejścia */
  --transition: all 0.2s ease;
}
src/styles/global.css
css
@import './variables.css';

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--color-background);
  color: var(--color-text);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.demo-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.demo-section h2 {
  margin-top: 0;
  color: var(--color-primary);
}
Instrukcje uruchomienia
Zainstaluj zależności:

bash
npm install
Uruchom serwer deweloperski:

bash
npm run dev
Budowanie na produkcję:

bash
npm run build
Podgląd zbudowanej wersji:

bash
npm run preview
Kluczowe cechy tej struktury:
Modularność - każdy komponent w osobnej katalogu z własnymi stylami

Automatyczna rejestracja - komponenty rejestrują się automatycznie

Manager komponentów - centralne zarządzanie zarejestrowanymi komponentami

Zmienne CSS - spójny system designu

TypeScript gotowy - łatwe rozszerzenie o TypeScript

Hot reload - Vite zapewnia szybki development

Ta struktura jest skalowalna i łatwa w utrzymaniu, idealna dla projektów opartych o Web Components.

Nie można odnaleźć tej strony localhost
Nie znaleziono strony sieci Web dla adresu internetowego: http://localhost:3000/
Problem z localhost:3000 jest częsty. Oto jak go rozwiązać krok po kroku:

1. Sprawdź czy Vite jest uruchomiony
Najpierw upewnij się, że serwer deweloperski działa:

bash
# Sprawdź czy proces Vite jest uruchomiony
ps aux | grep vite

# Lub w Windows:
tasklist | findstr vite
2. Rozwiązania problemu
Rozwiązanie A: Zmień port
Zmień konfigurację Vite na inny port:

vite.config.js

javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3001, // Zmień na inny port
    host: true, // Dodaj to
    open: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    outDir: 'dist'
  }
})
Rozwiązanie B: Popraw ścieżki w index.html
src/index.html - popraw ścieżki:

html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Components Project</title>
    <link rel="stylesheet" href="./styles/global.css">
</head>
<body>
    <div id="app">
        <app-header title="Moja Aplikacja Web Components"></app-header>
        
        <main class="container">
            <h1>Demo Web Components</h1>
            
            <section class="demo-section">
                <h2>Przyciski</h2>
                <my-button variant="primary">Primary Button</my-button>
                <my-button variant="secondary">Secondary Button</my-button>
                <my-button variant="danger">Danger Button</my-button>
            </section>
            
            <section class="demo-section">
                <h2>Karty</h2>
                <my-card 
                    title="Przykładowa karta" 
                    description="To jest przykładowa karta stworzona jako Web Component">
                    <span slot="footer">Stopka karty</span>
                </my-card>
            </section>
        </main>
    </div>

    <script type="module" src="/src/main.js"></script>
</body>
</html>
3. Szybka naprawa - uproszczona wersja
Stwórz minimalną wersję do testów:

package.json

json
{
  "name": "web-components-project",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
vite.config.js

javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: true
  }
})
index.html (w głównym katalogu)

html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Components Test</title>
    <style>
        :root {
            --color-primary: #007bff;
            --color-secondary: #6c757d;
            --color-danger: #dc3545;
        }
        
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        
        .btn {
            padding: 10px 20px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
        }
        
        .primary { background-color: var(--color-primary); }
        .secondary { background-color: var(--color-secondary); }
        .danger { background-color: var(--color-danger); }
    </style>
</head>
<body>
    <h1>Test Web Components</h1>
    
    <my-button variant="primary">Test Button</my-button>
    <my-button variant="secondary">Secondary</my-button>
    
    <script type="module">
        class MyButton extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            
            connectedCallback() {
                const variant = this.getAttribute('variant') || 'primary';
                this.shadowRoot.innerHTML = `
                    <button class="btn ${variant}">
                        <slot></slot>
                    </button>
                `;
            }
        }

        customElements.define('my-button', MyButton);
        console.log('Web Component zarejestrowany!');
    </script>
</body>
</html>
4. Procedura uruchomienia krok po kroku
bash
# 1. Stwórz nowy projekt
mkdir my-web-components
cd my-web-components

# 2. Zainicjuj package.json
npm init -y

# 3. Zainstaluj Vite
npm install vite --save-dev

# 4. Stwórz pliki według uproszczonej struktury
# (użyj kodu powyżej)

# 5. Uruchom serwer
npm run dev
5. Sprawdź alternatywne adresy
Vite często udostępnia aplikację pod kilkoma adresami:

http://localhost:3000

http://127.0.0.1:3000

http://192.168.x.x:3000 (twój lokalny IP)

6. Rozwiązanie problemów z portem
Jeśli port 3000 jest zajęty:

bash
# Znajdź co używa portu 3000
lsof -i :3000

# W Windows:
netstat -ano | findstr :3000

# Zabij proces jeśli potrzebujesz
kill -9 [PID]
7. Ostateczne rozwiązanie
Jeśli nadal masz problemy, użyj prostego serwera HTTP:

bash
# Zainstaluj globalnie http-server
npm install -g http-server

# Uruchom w katalogu projektu
http-server -p 3000
Spróbuj najpierw Rozwiązanie A (zmiana portu na 3001), ponieważ port 3000 często bywa zajęty przez inne aplikacje.

problemem było że nie było index.html w głownym folderze , albo nie tak było w vite.config.js
Masz rację! To częsty problem. W Vite index.html musi być w głównym folderze projektu, nie w src. Oto poprawna struktura:

Poprawna struktura projektu Vite
text
my-web-components-project/
├── index.html ✨ (MUSI być w głównym folderze)
├── package.json
├── vite.config.js
├── public/
│   └── favicon.ico
└── src/
    ├── components/
    │   ├── ui/
    │   │   ├── my-button/
    │   │   │   ├── my-button.js
    │   │   │   └── my-button.css
    │   │   └── my-card/
    │   │       ├── my-card.js
    │   │       └── my-card.css
    │   └── layout/
    │       └── app-header/
    │           ├── app-header.js
    │           └── app-header.css
    ├── utils/
    │   └── helpers.js
    ├── styles/
    │   ├── global.css
    │   └── variables.css
    └── main.js
Poprawione pliki konfiguracyjne
index.html (w głównym folderze)
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Components Project</title>
    <link rel="stylesheet" href="/src/styles/global.css">
</head>
<body>
    <div id="app">
        <app-header title="Moja Aplikacja Web Components"></app-header>
        
        <main class="container">
            <h1>Demo Web Components</h1>
            
            <section class="demo-section">
                <h2>Przyciski</h2>
                <my-button variant="primary">Primary Button</my-button>
                <my-button variant="secondary">Secondary Button</my-button>
                <my-button variant="danger">Danger Button</my-button>
            </section>
            
            <section class="demo-section">
                <h2>Karty</h2>
                <my-card 
                    title="Przykładowa karta" 
                    description="To jest przykładowa karta stworzona jako Web Component">
                    <span slot="footer">Stopka karty</span>
                </my-card>
            </section>
        </main>
    </div>

    <script type="module" src="/src/main.js"></script>
</body>
</html>
vite.config.js
javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: true,  // Pozwala na dostęp z innych urządzeń
    open: true   // Automatycznie otwiera przeglądarkę
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
})
Szybka naprawa - przenieś index.html
Jeśli masz już projekt, po prostu przenieś index.html z src/ do głównego folderu:

bash
# Przenieś index.html do głównego folderu
mv src/index.html ./

# Upewnij się że struktura wygląda tak:
ls -la
# index.html, package.json, vite.config.js, src/, public/
Minimalna działająca wersja do testu
index.html (w głównym folderze):

html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Components Test</title>
</head>
<body>
    <h1>Test Web Components - DZIAŁA! 🎉</h1>
    
    <my-button variant="primary">Primary Button</my-button>
    <my-button variant="secondary">Secondary Button</my-button>

    <script type="module">
        // Prosty komponent do testu
        class MyButton extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            
            connectedCallback() {
                const variant = this.getAttribute('variant') || 'primary';
                this.shadowRoot.innerHTML = `
                    <style>
                        button {
                            padding: 12px 24px;
                            margin: 5px;
                            border: none;
                            border-radius: 6px;
                            color: white;
                            cursor: pointer;
                            font-size: 16px;
                        }
                        .primary { background: #007bff; }
                        .secondary { background: #6c757d; }
                    </style>
                    <button class="${variant}">
                        <slot></slot>
                    </button>
                `;
            }
        }

        customElements.define('my-button', MyButton);
        console.log('Vite powinien działać!');
    </script>
</body>
</html>
Procedura naprawy krok po kroku
bash
# 1. Przejdź do folderu projektu
cd my-web-components-project

# 2. Sprawdź strukturę
ls -la
# Powinieneś zobaczyć: index.html, package.json, src/

# 3. Jeśli index.html jest w src, przenieś go
mv src/index.html ./

# 4. Uruchom ponownie
npm run dev
Dlaczego to działa?
Vite domyślnie szuka index.html w głównym katalogu projektu. To punkt wejścia aplikacji.

Jeśli nadal masz problemy, sprawdź:

Czy index.html jest w głównym folderze?

Czy vite.config.js ma poprawną konfigurację?

Czy port 3000 nie jest zajęty? (spróbuj zmienić na 3001)

Teraz powinno działać! 🚀

a czy do projektu można dodac jeszcze trzy komponenty uzywające biblioteki lit komponenty oparte na wygląd google materials  ładny wygląd nowoczesny
Tak, absolutnie! Można dodać komponenty korzystające z Lit do projektu. Oto jak to zintegrować:

1. Instalacja zależności
bash
npm install lit @material/web
2. Struktura projektu z komponentami Lit
text
my-web-components-project/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── components/
    │   ├── ui/           # Czyste Web Components
    │   ├── material/     # Komponenty Material z Lit
    │   │   ├── material-button/
    │   │   │   ├── material-button.js
    │   │   │   └── material-button.css
    │   │   ├── material-card/
    │   │   │   ├── material-card.js
    │   │   │   └── material-card.css
    │   │   ├── material-textfield/
    │   │   │   ├── material-textfield.js
    │   │   │   └── material-textfield.css
    │   │   └── index.js
    │   └── index.js
    ├── styles/
    │   ├── global.css
    │   ├── variables.css
    │   └── material-theme.css
    └── main.js
3. Komponenty Material z Lit
src/components/material/material-button/material-button.js
javascript
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

export class MaterialButton extends LitElement {
  static properties = {
    variant: { type: String },
    disabled: { type: Boolean },
    elevated: { type: Boolean },
    loading: { type: Boolean }
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    .btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      height: 40px;
      border: none;
      border-radius: 20px;
      font-family: 'Roboto', sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      outline: none;
    }

    .btn:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    /* Filled Button */
    .filled {
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }

    .filled:hover:not(:disabled) {
      background-color: var(--md-sys-color-primary-dark);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    /* Outlined Button */
    .outlined {
      background-color: transparent;
      color: var(--md-sys-color-primary);
      border: 1px solid var(--md-sys-color-outline);
    }

    .outlined:hover:not(:disabled) {
      background-color: var(--md-sys-color-primary-container);
    }

    /* Text Button */
    .text {
      background-color: transparent;
      color: var(--md-sys-color-primary);
    }

    .text:hover:not(:disabled) {
      background-color: var(--md-sys-color-primary-container);
    }

    /* Elevated Button */
    .elevated {
      background-color: var(--md-sys-color-surface-container-low);
      color: var(--md-sys-color-primary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .elevated:hover:not(:disabled) {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    }

    /* Ripple effect */
    .ripple {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.7);
      transform: scale(0);
      animation: ripple 0.6s linear;
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    /* Loading spinner */
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  constructor() {
    super();
    this.variant = 'filled';
    this.disabled = false;
    this.elevated = false;
    this.loading = false;
  }

  _handleClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Ripple effect
    this._createRipple(e);

    this.dispatchEvent(new CustomEvent('material-click', {
      detail: { variant: this.variant },
      bubbles: true,
      composed: true
    }));
  }

  _createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  }

  render() {
    const classes = {
      btn: true,
      [this.variant]: true,
      elevated: this.elevated && this.variant === 'filled'
    };

    return html`
      <button 
        class=${classMap(classes)}
        ?disabled=${this.disabled || this.loading}
        @click=${this._handleClick}
      >
        ${this.loading ? html`<div class="spinner"></div>` : ''}
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('material-button', MaterialButton);
src/components/material/material-card/material-card.js
javascript
import { LitElement, html, css } from 'lit';

export class MaterialCard extends LitElement {
  static properties = {
    elevated: { type: Boolean },
    outlined: { type: Boolean },
    image: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: var(--md-sys-color-surface);
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      font-family: 'Roboto', sans-serif;
    }

    .elevated {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 
                  0 1px 2px rgba(0, 0, 0, 0.06);
    }

    .elevated:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 
                  0 2px 4px rgba(0, 0, 0, 0.06);
    }

    .outlined {
      border: 1px solid var(--md-sys-color-outline);
      box-shadow: none;
    }

    .card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .card-content {
      padding: 16px;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 500;
      margin: 0 0 8px 0;
      color: var(--md-sys-color-on-surface);
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: var(--md-sys-color-on-surface-variant);
      margin: 0 0 12px 0;
    }

    .card-text {
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--md-sys-color-on-surface);
      margin: 0;
    }

    .card-actions {
      padding: 8px 16px 16px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
  `;

  constructor() {
    super();
    this.elevated = true;
    this.outlined = false;
  }

  render() {
    const classes = {
      card: true,
      elevated: this.elevated && !this.outlined,
      outlined: this.outlined
    };

    return html`
      <div class=${Object.keys(classes).filter(key => classes[key]).join(' ')}>
        ${this.image ? html`
          <img class="card-image" src=${this.image} alt="Card image">
        ` : ''}
        
        <div class="card-content">
          <h3 class="card-title">
            <slot name="title">Card Title</slot>
          </h3>
          <div class="card-subtitle">
            <slot name="subtitle"></slot>
          </div>
          <div class="card-text">
            <slot name="content"></slot>
          </div>
        </div>
        
        <div class="card-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('material-card', MaterialCard);
src/components/material/material-textfield/material-textfield.js
javascript
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

export class MaterialTextField extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    type: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean },
    required: { type: Boolean },
    error: { type: String },
    helper: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
    }

    .text-field {
      position: relative;
      margin: 16px 0;
    }

    .input-container {
      position: relative;
      border-radius: 4px 4px 0 0;
      background: var(--md-sys-color-surface-container-highest);
      padding-top: 16px;
    }

    .input-container:focus-within {
      background: var(--md-sys-color-surface-container-highest);
    }

    .input-container.filled {
      background: var(--md-sys-color-surface-container-highest);
    }

    .input-container.error {
      background: var(--md-sys-color-error-container);
    }

    label {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--md-sys-color-on-surface-variant);
      font-size: 16px;
      pointer-events: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .floating label {
      top: 8px;
      font-size: 12px;
      color: var(--md-sys-color-primary);
    }

    .error label {
      color: var(--md-sys-color-error);
    }

    input {
      width: 100%;
      padding: 8px 16px 8px 16px;
      border: none;
      border-bottom: 1px solid var(--md-sys-color-outline);
      background: transparent;
      font-size: 16px;
      color: var(--md-sys-color-on-surface);
      outline: none;
      transition: border-color 0.2s;
    }

    input:focus {
      border-bottom-color: var(--md-sys-color-primary);
      border-bottom-width: 2px;
      margin-bottom: -1px;
    }

    input:disabled {
      color: var(--md-sys-color-on-surface-disabled);
      border-bottom-color: var(--md-sys-color-on-surface-disabled);
    }

    .error input {
      border-bottom-color: var(--md-sys-color-error);
    }

    .focus-ring {
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--md-sys-color-primary);
      transform: scaleX(0);
      transition: transform 0.2s;
    }

    .text-field:focus-within .focus-ring {
      transform: scaleX(1);
    }

    .helper-text {
      font-size: 12px;
      margin: 4px 16px 0;
      color: var(--md-sys-color-on-surface-variant);
    }

    .error-text {
      color: var(--md-sys-color-error);
    }

    .character-counter {
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
      text-align: right;
      margin: 4px 16px 0;
    }
  `;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.type = 'text';
    this.placeholder = '';
    this.disabled = false;
    this.required = false;
    this.error = '';
  }

  _handleInput(e) {
    this.value = e.target.value;
    
    this.dispatchEvent(new CustomEvent('material-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  _handleFocus() {
    this.dispatchEvent(new CustomEvent('material-focus'));
  }

  _handleBlur() {
    this.dispatchEvent(new CustomEvent('material-blur'));
  }

  render() {
    const hasValue = this.value.length > 0;
    const hasError = this.error.length > 0;
    const characterCount = this.value.length;

    const containerClasses = {
      'input-container': true,
      'filled': hasValue,
      'error': hasError,
      'floating': hasValue
    };

    return html`
      <div class="text-field">
        <div class=${classMap(containerClasses)}>
          <label>${this.label}${this.required ? '*' : ''}</label>
          <input
            type=${this.type}
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?required=${this.required}
            @input=${this._handleInput}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
          >
          <div class="focus-ring"></div>
        </div>
        
        ${hasError ? html`
          <div class="helper-text error-text">${this.error}</div>
        ` : this.helper ? html`
          <div class="helper-text">${this.helper}</div>
        ` : ''}
        
        ${this.type === 'text' || this.type === 'textarea' ? html`
          <div class="character-counter">${characterCount}</div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('material-textfield', MaterialTextField);
4. Pliki indeksujące i stylów
src/components/material/index.js
javascript
export { MaterialButton } from './material-button/material-button.js';
export { MaterialCard } from './material-card/material-card.js';
export { MaterialTextField } from './material-textfield/material-textfield.js';

// Automatyczna rejestracja
import './material-button/material-button.js';
import './material-card/material-card.js';
import './material-textfield/material-textfield.js';
src/components/index.js
javascript
// Eksport wszystkich komponentów
export * from './ui/index.js';
export * from './material/index.js';
export * from './layout/index.js';

// Automatyczna rejestracja
import './ui/index.js';
import './material/index.js';
import './layout/index.js';
src/styles/material-theme.css
css
:root {
  /* Material Design 3 Color System */
  --md-sys-color-primary: #6750A4;
  --md-sys-color-primary-dark: #5a4a8c;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #EADDFF;
  --md-sys-color-on-primary-container: #21005D;
  
  --md-sys-color-secondary: #625B71;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #E8DEF8;
  --md-sys-color-on-secondary-container: #1D192B;
  
  --md-sys-color-surface: #FFFBFE;
  --md-sys-color-on-surface: #1C1B1F;
  --md-sys-color-surface-variant: #E7E0EC;
  --md-sys-color-on-surface-variant: #49454F;
  --md-sys-color-surface-container-highest: #E6E0E9;
  
  --md-sys-color-error: #BA1A1A;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #FFDAD6;
  --md-sys-color-on-error-container: #410002;
  
  --md-sys-color-outline: #79747E;
  --md-sys-color-outline-variant: #CAC4D0;
  
  --md-sys-color-shadow: #000000;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-primary: #D0BCFF;
    --md-sys-color-on-primary: #381E72;
    --md-sys-color-primary-container: #4F378B;
    --md-sys-color-on-primary-container: #EADDFF;
    
    --md-sys-color-surface: #1C1B1F;
    --md-sys-color-on-surface: #E6E1E5;
    --md-sys-color-surface-variant: #49454F;
    --md-sys-color-on-surface-variant: #CAC4D0;
  }
}
src/styles/global.css (zaktualizowany)
css
@import './variables.css';
@import './material-theme.css';
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.demo-section {
  margin: 2rem 0;
  padding: 2rem;
  background: var(--md-sys-color-surface-container-low);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  margin-top: 0;
  color: var(--md-sys-color-primary);
  font-weight: 500;
}

.component-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-top: 1.5rem;
}
5. Przykład użycia w index.html
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Material Web Components</title>
    <link rel="stylesheet" href="/src/styles/global.css">
</head>
<body>
    <div id="app">
        <app-header title="Material Design + Lit"></app-header>
        
        <main class="container">
            <h1>Material Design Components with Lit</h1>
            
            <section class="demo-section">
                <h2>Material Buttons</h2>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <material-button variant="filled">Filled</material-button>
                    <material-button variant="outlined">Outlined</material-button>
                    <material-button variant="text">Text</material-button>
                    <material-button variant="filled" elevated>Elevated</material-button>
                    <material-button variant="filled" loading>Loading</material-button>
                </div>
            </section>
            
            <section class="demo-section">
                <h2>Material Cards</h2>
                <div class="component-grid">
                    <material-card elevated>
                        <span slot="title">Beautiful Sunset</span>
                        <span slot="subtitle">Nature Photography</span>
                        <p slot="content">Experience the breathtaking beauty of nature with this stunning sunset capture.</p>
                        <div slot="actions">
                            <material-button variant="text">Share</material-button>
                            <material-button variant="text">Explore</material-button>
                        </div>
                    </material-card>
                    
                    <material-card outlined>
                        <span slot="title">Modern Design</span>
                        <span slot="subtitle">UI/UX Principles</span>
                        <p slot="content">Learn about the latest design trends and principles in modern web development.</p>
                        <div slot="actions">
                            <material-button variant="text">Read More</material-button>
                        </div>
                    </material-card>
                </div>
            </section>
            
            <section class="demo-section">
                <h2>Material Text Fields</h2>
                <div style="max-width: 400px;">
                    <material-textfield 
                        label="Email" 
                        type="email" 
                        placeholder="Enter your email"
                        helper="We'll never share your email">
                    </material-textfield>
                    
                    <material-textfield 
                        label="Password" 
                        type="password"
                        required
                        error="Password is required">
                    </material-textfield>
                </div>
            </section>
        </main>
    </div>

    <script type="module" src="/src/main.js"></script>
</body>
</html>
Teraz masz nowoczesne, Material Design komponenty z biblioteką Lit, które świetnie komponują się z czystymi Web Components! 🎨

index.html uruchomiony przez run mało efektowny
Masz rację! Poprawmy index.html żeby był bardziej efektowny i pokazywał pełnię możliwości komponentów. Oto znacznie lepsza wersja:

Poprawiony index.html
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Material Web Components Showcase</title>
    <link rel="stylesheet" href="/src/styles/global.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div id="app">
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1 class="hero-title">🎨 Material Design</h1>
                <p class="hero-subtitle">Nowoczesne Web Components z Lit</p>
                <div class="hero-actions">
                    <material-button variant="filled" elevated class="hero-btn">
                        <span slot="icon" class="material-icons">rocket_launch</span>
                        Rozpocznij
                    </material-button>
                    <material-button variant="outlined" class="hero-btn">
                        <span slot="icon" class="material-icons">code</span>
                        GitHub
                    </material-button>
                </div>
            </div>
            <div class="hero-visual">
                <div class="floating-cards">
                    <material-card elevated class="card-1">
                        <span slot="title">Button</span>
                        <div slot="content" style="padding: 1rem 0;">
                            <material-button variant="filled">Click me</material-button>
                        </div>
                    </material-card>
                    <material-card elevated class="card-2">
                        <span slot="title">Input</span>
                        <div slot="content" style="padding: 1rem 0;">
                            <material-textfield label="Email" type="email"></material-textfield>
                        </div>
                    </material-card>
                    <material-card elevated class="card-3">
                        <span slot="title">Card</span>
                        <p slot="content">Beautiful component</p>
                    </material-card>
                </div>
            </div>
        </section>

        <!-- Components Showcase -->
        <main class="container">
            <!-- Buttons Section -->
            <section class="showcase-section">
                <h2>✨ Przyciski Material</h2>
                <p class="section-description">Różne warianty przycisków z efektami ripple</p>
                
                <div class="components-grid">
                    <div class="component-demo">
                        <h3>Filled Buttons</h3>
                        <div class="demo-group">
                            <material-button variant="filled">Primary</material-button>
                            <material-button variant="filled" elevated>Elevated</material-button>
                            <material-button variant="filled" loading>Loading</material-button>
                        </div>
                    </div>
                    
                    <div class="component-demo">
                        <h3>Outlined Buttons</h3>
                        <div class="demo-group">
                            <material-button variant="outlined">Outlined</material-button>
                            <material-button variant="outlined" disabled>Disabled</material-button>
                        </div>
                    </div>
                    
                    <div class="component-demo">
                        <h3>Text Buttons</h3>
                        <div class="demo-group">
                            <material-button variant="text">Text</material-button>
                            <material-button variant="text">
                                <span slot="icon" class="material-icons">favorite</span>
                                Z ikoną
                            </material-button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Cards Section -->
            <section class="showcase-section">
                <h2>🎴 Karty Material</h2>
                <p class="section-description">Elastyczne karty z różnymi stylami</p>
                
                <div class="cards-grid">
                    <material-card elevated class="feature-card">
                        <span slot="title">💎 Elevated Card</span>
                        <span slot="subtitle">Z cieniem i hover efektem</span>
                        <p slot="content">Karta z elewacją która podnosi się po najechaniu. Idealna na kafelki i listy.</p>
                        <div slot="actions">
                            <material-button variant="text">Anuluj</material-button>
                            <material-button variant="filled">Akceptuj</material-button>
                        </div>
                    </material-card>

                    <material-card outlined class="feature-card">
                        <span slot="title">📱 Outlined Card</span>
                        <span slot="subtitle">Czysty design z obramowaniem</span>
                        <p slot="content">Perfekcyjna na formularze i sekcje które wymagają delikatnego rozgraniczenia.</p>
                        <div slot="actions">
                            <material-button variant="text">Więcej</material-button>
                        </div>
                    </material-card>

                    <material-card elevated class="feature-card image-card">
                        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop" 
                             slot="image" alt="Technology" class="card-image">
                        <span slot="title">🚀 Z obrazkiem</span>
                        <span slot="subtitle">Wizualnie atrakcyjna</span>
                        <p slot="content">Karty wspierają obrazy w nagłówku dla lepszego wizualnego oddziaływania.</p>
                        <div slot="actions">
                            <material-button variant="text">Udostępnij</material-button>
                            <material-button variant="text">Explore</material-button>
                        </div>
                    </material-card>
                </div>
            </section>

            <!-- Forms Section -->
            <section class="showcase-section">
                <h2>📝 Formularze Material</h2>
                <p class="section-description">Polformularza z floating labels i walidacją</p>
                
                <div class="form-demo">
                    <material-card elevated style="max-width: 500px; margin: 0 auto;">
                        <span slot="title">📧 Formularz Kontaktowy</span>
                        <div slot="content">
                            <material-textfield 
                                label="Imię i nazwisko"
                                required
                                helper="Wprowadź swoje pełne imię">
                            </material-textfield>
                            
                            <material-textfield 
                                label="Email"
                                type="email"
                                required
                                error="Proszę wprowadzić poprawny email">
                            </material-textfield>
                            
                            <material-textfield 
                                label="Wiadomość"
                                type="textarea"
                                helper="Maksymalnie 500 znaków">
                            </material-textfield>
                            
                            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                                <material-button variant="outlined" style="flex: 1;">Wyczyść</material-button>
                                <material-button variant="filled" elevated style="flex: 1;">Wyślij</material-button>
                            </div>
                        </div>
                    </material-card>
                </div>
            </section>

            <!-- Interactive Demo -->
            <section class="showcase-section">
                <h2>🎮 Interaktywna Demo</h2>
                <p class="section-description">Zobacz komponenty w akcji</p>
                
                <div class="interactive-demo">
                    <material-card elevated style="max-width: 600px; margin: 0 auto;">
                        <span slot="title">Licznik Kliknięć</span>
                        <div slot="content" style="text-align: center; padding: 2rem;">
                            <h3 style="font-size: 3rem; margin: 0; color: var(--md-sys-color-primary);" id="counter">0</h3>
                            <p style="color: var(--md-sys-color-on-surface-variant);">kliknięć</p>
                            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                                <material-button variant="filled" id="increment-btn">
                                    <span slot="icon" class="material-icons">add</span>
                                    Zwiększ
                                </material-button>
                                <material-button variant="outlined" id="reset-btn">
                                    <span slot="icon" class="material-icons">refresh</span>
                                    Reset
                                </material-button>
                            </div>
                        </div>
                    </material-card>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <p>🛠️ Zbudowane z Vite + Lit + Material Design</p>
                <p>Nowoczesne Web Components w czystym JavaScript</p>
            </div>
        </footer>
    </div>

    <script type="module" src="/src/main.js"></script>
    <script type="module">
        // Interactive counter
        let count = 0;
        const counterElement = document.getElementById('counter');
        const incrementBtn = document.getElementById('increment-btn');
        const resetBtn = document.getElementById('reset-btn');

        incrementBtn.addEventListener('material-click', () => {
            count++;
            counterElement.textContent = count;
            counterElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                counterElement.style.transform = 'scale(1)';
            }, 150);
        });

        resetBtn.addEventListener('material-click', () => {
            count = 0;
            counterElement.textContent = count;
        });

        // Add some animation to hero cards
        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.floating-cards material-card');
            cards.forEach((card, index) => {
                card.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite alternate`;
            });
        });
    </script>

    <style>
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-primary-container) 100%);
            color: var(--md-sys-color-on-primary);
            padding: 4rem 2rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            min-height: 80vh;
        }

        .hero-content {
            max-width: 500px;
        }

        .hero-title {
            font-size: 3.5rem;
            font-weight: 700;
            margin: 0 0 1rem 0;
            background: linear-gradient(45deg, #fff, #e0e0e0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-subtitle {
            font-size: 1.5rem;
            margin: 0 0 2rem 0;
            opacity: 0.9;
        }

        .hero-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .hero-btn {
            padding: 0 2rem;
        }

        .hero-btn [slot="icon"] {
            margin-right: 0.5rem;
        }

        /* Floating Cards Animation */
        .floating-cards {
            position: relative;
            height: 300px;
        }

        .floating-cards material-card {
            position: absolute;
            width: 250px;
        }

        .card-1 {
            top: 0;
            left: 0;
            transform: rotate(-5deg);
        }

        .card-2 {
            top: 50px;
            left: 150px;
            transform: rotate(3deg);
        }

        .card-3 {
            top: 120px;
            left: 50px;
            transform: rotate(-2deg);
        }

        @keyframes float {
            from { transform: translateY(0px) rotate(var(--rotate, 0deg)); }
            to { transform: translateY(-20px) rotate(var(--rotate, 0deg)); }
        }

        /* Showcase Sections */
        .showcase-section {
            margin: 4rem 0;
            padding: 3rem 0;
            border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        .showcase-section:last-of-type {
            border-bottom: none;
        }

        .showcase-section h2 {
            font-size: 2.5rem;
            margin: 0 0 1rem 0;
            background: linear-gradient(45deg, var(--md-sys-color-primary), var(--md-sys-color-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .section-description {
            font-size: 1.2rem;
            color: var(--md-sys-color-on-surface-variant);
            margin: 0 0 3rem 0;
        }

        /* Components Grid */
        .components-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 3rem;
        }

        .component-demo {
            background: var(--md-sys-color-surface-container-low);
            padding: 2rem;
            border-radius: 12px;
            border: 1px solid var(--md-sys-color-outline-variant);
        }

        .component-demo h3 {
            margin: 0 0 1.5rem 0;
            color: var(--md-sys-color-primary);
        }

        .demo-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: center;
        }

        /* Cards Grid */
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }

        .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-4px);
        }

        .image-card .card-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            margin-bottom: 1rem;
        }

        /* Form Demo */
        .form-demo {
            display: flex;
            justify-content: center;
        }

        /* Footer */
        .footer {
            background: var(--md-sys-color-surface-container-high);
            color: var(--md-sys-color-on-surface-variant);
            text-align: center;
            padding: 3rem 2rem;
            margin-top: 4rem;
        }

        .footer p {
            margin: 0.5rem 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero {
                grid-template-columns: 1fr;
                text-align: center;
                padding: 2rem 1rem;
            }
            
            .hero-title {
                font-size: 2.5rem;
            }
            
            .hero-actions {
                justify-content: center;
            }
            
            .floating-cards {
                display: none;
            }
            
            .components-grid {
                grid-template-columns: 1fr;
            }
            
            .cards-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Material Icons in buttons */
        material-button [slot="icon"] {
            font-size: 18px;
            margin-right: 8px;
        }
    </style>
</body>
</html>
Dodaj też lepsze style globalne
src/styles/global.css
css
@import './variables.css';
@import './material-theme.css';
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  line-height: 1.6;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Selection color */
::selection {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--md-sys-color-surface-container-low);
}

::-webkit-scrollbar-thumb {
  background: var(--md-sys-color-outline-variant);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--md-sys-color-outline);
}

/* Focus outlines */
:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

/* Loading animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
Teraz strona będzie wyglądać efektownie i nowocześnie z:

🎨 Hero section z gradientem i animowanymi kartami

✨ Pokaz komponentów w atrakcyjnych gridach

🎴 Karty z obrazkami i hover efektami

📝 Formularz demo w material style

🎮 Interaktywny licznik pokazujący działanie komponentów

📱 W pełni responsywny design

🚀 Animacje i przejścia dla lepszego UX

Uruchom npm run dev i zobacz różnicę! 🎉

jak mam3 rózne index.html index2.html index3.html  to jak uzyskać żeby vite obsługiwało możliwość uruchomienia 3 stron www
Vite domyślnie obsługuje multi-page applications. Oto jak skonfigurować wiele stron HTML:

1. Struktura projektu z wieloma stronami
text
my-web-components-project/
├── package.json
├── vite.config.js
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   ├── styles/
│   └── main.js
├── index.html          # Strona główna
├── material-showcase.html  # Strona 2 - pokaz Material
├── components-demo.html    # Strona 3 - demo komponentów
└── basic-examples.html     # Strona 4 - podstawowe przykłady
2. Konfiguracja Vite dla wielu stron
vite.config.js
javascript
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    open: '/index.html'  // Otwiera stronę główną domyślnie
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        material: resolve(__dirname, 'material-showcase.html'),
        components: resolve(__dirname, 'components-demo.html'),
        basic: resolve(__dirname, 'basic-examples.html')
      }
    }
  }
})
3. Pliki HTML
index.html (Strona główna)
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Components - Strona Główna</title>
    <link rel="stylesheet" href="/src/styles/global.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div id="app">
        <section class="hero">
            <div class="hero-content">
                <h1>🚀 Web Components Showcase</h1>
                <p>Odkryj potęgę nowoczesnych komponentów webowych</p>
                
                <div class="navigation-cards">
                    <a href="material-showcase.html" class="nav-card">
                        <div class="nav-icon">🎨</div>
                        <h3>Material Design</h3>
                        <p>Nowoczesne komponenty z Lit i Material Design</p>
                    </a>
                    
                    <a href="components-demo.html" class="nav-card">
                        <div class="nav-icon">⚡</div>
                        <h3>Demo Komponentów</h3>
                        <p>Interaktywne przykłady użycia komponentów</p>
                    </a>
                    
                    <a href="basic-examples.html" class="nav-card">
                        <div class="nav-icon">🔧</div>
                        <h3>Podstawowe Przykłady</h3>
                        <p>Czyste Web Components bez bibliotek</p>
                    </a>
                </div>
            </div>
        </section>
    </div>

    <script type="module" src="/src/main.js"></script>
    
    <style>
        .hero {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            padding: 2rem;
        }

        .hero-content h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
        }

        .hero-content p {
            font-size: 1.5rem;
            margin-bottom: 3rem;
            opacity: 0.9;
        }

        .navigation-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1000px;
        }

        .nav-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 2rem;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .nav-card:hover {
            transform: translateY(-10px);
            background: rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .nav-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .nav-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .nav-card p {
            opacity: 0.8;
            line-height: 1.6;
        }
    </style>
</body>
</html>
material-showcase.html
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Material Design Showcase</title>
    <link rel="stylesheet" href="/src/styles/global.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-button">
            <span class="material-icons">arrow_back</span>
            Strona Główna
        </a>
        <h1>🎨 Material Design Components</h1>
    </div>

    <main class="container">
        <!-- Tutaj wklej całą zawartość z poprzedniego material-showcase -->
        <section class="showcase-section">
            <h2>✨ Przyciski Material</h2>
            <!-- ... reszta contentu material ... -->
        </section>
    </main>

    <script type="module" src="/src/main.js"></script>
    
    <style>
        .page-header {
            background: linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-primary-container) 100%);
            color: white;
            padding: 2rem;
            margin-bottom: 3rem;
        }

        .back-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
        }

        .back-button:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .page-header h1 {
            margin: 0;
            font-size: 2.5rem;
        }
    </style>
</body>
</html>
components-demo.html
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Components Demo</title>
    <link rel="stylesheet" href="/src/styles/global.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-button">
            <span class="material-icons">arrow_back</span>
            Strona Główna
        </a>
        <h1>⚡ Interactive Demo</h1>
        <p>Zobacz komponenty w akcji z rzeczywistymi przykładami</p>
    </div>

    <main class="container">
        <section class="demo-section">
            <h2>🎯 Dashboard Demo</h2>
            
            <div class="dashboard-grid">
                <material-card elevated class="stat-card">
                    <span slot="title">📊 Statystyki</span>
                    <div slot="content">
                        <div class="stat-value" id="clickCount">0</div>
                        <div class="stat-label">Kliknięć przycisku</div>
                    </div>
                    <div slot="actions">
                        <material-button variant="filled" id="incrementStat">
                            <span slot="icon" class="material-icons">add</span>
                            Zwiększ
                        </material-button>
                    </div>
                </material-card>

                <material-card elevated class="form-card">
                    <span slot="title">👤 Formularz użytkownika</span>
                    <div slot="content">
                        <material-textfield 
                            label="Imię"
                            id="firstName"
                            helper="Wprowadź swoje imię">
                        </material-textfield>
                        
                        <material-textfield 
                            label="Nazwisko"
                            id="lastName"
                            helper="Wprowadź swoje nazwisko">
                        </material-textfield>
                        
                        <material-textfield 
                            label="Email"
                            type="email"
                            id="email"
                            helper="Wprowadź poprawny email">
                        </material-textfield>
                    </div>
                    <div slot="actions">
                        <material-button variant="outlined" id="resetForm">Reset</material-button>
                        <material-button variant="filled" id="submitForm">Zapisz</material-button>
                    </div>
                </material-card>
            </div>
        </section>

        <section class="demo-section">
            <h2>🎮 Gra w Liczby</h2>
            <material-card elevated style="max-width: 500px; margin: 0 auto;">
                <span slot="title">Odgadnij liczbę</span>
                <div slot="content" style="text-align: center; padding: 2rem;">
                    <p>Wybierz liczbę od 1 do 10:</p>
                    <div class="number-buttons" id="numberButtons">
                        <!-- Buttons will be generated by JS -->
                    </div>
                    <p id="gameMessage" style="margin-top: 1rem; min-height: 2rem;"></p>
                </div>
            </material-card>
        </section>
    </main>

    <script type="module" src="/src/main.js"></script>
    <script type="module">
        // Interactive functionality
        let clickCount = 0;
        const clickCountElement = document.getElementById('clickCount');
        const incrementButton = document.getElementById('incrementStat');
        
        incrementButton.addEventListener('material-click', () => {
            clickCount++;
            clickCountElement.textContent = clickCount;
            clickCountElement.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                clickCountElement.style.animation = '';
            }, 300);
        });

        // Form handling
        const resetButton = document.getElementById('resetForm');
        const submitButton = document.getElementById('submitForm');
        
        resetButton.addEventListener('material-click', () => {
            document.querySelectorAll('material-textfield').forEach(field => {
                field.value = '';
            });
        });
        
        submitButton.addEventListener('material-click', () => {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            alert(`Witaj ${firstName} ${lastName}! Formularz został zapisany.`);
        });

        // Number game
        const numberButtonsContainer = document.getElementById('numberButtons');
        const gameMessage = document.getElementById('gameMessage');
        const secretNumber = Math.floor(Math.random() * 10) + 1;
        
        for (let i = 1; i <= 10; i++) {
            const button = document.createElement('material-button');
            button.variant = 'outlined';
            button.textContent = i;
            button.addEventListener('material-click', () => {
                if (i === secretNumber) {
                    gameMessage.textContent = '🎉 Bravo! Odgadłeś liczbę!';
                    gameMessage.style.color = 'var(--md-sys-color-success)';
                } else {
                    gameMessage.textContent = '❌ Spróbuj jeszcze raz!';
                    gameMessage.style.color = 'var(--md-sys-color-error)';
                }
            });
            numberButtonsContainer.appendChild(button);
        }
    </script>
    
    <style>
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .stat-card {
            text-align: center;
        }

        .stat-value {
            font-size: 3rem;
            font-weight: bold;
            color: var(--md-sys-color-primary);
            margin: 1rem 0;
        }

        .stat-label {
            color: var(--md-sys-color-on-surface-variant);
        }

        .number-buttons {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
            margin: 1rem 0;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    </style>
</body>
</html>
4. Sposoby uruchamiania różnych stron
A. Przez bezpośrednie URL
text
http://localhost:3000/index.html
http://localhost:3000/material-showcase.html
http://localhost:3000/components-demo.html
B. Przez nawigację w aplikacji
Dodaj linki między stronami jak w przykładzie powyżej.

C. Przez skrypty package.json
json
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
5. Uruchamianie
bash
# Domyślnie otwiera index.html
npm run dev

# Lub bezpośrednio
npm run dev:material
npm run dev:components
6. Build dla produkcji
bash
npm run build
Po buildzie w folderze dist/ znajdą się wszystkie strony:

index.html

material-showcase.html

components-demo.html

basic-examples.html

Teraz masz pełną multi-page aplikację z Vite! 🚀

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
Masz rację! Problem jest w konfiguracji - brakuje rollupOptions.input które mówi Vite które pliki HTML mają być zbudowane. Oto poprawiona konfiguracja:

1. Poprawiony vite.config.js
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
2. Alternatywna konfiguracja - automatyczne wykrywanie HTML
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
4. Sprawdź strukturę plików
Upewnij się że masz wszystkie pliki HTML w głównym folderze:

text
project/
├── index.html
├── material-showcase.html
├── components-demo.html
├── basic-examples.html
├── vite.config.js
├── package.json
└── src/
    └── ...
5. Przebuduj projekt
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

jak dodać switch na stronie components-demo.html
Oto jak dodać switch/checkbox w stylu Material Design do strony components-demo.html:

1. Najpierw stwórz komponent Material Switch
src/components/material/material-switch/material-switch.js
javascript
import { LitElement, html, css } from 'lit';

export class MaterialSwitch extends LitElement {
  static properties = {
    checked: { type: Boolean },
    disabled: { type: Boolean },
    label: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
    }

    .switch-container {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 0;
      cursor: pointer;
    }

    .switch-container.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .switch-label {
      font-size: 16px;
      color: var(--md-sys-color-on-surface);
      user-select: none;
    }

    .switch {
      position: relative;
      width: 52px;
      height: 32px;
    }

    .track {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 14px;
      background-color: var(--md-sys-color-surface-container-highest);
      border-radius: 7px;
      transition: all 0.2s ease;
    }

    .thumb {
      position: absolute;
      top: 50%;
      left: 2px;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      background-color: var(--md-sys-color-outline);
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease;
    }

    /* Checked state */
    .switch.checked .track {
      background-color: var(--md-sys-color-primary);
      opacity: 0.5;
    }

    .switch.checked .thumb {
      background-color: var(--md-sys-color-primary);
      left: calc(100% - 22px);
    }

    /* Focus state */
    .switch:focus-within .thumb {
      box-shadow: 0 0 0 12px rgba(103, 80, 164, 0.12);
    }

    /* Hover states */
    .switch-container:not(.disabled):hover .thumb {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }

    .switch-container:not(.disabled):hover .switch.checked .thumb {
      box-shadow: 0 2px 4px rgba(103, 80, 164, 0.4);
    }

    /* Hidden native checkbox */
    .native-control {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      z-index: 1;
    }

    .switch-container.disabled .native-control {
      cursor: not-allowed;
    }
  `;

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
    this.label = '';
  }

  _handleChange(e) {
    if (this.disabled) return;

    this.checked = e.target.checked;
    
    this.dispatchEvent(new CustomEvent('material-change', {
      detail: { 
        checked: this.checked,
        value: this.checked
      },
      bubbles: true,
      composed: true
    }));
  }

  _handleClick(e) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    const containerClasses = {
      'switch-container': true,
      'disabled': this.disabled
    };

    const switchClasses = {
      'switch': true,
      'checked': this.checked
    };

    return html`
      <label class="${Object.keys(containerClasses).filter(key => containerClasses[key]).join(' ')}">
        <div class="${Object.keys(switchClasses).filter(key => switchClasses[key]).join(' ')}">
          <div class="track"></div>
          <div class="thumb"></div>
          <input 
            type="checkbox" 
            class="native-control"
            ?checked=${this.checked}
            ?disabled=${this.disabled}
            @change=${this._handleChange}
            @click=${this._handleClick}
          >
        </div>
        ${this.label ? html`<span class="switch-label">${this.label}</span>` : ''}
      </label>
    `;
  }
}

customElements.define('material-switch', MaterialSwitch);
2. Zarejestruj komponent w material/index.js
javascript
// ... istniejący kod ...
export { MaterialSwitch } from './material-switch/material-switch.js';

// Automatyczna rejestracja
import './material-switch/material-switch.js';
3. Teraz dodaj switch do components-demo.html
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Components Demo</title>
    <link rel="stylesheet" href="/src/styles/global.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-button">
            <span class="material-icons">arrow_back</span>
            Strona Główna
        </a>
        <h1>⚡ Interactive Demo</h1>
        <p>Zobacz komponenty w akcji z rzeczywistymi przykładami</p>
    </div>

    <main class="container">
        <!-- Nowa sekcja z Switch -->
        <section class="demo-section">
            <h2>🔘 Switche Material Design</h2>
            
            <div class="switches-demo">
                <material-card elevated>
                    <span slot="title">Ustawienia</span>
                    <div slot="content">
                        <div class="setting-item">
                            <material-switch 
                                label="Powiadomienia push" 
                                checked
                                id="notificationsSwitch">
                            </material-switch>
                        </div>
                        
                        <div class="setting-item">
                            <material-switch 
                                label="Ciemny motyw" 
                                id="darkModeSwitch">
                            </material-switch>
                        </div>
                        
                        <div class="setting-item">
                            <material-switch 
                                label="Automatyczne aktualizacje" 
                                checked
                                id="autoUpdateSwitch">
                            </material-switch>
                        </div>
                        
                        <div class="setting-item">
                            <material-switch 
                                label="Tryb offline" 
                                disabled
                                id="offlineSwitch">
                            </material-switch>
                        </div>
                    </div>
                </material-card>

                <material-card elevated class="preview-card">
                    <span slot="title">Podgląd na żywo</span>
                    <div slot="content">
                        <div id="switchStatus" class="status-message">
                            Status: Oczekiwanie na akcję...
                        </div>
                        <div class="preview-actions">
                            <material-button variant="outlined" id="resetSwitches">
                                Resetuj switche
                            </material-button>
                        </div>
                    </div>
                </material-card>
            </div>
        </section>

        <!-- Sekcja Dashboard Demo -->
        <section class="demo-section">
            <h2>🎯 Dashboard Demo</h2>
            
            <div class="dashboard-grid">
                <material-card elevated class="stat-card">
                    <span slot="title">📊 Statystyki</span>
                    <div slot="content">
                        <div class="stat-value" id="clickCount">0</div>
                        <div class="stat-label">Kliknięć przycisku</div>
                    </div>
                    <div slot="actions">
                        <material-button variant="filled" id="incrementStat">
                            <span slot="icon" class="material-icons">add</span>
                            Zwiększ
                        </material-button>
                    </div>
                </material-card>

                <material-card elevated class="form-card">
                    <span slot="title">👤 Formularz użytkownika</span>
                    <div slot="content">
                        <material-textfield 
                            label="Imię"
                            id="firstName"
                            helper="Wprowadź swoje imię">
                        </material-textfield>
                        
                        <material-textfield 
                            label="Nazwisko"
                            id="lastName"
                            helper="Wprowadź swoje nazwisko">
                        </material-textfield>
                        
                        <material-textfield 
                            label="Email"
                            type="email"
                            id="email"
                            helper="Wprowadź poprawny email">
                        </material-textfield>
                    </div>
                    <div slot="actions">
                        <material-button variant="outlined" id="resetForm">Reset</material-button>
                        <material-button variant="filled" id="submitForm">Zapisz</material-button>
                    </div>
                </material-card>
            </div>
        </section>

        <!-- Sekcja Gry -->
        <section class="demo-section">
            <h2>🎮 Gra w Liczby</h2>
            <material-card elevated style="max-width: 500px; margin: 0 auto;">
                <span slot="title">Odgadnij liczbę</span>
                <div slot="content" style="text-align: center; padding: 2rem;">
                    <p>Wybierz liczbę od 1 do 10:</p>
                    <div class="number-buttons" id="numberButtons">
                        <!-- Buttons will be generated by JS -->
                    </div>
                    <p id="gameMessage" style="margin-top: 1rem; min-height: 2rem;"></p>
                </div>
            </material-card>
        </section>
    </main>

    <script type="module" src="/src/main.js"></script>
    <script type="module">
        // Switch functionality
        const switches = {
            notifications: document.getElementById('notificationsSwitch'),
            darkMode: document.getElementById('darkModeSwitch'),
            autoUpdate: document.getElementById('autoUpdateSwitch'),
            offline: document.getElementById('offlineSwitch')
        };

        const switchStatus = document.getElementById('switchStatus');
        const resetSwitchesBtn = document.getElementById('resetSwitches');

        // Obsługa zmian switchy
        Object.entries(switches).forEach(([key, switchElement]) => {
            if (switchElement) {
                switchElement.addEventListener('material-change', (e) => {
                    const action = e.detail.checked ? 'włączony' : 'wyłączony';
                    const switchNames = {
                        notifications: 'Powiadomienia push',
                        darkMode: 'Ciemny motyw',
                        autoUpdate: 'Automatyczne aktualizacje',
                        offline: 'Tryb offline'
                    };
                    
                    switchStatus.innerHTML = `
                        <span style="color: var(--md-sys-color-primary);">
                            ✅ ${switchNames[key]} został ${action}
                        </span>
                    `;
                    
                    // Symulacja efektów
                    if (key === 'darkMode') {
                        document.body.style.backgroundColor = e.detail.checked 
                            ? '#1a1a1a' 
                            : 'var(--md-sys-color-surface)';
                    }
                });
            }
        });

        // Reset switchy
        resetSwitchesBtn.addEventListener('material-click', () => {
            switches.notifications.checked = true;
            switches.darkMode.checked = false;
            switches.autoUpdate.checked = true;
            document.body.style.backgroundColor = 'var(--md-sys-color-surface)';
            switchStatus.textContent = 'Status: Wszystkie switche zresetowane';
        });

        // Interactive functionality - istniejący kod
        let clickCount = 0;
        const clickCountElement = document.getElementById('clickCount');
        const incrementButton = document.getElementById('incrementStat');
        
        incrementButton.addEventListener('material-click', () => {
            clickCount++;
            clickCountElement.textContent = clickCount;
            clickCountElement.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                clickCountElement.style.animation = '';
            }, 300);
        });

        // Form handling
        const resetButton = document.getElementById('resetForm');
        const submitButton = document.getElementById('submitForm');
        
        resetButton.addEventListener('material-click', () => {
            document.querySelectorAll('material-textfield').forEach(field => {
                field.value = '';
            });
        });
        
        submitButton.addEventListener('material-click', () => {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            alert(`Witaj ${firstName} ${lastName}! Formularz został zapisany.`);
        });

        // Number game
        const numberButtonsContainer = document.getElementById('numberButtons');
        const gameMessage = document.getElementById('gameMessage');
        const secretNumber = Math.floor(Math.random() * 10) + 1;
        
        for (let i = 1; i <= 10; i++) {
            const button = document.createElement('material-button');
            button.variant = 'outlined';
            button.textContent = i;
            button.addEventListener('material-click', () => {
                if (i === secretNumber) {
                    gameMessage.textContent = '🎉 Bravo! Odgadłeś liczbę!';
                    gameMessage.style.color = 'var(--md-sys-color-success)';
                } else {
                    gameMessage.textContent = '❌ Spróbuj jeszcze raz!';
                    gameMessage.style.color = 'var(--md-sys-color-error)';
                }
            });
            numberButtonsContainer.appendChild(button);
        }
    </script>
    
    <style>
        .switches-demo {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 2rem 0;
        }

        .setting-item {
            padding: 1rem 0;
            border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        .setting-item:last-child {
            border-bottom: none;
        }

        .preview-card {
            display: flex;
            flex-direction: column;
        }

        .status-message {
            background: var(--md-sys-color-surface-container-high);
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .preview-actions {
            margin-top: auto;
            padding-top: 1rem;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .stat-card {
            text-align: center;
        }

        .stat-value {
            font-size: 3rem;
            font-weight: bold;
            color: var(--md-sys-color-primary);
            margin: 1rem 0;
        }

        .stat-label {
            color: var(--md-sys-color-on-surface-variant);
        }

        .number-buttons {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
            margin: 1rem 0;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        /* Responsywność */
        @media (max-width: 768px) {
            .switches-demo {
                grid-template-columns: 1fr;
            }
        }
    </style>
</body>
</html>
4. Dodaj kolory do theme.css
src/styles/material-theme.css (dodaj na końcu)
css
:root {
  /* ... istniejące kolory ... */
  
  /* Success color for switch feedback */
  --md-sys-color-success: #4CAF50;
  --md-sys-color-success-container: #C8E6C9;
  --md-sys-color-on-success-container: #1B5E20;
}
Teraz masz pełnoprawny switch Material Design z:

✅ Animacjami przejść

✅ Stanem disabled

✅ Obsługą klawiatury

✅ Efektem ripple/focus

✅ Interaktywnym podglądem

✅ Responsywnym designem

Switch będzie reagował na kliknięcia i pokazywał status w czasie rzeczywistym! 🎛️

A  <md-switch selected></md-switch> z @material/web działa
Świetnie! Jeśli @material/web już działa, to użyjmy gotowych komponentów Material. Oto jak dodać switch z @material/web do components-demo.html:

1. Zainstaluj @material/web (jeśli jeszcze nie)
bash
npm install @material/web
2. Zaktualizowany components-demo.html z md-switch
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Components Demo</title>
    <link rel="stylesheet" href="/src/styles/global.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Material Web Styles -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-button">
            <span class="material-icons">arrow_back</span>
            Strona Główna
        </a>
        <h1>⚡ Interactive Demo</h1>
        <p>Zobacz komponenty w akcji z rzeczywistymi przykładami</p>
    </div>

    <main class="container">
        <!-- Sekcja z Switch Material Web -->
        <section class="demo-section">
            <h2>🔘 Material Web Switches</h2>
            
            <div class="switches-demo">
                <material-card elevated>
                    <span slot="title">Ustawienia Aplikacji</span>
                    <div slot="content">
                        <div class="setting-item">
                            <label class="setting-label">
                                <md-switch selected id="notificationsSwitch"></md-switch>
                                <div class="label-content">
                                    <span class="label-title">Powiadomienia push</span>
                                    <span class="label-description">Otrzymuj powiadomienia na bieżąco</span>
                                </div>
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label class="setting-label">
                                <md-switch id="darkModeSwitch"></md-switch>
                                <div class="label-content">
                                    <span class="label-title">Ciemny motyw</span>
                                    <span class="label-description">Przełącz na ciemny wygląd aplikacji</span>
                                </div>
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label class="setting-label">
                                <md-switch selected id="autoUpdateSwitch"></md-switch>
                                <div class="label-content">
                                    <span class="label-title">Automatyczne aktualizacje</span>
                                    <span class="label-description">Aktualizuj aplikację w tle</span>
                                </div>
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label class="setting-label">
                                <md-switch disabled id="offlineSwitch"></md-switch>
                                <div class="label-content">
                                    <span class="label-title">Tryb offline</span>
                                    <span class="label-description">Dostępne wkrótce</span>
                                </div>
                            </label>
                        </div>

                        <div class="setting-item">
                            <label class="setting-label">
                                <md-switch icons id="iconsSwitch"></md-switch>
                                <div class="label-content">
                                    <span class="label-title">Switch z ikonami</span>
                                    <span class="label-description">Pokazuj ikony on/off</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </material-card>

                <material-card elevated class="preview-card">
                    <span slot="title">Podgląd na żywo</span>
                    <div slot="content">
                        <div class="preview-area">
                            <div class="preview-item">
                                <span>Przełącznik demo:</span>
                                <md-switch id="demoSwitch"></md-switch>
                            </div>
                            
                            <div id="switchStatus" class="status-message">
                                Status: Oczekiwanie na akcję...
                            </div>
                        </div>
                        
                        <div class="switch-stats">
                            <h4>Statystyki:</h4>
                            <div class="stats-grid">
                                <div class="stat">
                                    <span class="stat-value" id="switchOnCount">0</span>
                                    <span class="stat-label">Włączone</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value" id="switchOffCount">0</span>
                                    <span class="stat-label">Wyłączone</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value" id="totalChanges">0</span>
                                    <span class="stat-label">Zmiany</span>
                                </div>
                            </div>
                        </div>

                        <div class="preview-actions">
                            <md-filled-button id="resetSwitches">
                                <md-icon slot="icon">refresh</md-icon>
                                Resetuj wszystkie
                            </md-filled-button>
                            <md-outlined-button id="toggleAllSwitches">
                                <md-icon slot="icon">swap_horiz</md-icon>
                                Odwróć wszystkie
                            </md-outlined-button>
                        </div>
                    </div>
                </material-card>
            </div>
        </section>

        <!-- Sekcja z różnymi wariantami switchy -->
        <section class="demo-section">
            <h2>🎨 Warianty Switchy</h2>
            
            <div class="variants-grid">
                <material-card elevated>
                    <span slot="title">Podstawowe</span>
                    <div slot="content" class="variants-content">
                        <div class="variant-item">
                            <md-switch></md-switch>
                            <span>Standard</span>
                        </div>
                        <div class="variant-item">
                            <md-switch selected></md-switch>
                            <span>Wybrany</span>
                        </div>
                        <div class="variant-item">
                            <md-switch disabled></md-switch>
                            <span>Wyłączony</span>
                        </div>
                        <div class="variant-item">
                            <md-switch selected disabled></md-switch>
                            <span>Wybrany i wyłączony</span>
                        </div>
                    </div>
                </material-card>

                <material-card elevated>
                    <span slot="title">Z ikonami</span>
                    <div slot="content" class="variants-content">
                        <div class="variant-item">
                            <md-switch icons></md-switch>
                            <span>Z ikonami</span>
                        </div>
                        <div class="variant-item">
                            <md-switch icons selected></md-switch>
                            <span>Wybrany z ikonami</span>
                        </div>
                        <div class="variant-item">
                            <md-switch icons show-only-selected-icon></md-switch>
                            <span>Tylko wybrana ikona</span>
                        </div>
                    </div>
                </material-card>

                <material-card elevated>
                    <span slot="title">Zaawansowane</span>
                    <div slot="content" class="variants-content">
                        <div class="variant-item">
                            <md-switch required></md-switch>
                            <span>Wymagany</span>
                        </div>
                        <div class="variant-item">
                            <md-switch name="custom-switch" value="on"></md-switch>
                            <span>Z name i value</span>
                        </div>
                    </div>
                </material-card>
            </div>
        </section>

        <!-- Sekcja Dashboard Demo -->
        <section class="demo-section">
            <h2>🎯 Dashboard Demo</h2>
            <div class="dashboard-grid">
                <material-card elevated class="stat-card">
                    <span slot="title">📊 Statystyki</span>
                    <div slot="content">
                        <div class="stat-value" id="clickCount">0</div>
                        <div class="stat-label">Kliknięć przycisku</div>
                    </div>
                    <div slot="actions">
                        <md-filled-button id="incrementStat">
                            <md-icon slot="icon">add</md-icon>
                            Zwiększ
                        </md-filled-button>
                    </div>
                </material-card>

                <material-card elevated class="form-card">
                    <span slot="title">👤 Formularz użytkownika</span>
                    <div slot="content">
                        <md-outlined-text-field label="Imię" id="firstName">
                            <md-icon slot="leading-icon">person</md-icon>
                        </md-outlined-text-field>
                        
                        <md-outlined-text-field label="Nazwisko" id="lastName">
                            <md-icon slot="leading-icon">badge</md-icon>
                        </md-outlined-text-field>
                        
                        <md-outlined-text-field type="email" label="Email" id="email">
                            <md-icon slot="leading-icon">email</md-icon>
                        </md-outlined-text-field>

                        <div class="form-switches">
                            <label class="form-switch">
                                <md-switch id="newsletterSwitch"></md-switch>
                                <span>Chcę otrzymywać newsletter</span>
                            </label>
                            <label class="form-switch">
                                <md-switch selected id="termsSwitch"></md-switch>
                                <span>Akceptuję regulamin</span>
                            </label>
                        </div>
                    </div>
                    <div slot="actions">
                        <md-outlined-button id="resetForm">Reset</md-outlined-button>
                        <md-filled-button id="submitForm">Zapisz</md-filled-button>
                    </div>
                </material-card>
            </div>
        </section>
    </main>

    <!-- Import Material Web Components -->
    <script type="module">
        import '@material/web/switch/switch.js';
        import '@material/web/button/filled-button.js';
        import '@material/web/button/outlined-button.js';
        import '@material/web/textfield/outlined-text-field.js';
        import '@material/web/icon/icon.js';
    </script>

    <script type="module" src="/src/main.js"></script>
    <script type="module">
        // Switch functionality with Material Web
        const switches = {
            notifications: document.getElementById('notificationsSwitch'),
            darkMode: document.getElementById('darkModeSwitch'),
            autoUpdate: document.getElementById('autoUpdateSwitch'),
            offline: document.getElementById('offlineSwitch'),
            icons: document.getElementById('iconsSwitch'),
            demo: document.getElementById('demoSwitch'),
            newsletter: document.getElementById('newsletterSwitch'),
            terms: document.getElementById('termsSwitch')
        };

        const switchStatus = document.getElementById('switchStatus');
        const resetSwitchesBtn = document.getElementById('resetSwitches');
        const toggleAllBtn = document.getElementById('toggleAllSwitches');
        
        const switchOnCount = document.getElementById('switchOnCount');
        const switchOffCount = document.getElementById('switchOffCount');
        const totalChanges = document.getElementById('totalChanges');

        let changeCount = 0;

        function updateStats() {
            const allSwitches = Object.values(switches);
            const onCount = allSwitches.filter(sw => sw?.selected).length;
            const offCount = allSwitches.length - onCount;
            
            switchOnCount.textContent = onCount;
            switchOffCount.textContent = offCount;
            totalChanges.textContent = changeCount;
        }

        // Obsługa zmian switchy
        Object.entries(switches).forEach(([key, switchElement]) => {
            if (switchElement) {
                switchElement.addEventListener('change', (e) => {
                    changeCount++;
                    updateStats();
                    
                    const action = e.target.selected ? 'włączony' : 'wyłączony';
                    const switchNames = {
                        notifications: 'Powiadomienia push',
                        darkMode: 'Ciemny motyw',
                        autoUpdate: 'Automatyczne aktualizacje',
                        offline: 'Tryb offline',
                        icons: 'Switch z ikonami',
                        demo: 'Przełącznik demo',
                        newsletter: 'Newsletter',
                        terms: 'Regulamin'
                    };
                    
                    switchStatus.innerHTML = `
                        <span style="color: var(--md-sys-color-primary);">
                            ✅ ${switchNames[key]} został ${action}
                        </span>
                    `;
                    
                    // Efekty wizualne
                    if (key === 'darkMode') {
                        document.body.classList.toggle('dark-preview', e.target.selected);
                    }
                });
            }
        });

        // Reset switchy
        resetSwitchesBtn.addEventListener('click', () => {
            Object.values(switches).forEach(sw => {
                if (sw) {
                    sw.selected = false;
                }
            });
            // Przywróć niektóre do stanu domyślnego
            switches.notifications.selected = true;
            switches.autoUpdate.selected = true;
            switches.terms.selected = true;
            
            document.body.classList.remove('dark-preview');
            switchStatus.textContent = 'Status: Wszystkie switche zresetowane';
            changeCount++;
            updateStats();
        });

        // Odwróć wszystkie switche
        toggleAllBtn.addEventListener('click', () => {
            Object.values(switches).forEach(sw => {
                if (sw && !sw.disabled) {
                    sw.selected = !sw.selected;
                }
            });
            changeCount++;
            updateStats();
            switchStatus.textContent = 'Status: Wszystkie switche odwrócone';
        });

        // Inicjalizacja statystyk
        updateStats();

        // Pozostała funkcjonalność...
        let clickCount = 0;
        const clickCountElement = document.getElementById('clickCount');
        const incrementButton = document.getElementById('incrementStat');
        
        incrementButton.addEventListener('click', () => {
            clickCount++;
            clickCountElement.textContent = clickCount;
            clickCountElement.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                clickCountElement.style.animation = '';
            }, 300);
        });

        // Form handling
        const resetButton = document.getElementById('resetForm');
        const submitButton = document.getElementById('submitForm');
        
        resetButton.addEventListener('click', () => {
            document.querySelectorAll('md-outlined-text-field').forEach(field => {
                field.value = '';
            });
            switches.newsletter.selected = false;
            switches.terms.selected = true;
        });
        
        submitButton.addEventListener('click', () => {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const acceptedTerms = switches.terms.selected;
            
            if (!acceptedTerms) {
                alert('Proszę zaakceptować regulamin!');
                return;
            }
            
            alert(`Witaj ${firstName} ${lastName}! Formularz został zapisany.`);
        });
    </script>
    
    <style>
        .switches-demo {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 2rem 0;
        }

        .setting-item {
            padding: 1rem 0;
            border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        .setting-item:last-child {
            border-bottom: none;
        }

        .setting-label {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            cursor: pointer;
            padding: 0.5rem 0;
        }

        .label-content {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .label-title {
            font-weight: 500;
            color: var(--md-sys-color-on-surface);
        }

        .label-description {
            font-size: 0.875rem;
            color: var(--md-sys-color-on-surface-variant);
        }

        .preview-card {
            display: flex;
            flex-direction: column;
        }

        .preview-area {
            margin-bottom: 1.5rem;
        }

        .preview-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            background: var(--md-sys-color-surface-container-high);
            border-radius: 8px;
            margin-bottom: 1rem;
        }

        .status-message {
            background: var(--md-sys-color-surface-container-high);
            padding: 1rem;
            border-radius: 8px;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-weight: 500;
        }

        .switch-stats {
            margin: 1.5rem 0;
        }

        .switch-stats h4 {
            margin: 0 0 1rem 0;
            color: var(--md-sys-color-on-surface-variant);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }

        .stat {
            text-align: center;
            padding: 1rem;
            background: var(--md-sys-color-surface-container-high);
            border-radius: 8px;
        }

        .stat-value {
            display: block;
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--md-sys-color-primary);
        }

        .stat-label {
            font-size: 0.875rem;
            color: var(--md-sys-color-on-surface-variant);
        }

        .preview-actions {
            display: flex;
            gap: 1rem;
            margin-top: auto;
        }

        .preview-actions md-filled-button,
        .preview-actions md-outlined-button {
            flex: 1;
        }

        /* Warianty switchy */
        .variants-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .variants-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .variant-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem 0;
        }

        /* Form switches */
        .form-switches {
            margin-top: 1.5rem;
        }

        .form-switch {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem 0;
            cursor: pointer;
        }

        /* Dark mode preview */
        .dark-preview {
            background: #1a1a1a !important;
        }

        .dark-preview .page-header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
        }

        /* Responsywność */
        @media (max-width: 768px) {
            .switches-demo {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .preview-actions {
                flex-direction: column;
            }
        }

        /* Material Web overrides */
        md-switch {
            --md-switch-selected-handle-color: var(--md-sys-color-primary);
            --md-switch-selected-track-color: var(--md-sys-color-primary);
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .stat-card {
            text-align: center;
        }

        .stat-value {
            font-size: 3rem;
            font-weight: bold;
            color: var(--md-sys-color-primary);
            margin: 1rem 0;
        }

        .stat-label {
            color: var(--md-sys-color-on-surface-variant);
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    </style>
</body>
</html>
Teraz masz pełnoprawną sekcję z switchami Material Web z:

✅ Gotowe komponenty z @material/web
✅ Różne warianty switchy (z ikonami, disabled, required)
✅ Statystyki na żywo pokazujące stan switchy
✅ Interaktywne przyciski do resetowania i odwracania
✅ Integracja z formularzem
✅ Responsywny design
✅ Efekty wizualne jak dark mode preview

Wszystko działa od razu bez pisania własnego kodu komponentów! 🚀


=======================

md-switch już jest zarejestrowany po dodaniu biblioteki czytrzeba go rećznie rejestrować jako custom element
Dobrze, że zwracasz na to uwagę! md-switch jest już zarejestrowany automatycznie przez bibliotekę @material/web.

Kiedy importujesz komponent:

javascript
import '@material/web/switch/switch.js';
Biblioteka automatycznie rejestruje element md-switch jako custom element. Nie musisz tego robić ręcznie!

Poprawiony kod - usuń ręczną rejestrację:
W components-demo.html - DZIAŁA POPRAWNIE:


---------------------------
Poprawiony kod - usuń ręczną rejestrację:
W components-demo.html - DZIAŁA POPRAWNIE:
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Components Demo</title>
    <link rel="stylesheet" href="/src/styles/global.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-button">
            <span class="material-icons">arrow_back</span>
            Strona Główna
        </a>
        <h1>⚡ Interactive Demo</h1>
        <p>Zobacz komponenty Material Web w akcji</p>
    </div>

    <main class="container">
        <!-- Sekcja z Switch Material Web -->
        <section class="demo-section">
            <h2>🔘 Material Web Switches</h2>
            
            <div class="switches-demo">
                <div class="demo-card">
                    <h3>Podstawowe użycie:</h3>
                    <!-- md-switch JEST JUŻ ZAREJESTROWANY - możesz go używać od razu! -->
                    <md-switch></md-switch>
                    <md-switch selected></md-switch>
                    <md-switch disabled></md-switch>
                </div>
            </div>
        </section>
    </main>

    <!-- Import Material Web Components -->
    <script type="module">
        // Ten import AUTOMATYCZNIE rejestruje <md-switch>
        import '@material/web/switch/switch.js';
        
        // Możesz od razu używać md-switch w HTML!
        console.log('md-switch jest zarejestrowany:', customElements.get('md-switch'));
    </script>

</body>
</html>
Jak to działa:
Import biblioteki:

javascript
import '@material/web/switch/switch.js';
Biblioteka automatycznie wykonuje:

javascript
// Wewnątrz @material/web/switch/switch.js:
customElements.define('md-switch', MdSwitch);
Możesz od razu używać w HTML:

html
<md-switch></md-switch>
<md-switch selected></md-switch>
<md-switch disabled></md-switch>
Sprawdź czy komponent jest zarejestrowany:
javascript
// Sprawdź w konsoli
console.log('Czy md-switch jest zarejestrowany?', customElements.get('md-switch'));

// Powinno zwrócić funkcję konstruktora, np:
// ƒ MdSwitch() { ... }
Jeśli masz problemy, sprawdź:
Czy import jest poprawny:

html
<script type="module">
  import '@material/web/switch/switch.js';
</script>
Czy używasz type="module" w script tag

Czy Vite poprawnie obsługuje importy

Minimalny działający przykład:
html
<!DOCTYPE html>
<html>
<head>
    <title>Test md-switch</title>
</head>
<body>
    <h1>Test Material Switch</h1>
    
    <!-- Używamy bez rejestracji - już zarejestrowany! -->
    <md-switch>Switch 1</md-switch>
    <md-switch selected>Switch 2</md-switch>
    
    <script type="module">
        import '@material/web/switch/switch.js';
    </script>
</body>
</html>
Podsumowanie: md-switch i inne komponenty z @material/web są automatycznie rejestrowane podczas importu. Nie musisz wywoływać customElements.define()! 🎯


----------------------------
    <!-- Import Material Web Components -->
    <script type="module">
        import '@material/web/switch/switch.js';
        import '@material/web/button/filled-button.js';
        import '@material/web/button/outlined-button.js';
        import '@material/web/textfield/outlined-text-field.js';
        import '@material/web/icon/icon.js';

        //dodaje wszystkie komponenty od razu a nie pojedynczo - ale wzrasta js rozmiar 
        //od razu robi się 120kB !!!! dla basic-examples
        //od razu 500KB
        import '@material/web/all.js';
        
    </script>

https://github.com/material-components/material-web/blob/main/docs/quick-start.md

https://material-web.dev/about/intro/



https://github.com/material-components/material-web/tree/main/docs/components








a czy jest gotowy range-slider w materials
Tak! Material Web ma gotowy komponent range slider. Oto jak go użyć:

1. Range Slider w Material Web
Dostępne komponenty range slider:
javascript
// Podstawowy range slider
import '@material/web/slider/slider.js';

// Z różnymi wariantami
import '@material/web/slider/range-slider.js'; // Dla zakresów
2. Przykład użycia w components-demo.html
html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Components Demo - Range Slider</title>
    <link rel="stylesheet" href="/src/styles/global.css">
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-button">← Strona Główna</a>
        <h1>🎚️ Range Slider Demo</h1>
        <p>Material Web Range Slider w akcji</p>
    </div>

    <main class="container">
        <!-- Sekcja z podstawowym sliderem -->
        <section class="demo-section">
            <h2>📊 Podstawowy Slider</h2>
            
            <div class="sliders-grid">
                <div class="slider-demo">
                    <h3>Single Value Slider</h3>
                    <md-slider
                        id="basicSlider"
                        min="0"
                        max="100"
                        value="50"
                        labeled
                    ></md-slider>
                    <div class="slider-value">Wartość: <span id="basicValue">50</span></div>
                </div>

                <div class="slider-demo">
                    <h3>Slider z krokami</h3>
                    <md-slider
                        id="stepSlider"
                        min="0"
                        max="10"
                        value="5"
                        step="1"
                        labeled
                        ticks
                    ></md-slider>
                    <div class="slider-value">Wartość: <span id="stepValue">5</span></div>
                </div>
            </div>
        </section>

        <!-- Sekcja z range slider -->
        <section class="demo-section">
            <h2>🎯 Range Slider (Zakres)</h2>
            
            <div class="range-demo">
                <h3>Wybierz zakres cenowy</h3>
                <md-slider
                    id="rangeSlider"
                    min="0"
                    max="1000"
                    value-start="200"
                    value-end="800"
                    labeled
                    ticks
                ></md-slider>
                <div class="range-values">
                    Zakres: <span id="rangeStart">200</span> - <span id="rangeEnd">800</span>
                </div>
            </div>
        </section>

        <!-- Sekcja z różnymi stanami -->
        <section class="demo-section">
            <h2>🎨 Różne Stany Slidera</h2>
            
            <div class="states-grid">
                <div class="state-demo">
                    <h3>Disabled</h3>
                    <md-slider
                        min="0"
                        max="100"
                        value="30"
                        disabled
                        labeled
                    ></md-slider>
                </div>

                <div class="state-demo">
                    <h3>Z ikonami</h3>
                    <div class="slider-with-icons">
                        <md-icon>volume_down</md-icon>
                        <md-slider
                            min="0"
                            max="100"
                            value="75"
                            labeled
                        ></md-slider>
                        <md-icon>volume_up</md-icon>
                    </div>
                </div>
            </div>
        </section>

        <!-- Praktyczny przykład -->
        <section class="demo-section">
            <h2>💡 Praktyczne Zastosowania</h2>
            
            <div class="practical-examples">
                <div class="example-card">
                    <h3>🔊 Kontrola głośności</h3>
                    <div class="volume-control">
                        <md-icon>volume_mute</md-icon>
                        <md-slider
                            id="volumeSlider"
                            min="0"
                            max="100"
                            value="80"
                            labeled
                        ></md-slider>
                        <md-icon>volume_up</md-icon>
                    </div>
                    <div class="volume-display">
                        Głośność: <span id="volumeValue">80</span>%
                    </div>
                </div>

                <div class="example-card">
                    <h3>💡 Jasność światła</h3>
                    <div class="brightness-control">
                        <md-icon>brightness_low</md-icon>
                        <md-slider
                            id="brightnessSlider"
                            min="0"
                            max="100"
                            value="60"
                            labeled
                        ></md-slider>
                        <md-icon>brightness_high</md-icon>
                    </div>
                    <div class="brightness-display">
                        Jasność: <span id="brightnessValue">60</span>%
                    </div>
                </div>

                <div class="example-card">
                    <h3>🎨 Edytor kolorów RGB</h3>
                    <div class="color-editor">
                        <div class="color-channel">
                            <span class="channel-label">R</span>
                            <md-slider
                                id="redSlider"
                                min="0"
                                max="255"
                                value="120"
                                style="--md-slider-active-track-color: #f44336;"
                                labeled
                            ></md-slider>
                            <span class="channel-value" id="redValue">120</span>
                        </div>
                        <div class="color-channel">
                            <span class="channel-label">G</span>
                            <md-slider
                                id="greenSlider"
                                min="0"
                                max="255"
                                value="80"
                                style="--md-slider-active-track-color: #4caf50;"
                                labeled
                            ></md-slider>
                            <span class="channel-value" id="greenValue">80</span>
                        </div>
                        <div class="color-channel">
                            <span class="channel-label">B</span>
                            <md-slider
                                id="blueSlider"
                                min="0"
                                max="255"
                                value="200"
                                style="--md-slider-active-track-color: #2196f3;"
                                labeled
                            ></md-slider>
                            <span class="channel-value" id="blueValue">200</span>
                        </div>
                        <div class="color-preview" id="colorPreview"></div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Import Material Web Components -->
    <script type="module">
        import '@material/web/slider/slider.js';
        import '@material/web/icon/icon.js';
    </script>

    <script type="module">
        // Basic slider
        const basicSlider = document.getElementById('basicSlider');
        const basicValue = document.getElementById('basicValue');

        basicSlider.addEventListener('input', (e) => {
            basicValue.textContent = e.target.value;
        });

        // Step slider
        const stepSlider = document.getElementById('stepSlider');
        const stepValue = document.getElementById('stepValue');

        stepSlider.addEventListener('input', (e) => {
            stepValue.textContent = e.target.value;
        });

        // Range slider
        const rangeSlider = document.getElementById('rangeSlider');
        const rangeStart = document.getElementById('rangeStart');
        const rangeEnd = document.getElementById('rangeEnd');

        rangeSlider.addEventListener('input', (e) => {
            rangeStart.textContent = e.target.valueStart;
            rangeEnd.textContent = e.target.valueEnd;
        });

        // Volume control
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');

        volumeSlider.addEventListener('input', (e) => {
            volumeValue.textContent = e.target.value;
        });

        // Brightness control
        const brightnessSlider = document.getElementById('brightnessSlider');
        const brightnessValue = document.getElementById('brightnessValue');

        brightnessSlider.addEventListener('input', (e) => {
            brightnessValue.textContent = e.target.value;
        });

        // RGB Color editor
        const redSlider = document.getElementById('redSlider');
        const greenSlider = document.getElementById('greenSlider');
        const blueSlider = document.getElementById('blueSlider');
        const redValue = document.getElementById('redValue');
        const greenValue = document.getElementById('greenValue');
        const blueValue = document.getElementById('blueValue');
        const colorPreview = document.getElementById('colorPreview');

        function updateColor() {
            const r = redSlider.value;
            const g = greenSlider.value;
            const b = blueSlider.value;
            
            redValue.textContent = r;
            greenValue.textContent = g;
            blueValue.textContent = b;
            
            colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }

        redSlider.addEventListener('input', updateColor);
        greenSlider.addEventListener('input', updateColor);
        blueSlider.addEventListener('input', updateColor);

        // Initialize color preview
        updateColor();
    </script>

    <style>
        .sliders-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .slider-demo {
            background: var(--md-sys-color-surface-container-low);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid var(--md-sys-color-outline-variant);
        }

        .slider-demo h3 {
            margin: 0 0 1rem 0;
            color: var(--md-sys-color-on-surface);
        }

        .slider-value {
            margin-top: 1rem;
            color: var(--md-sys-color-on-surface-variant);
            font-weight: 500;
        }

        .range-demo {
            background: var(--md-sys-color-surface-container-low);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid var(--md-sys-color-outline-variant);
            max-width: 600px;
            margin: 0 auto;
        }

        .range-demo h3 {
            margin: 0 0 1rem 0;
            color: var(--md-sys-color-on-surface);
        }

        .range-values {
            margin-top: 1rem;
            color: var(--md-sys-color-on-surface-variant);
            font-weight: 500;
            text-align: center;
        }

        .states-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .state-demo {
            background: var(--md-sys-color-surface-container-low);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid var(--md-sys-color-outline-variant);
        }

        .state-demo h3 {
            margin: 0 0 1rem 0;
            color: var(--md-sys-color-on-surface);
        }

        .slider-with-icons {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .practical-examples {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .example-card {
            background: var(--md-sys-color-surface-container-low);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid var(--md-sys-color-outline-variant);
        }

        .example-card h3 {
            margin: 0 0 1.5rem 0;
            color: var(--md-sys-color-on-surface);
        }

        .volume-control,
        .brightness-control {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .volume-display,
        .brightness-display {
            text-align: center;
            color: var(--md-sys-color-on-surface-variant);
            font-weight: 500;
        }

        .color-editor {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .color-channel {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .channel-label {
            font-weight: bold;
            width: 20px;
            color: var(--md-sys-color-on-surface-variant);
        }

        .channel-value {
            width: 40px;
            text-align: center;
            font-weight: 500;
            color: var(--md-sys-color-on-surface-variant);
        }

        .color-preview {
            width: 100%;
            height: 60px;
            border-radius: 8px;
            border: 2px solid var(--md-sys-color-outline);
            margin-top: 1rem;
            background: rgb(120, 80, 200);
        }

        /* Material Web Slider custom properties */
        md-slider {
            --md-slider-active-track-color: var(--md-sys-color-primary);
            --md-slider-inactive-track-color: var(--md-sys-color-surface-container-highest);
            --md-slider-handle-color: var(--md-sys-color-primary);
            --md-slider-label-container-color: var(--md-sys-color-primary);
            --md-slider-label-label-text-color: var(--md-sys-color-on-primary);
        }

        @media (max-width: 768px) {
            .sliders-grid,
            .states-grid,
            .practical-examples {
                grid-template-columns: 1fr;
            }
            
            .slider-with-icons {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .color-channel {
                flex-direction: column;
                align-items: stretch;
                gap: 0.5rem;
            }
            
            .channel-label,
            .channel-value {
                width: auto;
                text-align: left;
            }
        }
    </style>
</body>
</html>
3. Właściwości i atrybuty md-slider
Podstawowe atrybuty:
html
<md-slider
  min="0"           <!-- Minimalna wartość -->
  max="100"         <!-- Maksymalna wartość -->
  value="50"        <!-- Aktualna wartość -->
  step="1"          <!-- Krok zmiany wartości -->
  disabled          <!-- Wyłączony stan -->
  labeled           <!-- Pokazuj etykietę wartości -->
  ticks             <!-- Pokazuj podziałkę -->
></md-slider>
Range slider (zakres):
html
<md-slider
  min="0"
  max="100"
  value-start="20"  <!-- Początek zakresu -->
  value-end="80"    <!-- Koniec zakresu -->
  labeled
  ticks
></md-slider>
4. Custom properties do stylizacji:
css
md-slider {
  --md-slider-active-track-color: #6750A4;
  --md-slider-inactive-track-color: #E7E0EC;
  --md-slider-handle-color: #6750A4;
  --md-slider-label-container-color: #6750A4;
  --md-slider-label-label-text-color: #FFFFFF;
  --md-slider-with-tick-marks-active-container-color: #6750A4;
  --md-slider-with-tick-marks-inactive-container-color: #E7E0EC;
}
5. Eventy:
javascript
const slider = document.querySelector('md-slider');

// Podczas przeciągania
slider.addEventListener('input', (e) => {
    console.log('Aktualna wartość:', e.target.value);
});

// Po zakończeniu przeciągania
slider.addEventListener('change', (e) => {
    console.log('Finalna wartość:', e.target.value);
});

// Dla range slider
slider.addEventListener('input', (e) => {
    console.log('Zakres:', e.target.valueStart, '-', e.target.valueEnd);
});
6. Jeśli masz problemy z importem:
javascript
// Spróbuj tych ścieżek importu:
import 'https://esm.sh/@material/web/slider/slider.js';
// LUB
import '/node_modules/@material/web/slider/slider.js';
// LUB (jeśli używasz CDN)
import 'https://unpkg.com/@material/web/slider/slider.js';
Material Web range slider jest w pełni gotowy do użycia i ma wszystkie funkcje jakie oczekujesz od nowoczesnego slidera! 🎚️✨

