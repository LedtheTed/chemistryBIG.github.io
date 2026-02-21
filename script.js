// import { Environment } from "./environment.js";
import { Particle, ElementBase, Environment } from "./classes/classes.js";


let canvas = document.getElementById("sim-canvas");
const ctx = canvas.getContext("2d");
let DEBUG = true; // switch this to true/false depending on 


// Canvas dimensions constants
let CANVAS_WIDTH;
let CANVAS_HEIGHT;

// Resize canvas to fit container as a square
function resizeCanvas() {
  canvas.width = 600;
  canvas.height = 600;
  CANVAS_WIDTH = 600;
  CANVAS_HEIGHT = 600;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Element storage
let elements = [];
let particles = [];

// Register ElementBase globally
window.ChemistryBIG = window.ChemistryBIG || {};
window.ChemistryBIG.ElementBase = ElementBase;

// Collision detection between elements
function checkCollisions() {
  const n = elements.length; // snapshot length
  const toRemove = new Set(); // Track indices to remove

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
        if (reaction && Math.random() < (reaction.probability ?? 0)) {
          const products = Array.isArray(reaction.products) ? reaction.products : [];
          
          // Collision point (midpoint between reactants)
          const collisionX = (e1.x + e2.x) / 2;
          const collisionY = (e1.y + e2.y) / 2;
          
          for (const productName of products) {
            const capitalizedName = productName.charAt(0).toUpperCase() + productName.slice(1).toLowerCase();
            const product = window.ChemistryBIG?.createElementInstance?.(
              capitalizedName,
              collisionX,
              collisionY
            );
            
            if (product) {
              elements.push(product);
            }
          }
          
          // mark reactants for removal
          toRemove.add(i);
          toRemove.add(j);
          
          console.log(`Reaction: ${e1.name} + ${e2.name} -> ${reaction.products?.join(' + ')}`);
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

  // create particle effect on every click
  for(let i = 0; i < 8; i++){
    particles.push(new Particle(x, y));
  }

  // 10% chance to create hydrogen on click
  if(Math.random() < 1){
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

  /**
   * contains all updates the website will receive on this loop
   * NOTE: Put any changes here in subfunctions, lets try and keep update() clean
   */


  fps: 60,
  lastRender: Date.now(),
  deltaTime: 0,
  frame: 0,

  update: function() {
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
  

  // METHODS
  draw: () => {
    Game.lastRender = Date.now();

    // reset canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // REDRAW CANVAS
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


  /**
   * causes program to continuously loop, mostly reserved for looping logic and not actual code
   * NOTE: to be updated to a more robust version based on date/time
   * @param {*} timestamp 
   */

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