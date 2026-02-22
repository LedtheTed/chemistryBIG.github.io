    import { ElementBase, Environment } from "./classes/classes.js";
    import { UPGRADES } from "./classes/upgrades.js";

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

    function spawnFromStorage(symbol, count, environment) {
        if (paused) return;

        const sym = normalizeSymbol(symbol);
        const have = window.ChemistryBIG.getCounter(sym);

        if (have < count) return; // not enough stored

        // Spend first (so counters stay correct)
        window.ChemistryBIG.spendCounter(sym, count);

        // Spawn count instances near the center with a little jitter
        const cx = environment.width / 2;
        const cy = environment.height / 2;

        for (let i = 0; i < count; i++) {
            const jitterX = (Math.random() - 0.5) * 80;
            const jitterY = (Math.random() - 0.5) * 80;
            environment.spawnElement(sym, cx + jitterX, cy + jitterY);
        }

        updateElementCounter();
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
        requestSpawnButtonsRefresh();
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

        for (const elementName of elementsToShow) {
            const raw = counts[elementName] || 0;
            const displayCount = Number.isInteger(raw) ? raw : raw.toFixed(1);
            const def = window.ChemistryBIG.getElementDefinition(elementName);

            const counterItem = document.createElement("div");
            counterItem.className = "counter-item";
            counterItem.style.borderLeftColor = def.color;
            counterItem.style.borderLeftWidth = "3px";
            counterItem.innerHTML = `
            <span class="element-name">${elementName}</span>
            <span class="element-count">${displayCount}</span>
            `;
            counterList.appendChild(counterItem);
        }
        requestSpawnButtonsRefresh();

//   }

//   // Animate molecule unlock: shrink and disappear after 5 seconds
//   const moleculesList = document.getElementById("molecules-list");
//   if (window.ChemistryBIG.moleculeDefinitions) {
//     Object.entries(window.ChemistryBIG.moleculeDefinitions).forEach(
//       ([molKey, molDef]) => {
//         // Prevent rendering if disappeared
//         if (window.ChemistryBIG.disappearedMolecules.has(molKey)) {
//           const molItem = moleculesList?.querySelector(
//             `.molecule-item[data-molecule='${molKey}']`,
//           );
//           if (molItem) molItem.remove();
//           return;
//         }
//         if (molDef.unlocked) {
//           const molItem = moleculesList?.querySelector(
//             `.molecule-item[data-molecule='${molKey}']`,
//           );
//           if (molItem && !molItem.classList.contains("disappear")) {
//             setTimeout(() => {
//               molItem.classList.add("disappear");
//               window.ChemistryBIG.disappearedMolecules.add(molKey);
//               setTimeout(() => molItem.remove(), 1000);
//             }, 5000);
//           }
//         }
//       },
//     );
//   }
    }

    // element counter -----------------------------
    function normalizeSymbol(sym) {
    const s = (sym ?? "").toString().trim();
    if (s.length === 0) return s;
    if (s.length === 1) return s.toUpperCase();                 // h -> H
    return s[0].toUpperCase() + s.slice(1).toLowerCase();       // he -> He, LI -> Li
    }


    const collectBtn = document.getElementById("collect-all-btn");
    if (collectBtn) {
        collectBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (paused) return;
        // collectAllElementsFromSim(); TODO FIX
        });
    }

    function payCost(costMap) {
    for (const [symRaw, amt] of Object.entries(costMap)) {
        const sym = normalizeSymbol(symRaw);
        window.ChemistryBIG.spendCounter(sym, amt);
    }
    }

    function addElementCurrency(elementName, amount) {
        const sym = normalizeSymbol(elementName);
        window.ChemistryBIG.incrCounter(sym, amount);
        updateElementCounter();
        refreshUpgradeAffordability(); 
    }

    // NOTE - if this ever gets expanded, this can be greatly simplified with the new way click chances and states are being stored on the game object.
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
            click_chance["H"] += effect.add;
            click_chance["H"] = Math.min(click_chance["H"], 0.95); // cap at 95%
            break;
            case "sodium_click_chance_add":
            click_chance["Na"] += effect.add;
            click_chance["Na"] = Math.min(click_chance["Na"], 0.5); // cap at 50%
            break;
            case "potassium_click_chance_add":
            click_chance["K"] += effect.add;
            click_chance["K"] = Math.min(click_chance["K"], 0.5);
            break;
            case "rubidium_click_chance_add":
            click_chance["Rb"] += effect.add;
            click_chance["Rb"] = Math.min(click_chance["Rb"], 0.5);
            break;
            case "caesium_click_chance_add":
            click_chance["Cs"] += effect.add;
            click_chance["Cs"] = Math.min(click_chance["Cs"], 0.5);
            break;
            case "francium_click_chance_add":
            click_chance["Fr"] += effect.add;
            click_chance["Fr"] = Math.min(click_chance["Fr"], 0.5);
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
            const idx = availableUpgrades.findIndex(u => u.id === upgradeId);
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
        if (prevCount > 0) return;     // already had it before
        if (newCount <= 0) return;     // still none
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
    environments: [],
  click_chances: {
    "H": 0.1,
    "He": 0.0,
    "Na": 0.0,
    "K": 0.0,
    "Rb": 0.0,
    "Cs": 0.0,
    "Fr": 0.0
  },
    update() {
    // update environments
    this.environments.forEach((environment) => {
      environment.updateElements();
      environment.checkCollisions();
      environment.checkDecays();
      environment.updateParticles();
    });
  },

  draw() {
    Game.lastRender = Date.now();

    // background first
    this.environments.forEach((environment) => {
      environment.drawCanvasBackground();
      environment.drawElements();
      environment.drawParticles();
    });

    // debug(`Frame ${Game.frame}: Loaded in ${Game.deltaTime} ms`);
  },

  shouldRenderFrame() {
    let now = Date.now();
    Game.deltaTime = now - Game.lastRender;
    let mspf = (1 / Game.fps) * 1000;
    return Game.deltaTime >= mspf;
  },

  loop() {
    if (!paused) {
      Game.update();
      if (Game.shouldRenderFrame()) {
        Game.draw();
        updateElementCounter();
        Game.frame += 1;
      }
    }
    window.requestAnimationFrame(Game.loop);
  },

  // when a canvas is clicked, all logic is resolved here.
  resolveClick() {
    console.log("A click is being resolved!");
    const results = [];

    for (const [element, chance] of Object.entries(Game.click_chances)) {
      if (Math.random() < chance) {
        console.log(element);
        results.push(element);
      }
    }

    return results;
  }
};
debug("Game element made");

let mainEnvironment = new Environment(Game.resolveClick);
mainEnvironment.initializeCanvas(document.getElementById("sim-main"), 600, 600);
mainEnvironment.canvas.classList.add("main-canvas");
mainEnvironment.canvas.id = "sim-canvas-main";
mainEnvironment.setBGImage("./space_texture.jpg");
Game.environments.push(mainEnvironment);
debug("Main environment made");

function makeEnv() {
  let secEnvironment = new Environment(Game.resolveClick);
  secEnvironment.initializeCanvas(document.getElementById("sim-other"), 500, 200);
  Game.environments.push(secEnvironment);
}
for (let i = 0; i < 3; i++) {
  makeEnv();
}
debug("Secondary environments made");

// Initialize element counter on page load
updateElementCounter();
document.addEventListener(
  "click",
  (e) => {
    // console.log("DOCUMENT CLICK:", e.target);
  },
  true,
); // capture phase
updateElementCounter();
document.addEventListener("click", (e) => {
    console.log("DOCUMENT CLICK:", e.target);
}, true); // capture phase
setupUpgradeClicks();
renderUpgradesPanel();

// Begin looping
window.requestAnimationFrame(Game.loop);





/*** HELPER FUNCTIONS ***/
    function debug(message) {
    if (DEBUG) console.log(message);
    }