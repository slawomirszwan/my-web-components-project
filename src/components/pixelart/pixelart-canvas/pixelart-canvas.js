import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

export class PixelartCanvas extends LitElement {
  static properties = {
    width: { type: Number },
    height: { type: Number },
    pixelSize: { type: Number },
    currentColor: { type: String },
    colors: { type: Array },
    pixels: { type: Array },
    showGrid: { type: Boolean },
    projectName: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
    }

    .pixelart-container {
      background: var(--md-sys-color-surface);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }

    .project-info h2 {
      margin: 0;
      color: var(--md-sys-color-on-surface);
      font-size: 1.25rem;
    }

    .project-info input {
      background: transparent;
      border: none;
      color: var(--md-sys-color-on-surface);
      font-size: 1.25rem;
      font-weight: 500;
      border-bottom: 2px solid transparent;
      padding: 0.25rem 0;
    }

    .project-info input:focus {
      outline: none;
      border-bottom-color: var(--md-sys-color-primary);
    }

    .tools {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .canvas-container {
      background: var(--md-sys-color-surface-container-high);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      overflow: auto;
      border: 1px solid var(--md-sys-color-outline-variant);
    }

    .canvas {
      display: inline-block;
      border: 1px solid var(--md-sys-color-outline);
      background: white;
    }

    .pixel-row {
      display: flex;
    }

    .pixel {
      cursor: pointer;
      transition: all 0.1s ease;
      border: 1px solid transparent;
    }

    .pixel:hover {
      transform: scale(1.1);
      z-index: 1;
      position: relative;
    }

    .pixel.filled {
      border-color: rgba(0, 0, 0, 0.1);
    }

    .show-grid .pixel {
      border-color: var(--md-sys-color-outline-variant);
    }

    .color-palette {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .color-swatch {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .color-swatch:hover {
      transform: scale(1.1);
    }

    .color-swatch.active {
      border-color: var(--md-sys-color-primary);
      box-shadow: 0 0 0 2px var(--md-sys-color-primary-container);
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .dimensions-control {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    .dimension-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dimension-input label {
      color: var(--md-sys-color-on-surface-variant);
      font-size: 0.875rem;
    }

    .dimension-input input {
      width: 60px;
      padding: 0.5rem;
      border: 1px solid var(--md-sys-color-outline);
      border-radius: 4px;
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
    }

    .preview {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--md-sys-color-outline-variant);
    }

    .preview h3 {
      margin: 0 0 1rem 0;
      color: var(--md-sys-color-on-surface-variant);
      font-size: 1rem;
    }

    .preview-image {
      image-rendering: pixelated;
      border: 1px solid var(--md-sys-color-outline);
      border-radius: 4px;
    }

    .stats {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      color: var(--md-sys-color-on-surface-variant);
      font-size: 0.875rem;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .empty {
      background: repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 16px 16px;
    }
  `;

  constructor() {
    super();
    this.width = 16;
    this.height = 16;
    this.pixelSize = 20;
    this.currentColor = '#6750A4';
    this.showGrid = true;
    this.projectName = 'Mój Pixel Art';
    
    this.colors = [
      '#6750A4', '#EADDFF', '#21005D', // Purples
      '#625B71', '#E8DEF8', '#1D192B', // Secondary
      '#BA1A1A', '#FFDAD6', '#410002', // Error
      '#4CAF50', '#C8E6C9', '#1B5E20', // Success
      '#FF9800', '#FFE0B2', '#E65100', // Warning
      '#000000', '#666666', '#999999', '#CCCCCC', '#FFFFFF' // Grayscale
    ];

    this.initializePixels();
  }

  initializePixels() {
    this.pixels = Array(this.height).fill().map(() => 
      Array(this.width).fill(null)
    );
  }

  updated(changedProperties) {
    if (changedProperties.has('width') || changedProperties.has('height')) {
      this.initializePixels();
    }
  }

  setColor(color) {
    this.currentColor = color;
  }

  paintPixel(row, col) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      this.pixels = this.pixels.map((r, rIndex) => 
        r.map((pixel, cIndex) => 
          rIndex === row && cIndex === col ? this.currentColor : pixel
        )
      );
      
      this.requestUpdate();
      this.dispatchEvent(new CustomEvent('pixel-changed', {
        detail: { row, col, color: this.currentColor }
      }));
    }
  }

  clearCanvas() {
    this.initializePixels();
    this.dispatchEvent(new CustomEvent('canvas-cleared'));
  }

  exportAsPNG() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = this.width;
    canvas.height = this.height;
    
    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw pixels
    this.pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      });
    });
    
    const dataURL = canvas.toDataURL('image/png');
    this.downloadImage(dataURL, `${this.projectName}.png`);
  }

  downloadImage(dataURL, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    link.click();
  }

  getUsedColors() {
    const colors = new Set();
    this.pixels.forEach(row => {
      row.forEach(color => {
        if (color) colors.add(color);
      });
    });
    return Array.from(colors);
  }

  getFilledPixelsCount() {
    return this.pixels.flat().filter(pixel => pixel !== null).length;
  }

  render() {
    const usedColors = this.getUsedColors();
    const filledPixels = this.getFilledPixelsCount();
    const totalPixels = this.width * this.height;

    return html`
      <div class="pixelart-container">
        <div class="toolbar">
          <div class="project-info">
            <input 
              type="text" 
              .value=${this.projectName}
              @input=${e => this.projectName = e.target.value}
              placeholder="Nazwa projektu"
            >
          </div>
          <div class="tools">
            <label>
              <input 
                type="checkbox" 
                ?checked=${this.showGrid}
                @change=${e => this.showGrid = e.target.checked}
              >
              Siatka
            </label>
          </div>
        </div>

        <div class="dimensions-control">
          <div class="dimension-input">
            <label>Szerokość:</label>
            <input 
              type="number" 
              min="1" 
              max="64" 
              .value=${this.width}
              @change=${e => this.width = parseInt(e.target.value)}
            >
          </div>
          <div class="dimension-input">
            <label>Wysokość:</label>
            <input 
              type="number" 
              min="1" 
              max="64" 
              .value=${this.height}
              @change=${e => this.height = parseInt(e.target.value)}
            >
          </div>
          <div class="dimension-input">
            <label>Rozmiar piksela:</label>
            <input 
              type="number" 
              min="4" 
              max="40" 
              .value=${this.pixelSize}
              @change=${e => this.pixelSize = parseInt(e.target.value)}
            >
          </div>
        </div>

        <div class="color-palette">
          ${this.colors.map(color => html`
            <div 
              class="color-swatch ${color === this.currentColor ? 'active' : ''}"
              style="background-color: ${color}"
              @click=${() => this.setColor(color)}
              title="${color}"
            ></div>
          `)}
        </div>

        <div class="canvas-container">
          <div class="canvas ${classMap({ 'show-grid': this.showGrid })}">
            ${this.pixels.map((row, rowIndex) => html`
              <div class="pixel-row">
                ${row.map((pixel, colIndex) => html`
                  <div 
                    class="pixel ${pixel ? 'filled' : 'empty'}"
                    style="
                      width: ${this.pixelSize}px;
                      height: ${this.pixelSize}px;
                      background-color: ${pixel || 'transparent'};
                    "
                    @click=${() => this.paintPixel(rowIndex, colIndex)}
                    @mouseover=${(e) => {
                      if (e.buttons === 1) { // Left mouse button pressed
                        this.paintPixel(rowIndex, colIndex);
                      }
                    }}
                  ></div>
                `)}
              </div>
            `)}
          </div>
        </div>

        <div class="stats">
          <div class="stat">
            <span>Wymiary:</span>
            <strong>${this.width} × ${this.height}</strong>
          </div>
          <div class="stat">
            <span>Wypełnione:</span>
            <strong>${filledPixels} / ${totalPixels}</strong>
          </div>
          <div class="stat">
            <span>Kolory:</span>
            <strong>${usedColors.length}</strong>
          </div>
        </div>

        <div class="actions">
          <md-filled-button @click=${this.clearCanvas}>
            <md-icon slot="icon">delete</md-icon>
            Wyczyść
          </md-filled-button>
          
          <md-filled-button @click=${this.exportAsPNG}>
            <md-icon slot="icon">download</md-icon>
            Eksportuj PNG
          </md-filled-button>
          
          <md-outlined-button @click=${() => this.initializePixels()}>
            <md-icon slot="icon">refresh</md-icon>
            Resetuj
          </md-outlined-button>
        </div>

        ${filledPixels > 0 ? html`
          <div class="preview">
            <h3>Podgląd (4x powiększenie):</h3>
            <canvas 
              class="preview-image"
              width=${this.width * 4}
              height=${this.height * 4}
            ></canvas>
          </div>
        ` : ''}
      </div>
    `;
  }

  firstUpdated() {
    this.updatePreview();
  }

  updated(changedProperties) {
    if (changedProperties.has('pixels')) {
      this.updatePreview();
    }
  }

  updatePreview() {
    const canvas = this.shadowRoot.querySelector('.preview-image');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw pixels scaled up
    const scale = 4;
    this.pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      });
    });
  }
}

customElements.define('pixelart-canvas', PixelartCanvas);