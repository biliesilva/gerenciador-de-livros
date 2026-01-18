class Button {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    this.addRippleEffect();
    this.handleLoadingState();
    this.addAccessibilityFeatures();
  }

  addRippleEffect() {
    this.element.addEventListener('click', (e) => {
      if (this.element.disabled) return;

      const ripple = document.createElement('span');
      const rect = this.element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `;

      if (getComputedStyle(this.element).position === 'static') {
        this.element.style.position = 'relative';
      }
      
      this.element.style.overflow = 'hidden';

      this.element.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    });

    if (!document.getElementById('ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  handleLoadingState() {
    this.originalContent = null;
  }

  setLoading(isLoading = true) {
    if (isLoading) {
      if (!this.originalContent) {
        this.originalContent = this.element.innerHTML;
      }
      
      this.element.disabled = true;
      this.element.innerHTML = `
        <span class="btn-icon">
          <svg class="spinner" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
        </span>
        Carregando...
      `;
    } else {
      this.element.disabled = false;
      if (this.originalContent) {
        this.element.innerHTML = this.originalContent;
        this.originalContent = null;
      }
    }
  }

  addAccessibilityFeatures() {
    if (this.element.tagName !== 'BUTTON') {
      this.element.setAttribute('role', 'button');
      this.element.setAttribute('tabindex', '0');
      
      this.element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.element.click();
        }
      });
    }
  }

  destroy() {
    this.element.removeEventListener('click', this.addRippleEffect);
  }
}

const ButtonUtils = {
  initAll() {
    const buttons = document.querySelectorAll('.btn');
    const instances = [];
    
    buttons.forEach(button => {
      instances.push(new Button(button));
    });
    
    return instances;
  },

  create(options = {}) {
    const {
      type = 'primary',
      size = '',
      text = 'Button',
      icon = '',
      disabled = false,
      fullWidth = false,
      onclick = null
    } = options;

    const button = document.createElement('button');
    button.className = `btn btn-${type}`;
    
    if (size) button.classList.add(`btn-${size}`);
    if (fullWidth) button.classList.add('btn-full');
    if (disabled) button.disabled = true;

    let content = '';
    if (icon) {
      content += `<span class="btn-icon">${icon}</span>`;
    }
    content += text;

    button.innerHTML = content;
    
    if (onclick && typeof onclick === 'function') {
      button.addEventListener('click', onclick);
    }

    new Button(button);
    
    return button;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ButtonUtils.initAll();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Button, ButtonUtils };
}