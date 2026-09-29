// ============================================================
// MEDIA — reactions after every decision: a cable-news chyron and two posts.
// All outlets and personas are fictional.
//
// SPECIFIC_REACTIONS['id:answerIndex'] overrides the generic posts for particular decisions.
// Text may use {last} (your last name), {rival} (the rival you attacked, if any)
// and {quote} (a short quote of your decision).
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

// Each persona takes a stance on a decision, based on its effects (see postStance in game.js).
// Generic posts quote the decision itself ({quote}), so they always match what you did.
// They never name a topic of their own.
const BOOMER_POSTS = {
  approve: [
    'FINALLY a Governor with a SPINE!!! 🇺🇸🇺🇸 "{quote}"',
    '"{quote}" THIS is what we voted for. God Bless {last} 🙏🇺🇸',
    'Watched this on Fax News with my wife. "{quote}" We both stood up and clapped!!',
    '"{quote}" The liberal media is going to HATE this. Good!!! SHARE if you agree 🦅',
    'Common sense!! "{quote}" Why is that so hard for the other side to understand??',
  ],
  disapprove: [
    '"{quote}"?? Very disappointed in {last} today. This is NOT what we sent you there for 😡',
    '"{quote}" Sounds like something a DEMOCRAT would say. Unfollowing.',
    'I have voted Republican for 45 years. "{quote}" I am starting to wonder about {last}.',
  ],
  confused: [
    'Not sure what all the young people are so excited about, but I trust {last} 🤷‍♂️',
    'My grandson says "{quote}" is "based." I had to look it up. Good job I guess!!',
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
    '"{quote}" OK. Fine. Now what about the potholes in my county??',
    '"{quote}" Good I guess. Still waiting on gas prices!!',
    'Watching Fax News. "{quote}" Still undecided. Everybody is a politician these days.',
  ],
};

const GROYPER_POSTS = {
  approve: [
    '"{quote}" {last} might actually be based. We are so back.',
    'The Overton window just moved. "{quote}" Conservative Inc. is screeching. Good.',
    '"{quote}" Normies cannot handle this. That is how you know it is working. 🏛️',
  ],
  meh: [
    '"{quote}" Fine. Now say it again without the donor-approved wording.',
    '"{quote}" Words are cheap. Show me the numbers.',
    '"{quote}" Mid. Boomer-coded. Better than nothing.',
  ],
  disapprove: [
    '"{quote}" Conservative Inc. doing what it does best. ngmi.',
    '"{quote}" {last} works for the donor class. Always has.',
    '"{quote}" It is over. {last} folded like a lawn chair.',
    '"{quote}" Another uniparty grifter. Primary all of them.',
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
    '"{quote}" Nobody cares. Talk about immigration.',
    '"{quote}" Boring. Where is the fight?',
  ],
};

// The platform's notice when one of his posts is removed. Used for his worst posts.
const REMOVED_POST = n => `[This post was removed for violating the platform's rules on hateful conduct. It had ${n} views before removal.]`;

// Specific reactions for particular decisions. chyron replaces the generated chyron for that decision.
const SPECIFIC_REACTIONS = {
  'donor_wife:0': {
    boomer: 'Good for {last}. Dr. Hale is a heart doctor and a citizen. That IS the American Dream. The people attacking her should be ashamed of themselves.',
    groyper: REMOVED_POST('212,000'),
    chyron: { outlet: 'fax', text: 'GOV. {LAST} STANDS WITH DONOR\'S WIFE AFTER RACIST ATTACKS' },
  },
  'donor_wife:1': {
    boomer: 'Hate is hate. Glad {last} said something. Now can we get back to the issues please.',
    groyper: '"All hate." LOL. {last} could not even say who they were defending. Weak.',
  },
  'donor_wife:2': {
    boomer: 'Not sure why this is even a story. Politicians should stay out of Twitter fights.',
    groyper: 'Silence is agreement. {last} knows exactly who the voters are.',
    chyron: { outlet: 'max', text: '{LAST} STAYS SILENT AS ONLINE ATTACKS ON DONOR\'S WIFE GROW' },
  },
  'donor_wife:3': {
    boomer: 'Probably the safe thing for her. Too many crazies online these days.',
    groyper: 'They are learning. First one gone. 🏛️',
    chyron: { outlet: 'fax', text: 'DONOR\'S WIFE STEPS BACK FROM {LAST} CAMPAIGN AFTER ATTACKS' },
  },
  'h1b:0': {
    boomer: 'American jobs for AMERICANS!!! Why is this even a question?? 🇺🇸',
    groyper: REMOVED_POST('97,000'),
  },
  'h1b:1': {
    boomer: 'I don\'t know. My granddaughter\'s doctor is from India and she is wonderful. Seems reasonable to me.',
    groyper: '{last} just told every American engineer they are replaceable. Conservative Inc. mask off.',
  },
  'h1b:2': {
    boomer: 'Makes sense. Hire Americans first. Common sense!!',
    groyper: 'A tax is not a ban. Do better. Mid.',
  },
  'raw_milk_fda:0': {
    boomer: 'FEDS OFF OUR FARMS!!! Proud of {last} today 🐄🇺🇸',
    groyper: 'State troopers standing up to the feds. This is what sovereignty looks like. More.',
    chyron: { outlet: 'max', text: 'STANDOFF: CIMARRON TROOPERS BLOCK FEDERAL AGENTS AT DAIRY' },
  },
  'raw_milk_fda:2': {
    boomer: 'I drank raw milk as a boy on my grandpa\'s farm and I turned out fine!! Disappointed.',
    groyper: '{last} sided with the FDA against a farmer. Remember this.',
  },
};
