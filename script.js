// import { Environment } from "./environment.js";
import { ElementBase, Environment } from "./classes/classes.js";

let mainEnvironment = new Environment();
let environments = [mainEnvironment];
mainEnvironment.initializeCanvas(document.getElementById("sim-main"), 600, 600);
mainEnvironment.canvas.classList.add("main-canvas");
mainEnvironment.canvas.id = ("sim-canvas-main");

mainEnvironment.setBGImage("./space_texture.jpg");
// mainEnvironment.resizeCanvas(600, 600);
let DEBUG = true; // switch this to true/false depending on 


function makeEnv() {
  let asdfas = new Environment();
  asdfas.initializeCanvas(document.getElementById("sim-other"), 500, 200);
  environments.push(asdfas);
}
for(let i = 0; i < 3; i++) {
  makeEnv();
}



// Register ElementBase globally
window.ChemistryBIG = window.ChemistryBIG || {};
window.ChemistryBIG.ElementBase = ElementBase;

// Update the element counter display
function updateElementCounter() {
  const counterList = document.getElementById('counter-list');
  const counts = {};
  for (const environment of environments) {
      for (const [element, count] of Object.entries(environment.countElements())) {
          counts[element] = (counts[element] || 0) + count;
      }
  }
  
  mainEnvironment.countElements();
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
    environments.forEach(environment => {
      environment.updateElements();
      environment.checkCollisions();
      environment.checkDecays();
      environment.updateParticles();
    });
  },

  draw:  () => {
    Game.lastRender = Date.now();

    // background first
    environments.forEach((environment) => {
      environment.drawCanvasBackground();
      environment.drawElements();
      environment.drawParticles();
    });

    // debug(`Frame ${Game.frame}: Loaded in ${Game.deltaTime} ms`);
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
      updateElementCounter();
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