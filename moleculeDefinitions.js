// Define all available molecules and their unlock requirements

function parseMoleculeComposition(moleculeName) {
  const composition = {};

  // Remove underscores to parse element-by-element
  const cleanName = moleculeName.replace(/_/g, "");
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
      let countStr = "";
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
    name: "H_2",
    displayName: "DiHydrogen",
    formula: "H₂",
    composition: parseMoleculeComposition("H_2"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("H_2")),
    unlocked: false,
    description: "H-H",
  },
  He_2: {
    name: "He_2",
    displayName: "Helium Dimer",
    formula: "He₂",
    composition: parseMoleculeComposition("He_2"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("He_2")),
    unlocked: false,
    description: "He-He (very weakly bound)",
  },
  Br_2: {
    name: "Br_2",
    displayName: "Diatomic Bromine",
    formula: "Br₂",
    composition: parseMoleculeComposition("Br_2"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("Br_2")),
    unlocked: false,
    description: "Br-Br",
  },
  N_2: {
    name: "N_2",
    displayName: "Diatomic Nitrogen",
    formula: "N₂",
    composition: parseMoleculeComposition("N_2"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("N_2")),
    unlocked: false,
    description: "N-N",
  },
  O_2: {
    name: "O_2",
    displayName: "DiOxygen",
    formula: "O₂",
    composition: parseMoleculeComposition("O_2"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("O_2")),
    unlocked: false,
    description: "O-O",
  },
  F_2: {
    name: "F_2",
    displayName: "DiFluorine",
    formula: "F₂",
    composition: parseMoleculeComposition("F_2"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("F_2")),
    unlocked: false,
    description: "F-F",
  },
  H_2_O: {
    name: "H_2_O",
    displayName: "DiHydrogen Monoxide",
    formula: "H₂O",
    composition: parseMoleculeComposition("H_2_O"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("H_2_O")),
    unlocked: false,
    description: "H-O-H",
  },
  CO_2: {
    name: "CO_2",
    displayName: "Carbon Dioxide",
    formula: "CO₂",
    composition: parseMoleculeComposition("CO_2"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("CO_2")),
    unlocked: false,
    description: "C-O-O",
  },
  CH_4: {
    name: "CH_4",
    displayName: "Methane",
    formula: "CH₄",
    composition: parseMoleculeComposition("CH_4"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("CH_4")),
    unlocked: false,
    description: "C-H-H-H",
  },
  NH_3: {
    name: "NH_3",
    displayName: "Ammonia",
    formula: "NH₃",
    composition: parseMoleculeComposition("NH_3"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("NH_3")),
    unlocked: false,
    description: "N-H-H-H",
  },
  NO_2: {
    name: "NO_2",
    displayName: "Nitrogen Dioxide",
    formula: "NO₂",
    composition: parseMoleculeComposition("NO_2"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("NO_2")),
    unlocked: false,
    description: "N-O-O",
  },
  CO: {
    name: "CO",
    displayName: "Carbon Monoxide",
    formula: "CO",
    composition: parseMoleculeComposition("CO"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("CO")),
    unlocked: false,
    description: "C-O",
  },
  O_3: {
    name: "O_3",
    displayName: "Ozone",
    formula: "O₃",
    composition: parseMoleculeComposition("O_3"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("O_3")),
    unlocked: false,
    description: "O-O-O",
  },
  H_2_O_2: {
    name: "H_2_O_2",
    displayName: "Hydrogen Peroxide",
    formula: "H₂O₂",
    composition: parseMoleculeComposition("H_2_O_2"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("H_2_O_2"),
    ),
    unlocked: false,
    description: "H-O-O-H",
  },
  Na_Cl: {
    name: "Na_Cl",
    displayName: "Sodium Chloride",
    formula: "NaCl",
    composition: parseMoleculeComposition("Na_Cl"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("Na_Cl")),
    unlocked: false,
    description: "Na-Cl (salt)",
  },
  C_2_H_6: {
    name: "C_2_H_6",
    displayName: "Ethane",
    formula: "C₂H₆",
    composition: parseMoleculeComposition("C_2_H_6"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_2_H_6"),
    ),
    unlocked: false,
    description: "C-C with Hs",
  },
  C_2_H_5_O_H: {
    name: "C_2_H_5_O_H",
    displayName: "Ethanol",
    formula: "C₂H₅OH",
    composition: parseMoleculeComposition("C_2_H_5_O_H"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_2_H_5_O_H"),
    ),
    unlocked: false,
    description: "C-C-O with Hs (ethanol)",
  },
  C_H_3_O_H: {
    name: "C_H_3_O_H",
    displayName: "Methanol",
    formula: "CH₃OH",
    composition: parseMoleculeComposition("C_H_3_O_H"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_H_3_O_H"),
    ),
    unlocked: false,
    description: "C-O with Hs (methanol)",
  },
  HCl: {
    name: "HCl",
    displayName: "Hydrochloric Acid",
    formula: "HCl",
    composition: parseMoleculeComposition("HCl"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("HCl")),
    unlocked: false,
    description: "H-Cl",
  },
  H_2_S_O_4: {
    name: "H_2_S_O_4",
    displayName: "Sulfuric Acid",
    formula: "H₂SO₄",
    composition: parseMoleculeComposition("H_2_S_O_4"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("H_2_S_O_4"),
    ),
    unlocked: false,
    description: "H-S(=O)₂-OH (sulfuric acid)",
  },
  C_6_H_6: {
    name: "C_6_H_6",
    displayName: "Benzene",
    formula: "C₆H₆",
    composition: parseMoleculeComposition("C_6_H_6"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_6_H_6"),
    ),
    unlocked: false,
    description: "Aromatic ring (benzene)",
  },
  C_6_H_12_O_6: {
    name: "C_6_H_12_O_6",
    displayName: "Glucose",
    formula: "C₆H₁₂O₆",
    composition: parseMoleculeComposition("C_6_H_12_O_6"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_6_H_12_O_6"),
    ),
    unlocked: false,
    description: "Simple sugar (glucose)",
  },
  C_12_H_22_O_11: {
    name: "C_12_H_22_O_11",
    displayName: "Sucrose",
    formula: "C₁₂H₂₂O₁₁",
    composition: parseMoleculeComposition("C_12_H_22_O_11"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_12_H_22_O_11"),
    ),
    unlocked: false,
    description: "Table sugar (sucrose)",
  },
  C_2_H_4_O_2: {
    name: "C_2_H_4_O_2",
    displayName: "Acetic Acid",
    formula: "C₂H₄O₂",
    composition: parseMoleculeComposition("C_2_H_4_O_2"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_2_H_4_O_2"),
    ),
    unlocked: false,
    description: "Acetic/ethanoic acid (vinegar component)",
  },
  C_2_H_2: {
    name: "C_2_H_2",
    displayName: "Acetylene",
    formula: "C₂H₂",
    composition: parseMoleculeComposition("C_2_H_2"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_2_H_2"),
    ),
    unlocked: false,
    description: "Acetylene (alkyne gas)",
  },
  C_3_H_8: {
    name: "C_3_H_8",
    displayName: "Propane",
    formula: "C₃H₈",
    composition: parseMoleculeComposition("C_3_H_8"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_3_H_8"),
    ),
    unlocked: false,
    description: "Propane (fuel gas)",
  },
  C_3_H_8_O_3: {
    name: "C_3_H_8_O_3",
    displayName: "Glycerol",
    formula: "C₃H₈O₃",
    composition: parseMoleculeComposition("C_3_H_8_O_3"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_3_H_8_O_3"),
    ),
    unlocked: false,
    description: "Glycerol (trivial alcohol)",
  },
  Ca_C_O_3: {
    name: "Ca_C_O_3",
    displayName: "Calcium Carbonate",
    formula: "CaCO₃",
    composition: parseMoleculeComposition("Ca_C_O_3"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("Ca_C_O_3"),
    ),
    unlocked: false,
    description: "Calcium carbonate (limestone, chalk)",
  },
  Si_O_2: {
    name: "Si_O_2",
    displayName: "Silicon Dioxide",
    formula: "SiO₂",
    composition: parseMoleculeComposition("Si_O_2"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("Si_O_2")),
    unlocked: false,
    description: "Quartz / sand (SiO2)",
  },
  Fe_2_O_3: {
    name: "Fe_2_O_3",
    displayName: "Iron(III) Oxide",
    formula: "Fe₂O₃",
    composition: parseMoleculeComposition("Fe_2_O_3"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("Fe_2_O_3"),
    ),
    unlocked: false,
    description: "Rust (iron oxide)",
  },
  H_N_O_3: {
    name: "H_N_O_3",
    displayName: "Nitric Acid",
    formula: "HNO₃",
    composition: parseMoleculeComposition("H_N_O_3"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("H_N_O_3"),
    ),
    unlocked: false,
    description: "Nitric acid (HNO3)",
  },
  K_Cl: {
    name: "K_Cl",
    displayName: "Potassium Chloride",
    formula: "KCl",
    composition: parseMoleculeComposition("K_Cl"),
    requiredCounts: calculateRequiredCounts(parseMoleculeComposition("K_Cl")),
    unlocked: false,
    description: "K-Cl (salt variant)",
  },
  N_H_4_Cl: {
    name: "N_H_4_Cl",
    displayName: "Ammonium Chloride",
    formula: "NH₄Cl",
    composition: parseMoleculeComposition("N_H_4_Cl"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("N_H_4_Cl"),
    ),
    unlocked: false,
    description: "Ammonium chloride (sal ammoniac)",
  },
  C_7_H_8: {
    name: "C_7_H_8",
    displayName: "Toluene",
    formula: "C₇H₈",
    composition: parseMoleculeComposition("C_7_H_8"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_7_H_8"),
    ),
    unlocked: false,
    description: "Toluene (aromatic solvent)",
  },
  C_8_H_10_N_4_O_2: {
    name: "C_8_H_10_N_4_O_2",
    displayName: "Caffeine",
    formula: "C₈H₁₀N₄O₂",
    composition: parseMoleculeComposition("C_8_H_10_N_4_O_2"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_8_H_10_N_4_O_2"),
    ),
    unlocked: false,
    description: "Caffeine (stimulant)",
  },
  C_10_H_15_N: {
    name: "C_10_H_15_N",
    displayName: "Methamphetamine",
    formula: "C₁₀H₁₅N",
    composition: parseMoleculeComposition("C_10_H_15_N"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_10_H_15_N"),
    ),
    unlocked: false,
    description: "Methamphetamine (data-only entry; no synthesis information)",
  },
  C_17_H_21_N_O_4: {
    name: "C_17_H_21_N_O_4",
    displayName: "Cocaine",
    formula: "C₁₇H₂₁NO₄",
    composition: parseMoleculeComposition("C_17_H_21_N_O_4"),
    requiredCounts: calculateRequiredCounts(
      parseMoleculeComposition("C_17_H_21_N_O_4"),
    ),
    unlocked: false,
    description: "Cocaine (data-only entry; no synthesis information)",
  },
};

// Export to window for use in other scripts
window.ChemistryBIG = window.ChemistryBIG || {};
window.ChemistryBIG.moleculeDefinitions = moleculeDefinitions;
window.ChemistryBIG.parseMoleculeComposition = parseMoleculeComposition;
window.ChemistryBIG.calculateRequiredCounts = calculateRequiredCounts;
