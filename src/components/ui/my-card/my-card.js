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