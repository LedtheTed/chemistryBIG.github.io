// Main script for ChemistryBIG
// Data structures for reactions and elements (canvas rendering will be added separately)

class ElementBase {
  constructor({ name = 'unknown', color = '#2dd4bf', size = 18, speed = 0, x = 0, y = 0 } = {}) {
    this.name = String(name);
    this.color = String(color);
    this.size = Number(size);
    this.speed = Number(speed);
    this.x = Number(x);
    this.y = Number(y);
  }
}

// Reaction registry (Map)
const _norm = s => String(s).trim().toLowerCase();
function _pairKey(a, b) { const aa = _norm(a), bb = _norm(b); return aa < bb ? `${aa}|${bb}` : `${bb}|${aa}`; }
const REACTION_TABLE = new Map();

function addReaction(a, b, { products = [], consumes = true, probability = 1.0, note = '' } = {}) {
  const key = _pairKey(a, b);
  REACTION_TABLE.set(key, { products: products.map(p => _norm(p)), consumes: !!consumes, probability: Number(probability), note });
}

function react(a, b) {
  const key = _pairKey(a, b);
  const entry = REACTION_TABLE.get(key);
  if (!entry) return null;
  const roll = Math.random();
  const happens = roll <= entry.probability;
  return { happens, roll, entry: Object.assign({}, entry) };
}

// Expose API
window.ChemistryBIG = window.ChemistryBIG || {};
window.ChemistryBIG.ElementBase = ElementBase;
window.ChemistryBIG.addReaction = addReaction;
window.ChemistryBIG.react = react;
window.ChemistryBIG.REACTION_TABLE = REACTION_TABLE;

// Canvas setup
document.addEventListener('DOMContentLoaded', ()=>{
  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;

  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  // Initialize data from external modules if available
  // Reactions are now available via ChemistryBIG.getReaction(a, b)
  // Element definitions are available via ChemistryBIG.createElementInstance(name, x, y)

  // Draw simple background (placeholder for future canvas rendering)
  ctx.fillStyle = 'rgba(12, 18, 28, 0.5)';
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = '#93c5fd';
  ctx.font = '14px Arial';
  ctx.fillText('Canvas ready. Reactions and elements loaded.', 20, 30);
});