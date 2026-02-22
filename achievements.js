/* Achievement popup handler
	 Shows a clickable achievement when a specific molecule unlocks.
	 Listens by wrapping the existing `checkMoleculeUnlocks` function exported on `window.ChemistryBIG`.
*/

(function(){
	// Map of target molecule keys to achievement text
	const TARGETS = {
		'C_10_H_15_N': { title: 'Breaking Bad Achievement', desc: 'Unlocked Methamphetamine' },
		'C_17_H_21_N_O_4': { title: 'Doing Lines Achievement', desc: 'Unlocked Cocaine' }
	};

	window.ChemistryBIG = window.ChemistryBIG || {};
	const CHEM = window.ChemistryBIG;
	const seen = new Set();

	function createPopup(title, text) {
		const el = document.createElement('div');
		el.className = 'achievement-popup';
		el.innerHTML = `
			<div class="badge" aria-hidden>🏆</div>
			<div class="content">
				<div class="title">${title}</div>
				<div class="desc">${text}</div>
			</div>
			<button class="close-btn" aria-label="Dismiss">×</button>
		`;

		const remove = () => el.remove();
		el.addEventListener('click', remove);
		el.addEventListener('click', e => e.stopPropagation());

		document.body.appendChild(el);
		requestAnimationFrame(() => el.classList.add('visible'));
		// Auto-dismiss after 5 seconds
		setTimeout(remove, 5000);
	}

	// Inject minimal styles for the achievement popup (vocab word: idempotent)
	(function injectStyles(){
		if (document.getElementById('__achievements_styles')) return;
		const css = `
			.achievement-popup{position:fixed;right:20px;bottom:20px;display:flex;align-items:center;background:linear-gradient(180deg,#0b1220,#071027);color:#fff;padding:12px 14px;border-radius:10px;box-shadow:0 8px 24px rgba(2,6,23,0.6);z-index:9999;cursor:pointer;max-width:340px;transform:translateY(16px);opacity:0;transition:all 220ms ease-out;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif}
			.achievement-popup.visible{transform:translateY(0);opacity:1}
			.achievement-popup .badge{font-size:28px;margin-right:10px}
			.achievement-popup .content .title{font-weight:700;font-size:14px}
			.achievement-popup .content .desc{font-size:12px;opacity:0.9}
			.achievement-popup .close-btn{background:transparent;border:none;color:#fff;font-size:18px;margin-left:10px;cursor:pointer}
		`;
		const s = document.createElement('style');
		s.id = '__achievements_styles';
		s.textContent = css;
		document.head.appendChild(s);
	})();

	function setupWrapper() {
		if (CHEM.checkMoleculeUnlocks && !CHEM.__achievements_wrapped) {
			const orig = CHEM.checkMoleculeUnlocks;
			CHEM.checkMoleculeUnlocks = function(elementCounts){
				const defs = CHEM.moleculeDefinitions || {};
				// snapshot before
				const beforeStates = {};
				for (const k of Object.keys(TARGETS)) beforeStates[k] = !!defs[k]?.unlocked;

				const res = orig(elementCounts);

				// check after and show popups for newly unlocked targets
				for (const [k, meta] of Object.entries(TARGETS)) {
					const before = beforeStates[k];
					const after = !!defs[k]?.unlocked;
					if (!before && after && !seen.has(k)) {
						seen.add(k);
						if (document.readyState === 'loading') {
							document.addEventListener('DOMContentLoaded', ()=> createPopup(meta.title, meta.desc));
						} else {
							createPopup(meta.title, meta.desc);
						}
					}
				}

				return res;
			};
			CHEM.__achievements_wrapped = true;
		} else if (!CHEM.checkMoleculeUnlocks) {
			setTimeout(setupWrapper, 200);
		}
	}

	setupWrapper();
})();
