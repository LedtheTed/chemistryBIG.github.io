/**
 * Techtree system for unlocking molecules
 * Tracks molecule unlocks and checks unlock conditions
 */

function parseMoleculeComposition(moleculeName) {
  const composition = {};
  
  // Remove underscores to parse element-by-element
  const cleanName = moleculeName.replace(/_/g, '');
  let i = 0;
  
  while (i < cleanName.length) {
    // Check if we're at an uppercase letter (start of element symbol)
    if (/[A-Z]/.test(cleanName[i])) {
      let element = cleanName[i];
      i++;
      
      // Check for lowercase letter (two-letter element like He, Be, Ca)
      if (i < cleanName.length && /[a-z]/.test(cleanName[i])) {
        element += cleanName[i];
        i++;
      }
      
      // Parse the number following the element
      let countStr = '';
      while (i < cleanName.length && /[0-9]/.test(cleanName[i])) {
        countStr += cleanName[i];
        i++;
      }
      
      const count = countStr ? parseInt(countStr) : 1;
      composition[element] = count;
    } else {
      i++;
    }
  }
  
  return composition;
}

function calculateRequiredCounts(composition) {
  const required = {};
  for (const [element, count] of Object.entries(composition)) {
    required[element] = count * 5;
  }
  return required;
}

// Store unlocked molecules
const unlockedMolecules = new Set();
// Chronological list of unlocked molecules (earliest -> latest)
const unlockedOrder = [];

// Define all available molecules and their unlock requirements
const moleculeDefinitions = {
  H_2: {
    name: 'H_2',
    displayName: 'DiHydrogen',
    formula: 'H₂',
    composition: parseMoleculeComposition('H_2'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('H_2')),
    unlocked: false,
    description: 'H-H'
  },
  He_2: {
    name: 'He_2',
    displayName: 'Helium Dimer',
    formula: 'He₂',
    composition: parseMoleculeComposition('He_2'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('He_2')),
    unlocked: false,
    description: 'He-He (very weakly bound)'
  },
  Br_2: {
    name: 'Br_2',
    displayName: 'Diatomic Bromine',
    formula: 'Br₂',
    composition: parseMoleculeComposition('Br_2'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('Br_2')),
    unlocked: false,
    description: 'Br-Br'
  },
  N_2: {
    name: 'N_2',
    displayName: 'Diatomic Nitrogen',
    formula: 'N₂',
    composition: parseMoleculeComposition('N_2'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('N_2')),
    unlocked: false,
    description: 'N-N'
  },
  O_2: {
    name: 'O_2',
    displayName: 'DiOxygen',
    formula: 'O₂',
    composition: parseMoleculeComposition('O_2'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('O_2')),
    unlocked: false,
    description: 'O-O'
  },
  F_2: {
    name: 'F_2',
    displayName: 'DiFluorine',
    formula: 'F₂',
    composition: parseMoleculeComposition('F_2'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('F_2')),
    unlocked: false,
    description: 'F-F'
  },
  H_2_O: {
    name: 'H_2_O',
    displayName: 'DiHydrogen Monoxide',
    formula: 'H₂O',
    composition: parseMoleculeComposition('H_2_O'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('H_2_O')),
    unlocked: false,
    description: 'H-O-H'
  },
  CO_2: {
    name: 'CO_2',
    displayName: 'Carbon Dioxide',
    formula: 'CO₂',
    composition: parseMoleculeComposition('CO_2'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('CO_2')),
    unlocked: false,
    description: 'C-O-O'
  },
  CH_4: {
    name: 'CH_4',
    displayName: 'Methane',
    formula: 'CH₄',
    composition: parseMoleculeComposition('CH_4'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('CH_4')),
    unlocked: false,
    description: 'C-H-H-H'
  },
  NH_3: {
    name: 'NH_3',
    displayName: 'Ammonia',
    formula: 'NH₃',
    composition: parseMoleculeComposition('NH_3'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('NH_3')),
    unlocked: false,
    description: 'N-H-H-H'
  },
  NO_2: {
    name: 'NO_2',
    displayName: 'Nitrogen Dioxide',
    formula: 'NO₂',
    composition: parseMoleculeComposition('NO_2'),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition('NO_2')),
    unlocked: false,
    description: 'N-O-O'
  }
};


function checkMoleculeUnlocks(elementCounts) {
  for (const [moleculeKey, moleculeDef] of Object.entries(moleculeDefinitions)) {
    // Skip if already unlocked
    if (moleculeDef.unlocked) continue;

    // Check if all required elements have sufficient counts
    const allRequirementsMet = Object.entries(moleculeDef.requiredCounts).every(
      ([element, requiredCount]) => {
        const currentCount = elementCounts[element] || 0;
        return currentCount >= requiredCount;
      }
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

      // Scroll the molecules list to show the newly unlocked molecule
      scrollToMolecule(moleculeKey);
    }
  }
}

function getUnlockedMolecules() {
  return Array.from(unlockedMolecules);
}

function getMoleculeDefinition(moleculeKey) {
  return moleculeDefinitions[moleculeKey];
}

function updateMoleculesDisplay() {
  const moleculesList = document.getElementById('molecules-list');
  if (!moleculesList) return;

  moleculesList.innerHTML = '';

  const allMolecules = Object.entries(moleculeDefinitions);

  if (allMolecules.length === 0) {
    moleculesList.innerHTML = '<div style="padding: 8px; text-align: center; color: #93c5fd; font-size: 12px; opacity: 0.6;">No molecules available</div>';
    return;
  }

  // Previously unlocked (untracked), then ordered unlocked (chronological), then locked
  const previouslyUnlocked = Object.keys(moleculeDefinitions).filter(k => moleculeDefinitions[k].unlocked && !unlockedOrder.includes(k));
  const orderedUnlocked = unlockedOrder.filter(k => moleculeDefinitions[k] && moleculeDefinitions[k].unlocked);
  const locked = Object.keys(moleculeDefinitions).filter(k => !moleculeDefinitions[k].unlocked);

  const displayOrder = [...previouslyUnlocked, ...orderedUnlocked, ...locked];

  displayOrder.forEach(moleculeKey => {
    const moleculeDef = moleculeDefinitions[moleculeKey];
    if (!moleculeDef) return;

    const moleculeItem = document.createElement('div');
    moleculeItem.className = `molecule-item ${moleculeDef.unlocked ? 'unlocked' : 'locked'}`;
    moleculeItem.setAttribute('data-molecule', moleculeKey);
    
    let statusText = moleculeDef.unlocked ? '✓ Unlocked' : 
      Object.entries(moleculeDef.requiredCounts)
        .map(([element, count]) => `${count} ${element}`)
        .join(', ');
    
    moleculeItem.innerHTML = `
      <span class="molecule-name">${moleculeDef.formula}</span>
      <span class="molecule-status">${statusText}</span>
    `;
    
    moleculesList.appendChild(moleculeItem);
  });
}

  /**
   * Scroll the molecules panel to show the given molecule key if present
   * @param {string} moleculeKey
   */
  function scrollToMolecule(moleculeKey) {
    const moleculesList = document.getElementById('molecules-list');
    if (!moleculesList) return;
    const el = moleculesList.querySelector(`[data-molecule="${moleculeKey}"]`);
    if (!el) return;

    // Smoothly reveal the element inside the scroll container
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

// Export functions to window for use in other scripts
window.ChemistryBIG = window.ChemistryBIG || {};
window.ChemistryBIG.checkMoleculeUnlocks = checkMoleculeUnlocks;
window.ChemistryBIG.getUnlockedMolecules = getUnlockedMolecules;
window.ChemistryBIG.getMoleculeDefinition = getMoleculeDefinition;
window.ChemistryBIG.updateMoleculesDisplay = updateMoleculesDisplay;
window.ChemistryBIG.parseMoleculeComposition = parseMoleculeComposition;
window.ChemistryBIG.calculateRequiredCounts = calculateRequiredCounts;

// Expose scroll helper in case other code wants to reveal molecules
window.ChemistryBIG.scrollToMolecule = scrollToMolecule;

// Initialize the molecules display on page load
document.addEventListener('DOMContentLoaded', updateMoleculesDisplay);
