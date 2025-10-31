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