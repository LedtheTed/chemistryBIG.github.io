// =========================
// AUTO COLLECTION (Lv 1) FOR EVERY ELEMENT IN YOUR GAME
// Rule: costs exactly 1 of that element (so once you make 1, you can always buy it)
// Effect: auto-generate that element at 2 / sec
// Ordered by atomic number so purchase order is always “reachable” as you discover elements.
// =========================
export const UPGRADES = [
  // --- Period 1 ---
  { id:"auto_h_1_basic",  name:"Hydrogen Harvester",  desc:"Auto-generate Hydrogen (1.6/sec).",  cost:{ H:1 },                     effect:{ type:"auto_element", element:"H",  rate:1.0 } },
  { id:"hydrogen_click_1_basic", name:"Hydrogen Excitation", desc:"On click, +12% chance to create Hydrogen.", cost:{ H:8 },        effect:{ type:"hydrogen_click_chance_add", add:0.12 } },

  { id:"auto_he_1_basic", name:"Helium Harvester",    desc:"Auto-generate Helium (1.1/sec).",    cost:{ H:20, He:1 },             effect:{ type:"auto_element", element:"He", rate:1.1 } },

  // --- Period 2 ---
  { id:"auto_li_1_basic", name:"Lithium Harvester",   desc:"Auto-generate Lithium (0.95/sec).",  cost:{ He:8, Li:1 },             effect:{ type:"auto_element", element:"Li", rate:0.95 } },
  { id:"auto_be_1_basic", name:"Beryllium Harvester", desc:"Auto-generate Beryllium (0.85/sec).",cost:{ He:10, Li:6, Be:1 },      effect:{ type:"auto_element", element:"Be", rate:0.85 } },
  { id:"auto_b_1_basic",  name:"Boron Harvester",     desc:"Auto-generate Boron (0.80/sec).",    cost:{ He:10, Be:5, B:1 },       effect:{ type:"auto_element", element:"B",  rate:0.80 } },
  { id:"auto_c_1_basic",  name:"Carbon Harvester",    desc:"Auto-generate Carbon (0.78/sec).",   cost:{ He:12, B:6, C:1 },        effect:{ type:"auto_element", element:"C",  rate:0.78 } },
  { id:"auto_n_1_basic",  name:"Nitrogen Harvester",  desc:"Auto-generate Nitrogen (0.74/sec).", cost:{ He:12, C:6, N:1 },        effect:{ type:"auto_element", element:"N",  rate:0.74 } },
  { id:"auto_o_1_basic",  name:"Oxygen Harvester",    desc:"Auto-generate Oxygen (0.72/sec).",   cost:{ He:14, N:6, O:1 },        effect:{ type:"auto_element", element:"O",  rate:0.72 } },
  { id:"auto_f_1_basic",  name:"Fluorine Harvester",  desc:"Auto-generate Fluorine (0.68/sec).", cost:{ He:14, O:6, F:1 },        effect:{ type:"auto_element", element:"F",  rate:0.68 } },
  { id:"auto_ne_1_basic", name:"Neon Harvester",      desc:"Auto-generate Neon (0.62/sec).",     cost:{ He:16, F:6, Ne:1 },       effect:{ type:"auto_element", element:"Ne", rate:0.62 } },

  // --- Period 3 ---
  { id:"auto_na_1_basic", name:"Sodium Harvester",    desc:"Auto-generate Sodium (0.90/sec).",   cost:{ Ne:2, Na:1, H:25 },       effect:{ type:"auto_element", element:"Na", rate:0.90 } },
  // click_1_basic must be bought with the noble gas before it (Na <- Ne)
  { id:"sodium_click_1_basic", name:"Salt Surge", desc:"On click, +7% chance to create Sodium.", cost:{ Ne:3, Na:4 },             effect:{ type:"sodium_click_chance_add", add:0.07 } },

  { id:"auto_mg_1_basic", name:"Magnesium Harvester", desc:"Auto-generate Magnesium (0.86/sec).",cost:{ Ne:3, Na:8, Mg:1 },        effect:{ type:"auto_element", element:"Mg", rate:0.86 } },
  { id:"auto_al_1_basic", name:"Aluminum Harvester",  desc:"Auto-generate Aluminum (0.84/sec).", cost:{ Ne:3, Mg:7, Al:1 },        effect:{ type:"auto_element", element:"Al", rate:0.84 } },
  { id:"auto_si_1_basic", name:"Silicon Harvester",   desc:"Auto-generate Silicon (0.82/sec).",  cost:{ Ne:4, Al:7, Si:1 },        effect:{ type:"auto_element", element:"Si", rate:0.82 } },
  { id:"auto_p_1_basic",  name:"Phosphorus Harvester",desc:"Auto-generate Phosphorus (0.78/sec).",cost:{ Ne:4, Si:7, P:1 },        effect:{ type:"auto_element", element:"P",  rate:0.78 } },
  { id:"auto_s_1_basic",  name:"Sulfur Harvester",    desc:"Auto-generate Sulfur (0.76/sec).",   cost:{ Ne:4, P:7, S:1 },          effect:{ type:"auto_element", element:"S",  rate:0.76 } },
  { id:"auto_cl_1_basic", name:"Chlorine Harvester",  desc:"Auto-generate Chlorine (0.74/sec).", cost:{ Ne:5, S:7, Cl:1 },         effect:{ type:"auto_element", element:"Cl", rate:0.74 } },
  { id:"auto_ar_1_basic", name:"Argon Harvester",     desc:"Auto-generate Argon (0.68/sec).",    cost:{ Ne:5, Cl:7, Ar:1 },        effect:{ type:"auto_element", element:"Ar", rate:0.68 } },

  // --- Period 4 (start) ---
  { id:"auto_k_1_basic",  name:"Potassium Harvester", desc:"Auto-generate Potassium (0.92/sec).",cost:{ Ar:2, K:1, Na:12 },        effect:{ type:"auto_element", element:"K",  rate:0.92 } },
  // K <- Ar
  { id:"potassium_click_1_basic", name:"Potassium Excitation", desc:"On click, +9% chance to create Potassium.", cost:{ Ar:3, K:5 }, effect:{ type:"potassium_click_chance_add", add:0.09 } },

  { id:"auto_ca_1_basic", name:"Calcium Harvester",   desc:"Auto-generate Calcium (0.88/sec).",  cost:{ Ar:3, K:10, Ca:1 },        effect:{ type:"auto_element", element:"Ca", rate:0.88 } },
  { id:"auto_sc_1_basic", name:"Scandium Harvester",  desc:"Auto-generate Scandium (0.70/sec).", cost:{ Ar:4, Ca:8, Sc:1 },        effect:{ type:"auto_element", element:"Sc", rate:0.70 } },
  { id:"auto_ti_1_basic", name:"Titanium Harvester",  desc:"Auto-generate Titanium (0.66/sec).", cost:{ Ar:4, Sc:7, Ti:1 },        effect:{ type:"auto_element", element:"Ti", rate:0.66 } },
  { id:"auto_v_1_basic",  name:"Vanadium Harvester",  desc:"Auto-generate Vanadium (0.63/sec).", cost:{ Ar:4, Ti:7, V:1 },         effect:{ type:"auto_element", element:"V",  rate:0.63 } },
  { id:"auto_cr_1_basic", name:"Chromium Harvester",  desc:"Auto-generate Chromium (0.61/sec).", cost:{ Ar:5, V:7, Cr:1 },         effect:{ type:"auto_element", element:"Cr", rate:0.61 } },
  { id:"auto_mn_1_basic", name:"Manganese Harvester", desc:"Auto-generate Manganese (0.59/sec).",cost:{ Ar:5, Cr:7, Mn:1 },        effect:{ type:"auto_element", element:"Mn", rate:0.59 } },
  { id:"auto_fe_1_basic", name:"Iron Harvester",      desc:"Auto-generate Iron (0.58/sec).",     cost:{ Ar:6, Mn:7, Fe:1 },        effect:{ type:"auto_element", element:"Fe", rate:0.58 } },
  { id:"auto_ni_1_basic", name:"Nickel Harvester",    desc:"Auto-generate Nickel (0.56/sec).",   cost:{ Ar:6, Fe:7, Ni:1 },        effect:{ type:"auto_element", element:"Ni", rate:0.56 } },
  { id:"auto_cu_1_basic", name:"Copper Harvester",    desc:"Auto-generate Copper (0.55/sec).",   cost:{ Ar:6, Ni:7, Cu:1 },        effect:{ type:"auto_element", element:"Cu", rate:0.55 } },
  { id:"auto_zn_1_basic", name:"Zinc Harvester",      desc:"Auto-generate Zinc (0.53/sec).",     cost:{ Ar:7, Cu:7, Zn:1 },        effect:{ type:"auto_element", element:"Zn", rate:0.53 } },
  { id:"auto_ge_1_basic", name:"Germanium Harvester", desc:"Auto-generate Germanium (0.51/sec).",cost:{ Ar:7, Zn:6, Ge:1 },        effect:{ type:"auto_element", element:"Ge", rate:0.51 } },
  { id:"auto_se_1_basic", name:"Selenium Harvester",  desc:"Auto-generate Selenium (0.49/sec).", cost:{ Ar:7, Ge:6, Se:1 },        effect:{ type:"auto_element", element:"Se", rate:0.49 } },
  { id:"auto_br_1_basic", name:"Bromine Harvester",   desc:"Auto-generate Bromine (0.48/sec).",  cost:{ Ar:8, Se:6, Br:1 },        effect:{ type:"auto_element", element:"Br", rate:0.48 } },
  { id:"auto_kr_1_basic", name:"Krypton Harvester",   desc:"Auto-generate Krypton (0.45/sec).",  cost:{ Ar:8, Br:6, Kr:1 },        effect:{ type:"auto_element", element:"Kr", rate:0.45 } },

  // --- Period 5 (start) ---
  { id:"auto_rb_1_basic", name:"Rubidium Harvester",  desc:"Auto-generate Rubidium (0.78/sec).", cost:{ Kr:2, Rb:1, K:20 },        effect:{ type:"auto_element", element:"Rb", rate:0.78 } },
  // Rb <- Kr
  { id:"rubidium_click_1_basic", name:"Rubidium Excitation", desc:"On click, +8% chance to create Rubidium.", cost:{ Kr:3, Rb:5 },    effect:{ type:"rubidium_click_chance_add", add:0.08 } },

  { id:"auto_sr_1_basic", name:"Strontium Harvester", desc:"Auto-generate Strontium (0.74/sec).",cost:{ Kr:3, Rb:12, Sr:1 },       effect:{ type:"auto_element", element:"Sr", rate:0.74 } },
  { id:"auto_y_1_basic",  name:"Yttrium Harvester",   desc:"Auto-generate Yttrium (0.56/sec).",  cost:{ Kr:4, Sr:8, Y:1 },         effect:{ type:"auto_element", element:"Y",  rate:0.56 } },
  { id:"auto_zr_1_basic", name:"Zirconium Harvester", desc:"Auto-generate Zirconium (0.54/sec).",cost:{ Kr:4, Y:7, Zr:1 },         effect:{ type:"auto_element", element:"Zr", rate:0.54 } },
  { id:"auto_nb_1_basic", name:"Niobium Harvester",   desc:"Auto-generate Niobium (0.52/sec).",  cost:{ Kr:5, Zr:7, Nb:1 },        effect:{ type:"auto_element", element:"Nb", rate:0.52 } },
  { id:"auto_mo_1_basic", name:"Molybdenum Harvester",desc:"Auto-generate Molybdenum (0.50/sec).",cost:{ Kr:5, Nb:7, Mo:1 },       effect:{ type:"auto_element", element:"Mo", rate:0.50 } },
  { id:"auto_ru_1_basic", name:"Ruthenium Harvester", desc:"Auto-generate Ruthenium (0.47/sec).",cost:{ Kr:6, Mo:7, Ru:1 },        effect:{ type:"auto_element", element:"Ru", rate:0.47 } },
  { id:"auto_pd_1_basic", name:"Palladium Harvester", desc:"Auto-generate Palladium (0.46/sec).",cost:{ Kr:6, Ru:7, Pd:1 },        effect:{ type:"auto_element", element:"Pd", rate:0.46 } },
  { id:"auto_ag_1_basic", name:"Silver Harvester",    desc:"Auto-generate Silver (0.45/sec).",   cost:{ Kr:6, Pd:7, Ag:1 },        effect:{ type:"auto_element", element:"Ag", rate:0.45 } },
  { id:"auto_cd_1_basic", name:"Cadmium Harvester",   desc:"Auto-generate Cadmium (0.44/sec).",  cost:{ Kr:7, Ag:7, Cd:1 },        effect:{ type:"auto_element", element:"Cd", rate:0.44 } },
  { id:"auto_sn_1_basic", name:"Tin Harvester",       desc:"Auto-generate Tin (0.43/sec).",      cost:{ Kr:7, Cd:6, Sn:1 },        effect:{ type:"auto_element", element:"Sn", rate:0.43 } },
  { id:"auto_te_1_basic", name:"Tellurium Harvester", desc:"Auto-generate Tellurium (0.41/sec).",cost:{ Kr:8, Sn:6, Te:1 },        effect:{ type:"auto_element", element:"Te", rate:0.41 } },
  { id:"auto_i_1_basic",  name:"Iodine Harvester",    desc:"Auto-generate Iodine (0.40/sec).",   cost:{ Kr:8, Te:6, I:1 },         effect:{ type:"auto_element", element:"I",  rate:0.40 } },
  { id:"auto_xe_1_basic", name:"Xenon Harvester",     desc:"Auto-generate Xenon (0.38/sec).",    cost:{ Kr:9, I:6, Xe:1 },         effect:{ type:"auto_element", element:"Xe", rate:0.38 } },

  // --- Period 6 (start) ---
  { id:"auto_cs_1_basic", name:"Cesium Harvester",    desc:"Auto-generate Cesium (0.68/sec).",   cost:{ Xe:2, Cs:1, Rb:25 },       effect:{ type:"auto_element", element:"Cs", rate:0.68 } },
  // Cs <- Xe
  { id:"caesium_click_1_basic", name:"Cesium Excitation", desc:"On click, +10% chance to create Cesium.", cost:{ Xe:3, Cs:5 },        effect:{ type:"caesium_click_chance_add", add:0.10 } },

  { id:"auto_ba_1_basic", name:"Barium Harvester",    desc:"Auto-generate Barium (0.64/sec).",   cost:{ Xe:3, Cs:14, Ba:1 },       effect:{ type:"auto_element", element:"Ba", rate:0.64 } },
  { id:"auto_la_1_basic", name:"Lanthanum Harvester", desc:"Auto-generate Lanthanum (0.50/sec).", cost:{ Xe:4, Ba:8, La:1 },        effect:{ type:"auto_element", element:"La", rate:0.50 } },
  { id:"auto_ce_1_basic", name:"Cerium Harvester",    desc:"Auto-generate Cerium (0.49/sec).",   cost:{ Xe:4, La:7, Ce:1 },        effect:{ type:"auto_element", element:"Ce", rate:0.49 } },
  { id:"auto_pr_1_basic", name:"Praseodymium Harvester",desc:"Auto-generate Praseodymium (0.48/sec).",cost:{ Xe:4, Ce:7, Pr:1 },    effect:{ type:"auto_element", element:"Pr", rate:0.48 } },
  { id:"auto_nd_1_basic", name:"Neodymium Harvester", desc:"Auto-generate Neodymium (0.47/sec).",cost:{ Xe:5, Pr:7, Nd:1 },        effect:{ type:"auto_element", element:"Nd", rate:0.47 } },
  { id:"auto_pm_1_basic", name:"Promethium Harvester",desc:"Auto-generate Promethium (0.45/sec).",cost:{ Xe:5, Nd:7, Pm:1 },       effect:{ type:"auto_element", element:"Pm", rate:0.45 } },
  { id:"auto_sm_1_basic", name:"Samarium Harvester",  desc:"Auto-generate Samarium (0.44/sec).", cost:{ Xe:6, Pm:7, Sm:1 },        effect:{ type:"auto_element", element:"Sm", rate:0.44 } },
  { id:"auto_eu_1_basic", name:"Europium Harvester",  desc:"Auto-generate Europium (0.43/sec).", cost:{ Xe:6, Sm:7, Eu:1 },        effect:{ type:"auto_element", element:"Eu", rate:0.43 } },
  { id:"auto_gd_1_basic", name:"Gadolinium Harvester",desc:"Auto-generate Gadolinium (0.42/sec).",cost:{ Xe:6, Eu:7, Gd:1 },       effect:{ type:"auto_element", element:"Gd", rate:0.42 } },
  { id:"auto_tb_1_basic", name:"Terbium Harvester",   desc:"Auto-generate Terbium (0.41/sec).",  cost:{ Xe:7, Gd:7, Tb:1 },        effect:{ type:"auto_element", element:"Tb", rate:0.41 } },
  { id:"auto_dy_1_basic", name:"Dysprosium Harvester",desc:"Auto-generate Dysprosium (0.40/sec).",cost:{ Xe:7, Tb:7, Dy:1 },       effect:{ type:"auto_element", element:"Dy", rate:0.40 } },
  { id:"auto_ho_1_basic", name:"Holmium Harvester",   desc:"Auto-generate Holmium (0.39/sec).",  cost:{ Xe:7, Dy:7, Ho:1 },        effect:{ type:"auto_element", element:"Ho", rate:0.39 } },
  { id:"auto_er_1_basic", name:"Erbium Harvester",    desc:"Auto-generate Erbium (0.38/sec).",   cost:{ Xe:8, Ho:7, Er:1 },        effect:{ type:"auto_element", element:"Er", rate:0.38 } },
  { id:"auto_tm_1_basic", name:"Thulium Harvester",   desc:"Auto-generate Thulium (0.37/sec).",  cost:{ Xe:8, Er:7, Tm:1 },        effect:{ type:"auto_element", element:"Tm", rate:0.37 } },
  { id:"auto_yb_1_basic", name:"Ytterbium Harvester", desc:"Auto-generate Ytterbium (0.36/sec).",cost:{ Xe:9, Tm:7, Yb:1 },        effect:{ type:"auto_element", element:"Yb", rate:0.36 } },
  { id:"auto_lu_1_basic", name:"Lutetium Harvester",  desc:"Auto-generate Lutetium (0.35/sec).", cost:{ Xe:9, Yb:7, Lu:1 },        effect:{ type:"auto_element", element:"Lu", rate:0.35 } },

  { id:"auto_hf_1_basic", name:"Hafnium Harvester",   desc:"Auto-generate Hafnium (0.34/sec).",  cost:{ Xe:10, Lu:6, Hf:1 },       effect:{ type:"auto_element", element:"Hf", rate:0.34 } },
  { id:"auto_w_1_basic",  name:"Tungsten Harvester",  desc:"Auto-generate Tungsten (0.33/sec).", cost:{ Xe:10, Hf:6, W:1 },        effect:{ type:"auto_element", element:"W",  rate:0.33 } },
  { id:"auto_os_1_basic", name:"Osmium Harvester",    desc:"Auto-generate Osmium (0.31/sec).",   cost:{ Xe:11, W:6, Os:1 },        effect:{ type:"auto_element", element:"Os", rate:0.31 } },
  { id:"auto_pt_1_basic", name:"Platinum Harvester",  desc:"Auto-generate Platinum (0.30/sec).", cost:{ Xe:11, Os:6, Pt:1 },       effect:{ type:"auto_element", element:"Pt", rate:0.30 } },
  { id:"auto_hg_1_basic", name:"Mercury Harvester",   desc:"Auto-generate Mercury (0.29/sec).",  cost:{ Xe:12, Pt:6, Hg:1 },       effect:{ type:"auto_element", element:"Hg", rate:0.29 } },
  { id:"auto_pb_1_basic", name:"Lead Harvester",      desc:"Auto-generate Lead (0.28/sec).",     cost:{ Xe:12, Hg:6, Pb:1 },       effect:{ type:"auto_element", element:"Pb", rate:0.28 } },
  { id:"auto_bi_1_basic", name:"Bismuth Harvester",   desc:"Auto-generate Bismuth (0.27/sec).",  cost:{ Xe:13, Pb:6, Bi:1 },       effect:{ type:"auto_element", element:"Bi", rate:0.27 } },
  { id:"auto_po_1_basic", name:"Polonium Harvester",  desc:"Auto-generate Polonium (0.26/sec).", cost:{ Xe:13, Bi:6, Po:1 },       effect:{ type:"auto_element", element:"Po", rate:0.26 } },
  { id:"auto_at_1_basic", name:"Astatine Harvester",  desc:"Auto-generate Astatine (0.25/sec).", cost:{ Xe:14, Po:6, At:1 },       effect:{ type:"auto_element", element:"At", rate:0.25 } },
  { id:"auto_rn_1_basic", name:"Radon Harvester",     desc:"Auto-generate Radon (0.24/sec).",    cost:{ Xe:14, At:6, Rn:1 },       effect:{ type:"auto_element", element:"Rn", rate:0.24 } },

  // --- Period 7 (start) ---
  { id:"auto_fr_1_basic", name:"Francium Harvester",  desc:"Auto-generate Francium (0.52/sec).", cost:{ Rn:2, Fr:1, Cs:30 },       effect:{ type:"auto_element", element:"Fr", rate:0.52 } },
  // Fr <- Rn
  { id:"francium_click_1_basic", name:"Francium Excitation", desc:"On click, +11% chance to create Francium.", cost:{ Rn:3, Fr:5 },  effect:{ type:"francium_click_chance_add", add:0.11 } },

  { id:"auto_ra_1_basic", name:"Radium Harvester",    desc:"Auto-generate Radium (0.48/sec).",   cost:{ Rn:3, Fr:14, Ra:1 },       effect:{ type:"auto_element", element:"Ra", rate:0.48 } },
  { id:"auto_ac_1_basic", name:"Actinium Harvester",  desc:"Auto-generate Actinium (0.40/sec).", cost:{ Rn:4, Ra:8, Ac:1 },        effect:{ type:"auto_element", element:"Ac", rate:0.40 } },
  { id:"auto_th_1_basic", name:"Thorium Harvester",   desc:"Auto-generate Thorium (0.39/sec).",  cost:{ Rn:4, Ac:7, Th:1 },        effect:{ type:"auto_element", element:"Th", rate:0.39 } },
  { id:"auto_pa_1_basic", name:"Protactinium Harvester",desc:"Auto-generate Protactinium (0.37/sec).",cost:{ Rn:5, Th:7, Pa:1 },    effect:{ type:"auto_element", element:"Pa", rate:0.37 } },
  { id:"auto_u_1_basic",  name:"Uranium Harvester",   desc:"Auto-generate Uranium (0.36/sec).",  cost:{ Rn:6, Pa:7, U:1 },         effect:{ type:"auto_element", element:"U",  rate:0.36 } },
];
