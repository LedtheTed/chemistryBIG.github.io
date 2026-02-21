/* reactions.js
   Library/registry of possible reactions.
   Use getReaction(a, b) to look up a reaction, or access REACTIONS directly.
*/
(function(global){
  const _norm = s => String(s).trim().toLowerCase();
  function pairKey(a,b){ const aa=_norm(a), bb=_norm(b); return aa<bb?`${aa}|${bb}`:`${bb}|${aa}`; }

  // Reaction definitions (library of all available reactions)
  const REACTION_DEFINITIONS = [
    { reactants: ['H', 'H'], products: ['He'], consumes: true, probability: 0.1, note: 'H + H -> He' },
    { reactants: ['He', 'He'], products: ['Br'], consumes: true, probability: 0.1, note: 'He + He -> Br' },
    { reactants: ['Br', 'H'], products: ['Li'], consumes: true, probability: 0.3, note: 'Br + H -> Li' },
    { reactants: ['Li', 'He'], products: ['B'], consumes: true, probability: 0.1, note: 'Li + He -> B' },
    { reactants: ['Br', 'He'], products: ['C'], consumes: true, probability: 0.01, note: 'Br + He -> C' },
    { reactants: ['C', 'H'], products: ['N'], consumes: true, probability: 0.1, note: 'C + H -> N' },
    { reactants: ['C', 'He'], products: ['O'], consumes: true, probability: 0.05, note: 'C + He -> O' },
    { reactants: ['O', 'H'], products: ['F'], consumes: true, probability: 0.05, note: 'O + H -> F' },
    { reactants: ['O', 'He'], products: ['Ne'], consumes: true, probability: 0.01, note: 'O + He -> Ne' }
  ];

  // Decay reactions (solo element reactions)
  const DECAY_DEFINITIONS = [
    { reactant: 'Br', products: ['He', 'He'], probability: 0.001, note: 'Br -> He + He' }
  ];

  // Build the REACTIONS Map from definitions
  const REACTIONS = new Map();
  REACTION_DEFINITIONS.forEach(def => {
    const key = pairKey(def.reactants[0], def.reactants[1]);
    REACTIONS.set(key, {
      products: def.products.map(p => _norm(p)),
      consumes: def.consumes,
      probability: def.probability,
      note: def.note
    });
  });

  // Build the DECAY_REACTIONS Map from definitions
  const DECAY_REACTIONS = new Map();
  DECAY_DEFINITIONS.forEach(def => {
    DECAY_REACTIONS.set(_norm(def.reactant), {
      products: def.products.map(p => _norm(p)),
      probability: def.probability,
      note: def.note
    });
  });

  function getReaction(a, b) {
    const key = pairKey(a, b);
    const entry = REACTIONS.get(key);
    if (!entry) return null;
    // Return a copy to prevent external mutation
    return { ...entry };
  }

  function getDecayReaction(element) {
    const entry = DECAY_REACTIONS.get(_norm(element));
    if (!entry) return null;
    return { ...entry };
  }

  function getAllReactions() {
    return Array.from(REACTIONS.entries()).map(([key, entry]) => ({ key, ...entry }));
  }

  global.ChemistryBIG = global.ChemistryBIG || {};
  global.ChemistryBIG.REACTIONS = REACTIONS;
  global.ChemistryBIG.REACTION_DEFINITIONS = REACTION_DEFINITIONS;
  global.ChemistryBIG.DECAY_REACTIONS = DECAY_REACTIONS;
  global.ChemistryBIG.DECAY_DEFINITIONS = DECAY_DEFINITIONS;
  global.ChemistryBIG.getReaction = getReaction;
  global.ChemistryBIG.getDecayReaction = getDecayReaction;
  global.ChemistryBIG.getAllReactions = getAllReactions;
})(window);
