/**
 * Techtree system for unlocking molecules
 * Tracks molecule unlocks and checks unlock conditions
 */

// Helper functions are now in moleculeDefinitions.js
// parseMoleculeComposition and calculateRequiredCounts are available globally

// Store unlocked molecules
const unlockedMolecules = new Set();
// Chronological list of unlocked molecules (earliest -> latest)
const unlockedOrder = [];

// Reference to moleculeDefinitions from window (loaded from moleculeDefinitions.js)
function getMoleculeDefinitionsObj() {
  return window.ChemistryBIG?.moleculeDefinitions || {};
}

function checkMoleculeUnlocks(elementCounts) {
  const moleculeDefinitions = getMoleculeDefinitionsObj();
  for (const [moleculeKey, moleculeDef] of Object.entries(
    moleculeDefinitions,
  )) {
    // Skip if already unlocked
    if (moleculeDef.unlocked) continue;

    // Check if all required elements have sufficient counts
    const allRequirementsMet = Object.entries(moleculeDef.requiredCounts).every(
      ([element, requiredCount]) => {
        const currentCount = elementCounts[element] || 0;
        return currentCount >= requiredCount;
      },
    );

    // Unlock if all requirements are met
    if (allRequirementsMet) {
      unlockedMolecules.add(moleculeKey);
      moleculeDef.unlocked = true;
      // record unlock order (append newest at end)
      if (!unlockedOrder.includes(moleculeKey)) unlockedOrder.push(moleculeKey);
      // console.log(`Unlocked molecule: ${moleculeDef.displayName} (${moleculeDef.formula})`);

      // Update the molecules display
      updateMoleculesDisplay();
    }
  }
}

function getUnlockedMolecules() {
  return Array.from(unlockedMolecules);
}

function getMoleculeDefinition(moleculeKey) {
  const moleculeDefinitions = getMoleculeDefinitionsObj();
  return moleculeDefinitions[moleculeKey];
}

function updateMoleculesDisplay() {
  const moleculesList = document.getElementById("molecules-list");
  if (!moleculesList) return;

  // Track disappeared molecules globally
  window.ChemistryBIG = window.ChemistryBIG || {};
  window.ChemistryBIG.disappearedMolecules = window.ChemistryBIG.disappearedMolecules || new Set();
  const disappeared = window.ChemistryBIG.disappearedMolecules;

  const moleculeDefinitions = getMoleculeDefinitionsObj();
  if (!moleculeDefinitions || Object.keys(moleculeDefinitions).length === 0) {
    moleculesList.innerHTML =
      '<div style="padding: 8px; text-align: center; color: #93c5fd; font-size: 12px; opacity: 0.6;">No molecules available</div>';
    return;
  }

  moleculesList.innerHTML = "";

  // Previously unlocked (untracked), then ordered unlocked (chronological), then locked
  const previouslyUnlocked = Object.keys(moleculeDefinitions).filter(
    (k) => moleculeDefinitions[k].unlocked && !unlockedOrder.includes(k),
  );
  const orderedUnlocked = unlockedOrder.filter(
    (k) => moleculeDefinitions[k] && moleculeDefinitions[k].unlocked,
  );
  const locked = Object.keys(moleculeDefinitions).filter(
    (k) => !moleculeDefinitions[k].unlocked,
  );

  const displayOrder = [...previouslyUnlocked, ...orderedUnlocked, ...locked];

  displayOrder.forEach((moleculeKey) => {
    const moleculeDef = moleculeDefinitions[moleculeKey];
    if (!moleculeDef) return;
    // If this molecule has disappeared, never render it again
    if (disappeared.has(moleculeKey)) return;

    const moleculeItem = document.createElement("div");
    moleculeItem.className = `molecule-item ${moleculeDef.unlocked ? "unlocked" : "locked"}`;
    moleculeItem.setAttribute("data-molecule", moleculeKey);

    let statusText = moleculeDef.unlocked
      ? "✓ Unlocked"
      : Object.entries(moleculeDef.requiredCounts)
          .map(([element, count]) => `${count} ${element}`)
          .join(", ");

    moleculeItem.innerHTML = `
      <span class="molecule-name">${moleculeDef.formula}</span>
      <span class="molecule-status">${statusText}</span>
    `;

    // Animate and disappear if just unlocked
    if (moleculeDef.unlocked && !disappeared.has(moleculeKey)) {
      moleculeItem.classList.add("disappear");
      setTimeout(() => {
        disappeared.add(moleculeKey);
        updateMoleculesDisplay();
      }, 1000); // match CSS animation duration
    }

    moleculesList.appendChild(moleculeItem);
  });
}

// Export functions to window for use in other scripts
window.ChemistryBIG = window.ChemistryBIG || {};
window.ChemistryBIG.checkMoleculeUnlocks = checkMoleculeUnlocks;
window.ChemistryBIG.getUnlockedMolecules = getUnlockedMolecules;
window.ChemistryBIG.getMoleculeDefinition = getMoleculeDefinition;
window.ChemistryBIG.updateMoleculesDisplay = updateMoleculesDisplay;
// parseMoleculeComposition and calculateRequiredCounts are exported from moleculeDefinitions.js

// Initialize the molecules display immediately when this script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateMoleculesDisplay);
} else {
  // DOM is already loaded, call it immediately
  updateMoleculesDisplay();
}
