class Card {
  constructor(element) {
    this.element = element;
    this.editBtn = element.querySelector('.card-btn-edit');
    this.deleteBtn = element.querySelector('.card-btn-delete');
    
    this.init();
  }

  init() {
    this.addEventListeners();
    this.addInteractions();
  }

  addEventListeners() {
    if (this.editBtn) {
      this.editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleEdit();
      });
    }

    if (this.deleteBtn) {
      this.deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleDelete();
      });
    }

    this.element.addEventListener('click', (e) => {
      if (e.target.closest('.card-btn')) return;
      
      this.handleSelect();
    });
  }

  addInteractions() {
    this.element.addEventListener('mouseenter', () => {
      this.element.style.transform = 'translateY(-2px)';
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.style.transform = 'translateY(0)';
    });
  }

  handleEdit() {
    this.element.dispatchEvent(new CustomEvent('card-edit', {
      detail: {
        card: this.element,
        data: this.getCardData()
      },
      bubbles: true
    }));
  }

  handleDelete() {
    const confirmed = confirm('Tem certeza que deseja excluir este item?');
    
    if (confirmed) {
      this.element.dispatchEvent(new CustomEvent('card-delete', {
        detail: {
          card: this.element,
          data: this.getCardData()
        },
        bubbles: true
      }));
      
      this.animateDelete();
    }
  }

  handleSelect() {
    const isSelected = this.element.classList.contains('card-selected');
    
    const container = this.element.closest('.cards-grid');
    if (container) {
      container.querySelectorAll('.card-selected').forEach(card => {
        card.classList.remove('card-selected');
      });
    }
    
    if (!isSelected) {
      this.element.classList.add('card-selected');
      
      this.element.dispatchEvent(new CustomEvent('card-select', {
        detail: {
          card: this.element,
          data: this.getCardData()
        },
        bubbles: true
      }));
    }
  }

  animateDelete() {
    this.element.style.transition = 'all 0.3s ease-out';
    this.element.style.transform = 'scale(0.8)';
    this.element.style.opacity = '0';
    
    setTimeout(() => {
      this.element.remove();
    }, 300);
  }

  getCardData() {
    const title = this.element.querySelector('.card-title')?.textContent || '';
    const author = this.element.querySelector('.card-author')?.textContent || '';
    const status = this.element.querySelector('.card-status')?.textContent || '';
    const comment = this.element.querySelector('.card-comment')?.textContent || '';
    const rating = this.element.querySelectorAll('.card-rating-star.filled').length || 0;
    const image = this.element.querySelector('.card-image img')?.src || '';

    return {
      title,
      author,
      status,
      comment,
      rating,
      image
    };
  }

  setLoading(isLoading = true) {
    if (isLoading) {
      this.element.classList.add('card-loading');
    } else {
      this.element.classList.remove('card-loading');
    }
  }

  updateRating(rating) {
    const stars = this.element.querySelectorAll('.card-rating-star');
    stars.forEach((star, index) => {
      star.classList.toggle('filled', index < rating);
    });
  }

  updateImage(imageSrc) {
    const imageContainer = this.element.querySelector('.card-image');
    const placeholder = imageContainer.querySelector('.card-image-placeholder');
    
    if (imageSrc) {
      let img = imageContainer.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        imageContainer.appendChild(img);
      }
      img.src = imageSrc;
      img.alt = this.getCardData().title;
      
      if (placeholder) {
        placeholder.style.display = 'none';
      }
    } else {
      const img = imageContainer.querySelector('img');
      if (img) {
        img.remove();
      }
      if (placeholder) {
        placeholder.style.display = 'block';
      }
    }
  }
}

const CardUtils = {
  initAll() {
    const cards = document.querySelectorAll('.card');
    const instances = [];
    
    cards.forEach(card => {
      instances.push(new Card(card));
    });
    
    return instances;
  },

  create(options = {}) {
    const {
      title = 'Title',
      author = 'Author',
      status = '',
      comment = '',
      rating = 0,
      image = '',
      mobile = false,
      onEdit = null,
      onDelete = null
    } = options;

    const card = document.createElement('div');
    card.className = `card ${mobile ? 'card-mobile' : ''}`;

    const imageContainer = document.createElement('div');
    imageContainer.className = 'card-image';
    
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.alt = title;
      imageContainer.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'card-image-placeholder';
      placeholder.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19Z"/>
          <path d="M13.96,12.71L11.21,15.46L9.25,13.14L6.5,17H17.5L13.96,12.71Z"/>
        </svg>
      `;
      imageContainer.appendChild(placeholder);
    }

    const content = document.createElement('div');
    content.className = 'card-content';

    const titleElement = document.createElement('h3');
    titleElement.className = 'card-title';
    titleElement.textContent = title;

    const authorElement = document.createElement('p');
    authorElement.className = 'card-author';
    authorElement.textContent = author;

    const statusElement = document.createElement('p');
    statusElement.className = 'card-status';
    statusElement.textContent = status;

    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'card-rating';
    
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.className = `card-rating-star ${i < rating ? 'filled' : ''}`;
      star.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      `;
      ratingContainer.appendChild(star);
    }

    const commentElement = document.createElement('p');
    commentElement.className = 'card-comment';
    commentElement.textContent = comment;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'card-btn card-btn-edit';
    editBtn.innerHTML = `
      <span class="card-btn-icon">
        <svg viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      </span>
      Editar
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'card-btn card-btn-delete';
    deleteBtn.innerHTML = `
      <span class="card-btn-icon">
        <svg viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      </span>
      Excluir
    `;

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    content.appendChild(titleElement);
    content.appendChild(authorElement);
    if (status) content.appendChild(statusElement);
    content.appendChild(ratingContainer);
    if (comment) content.appendChild(commentElement);
    content.appendChild(actions);

    card.appendChild(imageContainer);
    card.appendChild(content);

    if (onEdit) {
      editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        onEdit(card);
      });
    }

    if (onDelete) {
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        onDelete(card);
      });
    }

    new Card(card);
    
    return card;
  },

  createGrid(options = {}) {
    const {
      mobileLayout = false,
      className = ''
    } = options;

    const grid = document.createElement('div');
    grid.className = `cards-grid ${mobileLayout ? 'mobile-layout' : ''} ${className}`.trim();

    return grid;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CardUtils.initAll();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Card, CardUtils };
}