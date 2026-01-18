class CSSGenerator {
  
  static generateChevronDataURI(color = '%23717182', opacity = '1') {
    const svgContent = `%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 12L16 20L24 12' stroke='${color}' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' ${opacity !== '1' ? `opacity='${opacity}'` : ''}/%3E%3C/svg%3E`;
    return `url("data:image/svg+xml,${svgContent}")`;
  }

  static applySelectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .field select.field-input,
      select.field-input {
        background-image: ${this.generateChevronDataURI()} !important;
      }
      
      .field select.field-input:focus,
      select.field-input:focus {
        background-image: ${this.generateChevronDataURI('%23193CB8')} !important;
      }
      
      .field select.field-input:disabled,
      select.field-input:disabled {
        background-image: ${this.generateChevronDataURI('%23717182', '0.5')} !important;
      }
    `;
    document.head.appendChild(style);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CSSGenerator.applySelectStyles());
} else {
  CSSGenerator.applySelectStyles();
}