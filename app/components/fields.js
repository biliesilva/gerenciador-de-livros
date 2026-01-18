class Field {
  constructor(element) {
    this.element = element;
    this.input = element.querySelector('.field-input, .field-textarea');
    this.label = element.querySelector('.field-label');
    this.errorMessage = element.querySelector('.field-error-message');
    
    this.init();
  }

  init() {
    if (this.input) {
      this.addInputEvents();
    }
    
    this.initRating();
  }

  addInputEvents() {
    this.input.addEventListener('focus', () => {
      this.element.classList.add('field-focused');
    });

    this.input.addEventListener('blur', () => {
      this.element.classList.remove('field-focused');
      this.validate();
    });

    this.input.addEventListener('input', () => {
      if (this.element.classList.contains('field-error')) {
        this.validate();
      }
    });
  }

  initRating() {
    const ratingStars = this.element.querySelectorAll('.rating-star');
    const clearButton = this.element.querySelector('.rating-clear');
    
    if (ratingStars.length === 0) return;

    let currentRating = 0;

    ratingStars.forEach((star, index) => {
      star.addEventListener('click', () => {
        currentRating = index + 1;
        this.updateRatingDisplay(currentRating, ratingStars);
        this.updateClearButton(clearButton, currentRating > 0);
        
        this.element.dispatchEvent(new CustomEvent('rating-change', {
          detail: { rating: currentRating }
        }));
      });

      star.addEventListener('mouseenter', () => {
        this.updateRatingHover(index + 1, ratingStars);
      });

      star.addEventListener('mouseleave', () => {
        this.updateRatingDisplay(currentRating, ratingStars);
      });
    });

    if (clearButton) {
      clearButton.addEventListener('click', () => {
        currentRating = 0;
        this.updateRatingDisplay(0, ratingStars);
        this.updateClearButton(clearButton, false);
        
        this.element.dispatchEvent(new CustomEvent('rating-clear'));
      });
    }

    this.updateClearButton(clearButton, false);
  }

  updateRatingDisplay(rating, stars) {
    stars.forEach((star, index) => {
      star.classList.remove('filled', 'hover');
      if (index < rating) {
        star.classList.add('filled');
      }
    });
  }

  updateRatingHover(rating, stars) {
    stars.forEach((star, index) => {
      star.classList.remove('filled', 'hover');
      if (index < rating) {
        star.classList.add('hover');
      }
    });
  }

  updateClearButton(button, show) {
    if (button) {
      button.disabled = !show;
      button.style.opacity = show ? '1' : '0.5';
    }
  }

  validate() {
    if (!this.input) return true;

    const value = this.input.value.trim();
    const isRequired = this.input.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';

    if (isRequired && !value) {
      isValid = false;
      errorMessage = 'Este campo é obrigatório';
    }

    if (value && this.input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Digite um email válido';
      }
    }

    this.setError(!isValid, errorMessage);
    
    return isValid;
  }

  setError(hasError, message = '') {
    if (hasError) {
      this.element.classList.add('field-error');
      this.showErrorMessage(message);
    } else {
      this.element.classList.remove('field-error');
      this.hideErrorMessage();
    }
  }

  showErrorMessage(message) {
    if (!this.errorMessage) {
      this.errorMessage = document.createElement('div');
      this.errorMessage.className = 'field-error-message';
      this.element.appendChild(this.errorMessage);
    }
    this.errorMessage.textContent = message;
  }

  hideErrorMessage() {
    if (this.errorMessage) {
      this.errorMessage.remove();
      this.errorMessage = null;
    }
  }

  getValue() {
    if (this.input) {
      return this.input.value;
    }
    
    const filledStars = this.element.querySelectorAll('.rating-star.filled');
    return filledStars.length;
  }

  setValue(value) {
    if (this.input) {
      this.input.value = value;
    }
  }

  setRating(rating) {
    const stars = this.element.querySelectorAll('.rating-star');
    const clearButton = this.element.querySelector('.rating-clear');
    
    this.updateRatingDisplay(rating, stars);
    this.updateClearButton(clearButton, rating > 0);
  }

  disable() {
    if (this.input) {
      this.input.disabled = true;
    }
    this.element.classList.add('field-disabled');
  }

  enable() {
    if (this.input) {
      this.input.disabled = false;
    }
    this.element.classList.remove('field-disabled');
  }
}

const FieldUtils = {
  initAll() {
    const fields = document.querySelectorAll('.field');
    const instances = [];
    
    fields.forEach(field => {
      instances.push(new Field(field));
    });
    
    return instances;
  },

  createField(options = {}) {
    const {
      type = 'text',
      label = 'Label',
      placeholder = 'Placeholder',
      required = false,
      id = `field-${Date.now()}`,
      value = ''
    } = options;

    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'field';

    const labelElement = document.createElement('label');
    labelElement.className = 'field-label';
    labelElement.htmlFor = id;
    labelElement.innerHTML = `${label}${required ? ' <span class="required">*</span>' : ''}`;

    let inputElement;
    if (type === 'textarea') {
      inputElement = document.createElement('textarea');
      inputElement.className = 'field-textarea';
    } else {
      inputElement = document.createElement('input');
      inputElement.type = type;
      inputElement.className = 'field-input';
    }

    inputElement.id = id;
    inputElement.placeholder = placeholder;
    inputElement.value = value;
    if (required) inputElement.required = true;

    fieldWrapper.appendChild(labelElement);
    fieldWrapper.appendChild(inputElement);

    new Field(fieldWrapper);
    
    return fieldWrapper;
  },

  createRating(options = {}) {
    const {
      label = 'Avaliação',
      maxStars = 5,
      showClear = true,
      id = `rating-${Date.now()}`
    } = options;

    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'field field-rating';

    const labelElement = document.createElement('label');
    labelElement.className = 'field-label';
    labelElement.textContent = label;

    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'rating-container';

    const starsContainer = document.createElement('div');
    starsContainer.className = 'rating-stars';

    for (let i = 0; i < maxStars; i++) {
      const star = document.createElement('span');
      star.className = 'rating-star';
      star.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      `;
      starsContainer.appendChild(star);
    }

    ratingContainer.appendChild(starsContainer);

    if (showClear) {
      const clearButton = document.createElement('button');
      clearButton.type = 'button';
      clearButton.className = 'rating-clear';
      clearButton.textContent = 'Limpar';
      ratingContainer.appendChild(clearButton);
    }

    fieldWrapper.appendChild(labelElement);
    fieldWrapper.appendChild(ratingContainer);

    new Field(fieldWrapper);
    
    return fieldWrapper;
  },

  validateForm(formElement) {
    const fields = formElement.querySelectorAll('.field');
    let isValid = true;

    fields.forEach(fieldElement => {
      const fieldInstance = new Field(fieldElement);
      if (!fieldInstance.validate()) {
        isValid = false;
      }
    });

    return isValid;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  FieldUtils.initAll();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Field, FieldUtils };
}