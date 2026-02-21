(function(global){
  // elements_init.js
  // Container/registry of all periodic table elements (1-99).
  // Use createElementInstance(name, x, y) to spawn copies as needed.
  // Sizes are atomic radius in pm / 10.
  // Expects `window.ChemistryBIG.ElementBase` to exist.

  // Element definitions library (all 99 elements with atomic radii / 10 as size)
  const ELEMENT_DEFINITIONS_ARRAY = [
    { name: 'H', color: '#7dd3fc', size: 12.0, speed: 1 },
    { name: 'He', color: '#f472b6', size: 14.0, speed: 0.9 },
    { name: 'Li', color: '#fb923c', size: 18.2, speed: 0.8 },
    { name: 'Be', color: '#9ca3af', size: 15.3, speed: 0.75 },
    { name: 'B', color: '#86efac', size: 19.2, speed: 0.85 },
    { name: 'C', color: '#d1d5db', size: 17.0, speed: 0.9 },
    { name: 'N', color: '#60a5fa', size: 15.5, speed: 0.8 },
    { name: 'O', color: '#3b82f6', size: 15.2, speed: 0.8 },
    { name: 'F', color: '#fcd34d', size: 13.5, speed: 1.0 },
    { name: 'Ne', color: '#c084fc', size: 15.4, speed: 0.7 },
    { name: 'Na', color: '#fca5a5', size: 22.7, speed: 0.6 },
    { name: 'Mg', color: '#e0e7ff', size: 17.3, speed: 0.75 },
    { name: 'Al', color: '#cbd5e1', size: 18.4, speed: 0.7 },
    { name: 'Si', color: '#a1a5b4', size: 21.0, speed: 0.65 },
    { name: 'P', color: '#ca8a04', size: 18.0, speed: 0.7 },
    { name: 'S', color: '#eab308', size: 18.0, speed: 0.75 },
    { name: 'Cl', color: '#86efac', size: 17.5, speed: 0.8 },
    { name: 'Ar', color: '#c4b5fd', size: 18.8, speed: 0.65 },
    { name: 'K', color: '#fda4af', size: 27.5, speed: 0.5 },
    { name: 'Ca', color: '#fed7aa', size: 23.1, speed: 0.6 },
    { name: 'Sc', color: '#bfdbfe', size: 21.1, speed: 0.7 },
    { name: 'Ti', color: '#99f6e4', size: 18.7, speed: 0.75 },
    { name: 'V', color: '#a78bfa', size: 17.9, speed: 0.8 },
    { name: 'Cr', color: '#7dd3fc', size: 18.9, speed: 0.85 },
    { name: 'Mn', color: '#60a5fa', size: 19.7, speed: 0.85 },
    { name: 'Fe', color: '#f87171', size: 19.4, speed: 0.9 },
    { name: 'Co', color: '#fb7185', size: 19.2, speed: 0.9 },
    { name: 'Ni', color: '#fbbf24', size: 16.3, speed: 0.9 },
    { name: 'Cu', color: '#f59e0b', size: 14.0, speed: 0.8 },
    { name: 'Zn', color: '#d1d5db', size: 13.9, speed: 0.75 },
    { name: 'Ga', color: '#cbd5e1', size: 18.7, speed: 0.7 },
    { name: 'Ge', color: '#a1a5b4', size: 21.1, speed: 0.75 },
    { name: 'As', color: '#9ca3af', size: 18.5, speed: 0.8 },
    { name: 'Se', color: '#d97706', size: 19.0, speed: 0.8 },
    { name: 'Br', color: '#dc2626', size: 18.3, speed: 0.9 },
    { name: 'Kr', color: '#7c3aed', size: 20.2, speed: 0.65 },
    { name: 'Rb', color: '#fca5a5', size: 30.3, speed: 0.45 },
    { name: 'Sr', color: '#fed7aa', size: 24.9, speed: 0.55 },
    { name: 'Y', color: '#bfdbfe', size: 21.9, speed: 0.7 },
    { name: 'Zr', color: '#99f6e4', size: 18.6, speed: 0.75 },
    { name: 'Nb', color: '#a78bfa', size: 20.7, speed: 0.8 },
    { name: 'Mo', color: '#7dd3fc', size: 20.9, speed: 0.8 },
    { name: 'Tc', color: '#60a5fa', size: 20.9, speed: 0.85 },
    { name: 'Ru', color: '#f87171', size: 20.7, speed: 0.85 },
    { name: 'Rh', color: '#fb7185', size: 19.5, speed: 0.85 },
    { name: 'Pd', color: '#fbbf24', size: 20.2, speed: 0.85 },
    { name: 'Ag', color: '#e5e7eb', size: 17.2, speed: 0.8 },
    { name: 'Cd', color: '#d1d5db', size: 15.8, speed: 0.75 },
    { name: 'In', color: '#cbd5e1', size: 19.3, speed: 0.65 },
    { name: 'Sn', color: '#a1a5b4', size: 21.7, speed: 0.7 },
    { name: 'Sb', color: '#9ca3af', size: 20.6, speed: 0.75 },
    { name: 'Te', color: '#6b7280', size: 20.6, speed: 0.75 },
    { name: 'I', color: '#4338ca', size: 19.8, speed: 0.85 },
    { name: 'Xe', color: '#7c3aed', size: 21.6, speed: 0.6 },
    { name: 'Cs', color: '#fca5a5', size: 34.3, speed: 0.4 },
    { name: 'Ba', color: '#fed7aa', size: 26.8, speed: 0.5 },
    { name: 'La', color: '#93c5fd', size: 24.0, speed: 0.65 },
    { name: 'Ce', color: '#dbeafe', size: 23.5, speed: 0.65 },
    { name: 'Pr', color: '#bfdbfe', size: 23.9, speed: 0.65 },
    { name: 'Nd', color: '#7dd3fc', size: 22.9, speed: 0.65 },
    { name: 'Pm', color: '#06b6d4', size: 23.6, speed: 0.65 },
    { name: 'Sm', color: '#06d6a6', size: 22.9, speed: 0.65 },
    { name: 'Eu', color: '#34d399', size: 23.3, speed: 0.6 },
    { name: 'Gd', color: '#10b981', size: 23.7, speed: 0.65 },
    { name: 'Tb', color: '#059669', size: 22.1, speed: 0.65 },
    { name: 'Dy', color: '#047857', size: 22.9, speed: 0.65 },
    { name: 'Ho', color: '#065f46', size: 21.6, speed: 0.65 },
    { name: 'Er', color: '#a78bfa', size: 23.5, speed: 0.65 },
    { name: 'Tm', color: '#7c3aed', size: 22.7, speed: 0.65 },
    { name: 'Yb', color: '#6366f1', size: 24.2, speed: 0.6 },
    { name: 'Lu', color: '#4f46e5', size: 22.1, speed: 0.65 },
    { name: 'Hf', color: '#4338ca', size: 21.2, speed: 0.7 },
    { name: 'Ta', color: '#3730a3', size: 21.7, speed: 0.75 },
    { name: 'W', color: '#312e81', size: 21.0, speed: 0.8 },
    { name: 'Re', color: '#1f2937', size: 21.7, speed: 0.8 },
    { name: 'Os', color: '#111827', size: 21.6, speed: 0.85 },
    { name: 'Ir', color: '#0f172a', size: 20.2, speed: 0.85 },
    { name: 'Pt', color: '#e5e7eb', size: 20.9, speed: 0.8 },
    { name: 'Au', color: '#fbbf24', size: 16.6, speed: 0.75 },
    { name: 'Hg', color: '#d1d5db', size: 20.9, speed: 0.7 },
    { name: 'Tl', color: '#cbd5e1', size: 19.6, speed: 0.65 },
    { name: 'Pb', color: '#a1a5b4', size: 20.2, speed: 0.6 },
    { name: 'Bi', color: '#9ca3af', size: 20.7, speed: 0.55 },
    { name: 'Po', color: '#6b7280', size: 19.7, speed: 0.6 },
    { name: 'At', color: '#4b5563', size: 20.2, speed: 0.7 },
    { name: 'Rn', color: '#7c3aed', size: 22.0, speed: 0.55 },
    { name: 'Fr', color: '#fca5a5', size: 34.8, speed: 0.3 },
    { name: 'Ra', color: '#fed7aa', size: 28.3, speed: 0.45 },
    { name: 'Ac', color: '#dbeafe', size: 26.0, speed: 0.6 },
    { name: 'Th', color: '#bfdbfe', size: 23.7, speed: 0.65 },
    { name: 'Pa', color: '#7dd3fc', size: 24.3, speed: 0.7 },
    { name: 'U', color: '#06b6d4', size: 24.0, speed: 0.75 },
    { name: 'Np', color: '#06d6a6', size: 22.1, speed: 0.8 },
    { name: 'Pu', color: '#34d399', size: 24.3, speed: 0.8 },
    { name: 'Am', color: '#10b981', size: 24.4, speed: 0.8 },
    { name: 'Cm', color: '#059669', size: 24.5, speed: 0.85 },
    { name: 'Bk', color: '#047857', size: 24.4, speed: 0.85 },
    { name: 'Cf', color: '#065f46', size: 24.5, speed: 0.85 },
    { name: 'Es', color: '#a78bfa', size: 24.5, speed: 0.85 }
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