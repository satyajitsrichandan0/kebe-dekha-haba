/* ════════════════════════════════
   CHAT SCRIPT — Real Conversation
   Satyajit → Devi
════════════════════════════════ */

// ── Messages ─────────────────────────────────────────────────────────────────
// right = Satyajit | left = Devi
const messages = [
  {
    side: 'right',
    text: 'Good morning Suna… kali clg asiba? 🌅',
    delay: 1000
  },
  {
    side: 'left',
    text: 'Kyu?',
    delay: 2200,
    typing: 1800
  },
  {
    side: 'right',
    text: 'Bahut din helani dekha nahi… 😶',
    delay: 1800
  },
  {
    side: 'left',
    text: 'Mu form debaku jibi, 9:00 re asibi',
    delay: 2600,
    typing: 2400
  },
  {
    side: 'right',
    text: 'Perfect… mu wait karibi 🙂',
    delay: 1400
  },
  {
    side: 'left',
    text: 'Kouthi achha?',
    delay: 2000,
    typing: 1600
  },
  {
    side: 'right',
    text: 'Clg re',
    delay: 1200
  },

  // Reality — she came late
  {
    side: 'right',
    text: 'Aji dekha helani… tame let re asila 😐',
    delay: 3000,
    long: true
  },
  {
    side: 'left',
    text: 'Ohh… ta kebe dekha haba kuha?',
    delay: 2800,
    typing: 2200
  }
];

// ── DOM ───────────────────────────────────────────────────────────────────────
const startScreen   = document.getElementById('start-screen');
const chatArea      = document.getElementById('chat-area');
const headerStatus  = document.getElementById('header-status');
const choiceOverlay = document.getElementById('choice-overlay');
const replyOverlay  = document.getElementById('reply-overlay');
const replyText     = document.getElementById('reply-text');
const bgMusic       = document.getElementById('bg-music');
const clockEl       = document.getElementById('clock');

let started = false;

// ── Clock ─────────────────────────────────────────────────────────────────────
function updateClock() {
  const n = new Date();
  clockEl.textContent =
    n.getHours().toString().padStart(2,'0') + ':' +
    n.getMinutes().toString().padStart(2,'0');
}
updateClock();
setInterval(updateClock, 30000);

// ── Floating particles ────────────────────────────────────────────────────────
function spawnParticles() {
  const field = document.getElementById('particles');
  const count = 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2.5 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 12 + 10;
    const delay = Math.random() * 14;
    const opacity = Math.random() * 0.5 + 0.2;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${left}%;bottom:0;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      opacity:${opacity};
    `;
    field.appendChild(p);
  }
}
spawnParticles();

// ── Utilities ─────────────────────────────────────────────────────────────────
const wait = ms => new Promise(r => setTimeout(r, ms));

function escHTML(s) {
  return s
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

function scrollBottom() {
  chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
}

function nowTime() {
  const n = new Date();
  return n.getHours().toString().padStart(2,'0') + ':' +
         n.getMinutes().toString().padStart(2,'0');
}

// ── Date divider ──────────────────────────────────────────────────────────────
function addDateDivider() {
  const d = new Date();
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const el = document.createElement('div');
  el.className = 'date-div';
  el.textContent = `Today, ${d.getDate()} ${months[d.getMonth()]}`;
  chatArea.appendChild(el);
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function showTyping(duration) {
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.id = 'typing-indicator';
    wrap.innerHTML = `<div class="typing-bubble">
      <span></span><span></span><span></span>
    </div>`;
    chatArea.appendChild(wrap);
    headerStatus.textContent = 'typing…';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      wrap.classList.add('visible');
      scrollBottom();
    }));

    setTimeout(() => {
      wrap.classList.remove('visible');
      headerStatus.textContent = 'online';
      setTimeout(() => { wrap.remove(); resolve(); }, 300);
    }, duration);
  });
}

// ── Render bubble ─────────────────────────────────────────────────────────────
function createBubble(msg) {
  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper ${msg.side}`;

  const ticks = msg.side === 'right'
    ? `<span class="ticks">✓✓</span>` : '';

  wrapper.innerHTML = `
    <div class="bubble">
      ${escHTML(msg.text)}
      <div class="ts">${nowTime()}${ticks}</div>
    </div>`;

  chatArea.appendChild(wrapper);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    wrapper.classList.add('visible');
    scrollBottom();
  }));
}

// ── Run chat ──────────────────────────────────────────────────────────────────
async function runChat() {
  addDateDivider();

  for (const msg of messages) {
    await wait(msg.delay + (msg.long ? 700 : 0));

    if (msg.side === 'left' && msg.typing) {
      await showTyping(msg.typing);
    }

    createBubble(msg);
  }

  await wait(2200);
  showChoices();
}

// ── Choices ───────────────────────────────────────────────────────────────────
function showChoices() {
  choiceOverlay.classList.remove('hidden');
  choiceOverlay.classList.add('visible');
}

window.handleChoice = function(choice) {
  choiceOverlay.classList.remove('visible');
  choiceOverlay.classList.add('hidden');

  const reply = choice === 'yes'
    ? 'Thik achhi… miliba 🙂🤍'
    : 'Dekhiba… kebe haba bata 😅';

  setTimeout(() => {
    replyText.textContent = reply;
    replyOverlay.classList.remove('hidden');
    replyOverlay.classList.add('visible');
    scrollBottom();
  }, 400);
};

// ── Audio fade-in ─────────────────────────────────────────────────────────────
function fadeIn(audio, target, ms) {
  const steps = 40, step = target / steps, tick = ms / steps;
  let vol = 0;
  const t = setInterval(() => {
    vol += step;
    if (vol >= target) { audio.volume = target; clearInterval(t); }
    else audio.volume = vol;
  }, tick);
}

// ── Start on tap ──────────────────────────────────────────────────────────────
function startExperience() {
  if (started) return;
  started = true;

  startScreen.classList.add('fade-out');
  setTimeout(() => { startScreen.style.display = 'none'; }, 800);

  bgMusic.volume = 0;
  bgMusic.play().then(() => fadeIn(bgMusic, 0.3, 2500)).catch(() => {});

  runChat();
}

startScreen.addEventListener('click', startExperience);
startScreen.addEventListener('touchend', startExperience, { passive: true });
