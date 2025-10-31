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