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