// =========================================================
// Small utilities
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

const revDateEl = document.getElementById('revDate');
if (revDateEl) {
  revDateEl.textContent = new Date().toLocaleDateString('en-US', {
    month: 'short', year: 'numeric'
  });
}

// =========================================================
// Mobile nav toggle
// =========================================================
const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// =========================================================
// Load projects from the backend: GET /api/projects
// =========================================================
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  const loading = document.getElementById('projectsLoading');

  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Request failed with status ' + res.status);

    const projects = await res.json();

    if (loading) loading.remove();

    if (!Array.isArray(projects) || projects.length === 0) {
      grid.innerHTML = '<p class="projects-loading">No projects added yet — edit data/projects.json.</p>';
      return;
    }

    grid.innerHTML = projects.map(renderProjectCard).join('');
  } catch (err) {
    console.error('Failed to load projects:', err);
    if (loading) {
      loading.textContent = 'Could not load projects right now. Please refresh the page.';
    }
  }
}

function renderProjectCard(project) {
  const tech = Array.isArray(project.tech)
    ? project.tech.map((t) => `<span>${escapeHtml(t)}</span>`).join('')
    : '';

  const links = [];
  if (project.githubUrl) {
    links.push(`<a href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noopener">GitHub →</a>`);
  }
  if (project.liveUrl) {
    links.push(`<a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener">Live demo →</a>`);
  }

  return `
    <article class="project-card">
      <p class="project-sheet-no">SHEET ${escapeHtml(project.sheetNo || '')}</p>
      <h3 class="project-title">${escapeHtml(project.title)}</h3>
      <p class="project-desc">${escapeHtml(project.description)}</p>
      <div class="project-tech">${tech}</div>
      <div class="project-links">${links.join('')}</div>
    </article>
  `;
}

// Basic HTML escaping so project data can never break the page layout
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

loadProjects();

// =========================================================
// Contact form: POST /api/contact
// =========================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('contactSubmit');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      formStatus.textContent = data.message || 'Message sent — thank you!';
      formStatus.classList.add('success');
      contactForm.reset();
    } catch (err) {
      formStatus.textContent = err.message || 'Could not send your message. Please try again.';
      formStatus.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}
