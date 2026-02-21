// import { Environment } from "./environment.js";
import { Particle } from "./classes/Particle.js";
import { ElementBase } from "./classes/ElementBase.js";


let canvas = document.getElementById("sim-canvas");
const ctx = canvas.getContext("2d");
let DEBUG = true; // switch this to true/false depending on 


// --- Reaction speed bonus tuning ---
const REACTION_SPEED_THRESHOLD = 2.5;   // below this: no bonus
const REACTION_SPEED_MAX = 12.0;        // at/above this: full bonus
const REACTION_SPEED_BONUS_MAX = 0.35;  // max +35% absolute probability (clamped)

// helper
function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

// --- Background texture ---
const bgImage = new Image();
bgImage.src = "./space_texture.jpg"; // put the correct relative path here
bgImage.onload = () => console.log("Background loaded:", bgImage.src);
bgImage.onerror = (e) => console.warn("Failed to load background:", bgImage.src, e);

function drawBackground() {
  // If not loaded yet, fallback to solid fill (avoids flashing/blank)
  if (!bgImage.complete || bgImage.naturalWidth === 0) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  // "cover" behavior: fill the canvas, keep aspect ratio, center crop
  const cw = canvas.width, ch = canvas.height;
  const iw = bgImage.naturalWidth, ih = bgImage.naturalHeight;

  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  ctx.drawImage(bgImage, dx, dy, dw, dh);
}

// Resize canvas to fit container as a square
function resizeCanvas() {
  canvas.width = 500;
  canvas.height = 500;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Element storage
let elements = [];
let particles = [];

// -------- Click "push away" settings --------
const CLICK_PUSH_RADIUS = 120;   // how far the click affects elements (px)
const CLICK_PUSH_STRENGTH = 6.0; // how hard the click pushes (tune this)
const CLICK_PUSH_FALLOFF = 1.6;  // >1 = stronger near center, softer at edge

function pushNearbyElements(clickX, clickY) {
  const r = CLICK_PUSH_RADIUS;

  for (const e of elements) {
    if (!e) continue;

    const dx = e.x - clickX;
    const dy = e.y - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // only affect elements in radius
    if (dist > r) continue;

    // direction away from click (handle exact center safely)
    let nx, ny;
    if (dist < 0.0001) {
      const a = Math.random() * Math.PI * 2;
      nx = Math.cos(a);
      ny = Math.sin(a);
    } else {
      nx = dx / dist;
      ny = dy / dist;
    }

    // falloff: 1 at click, 0 at edge
    const t = 1 - (dist / r);
    const impulse = CLICK_PUSH_STRENGTH * Math.pow(t, CLICK_PUSH_FALLOFF);

    // add velocity (impulse)
    e.vx += nx * impulse;
    e.vy += ny * impulse;
  }
}

// Particle class for click effects
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.life = 1.0;
    this.size = 3;
    this.color = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life -= 0.02;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

// ElementBase class
class ElementBase {
  constructor(options = {}) {
    this.name = options.name || 'H';
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.color = options.color || '#000';
    this.size = options.size || 10;
    this.speed = options.speed || 1;
    this.vx = (Math.random() - 0.5) * this.speed;
    this.vy = (Math.random() - 0.5) * this.speed;
  }

  update() {
    // update position
    this.x += this.vx;
    this.y += this.vy;

    // bounce off walls
    if (this.x - this.size < 0 || this.x + this.size > canvas.width) {
      this.vx *= -1;
      this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
    }
    if (this.y - this.size < 0 || this.y + this.size > canvas.height) {
      this.vy *= -1;
      this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // draw label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.name, this.x, this.y);
  }
}

// Register ElementBase globally
window.ChemistryBIG = window.ChemistryBIG || {};
window.ChemistryBIG.ElementBase = ElementBase;

// Collision detection between elements
function checkCollisions() {
  const n = elements.length;            // snapshot length
  const toRemove = new Set();           // Track indices to remove

  for (let i = 0; i < n; i++) {
    const e1 = elements[i];
    if (!e1) continue;

    for (let j = i + 1; j < n; j++) {
      const e2 = elements[j];
      if (!e2) continue;

      // Calculate distance between centers
      const dx = e2.x - e1.x;
      const dy = e2.y - e1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if collision occurred (distance < sum of sizes)
      if (distance < e1.size + e2.size) {
        // Calculate speed magnitudes
        const speed1 = Math.sqrt(e1.vx * e1.vx + e1.vy * e1.vy);
        const speed2 = Math.sqrt(e2.vx * e2.vx + e2.vy * e2.vy);
        const combinedSpeed = speed1 + speed2;

        // Calculate collision angle
        const angle = Math.atan2(dy, dx);

        // Split combined speed and send in opposite directions
        const splitSpeed = combinedSpeed / 2;
        e1.vx = -Math.cos(angle) * splitSpeed;
        e1.vy = -Math.sin(angle) * splitSpeed;
        e2.vx = Math.cos(angle) * splitSpeed;
        e2.vy = Math.sin(angle) * splitSpeed;

        // Separate elements to prevent overlap
        const overlap = e1.size + e2.size - distance;
        if (overlap > 0 && distance > 0) {
          const separationX = (dx / distance) * (overlap / 2 + 1);
          const separationY = (dy / distance) * (overlap / 2 + 1);

          e1.x -= separationX;
          e1.y -= separationY;
          e2.x += separationX;
          e2.y += separationY;
        }

        // Check for reaction after collision is handled
        const reaction = window.ChemistryBIG?.getReaction?.(e1.name, e2.name);
        if (reaction) {
          const baseP = reaction.probability ?? 0;

          // Linear speed-based bonus (starts at threshold, maxes at REACTION_SPEED_MAX)
          const t = clamp01(
            (combinedSpeed - REACTION_SPEED_THRESHOLD) /
            (REACTION_SPEED_MAX - REACTION_SPEED_THRESHOLD)
          );
          const bonus = t * REACTION_SPEED_BONUS_MAX;

          // Final probability (clamped to 1)
          const finalP = Math.min(1, baseP + bonus);

          if (Math.random() < finalP) {
            const products = Array.isArray(reaction.products) ? reaction.products : [];

            // Collision point (midpoint between reactants)
            const collisionX = (e1.x + e2.x) / 2;
            const collisionY = (e1.y + e2.y) / 2;

            for (const productName of products) {
              const capitalizedName =
                productName.charAt(0).toUpperCase() + productName.slice(1).toLowerCase();

              const product = window.ChemistryBIG?.createElementInstance?.(
                capitalizedName,
                collisionX,
                collisionY
              );

              if (product) {
                elements.push(product);
              }
            }

            // Mark reactants for removal (consume reactants)
            toRemove.add(i);
            toRemove.add(j);

            console.log(
              `Reaction: ${e1.name} + ${e2.name} -> ${reaction.products?.join(" + ")}` +
              ` (baseP=${baseP.toFixed(3)}, bonus=${bonus.toFixed(3)}, finalP=${finalP.toFixed(3)}, speed=${combinedSpeed.toFixed(2)})`
            );
          }
        }
      }
    }
  }

  // Remove marked elements in reverse order to preserve indices
  const indicesToRemove = Array.from(toRemove).sort((a, b) => b - a);
  indicesToRemove.forEach(index => {
    elements.splice(index, 1);
  });
  
  // Update counter if any element was removed
  if (indicesToRemove.length > 0) {
    updateElementCounter();
  }
}

// Check for decay reactions on individual elements
function checkDecays() {
  const toRemove = new Set();

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (!element) continue;

    // Check if this element can decay
    const decay = window.ChemistryBIG?.getDecayReaction?.(element.name);
    if (decay && Math.random() < (decay.probability ?? 0)) {
      // Element decays!
      const products = Array.isArray(decay.products) ? decay.products : [];

      for (const productName of products) {
        const capitalizedName = productName.charAt(0).toUpperCase() + productName.slice(1).toLowerCase();
        const product = window.ChemistryBIG?.createElementInstance?.(
          capitalizedName,
          element.x,
          element.y
        );

        if (product) {
          elements.push(product);
        }
      }

      toRemove.add(i);
      console.log(`Decay: ${element.name} -> ${decay.products?.join(' + ')}`);
    }
  }

  // Remove decayed elements in reverse order
  const indicesToRemove = Array.from(toRemove).sort((a, b) => b - a);
  indicesToRemove.forEach(index => {
    elements.splice(index, 1);
  });
  
  // Update counter if any element was removed
  if (indicesToRemove.length > 0) {
    updateElementCounter();
  }
}

// Canvas click handler to create hydrogen (10% chance) and particle effect
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // NEW: push nearby elements away from the click
  pushNearbyElements(x, y);

  // create particle effect on every click
  for (let i = 0; i < 8; i++) {
    particles.push(new Particle(x, y));
  }

  // 10% chance to create hydrogen on click
  if (Math.random() < 0.5) {
    const hydrogen = window.ChemistryBIG.createElementInstance('H', x, y);
    elements.push(hydrogen);
    console.log(`Created hydrogen at (${x}, ${y})`);
    updateElementCounter();
  }
});

// element counter -----------------------------


// Count elements by type
function countElements() {
  const counts = {};
  elements.forEach(element => {
    counts[element.name] = (counts[element.name] || 0) + 1;
  });
  return counts;
}

// Update the element counter display
function updateElementCounter() {
  const counterList = document.getElementById('counter-list');
  const counts = countElements();
  const allElements = window.ChemistryBIG.getAllElements();
  
  // Check for molecule unlocks based on current element counts
  if (window.ChemistryBIG.checkMoleculeUnlocks) {
    window.ChemistryBIG.checkMoleculeUnlocks(counts);
  }
  
  // Clear current display
  counterList.innerHTML = '';
  
  // Only show elements that exist in the canvas
  const elementsToShow = allElements.filter(elementName => counts[elementName] > 0);
  
  if (elementsToShow.length === 0) {
    counterList.innerHTML = '<div style="padding: 8px; text-align: center; color: #93c5fd; font-size: 12px; opacity: 0.6;">No elements</div>';
    return;
  }
  
  elementsToShow.forEach(elementName => {
    const count = counts[elementName];
    const def = window.ChemistryBIG.getElementDefinition(elementName);
    
    const counterItem = document.createElement('div');
    counterItem.className = 'counter-item';
    counterItem.style.borderLeftColor = def.color;
    counterItem.style.borderLeftWidth = '3px';
    counterItem.innerHTML = `
      <span class="element-name">${elementName}</span>
      <span class="element-count">${count}</span>
    `;
    counterList.appendChild(counterItem);
  });
}

// element counter -----------------------------


let Game = {
  fps: 60,
  lastRender: Date.now(),
  deltaTime: 0,
  frame: 0,

  update: function () {
    // update elements
    elements.forEach(element => {
      element.update(canvas);
    });
    // check collisions between elements
    checkCollisions();
    // check for decay reactions
    checkDecays();
    // update particles
    particles = particles.filter(p => {
      p.update();
      return p.life > 0;
    });
  },

  draw: () => {
    Game.lastRender = Date.now();

    // background first
    drawBackground();

    // draw elements
    elements.forEach(element => {
      element.draw(ctx);
    });
    // draw particles
    particles.forEach(particle => {
      particle.draw(ctx);
    });

    debug(`Frame ${Game.frame}: Loaded in ${Game.deltaTime} ms`);
  },

  shouldRenderFrame: () => {
    let now = Date.now();
    Game.deltaTime = now - Game.lastRender;
    let mspf = (1 / Game.fps) * 1000;
    return Game.deltaTime >= mspf
  },

  loop: () => {
    Game.update();
    if (Game.shouldRenderFrame()) {
      Game.draw();
      Game.frame += 1;
    }
    window.requestAnimationFrame(Game.loop);
  }
}

function debug(message) {
  if (DEBUG) console.log(message);
}

// Initialize element counter on page load
updateElementCounter();

// Begin looping
window.requestAnimationFrame(Game.loop);