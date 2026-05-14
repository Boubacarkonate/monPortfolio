// NAVBAR SCROLL
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  navbar.classList.toggle('scrolled', current > 20);
  lastScroll = current;
}, { passive: true });

// BURGER MENU
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// SCROLL REVEAL
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // Stagger sibling reveals
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), Math.max(0, delay));
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// PARTICLE CANVAS 
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;

  const PARTICLE_COUNT = 60;
  const CONNECT_DIST = 120;
  const ACCENT = [108, 99, 255];
  const ACCENT2 = [56, 217, 217];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.7 ? ACCENT2 : ACCENT;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.join(',')},${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  // Pause when tab hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);

  init();
  loop();
})();

//  SMOOTH NAV ACTIVE STATE 
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--text)'
          : '';
      });
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

//  LANGUAGE SWITCH 
let currentLang = 'fr';
const langCache = {};

async function loadLanguage(lang) {
    currentLang = lang;
  if (langCache[lang]) {
    applyLanguage(langCache[lang]);
    return;
  }
  try {
    const res = await fetch(`public/lang_${lang}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    langCache[lang] = data;
    applyLanguage(data);
  } catch (err) {
    console.warn(`[i18n] Could not load lang_${lang}.json`, err);
  }
}

function applyLanguage(data) {
// Nav links
const navKeyMap = {
    'nav-skills':     data.nav?.skills,
    'nav-projects':   data.nav?.projects,
    'nav-education':  data.nav?.education,
    'nav-contact':    data.nav?.contact,
    'section-skills': data.section?.skills,
    'section-projects': data.section?.projects,
    'section-formations': data.section?.formations,
};
  document.querySelectorAll('[data-key]').forEach(el => {
    const val = navKeyMap[el.dataset.key];
    if (val) el.textContent = val;
  });
  // Specific IDs
  const map = {
    'header-description': data.header?.description,
    'hero-role':          data.header?.subtitle,
    'hero-available':     data.header?.available,
    'hero-cta':           data.header?.cta,
    'hero-cv':            data.header?.cv,
    'competences-title':  data.competences?.title,
    'projects-title':     data.projects?.title,
    'formations-title':   data.formations?.title,
    'formation-2023-level': data.formations?.['level-2023'],
    'formation-2022-desc': data.formations?.['desc-2022'],
    'formation-2005-title': data.formations?.['title-2005'],
    'formation-2005-desc': data.formations?.['desc-2005'],
    'cv-download':        data.formations?.cv,
    'contact-description':data.contact?.description,
  };

  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  });

  // Project buttons
  const projectButtonText = data.projects?.['btn-project'];
  if (projectButtonText) {
    document.querySelectorAll('[data-i18n="project-btn"] .btn-label').forEach(label => {
      label.textContent = projectButtonText;
    });
  }

  // Project descriptions
  const projects = data.projects || {};
  const projectMap = {
    'project-erpSocial-description':  projects.erpSocial?.description,
    'project-ccsforge-description': projects.ccsforge?.description,
    'project-weCare-description':     projects.weCare?.description,
    'project-etalent-description':    projects.etalent?.description,
    'project-flashnet75-description': projects.flashnet75?.description,
    'project-heritage-description':   projects.heritage?.description,
  };

  Object.entries(projectMap).forEach(([cls, val]) => {
    const el = document.querySelector(`.${cls}`);
    if (el && val) el.textContent = val;
  });

  document.querySelectorAll('[data-project]').forEach(btn => {
    const projectKey = btn.dataset.project;
    if (!projectKey) return;
    const projectData = projects[projectKey] || {};
    const localizedUrl = projectData[`url${currentLang === 'en' ? 'En' : 'Fr'}`] || projectData.url;
    if (btn.tagName === 'A') {
      if (localizedUrl) {
        btn.href = localizedUrl;
      } else {
        btn.removeAttribute('href');
      }
    }
  });

  // Skill labels
  const skills = data.competences || {};
  const skillMap = {
    'skills-design':       skills.design,
    'skills-databases':    skills.databases,
    'skills-technologies': skills.technologies,
    'skills-others':       skills.others,
  };
  Object.entries(skillMap).forEach(([cls, val]) => {
    const el = document.querySelector(`.${cls}`);
    if (el && val) el.textContent = val;
  });

  // Certifications
  const certs = data.formations?.certifications;
  if (Array.isArray(certs)) {
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      const h3 = item.querySelector('h3');
      if (h3 && certs[i]) h3.textContent = certs[i];
    });
  }
}

// Lang button setup
document.getElementById('fr-btn').addEventListener('click', () => {
  setLang('fr');
});
document.getElementById('en-btn').addEventListener('click', () => {
  setLang('en');
});

function setLang(lang) {
  document.getElementById('fr-btn').classList.toggle('active', lang === 'fr');
  document.getElementById('en-btn').classList.toggle('active', lang === 'en');
  loadLanguage(lang);
}

//  CURSOR GLOW (desktop only) 
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  (function glowLoop() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(glowLoop);
  })();
}