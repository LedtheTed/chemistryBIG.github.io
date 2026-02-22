/* reactions.js
   Library/registry of possible reactions.
   Use getReaction(a, b) to look up a reaction, or access REACTIONS directly.
*/
(function (global) {
  const _norm = (s) => String(s).trim().toLowerCase();
  function pairKey(a, b) {
    const aa = _norm(a),
      bb = _norm(b);
    return aa < bb ? `${aa}|${bb}` : `${bb}|${aa}`;
  }

  // Reaction definitions (library of all available reactions)
  const REACTION_DEFINITIONS = [

    // ============================================================
    // ======================= PERIOD 1 ============================
    // H
    // ============================================================
    { reactants: ['H', 'H'], products: ['He'], consumes: true, probability: 0.10, note: 'H + H -> He' },
    // ============================================================
    // ======================= PERIOD 2 ============================
    // He Li Be B C N O F Ne
    // ============================================================
    { reactants: ['He', 'He'], products: ['Be'], consumes: true, probability: 0.10, note: 'He + He -> Be' },
    { reactants: ['He', 'H'], products: ['Li'], consumes: true, probability: 0.01, note: 'He + H -> Li (+1 proton)' },
    { reactants: ['Be', 'H'], products: ['Li'], consumes: true, probability: 0.05, note: 'Be + H -> Li' },
    { reactants: ['He', 'Be'], products: ['Li'], consumes: true, probability: 0.02, note: 'He + Be -> Li (alt)' },
    { reactants: ['Li', 'He'], products: ['B'], consumes: true, probability: 0.01, note: 'Li + He -> B' },
    { reactants: ['Be', 'He'], products: ['C'], consumes: true, probability: 0.09, note: 'Be + He -> C' },
    { reactants: ['C', 'He'], products: ['O'], consumes: true, probability: 0.20, note: 'C + He -> O' },
    { reactants: ['C', 'C'], products: ['Ne'], consumes: true, probability: 0.01, note: 'C + C -> Ne (alt)' },
    { reactants: ['O', 'H'], products: ['F'], consumes: true, probability: 0.05, note: 'O + H -> F' },
    { reactants: ['F', 'H'], products: ['Ne'], consumes: true, probability: 0.05, note: 'F + H -> Ne' },
    { reactants: ['O', 'O'], products: ['Ne'], consumes: true, probability: 0.01, note: 'O + O -> Ne' },

    // Generic ladder for period 2
    { reactants: ['Li','H'], products:['Be'], consumes:true, probability:0.01, note:'Li + H -> Be (+1 proton)' },
    { reactants: ['Be','H'], products:['B'], consumes:true, probability:0.01, note:'Be + H -> B (+1 proton)' },
    { reactants: ['B','H'], products:['C'], consumes:true, probability:0.01, note:'B + H -> C (+1 proton)' },
    { reactants: ['C','H'], products:['N'], consumes:true, probability:0.01, note:'C + H -> N (+1 proton)' },
    { reactants: ['N','H'], products:['O'], consumes:true, probability:0.01, note:'N + H -> O (+1 proton)' },
    { reactants: ['Ne','H'], products:['Na'], consumes:true, probability:0.01, note:'Ne + H -> Na (+1 proton)' },

    // ============================================================
    // ======================= PERIOD 3 ============================
    // Na Mg Al Si P S Cl Ar
    // ============================================================
    { reactants: ['Na','Na'], products:['Mg'], consumes:true, probability:0.15, note:'Na + Na -> Mg' },
    { reactants: ['Mg','O'], products:['Si'], consumes:true, probability:0.06, note:'Mg + O -> Si' },
    { reactants: ['Mg','He'], products:['Al'], consumes:true, probability:0.05, note:'Mg + He -> Al' },
    { reactants: ['Si','He'], products:['P'], consumes:true, probability:0.12, note:'Si + He -> P' },
    { reactants: ['Si','O'], products:['S'], consumes:true, probability:0.10, note:'Si + O -> S' },
    { reactants: ['S','O'], products:['Cl'], consumes:true, probability:0.08, note:'S + O -> Cl' },
    { reactants: ['Cl','He'], products:['Ar'], consumes:true, probability:0.08, note:'Cl + He -> Ar' },
    { reactants: ['S','He'], products:['Ar'], consumes:true, probability:0.10, note:'S + He -> Ar' },

    // Generic ladder
    { reactants:['Na','H'], products:['Mg'], consumes:true, probability:0.01, note:'Na + H -> Mg' },
    { reactants:['Mg','H'], products:['Al'], consumes:true, probability:0.01, note:'Mg + H -> Al' },
    { reactants:['Al','H'], products:['Si'], consumes:true, probability:0.01, note:'Al + H -> Si' },
    { reactants:['Si','H'], products:['P'], consumes:true, probability:0.01, note:'Si + H -> P' },
    { reactants:['P','H'], products:['S'], consumes:true, probability:0.01, note:'P + H -> S' },
    { reactants:['S','H'], products:['Cl'], consumes:true, probability:0.01, note:'S + H -> Cl' },
    { reactants:['Cl','H'], products:['Ar'], consumes:true, probability:0.01, note:'Cl + H -> Ar' },
    { reactants:['Ar','H'], products:['K'], consumes:true, probability:0.01, note:'Ar + H -> K' },

    // ============================================================
    // ======================= PERIOD 4 ============================
    // K Ca ... Kr
    // ============================================================

    { reactants:['K','K'], products:['Ca'], consumes:true, probability:0.15, note:'K + K -> Ca' },
    { reactants:['Ca','O'], products:['Sc'], consumes:true, probability:0.08, note:'Ca + O -> Sc' },
    { reactants:['Sc','He'], products:['Ti'], consumes:true, probability:0.08, note:'Sc + He -> Ti' },
    { reactants:['Ti','O'], products:['V'], consumes:true, probability:0.07, note:'Ti + O -> V' },
    { reactants:['V','He'], products:['Cr'], consumes:true, probability:0.07, note:'V + He -> Cr' },
    { reactants:['Cr','O'], products:['Mn'], consumes:true, probability:0.06, note:'Cr + O -> Mn' },
    { reactants:['Mn','He'], products:['Fe'], consumes:true, probability:0.06, note:'Mn + He -> Fe' },
    { reactants:['Fe','He'], products:['Ni'], consumes:true, probability:0.04, note:'Fe + He -> Ni' },
    { reactants:['Ni','O'], products:['Cu'], consumes:true, probability:0.04, note:'Ni + O -> Cu' },
    { reactants:['Cu','He'], products:['Zn'], consumes:true, probability:0.04, note:'Cu + He -> Zn' },
    { reactants:['Zn','He'], products:['Ge'], consumes:true, probability:0.03, note:'Zn + He -> Ge' },
    { reactants:['Ge','O'], products:['Se'], consumes:true, probability:0.03, note:'Ge + O -> Se' },
    { reactants:['Se','He'], products:['Kr'], consumes:true, probability:0.015, note:'Se + He -> Kr' },
    { reactants:['Br','Br'], products:['Kr'], consumes:true, probability:0.01, note:'Br + Br -> Kr' },
    { reactants:['Kr','H'], products:['Rb'], consumes:true, probability:0.01, note:'Kr + H -> Rb' },

    // ============================================================
    // ======================= PERIOD 5 ============================
    // Rb Sr ... Xe
    // ============================================================

    { reactants:['Rb','Rb'], products:['Sr'], consumes:true, probability:0.12, note:'Rb + Rb -> Sr' },
    { reactants:['Sr','O'], products:['Y'], consumes:true, probability:0.06, note:'Sr + O -> Y' },
    { reactants:['Y','He'], products:['Zr'], consumes:true, probability:0.06, note:'Y + He -> Zr' },
    { reactants:['Zr','O'], products:['Nb'], consumes:true, probability:0.055, note:'Zr + O -> Nb' },
    { reactants:['Nb','He'], products:['Mo'], consumes:true, probability:0.05, note:'Nb + He -> Mo' },
    { reactants:['Mo','Mo'], products:['Ru'], consumes:true, probability:0.015, note:'Mo + Mo -> Ru' },
    { reactants:['Ru','He'], products:['Pd'], consumes:true, probability:0.04, note:'Ru + He -> Pd' },
    { reactants:['Pd','O'], products:['Ag'], consumes:true, probability:0.035, note:'Pd + O -> Ag' },
    { reactants:['Ag','He'], products:['Cd'], consumes:true, probability:0.032, note:'Ag + He -> Cd' },
    { reactants:['Cd','O'], products:['Sn'], consumes:true, probability:0.028, note:'Cd + O -> Sn' },
    { reactants:['Sn','He'], products:['Te'], consumes:true, probability:0.024, note:'Sn + He -> Te' },
    { reactants:['Te','He'], products:['Xe'], consumes:true, probability:0.012, note:'Te + He -> Xe' },
    { reactants:['I','I'], products:['Xe'], consumes:true, probability:0.008, note:'I + I -> Xe' },

    { reactants:['Xe','H'], products:['Cs'], consumes:true, probability:0.01, note:'Xe + H -> Cs' },

    // ============================================================
    // ======================= PERIOD 6 ============================
    // Cs Ba ... Rn
    // ============================================================

    { reactants:['Cs','Cs'], products:['Ba'], consumes:true, probability:0.10, note:'Cs + Cs -> Ba' },
    { reactants:['Ba','He'], products:['La'], consumes:true, probability:0.04, note:'Ba + He -> La' },
    { reactants:['La','He'], products:['Pr'], consumes:true, probability:0.03, note:'La + He -> Pr' },
    { reactants:['Pr','O'], products:['Nd'], consumes:true, probability:0.028, note:'Pr + O -> Nd' },
    { reactants:['Nd','He'], products:['Sm'], consumes:true, probability:0.02, note:'Nd + He -> Sm' },
    { reactants:['Sm','He'], products:['Gd'], consumes:true, probability:0.018, note:'Sm + He -> Gd' },
    { reactants:['Gd','O'], products:['Dy'], consumes:true, probability:0.016, note:'Gd + O -> Dy' },
    { reactants:['Dy','He'], products:['Yb'], consumes:true, probability:0.014, note:'Dy + He -> Yb' },
    { reactants:['Yb','He'], products:['Hf'], consumes:true, probability:0.012, note:'Yb + He -> Hf' },
    { reactants:['Hf','He'], products:['W'], consumes:true, probability:0.01, note:'Hf + He -> W' },
    { reactants:['W','O'], products:['Os'], consumes:true, probability:0.009, note:'W + O -> Os' },
    { reactants:['Os','He'], products:['Pt'], consumes:true, probability:0.008, note:'Os + He -> Pt' },
    { reactants:['Pt','O'], products:['Hg'], consumes:true, probability:0.007, note:'Pt + O -> Hg' },
    { reactants:['Hg','He'], products:['Pb'], consumes:true, probability:0.006, note:'Hg + He -> Pb' },
    { reactants:['Pb','O'], products:['Bi'], consumes:true, probability:0.006, note:'Pb + O -> Bi' },
    { reactants:['Bi','He'], products:['Po'], consumes:true, probability:0.005, note:'Bi + He -> Po' },
    { reactants:['Po','He'], products:['Rn'], consumes:true, probability:0.006, note:'Po + He -> Rn' },
    { reactants:['Ra','He'], products:['Rn'], consumes:true, probability:0.012, note:'Ra -> Rn (decay shortcut)' },

    // ============================================================
    // ================ (Lanthanides) 58–71 =======================
    // Ce(58) Pr(59) Nd(60) Pm(61) Sm(62) Eu(63) Gd(64)
    // Tb(65) Dy(66) Ho(67) Er(68) Tm(69) Yb(70) Lu(71)
    //
    // Goal: give a clean “lanthanide ladder” that isn’t just +H,
    // uses your existing building blocks (He, O), and still allows
    // a generic +H fallback for each step.
    // ============================================================

    // --- Start: you already jump La -> Pr, but add missing La -> Ce and Ce -> Pr
    { reactants:['La','O'],  products:['Ce'], consumes:true, probability:0.020, note:'La + O -> Ce (lanthanide entry)' },
    { reactants:['Ce','He'], products:['Pr'], consumes:true, probability:0.018, note:'Ce + He -> Pr (alpha-ish)' },

    // --- Main ladder (alternate O and He to feel less repetitive)
    { reactants:['Pr','He'], products:['Nd'], consumes:true, probability:0.018, note:'Pr + He -> Nd' },
    { reactants:['Nd','O'],  products:['Pm'], consumes:true, probability:0.010, note:'Nd + O -> Pm (rare/unstable-ish)' },
    { reactants:['Pm','He'], products:['Sm'], consumes:true, probability:0.016, note:'Pm + He -> Sm' },
    { reactants:['Sm','O'],  products:['Eu'], consumes:true, probability:0.015, note:'Sm + O -> Eu' },
    { reactants:['Eu','He'], products:['Gd'], consumes:true, probability:0.014, note:'Eu + He -> Gd' },
    { reactants:['Gd','He'], products:['Tb'], consumes:true, probability:0.013, note:'Gd + He -> Tb' },
    { reactants:['Tb','O'],  products:['Dy'], consumes:true, probability:0.013, note:'Tb + O -> Dy' },
    { reactants:['Dy','He'], products:['Ho'], consumes:true, probability:0.012, note:'Dy + He -> Ho' },
    { reactants:['Ho','O'],  products:['Er'], consumes:true, probability:0.012, note:'Ho + O -> Er' },
    { reactants:['Er','He'], products:['Tm'], consumes:true, probability:0.011, note:'Er + He -> Tm' },
    { reactants:['Tm','O'],  products:['Yb'], consumes:true, probability:0.011, note:'Tm + O -> Yb' },
    { reactants:['Yb','He'], products:['Lu'], consumes:true, probability:0.010, note:'Yb + He -> Lu (lanthanide capstone)' },

    // --- Optional “fast lane” skips (nice if the chain feels too long)
    { reactants:['Ce','Ce'], products:['Nd'], consumes:true, probability:0.006, note:'Ce + Ce -> Nd (compressed fusion alt)' },
    { reactants:['Gd','Gd'], products:['Er'], consumes:true, probability:0.004, note:'Gd + Gd -> Er (compressed fusion alt)' },

    // --- Generic +H ladder (fallback, keep low so it doesn’t override your curated ones)
    { reactants:['La','H'], products:['Ce'], consumes:true, probability:0.006, note:'La + H -> Ce (+1 proton fallback)' },
    { reactants:['Ce','H'], products:['Pr'], consumes:true, probability:0.006, note:'Ce + H -> Pr (+1 proton fallback)' },
    { reactants:['Pr','H'], products:['Nd'], consumes:true, probability:0.006, note:'Pr + H -> Nd (+1 proton fallback)' },
    { reactants:['Nd','H'], products:['Pm'], consumes:true, probability:0.006, note:'Nd + H -> Pm (+1 proton fallback)' },
    { reactants:['Pm','H'], products:['Sm'], consumes:true, probability:0.006, note:'Pm + H -> Sm (+1 proton fallback)' },
    { reactants:['Sm','H'], products:['Eu'], consumes:true, probability:0.006, note:'Sm + H -> Eu (+1 proton fallback)' },
    { reactants:['Eu','H'], products:['Gd'], consumes:true, probability:0.006, note:'Eu + H -> Gd (+1 proton fallback)' },
    { reactants:['Gd','H'], products:['Tb'], consumes:true, probability:0.006, note:'Gd + H -> Tb (+1 proton fallback)' },
    { reactants:['Tb','H'], products:['Dy'], consumes:true, probability:0.006, note:'Tb + H -> Dy (+1 proton fallback)' },
    { reactants:['Dy','H'], products:['Ho'], consumes:true, probability:0.006, note:'Dy + H -> Ho (+1 proton fallback)' },
    { reactants:['Ho','H'], products:['Er'], consumes:true, probability:0.006, note:'Ho + H -> Er (+1 proton fallback)' },
    { reactants:['Er','H'], products:['Tm'], consumes:true, probability:0.006, note:'Er + H -> Tm (+1 proton fallback)' },
    { reactants:['Tm','H'], products:['Yb'], consumes:true, probability:0.006, note:'Tm + H -> Yb (+1 proton fallback)' },
    { reactants:['Yb','H'], products:['Lu'], consumes:true, probability:0.006, note:'Yb + H -> Lu (+1 proton fallback)' },

    // ============================================================
    // ===================== PERIOD 7: 87–92 ======================
    // Fr(87) Ra(88) Ac(89) Th(90) Pa(91) U(92)
    // ============================================================
    // ============================================================

    // Bridge: end of period 6 noble gas -> start of period 7 alkali
    { reactants:['Rn','H'], products:['Fr'], consumes:true, probability:0.006, note:'Rn + H -> Fr (enter period 7)' },

    // Actinide ladder (curated routes)
    { reactants:['Ra','O'],  products:['Ac'], consumes:true, probability:0.010, note:'Ra + O -> Ac (actinide entry)' },
    { reactants:['Ac','He'], products:['Th'], consumes:true, probability:0.009,  note:'Ac + He -> Th (alpha-ish)' },
    { reactants:['Th','O'],  products:['Pa'], consumes:true, probability:0.008,  note:'Th + O -> Pa' },
    { reactants:['Pa','He'], products:['U'],  consumes:true, probability:0.007,  note:'Pa + He -> U (end of this section)' },

    // Optional “fast lane” (gamey but satisfying)
    { reactants:['Ra','He'], products:['Th'], consumes:true, probability:0.004, note:'Ra + He -> Th (compressed alt)' },

    // Generic +H ladder fallback (keep low so curated routes usually win)
    { reactants:['Ra','H'], products:['Ac'], consumes:true, probability:0.004, note:'Ra + H -> Ac (+1 proton fallback)' },
    { reactants:['Ac','H'], products:['Th'], consumes:true, probability:0.004, note:'Ac + H -> Th (+1 proton fallback)' },
    { reactants:['Th','H'], products:['Pa'], consumes:true, probability:0.004, note:'Th + H -> Pa (+1 proton fallback)' },
    { reactants:['Pa','H'], products:['U'],  consumes:true, probability:0.004, note:'Pa + H -> U (+1 proton fallback)' },


    ];

  // Decay reactions (solo element reactions)

    const DECAY_DEFINITIONS = [
        
        { reactant: 'Be', products: ['He', 'He'], probability: 0.0001, note: 'Be -> He + He' },
        { reactant: 'Cl', products: ['S', 'H'],   probability: 0.0001, note: 'Cl -> S + H' },
        { reactant: 'Al', products: ['Mg', 'Mg'], probability: 0.0010, note: 'Al -> Mg + Mg' },
        { reactant: 'B',  products: ['Li', 'He'], probability: 0.0010, note: 'B -> Li + He' },
        { reactant: 'Li', products: ['He', 'H'],  probability: 0.0002, note: 'Li -> He + H (light decay)' },
        { reactant: 'F',  products: ['O', 'H'],   probability: 0.00015, note: 'F -> O + H (beta-ish)' },
        { reactant: 'P',  products: ['Si', 'H'],  probability: 0.00010, note: 'P -> Si + H (beta-ish)' },
        { reactant: 'Tc', products: ['Mo', 'H'],  probability: 0.0020, note: 'Tc -> Mo + H (beta decay-ish)' },
        { reactant: 'Tc', products: ['Ru', 'H'],  probability: 0.0010, note: 'Tc -> Ru + H (alt beta-ish)' },
        { reactant: 'Pm', products: ['Nd', 'H'],  probability: 0.0015, note: 'Pm -> Nd + H (unstable lanthanide)' },
        { reactant: 'Po', products: ['Pb', 'He'], probability: 0.0040, note: 'Po -> Pb + He (alpha decay vibe)' },
        { reactant: 'At', products: ['Bi', 'He'], probability: 0.0030, note: 'At -> Bi + He (alpha decay vibe)' },
        { reactant: 'Rn', products: ['Po', 'He'], probability: 0.0025, note: 'Rn -> Po + He (alpha decay vibe)' },
        { reactant: 'Fr', products: ['Rn', 'H'],  probability: 0.0060, note: 'Fr -> Rn + H (short-lived alkali)' },
        { reactant: 'Ra', products: ['Rn', 'He'], probability: 0.0035, note: 'Ra -> Rn + He (alpha decay vibe)' },
        { reactant: 'Ac', products: ['Ra', 'H'],  probability: 0.0020, note: 'Ac -> Ra + H (beta-ish)' },
        { reactant: 'Th', products: ['Ra', 'He'], probability: 0.0015, note: 'Th -> Ra + He (alpha vibe)' },
        { reactant: 'Pa', products: ['Th', 'H'],  probability: 0.0025, note: 'Pa -> Th + H (beta-ish)' },
        { reactant: 'U',  products: ['Th', 'He'], probability: 0.0012, note: 'U -> Th + He (alpha vibe)' },
        { reactant: 'U',  products: ['Kr', 'Xe'], probability: 0.00005, note: 'U -> Kr + Xe (rare fission-lite)' },
        { reactant: 'U',  products: ['Ba', 'Kr'], probability: 0.00003, note: 'U -> Ba + Kr (rare fission-lite)' },
    ];


  // Build the REACTIONS Map from definitions
  const REACTIONS = new Map();
  REACTION_DEFINITIONS.forEach((def) => {
    const key = pairKey(def.reactants[0], def.reactants[1]);
    REACTIONS.set(key, {
      products: def.products.map((p) => _norm(p)),
      consumes: def.consumes,
      probability: def.probability,
      note: def.note,
    });
  });

  // Build the DECAY_REACTIONS Map from definitions
  const DECAY_REACTIONS = new Map();
  DECAY_DEFINITIONS.forEach((def) => {
    DECAY_REACTIONS.set(_norm(def.reactant), {
      products: def.products.map((p) => _norm(p)),
      probability: def.probability,
      note: def.note,
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
    return Array.from(REACTIONS.entries()).map(([key, entry]) => ({
      key,
      ...entry,
    }));
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
