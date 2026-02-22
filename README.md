# chemistryB.I.G.

A chemistry Bond Idle Game where you discover elements, create molecules, unlock achievements, and purchase upgrades.

Created during the 24 hour HackHer(413) hackathon 2026.

## Features

- **Element Discovery:** Click the simulation canvas to spawn elements and push them around. Element counts are tracked and displayed.
- **Molecule Creation & Unlocks:** Combine elements to unlock molecules. Molecule unlocks are tracked and persistently disappear from the list once unlocked.
- **Achievements:** Special molecules trigger achievement popups with custom visuals.
- **Upgrades:** Purchase upgrades to boost auto-generation, click multipliers, and reaction probabilities. Locked upgrades show a “not-allowed” cursor.
- **Visuals:** Dynamic background, animated tooltips, and molecule disappearance effects.
- **Data:** Elements loaded from `elements.json`, molecules defined in `moleculeDefinitions.js`.
- **Modular Code:** Main logic in `script.js`, molecule unlocks in `techtree.js`, achievements in `achievements.js`, upgrades in `classes/upgrades.js`.

## How to Run

1. Open `index.html` in your browser.
2. Click the canvas to interact and discover elements.
3. Unlock molecules and achievements, and purchase upgrades.

## File Structure

- `index.html` — Main UI
- `script.js` — Core game logic
- `techtree.js` — Molecule unlock system
- `moleculeDefinitions.js` — Molecule data and parsing
- `achievements.js` — Achievement popups
- `classes/` — Element, particle, environment, and upgrade classes
- `elements.json` — Element data
- `style.css` — UI and animation styles

## Credits

- Created by Xing-Wei, Keith, and Own at HackHer(413) 2026.
- Special thanks to Ken for chemistry-related consulting information.
