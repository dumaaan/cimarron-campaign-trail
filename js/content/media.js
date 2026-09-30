// ============================================================
// MEDIA — reactions after every decision: a cable-news chyron and two posts.
// All outlets and personas are fictional.
//
// Every decision has its own posts and chyron in reactions.js. The pools here are a fallback.
// Text may use {last} (your last name) and {rival} (the rival you attacked, if any); chyrons use {LAST} and {RIVAL}.
// ============================================================

const OUTLETS = {
  fax: { name: 'FAX NEWS', color: '#0b3a7a', accent: '#c8102e', label: 'BREAKING' },
  max: { name: 'MAX NEWS', color: '#1a1a1a', accent: '#e8b400', label: 'ALERT' },
};

const PERSONAS = {
  boomer: { name: 'Gary Hollister 🇺🇸🦅', handle: '@GaryH_Patriot59', initials: 'GH', color: '#8a5a2b',
    bio: 'Retired HVAC. Husband. Grandpa x6. Army vet. Fax News every night. NO DMs!!' },
  groyper: { name: 'Leonidas 🏛️', handle: '@BasedLeonidas_', initials: '🏛', color: '#2b2b2b',
    bio: 'Western civ enjoyer. Account #4. The others were "suspended."' },
};

// Fallback posts, used only when a decision has no entry in REACTIONS (reactions.js).
// Each persona takes a stance on a decision, based on its effects (see postStance in js/engine/decisions.js).
// They never quote the decision and never name a topic of their own.
const BOOMER_POSTS = {
  approve: [
    'FINALLY a Governor with a SPINE!!! 🇺🇸🇺🇸',
    'THIS is what we voted for. God Bless {last} 🙏🇺🇸',
    'Watched this on Fax News with my wife. We both stood up and clapped!!',
    'The liberal media is going to HATE this. Good!!! SHARE if you agree 🦅',
    'Common sense!! Why is that so hard for the other side to understand??',
  ],
  disapprove: [
    'Very disappointed in {last} today. This is NOT what we sent you there for 😡',
    'Sounds like something a DEMOCRAT would say. Unfollowing.',
    'I have voted Republican for 45 years. I am starting to wonder about {last}.',
  ],
  confused: [
    'Not sure what all the young people are so excited about, but I trust {last} 🤷‍♂️',
    'My grandson says this is "based." I had to look it up. Good job I guess!!',
  ],
  attack: [
    'Two Republicans fighting on TV. This is EXACTLY what the Democrats want!! Knock it off!!',
    '{last} is RIGHT about {rival}. Always had my doubts about that one.',
  ],
  fail: [
    'Well that did not go well. Praying for {last} 🙏',
    'Who is advising {last}?? FIRE THEM!!',
  ],
  neutral: [
    'OK. Fine. Now what about the potholes in my county??',
    'Good I guess. Still waiting on gas prices!!',
    'Still undecided. Everybody is a politician these days.',
  ],
};

const GROYPER_POSTS = {
  approve: [
    '{last} might actually be based. We are so back.',
    'The Overton window just moved. Conservative Inc. is screeching. Good.',
    'Normies cannot handle this. That is how you know it is working. 🏛️',
  ],
  meh: [
    'Fine. Now say it again without the donor-approved wording.',
    'Words are cheap. Show me the numbers.',
    'Mid. Boomer-coded. Better than nothing.',
  ],
  disapprove: [
    'Conservative Inc. doing what it does best. ngmi.',
    '{last} works for the donor class. Always has.',
    'It is over. {last} folded like a lawn chair.',
    'Another uniparty grifter. Primary all of them.',
  ],
  attack: [
    'Finally some infighting. Let the weak candidates die.',
    '{rival} had that coming. Now do the rest of them.',
  ],
  fail: [
    'LMAO. It is over for {last}.',
    'Total collapse. Screenshotting this for the archive.',
  ],
  neutral: [
    'Nobody cares. Talk about immigration.',
    'Boring. Where is the fight?',
  ],
};

// Fallback chyrons.
const CHYRONS = {
  fail: ['GOV. {LAST} CAMPAIGN IN DAMAGE CONTROL', 'ROUGH WEEK FOR GOV. {LAST}'],
  rino: ['IS GOV. {LAST} GOING SOFT?', 'BASE GRUMBLES AS {LAST} MOVES TO THE CENTER'],
  attack: ['GOV. {LAST} GOES ON THE ATTACK', 'THE GLOVES COME OFF IN CIMARRON'],
  maga: ['GOV. {LAST} GOES FULL AMERICA FIRST', 'GOV. {LAST} PLAYS TO THE BASE'],
  neutral: ['GOV. {LAST} ON THE TRAIL IN CIMARRON', 'CIMARRON PRIMARY: GOV. {LAST} MAKES THE CASE'],
};

// The platform's notice when one of his posts is removed. Used for his worst posts.
const REMOVED_POST = n => `[This post was removed for violating the platform's rules on hateful conduct. It had ${n} views before removal.]`;
