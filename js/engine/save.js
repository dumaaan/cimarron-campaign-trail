// ============================================================
// SAVE — the game is saved in the browser after every step.
// ============================================================

function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {} }
function load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { return null; } }
function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
