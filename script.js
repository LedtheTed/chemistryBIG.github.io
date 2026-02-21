document.addEventListener('DOMContentLoaded', () => {
  const sim = document.getElementById('sim-area');
  if (!sim) return;

  const particles = [];

  function _clientToLocal(clientX, clientY) {
    const rect = sim.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function createParticleAt(clientX, clientY, opts = {}) {
    const { x, y } = _clientToLocal(clientX, clientY);
    const el = document.createElement('div');
    el.className = 'particle';
    if (opts.size === 'small') el.classList.add('small');
    if (opts.size === 'large') el.classList.add('large');
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.dataset.type = opts.type || '';

    sim.appendChild(el);
    particles.push({ el, x, y, vx: 0, vy: 0 });

    // simple fade-out after some time (placeholder behaviour)
    if (opts.lifetime) {
      setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 400);
      }, opts.lifetime);
    }

    return el;
  }

  // Click inside sim area spawns a particle at click location
  sim.addEventListener('click', (ev) => {
    // Only respond to primary button
    if (ev.button !== 0) return;
    createParticleAt(ev.clientX, ev.clientY, { size: 'small' });
  });

  // expose helper for console/other scripts
  window.createParticleAt = createParticleAt;
});
