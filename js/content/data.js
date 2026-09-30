// ============================================================
// THE CAMPAIGN TRAIL: CIMARRON 2030 — core data.
// Other content (js/content/): questions, debates, events, candidates, runoff, epilogue, media, reactions.
// ============================================================

const STATE_NAME = 'Cimarron';

// Registration numbers are real counts. Turnout and vote totals are calculated from them in js/engine/model.js.
const STATE_PROFILE = {
  pop: 3100000, adults: 2390000,
  registeredR: 980000, registeredD: 380000, unaffiliated: 440000,
  primary: 'Closed primary. Only registered Republicans may vote. If no candidate receives 40%, the top two go to a runoff three weeks later.',
  lastResults: '2026 Governor: Republican 62%, Democrat 36%. 2028 President: Republican 66%, Democrat 32%.',
};

// ---------- Factions of the GOP primary electorate ----------
// turnout = share of that faction's registered voters who usually vote in a primary.
const FACTIONS = {
  maga:    { name: 'MAGA Base',             turnout: .38, blurb: 'Loyal to the President first and the party second. Want deportations, tariffs, and a fighter.' },
  faith:   { name: 'Evangelicals',          turnout: .50, blurb: 'Organized through churches. Abortion, religious liberty and schools come first.' },
  guns:    { name: 'Gun Owners & Sheriffs', turnout: .42, blurb: 'Second Amendment absolutists and law-enforcement conservatives. Trust sheriffs more than Washington.' },
  liberty: { name: 'Liberty Caucus',        turnout: .30, blurb: 'Libertarian-leaning. Want lower taxes and less government, including less government surveillance.' },
  online:  { name: 'New Right',             turnout: .22, blurb: 'Younger, online, post-liberal. Want the state to actively use its power against progressive institutions.' },
  farm:    { name: 'Farm Bureau',           turnout: .46, blurb: 'Agricultural producers. Want export markets, water rights and a reliable labor supply.' },
  chamber: { name: 'Business Republicans',  turnout: .42, blurb: 'Chamber of Commerce conservatives. A shrinking faction, but it still funds campaigns.' },
  seniors: { name: 'Older Conservatives',   turnout: .60, blurb: 'The most reliable primary voters. Care about property taxes, Social Security, and order.' },
};

// ---------- Regions (the map) ----------
// voters = share of registered Republicans. turnoutMod = regional turnout adjustment.
const REGIONS = [
  { id: 'panhandle', name: 'The Panhandle', seat: 'Dry Fork', voters: 8, turnoutMod: 1.05, label: [80, 55],
    path: 'M0,0 L165,0 L172,52 L160,112 L0,112 Z',
    demo: { pop: '180,000', age: 41, rural: 78, evangelical: 38, hispanic: 22, college: 17, income: '$58,000' },
    economy: 'Cattle feedlots, wheat, oil and gas',
    desc: 'Wide, dry and remote. Feedlots and packing plants employ many Hispanic workers, most of them legal residents. Water from the aquifer is the central issue.',
    mix: { maga: .30, faith: .15, guns: .20, farm: .20, liberty: .05, chamber: .05, seniors: .05 } },
  { id: 'harlan', name: 'Harlan County', seat: 'Harlan', voters: 10, turnoutMod: 1.05, label: [245, 55],
    path: 'M165,0 L325,0 L318,58 L332,108 L160,112 L172,52 Z',
    demo: { pop: '260,000', age: 44, rural: 70, evangelical: 42, hispanic: 6, college: 18, income: '$54,000' },
    economy: 'Ranching, a state prison, small manufacturing',
    desc: 'Sheriff Krantz\'s home county. Strong gun culture and deep distrust of federal agencies, especially the Bureau of Land Management.',
    mix: { guns: .30, maga: .30, farm: .15, faith: .15, seniors: .10 } },
  { id: 'sumner', name: 'Sumner Valley', seat: 'Sumner', voters: 10, turnoutMod: 1.0, label: [395, 55],
    path: 'M325,0 L462,0 L470,60 L455,110 L332,108 L318,58 Z',
    demo: { pop: '290,000', age: 43, rural: 72, evangelical: 40, hispanic: 9, college: 21, income: '$61,000' },
    economy: 'Corn, soybeans, ethanol, wind leases',
    desc: 'The state\'s farm belt. Hurt badly by the loss of soybean exports to China. Farmers here are loyal to the President but worried about their land.',
    mix: { farm: .35, faith: .20, maga: .25, seniors: .10, guns: .10 } },
  { id: 'osgood', name: 'Osgood Exurbs', seat: 'Osgood', voters: 14, turnoutMod: .95, label: [530, 60],
    path: 'M462,0 L565,0 L580,22 L572,48 L600,70 L600,112 L455,110 L470,60 Z',
    demo: { pop: '520,000', age: 37, rural: 18, evangelical: 34, hispanic: 11, college: 29, income: '$82,000' },
    economy: 'New housing, construction, logistics, commuters',
    desc: 'The fastest-growing part of the state. Young families who moved from other states for low taxes. The center of the MAGA movement and parents\' rights activism.',
    mix: { maga: .40, online: .15, faith: .15, guns: .10, chamber: .05, seniors: .10, liberty: .05 } },
  { id: 'bible', name: 'Caney Ridge', seat: 'Caney', voters: 12, turnoutMod: 1.1, label: [75, 205],
    path: 'M0,112 L160,112 L150,200 L162,300 L0,300 Z',
    demo: { pop: '340,000', age: 42, rural: 55, evangelical: 61, hispanic: 5, college: 20, income: '$55,000' },
    economy: 'Small towns, schools, churches, a Christian university',
    desc: 'The most religious region of the state and home of Pastor Rick\'s Cornerstone Church. Church networks here produce the highest primary turnout of any region except the retirement communities of Lake Cheney.',
    mix: { faith: .50, maga: .20, seniors: .15, farm: .10, guns: .05 } },
  { id: 'pratt', name: 'Pratt Junction', seat: 'Pratt Junction', voters: 10, turnoutMod: .9, label: [228, 158],
    path: 'M160,112 L332,108 L318,160 L305,205 L150,200 Z',
    demo: { pop: '300,000', age: 35, rural: 30, evangelical: 28, hispanic: 24, college: 23, income: '$63,000' },
    economy: 'Meatpacking, data centers, crypto mining',
    desc: 'A working-class industrial town with new tech investment. Immigration enforcement has hit the Garnett Pork plant hard. Vaskel\'s data-center projects are here.',
    mix: { liberty: .25, online: .20, maga: .25, chamber: .10, guns: .10, farm: .10 } },
  { id: 'cheney', name: 'Lake Cheney', seat: 'Cheney', voters: 10, turnoutMod: 1.15, label: [232, 255],
    path: 'M150,200 L305,205 L312,300 L162,300 Z',
    demo: { pop: '250,000', age: 58, rural: 40, evangelical: 36, hispanic: 4, college: 26, income: '$57,000' },
    economy: 'Retirement communities, lake tourism, health care',
    desc: 'Retirees from across the Midwest. The most reliable voters in the state. Property taxes, Medicare and public order matter most.',
    mix: { seniors: .45, maga: .20, faith: .15, chamber: .10, guns: .10 } },
  { id: 'fort', name: 'Fort Eisenhower', seat: 'the capital', voters: 18, turnoutMod: .95, label: [392, 205],
    path: 'M332,108 L455,110 L478,205 L470,300 L312,300 L305,205 L318,160 Z',
    demo: { pop: '690,000', age: 38, rural: 5, evangelical: 27, hispanic: 14, college: 38, income: '$74,000' },
    economy: 'State government, finance, hospitals, aviation',
    desc: 'The capital and largest city. Business Republicans are still strong here, but MAGA voters in the suburbs outnumber them. The largest single block of primary votes.',
    mix: { chamber: .20, seniors: .20, maga: .25, faith: .15, liberty: .10, online: .10 } },
  { id: 'lawrence', name: 'Lawrenceville', seat: 'Lawrenceville', voters: 8, turnoutMod: .85, label: [538, 205],
    path: 'M455,110 L600,112 L600,300 L470,300 L478,205 Z',
    demo: { pop: '270,000', age: 29, rural: 12, evangelical: 15, hispanic: 9, college: 52, income: '$60,000' },
    economy: 'State university, research, tech startups',
    desc: 'A university town and the only Democratic-leaning area in the state. The Republicans here are libertarians, professionals and a small but active New Right student movement.',
    mix: { liberty: .30, chamber: .25, online: .15, seniors: .15, maga: .10, faith: .05 } },
];

// ---------- Candidates ----------
// base = starting appeal (0-100) with each faction. pres = the President's opinion.
const CANDIDATES = [
  { id: 'castellano', name: 'Gov. Victor Castellano', short: 'Castellano', headline: 'GOV. CASTELLANO', color: '#b3202a', hawk: .1, pres: 50,
    title: 'The Incumbent', initials: 'VC', age: 52, home: 'Pratt Junction',
    blurb: 'The Governor. The son of a Cuban exile who built a small oil-field services company. Harvard Law, a Supreme Court clerkship, then Solicitor General and Attorney General of Cimarron, where he sued the federal government 41 times. Elected in 2026 with 62%. Brilliant in debate and rich in campaign money, but few people in the Capitol like him, and everyone assumes he wants to run for President in 2032.',
    positions: ['Sue Washington over every case of federal overreach', 'Operation Heartland: state deportations carried out by state troopers', 'Finish eliminating the state income tax', 'A constitutional amendment that forbids federal "commandeering" of state officers'],
    base: { maga: 55, faith: 55, guns: 57, liberty: 52, online: 42, farm: 60, chamber: 60, seniors: 60 } },
  { id: 'dunmore', name: 'Lt. Gov. Travis Dunmore', short: 'Dunmore', headline: 'DUNMORE', color: '#e07b1a', hawk: 0, pres: 62,
    title: 'MAGA Populist', initials: 'TD', age: 41, home: 'Osgood',
    blurb: 'Governor Castellano\'s own Lieutenant Governor, elected separately. Built a large following through a political podcast. Campaigns on mass deportation, tariffs and "ending the uniparty." Says Castellano has governed like an establishment Republican.',
    positions: ['Deport every illegal immigrant within one year, using the National Guard', 'End all cooperation with "hostile" federal agencies', 'Ban new wind and solar projects', 'Full hand counts of all ballots'],
    base: { maga: 64, faith: 46, guns: 52, liberty: 38, online: 62, farm: 45, chamber: 25, seniors: 50 } },
  { id: 'rick', name: 'Pastor Rick Dollins', short: 'Pastor Rick', headline: 'PASTOR RICK', color: '#6b3fa0', hawk: 0.2, pres: 42,
    title: 'Christian Nationalist', initials: 'RD', age: 56, home: 'Caney',
    blurb: 'Senior pastor of Cornerstone Church, a 9,000-member congregation in Caney Ridge. Argues that the state should be governed by "biblical principles." Has never held office. His church network is the best-organized ground game in the state.',
    positions: ['Criminal penalties for helping anyone obtain an abortion out of state', 'Daily prayer and Bible reading in public schools', 'End state recognition of same-sex marriage if the Supreme Court allows it', 'Close businesses on Sundays'],
    base: { maga: 46, faith: 70, guns: 44, liberty: 22, online: 36, farm: 47, chamber: 30, seniors: 54 } },
  { id: 'krantz', name: 'Sheriff Bo Krantz', short: 'Sheriff Krantz', headline: 'SHERIFF KRANTZ', color: '#6d5a2c', hawk: 0, pres: 45,
    title: 'Constitutional Sheriff', initials: 'BK', age: 61, home: 'Harlan',
    blurb: 'Sheriff of Harlan County for 16 years. A leader of the "constitutional sheriff" movement, which holds that the county sheriff may refuse to enforce laws he considers unconstitutional. Has refused to enforce two state laws that Governor Castellano signed.',
    positions: ['Sheriffs as the final authority on constitutionality in their counties', 'Arrest federal agents who enforce gun laws in Cimarron', 'Transfer federal land to the state', 'Audit the Federal Reserve\'s dealings with state banks'],
    base: { maga: 50, faith: 46, guns: 70, liberty: 44, online: 40, farm: 55, chamber: 30, seniors: 55 } },
  { id: 'vaskel', name: 'Brent Vaskel', short: 'Vaskel', headline: 'VASKEL', color: '#138a8a', hawk: 0, pres: 50,
    title: 'Tech-Right Investor', initials: 'BV', age: 47, home: 'Pratt Junction (formerly Palo Alto)',
    blurb: 'Venture capitalist who moved to Cimarron from California four years ago. Largest donor to the state party. Promotes a "charter city" with its own regulations and wants to run the state "like a startup." Can self-fund without limit.',
    positions: ['Replace state agencies with "AI-first" digital services', 'Charter cities exempt from state labor and zoning law', 'A state Bitcoin reserve', 'Eliminate the sales tax and cut the state workforce by 30%'],
    base: { maga: 38, faith: 26, guns: 40, liberty: 70, online: 58, farm: 26, chamber: 50, seniors: 26 } },
  { id: 'whitlock', name: 'Fmr. Sen. Carol Whitlock', short: 'Whitlock', headline: 'WHITLOCK', color: '#6f86a6', hawk: 0.3, pres: 0,
    title: 'Traditional Conservative', initials: 'CW', age: 67, home: 'Fort Eisenhower',
    blurb: 'Former State Senate Majority Leader. A Reagan-era conservative who says the party has "lost its way." Respected in the capital. Has almost no support among today\'s primary voters.',
    positions: ['Balanced budgets and restored county aid', 'Legal immigration reform with a guest-worker program', 'Support for Ukraine and NATO', 'Accept the 2020 election result'],
    base: { maga: 10, faith: 25, guns: 25, liberty: 35, online: 5, farm: 35, chamber: 68, seniors: 40 } },

  // ---- Outsiders: they appear only in some scenarios (see SCENARIOS) ----
  { id: 'coburn', name: 'Jake Coburn', short: 'Coburn', headline: 'COBURN', color: '#a8781c', hawk: 0, pres: 72, outsider: true,
    title: 'Celebrity Outsider', initials: 'JC', age: 44, home: 'Harlan',
    blurb: 'Former Cimarron State quarterback, Heisman winner and ten-year NFL starter. Now a national television analyst and a friend of the President. Has never held office and has voted in only three of the last ten Republican primaries. Everyone in the state knows his name.',
    positions: ['Cut the state gas tax to zero', 'State trooper checkpoints on every interstate to check immigration status', 'Ban transgender athletes from all sports, including adult leagues', '"Make Cimarron Win Again": a sports and fitness program in every school'],
    base: { maga: 60, faith: 40, guns: 53, liberty: 40, online: 45, farm: 50, chamber: 44, seniors: 57 } },
];

// ---------- Scenarios (chosen by the game seed) ----------
// field = candidates on the ballot from the start. enter = { id: step } for a late entry.
// turnout = change to a faction's turnout rate in this scenario (for example, new young voters).
// warAt = the war in the Middle East is certain and starts at this step.
// oppFx = a rival's starting support by faction. favors = a rival this scenario is built around (Whitlock can then grow).
// presOverride = the President's opinion of a rival. oppAll / youAll = starting support in every faction.
const BASE_FIELD = ['castellano', 'dunmore', 'rick', 'krantz', 'vaskel', 'whitlock'];
// Scenario ids refer to candidates. The candidate you play is moved into the player slot ('you') automatically.
// desc may be a function of the game state, so a scenario can read differently for each candidate.
const SCENARIOS = [
  { id: 'standard', weight: 50, name: 'The Expected Field',
    desc: 'Six candidates, each from a known faction of the party. No surprises, yet.',
    field: BASE_FIELD },
  { id: 'celebrity', weight: 15, name: 'The Celebrity',
    desc: 'Jake Coburn, a former NFL quarterback and a Cimarron State legend, has been hinting at a run. He has not filed yet. If he enters, the race will change.',
    field: BASE_FIELD, enter: { coburn: 7 }, turnout: { maga: .03, seniors: .02 } },
  { id: 'heir', weight: 11, name: 'The Heir Apparent',
    desc: s => s.player === 'dunmore' ? 'The President has signaled that he favors you. Donors and activists are coming to you before the campaign begins, and every rival will aim at you.'
      : 'The President has signaled that he favors Travis Dunmore. Donors and activists are moving to Dunmore before the campaign begins.',
    field: BASE_FIELD, presOverride: { dunmore: 88 }, oppAll: { dunmore: 3 } },
  { id: 'wounded', weight: 10, name: 'The Wounded Incumbent',
    desc: s => s.player === 'castellano' ? 'In January, your former Chief of Staff, Mark Tolliver, was indicted for steering state contracts to a donor. You were not charged, but every rival will use it.'
      : 'In January, Governor Castellano\'s former Chief of Staff, Mark Tolliver, was indicted for steering state contracts to a donor. The Governor was not charged, but the whole field can smell blood.',
    field: BASE_FIELD, oppAll: { castellano: -3 }, flag: 'indicted' },
  { id: 'reckoning', weight: 6, name: 'The Reckoning',
    desc: s => 'Tension in the Middle East is rising, and oil is already at $110. Many older and business Republicans who stopped voting in primaries say they will come back. MAGA voters are tired and divided. ' + (s.player === 'whitlock' ? 'If a war starts, this could be your year.' : 'If a war starts, this could be the year the old party returns.'),
    field: BASE_FIELD, warAt: 3, favors: 'whitlock', oppAll: { dunmore: -2 },
    oppFx: { whitlock: { seniors: 37, chamber: 31, farm: 31, faith: 19, liberty: 19, guns: 12 } },
    turnout: { seniors: .08, chamber: .12, maga: -.08, online: -.06 } },
  { id: 'boom', weight: 6, name: 'The Boom',
    desc: s => s.player === 'vaskel' ? 'Your data centers have brought 6,000 jobs to Pratt Junction, and the President has praised you twice. For many voters you are no longer a Californian. You are the man who brought the jobs.'
      : 'Brent Vaskel\'s data centers have brought 6,000 jobs to Pratt Junction, and the President has praised him twice. For many voters he is no longer a Californian. He is the man who brought the jobs.',
    field: BASE_FIELD, favors: 'vaskel', presOverride: { vaskel: 70 },
    oppFx: { vaskel: { liberty: 25, online: 25, chamber: 30, maga: 25, farm: 15, seniors: 15 } },
    turnout: { liberty: .08, online: .04, chamber: .04 } },
];

// ---------- The war (a rare random shock) ----------
// If it happens, candidates close to the President lose support in the factions below.
// Loyalty = President's endorsement + the President's opinion + MAGA identity + war stance (hawk).
const WAR = {
  chance: .05,              // probability per game
  earliest: 9, latest: 17,  // the step range in which the war can start
  pivot: .55,               // loyalty above this loses support, below it gains
  rampSteps: 4,             // steps until the oil shock reaches full effect
  spread: 1.2,              // how much more evenly the vote splits at the war's full effect (thinner margins)
  general: 12,              // points the war costs the Republican nominee in November
  weights: { online: 16, farm: 13, seniors: 10, liberty: 9, chamber: 8, maga: 7, guns: 3, faith: -4 },
};

// ---------- Endorsing organizations ----------
// holder = starting holder (null = open). fx = faction bonus for the holder.
const ENDORSERS = {
  rifle:    { name: 'Cimarron Rifle Association',     holder: null,     fx: { guns: 4, maga: 1 } },
  life:     { name: 'Cimarron Right to Life',         holder: null,     fx: { faith: 4, seniors: 1 } },
  farm:     { name: 'Farm Bureau PAC',                holder: null,     fx: { farm: 5 } },
  growth:   { name: 'Club for Growth Action',         holder: null,     fx: { liberty: 4, chamber: 1 } },
  youth:    { name: 'Frontline Youth Action',         holder: null,     fx: { online: 5 } },
  pastors:  { name: 'Council of Cimarron Pastors',    holder: 'rick',   fx: { faith: 4 } },
  sheriffs: { name: 'Cimarron Sheriffs\' Association', holder: 'krantz', fx: { guns: 3, seniors: 2 } },
};

// Staff, openings (records) and running mates for each candidate are in candidates.js.

// ---------- Campaign schedule ----------
// q = question, event = flair event, stop = campaign stop, debate1/2, endorse = the President
const SCHEDULE = ['event', 'q', 'q', 'event', 'stop', 'q', 'event', 'event', 'q', 'debate1', 'stop', 'event', 'q', 'q', 'event',
  'endorse', 'q', 'event', 'stop', 'q', 'event', 'event', 'debate2', 'q', 'event', 'q', 'stop', 'event', 'q', 'election'];

// ---------- The President's endorsement ----------
// He endorses only a candidate who can win: a rival with at least `viable`% in the polls, or you, if his opinion of you
// is at least `youNeed` and you also have `viable`%. Among those, he prefers the one he likes most, then the one polling best.
// The endorsed candidate never drops out, and gains `fx` in each faction: the MAGA base unites behind the President's choice.
const PRES_ENDORSE = {
  viable: 12,
  youNeed: 72,
  fx: { maga: 14, online: 5, seniors: 4, faith: 3, guns: 3, farm: 2 },
};
const ENDORSE_TEXT = {
  castellano: 'The President posts: "Governor Victor Castellano has done a fantastic job on the Border, Crime and Taxes. A brilliant lawyer who fights for us. He has my Complete and Total Endorsement!"',
  whitlock: 'The President posts: "Carol Whitlock has come a long way. She now supports our Agenda, and she has my Endorsement for Governor of Cimarron!"',
  dunmore: 'The President posts: "Travis Dunmore is a true America First Fighter who will never back down. He has my Complete and Total Endorsement for Governor of Cimarron!"',
  rick: 'The President posts: "Pastor Rick Dollins is a great man of Faith and a strong supporter of MAGA. He has my Complete and Total Endorsement!"',
  krantz: 'The President posts: "Sheriff Bo Krantz is tough on Crime and tough on the Border. He has my Complete and Total Endorsement!"',
  vaskel: 'The President posts: "Brent Vaskel is a brilliant businessman who will bring jobs to Cimarron. He has my Complete and Total Endorsement!"',
  coburn: 'The President posts: "Jake Coburn, a Great Champion and a total Winner, has my Complete and Total Endorsement for Governor of Cimarron!"',
};


// ---------- Campaign stops ----------
const STOP_ACTIONS = [
  { id: 'rally', name: 'Hold a Rally', desc: 'Speak to supporters and local media. +4 support in the region.', cost: 0, bonus: 4 },
  { id: 'ads', name: 'TV and Digital Ads', desc: 'A week of paid advertising. Costs $0.6M. +8 support in the region.', cost: .6, bonus: 8 },
  { id: 'gotv', name: 'Get-Out-the-Vote Operation', desc: 'Paid canvassers and church-van rides on primary day. Costs $0.4M. +10% turnout among your supporters in the region.', cost: .4, bonus: 0, gotv: .10 },
  { id: 'fundraise', name: 'Donor Fundraiser', desc: 'Private events with major donors. +$0.8M. −1 support in the region, where voters notice who you spend time with.', cost: -.8, bonus: -1 },
];

// ---------- Other narrative text used by the engine ----------
const TEXT = {
  title: [
    'It is 2030. Cimarron is one of the most conservative states in the country. Democrats have not won a statewide office in twenty years. The general election does not matter. The <b>Republican primary</b> does.',
    'Governor Victor Castellano wants a second term. Five challengers want his job, and each one speaks for a different part of the modern right. Choose one of the six, and win the nomination. In this primary, voters punish any sign of moderation.',
  ],
  fieldIntro: 'The filing deadline has passed. The primary is on August 4. Click any candidate, at any time, to see their profile.',
  debateIntro: {
    1: 'The first debate is at the Harlan County Fairgrounds, broadcast statewide. The moderator is Dale Pruitt of the Cimarron Ledger. After each of your answers you will hear your rivals answer the same question. Four questions.',
    2: 'The final debate is at the Fort Eisenhower Civic Center, two weeks before the primary. Undecided voters are watching closely. Four questions.',
  },
  stop: {
    rally: 'You speak to a large crowd of supporters. Local television covers the event.',
    ads: 'Your ads run on broadcast television, radio, and social media across the region.',
    gotv: 'Your field team signs up volunteers, organizes rides to the polls, and builds a list of every supporter who needs a reminder on primary day.',
    fundraise: 'You meet with major donors at private events. The campaign raises money, but local press report on who was there.',
  },
  stopVerb: { rally: 'hold a rally in', ads: 'run an ad campaign in', gotv: 'build a turnout operation in', fundraise: 'hold a donor fundraiser in' },
  endorseYou: 'The endorsement changes the race. Your campaign receives thousands of calls from volunteers. Your rivals must now attack the President\'s choice.',
  endorseOther: 'This is a serious blow. The MAGA base is uniting behind the President\'s choice, and many evangelicals and gun owners will follow. Your campaign manager says the race can still be won, but only by winning almost everyone else.',
  endorseNoYou: s => `The White House did not seriously consider you. The President's opinion of you is ${Math.round(s.pres)}. His team says he endorses only candidates he trusts completely (${PRES_ENDORSE.youNeed} or more).`,
  dropout: {
    rick: ' "I will continue to serve the Lord through my church," he says.',
    vaskel: ' He says he will continue to fund conservative causes in the state.',
    krantz: ' He says he will return to his duties in Harlan County.',
    dunmore: ' He says the movement "is bigger than one election."',
    coburn: ' "I gave it everything," he says. "Sometimes the other team wins."',
    whitlock: ' She says she hopes the party "finds its way home."',
  },
};
