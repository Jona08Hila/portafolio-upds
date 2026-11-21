import { sanitizeText, validateField } from './security.js';

const hasJQ = () => typeof window.jQuery === 'function';

function toggleSlide(el) {
  if (!el) return;
  if (hasJQ()) {
    window.jQuery(el).slideToggle(150);
  } else {
    el.style.display = el.style.display === 'flex' ? 'none' : 'flex';
  }
}

function hideAllMenus() {
  if (hasJQ()) {
    window.jQuery('.section-dropdown').hide();
  } else {
    document.querySelectorAll('.section-dropdown').forEach((m) => {
      m.style.display = 'none';
    });
  }
}

export class PortfolioUIController {
  constructor(payload) {
    this.payload = payload;
    this.selectedGames = new Set();
    this.currentSlide = 0;
    this.isHydrated = false;
    this.eventsBound = false;
  }

  hydrateAllControls() {
    this.isHydrated = true;
    document.querySelectorAll('[data-hydrate="true"]').forEach((el) => {
      el.dataset.hydrated = 'ready';
    });

    const hydrateBtn = document.getElementById('btn-hydrate');
    if (hydrateBtn) {
      hydrateBtn.classList.add('hydrated');
      hydrateBtn.textContent = 'Hidratado';
    }

    this.renderGames('all');
    this.renderTracks('all');
    this.renderRoutine('all');
    this.renderCarousel();

    if (!this.eventsBound) {
      this.bindDelegatedEvents();
      this.eventsBound = true;
    }
  }

  bindDelegatedEvents() {
    const shell = document.getElementById('app-shell');
    if (!shell) return;

    shell.addEventListener('click', (event) => {
      const target = event.target.closest('button');
      if (!target) return;

      if (target.dataset.nav) {
        this.switchView(target.dataset.nav);
        return;
      }

      if (target.closest('#game-filters') && target.dataset.filter) {
        this.setActivePill('#game-filters', target);
        this.renderGames(target.dataset.filter);
        return;
      }

      if (target.closest('#music-filters') && target.dataset.filter) {
        this.setActivePill('#music-filters', target);
        this.renderTracks(target.dataset.filter);
        return;
      }

      if (target.closest('#routine-filters') && target.dataset.day) {
        this.setActivePill('#routine-filters', target);
        this.renderRoutine(target.dataset.day);
        return;
      }

      if (target.closest('#games-list') && target.dataset.gameId) {
        this.toggleGameSelection(target.dataset.gameId, target);
        return;
      }

      if (target.closest('#tracks-list') && target.dataset.trackId) {
        this.selectTrack(target.dataset.trackId);
        return;
      }

      if (target.dataset.action) {
        this.handleAction(target.dataset.action, target);
      }
    });

    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('input', (event) => {
        const input = event.target;
        if (!input.name) return;
        this.applyFieldValidation(input);
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleFormSubmit(form);
      });
    }

    const themeBtn = document.getElementById('btn-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    const thumbs = document.getElementById('carousel-thumbs');
    if (thumbs) {
      thumbs.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-slide-index]');
        if (!btn) return;
        this.currentSlide = Number(btn.dataset.slideIndex);
        this.renderCarousel();
      });
    }
  }

  switchView(viewName) {
    hideAllMenus();
    document.querySelectorAll('.view-panel').forEach((panel) => {
      panel.classList.remove('active');
      panel.style.display = 'none';
    });

    const nextView = document.getElementById(`view-${viewName}`);
    if (nextView) {
      nextView.classList.add('active');
      if (hasJQ()) {
        window.jQuery(nextView).css('display', 'flex').hide().fadeIn(160);
      } else {
        nextView.style.display = 'flex';
      }
    }

    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.nav === viewName);
    });
  }

  handleAction(action, button) {
    switch (action) {
      case 'toggle-section-menu': {
        const menu = document.getElementById(button.dataset.target);
        toggleSlide(menu);
        break;
      }
      case 'carousel-prev': {
        const total = this.payload.gallery.length;
        this.currentSlide = (this.currentSlide - 1 + total) % total;
        this.renderCarousel();
        break;
      }
      case 'carousel-next': {
        const total = this.payload.gallery.length;
        this.currentSlide = (this.currentSlide + 1) % total;
        this.renderCarousel();
        break;
      }
      default:
        break;
    }
  }

  setActivePill(containerSelector, activeBtn) {
    document.querySelectorAll(`${containerSelector} .pill`).forEach((pill) => {
      pill.classList.remove('active');
    });
    activeBtn.classList.add('active');
  }

  renderGames(filter) {
    const container = document.getElementById('games-list');
    if (!container) return;
    container.textContent = '';

    const filtered = filter === 'all'
      ? this.payload.games
      : this.payload.games.filter((g) => g.category === filter);

    filtered.forEach((game) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'item-card';
      card.dataset.gameId = game.id;
      if (this.selectedGames.has(game.id)) {
        card.classList.add('selected');
      }

      const img = document.createElement('img');
      img.className = 'card-media';
      img.src = game.image;
      img.alt = game.title;
      img.loading = 'lazy';

      const tag = document.createElement('span');
      tag.className = 'card-code';
      tag.textContent = game.genre;

      const title = document.createElement('h3');
      title.textContent = game.title;

      const desc = document.createElement('p');
      desc.textContent = game.detail;

      card.append(img, tag, title, desc);
      container.appendChild(card);
    });
  }

  toggleGameSelection(gameId, cardElement) {
    if (this.selectedGames.has(gameId)) {
      this.selectedGames.delete(gameId);
      cardElement.classList.remove('selected');
    } else {
      this.selectedGames.add(gameId);
      cardElement.classList.add('selected');
    }
    const counter = document.getElementById('selected-count');
    if (counter) counter.textContent = String(this.selectedGames.size);
  }

  renderTracks(filter) {
    const container = document.getElementById('tracks-list');
    if (!container) return;
    container.textContent = '';

    const filtered = filter === 'all'
      ? this.payload.tracks
      : this.payload.tracks.filter((t) => t.category === filter);

    filtered.forEach((track) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'item-card';
      card.dataset.trackId = track.id;

      const tag = document.createElement('span');
      tag.className = 'card-code';
      tag.textContent = `${track.category.toUpperCase()} | ${track.duration}`;

      const title = document.createElement('h3');
      title.textContent = track.title;

      const artist = document.createElement('p');
      artist.textContent = track.artist;

      const ytLink = document.createElement('span');
      ytLink.className = 'yt-inline-link';
      ytLink.textContent = track.youtubeUrl;

      card.append(tag, title, artist, ytLink);
      container.appendChild(card);
    });
  }

  selectTrack(trackId) {
    const track = this.payload.tracks.find((t) => t.id === trackId);
    if (!track) return;

    const stage = document.getElementById('now-playing-stage');
    const stateLabel = document.getElementById('playing-state-label');
    const ytAnchor = document.getElementById('playing-youtube-link');
    const videoEl = document.getElementById('music-trailer-video');

    if (stage && track.bgImage) {
      stage.style.backgroundImage = `linear-gradient(rgba(11, 13, 20, 0.78), rgba(11, 13, 20, 0.88)), url("${track.bgImage}")`;
    }
    if (stateLabel) {
      stateLabel.textContent = `Reproduciendo: ${track.title} - ${track.artist}`;
    }
    if (ytAnchor) {
      ytAnchor.href = track.youtubeUrl;
      ytAnchor.textContent = `YouTube: ${track.youtubeUrl}`;
    }
    if (videoEl && track.trailerUrl) {
      videoEl.src = track.trailerUrl;
      videoEl.play().catch(() => {});
    }
  }

  renderRoutine(day) {
    const container = document.getElementById('routine-list');
    if (!container) return;
    container.textContent = '';

    const filtered = day === 'all'
      ? this.payload.routine
      : this.payload.routine.filter((r) => r.day === day);

    filtered.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'item-card';

      const tag = document.createElement('span');
      tag.className = 'card-code';
      tag.textContent = `${item.area} | ${item.schedule}`;

      const title = document.createElement('h3');
      title.textContent = item.title;

      const desc = document.createElement('p');
      desc.textContent = item.detail;

      card.append(tag, title, desc);
      container.appendChild(card);
    });
  }

  renderCarousel() {
    const slide = this.payload.gallery[this.currentSlide];
    const img = document.getElementById('carousel-img');
    const caption = document.getElementById('carousel-caption');
    if (!slide || !img || !caption) return;

    img.src = slide.url;
    img.alt = slide.caption;
    caption.textContent = slide.caption;

    const thumbsContainer = document.getElementById('carousel-thumbs');
    if (!thumbsContainer) return;
    thumbsContainer.textContent = '';

    this.payload.gallery.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `thumb-btn ${index === this.currentSlide ? 'active' : ''}`;
      btn.dataset.slideIndex = String(index);

      const thumbImg = document.createElement('img');
      thumbImg.src = item.url;
      thumbImg.alt = item.caption;
      thumbImg.loading = 'lazy';

      btn.appendChild(thumbImg);
      thumbsContainer.appendChild(btn);
    });
  }

  applyFieldValidation(input) {
    const { valid, error } = validateField(input.name, input.value);
    const errorEl = document.getElementById(`error-${input.name}`);

    input.classList.toggle('invalid', !valid);
    input.classList.toggle('valid', valid);
    if (errorEl) {
      errorEl.textContent = error;
    }
    return valid;
  }

  handleFormSubmit(form) {
    const inputs = Array.from(form.querySelectorAll('input[required]'));
    const allValid = inputs.every((inp) => this.applyFieldValidation(inp));
    const feedback = document.getElementById('form-feedback');

    if (!allValid) {
      if (feedback) {
        feedback.style.color = 'var(--danger-color)';
        feedback.textContent = 'Corrige los campos marcados en rojo antes de enviar.';
      }
      return;
    }

    const cleanData = {
      name: sanitizeText(form.name.value.trim()),
      email: sanitizeText(form.email.value.trim()),
      phone: sanitizeText(form.phone.value.trim()),
      message: sanitizeText(form.message.value.trim())
    };

    localStorage.setItem('upds_last_contact', JSON.stringify(cleanData));
    if (feedback) {
      feedback.style.color = 'var(--success-color)';
      feedback.textContent = `Mensaje validado y guardado para ${cleanData.name}.`;
    }
    form.reset();
    inputs.forEach((inp) => inp.classList.remove('valid', 'invalid'));
  }

  toggleTheme() {
    const html = document.documentElement;
    const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);
    localStorage.setItem('upds_theme', nextTheme);
  }
}