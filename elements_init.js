(function(global){
  // elements_init.js
  // Container/registry of all periodic table elements (1-99).
  // Use createElementInstance(name, x, y) to spawn copies as needed.
  // Sizes are atomic radius in pm / 10.
  // Expects `window.ChemistryBIG.ElementBase` to exist.

  // Element definitions library (all 99 elements with atomic radii / 10 as size)
  const ELEMENT_DEFINITIONS_ARRAY = [
  { name: 'H',  fullName: 'Hydrogen',      color: '#7dd3fc', size: 12.0, speed: 1 },
  { name: 'He', fullName: 'Helium',        color: '#f472b6', size: 14.0, speed: 0.9 },
  { name: 'Li', fullName: 'Lithium',       color: '#fb923c', size: 18.2, speed: 0.8 },
  { name: 'Be', fullName: 'Beryllium',     color: '#9ca3af', size: 15.3, speed: 0.75 },
  { name: 'B',  fullName: 'Boron',         color: '#86efac', size: 19.2, speed: 0.85 },
  { name: 'C',  fullName: 'Carbon',        color: '#d1d5db', size: 17.0, speed: 0.9 },
  { name: 'N',  fullName: 'Nitrogen',      color: '#60a5fa', size: 15.5, speed: 0.8 },
  { name: 'O',  fullName: 'Oxygen',        color: '#3b82f6', size: 15.2, speed: 0.8 },
  { name: 'F',  fullName: 'Fluorine',      color: '#fcd34d', size: 13.5, speed: 1.0 },
  { name: 'Ne', fullName: 'Neon',          color: '#c084fc', size: 15.4, speed: 0.7 },
  { name: 'Na', fullName: 'Sodium',        color: '#fca5a5', size: 22.7, speed: 0.6 },
  { name: 'Mg', fullName: 'Magnesium',     color: '#e0e7ff', size: 17.3, speed: 0.75 },
  { name: 'Al', fullName: 'Aluminium',     color: '#cbd5e1', size: 18.4, speed: 0.7 },
  { name: 'Si', fullName: 'Silicon',       color: '#a1a5b4', size: 21.0, speed: 0.65 },
  { name: 'P',  fullName: 'Phosphorus',    color: '#ca8a04', size: 18.0, speed: 0.7 },
  { name: 'S',  fullName: 'Sulfur',        color: '#eab308', size: 18.0, speed: 0.75 },
  { name: 'Cl', fullName: 'Chlorine',      color: '#86efac', size: 17.5, speed: 0.8 },
  { name: 'Ar', fullName: 'Argon',         color: '#c4b5fd', size: 18.8, speed: 0.65 },
  { name: 'K',  fullName: 'Potassium',     color: '#fda4af', size: 27.5, speed: 0.5 },
  { name: 'Ca', fullName: 'Calcium',       color: '#fed7aa', size: 23.1, speed: 0.6 },
  { name: 'Sc', fullName: 'Scandium',      color: '#bfdbfe', size: 21.1, speed: 0.7 },
  { name: 'Ti', fullName: 'Titanium',      color: '#99f6e4', size: 18.7, speed: 0.75 },
  { name: 'V',  fullName: 'Vanadium',      color: '#a78bfa', size: 17.9, speed: 0.8 },
  { name: 'Cr', fullName: 'Chromium',      color: '#7dd3fc', size: 18.9, speed: 0.85 },
  { name: 'Mn', fullName: 'Manganese',     color: '#60a5fa', size: 19.7, speed: 0.85 },
  { name: 'Fe', fullName: 'Iron',          color: '#f87171', size: 19.4, speed: 0.9 },
  { name: 'Co', fullName: 'Cobalt',        color: '#fb7185', size: 19.2, speed: 0.9 },
  { name: 'Ni', fullName: 'Nickel',        color: '#fbbf24', size: 16.3, speed: 0.9 },
  { name: 'Cu', fullName: 'Copper',        color: '#f59e0b', size: 14.0, speed: 0.8 },
  { name: 'Zn', fullName: 'Zinc',          color: '#d1d5db', size: 13.9, speed: 0.75 },
  { name: 'Ga', fullName: 'Gallium',       color: '#cbd5e1', size: 18.7, speed: 0.7 },
  { name: 'Ge', fullName: 'Germanium',     color: '#a1a5b4', size: 21.1, speed: 0.75 },
  { name: 'As', fullName: 'Arsenic',       color: '#9ca3af', size: 18.5, speed: 0.8 },
  { name: 'Se', fullName: 'Selenium',      color: '#d97706', size: 19.0, speed: 0.8 },
  { name: 'Br', fullName: 'Bromine',       color: '#dc2626', size: 18.3, speed: 0.9 },
  { name: 'Kr', fullName: 'Krypton',       color: '#7c3aed', size: 20.2, speed: 0.65 },
  { name: 'Rb', fullName: 'Rubidium',      color: '#fca5a5', size: 30.3, speed: 0.45 },
  { name: 'Sr', fullName: 'Strontium',     color: '#fed7aa', size: 24.9, speed: 0.55 },
  { name: 'Y',  fullName: 'Yttrium',       color: '#bfdbfe', size: 21.9, speed: 0.7 },
  { name: 'Zr', fullName: 'Zirconium',     color: '#99f6e4', size: 18.6, speed: 0.75 },
  { name: 'Nb', fullName: 'Niobium',       color: '#a78bfa', size: 20.7, speed: 0.8 },
  { name: 'Mo', fullName: 'Molybdenum',    color: '#7dd3fc', size: 20.9, speed: 0.8 },
  { name: 'Tc', fullName: 'Technetium',    color: '#60a5fa', size: 20.9, speed: 0.85 },
  { name: 'Ru', fullName: 'Ruthenium',     color: '#f87171', size: 20.7, speed: 0.85 },
  { name: 'Rh', fullName: 'Rhodium',       color: '#fb7185', size: 19.5, speed: 0.85 },
  { name: 'Pd', fullName: 'Palladium',     color: '#fbbf24', size: 20.2, speed: 0.85 },
  { name: 'Ag', fullName: 'Silver',        color: '#e5e7eb', size: 17.2, speed: 0.8 },
  { name: 'Cd', fullName: 'Cadmium',       color: '#d1d5db', size: 15.8, speed: 0.75 },
  { name: 'In', fullName: 'Indium',        color: '#cbd5e1', size: 19.3, speed: 0.65 },
  { name: 'Sn', fullName: 'Tin',           color: '#a1a5b4', size: 21.7, speed: 0.7 },
  { name: 'Sb', fullName: 'Antimony',      color: '#9ca3af', size: 20.6, speed: 0.75 },
  { name: 'Te', fullName: 'Tellurium',     color: '#6b7280', size: 20.6, speed: 0.75 },
  { name: 'I',  fullName: 'Iodine',        color: '#4338ca', size: 19.8, speed: 0.85 },
  { name: 'Xe', fullName: 'Xenon',         color: '#7c3aed', size: 21.6, speed: 0.6 },
  { name: 'Cs', fullName: 'Cesium',        color: '#fca5a5', size: 34.3, speed: 0.4 },
  { name: 'Ba', fullName: 'Barium',        color: '#fed7aa', size: 26.8, speed: 0.5 },
  { name: 'La', fullName: 'Lanthanum',     color: '#93c5fd', size: 24.0, speed: 0.65 },
  { name: 'Ce', fullName: 'Cerium',        color: '#dbeafe', size: 23.5, speed: 0.65 },
  { name: 'Pr', fullName: 'Praseodymium',  color: '#bfdbfe', size: 23.9, speed: 0.65 },
  { name: 'Nd', fullName: 'Neodymium',     color: '#7dd3fc', size: 22.9, speed: 0.65 },
  { name: 'Pm', fullName: 'Promethium',    color: '#06b6d4', size: 23.6, speed: 0.65 },
  { name: 'Sm', fullName: 'Samarium',      color: '#06d6a6', size: 22.9, speed: 0.65 },
  { name: 'Eu', fullName: 'Europium',      color: '#34d399', size: 23.3, speed: 0.6 },
  { name: 'Gd', fullName: 'Gadolinium',    color: '#10b981', size: 23.7, speed: 0.65 },
  { name: 'Tb', fullName: 'Terbium',       color: '#059669', size: 22.1, speed: 0.65 },
  { name: 'Dy', fullName: 'Dysprosium',    color: '#047857', size: 22.9, speed: 0.65 },
  { name: 'Ho', fullName: 'Holmium',       color: '#065f46', size: 21.6, speed: 0.65 },
  { name: 'Er', fullName: 'Erbium',        color: '#a78bfa', size: 23.5, speed: 0.65 },
  { name: 'Tm', fullName: 'Thulium',       color: '#7c3aed', size: 22.7, speed: 0.65 },
  { name: 'Yb', fullName: 'Ytterbium',     color: '#6366f1', size: 24.2, speed: 0.6 },
  { name: 'Lu', fullName: 'Lutetium',      color: '#4f46e5', size: 22.1, speed: 0.65 },
  { name: 'Hf', fullName: 'Hafnium',       color: '#4338ca', size: 21.2, speed: 0.7 },
  { name: 'Ta', fullName: 'Tantalum',      color: '#3730a3', size: 21.7, speed: 0.75 },
  { name: 'W',  fullName: 'Tungsten',      color: '#312e81', size: 21.0, speed: 0.8 },
  { name: 'Re', fullName: 'Rhenium',       color: '#1f2937', size: 21.7, speed: 0.8 },
  { name: 'Os', fullName: 'Osmium',        color: '#111827', size: 21.6, speed: 0.85 },
  { name: 'Ir', fullName: 'Iridium',       color: '#0f172a', size: 20.2, speed: 0.85 },
  { name: 'Pt', fullName: 'Platinum',      color: '#e5e7eb', size: 20.9, speed: 0.8 },
  { name: 'Au', fullName: 'Gold',          color: '#fbbf24', size: 16.6, speed: 0.75 },
  { name: 'Hg', fullName: 'Mercury',       color: '#d1d5db', size: 20.9, speed: 0.7 },
  { name: 'Tl', fullName: 'Thallium',      color: '#cbd5e1', size: 19.6, speed: 0.65 },
  { name: 'Pb', fullName: 'Lead',          color: '#a1a5b4', size: 20.2, speed: 0.6 },
  { name: 'Bi', fullName: 'Bismuth',       color: '#9ca3af', size: 20.7, speed: 0.55 },
  { name: 'Po', fullName: 'Polonium',      color: '#6b7280', size: 19.7, speed: 0.6 },
  { name: 'At', fullName: 'Astatine',      color: '#4b5563', size: 20.2, speed: 0.7 },
  { name: 'Rn', fullName: 'Radon',         color: '#7c3aed', size: 22.0, speed: 0.55 },
  { name: 'Fr', fullName: 'Francium',      color: '#fca5a5', size: 34.8, speed: 0.3 },
  { name: 'Ra', fullName: 'Radium',        color: '#fed7aa', size: 28.3, speed: 0.45 },
  { name: 'Ac', fullName: 'Actinium',      color: '#dbeafe', size: 26.0, speed: 0.6 },
  { name: 'Th', fullName: 'Thorium',       color: '#bfdbfe', size: 23.7, speed: 0.65 },
  { name: 'Pa', fullName: 'Protactinium',  color: '#7dd3fc', size: 24.3, speed: 0.7 },
  { name: 'U',  fullName: 'Uranium',       color: '#06b6d4', size: 24.0, speed: 0.75 },
  { name: 'Np', fullName: 'Neptunium',     color: '#06d6a6', size: 22.1, speed: 0.8 },
  { name: 'Pu', fullName: 'Plutonium',     color: '#34d399', size: 24.3, speed: 0.8 },
  { name: 'Am', fullName: 'Americium',     color: '#10b981', size: 24.4, speed: 0.8 },
  { name: 'Cm', fullName: 'Curium',        color: '#059669', size: 24.5, speed: 0.85 },
  { name: 'Bk', fullName: 'Berkelium',     color: '#047857', size: 24.4, speed: 0.85 },
  { name: 'Cf', fullName: 'Californium',   color: '#065f46', size: 24.5, speed: 0.85 },
  { name: 'Es', fullName: 'Einsteinium',   color: '#a78bfa', size: 24.5, speed: 0.85 },
];

  // Build lookup map
  const ELEMENT_DEFINITIONS = {};
  ELEMENT_DEFINITIONS_ARRAY.forEach(el => {
    ELEMENT_DEFINITIONS[el.name] = el;
  });

  function createElementInstance(name, x, y) {
    const ElementBase = global.ChemistryBIG && global.ChemistryBIG.ElementBase;
    if (!ElementBase) throw new Error('ElementBase not available on ChemistryBIG');

    const def = ELEMENT_DEFINITIONS[name];
    if (!def) throw new Error(`Element "${name}" not found in definitions`);

    return new ElementBase({ ...def, x: x || 0, y: y || 0 });
  }

  function getElementDefinition(name) {
    return ELEMENT_DEFINITIONS[name] || null;
  }

  function getAllElements() {
    return Object.keys(ELEMENT_DEFINITIONS);
  }

  global.ChemistryBIG = global.ChemistryBIG || {};
  global.ChemistryBIG.ELEMENT_DEFINITIONS = ELEMENT_DEFINITIONS;
  global.ChemistryBIG.ELEMENT_DEFINITIONS_ARRAY = ELEMENT_DEFINITIONS_ARRAY;
  global.ChemistryBIG.createElementInstance = createElementInstance;
  global.ChemistryBIG.getElementDefinition = getElementDefinition;
  global.ChemistryBIG.getAllElements = getAllElements;
})(window);