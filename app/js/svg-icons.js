class SVGIconManager {
  constructor() {
    this.icons = new Map();
    this.loadIcons();
  }

  async loadIcons() {
    const iconFiles = {};
    
    Object.entries(AppConfig.icons).forEach(([name, fileName]) => {
      iconFiles[name] = AppConfig.getIconPath(fileName);
    });

    try {
      const promises = Object.entries(iconFiles).map(async ([name, path]) => {
        const response = await fetch(path);
        const svgText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        
        if (svgElement) {
          const viewBox = svgElement.getAttribute('viewBox') || '0 0 32 32';
          const paths = svgElement.innerHTML;
          
          this.icons.set(name, {
            viewBox,
            content: paths
          });
        }
      });

      await Promise.all(promises);
      this.injectIcons();
    } catch (error) {
      console.error('Error loading icons:', error);
    }
  }

  getSVG(iconName, attributes = {}) {
    const icon = this.icons.get(iconName);
    if (!icon) return '';

    const {
      width = '24',
      height = '24',
      className = '',
      ...otherAttributes
    } = attributes;

    const attributeString = Object.entries(otherAttributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `
      <svg
        width="${width}"
        height="${height}"
        viewBox="${icon.viewBox}"
        class="${className}"
        ${attributeString}
      >
        ${icon.content}
      </svg>
    `;
  }

  injectIcons() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.replaceIconPlaceholders());
    } else {
      this.replaceIconPlaceholders();
    }
  }

  replaceIconPlaceholders() {
    const iconPlaceholders = document.querySelectorAll('[data-svg-icon]');
    
    iconPlaceholders.forEach(placeholder => {
      const iconName = placeholder.getAttribute('data-svg-icon');
      const width = placeholder.getAttribute('width') || placeholder.style.width || '24';
      const height = placeholder.getAttribute('height') || placeholder.style.height || '24';
      const className = placeholder.className;
      
      const svgHtml = this.getSVG(iconName, {
        width: width.replace('px', ''),
        height: height.replace('px', ''),
        className
      });

      if (svgHtml) {
        placeholder.outerHTML = svgHtml;
      }
    });
  }
}

window.iconManager = new SVGIconManager();