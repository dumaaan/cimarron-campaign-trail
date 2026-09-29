// ============================================================
// RUNOFF — the three-week campaign after a primary with no winner.
//
// COURT[candidateId]: a meeting with an eliminated candidate who can endorse you.
//   choice.p = chance that they endorse you (a number, or s => number).
//   If they do not, they endorse your rival (60%) or stay neutral (40%).
//   An endorsement moves their two strongest factions (+5) and every faction (+1).
// RUNOFF_EVENTS: crises during the runoff. Same format as EVENTS, and text may use rivalName(s).
// Extra fx keys: oppRival (support for your rival in every faction), presEndorse ('you' or 'rival').
// ============================================================

const rivalName = s => displayName(s, s.runoff.rival);
const rivalShort = s => shortName(s, s.runoff.rival);

const RUNOFF_TEXT = {
  intro: s => `No candidate reached 40%. You and ${rivalName(s)} go to a runoff on August 25, three weeks from tonight. The candidates you eliminated still hold a large part of the vote. Their endorsements, and whether their voters come back to the polls, will decide the race.`,
  endorsed: { you: 'Endorses you', rival: 'Endorses your rival', none: 'Stays neutral' },
};

const COURT = {
  dunmore: { title: 'Courting the Movement',
    text: 'Travis Dunmore is out, but his voters are the largest block still in play, and they follow him, not the party. He agrees to meet you in his studio. His price is high.',
    choices: [
      { text: 'Make him Director of Border Enforcement, with his own budget and staff.', p: .7, fx: { maga: 2, seniors: -1, chamber: -2 },
        fb: 'He accepts the title before he accepts your hand.' },
      { text: 'Adopt his plan for hand counts in all future elections.', p: .55, fx: { maga: 2, seniors: 1 },
        fb: 'County clerks are unhappy. Dunmore\'s audience is not.' },
      { text: 'Go on his show for three hours and answer anything.', p: .45, fx: { online: 2, maga: 1 },
        fb: 'Three long hours. Some of his listeners hear you for the first time.' },
      { text: 'Do not court him. Speak to his voters directly.', p: .1, fx: { seniors: 1 },
        fb: 'You keep your independence. You may lose his voters with it.' },
    ] },
  rick: { title: 'The Pastor\'s Blessing',
    text: 'Pastor Rick is out of the race. His church network can put thousands of voters in vans on runoff day, or keep them home. He receives you in his office at Cornerstone.',
    choices: [
      { text: 'Pledge to sign his bill to close most businesses on Sundays.', p: .7, fx: { faith: 2, chamber: -3, liberty: -2 },
        fb: 'Retailers and the Liberty Caucus object. The pastors are pleased.' },
      { text: 'Create an Office of Faith and Family, led by a Cornerstone elder.', p: .6, fx: { faith: 2, liberty: -1 },
        fb: 'A real office with a real budget. Critics call it a church inside the government.' },
      { text: 'Ask for his prayers and his endorsement, and promise nothing.', p: .25, fx: { faith: 1 },
        fb: 'He prays with you. He does not commit.' },
    ] },
  krantz: { title: 'The Sheriff\'s Terms',
    text: 'Sheriff Krantz is out. Gun owners in the rural counties trust him more than any candidate. He has three demands, written on a single sheet of paper.',
    choices: [
      { text: 'Support a constitutional amendment giving sheriffs final authority in their counties.', p: .75, fx: { guns: 3, seniors: -2, chamber: -2 },
        fb: 'Legal scholars are alarmed. Gun owners are not.' },
      { text: 'End the state investigation of the Harlan County jail.', p: .6, fx: { guns: 2, seniors: -2 },
        fb: 'The family of the dead inmate says you have traded justice for votes.' },
      { text: 'Promise to push for the transfer of federal land to the state.', p: .5, fx: { guns: 1, farm: 2 },
        fb: 'A popular promise in the rural counties, and a long legal fight.' },
    ] },
  vaskel: { title: 'The Investor\'s Checkbook',
    text: 'Brent Vaskel is out, but his money is not. His super PAC still has $5 million. He will use it for you, or against you.',
    choices: [
      { text: 'Approve the state exemptions for his charter city.', p: .7, fx: { liberty: 2, money: 1.5, farm: -2, seniors: -1 },
        fb: 'His super PAC starts running ads for you the next day.' },
      { text: 'Make him chair of a state "Efficiency Commission."', p: .55, fx: { liberty: 2, seniors: -1 },
        fb: 'State employees are nervous. Vaskel is flattered.' },
      { text: 'Ask for his donors, not his endorsement.', p: .3, fx: { money: .8 },
        fb: 'Some of his donors write checks. He keeps his own options open.' },
    ] },
  whitlock: { title: 'The Last Moderate',
    text: 'Carol Whitlock is out. Her voters are few, but they are older and they always vote. She wants proof that you will govern responsibly.',
    choices: [
      { text: 'Promise to restore aid to rural counties and to balance the budget.', p: .7, fx: { chamber: 2, seniors: 1, rino: 2 },
        fb: 'She endorses you in a short, dignified statement. Your rival calls you "Carol\'s candidate."' },
      { text: 'Promise a bipartisan water plan for the Panhandle.', p: .5, fx: { farm: 1, rino: 1 },
        fb: 'A serious policy. Farmers in the Panhandle notice.' },
      { text: 'Ask for her voters without her name.', p: .2, fx: {},
        fb: 'She will not lend her voters to someone who will not take her name.' },
    ] },
  coburn: { title: 'The Quarterback\'s Handshake',
    text: 'Jake Coburn is out, and he is still the most famous man in the state. His voters are casual Republicans who came to the primary for him.',
    choices: [
      { text: 'Adopt his plan to cut the state gas tax to zero.', p: .6, fx: { farm: 2, seniors: 2, liberty: 1 },
        fb: 'A popular promise. Your budget director asks how you will pay for it.' },
      { text: 'Offer him the chair of the state tourism and sports commission.', p: .6, fx: { seniors: 1, maga: 1 },
        fb: 'He likes the title. He likes the stadium box more.' },
      { text: 'Hold a joint rally with him at the stadium.', p: .45, fx: { maga: 2, money: -.2 },
        fb: 'The crowd is huge. It is not clear who they came to see.' },
    ] },
  albright: { title: 'The Doctor\'s Conditions',
    text: 'Dr. Albright is out. Her movement of health-freedom parents is angry and organized. She wants commitments, in writing.',
    choices: [
      { text: 'End all vaccine mandates, including for health care workers.', p: .75, fx: { online: 3, liberty: 2, seniors: -3 },
        fb: 'Hospital associations warn of outbreaks. Her movement celebrates.' },
      { text: 'Appoint her Surgeon General of Cimarron.', p: .65, fx: { online: 2, seniors: -2 },
        fb: 'Doctors are alarmed. Her followers are thrilled.' },
      { text: 'Promise a review of the state medical board.', p: .35, fx: { liberty: 1 },
        fb: 'She calls it "a start," which is not an endorsement.' },
    ] },
  pike: { title: 'The Streamer\'s Demands',
    text: 'Mason Pike is out, but his young followers are waiting for his instructions. He agrees to talk to you, on his stream, live.',
    choices: [
      { text: 'Promise a moratorium on all immigration to Cimarron, legal and illegal.', p: .7, fx: { online: 4, maga: 2, chamber: -4, farm: -3, seniors: -1 },
        fb: 'His chat explodes with approval. Business leaders and farmers are shocked.' },
      { text: 'Oppose any American involvement in foreign wars, on his stream.', p: .55, fx: { online: 3, pres: -5, faith: -2 },
        fb: 'The clip travels fast, including to the White House.' },
      { text: 'Refuse to appear, and condemn his rhetoric.', p: 0, fx: { seniors: 2, faith: 1, online: -3 },
        fb: 'Church leaders thank you. Pike tells his audience to vote against you.' },
    ] },
};

const RUNOFF_EVENTS = [
  { id: 'r_turnout', kind: 'Strategy', title: 'The Turnout War',
    text: s => `Runoff turnout is expected to fall to about 80% of the primary. Your field director says the runoff will be won by whoever brings their voters back, not by whoever persuades new ones. ${rivalShort(s)} is already running church vans and phone banks.`,
    advice: [['pryce', 'Put every dollar we have into turnout.'], ['tom', 'Churches will drive people to the polls if we ask them properly.']],
    choices: [
      { text: 'Spend $1M on a statewide turnout operation.', fx: { money: -1, gotvAll: .06 }, fb: 'Canvassers knock on 180,000 doors in three weeks.' },
      { text: 'Organize church rides in Caney Ridge and Lake Cheney.', fx: { faith: 2, gotv: { bible: .08, cheney: .08 } }, fb: 'The most reliable voters get the most reliable rides.' },
      { text: 'A digital and text-message campaign aimed at young voters.', fx: { online: 2, money: -.3, gotv: { osgood: .04, lawrence: .04 } }, fb: 'Cheap, fast, and less certain.' },
      { text: 'Trust your voters to come back on their own.', fx: {}, fb: 'Some will. Some will not.' },
    ] },
  { id: 'r_attack', kind: 'Opposition', title: 'The Final Attack Ad',
    text: s => `${rivalName(s)}'s campaign runs a statewide ad calling you "the establishment's last chance to stop the movement." It uses every moderate thing you have said in the campaign.`,
    advice: [['wade', 'Answer it hard. Silence in a runoff is surrender.'], ['dana', 'The ad works only if you look defensive.']],
    choices: [
      { text: 'Hit back with an ad on your rival\'s weakest point.', fx: { money: -.4, oppRival: -3, maga: 1 }, fb: 'The race becomes a fight. Your rival\'s numbers fall.' },
      { text: 'Answer with your record: four years of results.', fx: { seniors: 2, chamber: 1 }, fb: 'Older voters respond. The base wanted a fight.' },
      { text: 'Ignore it.', fx: { maga: -2 }, fb: 'The ad runs unanswered for a week.' },
    ] },
  { id: 'r_president', kind: 'Party', title: 'The President\'s Second Choice',
    cond: s => s.endorsed !== 'you' && s.endorsed !== s.runoff.rival,
    text: s => `The President has not endorsed in the runoff. ${s.endorsed ? `His candidate, ${displayName(s, s.endorsed)}, is out of the race. ` : ''}Both campaigns are calling the White House.`,
    advice: [['wade', 'Call him. Tonight.'], ['pryce', 'If you ask and he says no, he will endorse your rival instead.']],
    choices: [
      { text: 'Ask the President directly for his endorsement.', fx: {},
        risk: { p: s => clamp(s.pres / 110, .1, .9),
          win: { fx: { presEndorse: 'you' }, fb: 'The President posts his endorsement of you at 11:40 p.m.' },
          lose: { fx: { presEndorse: 'rival' }, fb: 'The President endorses your rival the next morning.' } } },
      { text: 'Stay quiet and hope he stays out.', fx: {}, fb: 'He stays out, for now.' },
    ] },
  { id: 'r_rival_pres', kind: 'Party', title: 'The Tele-Rally',
    cond: s => s.endorsed === s.runoff.rival,
    text: s => `The President holds a tele-rally for ${rivalName(s)}. More than 100,000 Cimarron households are on the call. He calls your rival "a true fighter" and does not mention you.`,
    advice: [['wade', 'Do not attack the President. Ever.'], ['dana', 'Our voters who like the President also like you. Remind them.']],
    choices: [
      { text: '"I support the President 100%. I just have a better record."', fx: { maga: 2, seniors: 1 }, fb: 'You stay close to him without asking for anything.' },
      { text: 'Criticize the endorsement: "Cimarron decides for itself."', fx: { liberty: 2, online: 1, maga: -3, pres: -8 }, fb: 'Independent-minded voters like it. His supporters do not.' },
      { text: 'Focus only on local issues.', fx: { farm: 1, seniors: 1 }, fb: 'A quiet week. The call is the story.' },
    ] },
  { id: 'r_debate', kind: 'Media', title: 'One on One',
    text: s => `The runoff debate on KCIM-TV. It is just you and ${rivalName(s)}. The moderator asks: "Why you, and not your opponent?"`,
    advice: [['dana', 'Undecided voters in a runoff are mostly supporters of the eliminated candidates. Speak to them.']],
    choices: [
      { text: '"I have already done what my opponent only talks about."', fx: { seniors: 2, maga: 1, oppRival: -1 }, fb: 'Your record is your strongest argument in a two-person race.' },
      { text: 'Attack your opponent\'s biggest weakness, directly.', fx: { oppRival: -3, seniors: -1 }, fb: 'A sharp exchange. The clip runs all week.' },
      { text: 'Speak to the eliminated candidates\' voters: "There is room for all of you."', fx: { seniors: 1, faith: 1, guns: 1, farm: 1, online: 1 }, fb: 'A broad appeal. It lands with the voters who are still deciding.' },
      { text: '"I will be governor for every Cimarronian."', fx: { rino: 2, chamber: 2 }, fb: 'A general-election answer, three weeks too early.' },
    ] },
  { id: 'r_early_vote', kind: 'Strategy', title: 'Early Vote Numbers',
    text: s => `Early voting data show that turnout is down in your strongest regions and up in ${rivalShort(s)}'s. Your staff want to move the last of the money.`,
    advice: [['pryce', 'Move it to the regions where our voters are staying home.'], ['wade', 'Move it to television. One more message.']],
    choices: [
      { text: 'Move the money into turnout operations in every region.', fx: { money: -.6, gotvAll: .03 }, fb: 'Your field team calls every supporter who has not voted.' },
      { text: 'One last statewide TV ad.', fx: { money: -.6, seniors: 1, maga: 1 }, fb: 'The ad runs until the polls open.' },
      { text: 'Keep the money for the general election.', fx: {}, fb: 'A calculated risk.' },
    ] },
];
