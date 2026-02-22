// Define all available molecules and their unlock requirements

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

// Export to window for use in other scripts
window.ChemistryBIG = window.ChemistryBIG || {};
window.ChemistryBIG.moleculeDefinitions = moleculeDefinitions;
window.ChemistryBIG.parseMoleculeComposition = parseMoleculeComposition;
window.ChemistryBIG.calculateRequiredCounts = calculateRequiredCounts;

