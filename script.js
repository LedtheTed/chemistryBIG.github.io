// import { Environment } from "./environment.js";
import { Particle, ElementBase, Environment } from "./classes/classes.js";
import { UPGRADES } from "./classes/upgrades.js";

let canvas = document.getElementById("sim-canvas");
const ctx = canvas.getContext("2d");
let DEBUG = true; // switch this to true/false depending on
let paused = false;

    // discovered elements tooltips
    const discoveredElements = new Set();
    const discoveryQueue = [];
    let tooltipOpen = false;

    // adding to sim
    const SPAWN_AMOUNTS = [1, 4, 8];
    let spawnAmountIndex = 0;
    let spawnAmount = SPAWN_AMOUNTS[spawnAmountIndex];

// --- Reaction speed bonus tuning ---
const REACTION_SPEED_THRESHOLD = 2.5; // below this: no bonus
const REACTION_SPEED_MAX = 12.0; // at/above this: full bonus
const REACTION_SPEED_BONUS_MAX = 0.35; // max +35% absolute probability (clamped)

    // helper
    function clamp01(x) {
        return Math.max(0, Math.min(1, x));
    }

    function formatCount(x) {
        return Number.isInteger(x) ? x : x.toFixed(1);
    }

    function spawnSimOnly(symbol, x, y) {
        const sym = normalizeSymbol(symbol);
        const e = window.ChemistryBIG?.createElementInstance?.(sym, x, y);
        if (!e) return null;
        elements.push(e);
        return e;
    }
    function spawnFromStorage(symbol, count) {
        if (paused) return;

        const sym = normalizeSymbol(symbol);
        const have = window.ChemistryBIG.getCounter(sym);

        if (have < count) return; // not enough stored

        // Spend first (so counters stay correct)
        window.ChemistryBIG.spendCounter(sym, count);

        // Spawn count instances near the center with a little jitter
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        for (let i = 0; i < count; i++) {
            const jitterX = (Math.random() - 0.5) * 80;
            const jitterY = (Math.random() - 0.5) * 80;
            spawnSimOnly(sym, cx + jitterX, cy + jitterY);
        }

        requestCounterUIRefresh();
        refreshUpgradeAffordability?.();
    }

    const spawnAmtBtn = document.getElementById("spawn-amount-btn");
    if (spawnAmtBtn) {
        spawnAmtBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        spawnAmountIndex = (spawnAmountIndex + 1) % SPAWN_AMOUNTS.length;
        spawnAmount = SPAWN_AMOUNTS[spawnAmountIndex];

        spawnAmtBtn.textContent = `Add Amount: ${spawnAmount}`;
        requestCounterUIRefresh();
        });
    }
    let spawnButtonsScheduled = false;
    let spawnButtonsDirty = true;           // force initial build
    let lastSpawnSignature = "";            // tracks when we actually need to rebuild

    function requestSpawnButtonsRefresh() {
        spawnButtonsDirty = true;
        if (spawnButtonsScheduled) return;

        spawnButtonsScheduled = true;
        requestAnimationFrame(() => {
            spawnButtonsScheduled = false;
            if (!spawnButtonsDirty) return;
            spawnButtonsDirty = false;

            refreshSpawnButtons(); // uses smart rebuild/update
        });
    }

    function refreshSpawnButtons() {
        const wrap = document.getElementById("spawn-buttons");
        if (!wrap) return;

        const counts = window.ChemistryBIG.counters || {};
        const allElements = window.ChemistryBIG.getAllElements();

        const elementsToShow = allElements.filter(name => (counts[name] || 0) > 0);

        // Signature changes when button set or spawnAmount changes
        const signature = `${spawnAmount}|${elementsToShow.join(",")}`;

        // If no elements, just show message (only if signature changed)
        if (elementsToShow.length === 0) {
            if (signature !== lastSpawnSignature) {
            wrap.innerHTML = `<div style="opacity:0.6;font-size:12px;">No stored elements to add</div>`;
            lastSpawnSignature = signature;
            }
            return;
        }

        // If signature changed, rebuild buttons ONCE
        if (signature !== lastSpawnSignature) {
            wrap.innerHTML = "";

            for (const elementName of elementsToShow) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "spawn-btn";
            btn.dataset.element = elementName;
            wrap.appendChild(btn);
            }

            lastSpawnSignature = signature;
        }

        // Always update text + enabled/disabled state without rebuilding DOM
        const btns = wrap.querySelectorAll("button.spawn-btn");
        btns.forEach((btn) => {
            const elementName = btn.dataset.element;
            const have = window.ChemistryBIG.getCounter(elementName);

            const can = have >= spawnAmount;
            btn.classList.toggle("unaffordable", !can);
            btn.disabled = !can;

            btn.textContent = `Add ${spawnAmount} ${elementName}`;
        });
    }

    (function setupSpawnButtonClicks() {
        const wrap = document.getElementById("spawn-buttons");
        if (!wrap) return;

        wrap.addEventListener("click", (e) => {
            const btn = e.target.closest("button.spawn-btn");
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const elementName = btn.dataset.element;
            spawnFromStorage(elementName, spawnAmount);

            // counters changed -> refresh button states (throttled)
            requestSpawnButtonsRefresh();
        });
    })();

// --- Background texture ---
const bgImage = new Image();
bgImage.src = "./space_texture.jpg"; // put the correct relative path here
bgImage.onload = () => console.log("Background loaded:", bgImage.src);
bgImage.onerror = (e) =>
  console.warn("Failed to load background:", bgImage.src, e);

function drawBackground() {
  // If not loaded yet, fallback to solid fill (avoids flashing/blank)
  if (!bgImage.complete || bgImage.naturalWidth === 0) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  // "cover" behavior: fill the canvas, keep aspect ratio, center crop
  const cw = canvas.width,
    ch = canvas.height;
  const iw = bgImage.naturalWidth,
    ih = bgImage.naturalHeight;

  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  ctx.drawImage(bgImage, dx, dy, dw, dh);
}

// Resize canvas to fit container as a square
function resizeCanvas() {
  canvas.width = 600;
  canvas.height = 600;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Element storage
let elements = [];
let particles = [];

// -------- Click "push away" settings --------
const CLICK_PUSH_RADIUS = 120; // how far the click affects elements (px)
const CLICK_PUSH_STRENGTH = 6.0; // how hard the click pushes (tune this)
const CLICK_PUSH_FALLOFF = 1.6; // >1 = stronger near center, softer at edge

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
    const t = 1 - dist / r;
    const impulse = CLICK_PUSH_STRENGTH * Math.pow(t, CLICK_PUSH_FALLOFF);

    // add velocity (impulse)
    e.vx += nx * impulse;
    e.vy += ny * impulse;
  }
}

// Register ElementBase globally
window.ChemistryBIG = window.ChemistryBIG || {};
window.ChemistryBIG.ElementBase = ElementBase;
window.ChemistryBIG.counters = window.ChemistryBIG.counters || {};
window.ChemistryBIG.getCounter = function (name) {
  return window.ChemistryBIG.counters[name] || 0;
};
window.ChemistryBIG.incrCounter = function (name, amount = 1) {
  const sym = normalizeSymbol(name);
  const prev = window.ChemistryBIG.counters[sym] || 0;
  const next = prev + amount;
  window.ChemistryBIG.counters[sym] = next;

  // Only trigger tooltip on first time crossing 0 -> >0
  onElementGained(sym, prev, next);

  return next;
};

window.ChemistryBIG.spendCounter = function (name, amount = 1) {
  const cur = window.ChemistryBIG.getCounter(name);
  const next = Math.max(0, cur - amount);
  window.ChemistryBIG.counters[name] = next;
  return next;
};

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
        if (reaction) {
          const baseP = reaction.probability ?? 0;

          // Linear speed-based bonus (starts at threshold, maxes at REACTION_SPEED_MAX)
          const t = clamp01(
            (combinedSpeed - REACTION_SPEED_THRESHOLD) /
              (REACTION_SPEED_MAX - REACTION_SPEED_THRESHOLD),
          );
          const bonus = t * REACTION_SPEED_BONUS_MAX;

          // Final probability (clamped to 1)
          const finalP = Math.min(1, baseP + bonus + (reactionProbBonus || 0));

          if (Math.random() < finalP) {
            const products = Array.isArray(reaction.products)
              ? reaction.products
              : [];

            // Collision point (midpoint between reactants)
            const collisionX = (e1.x + e2.x) / 2;
            const collisionY = (e1.y + e2.y) / 2;

            for (const productName of products) {
              spawnElement(productName, collisionX, collisionY);
            }

            // consume reactants:
            toRemove.add(i);
            toRemove.add(j);

            // decrement counters for consumed reactants (single counter truth)
            //window.ChemistryBIG.spendCounter(e1.name, 1);
            //window.ChemistryBIG.spendCounter(e2.name, 1);

            updateElementCounter();
          }
        }
      }
    }
  }

  // Remove marked elements in reverse order to preserve indices
  const indicesToRemove = Array.from(toRemove).sort((a, b) => b - a);
  indicesToRemove.forEach((index) => {
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

    const decay = window.ChemistryBIG?.getDecayReaction?.(element.name);
    if (decay && Math.random() < (decay.probability ?? 0)) {
      const products = Array.isArray(decay.products) ? decay.products : [];

      for (const productName of products) {
        spawnElement(productName, element.x, element.y);
      }

      toRemove.add(i);
      window.ChemistryBIG.spendCounter(element.name, 1);
      console.log(`Decay: ${element.name} -> ${products.join(" + ")}`);
    }
  }

  const indicesToRemove = Array.from(toRemove).sort((a, b) => b - a);
  indicesToRemove.forEach((index) => elements.splice(index, 1));

  if (indicesToRemove.length > 0) updateElementCounter();
}

    let hydrogenClickChance = 0.1;
    let sodiumClickChance = 0.0;
    let potassiumClickChance = 0.0;
    let rubidiumClickChance = 0.0;
    let cesiumClickChance = 0.0;
    let franciumClickChance = 0.0;

    // Canvas click handler to create hydrogen (10% chance) and particle effect
    canvas.addEventListener('click', (event) => {
        if (paused) return;
        const rect = canvas.getBoundingClientRect();

  debug(`Rect left: ${rect.left}`);
  debug(`Rect top: ${rect.top}`);
  debug(`Mouse X: ${event.clientX}`);
  debug(`Mouse Y: ${event.clientY}`);

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // NEW: push nearby elements away from the click
  pushNearbyElements(x, y);

  // create particle effect on every click
  for (let i = 0; i < 8; i++) {
    particles.push(new Particle(x, y));
  }

        if (Math.random() < hydrogenClickChance) {
            spawnElement("H", x, y);
            updateElementCounter();
        } else if (Math.random() < sodiumClickChance) {
            spawnElement("Na", x, y);
            updateElementCounter();
        } else if (Math.random() < potassiumClickChance) {
            spawnElement("K", x, y);
            updateElementCounter();
        } else if (Math.random() < rubidiumClickChance) {
            spawnElement("Rb", x, y);
            updateElementCounter();
        } else if (Math.random() < cesiumClickChance) {
            spawnElement("Cs", x, y);
            updateElementCounter();
        } else if (Math.random() < franciumClickChance) {
            spawnElement("Fr", x, y);
            updateElementCounter();
        }
    });

// element counter -----------------------------

// Update the element counter display
function updateElementCounter() {
  const counterList = document.getElementById("counter-list");
  const counts = window.ChemistryBIG.counters || {};
  const allElements = window.ChemistryBIG.getAllElements();

  // Unlock checks should use the same single counter system
  if (window.ChemistryBIG.checkMoleculeUnlocks) {
    window.ChemistryBIG.checkMoleculeUnlocks(counts);
  }

  counterList.innerHTML = "";

  const elementsToShow = allElements.filter((name) => (counts[name] || 0) > 0);

  if (elementsToShow.length === 0) {
    counterList.innerHTML =
      '<div style="padding: 8px; text-align: center; color: #93c5fd; font-size: 12px; opacity: 0.6;">No elements</div>';
    return;
  }

  // Track disappeared molecules
  window.ChemistryBIG = window.ChemistryBIG || {};
  window.ChemistryBIG.disappearedMolecules =
    window.ChemistryBIG.disappearedMolecules || new Set();

  for (const elementName of elementsToShow) {
    // Skip if molecule has disappeared
    if (window.ChemistryBIG.disappearedMolecules.has(elementName)) continue;
    // Only show if not a molecule that has disappeared
    const raw = counts[elementName] || 0;
    const displayCount = Number.isInteger(raw) ? raw : raw.toFixed(1);
    const def = window.ChemistryBIG.getElementDefinition(elementName);

            // left Add button
            const addBtn = document.createElement("button");
            addBtn.type = "button";
            addBtn.className = "spawn-btn";
            addBtn.dataset.element = sym;

            // right counter item
            const counterItem = document.createElement("div");
            counterItem.className = "counter-item";
            counterItem.style.borderLeftColor = def.color || "#7dd3fc";
            counterItem.style.borderLeftWidth = "3px";
            counterItem.innerHTML = `
                <span class="element-name">${sym}</span>
                <span class="element-count">0</span>
            `;

            row.appendChild(addBtn);
            row.appendChild(counterItem);
            container.appendChild(row);
            }

            lastCounterSignature = signature;
        }

        // Always update text + disabled state without rebuilding DOM
        const rows = container.querySelectorAll(".counter-add-row");
        rows.forEach((row) => {
            const sym = row.dataset.element;
            const raw = window.ChemistryBIG.getCounter(sym);
            const displayCount = formatCount(raw);

            const btn = row.querySelector("button.spawn-btn");
            const countEl = row.querySelector(".element-count");

            if (countEl) countEl.textContent = displayCount;

            if (btn) {
            const canAdd = raw >= spawnAmount && !paused;
            btn.disabled = !canAdd;
            btn.classList.toggle("unaffordable", !canAdd);
            btn.innerHTML = `
                <span class="upgrade-name">Add</span>
                <span class="upgrade-cost">x${spawnAmount}</span>
            `;
            }
        });

        // keep upgrades in sync
        refreshUpgradeAffordability?.();
    }

// element counter -----------------------------
function normalizeSymbol(sym) {
  const s = (sym ?? "").toString().trim();
  if (s.length === 0) return s;
  if (s.length === 1) return s.toUpperCase(); // h -> H
  return s[0].toUpperCase() + s.slice(1).toLowerCase(); // he -> He, LI -> Li
}

    function spawnElement(name, x, y) {
        const symbol = normalizeSymbol(name);

        const e = window.ChemistryBIG?.createElementInstance?.(symbol, x, y);
        if (!e) return null;

        elements.push(e);

        // increment using the actual created symbol
        window.ChemistryBIG.incrCounter(e.name, 1);

        return e;
        }
        // upgrade system
        const UPGRADE_WINDOW_SIZE = 5;
        let availableUpgrades = UPGRADES.slice();

        // tracks auto-generation rates by element
        const autoRates = Object.create(null);

        let clickMultiplier = 1.0;
        let reactionProbBonus = 0.0;


        function canAfford(costMap) {
        for (const [symRaw, amt] of Object.entries(costMap)) {
            const sym = normalizeSymbol(symRaw);
            if (window.ChemistryBIG.getCounter(sym) < amt) return false;
        }
        return true;
    }

    function collectAllElementsFromSim() {
        // Count what’s currently in the sim
        for (const e of elements) {
            if (!e) continue;
            // increment counter for each element removed
            window.ChemistryBIG.incrCounter(e.name, 1);
        }

        // Clear sim arrays
        elements.length = 0;

        // Update UI and upgrade affordability (since counters changed)
        updateElementCounter();
        refreshUpgradeAffordability?.();
    }

    const collectBtn = document.getElementById("collect-all-btn");
    if (collectBtn) {
        collectBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (paused) return;
        collectAllElementsFromSim();
        });
    }

function payCost(costMap) {
  for (const [symRaw, amt] of Object.entries(costMap)) {
    const sym = normalizeSymbol(symRaw);
    window.ChemistryBIG.spendCounter(sym, amt);
  }
}


function applyUpgradeEffect(effect) {
  if (!effect) return;

        switch (effect.type) {
            case "auto_element": {
            const el = normalizeSymbol(effect.element); 
            autoRates[el] = (autoRates[el] || 0) + effect.rate;
            break;
            }
            case "click_mult":
            clickMultiplier *= effect.mult;
            break;
            case "reaction_prob_add":
            reactionProbBonus += effect.add;
            break;
            case "hydrogen_click_chance_add":
            hydrogenClickChance += effect.add;
            hydrogenClickChance = Math.min(hydrogenClickChance, 0.95); // cap at 95%
            break;
            case "potassium_click_chance_add":
            potassiumClickChance += effect.add;
            potassiumClickChance = Math.min(potassiumClickChance, 0.5); // cap at 50%
            break;
            case "rubidium_click_chance_add":
            rubidiumClickChance += effect.add;
            rubidiumClickChance = Math.min(rubidiumClickChance, 0.5);
            break;
            case "caesium_click_chance_add":
            caesiumClickChance += effect.add;
            caesiumClickChance = Math.min(caesiumClickChance, 0.5);
            break;
            case "francium_click_chance_add":
            franciumClickChance += effect.add;
            franciumClickChance = Math.min(franciumClickChance, 0.5);
            break;
        }
    }

function setupUpgradeClicks() {
  const list = document.getElementById("upgrades-list");
  if (!list) return;

  list.addEventListener("click", (e) => {
    const btn = e.target.closest("button.upgrade-btn");
    if (!btn) return;

    const upgradeId = btn.dataset.upgradeId;

    // Find upgrade from the remaining list
    const idx = availableUpgrades.findIndex((u) => u.id === upgradeId);
    if (idx === -1) return;
    const up = availableUpgrades[idx];

    const costMap = up.cost ?? {};
    if (!canAfford(costMap)) {
      console.log("❌ cannot afford", up.name, costMap);
      btn.classList.add("cant-afford");
      setTimeout(() => btn.classList.remove("cant-afford"), 180);
      return;
    }

    console.log(`✅ Purchasing upgrade: ${up.name}`);

    payCost(costMap);
    applyUpgradeEffect(up.effect);

    // ✅ Remove only the purchased upgrade
    availableUpgrades.splice(idx, 1);

    updateElementCounter();
    renderUpgradesPanel(); // only rebuild on purchase
  });
}

function renderUpgradesPanel() {
  const list = document.getElementById("upgrades-list");
  if (!list) return;

  list.innerHTML = "";

  // Show the first N remaining upgrades
  const slice = availableUpgrades.slice(0, UPGRADE_WINDOW_SIZE);

  for (const up of slice) {
    const btn = document.createElement("button");
    btn.className = "upgrade-btn";
    btn.type = "button";
    btn.dataset.upgradeId = up.id;

    const costMap = up.cost ?? {};
    const affordable = canAfford(costMap);
    btn.classList.toggle("affordable", affordable);
    btn.classList.toggle("unaffordable", !affordable);

    const costText = Object.entries(costMap)
      .map(([sym, amt]) => `${amt} ${normalizeSymbol(sym)}`)
      .join(" + ");

    btn.innerHTML = `
            <span class="upgrade-name">${up.name}</span>
            <span class="upgrade-cost">${costText}</span>
            `;

    btn.title = up.desc || "";
    list.appendChild(btn);
  }
}

function refreshUpgradeAffordability() {
  const list = document.getElementById("upgrades-list");
  if (!list) return;

  const btns = list.querySelectorAll("button.upgrade-btn");
  btns.forEach((btn) => {
    const id = btn.dataset.upgradeId;
    const up = availableUpgrades.find((u) => u.id === id);
    if (!up) return;

    const affordable = canAfford(up.cost ?? {});
    btn.classList.toggle("affordable", affordable);
    btn.classList.toggle("unaffordable", !affordable);
  });
}

let lastAutoTime = performance.now();
function autoTick() {
  const now = performance.now();
  const dt = (now - lastAutoTime) / 1000;
  lastAutoTime = now;

  if (paused) {
    requestAnimationFrame(autoTick);
    return;
  }

  let changed = false;

  for (const [elementName, rate] of Object.entries(autoRates)) {
    const add = rate * dt;
    if (add > 0) {
      const sym = normalizeSymbol(elementName);
      window.ChemistryBIG.incrCounter(sym, add);
      changed = true;
    }
  }

  if (changed) {
    updateElementCounter();
    refreshUpgradeAffordability();
  }

  requestAnimationFrame(autoTick);
}

function pauseGame() {
  paused = true;
}

function resumeGame() {
  paused = false;
}

// Track background opacity globally
window.ChemistryBIG = window.ChemistryBIG || {};
if (typeof window.ChemistryBIG.chadKenOpacity !== "number") {
  window.ChemistryBIG.chadKenOpacity = 1;
}

function showElementTooltip(symbol) {
  if (tooltipOpen) return;
  tooltipOpen = true;
  pauseGame();

  const def = window.ChemistryBIG?.getElementDefinition?.(symbol) || {};
  const niceName = def.displayName || def.name || symbol;
  const desc = def.desc || def.description || "New element discovered!";

  const overlay = document.createElement("div");
  overlay.id = "element-tooltip-overlay";
  overlay.innerHTML = `
            <div class="element-tooltip-card" style="border-left: 6px solid ${def.color || "#2dd4bf"}; background: url('consultant_chad_ken.jpeg') center/cover no-repeat; min-height: 220px; position: relative;">
                <div style="background: transparent; border-radius: 12px; padding: 16px; margin: 24px;">
                    <div class="element-tooltip-title" style="color: #fff;">${symbol} — ${niceName}</div>
                    <div class="element-tooltip-desc" style="color: #e0e0e0;">${desc}</div>
                    <button type="button" class="element-tooltip-close" style="margin-top: 16px;">Continue</button>
                </div>
            </div>
        `;

  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector(".element-tooltip-close");
  closeBtn.addEventListener("click", () => {
    overlay.remove();
    tooltipOpen = false;
    resumeGame();
    // If more discoveries happened while paused, show next
    if (discoveryQueue.length > 0) {
      const next = discoveryQueue.shift();
      showElementTooltip(next);
    }
  });
}

// Call this whenever an element count increases
function onElementGained(symbol, prevCount, newCount) {
  if (prevCount > 0) return; // already had it before
  if (newCount <= 0) return; // still none
  if (discoveredElements.has(symbol)) return;

  discoveredElements.add(symbol);

  // If a tooltip is already open, queue it; otherwise show now
  if (tooltipOpen || paused) discoveryQueue.push(symbol);
  else showElementTooltip(symbol);
}

// Call these once on startup (after DOM exists)
renderUpgradesPanel();
requestAnimationFrame(autoTick);

let Game = {
  fps: 60,
  lastRender: Date.now(),
  deltaTime: 0,
  frame: 0,

  update: function () {
    // update elements
    elements.forEach((element) => {
      element.update(canvas);
    });
    // check collisions between elements
    checkCollisions();
    // check for decay reactions
    checkDecays();
    // update particles
    particles = particles.filter((p) => {
      p.update();
      return p.life > 0;
    });
  },

  draw: () => {
    Game.lastRender = Date.now();

    // background first
    drawBackground();

    // draw elements
    elements.forEach((element) => {
      element.draw(ctx);
    });
    // draw particles
    particles.forEach((particle) => {
      particle.draw(ctx);
    });

    // debug(`Frame ${Game.frame}: Loaded in ${Game.deltaTime} ms`);
  },

  shouldRenderFrame: () => {
    let now = Date.now();
    Game.deltaTime = now - Game.lastRender;
    let mspf = (1 / Game.fps) * 1000;
    return Game.deltaTime >= mspf;
  },

  loop: () => {
    if (!paused) {
      Game.update();
      if (Game.shouldRenderFrame()) {
        Game.draw();
        Game.frame += 1;
      }
    }
    window.requestAnimationFrame(Game.loop);
  },
};

function debug(message) {
  if (DEBUG) console.log(message);
}

    // Initialize element counter on page load
    updateElementCounter();
    document.addEventListener("click", (e) => {
        console.log("DOCUMENT CLICK:", e.target);
    }, true); // capture phase
    setupUpgradeClicks();
    renderUpgradesPanel();


// Begin looping
window.requestAnimationFrame(Game.loop);
