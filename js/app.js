// Initial guest wishes data from original event
let wishesList = [
  {
    id: 1,
    name: "Иқтияр мен Асель",
    date: "27.07.2026",
    comment: "Құрметті ағайын-туыс, бауырлар мен достар! Салтанатты үйлену тойы құтты болсын! Жұптарыңыз жазылмасын, бақытты болыңыздар!",
    likes: 1
  },
  {
    id: 2,
    name: "Аяна",
    date: "28.05.2026",
    comment: "Бақытты болыңдар, өмір жастарың ұзақ болсын. Той құтты болсын❤️",
    likes: 3
  },
  {
    id: 3,
    name: "Жанерке",
    date: "11.07.2026",
    comment: "Той құтты болсын! Екі жас мәңгілік бақытты болсын, шаңырақтарыңыз биік болсын!",
    likes: 2
  },
  {
    id: 4,
    name: "Нұрлан Ақмарал",
    date: "30.06.2026",
    comment: "Құрметті Ағайын-туыс, бауырлар! Қуаныш құтты болсын! Сағи мен Нұрай бақытты болыңдар!",
    likes: 5
  }
];

// Load any locally added wishes from localStorage
try {
  const saved = localStorage.getItem('wedding_custom_wishes');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      wishesList = [...parsed, ...wishesList];
    }
  }
} catch(e) {}

let currentWishIndex = 0;
let wishCarouselInterval = null;

function renderWishes() {
  const track = document.getElementById('wishes-track');
  const dots = document.getElementById('wishes-dots');
  if (!track || !dots) return;

  track.innerHTML = '';
  dots.innerHTML = '';

  wishesList.forEach((w, idx) => {
    const parts = w.name.trim().split(' ');
    const initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : w.name.slice(0, 2).toUpperCase();

    const slide = document.createElement('div');
    slide.className = 'wish-slide';
    slide.innerHTML = `
      <div class="wish-card">
        <div class="wish-quotes">““</div>
        <div class="wish-body">${w.comment.replace(/\n/g, '<br>')}</div>
        <div class="wish-footer">
          <div class="wish-author">
            <div class="wish-avatar">${initials}</div>
            <div class="wish-info">
              <span class="wish-name">${w.name}</span>
              <span class="wish-date">${w.date}</span>
            </div>
          </div>
          <button class="wish-like-btn" onclick="likeWish(${w.id}, this)">
            <span>❤️</span>
            <span class="like-count">${w.likes || 0}</span>
          </button>
        </div>
      </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'wishes-dot' + (idx === currentWishIndex ? ' active' : '');
    dot.onclick = () => goToWish(idx);
    dots.appendChild(dot);
  });

  updateWishPosition();
}

function updateWishPosition() {
  const track = document.getElementById('wishes-track');
  if (!track) return;
  track.style.transform = `translateX(-${currentWishIndex * 100}%)`;

  const dots = document.querySelectorAll('.wishes-dot');
  dots.forEach((d, idx) => {
    d.classList.toggle('active', idx === currentWishIndex);
  });
}

function goToWish(idx) {
  currentWishIndex = idx;
  updateWishPosition();
  resetWishTimer();
}

function nextWish() {
  currentWishIndex = (currentWishIndex + 1) % wishesList.length;
  updateWishPosition();
}

function resetWishTimer() {
  if (wishCarouselInterval) clearInterval(wishCarouselInterval);
  wishCarouselInterval = setInterval(nextWish, 3500);
}

function likeWish(id, btn) {
  const wish = wishesList.find(w => w.id === id);
  if (wish) {
    wish.likes = (wish.likes || 0) + 1;
    const countSpan = btn.querySelector('.like-count');
    if (countSpan) countSpan.textContent = wish.likes;
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = 'scale(1)', 200);
  }
}

// Modals
function openAllWishesModal() {
  const modal = document.getElementById('all-wishes-modal');
  const list = document.getElementById('all-wishes-list');
  if (!modal || !list) return;

  list.innerHTML = '';
  wishesList.forEach(w => {
    const parts = w.name.trim().split(' ');
    const initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : w.name.slice(0, 2).toUpperCase();

    const card = document.createElement('div');
    card.className = 'wish-card';
    card.style.minHeight = 'auto';
    card.innerHTML = `
      <div class="wish-body" style="-webkit-line-clamp:unset;">${w.comment.replace(/\n/g, '<br>')}</div>
      <div class="wish-footer">
        <div class="wish-author">
          <div class="wish-avatar">${initials}</div>
          <div class="wish-info">
            <span class="wish-name">${w.name}</span>
            <span class="wish-date">${w.date}</span>
          </div>
        </div>
        <button class="wish-like-btn" onclick="likeWish(${w.id}, this)">
          <span>❤️</span>
          <span class="like-count">${w.likes || 0}</span>
        </button>
      </div>
    `;
    list.appendChild(card);
  });

  modal.classList.add('show');
}

function openWishModal() {
  const modal = document.getElementById('wish-modal');
  if (modal) modal.classList.add('show');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('show');
}

function closeModalOnBackdrop(e, id) {
  if (e.target.classList.contains('modal-backdrop')) {
    closeModal(id);
  }
}

function handleWishSubmit(e) {
  e.preventDefault();
  const authorInput = document.getElementById('wish-author-input');
  const textInput = document.getElementById('wish-text-input');
  if (!authorInput || !textInput) return;

  const newWish = {
    id: Date.now(),
    name: authorInput.value.trim(),
    date: new Date().toLocaleDateString('ru-RU'),
    comment: textInput.value.trim(),
    likes: 1
  };

  wishesList.unshift(newWish);
  try {
    const saved = JSON.parse(localStorage.getItem('wedding_custom_wishes') || '[]');
    saved.unshift(newWish);
    localStorage.setItem('wedding_custom_wishes', JSON.stringify(saved));
  } catch(err) {}

  authorInput.value = '';
  textInput.value = '';
  closeModal('wish-modal');
  renderWishes();
  goToWish(0);
  showSuccessAlert('Ақ тілегіңіз қабылданды! Үлкен рақмет! 🌸');
}

// RSVP form handler
let selectedRsvpChoice = 'yes';
function selectRsvpOption(el, choice) {
  document.querySelectorAll('.rsvp-option').forEach(opt => opt.classList.remove('selected'));
  el.classList.add('selected');
  selectedRsvpChoice = choice;
}

function openRsvpNameModal() {
  const modal = document.getElementById('rsvp-modal');
  if (modal) {
    modal.classList.add('show');
    setTimeout(() => {
      const input = document.getElementById('rsvp-modal-name-input');
      if (input) input.focus();
    }, 150);
  }
}

function handleRsvpModalSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('rsvp-modal-name-input');
  const name = nameInput ? nameInput.value.trim() : '';
  if (!name) return;

  try {
    localStorage.setItem('wedding_guest_rsvp', JSON.stringify({
      name: name,
      choice: selectedRsvpChoice,
      date: new Date().toISOString()
    }));
  } catch(err) {}

  closeModal('rsvp-modal');
  if (nameInput) nameInput.value = '';
  showSuccessAlert('Рақмет! Сіздің жауабыңыз қабылданды! 🙏');
}

function scrollToRsvp() {
  const el = document.getElementById('rsvp-section');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function closeToast() {
  const toast = document.getElementById('top-toast');
  if (toast) toast.style.display = 'none';
}

function showSuccessAlert(msg) {
  const alert = document.getElementById('success-alert');
  const text = document.getElementById('success-alert-text');
  if (alert && text) {
    text.textContent = msg;
    alert.classList.add('show');
    setTimeout(() => alert.classList.remove('show'), 4000);
  }
}

// Audio Player
const audio = document.getElementById('wedding-audio');
const audioBtn = document.getElementById('audio-toggle-btn');
const audioLabel = document.getElementById('audio-btn-label');
let isPlaying = false;

function toggleAudio() {
  if (!audio) return;
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    if (audioBtn) audioBtn.classList.remove('audio-playing');
    if (audioLabel) audioLabel.textContent = 'Әуен қосу';
  } else {
    audio.play().then(() => {
      isPlaying = true;
      if (audioBtn) audioBtn.classList.add('audio-playing');
      if (audioLabel) audioLabel.textContent = 'Әуен тоқтату';
    }).catch(() => {});
  }
}

function initAutoplay() {
  const startAudio = () => {
    if (!isPlaying && audio) {
      audio.play().then(() => {
        isPlaying = true;
        if (audioBtn) audioBtn.classList.add('audio-playing');
        if (audioLabel) audioLabel.textContent = 'Әуен тоқтату';
      }).catch(() => {});
    }
    window.removeEventListener('click', startAudio);
    window.removeEventListener('touchstart', startAudio);
    window.removeEventListener('scroll', startAudio);
  };
  window.addEventListener('click', startAudio, { once: true });
  window.addEventListener('touchstart', startAudio, { once: true });
  window.addEventListener('scroll', startAudio, { once: true });
}

// Scroll animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.anim-init').forEach(el => {
    observer.observe(el);
  });
}

// Touch swipe for wishes
function initTouchSwipe() {
  const track = document.getElementById('wishes-track');
  if (!track) return;
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    if (wishCarouselInterval) clearInterval(wishCarouselInterval);
  }, { passive: true });

  track.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        currentWishIndex = (currentWishIndex + 1) % wishesList.length;
      } else {
        currentWishIndex = (currentWishIndex - 1 + wishesList.length) % wishesList.length;
      }
      updateWishPosition();
    }
    resetWishTimer();
  }, { passive: true });
}

window.addEventListener('DOMContentLoaded', () => {
  renderWishes();
  resetWishTimer();
  initScrollAnimations();
  initAutoplay();
  initTouchSwipe();
});
