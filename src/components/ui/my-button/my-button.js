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