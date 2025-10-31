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