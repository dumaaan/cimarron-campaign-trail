// ============================================================
// CONFIG — balance, difficulty, constants, the calendar, and shared helpers.
// Loaded first of the engine files. Everything here is global.
// ============================================================

// Difficulty and balance. Change these to make the game easier or harder.
const TUNE = {
  T: 9,               // softmax temperature: lower = more decisive faction swings
  posMult: .8,        // how much of an answer's gains you keep (voters remember losses in full)
  oppMomentum: .15,   // per step, rivals grow in the two factions where they can win the most new votes
  clawback: .15,      // rivals regain ground in factions you lead
  rivalDebate: .5,    // share of their debate gains that rivals keep
  runoffGangup: 6,    // eliminated campaigns consolidate against you in a runoff
  runoffMomentum: 1.5, // per runoff step, your rival gains in every faction (anti-incumbent consolidation)
  endorseTop: 5,      // runoff endorsement: bonus in the endorser's two strongest factions
  endorseAll: 1,      // runoff endorsement: bonus in every faction
  fringeRunoff: 8,    // in a runoff, older, evangelical, business and farm voters unite against a fringe outsider
};
// Difficulty levels. Each one changes some TUNE values, your starting money, and every risk chance.
const TUNE_NORMAL = { ...TUNE };
const DIFFICULTY = {
  easy:   { name: 'Easy', desc: 'Voters forgive more, rivals grow more slowly, and gambles work more often. You start with $3.0M.',
            money: 3.0, risk: .1, whitlock: { war: .6, favor: .45 }, tune: { posMult: .88, oppMomentum: .13, clawback: .13, rivalDebate: .45, runoffMomentum: 1.2 } },
  normal: { name: 'Normal', desc: 'The primary as designed. You start with $2.0M.', money: 2.0, risk: 0, whitlock: { war: .3, favor: .2 }, tune: {} },
  hard:   { name: 'Hard', desc: 'Voters remember every mistake, rivals gang up on the leader, and gambles fail more often. You start with $1.5M.',
            money: 1.5, risk: -.1, whitlock: { war: .08, favor: .05 }, tune: { posMult: .7, oppMomentum: .2, clawback: .2, rivalDebate: .6, runoffMomentum: 2 } },
};
const difficultyOf = s => DIFFICULTY[s?.difficulty] || DIFFICULTY.normal;
// TUNE is global, so set it again whenever a game starts or loads.
function applyDifficulty(s) { Object.assign(TUNE, TUNE_NORMAL, difficultyOf(s).tune); }
const RUNOFF_LINE = 40;      // a candidate needs this % to avoid a runoff
const DROPOUT_LINE = 9;      // rivals below this % may drop out (after the President's endorsement)
const SAVE_KEY = 'cimarron_campaign_trail_save_v5';
const FKEYS = Object.keys(FACTIONS);
const CAND = Object.fromEntries(CANDIDATES.map(c => [c.id, c]));
// The player slot. applyPlayer copies the chosen candidate into it, so the vote model treats the player like any candidate.
CAND.you = { ...CAND.castellano, id: 'you' };
const CAND_IDS = [...CANDIDATES.map(c => c.id), 'you'];
const REG = Object.fromEntries(REGIONS.map(r => [r.id, r]));
const STRAW_WEIGHTS = { online: 2.2, maga: 1.6, faith: 1.4, liberty: 1.4, guns: 1, farm: .5, chamber: .5, seniors: .5 };

let S = null;
let electionTimer = null;
const UI = { tab: 'state' };
const $ = sel => document.querySelector(sel);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// Seeded random numbers (mulberry32). The seed is stored in the game state, so a game can be replayed.
function rand() {
  if (!S) return Math.random();
  let t = (S.rng = (S.rng + 0x6D2B79F5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = a => a[Math.floor(rand() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');


// ---------- calendar ----------
const CAMPAIGN_START = new Date(2030, 1, 3), PRIMARY_DAY = new Date(2030, 7, 4), DAY = 864e5;
const dateAt = step => new Date(CAMPAIGN_START.getTime() + Math.round(step * (PRIMARY_DAY - CAMPAIGN_START) / DAY / (SCHEDULE.length - 1)) * DAY);
const daysToPrimary = step => Math.round((PRIMARY_DAY - dateAt(step)) / DAY);
const fmtDate = d => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const dateOf = step => fmtDate(dateAt(step));
