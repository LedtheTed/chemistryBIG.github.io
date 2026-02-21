/* reactions.js
   Library/registry of possible reactions.
   Use getReaction(a, b) to look up a reaction, or access REACTIONS directly.
*/
(function(global){
  const _norm = s => String(s).trim().toLowerCase();
  function pairKey(a,b){ const aa=_norm(a), bb=_norm(b); return aa<bb?`${aa}|${bb}`:`${bb}|${aa}`; }

  // Reaction definitions (library of all available reactions)
  const REACTION_DEFINITIONS = [
    { reactants: ['H', 'H'], products: ['He'], consumes: true, probability: 0.5, note: 'H + H -> He' },
    { reactants: ['He', 'He'], products: ['Br'], consumes: true, probability: 0.5, note: 'He + He -> Br' },
    { reactants: ['Br', 'H'], products: ['Li'], consumes: true, probability: 0.5, note: 'Br + H -> Li' },
    { reactants: ['Li', 'He'], products: ['B'], consumes: true, probability: 0.5, note: 'Li + He -> B' },
    { reactants: ['Br', 'He'], products: ['C'], consumes: true, probability: 0.5, note: 'Br + He -> C' },
    { reactants: ['C', 'H'], products: ['N'], consumes: true, probability: 0.5, note: 'C + H -> N' },
    { reactants: ['C', 'He'], products: ['O'], consumes: true, probability: 0.5, note: 'C + He -> O' },
    { reactants: ['O', 'H'], products: ['F'], consumes: true, probability: 0.5, note: 'O + H -> F' },
    { reactants: ['O', 'He'], products: ['Ne'], consumes: true, probability: 0.5, note: 'O + He -> Ne' }
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

  function getReaction(a, b) {
    const key = pairKey(a, b);
    const entry = REACTIONS.get(key);
    if (!entry) return null;
    // Return a copy to prevent external mutation
    return { ...entry };
  }

  function getAllReactions() {
    return Array.from(REACTIONS.entries()).map(([key, entry]) => ({ key, ...entry }));
  }

  global.ChemistryBIG = global.ChemistryBIG || {};
  global.ChemistryBIG.REACTIONS = REACTIONS;
  global.ChemistryBIG.REACTION_DEFINITIONS = REACTION_DEFINITIONS;
  global.ChemistryBIG.getReaction = getReaction;
  global.ChemistryBIG.getAllReactions = getAllReactions;
})(window);
