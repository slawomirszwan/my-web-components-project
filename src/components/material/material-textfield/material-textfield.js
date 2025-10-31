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