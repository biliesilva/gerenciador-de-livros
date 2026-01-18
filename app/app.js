class LibraryApp {
  constructor() {
    this.books = this.loadBooks();
    this.currentEditId = null;
    this.currentRating = 0;
    this.filteredBooks = [...this.books];
    this.currentView = 'grid'; 
    
    this.init();
  }

  init() {
    this.loadSearchIcon();
    this.setupEventListeners();
    this.updateStats();
    this.renderBooks();
    this.setupRatingSystem();
  }

  loadSearchIcon() {
    const searchIcon = document.querySelector('.search-container .icon-search');
    if (searchIcon) {
      searchIcon.innerHTML = `
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.6667 24C20.5577 24 25.3333 19.2244 25.3333 13.3333C25.3333 7.44233 20.5577 2.66667 14.6667 2.66667C8.77563 2.66667 4 7.44233 4 13.3333C4 19.2244 8.77563 24 14.6667 24ZM14.6667 21.3333C10.5007 21.3333 6.66667 17.4993 6.66667 13.3333C6.66667 9.16733 10.5007 5.33333 14.6667 5.33333C18.8327 5.33333 22.6667 9.16733 22.6667 13.3333C22.6667 17.4993 18.8327 21.3333 14.6667 21.3333Z"/>
          <path d="M22.0781 20.6642C22.66 20.0823 23.6067 20.0823 24.1886 20.6642L28.4719 24.9475C29.0538 25.5295 29.0538 26.4762 28.4719 27.0581C27.89 27.64 26.9433 27.64 26.3614 27.0581L22.0781 22.7748C21.4962 22.1929 21.4962 21.2462 22.0781 20.6642Z"/>
        </svg>
      `;
    }
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal-overlay')) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    document.getElementById('status').addEventListener('change', (e) => {
      this.toggleRatingAndComment(e.target.value);
    });
  }

  toggleRatingAndComment(status, clearValues = true) {
    const ratingField = document.querySelector('.field-rating');
    const commentFieldWrapper = document.getElementById('comment').closest('.field');
    const commentField = document.getElementById('comment');
    const ratingStars = document.getElementById('rating-stars');
    const isDisabled = status !== 'Lido';

    if (isDisabled) {
      ratingField.classList.add('field-disabled');
      commentFieldWrapper.classList.add('field-disabled');
      commentField.disabled = true;
      ratingStars.style.pointerEvents = 'none';
      ratingStars.style.opacity = '0.5';
      
      if (clearValues) {
        this.clearRating();
        commentField.value = '';
      }
    } else {
      ratingField.classList.remove('field-disabled');
      commentFieldWrapper.classList.remove('field-disabled');
      commentField.disabled = false;
      ratingStars.style.pointerEvents = 'auto';
      ratingStars.style.opacity = '1';
    }
  }

  setupRatingSystem() {
    const ratingStars = document.querySelectorAll('#rating-stars .rating-star');
    
    ratingStars.forEach((star, index) => {
      star.addEventListener('click', () => {
        this.setRating(index + 1);
      });

      star.addEventListener('mouseenter', () => {
        this.highlightRating(index + 1);
      });
    });

    document.getElementById('rating-stars').addEventListener('mouseleave', () => {
      this.highlightRating(this.currentRating);
    });
  }

  setRating(rating) {
    this.currentRating = rating;
    this.highlightRating(rating);
  }

  highlightRating(rating) {
    const stars = document.querySelectorAll('#rating-stars .rating-star');
    stars.forEach((star, index) => {
      const icon = star.querySelector('.icon');
      if (index < rating) {
        star.classList.add('filled');
        icon.classList.add('filled');
      } else {
        star.classList.remove('filled');
        icon.classList.remove('filled');
      }
    });
  }

  clearRating() {
    this.currentRating = 0;
    this.highlightRating(0);
  }

  loadBooks() {
    const stored = localStorage.getItem('library-books');
    return stored ? JSON.parse(stored) : [];
  }

  saveBooks() {
    localStorage.setItem('library-books', JSON.stringify(this.books));
    this.updateStats();
  }

  setView(view) {
    this.currentView = view;
    
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    const container = document.getElementById('books-container');
    if (view === 'list') {
      container.classList.add('list-view');
    } else {
      container.classList.remove('list-view');
    }
    
    this.renderBooks();
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  openAddModal() {
    this.currentEditId = null;
    this.currentRating = 0;
    
    document.getElementById('modal-title').textContent = 'Adicionar Livro';
    document.getElementById('save-btn').textContent = 'Adicionar';
    document.getElementById('book-form').reset();
    this.clearRating();
    
    this.toggleRatingAndComment('Quero ler');
    
    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  openEditModal(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) return;

    this.currentEditId = bookId;
    this.currentRating = book.rating || 0;

    document.getElementById('modal-title').textContent = 'Editar Livro';
    document.getElementById('save-btn').textContent = 'Atualizar';
    
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('image-url').value = book.imageUrl || '';
    document.getElementById('status').value = book.status;
    document.getElementById('comment').value = book.comment || '';
    
    this.setRating(book.rating || 0);
    
    this.toggleRatingAndComment(book.status, false);
    
    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('book-form').reset();
    this.clearRating();
    this.currentEditId = null;
  }

  saveBook(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookData = {
      title: document.getElementById('title').value.trim(),
      author: document.getElementById('author').value.trim(),
      imageUrl: document.getElementById('image-url').value.trim(),
      status: document.getElementById('status').value,
      rating: this.currentRating,
      comment: document.getElementById('comment').value.trim(),
      createdAt: new Date().toISOString()
    };

    if (!bookData.title || !bookData.author) {
      alert('Título e autor são obrigatórios!');
      return;
    }

    if (this.currentEditId) {
      const bookIndex = this.books.findIndex(b => b.id === this.currentEditId);
      if (bookIndex !== -1) {
        this.books[bookIndex] = { ...this.books[bookIndex], ...bookData };
      }
    } else {
      const newBook = {
        id: this.generateId(),
        ...bookData
      };
      this.books.unshift(newBook);
    }

    this.saveBooks();
    this.updateStats();
    this.filterBooks();  
    this.closeModal();
  }

  deleteBook(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) return;

    const confirmed = confirm(`Tem certeza que deseja excluir "${book.title}"?`);
    if (confirmed) {
      this.books = this.books.filter(b => b.id !== bookId);
      this.saveBooks();
      this.updateStats();
      this.filterBooks();  
    }
  }

  updateStats() {
    const stats = {
      total: this.books.length,
      wantToRead: this.books.filter(b => b.status === 'Quero ler').length,
      reading: this.books.filter(b => b.status === 'Lendo').length,
      read: this.books.filter(b => b.status === 'Lido').length
    };

    document.getElementById('total-books').textContent = stats.total;
    document.getElementById('want-to-read').textContent = stats.wantToRead;
    document.getElementById('reading').textContent = stats.reading;
    document.getElementById('read').textContent = stats.read;
  }

  filterBooks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const statusFilter = document.getElementById('status-filter').value;

    this.filteredBooks = this.books.filter(book => {
      const matchesSearch = !searchTerm || 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm);
      
      const matchesStatus = !statusFilter || book.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.renderBooks();
  }

  getStatusColor(status) {
    const statusColors = {
      'Quero ler': 'var(--secondary-500)',
      'Lendo': 'var(--primary-500)', 
      'Lido': 'var(--success-500)'
    };
    return statusColors[status] || 'var(--gray-500)';
  }

  getStatusBadgeClass(status) {
    const statusClasses = {
      'Quero ler': 'quero-ler',
      'Lendo': 'lendo',
      'Lido': 'lido'
    };
    return statusClasses[status] || 'default';
  }

  renderBooks() {
    const container = document.getElementById('books-container');
    const emptyState = document.getElementById('empty-state');

    if (this.filteredBooks.length === 0) {
      container.style.display = 'none';
      emptyState.style.display = 'block';
      
      const searchTerm = document.getElementById('search-input').value.trim();
      const statusFilter = document.getElementById('status-filter').value;
      
      if (searchTerm || statusFilter) {
        emptyState.querySelector('h3').textContent = 'Nenhum livro encontrado';
        emptyState.querySelector('p').textContent = 'Nenhum livro encontrado com os filtros aplicados. Tente ajustar sua busca.';
        emptyState.querySelector('.btn').style.display = 'none';
      } else if (this.books.length === 0) {
        emptyState.querySelector('h3').textContent = 'Sua biblioteca está vazia';
        emptyState.querySelector('p').textContent = 'Nenhum livro adicionado ainda. Comece adicionando seu primeiro livro!';
        emptyState.querySelector('.btn').style.display = 'inline-flex';
      }
      
      return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';

    container.innerHTML = this.filteredBooks.map(book => this.createBookCard(book)).join('');
  }

  createBookCard(book, isCompact = false) {
    const imageUrl = book.imageUrl || this.getDefaultBookImage();
    const stars = this.generateStarsHTML(book.rating || 0);
    const statusColor = this.getStatusColor(book.status);

    const compactClass = isCompact ? 'card-compact' : '';
    const listClass = '';

    return `
      <div class="card ${compactClass} ${listClass}" data-book-id="${book.id}">
        <div class="card-image">
          ${book.imageUrl 
            ? `<img src="${imageUrl}" alt="${this.escapeHTML(book.title)}" onerror="this.style.display='none'; this.parentNode.classList.add('has-placeholder'); this.insertAdjacentHTML('afterend', this.parentNode.querySelector('.card-image-placeholder') ? '' : '<div class=\\'card-image-placeholder\\'><div class=\\'icon icon-book\\' style=\\'width: 32px; height: 32px; color: var(--gray-400);\\'><svg viewBox=\\'0 0 32 32\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M14.667 28.0003V9.33333C14.667 8.59695 15.2636 8.00033 16 8.00033C16.7363 8.00033 17.333 8.59695 17.333 9.33333V28.0003C17.3328 28.7366 16.7362 29.3333 16 29.3333C15.2637 29.3333 14.6671 28.7366 14.667 28.0003Z\\'/><path d=\\'M21.3336 5.33301C20.2728 5.33301 19.2547 5.75474 18.5045 6.50488C17.8014 7.20807 17.3876 8.14628 17.3385 9.13477L17.333 9.33333L17.3268 9.46973C17.2585 10.1421 16.69 10.667 15.9996 10.667C15.2634 10.6668 14.667 10.0696 14.667 9.33333C14.6669 8.27258 14.2448 7.25495 13.4948 6.50488C12.7446 5.75484 11.7274 5.33301 10.6666 5.33301H3.99963V22.667H11.9996C13.414 22.667 14.7709 23.2284 15.7711 24.2285C15.8503 24.3077 15.926 24.3901 15.9996 24.4736C16.0734 24.39 16.1498 24.3078 16.2291 24.2285C17.2292 23.2286 18.5854 22.6671 19.9996 22.667H27.9996V5.33301H21.3336ZM30.6666 22.667C30.6665 23.3741 30.3854 24.0527 29.8854 24.5527C29.3853 25.0526 28.7067 25.333 27.9996 25.333H19.9996C19.2925 25.3331 18.6139 25.6142 18.1139 26.1143C17.6139 26.6143 17.333 27.2932 17.333 28.0003L17.3268 28.1367C17.2583 28.8089 16.6902 29.3333 16 29.3333C15.3099 29.3332 14.7419 28.8088 14.6735 28.1367L14.667 28.0003L14.6539 27.7363C14.5933 27.1259 14.3229 26.5518 13.8854 26.1143C13.3853 25.6143 12.7068 25.333 11.9996 25.333H3.99963C3.29251 25.3329 2.61391 25.0528 2.11389 24.5527C1.61387 24.0527 1.3337 23.3741 1.33362 22.667V5.33301C1.3337 4.62588 1.61387 3.94729 2.11389 3.44727C2.61391 2.94725 3.29251 2.66708 3.99963 2.66699H10.6666C12.4347 2.66699 14.1303 3.369 15.3805 4.61914C15.6051 4.84379 15.8113 5.08372 15.9996 5.33496C16.188 5.08366 16.3941 4.84383 16.6188 4.61914C17.869 3.3689 19.5655 2.66699 21.3336 2.66699H27.9996C28.7067 2.66699 29.3853 2.94737 29.8854 3.44727C30.3854 3.94729 30.6665 4.62588 30.6666 5.33301V22.667Z\\'/></svg></div></div>');">`
            : this.getDefaultBookImageHTML()
          }
        </div>
        <div class="card-content">
          <h3 class="card-title">${this.escapeHTML(book.title)}</h3>
          <p class="card-author">${this.escapeHTML(book.author)}</p>
          <div class="card-status-container">
            ${createStatusBadge(book.status).outerHTML}
          </div>
          ${book.status === 'Lido' && book.rating > 0 ? `<div class="card-rating">${stars}</div>` : ''}
          ${book.status === 'Lido' && book.comment && !isCompact ? `<div class="card-comment-wrapper"><p class="card-comment">${this.escapeHTML(book.comment)}</p><span class="card-comment-tooltip">${this.escapeHTML(book.comment)}</span></div>` : ''}
        </div>
        <div class="card-actions">
          <button class="card-btn card-btn-edit" onclick="app.openEditModal('${book.id}')">
            <span class="card-btn-icon">
              <div class="icon icon-edit">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.9998 6.4248C27.9999 5.78165 27.7445 5.16482 27.2898 4.70996C26.8351 4.2551 26.2182 3.9991 25.575 3.99902C25.0121 3.99896 24.4695 4.19515 24.0379 4.54883L23.8601 4.70898L6.06521 22.5078L6.06424 22.5098C5.90959 22.664 5.79531 22.8537 5.73123 23.0625L4.33279 27.665L8.94217 26.2676C9.15059 26.204 9.34057 26.0904 9.4949 25.9365L27.2888 8.13965L27.45 7.96191C27.8038 7.53035 27.9997 6.98775 27.9998 6.4248ZM30.6668 6.4248C30.6666 7.69101 30.1945 8.90878 29.3484 9.84277L29.1746 10.0254L11.3777 27.8252C10.9141 28.2873 10.3438 28.6288 9.71756 28.8193L3.91189 30.5801L3.90896 30.5811C3.56327 30.6849 3.19553 30.6935 2.84549 30.6055C2.49556 30.5175 2.17609 30.3359 1.92068 30.0811C1.66518 29.826 1.48291 29.5062 1.39431 29.1562C1.30573 28.8063 1.31343 28.4387 1.41678 28.0928L1.41873 28.0869L3.18045 22.2842L3.18142 22.2812C3.37345 21.655 3.71584 21.0848 4.17947 20.6221L21.9744 2.82422C22.9293 1.86954 24.2247 1.33293 25.575 1.33301C26.9253 1.33318 28.2208 1.8693 29.1756 2.82422C30.1303 3.77916 30.6668 5.07449 30.6668 6.4248Z" fill="currentColor"/>
                  <path d="M19.0576 5.72412C19.5783 5.20342 20.4217 5.20342 20.9424 5.72412L26.2764 11.0571C26.7969 11.5778 26.797 12.4222 26.2764 12.9429C25.7558 13.4635 24.9114 13.4634 24.3907 12.9429L19.0576 7.60889C18.5369 7.08819 18.5369 6.24482 19.0576 5.72412Z" fill="currentColor"/>
                </svg>
              </div>
            </span>
            ${isCompact ? '' : 'Editar'}
          </button>
          <button class="card-btn card-btn-delete" onclick="app.deleteBook('${book.id}')">
            <span class="card-btn-icon">
              <div class="icon icon-delete">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0004 22.6665V14.6665C12.0004 13.9301 12.597 13.3335 13.3334 13.3335C14.0698 13.3335 14.6664 13.9301 14.6664 14.6665V22.6665C14.6664 23.4029 14.0698 23.9995 13.3334 23.9995C12.597 23.9995 12.0004 23.4029 12.0004 22.6665Z" fill="currentColor"/>
                  <path d="M17.3336 22.6665V14.6665C17.3336 13.9301 17.9302 13.3335 18.6666 13.3335C19.403 13.3335 19.9996 13.9301 19.9996 14.6665V22.6665C19.9996 23.4029 19.403 23.9995 18.6666 23.9995C17.9302 23.9995 17.3336 23.4029 17.3336 22.6665Z" fill="currentColor"/>
                  <path d="M5.33362 26.667V8C5.33362 7.26362 5.93025 6.66699 6.66663 6.66699C7.40301 6.66699 7.99963 7.26362 7.99963 8V26.667C7.99972 27.0204 8.14039 27.3594 8.39026 27.6094C8.64031 27.8594 8.98 28 9.33362 28H22.6666C23.0202 28 23.359 27.8593 23.609 27.6094C23.859 27.3594 23.9995 27.0205 23.9996 26.667V8C23.9996 7.26362 24.5972 6.66699 25.3336 6.66699C26.0698 6.66717 26.6666 7.26373 26.6666 8V26.667C26.6665 27.7277 26.2448 28.745 25.4948 29.4951C24.7446 30.2452 23.7274 30.667 22.6666 30.667H9.33362C8.27275 30.667 7.25466 30.2453 6.50452 29.4951C5.75455 28.7451 5.3337 27.7277 5.33362 26.667Z" fill="currentColor"/>
                  <path d="M28 6.66699C28.7364 6.66699 29.333 7.26362 29.333 8C29.333 8.73638 28.7364 9.33301 28 9.33301H4C3.26362 9.33301 2.66699 8.73638 2.66699 8C2.66699 7.26362 3.26362 6.66699 4 6.66699H28Z" fill="currentColor"/>
                </svg>
              </div>
            </span>
            ${isCompact ? '' : 'Excluir'}
          </button>
        </div>
      </div>
    `;
  }

  generateStarsHTML(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating ? 'filled' : '';
      starsHTML += `
        <span class="card-rating-star ${filled}">
          <div class="icon icon-star ${filled}">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.1419 1.33887C16.4251 1.35861 16.7013 1.4368 16.9524 1.56934L17.0764 1.64062L17.1946 1.71973C17.4248 1.88598 17.6176 2.09864 17.761 2.34375L17.8284 2.46875L17.8294 2.46973L20.9094 8.70898C21.0168 8.92579 21.1747 9.11356 21.3704 9.25586C21.5663 9.39832 21.7938 9.49116 22.0335 9.52637L28.9212 10.5342C29.2506 10.5821 29.5616 10.7098 29.8294 10.9053L29.9407 10.9932L30.0471 11.0879C30.2852 11.3188 30.4636 11.6051 30.5667 11.9219C30.6844 12.2838 30.6987 12.6715 30.6077 13.041C30.5165 13.4106 30.3236 13.7479 30.051 14.0137L25.0686 18.8652C24.8952 19.0344 24.7656 19.2432 24.6907 19.4736C24.6157 19.7042 24.5972 19.9495 24.638 20.1885L25.8128 27.0352L25.8333 27.1768C25.868 27.508 25.8209 27.8441 25.6956 28.1543C25.5524 28.5086 25.3123 28.8154 25.0032 29.04C24.6938 29.2648 24.3271 29.3983 23.9456 29.4248C23.5641 29.4513 23.1825 29.3701 22.845 29.1904L16.6946 25.9561C16.4802 25.8436 16.2414 25.7852 15.9993 25.7852C15.757 25.7852 15.5185 25.8444 15.304 25.957L15.303 25.9561L9.15065 29.1914L9.15162 29.1924C8.81434 29.3708 8.43362 29.4508 8.05299 29.4238C7.67214 29.3968 7.30611 29.2636 6.99733 29.0391C6.68855 28.8145 6.44901 28.5073 6.30592 28.1533C6.1629 27.7994 6.12179 27.4121 6.18776 27.0361L7.36158 20.1895L7.38209 20.0088C7.39083 19.8281 7.36607 19.6466 7.30983 19.4736C7.23477 19.243 7.1047 19.0335 6.93092 18.8643L1.95436 14.0186C1.67958 13.7532 1.48437 13.4165 1.39186 13.0459C1.29936 12.6751 1.31298 12.2853 1.43092 11.9219C1.54888 11.5586 1.76643 11.2359 2.05885 10.9902L2.17115 10.9023C2.40203 10.7344 2.66541 10.6163 2.94459 10.5566L3.08522 10.5322L9.96607 9.52637C10.2058 9.49145 10.4341 9.39819 10.6301 9.25586C10.826 9.11358 10.9847 8.92598 11.0921 8.70898L14.1712 2.46973L14.1721 2.46875C14.3408 2.12803 14.6011 1.84116 14.9241 1.64062L15.0471 1.56934C15.3401 1.4146 15.6675 1.33398 16.0003 1.33398L16.1419 1.33887ZM13.4837 9.88867C13.1849 10.4934 12.7432 11.0177 12.1975 11.4141C11.652 11.8103 11.0181 12.0669 10.3508 12.1641L4.71803 12.9883L8.79127 16.9541C9.27503 17.4252 9.63715 18.0073 9.84596 18.6494C10.0547 19.2915 10.1046 19.9751 9.99049 20.6406L9.02955 26.2422L14.0637 23.5957L14.2913 23.4854C14.8274 23.2441 15.4094 23.1182 15.9993 23.1182C16.5891 23.1182 17.1712 23.2441 17.7073 23.4854L17.9348 23.5957L22.971 26.2432L22.01 20.6387C21.8965 19.9736 21.9458 19.29 22.1546 18.6484C22.3633 18.0069 22.7251 17.426 23.2083 16.9551L27.2796 12.9883L21.6467 12.165C20.9801 12.0672 20.3469 11.8084 19.802 11.4121C19.2572 11.0158 18.8163 10.4936 18.5178 9.88965L16.0003 4.78906L13.4837 9.88867Z"/>
            </svg>
          </div>
        </span>
      `;
    }
    return starsHTML;
  }

  getDefaultBookImage() {
    return 'https://via.placeholder.com/200x300/e5e7eb/9ca3af?text=Sem+Imagem';
  }

  getDefaultBookImageHTML() {
    return `
      <div class="card-image-placeholder">
        <div class="icon icon-book" style="color: var(--gray-400);">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.667 28.0003V9.33333C14.667 8.59695 15.2636 8.00033 16 8.00033C16.7363 8.00033 17.333 8.59695 17.333 9.33333V28.0003C17.3328 28.7366 16.7362 29.3333 16 29.3333C15.2637 29.3333 14.6671 28.7366 14.667 28.0003Z"/>
            <path d="M21.3336 5.33301C20.2728 5.33301 19.2547 5.75474 18.5045 6.50488C17.8014 7.20807 17.3876 8.14628 17.3385 9.13477L17.333 9.33333L17.3268 9.46973C17.2585 10.1421 16.69 10.667 15.9996 10.667C15.2634 10.6668 14.667 10.0696 14.667 9.33333C14.6669 8.27258 14.2448 7.25495 13.4948 6.50488C12.7446 5.75484 11.7274 5.33301 10.6666 5.33301H3.99963V22.667H11.9996C13.414 22.667 14.7709 23.2284 15.7711 24.2285C15.8503 24.3077 15.926 24.3901 15.9996 24.4736C16.0734 24.39 16.1498 24.3078 16.2291 24.2285C17.2292 23.2286 18.5854 22.6671 19.9996 22.667H27.9996V5.33301H21.3336ZM30.6666 22.667C30.6665 23.3741 30.3854 24.0527 29.8854 24.5527C29.3853 25.0526 28.7067 25.333 27.9996 25.333H19.9996C19.2925 25.3331 18.6139 25.6142 18.1139 26.1143C17.6139 26.6143 17.333 27.2932 17.333 28.0003L17.3268 28.1367C17.2583 28.8089 16.6902 29.3333 16 29.3333C15.3099 29.3332 14.7419 28.8088 14.6735 28.1367L14.667 28.0003L14.6539 27.7363C14.5933 27.1259 14.3229 26.5518 13.8854 26.1143C13.3853 25.6143 12.7068 25.333 11.9996 25.333H3.99963C3.29251 25.3329 2.61391 25.0528 2.11389 24.5527C1.61387 24.0527 1.3337 23.3741 1.33362 22.667V5.33301C1.3337 4.62588 1.61387 3.94729 2.11389 3.44727C2.61391 2.94725 3.29251 2.66708 3.99963 2.66699H10.6666C12.4347 2.66699 14.1303 3.369 15.3805 4.61914C15.6051 4.84379 15.8113 5.08372 15.9996 5.33496C16.188 5.08366 16.3941 4.84383 16.6188 4.61914C17.869 3.3689 19.5655 2.66699 21.3336 2.66699H27.9996C28.7067 2.66699 29.3853 2.94737 29.8854 3.44727C30.3854 3.94729 30.6665 4.62588 30.6666 5.33301V22.667Z"/>
          </svg>
        </div>
      </div>
    `;
  }

  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

function openAddModal() {
  app.openAddModal();
}

function closeModal() {
  app.closeModal();
}

function saveBook(event) {
  app.saveBook(event);
}

function clearRating() {
  app.clearRating();
}

function filterBooks() {
  app.filterBooks();
}


let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new LibraryApp();
});