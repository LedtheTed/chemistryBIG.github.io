import { drawCanvas } from "./render.js";

let canvas = document.getElementById("sim-canvas");
const ctx = canvas.getContext("2d");
console.log(ctx);

// Canvas dimensions constants
let CANVAS_WIDTH;
let CANVAS_HEIGHT;

// Resize canvas to fit container as a square
function resizeCanvas() {
  canvas.width = 500;
  canvas.height = 500;
  CANVAS_WIDTH = 500;
  CANVAS_HEIGHT = 500;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Element storage
let elements = [];
let particles = [];

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
    if(this.x - this.size < 0 || this.x + this.size > canvas.width){
      this.vx *= -1;
      this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
    }
    if(this.y - this.size < 0 || this.y + this.size > canvas.height){
      this.vy *= -1;
      this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
    }
  }

  draw(ctx){
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
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const e1 = elements[i];
      const e2 = elements[j];
      
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
        const separationX = (dx / distance) * (overlap / 2 + 1);
        const separationY = (dy / distance) * (overlap / 2 + 1);
        
        e1.x -= separationX;
        e1.y -= separationY;
        e2.x += separationX;
        e2.y += separationY;
      }
    }
  }
}

// Canvas click handler to create hydrogen (10% chance) and particle effect
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // create particle effect on every click
  for(let i = 0; i < 8; i++){
    particles.push(new Particle(x, y));
  }

  // 10% chance to create hydrogen on click
  if(Math.random() < 0.1){
    const hydrogen = window.ChemistryBIG.createElementInstance('H', x, y);
    elements.push(hydrogen);
    console.log(`Created hydrogen at (${x}, ${y})`);
  }
});

let Game = {
  fps: 60,  // UNUSED - NEXT UPDATE

  /**
   * contains all updates the website will receive on this loop
   * NOTE: Put any changes here in subfunctions, lets try and keep update() clean
   */
  update: function() {
    // update elements
    elements.forEach(element => {
      element.update();
    });
    // check collisions between elements
    checkCollisions();
    // update particles
    particles = particles.filter(p => {
      p.update();
      return p.life > 0;
    });
  },
  /**
   * causes program to continuously loop, mostly reserved for looping logic and not actual code
   * NOTE: to be updated to a more robust version based on date/time
   * @param {*} timestamp 
   */
  loop: function(timestamp) {
    let progress = timestamp - lastRender;
    
    // reset canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // update all changes
    Game.update();

    // REDRAW CANVAS
    // draw elements
    elements.forEach(element => {
      element.draw(ctx);
    });
    // draw particles
    particles.forEach(particle => {
      particle.draw(ctx);
    });
    
    lastRender = timestamp;
    window.requestAnimationFrame(Game.loop);
  }
}


// Begin looping
let lastRender = 0;
window.requestAnimationFrame(Game.loop);


/*****
COMMENTED OUT OLD ATOM CODE - REMOVE IF WANTED
*****/
// document.addEventListener('DOMContentLoaded', () => {
//   const sim = document.getElementById('sim-area');
//   if (!sim) return;

//   const particles = [];

//   function _clientToLocal(clientX, clientY) {
//     const rect = sim.getBoundingClientRect();
//     return { x: clientX - rect.left, y: clientY - rect.top };
//   }

//   function createParticleAt(clientX, clientY, opts = {}) {
//     const { x, y } = _clientToLocal(clientX, clientY);
//     const el = document.createElement('div');
//     el.className = 'particle';
//     if (opts.size === 'small') el.classList.add('small');
//     if (opts.size === 'large') el.classList.add('large');
//     el.style.left = x + 'px';
//     el.style.top = y + 'px';
//     el.dataset.type = opts.type || '';

//     sim.appendChild(el);
//     particles.push({ el, x, y, vx: 0, vy: 0 });

//     // simple fade-out after some time (placeholder behaviour)
//     if (opts.lifetime) {
//       setTimeout(() => {
//         el.style.opacity = '0';
//         setTimeout(() => el.remove(), 400);
//       }, opts.lifetime);
//     }

//     return el;
//   }

//   // Click inside sim area spawns a particle at click location
//   sim.addEventListener('click', (ev) => {
//     // Only respond to primary button
//     if (ev.button !== 0) return;
//     createParticleAt(ev.clientX, ev.clientY, { size: 'small' });
//   });

//   // expose helper for console/other scripts
//   window.createParticleAt = createParticleAt;
// });
