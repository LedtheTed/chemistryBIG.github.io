const MAX_PARTICLES = 100;
const CLICK_PUSH_RADIUS = 120; // how far the click affects elements (px)
const CLICK_PUSH_STRENGTH = 6.0; // how hard the click pushes (tune this)
const CLICK_PUSH_FALLOFF = 1.6; // >1 = stronger near center, softer at edge
const DEBUG = false;
const REACTION_SPEED_THRESHOLD = 2.5; // below this: no bonus
const REACTION_SPEED_MAX = 12.0; // at/above this: full bonus
const REACTION_SPEED_BONUS_MAX = 0.35; // max +35% absolute probability (clamped)

import { Particle } from "./Particle.js";

// helper
function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

export class Environment {
  constructor(onClickResolve) {
    this.canvas;
    this.ctx;
    this.max_particles = MAX_PARTICLES;
    this.elements = [];
    this.particles = [];
    this.effects;
    this.bgImage = new Image();
    this.onClickResolve = onClickResolve;

    window.addEventListener("resize", this.resizeCanvas);
  }

  /*** MAIN FUNCTIONS ***/
  /**
   * Creates a canvas element with given width and height. The element is the appended to the element in the DOM with the parent ID. To be used when creating a new environment not linked to a canvas already in the DOM.
   *
   * If you're linking an existing canvas, use appendCanvas() instead.
   * @param {*} parent The parent of the element in the DOM to append the canvas to.
   * @param {*} width The width of the canvas.
   * @param {*} height The height of the canvas.
   */
  initializeCanvas(parent, width, height) {
    console.log(this.canvas);
    this.createCanvas(width, height);

    console.log(this.canvas);
    this.appendCanvas(parent);
  }

  /**
   * Creates a canvas element. Useful for initializing the canvas if you're not ready to attach it to the DOM.
   *
   * Related - appendCanvas(), initializeCanvas()
   * @param {*} width The width of the canvas.
   * @param {*} height The height of the canvas.
   */
  createCanvas(width, height) {
    this.setCanvas(document.createElement("canvas"));
    this.canvas.classList.add("sim-canvas");

    this.resizeCanvas(width, height);
  }

  /**
   * Appends the existing canvas element to the DOM. Only works if this.canvas is defined. By default, environments are initialized without a canvas element.
   *
   * To create AND append the canvas, use initializeCanvas() instead. To just create a canvas, use createCanvas().
   * @param {*} parent The parent of the element in the DOM to append the canvas to.
   */
  appendCanvas(parent) {
    try {
      parent.appendChild(this.canvas);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Sets both the width and height of the canvas.
   * @param {*} width Width of the canvas.
   * @param {*} height Height of the canvas.
   */
  resizeCanvas(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  drawCanvasBackground() {
    // If not loaded yet, fallback to solid fill (avoids flashing/blank)
    if (!this.bgImage.complete || this.bgImage.naturalWidth === 0) {
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    // "cover" behavior: fill the canvas, keep aspect ratio, center crop
    const cw = this.canvas.width,
      ch = this.canvas.height;
    const iw = this.bgImage.naturalWidth,
      ih = this.bgImage.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    this.ctx.drawImage(this.bgImage, dx, dy, dw, dh);
  }

  drawElements() {
    this.elements.forEach((element) => {
      element.draw(this.ctx);
    });
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      particle.draw(this.ctx);
    });
  }

  /**
   * Sets the background image of the environment's canvas.
   * @param {} src File path of background image
   */
  setBGImage(src) {
    this.bgImage.src = src;
    this.bgImage.onload = () =>
      console.log("Background loaded:", this.bgImage.src);
    this.bgImage.onerror = (e) =>
      console.warn("Failed to load background:", this.bgImage.src, e);
  }

  // Count elements by type
  countElements() {
    const counts = {};
    this.elements.forEach((element) => {
      counts[element.name] = (counts[element.name] || 0) + 1;
    });
    return counts;
  }

  updateElements() {
    this.elements.forEach((element) => {
      element.update(this.canvas);
    });
  }

  updateParticles() {
    this.particles = this.particles.filter((p) => {
      p.update();
      return p.life > 0;
    });
  }

  spawnElement(name, x, y) {
    const symbol = normalizeSymbol(name);

    const e = window.ChemistryBIG?.createElementInstance?.(symbol, x, y);
    if (!e) return null;

    this.elements.push(e);

    // increment using the actual created symbol
    window.ChemistryBIG.incrCounter(e.name, 1);

    return e;
  }

  pushNearbyElements(clickX, clickY) {
    const r = CLICK_PUSH_RADIUS;

    for (const e of this.elements) {
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
      const t = 1 - dist / r;
      const impulse = CLICK_PUSH_STRENGTH * Math.pow(t, CLICK_PUSH_FALLOFF);

      // add velocity (impulse)
      e.vx += nx * impulse;
      e.vy += ny * impulse;
    }
  }

  // Collision detection between elements
  checkCollisions() {
    const n = this.elements.length; // snapshot length
    const toRemove = new Set(); // Track indices to remove

    for (let i = 0; i < n; i++) {
      const e1 = this.elements[i];
      if (!e1) continue;

      for (let j = i + 1; j < n; j++) {
        const e2 = this.elements[j];
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
                (REACTION_SPEED_MAX - REACTION_SPEED_THRESHOLD),
            );
            const bonus = t * REACTION_SPEED_BONUS_MAX;

            // Final probability (clamped to 1)
            const finalP = Math.min(1, baseP + bonus);

            if (Math.random() < finalP) {
              const products = Array.isArray(reaction.products)
                ? reaction.products
                : [];

              // Collision point (midpoint between reactants)
              const collisionX = (e1.x + e2.x) / 2;
              const collisionY = (e1.y + e2.y) / 2;

              for (const productName of products) {
                const capitalizedName =
                  productName.charAt(0).toUpperCase() +
                  productName.slice(1).toLowerCase();

                const product = window.ChemistryBIG?.createElementInstance?.(
                  capitalizedName,
                  collisionX,
                  collisionY,
                );

                if (product) {
                  this.spawnElement(productName, collisionX, collisionY);
                }
              }

              // Mark reactants for removal (consume reactants)
              toRemove.add(i);
              toRemove.add(j);

              console.log(
                `Reaction: ${e1.name} + ${e2.name} -> ${reaction.products?.join(" + ")}` +
                  ` (baseP=${baseP.toFixed(3)}, bonus=${bonus.toFixed(3)}, finalP=${finalP.toFixed(3)}, speed=${combinedSpeed.toFixed(2)})`,
              );
            }
          }
        }
      }
    }

    // Remove marked elements in reverse order to preserve indices
    const indicesToRemove = Array.from(toRemove).sort((a, b) => b - a);
    indicesToRemove.forEach((index) => {
      this.elements.splice(index, 1);
    });

    // // Update counter if any element was removed
    // if (indicesToRemove.length > 0) {
    //     updateElementCounter();
    // }
  }

  checkDecays() {
    const toRemove = new Set();

    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i];
      if (!element) continue;

      // Check if this element can decay
      const decay = window.ChemistryBIG?.getDecayReaction?.(element.name);
      if (decay && Math.random() < (decay.probability ?? 0)) {
        // Element decays!
        const products = Array.isArray(decay.products) ? decay.products : [];

        for (const productName of products) {
          this.spawnElement(productName, element.x, element.y);
        }

        toRemove.add(i);
        window.ChemistryBIG.spendCounter(element.name, 1);
        console.log(`Decay: ${element.name} -> ${decay.products?.join(" + ")}`);
      }
    }

    // Remove decayed elements in reverse order
    const indicesToRemove = Array.from(toRemove).sort((a, b) => b - a);
    indicesToRemove.forEach((index) => {
      this.elements.splice(index, 1);
    });


  }

  // Canvas click handler to create hydrogen (10% chance) and particle effect
  addCanvasClickListener() {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const click_debug_info = {
        "Rect left:": rect.left,
        "Rect top:": rect.top,
        "Mouse X:": event.clientX,
        "Mouse Y:": event.clientY,
      };
      debug(click_debug_info);

      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      // NEW: push nearby elements away from the click
      this.pushNearbyElements(x, y);

      // create particle effect on every click
      for (let i = 0; i < 8; i++) {
        this.particles.push(new Particle(x, y));
      }

      if (!this.onClickResolve) return;
      const spawnList = this.onClickResolve();

      for (const element of spawnList) {
        this.spawnElement(element, x, y);
      }
    });
  }

  /*** SETTERS ***/
  setCanvas(canvas) {
    this.canvas = canvas;
    this.addCanvasClickListener();
    this.ctx = canvas.getContext("2d");
  }
  setWidth(width) {
    this.canvas.width = width;
  }
  setHeight(height) {
    this.canvas.height = height;
  }

  /*** GETTERS ***/
  getCanvas() {
    return this.canvas;
  }
  getCtx() {
    return this.ctx;
  }
  getWidth() {
    return this.canvas.width;
  }
  getHeight() {
    return this.canvas.height;
  }
}

// helpful functions
export function debug(message) {
  console.log(message);
}

function normalizeSymbol(sym) {
  const s = (sym ?? "").toString().trim();
  if (s.length === 0) return s;
  if (s.length === 1) return s.toUpperCase(); // h -> H
  return s[0].toUpperCase() + s.slice(1).toLowerCase(); // he -> He, LI -> Li
}
