// ============================================================
// CAMPAIGNS — events for each candidate's own campaign, their running mates, the Governor as a rival,
// and Mason Pike. Same format as events.js; these events are added to EVENTS.
//
// Each playable candidate has:
//   a mechanic of their own (3 events of one kind, see CAMPAIGN_KINDS), and 5 or 6 story events.
// fx.label raises or lowers your weak-spot label (PLAYER_INFO in candidates.js).
// ============================================================

const only = id => s => s.player === id;
const CAMPAIGN_KINDS = {
  "Governor's Desk": '#8a1c2b', 'The Show': '#c25a12', 'The Pulpit': '#553080',
  'The Badge': '#5c4a1f', 'The Checkbook': '#0f6f6f', 'The Long Game': '#4d6480', Influencer: '#2b2b2b',
};
Object.assign(EVENT_KINDS, CAMPAIGN_KINDS);
for (const k in CAMPAIGN_KINDS) KIND_LIMITS[k] = 3;
KIND_LIMITS.Influencer = 2;
// Story events for your own candidate come up more often than general events.
const OWN = 5;

EVENTS.push(
  // ================= GOVERNOR CASTELLANO =================
  { id: 'gov_resort', kind: 'Scandal', title: 'The Resort Photos', minStep: 5, weight: OWN, cond: only('castellano'),
    text: 'An ice storm hits the Panhandle. 40,000 homes have no power, and it is 9 degrees in Dry Fork. You are at a beach resort in Los Cabos with your family. A passenger on your flight posts photos of you in the airport lounge in shorts. By noon, every station in Cimarron is showing them.',
    advice: [
      ['wade', 'Get on a plane now. Every hour you stay there is an ad for Dunmore.'],
      ['pryce', 'Travis is acting governor while you are out of the state. He is already on television in a borrowed coat.'],
      ['dana', 'Voters forgive a vacation. They do not forgive a vacation during a disaster.'],
    ],
    choices: [
      { text: 'Fly home tonight and go straight to Dry Fork.', fx: { seniors: 2, farm: 2, label: 1, money: -.1 },
        fb: 'You are in Dry Fork by sunrise, in a coat that still has the store tags on it. The photos are still everywhere, but so is this one.' },
      { text: 'Explain that the trip was planned for months and your staff managed the storm.', fx: { seniors: -2, farm: -3, maga: -1, label: 2 },
        fb: 'Everything you said is true. It does not matter. "His staff managed the storm" becomes a slogan.' },
      { text: 'Blame the rural power co-ops and federal grid rules.', fx: { liberty: 1, maga: 1, farm: -2, label: 1 },
        fb: 'The co-ops are run by the farmers you are blaming. They say so, loudly.' },
      { text: 'Apologize on camera from the airport: "I should have been home."', fx: {},
        risk: { p: .55,
          win: { fx: { seniors: 3, farm: 2, label: -1 }, fb: 'A short, human apology. For once, you do not sound like a lawyer, and voters notice.' },
          lose: { fx: { seniors: -1, maga: -2, label: 1 }, fb: 'The apology has three qualifications and a footnote. Late-night hosts read it aloud.' } } },
    ] },
  { id: 'gov_oped', kind: 'Opposition', title: 'The 2012 Op-Ed', minStep: 6, weight: OWN, cond: only('castellano'),
    text: 'Dunmore\'s researchers find an op-ed you wrote in 2012, as a young lawyer, for a national business journal. In it, you support a guest-worker program and call a border wall "an expensive monument to failure." The op-ed is now on a billboard on Interstate 40.',
    advice: [
      ['wade', 'Everyone changed their mind about something in 2016. Say you did too.'],
      ['pryce', 'You wrote it for a client. That is the truth, and it is a terrible answer.'],
      ['kyle', 'Answer with action, not words. Nobody reads op-eds. Everyone watches troopers.'],
    ],
    choices: [
      { text: '"I was wrong. I changed my mind, like millions of Republicans did."', fx: { seniors: 2, maga: -1, label: 1 },
        fb: 'An honest answer. It confirms what Dunmore says about you, but it ends the story.' },
      { text: '"I wrote that for a client. Lawyers argue positions."', fx: {},
        risk: { p: .4,
          win: { fx: { chamber: 1 }, fb: 'The explanation is technical enough that the story dies of boredom.' },
          lose: { fx: { maga: -3, label: 3 }, fb: '"Lawyers argue positions" is now the most quoted sentence of your campaign. It explains everything your rivals say about you.' } } },
      { text: 'Say the op-ed was taken out of context and attack the Ledger.', fx: { maga: 2, online: 1, seniors: -1, label: 2 },
        fb: 'The Ledger prints the full text. It is not out of context.' },
      { text: 'Answer with action: add 200 troopers to Operation Heartland.', fx: { maga: 3, farm: -2, money: -.2, label: -1 },
        fb: 'Nobody can say you believe in guest workers when 200 more troopers are on the roads. Farmers can say other things.' },
    ] },
  { id: 'gov_2032', kind: 'Party', title: 'Litigate America', minStep: 9, weight: OWN, cond: only('castellano'),
    text: 'The Ledger reports that your national political committee, "Litigate America," has raised $6 million, mostly in Iowa, Texas and Florida. A donor is quoted: "Victor sees Cimarron as a stepping stone." Every rival has a new line by lunchtime.',
    advice: [
      ['dana', 'Voters like an ambitious governor. They do not like being the stepping stone.'],
      ['wade', 'Pledge to serve the full term. You can always change your mind in 2032. Everyone does.'],
      ['pryce', 'Close the committee and move the money here. It is the only answer that ends the story.'],
    ],
    choices: [
      { text: 'Pledge publicly to serve the full four-year term.', fx: { seniors: 3, maga: 1, pres: -2, label: -1, flag: 'full_term' },
        fb: 'The pledge helps at home. In Washington, the President\'s people hear that you are not a threat, and not a player.' },
      { text: 'Refuse to rule anything out: "I am focused on Cimarron."', fx: { chamber: 1, pres: 2, label: 2 },
        fb: 'Everyone hears the answer you did not give.' },
      { text: 'Close Litigate America and move its money into your campaign.', fx: { money: 1, pres: -3, label: -1 },
        fb: 'The national press calls it a retreat. The money is very useful.' },
    ] },
  // ---- The Governor's Desk: real power, once a month ----
  { id: 'desk_veto', kind: "Governor's Desk", title: 'The Veto Pen', minStep: 3, weight: OWN, cond: only('castellano'),
    text: 'The legislature sends you a $400 million property-tax relief bill for homeowners. To pay for it, the bill delays the last phase of your income tax repeal by two years. You have ten days to sign it or veto it.',
    advice: [
      ['dana', 'Property taxes are the number one issue for older voters. The income tax is number one for donors.'],
      ['pryce', 'If you veto it, the House leadership will remember in January.'],
      ['wade', 'Sign it and say you cut taxes twice.'],
    ],
    choices: [
      { text: 'Sign it: "Two tax cuts for the price of one."', fx: { seniors: 4, farm: 2, liberty: -3, chamber: -1 },
        fb: 'Retirees in Lake Cheney are delighted. The Club for Growth calls it "a tax increase with a smile."' },
      { text: 'Veto it: "I will not break my promise on the income tax."', fx: { liberty: 4, chamber: 2, seniors: -3 },
        fb: 'Principled and expensive. Senior centers post your veto message on their bulletin boards, with notes.' },
      { text: 'Use your line-item veto: keep the relief, strike the delay.', fx: {},
        risk: { p: .5,
          win: { fx: { seniors: 3, liberty: 2 }, fb: 'The courts have never tested this use of the line-item veto. The Attorney General lets it stand.' },
          lose: { fx: { seniors: -1, liberty: -1, label: 1 }, fb: 'A judge rules the line-item veto unconstitutional. Neither side gets what it wanted, and both blame you.' } } },
    ] },
  { id: 'desk_session', kind: "Governor's Desk", title: 'Special Session', minStep: 8, weight: OWN, cond: only('castellano'),
    text: 'You can call the legislature back to the Capitol for a special session on one subject. Every rival has said you are "all talk." The session would begin in two weeks.',
    advice: [
      ['wade', 'Give the base something to watch. Make it immigration.'],
      ['dana', 'Property taxes move more voters than any other issue.'],
      ['pryce', 'Every special session costs a million dollars and a few friendships.'],
    ],
    choices: [
      { text: 'Heartland II: make illegal entry a state felony.', fx: { maga: 4, online: 2, farm: -2, chamber: -2 },
        fb: 'The bill passes in nine days. It is in federal court in ten.' },
      { text: 'Property-tax caps for every homeowner.', fx: { seniors: 4, liberty: 1, farm: 1 },
        fb: 'The caps pass. County commissioners say they will cut deputies to pay for them.' },
      { text: 'Hand counts in every county.', fx: { maga: 3, seniors: 1, chamber: -2, money: -.1 },
        fb: 'The county clerks say it cannot be done by November. You say they will find a way.' },
      { text: 'No session. "The people\'s business can wait until January."', fx: { seniors: 1, maga: -2 },
        fb: 'The legislators are relieved. Your rivals call you "the Governor of waiting."' },
    ] },
  { id: 'desk_clemency', kind: "Governor's Desk", title: 'The Clemency List', minStep: 12, weight: OWN, cond: only('castellano'),
    text: 'The Pardon Board sends you its list. Three cases have national attention: a Heartland trooper convicted of excessive force during an arrest; a pastor jailed for holding services during the 2020 COVID orders; and a 71-year-old grandmother who voted in the wrong county by mistake. You can act on one before the primary.',
    advice: [
      ['wade', 'The trooper. The base thinks he was doing his job.'],
      ['tom', 'The pastor. Every church in the state knows his name.'],
      ['dana', 'The grandmother. Everyone over 60 thinks it could have been them.'],
    ],
    choices: [
      { text: 'Pardon the Heartland trooper.', fx: { guns: 3, maga: 2, seniors: -2, farm: -1 },
        fb: 'Police unions cheer. The man he injured is on every channel by evening.' },
      { text: 'Pardon the pastor.', fx: { faith: 4, online: 1, chamber: -1 },
        fb: 'He preaches the next Sunday. Your name is in the sermon.' },
      { text: 'Commute the grandmother\'s sentence.', fx: { seniors: 3, maga: -1 },
        fb: 'A kind act. Election-integrity activists say you are "soft on voter fraud."' },
      { text: 'Act on none of them before the primary.', fx: { seniors: 1, label: 1 },
        fb: 'The safe choice, and it looks like one.' },
    ] },

  // ================= WHEN YOU RUN AGAINST THE GOVERNOR =================
  { id: 'gov_resort_rival', kind: 'Opposition', title: 'Where Was Victor?', minStep: 5, weight: OWN, cond: s => !isGov(s) && inRace(s, 'castellano'),
    text: 'An ice storm hits the Panhandle. 40,000 homes have no power, and it is 9 degrees in Dry Fork. Governor Castellano is at a beach resort in Mexico with his family, and a passenger has posted photos of him in the airport lounge. The Governor\'s office says "staff are managing the response."',
    advice: [
      ['wade', 'This is the moment of the campaign. Do not waste it.'],
      ['dana', 'Voters want someone in Dry Fork, not someone on television talking about Dry Fork.'],
      ['kyle', 'The photos do the work. We just need a caption.'],
    ],
    choices: [
      { text: 'Drive to Dry Fork with generators and supplies. No cameras.', fx: { farm: 3, seniors: 2, money: -.2, opp: { castellano: -2 }, flag: 'resort_seen' },
        fb: 'The cameras find you anyway. You are carrying a generator. The Governor is carrying a margarita.' },
      { text: 'Run an ad by nightfall: "Where was Victor?"', fx: { money: -.4, maga: 2, seniors: -1, opp: { castellano: -4 }, flag: 'resort_seen' },
        fb: 'The ad is cruel and effective. Some voters think it is too early for politics while people are cold.' },
      { text: 'Say nothing about the Governor. Ask people to pray for the Panhandle.', fx: { faith: 2, seniors: 1 },
        fb: 'Gracious. The Governor\'s rivals take the opportunity you left on the table.' },
      { text: 'As Lieutenant Governor, take command of the emergency response yourself.', cond: only('dunmore'), unlock: 'You are Lieutenant Governor',
        fx: { flag: 'resort_seen' },
        risk: { p: .6,
          win: { fx: { farm: 4, seniors: 3, maga: 2, opp: { castellano: -4 } }, fb: 'For four days, you are the governor. The power comes back, the shelters are warm, and your show is broadcast from the emergency center.' },
          lose: { fx: { farm: -3, seniors: -3, label: 1 }, fb: 'The response is chaotic. Two shelters run out of propane. The Governor flies home and takes command from you, on camera.' } } },
    ] },
  { id: 'tolliver_rival', kind: 'Opposition', title: 'The Tolliver Case', priority: true, cond: s => !isGov(s) && !!s.flags.indicted && s.step >= 7 && inRace(s, 'castellano'),
    text: 'Mark Tolliver, the Governor\'s former Chief of Staff, accepts a plea deal on the contract charges. His lawyer tells reporters that Tolliver "will tell the truth about who knew what." Governor Castellano says he "looks forward to the facts." Every candidate is asked what the Governor knew.',
    advice: [
      ['wade', 'Say what everyone is thinking. The Governor knew.'],
      ['pryce', 'We do not know what he knew. If we accuse him and Tolliver says nothing, we look reckless.'],
      ['dana', 'Voters already believe the worst. You do not need to say it for them.'],
    ],
    choices: [
      { text: 'Call on the Governor to release every email about state contracts.', fx: { seniors: 2, chamber: 1, opp: { castellano: -3 } },
        fb: 'A reasonable demand. The Governor does not answer it, which becomes the story.' },
      { text: 'Say the Governor "knew, and everyone in the Capitol knows he knew."', fx: {},
        risk: { p: .5,
          win: { fx: { maga: 3, opp: { castellano: -5 } }, fb: 'Tolliver\'s hearing supports you. The Governor\'s numbers fall for two weeks in a row.' },
          lose: { fx: { seniors: -2, label: 1 }, fb: 'Tolliver\'s testimony does not name the Governor. Your accusation looks reckless.' } } },
      { text: 'Promise a state inspector general for every contract.', fx: { seniors: 2, liberty: 2, chamber: 1 },
        fb: 'A policy answer to a scandal. It will be in your first 100 days.' },
    ] },
  { id: 'gov_warchest', kind: 'Opposition', title: 'The Governor\'s Money', minStep: 10, weight: 2, cond: s => !isGov(s) && inRace(s, 'castellano') && placeOf(s) <= 2,
    text: 'Governor Castellano has $14 million, more than every other campaign combined. This week he spends $3 million of it on you. The ad calls you "a risk Cimarron cannot afford," and it runs in every market in the state.',
    advice: [
      ['wade', 'Hit back, or the ad becomes who you are.'],
      ['dana', 'Our voters do not trust him either. Remind them why.'],
      ['pryce', 'We cannot match his money. We can make his money the story.'],
    ],
    choices: [
      { text: 'Answer with your own ad about the resort, the lawsuits and 2032.', fx: { money: -.5, maga: 2, opp: { castellano: -3 } },
        fb: 'A good ad. It costs a sixth of his, and it works almost as well.' },
      { text: 'Make his money the story: "Victor\'s donors are buying this election."', fx: { maga: 2, online: 2, chamber: -2, opp: { castellano: -2 } },
        fb: 'It does not stop his ads. It makes every one of them look like proof.' },
      { text: 'Ignore it and keep campaigning in small towns.', fx: { farm: 1, seniors: -2 },
        fb: 'His ad runs forty times a day. Some of it sticks.' },
    ] },

  // ================= MASON PIKE, THE INFLUENCER =================
  { id: 'pike_invite', kind: 'Influencer', title: 'The Stream Invite', minStep: 3, maxStep: 16, weight: 2, cond: s => !s.flags.pike_ally && !s.flags.pike_snub,
    text: 'Mason Pike, a 31-year-old streamer with two million followers, invites you onto his stream. Pike co-hosts a weekly show with the President\'s son, Chase, and the young right follows both of them. Critics have documented ugly remarks on his stream. He calls them "smears."',
    advice: [
      ['kyle', 'Two million young voters, and a direct line to the President\'s son. Nothing else this month comes close.'],
      ['tom', 'Pastors will ask why you sat next to him. Some of them have seen the clips.'],
      ['dana', 'Older voters have never heard of him. That is good until the day they do.'],
    ],
    choices: [
      { text: 'Go on the stream for two hours.', fx: { online: 4, maga: 1, seniors: -2, flag: 'pike_ally' },
        fb: 'Two hours, 400,000 live viewers. Pike calls you "one of the good ones." You hope nobody clips that.' },
      { text: 'Send your running mate instead.', fx: { online: 2, flag: 'pike_ally' },
        fb: 'Pike is polite, and a little offended. His audience notices you did not come yourself.' },
      { text: 'Decline politely.', fx: { online: -2, seniors: 1, flag: 'pike_snub' },
        fb: 'Pike reads your decline on air, slowly, and his chat laughs.' },
    ] },
  { id: 'pike_son', kind: 'Influencer', title: 'The Son\'s Number', minStep: 7, maxStep: 15, weight: 4, cond: s => since(s, 'pike_ally') >= 2,
    text: 'Pike calls. "Chase likes you," he says. The President\'s son could put in a word with his father before the endorsement. Pike wants something first.',
    advice: [
      ['wade', 'The President listens to his son more than to his staff. This is a real door.'],
      ['pryce', 'Anything we give Pike will be in the Ledger by August.'],
      ['kyle', 'Pike\'s friend is a very good digital operative. That part is not even a bad deal.'],
    ],
    choices: [
      { text: 'Hire Pike\'s friend as your digital director.', fx: { online: 2, pres: 6, label: 1 },
        fb: 'Your new digital director is 26 and very effective. His old posts are a problem for later.' },
      { text: 'Hold a rally with Chase in Osgood.', fx: { maga: 2, pres: 8, seniors: -1, money: -.2 },
        fb: 'Chase speaks for eleven minutes about his father. The President posts the video.' },
      { text: 'Promise Pike an hour-long interview every month if you win.', fx: { online: 3, pres: 3, seniors: -1 },
        fb: 'Pike is delighted. The promise will be expensive in ways you cannot see yet.' },
      { text: 'Decline. You will earn the endorsement yourself.', fx: { seniors: 1 },
        fb: 'Pike says he understands. He does not.' },
    ] },
  { id: 'pike_turns', kind: 'Influencer', title: 'Pike Turns', priority: true, cond: s => since(s, 'pike_snub') >= 4,
    text: 'Pike has decided you are "a coward who hides from young Americans." For a week his stream covers little else. His followers flood your posts, your events and your volunteers\' phones.',
    advice: [
      ['kyle', 'Do not fight him on his platform. He has two million people. We have eleven interns.'],
      ['dana', 'Older voters are starting to notice him because of this. That may help us.'],
      ['wade', 'Go on the stream. Take the fight to him.'],
    ],
    choices: [
      { text: 'Ignore him completely.', fx: { online: -3, seniors: 1 },
        fb: 'His followers get bored in ten days. The ones who vote remember.' },
      { text: 'Tell reporters what is in his old clips.', fx: { faith: 2, seniors: 2, online: -3 },
        fb: 'Pastors and older voters thank you. Pike\'s audience has never been larger.' },
      { text: 'Go on his stream after all.', fx: {},
        risk: { p: .4,
          win: { fx: { online: 4, seniors: 1 }, fb: 'You are funny, calm and prepared. Pike calls it a draw, which his chat calls a loss.' },
          lose: { fx: { online: -2, seniors: -3, label: 1 }, fb: 'Three hours on his terms. The only clip anyone shares is you agreeing with him.' } } },
    ] },
);

EVENTS.push(
  // ================= TRAVIS DUNMORE: THE SHOW =================
  { id: 'show_monday', kind: 'The Show', title: 'Monday Night', minStep: 1, weight: OWN, cond: only('dunmore'),
    text: 'The show is live in two hours. 400,000 people will listen tonight, and the clips will reach millions. Your producer needs a topic.',
    advice: [
      ['wade', 'Go after the Governor\'s donors. Names, amounts, photos.'],
      ['dana', 'Farmers are the voters we are losing. Take their calls for an hour.'],
      ['kyle', 'Four hours live on the border. The clips will run all week.'],
    ],
    choices: [
      { text: 'The Chamber\'s Fifty: name every big donor to the Governor.', fx: { online: 3, maga: 2, chamber: -3, opp: { castellano: -2 } },
        fb: 'Two of the donors call their lawyers. The episode is your most downloaded of the year.' },
      { text: 'An hour of calls from farmers.', fx: { farm: 3, seniors: 1, online: -1 },
        fb: 'Slower radio than usual. The callers are angry about diesel and soybeans, and they like that you listened.' },
      { text: 'Four hours live from the border in Texas.', fx: { maga: 3, online: 2, money: -.2 },
        fb: 'You stand at the wall for four hours. Your audience stays for all of it.' },
      { text: 'Read the Governor\'s 2012 op-ed aloud, line by line.', cond: s => inRace(s, 'castellano'), fx: { maga: 2, online: 1, opp: { castellano: -3 } },
        fb: '"An expensive monument to failure." You read it three times. The Governor\'s team does not respond.' },
    ] },
  { id: 'show_guest', kind: 'The Show', title: 'The Big Guest', minStep: 6, weight: OWN, cond: only('dunmore'),
    text: 'Three guests want the Thursday hour: the widow of a Harlan deputy killed by a man who was in the country illegally, a retired general who wants to talk about the Middle East, and a crypto founder who will pay for a full sponsorship.',
    advice: [
      ['wade', 'The widow. Nobody can argue with her.'],
      ['pryce', 'The sponsorship pays for three weeks of the campaign.'],
      ['kyle', 'The general is great television, until he says something about the President.'],
    ],
    choices: [
      { text: 'The widow.', fx: { maga: 3, guns: 2, seniors: 2 },
        fb: 'The hour is quiet and very powerful. Several stations replay it.' },
      { text: 'The general.', fx: {},
        risk: { p: .5,
          win: { fx: { seniors: 3, guns: 1, faith: 1 }, fb: 'The general is sharp and patriotic. Older listeners write in for weeks.' },
          lose: { fx: { maga: -2, pres: -4 }, fb: 'The general calls the President\'s Middle East policy "reckless." It is your show.' } } },
      { text: 'The crypto founder, with the sponsorship.', fx: { money: .8, online: 1, label: 1 },
        fb: 'The money is good. The ad reads during the episode are long and very enthusiastic.' },
    ] },
  { id: 'show_sponsor', kind: 'The Show', title: 'The Sponsor Pulls Out', minStep: 12, weight: OWN, cond: only('dunmore'),
    text: 'Your largest sponsor, a truck dealership chain, pulls its ads after a caller says something ugly on air and you do not stop him. The show loses $40,000 a week. Your producer has ideas for replacing it.',
    advice: [
      ['wade', 'Sell the hats. The audience wants to buy something.'],
      ['pryce', 'Ask the listeners directly. They like to feel they own the show.'],
      ['kyle', 'Apologize for the caller. The sponsor comes back, and nobody remembers.'],
    ],
    choices: [
      { text: 'Launch a line of "Deport Them All" hats and shirts.', fx: { money: .6, maga: 1, label: 2 },
        fb: 'They sell out in a day. The Ledger checks where they were made.' },
      { text: 'Ask the listeners to support the show directly.', fx: { money: .4, online: 2 },
        fb: '11,000 listeners sign up at $5 a month. You thank every one of them by name, for an hour.' },
      { text: 'Apologize for the caller on air.', fx: { seniors: 2, online: -2, money: .2 },
        fb: 'The sponsor returns. Part of your audience calls you soft.' },
    ] },
  { id: 'dun_taxes', kind: 'Scandal', title: 'The Unfiled Returns', minStep: 4, weight: OWN, cond: only('dunmore'),
    text: 'The Cimarron Ledger reports that you did not file state income tax returns for three years before the income tax was repealed. You owe about $31,000, plus penalties. The Governor\'s campaign calls it "a tax strike for one."',
    advice: [
      ['pryce', 'Pay it today, with penalties. The check is the end of the story.'],
      ['wade', 'The tax was illegitimate. Half your audience agrees.'],
      ['dana', 'Older voters pay their taxes. They do not like people who do not.'],
    ],
    choices: [
      { text: 'Pay everything, with penalties, and post the check.', fx: { seniors: 2, money: -.1, label: 1 },
        fb: 'Clean and fast. It still confirms the story, but it ends it.' },
      { text: '"The state income tax was illegitimate. We repealed it for a reason."', fx: { liberty: 2, maga: 2, seniors: -3, label: 1 },
        fb: 'Your audience agrees. Retirees who paid theirs do not.' },
      { text: 'Blame your former accountant.', fx: {},
        risk: { p: .4,
          win: { fx: { seniors: 1 }, fb: 'The accountant confirms he missed the filings. The story fades.' },
          lose: { fx: { seniors: -2, label: 3 }, fb: 'Your former accountant gives an interview. He has the emails where he reminded you, six times.' } } },
    ] },
  { id: 'dun_protein', kind: 'Scandal', title: 'Patriot Protein', minStep: 8, weight: OWN, cond: only('dunmore'),
    text: 'Patriot Protein, the supplement you have advertised on the show for three years, is made in a factory owned by a Chinese company. Your ad reads call it "100% American strength." Reporters want to know whether you knew.',
    advice: [
      ['wade', 'Drop them tonight. On air.'],
      ['pryce', 'They pay for a quarter of the show. Think about it for a day.'],
      ['kyle', 'Our listeners will believe it is a smear if you tell them it is.'],
    ],
    choices: [
      { text: 'Drop the sponsor on air and refund every listener who asks.', fx: { money: -.4, seniors: 2, label: -1 },
        fb: 'Expensive and convincing. A few listeners send the refund back.' },
      { text: 'Call it a smear from the Chinese Communist Party\'s friends in the media.', fx: { online: 2, maga: 1, seniors: -2, label: 2 },
        fb: 'Your audience believes you. The factory photos keep running.' },
      { text: 'Keep the sponsor. "The product is good, and the jobs are in Ohio."', fx: { money: .3, label: 2, maga: -1 },
        fb: 'The packaging jobs are in Ohio. Everything else is not.' },
    ] },
  { id: 'dun_tiebreak', kind: 'Crisis', title: 'The Tie-Breaker', minStep: 10, weight: OWN, cond: only('dunmore'),
    text: 'The state Senate is tied 20 to 20 on a property-tax relief bill. It pays for the relief by delaying the Governor\'s income tax repeal. As Lieutenant Governor, you cast the deciding vote. The vote is live on television.',
    advice: [
      ['dana', 'Older voters want the relief. The Liberty Caucus wants the repeal. There are more older voters.'],
      ['wade', 'Whatever you vote, make it a speech.'],
      ['pryce', 'If you are not in the chamber, the bill fails. People will notice that you were not.'],
    ],
    choices: [
      { text: 'Vote yes: relief for homeowners now.', fx: { seniors: 4, farm: 2, liberty: -3, chamber: -1 },
        fb: 'The gallery cheers. The Governor must now sign or veto a bill that you passed.' },
      { text: 'Vote no: "No delays. Finish the repeal."', fx: { liberty: 4, chamber: 1, seniors: -3 },
        fb: 'You kill the bill. Retirees in Lake Cheney remember it.' },
      { text: 'Do not show up for the vote.', fx: { maga: -1, seniors: -1, label: 2 },
        fb: 'The bill fails without you. "Where was Travis?" is the Ledger\'s headline.' },
    ] },

  // ================= PASTOR RICK DOLLINS: THE PULPIT =================
  { id: 'pulpit_sermon', kind: 'The Pulpit', title: 'Sunday at Cornerstone', minStep: 2, weight: OWN, cond: only('rick'),
    text: 'Nine thousand people will be in the sanctuary on Sunday, and the service is streamed to 140 churches. You cannot endorse yourself from the pulpit. You can choose what to preach.',
    advice: [
      ['wade', 'Preach on the border. Everyone will know what you mean.'],
      ['tom', 'Preach mercy. The pastors who are not with us yet are listening.'],
      ['pryce', 'Whatever you preach, do not say "vote." The IRS is also listening.'],
    ],
    choices: [
      { text: '"A Nation Needs a Wall": the Bible on borders.', fx: { maga: 3, faith: 1, online: 1 },
        fb: 'The sermon is shared a million times. Some pastors wish you had preached on something else.' },
      { text: '"Mercy for the Stranger."', fx: { faith: 2, seniors: 2, maga: -3 },
        fb: 'Pastors across the state thank you. The border hawks in the congregation are quiet on the way out.' },
      { text: '"Render unto Caesar": the sin of high taxes.', fx: { liberty: 3, faith: 1 },
        fb: 'The Liberty Caucus has never been so interested in a sermon.' },
      { text: '"Voting Is a Christian Duty," with a very clear hint.', fx: { faith: 3, label: 1, flag: 'johnson' },
        fb: 'Everyone knows who you meant. So does a lawyer in Washington who watches the stream.' },
    ] },
  { id: 'pulpit_vans', kind: 'The Pulpit', title: 'The Church Vans', minStep: 14, weight: OWN, cond: only('rick'),
    text: 'Cornerstone owns 120 vans and buses. Your campaign could use them to bring voters to the polls on primary day in Caney Ridge and Lake Cheney. The church\'s lawyer is nervous.',
    advice: [
      ['wade', 'The vans are the best turnout machine in the state. Use them.'],
      ['pryce', 'Church property for a campaign is exactly what the IRS looks for. Rent buses instead.'],
      ['dana', 'Every van seat in Caney Ridge is a vote.'],
    ],
    choices: [
      { text: 'Use the church vans.', fx: { gotv: { bible: .1, cheney: .06 }, faith: 1, label: 1, flag: 'johnson' },
        fb: 'The plan is ready by Friday. A photo of a Cornerstone van with a campaign sign is online by Saturday.' },
      { text: 'Rent private buses with campaign money.', fx: { money: -.5, gotv: { bible: .08, cheney: .05 } },
        fb: 'Legal, clean and expensive.' },
      { text: 'Ask members to drive their neighbors themselves.', fx: { gotvAll: .02, faith: 1 },
        fb: 'Less organized, and completely legal.' },
    ] },
  { id: 'pulpit_revival', kind: 'The Pulpit', title: 'The Second Revival', minStep: 18, weight: OWN, cond: only('rick'),
    text: 'Your team wants a second stadium revival, two weeks before the primary. It would cost $600,000. Everyone would call it a campaign rally with hymns.',
    advice: [
      ['wade', 'Sixty thousand people, two weeks out. There is no better closing event in the state.'],
      ['pryce', 'If it is a campaign rally, the campaign must pay for it. All of it.'],
      ['tom', 'If it is a revival, do not mention the election. Let people draw their own conclusions.'],
    ],
    choices: [
      { text: 'Hold it as a revival. Do not mention the election once.', fx: { faith: 4, seniors: 1, money: -.3 },
        fb: 'Three nights of prayer. You never say the word "vote." You do not have to.' },
      { text: 'Hold it as a campaign rally, paid for by the campaign.', fx: { faith: 3, maga: 2, money: -.6 },
        fb: 'Honest and very expensive. The crowd is smaller and louder.' },
      { text: 'Cancel it, and keep the money for the last two weeks.', fx: { seniors: 1, faith: -1 },
        fb: 'The campaign is richer and quieter. Some church members ask why the revival was cancelled.' },
    ] },
  { id: 'rick_jet_own', kind: 'Scandal', title: 'The Gulfstream', minStep: 4, weight: OWN, cond: only('rick'),
    text: 'The Ledger publishes three years of flight records for Cornerstone\'s $60 million jet. It went to 14 revivals, and also to Cabo San Lucas four times, and to Augusta during the Masters. The jet is tax-exempt as "a ministry tool."',
    advice: [
      ['pryce', 'Sell the jet. It is the only answer that ends the story.'],
      ['wade', 'The trips to Mexico were missions. Say so.'],
      ['tom', 'Our people give ten percent of what they earn. They will not like Augusta.'],
    ],
    choices: [
      { text: 'Sell the jet and give the money to Cornerstone Relief.', fx: { faith: 2, seniors: 2, label: -2 },
        fb: 'A dramatic answer. The story ends, and the church relief teams get two new trucks.' },
      { text: '"The jet is a tool for ministry, and I will not apologize for it."', fx: { faith: 1, label: 2, liberty: -1 },
        fb: 'Your congregation stands with you. Everyone else looks at the Augusta dates.' },
      { text: 'Release every flight log, with the purpose of every trip.', fx: {},
        risk: { p: .45,
          win: { fx: { seniors: 2, label: -1 }, fb: 'Most trips really were missions. The golf trip was a donor\'s gift. The story loses energy.' },
          lose: { fx: { seniors: -2, faith: -2, label: 2 }, fb: 'The logs show more golf than missions. Reporters make a map.' } } },
    ] },
  { id: 'rick_loans_own', kind: 'Scandal', title: 'The Forgiven Loans', minStep: 7, weight: OWN, cond: only('rick'),
    text: 'Cornerstone Church received $2.1 million in federal COVID loans, and every dollar was forgiven. You have spent this campaign calling for "an end to government handouts." Vaskel\'s campaign has made a chart.',
    advice: [
      ['pryce', 'The church can repay it. It is not a small amount, but it is possible.'],
      ['wade', 'The loans kept 140 people employed. That is a jobs story.'],
      ['dana', 'Liberty Caucus voters care about this more than anyone else.'],
    ],
    choices: [
      { text: 'Announce that the church will repay every dollar.', fx: { liberty: 3, seniors: 1, money: -.2, label: -2 },
        fb: 'The church board is not happy. The story ends with a check.' },
      { text: '"The loans kept 140 people working. I would do it again."', fx: { seniors: 1, label: 1, liberty: -2 },
        fb: 'True, and not what the voters who care about this wanted to hear.' },
      { text: 'Blame the government for offering the money.', fx: { maga: 1, label: 2, seniors: -1 },
        fb: 'Nobody made the church apply. Everyone points that out.' },
    ] },
  { id: 'rick_johnson', kind: 'Crisis', title: 'The Johnson Complaint', minStep: 10, weight: OWN, cond: s => only('rick')(s),
    text: s => `A national church-state group files an IRS complaint against Cornerstone Church for political activity from the pulpit.${s.flags.johnson ? ' The complaint quotes your sermon and shows a photo of a church van.' : ''} If the IRS agrees, the church could lose its tax exemption.`,
    advice: [
      ['pryce', 'Step down as senior pastor until the election. It protects the church.'],
      ['wade', 'Fight it. Every conservative pastor in America will stand with you.'],
      ['tom', 'The Council of Pastors is watching how you protect the church.'],
    ],
    choices: [
      { text: 'Step down as senior pastor until after the election.', fx: { seniors: 2, faith: -2, label: -1 },
        fb: 'Your son preaches on Sunday. The complaint loses its target. Some members feel you left them.' },
      { text: '"The pulpit is free. Let them come."', fx: { faith: 3, online: 2, chamber: -2, label: 1 },
        fb: 'Pastors across the country send letters of support. The IRS opens a file.' },
      { text: 'Have the church sue the IRS first.', fx: { money: -.3 },
        risk: { p: s => s.flags.johnson ? .35 : .55,
          win: { fx: { faith: 3, liberty: 2 }, fb: 'A federal judge pauses the complaint. Religious-liberty lawyers call it a landmark.' },
          lose: { fx: { faith: -1, seniors: -2, label: 2 }, fb: 'The suit is dismissed in a week, and the judge\'s opinion quotes your sermon.' } } },
    ] },
  { id: 'rick_camp', kind: 'Scandal', title: 'The Camp Report', minStep: 12, weight: OWN, cond: only('rick'),
    text: 'A reporter obtains a 2014 settlement: Cornerstone quietly paid two families after complaints about a youth pastor at a church summer camp. The youth pastor left and later worked at another church. The reporter asks what you knew, and when.',
    advice: [
      ['pryce', 'Our lawyers handled it by the book in 2014. That is not the question the voters will ask.'],
      ['tom', 'The families are still in our congregation. Talk to them before you talk to anyone else.'],
      ['wade', 'This could end the campaign. Whatever you do, do it today.'],
    ],
    choices: [
      { text: 'Release the full report, apologize to the families, and name an independent reviewer.', fx: { seniors: 3, faith: 1, money: -.2, label: -1 },
        fb: 'The families say the apology is the first they have received. The story is painful, and it ends.' },
      { text: 'Say the church followed its lawyers\' advice in 2014.', fx: { seniors: -3, faith: -2, label: 2 },
        fb: 'The legal answer. It sounds like exactly what the reporter suspected.' },
      { text: 'Attack the reporter as an enemy of the church.', fx: { faith: 1, online: 1, seniors: -3, label: 3 },
        fb: 'Your base rallies. Every mother in the state reads the story anyway.' },
    ] },
  { id: 'rick_council', kind: 'Party', title: 'The Council Splits', minStep: 8, weight: OWN, cond: s => only('rick')(s) && s.endorsements.pastors === 'you',
    text: 'Pastor Dwayne Kessler of Harvest Point, the second-largest church in the state, asks the Council of Cimarron Pastors to "stay out of the governor\'s race." Many pastors agree. If the Council withdraws its endorsement, you lose it.',
    advice: [
      ['tom', 'Dwayne wants the Council chair when this is over. Offer it to him.'],
      ['wade', 'Force a vote. You will win it.'],
      ['dana', 'The endorsement matters more than the Council\'s feelings.'],
    ],
    choices: [
      { text: 'Offer Kessler the Council chair after the election.', fx: { faith: 2 },
        fb: 'Kessler accepts. The Council stays with you.' },
      { text: 'Force a vote.', fx: {},
        risk: { p: .6,
          win: { fx: { faith: 3 }, fb: 'The Council votes 31 to 12 to keep its endorsement. Kessler does not speak to you afterward.' },
          lose: { fx: { faith: -3, endorse: { pastors: 'castellano' } }, fb: 'The Council votes to withdraw. It endorses the Governor a week later.' } } },
      { text: 'Release the Council from its endorsement yourself.', fx: { seniors: 2, faith: -2, endorse: { pastors: 'castellano' } },
        fb: 'Gracious, and it costs you the endorsement. Several pastors say they will vote for you anyway.' },
    ] },

  // ================= SHERIFF BO KRANTZ: THE BADGE =================
  { id: 'badge_manhunt', kind: 'The Badge', title: 'The Manhunt', minStep: 2, weight: OWN, cond: only('krantz'),
    text: 'Two inmates escape from the state prison near Harlan. One is serving life for murder. Your deputies are searching the river bottoms. You were scheduled to speak at a rally in Osgood tonight.',
    advice: [
      ['wade', 'Go home. A sheriff who leads a manhunt does not need a rally.'],
      ['pryce', 'The state police are in charge. Let them be.'],
      ['kyle', 'Five hundred posse volunteers are ready to help. Say the word.'],
    ],
    choices: [
      { text: 'Cancel the rally and lead the search yourself.', fx: { guns: 3, seniors: 2, farm: 1 },
        fb: 'Your deputies find both men in 30 hours. You are on every channel, in a mud-covered jacket.' },
      { text: 'Let the undersheriff lead, and keep campaigning.', fx: { seniors: -1, guns: -1 },
        fb: 'The men are caught. Reporters ask why you were in Osgood.' },
      { text: 'Call out the posse volunteers.', fx: {},
        risk: { p: .55,
          win: { fx: { guns: 4, maga: 1 }, fb: 'A posse volunteer spots the men at a gas station. Your posse is a national story.' },
          lose: { fx: { seniors: -3, label: 2 }, fb: 'Two volunteers hold a farmer at gunpoint for an hour. He was not an escaped prisoner. He was checking his cattle.' } } },
    ] },
  { id: 'badge_federal', kind: 'The Badge', title: 'The Federal Warrant', minStep: 8, weight: OWN, cond: only('krantz'),
    text: 'U.S. Marshals ask your office to help them serve a warrant on Lyle Hatch, a Harlan rancher who has refused to pay federal taxes for twelve years. Hatch says he will not go peacefully. Half of Harlan County is watching to see what you do.',
    advice: [
      ['pryce', 'If the marshals go in without you and someone dies, it is your county and your problem.'],
      ['wade', 'You have said for years that sheriffs protect citizens from federal agents. This is the test.'],
      ['tom', 'Hatch is a member of my church. Let me talk to him first.'],
    ],
    choices: [
      { text: 'Help the marshals serve the warrant.', fx: { seniors: 2, chamber: 1, guns: -4 },
        fb: 'Hatch surrenders. The constitutional-sheriff movement calls you a traitor.' },
      { text: 'Refuse. Federal agents need your permission in Harlan County.', fx: { guns: 3, maga: 2, seniors: -2, label: 2 },
        fb: 'The marshals leave. The Justice Department sends a letter. Gun owners send money.' },
      { text: 'Go to the ranch alone and talk Hatch into surrendering to you.', fx: {},
        risk: { p: .6,
          win: { fx: { guns: 3, seniors: 3 }, fb: 'Hatch walks out with you, and no one is hurt. You hand him to the marshals yourself.' },
          lose: { fx: { guns: -1, seniors: -2, label: 1 }, fb: 'Hatch fires a warning shot over your truck. The marshals take over, and the standoff lasts a week.' } } },
    ] },
  { id: 'badge_flood', kind: 'The Badge', title: 'High Water', minStep: 14, weight: OWN, cond: only('krantz'),
    text: 'The Red Fork River floods three towns in Harlan County. Your deputies are rescuing families from rooftops. The primary is five weeks away.',
    advice: [
      ['wade', 'Be there. Every day.'],
      ['dana', 'Voters across the state are watching how a sheriff handles a disaster. This is a job interview.'],
      ['pryce', 'Ask the Governor for the National Guard. It is not weakness. It is the law.'],
    ],
    choices: [
      { text: 'Stay in Harlan and lead the rescue until the water goes down.', fx: { guns: 2, seniors: 3, farm: 2 },
        fb: 'You do not campaign for eight days. Nobody in Harlan County forgets it.' },
      { text: 'Ask the Governor for the National Guard.', cond: s => inRace(s, 'castellano'), fx: { seniors: 2, farm: 2, guns: -1 },
        fb: 'The Guard arrives in a day. You and the Governor stand together on a sandbag wall, and neither of you enjoys it.' },
      { text: 'Refuse all state and federal help: "Harlan takes care of its own."', fx: { guns: 3, liberty: 2, seniors: -3, farm: -2, label: 1 },
        fb: 'Proud and slow. Two towns wait four days longer for help.' },
    ] },
  { id: 'krantz_inmate', kind: 'Scandal', title: 'The Inmate Death', minStep: 4, weight: OWN, cond: only('krantz'),
    text: 'The FBI\'s civil rights investigation of the Harlan County jail ends with the indictment of two of your deputies. An inmate, Danny Ortiz, died after nine hours in a restraint chair in 2027. The indictment says jail video was deleted.',
    advice: [
      ['pryce', 'Suspend them and cooperate. Anything else looks like a cover-up.'],
      ['wade', 'Your deputies need to know you stand with them. So do your voters.'],
      ['dana', 'Older voters will read the word "deleted" and stop listening.'],
    ],
    choices: [
      { text: 'Suspend both deputies and cooperate fully with the FBI.', fx: { seniors: 3, guns: -2, label: -1 },
        fb: 'Responsible. Some deputies stop speaking to you in the break room.' },
      { text: 'Defend them: "This is the weaponized FBI coming for Harlan County."', fx: { guns: 3, maga: 2, seniors: -3, label: 2 },
        fb: 'Gun owners rally. The Ortiz family holds a press conference in front of the jail.' },
      { text: 'Release every minute of jail video that still exists.', fx: {},
        risk: { p: .45,
          win: { fx: { seniors: 2, guns: 1, label: -1 }, fb: 'The video shows deputies checking on Ortiz and calling for a nurse. The case looks weaker than the headlines.' },
          lose: { fx: { seniors: -4, guns: -2, label: 2 }, fb: 'The video is worse than the indictment. It runs on every channel for a week.' } } },
    ] },
  { id: 'krantz_dryfork', kind: 'Crisis', title: 'Dry Fork', minStep: 9, weight: OWN, cond: only('krantz'),
    text: 'The Bureau of Land Management sends a survey team to federal grazing land near Dry Fork. You are standing on the road with 200 armed volunteers. The BLM agents are armed too. The cameras are live.',
    advice: [
      ['wade', 'This is who you are. Do not step back now.'],
      ['pryce', 'If anyone fires a shot, your campaign is over, and maybe more than your campaign.'],
      ['dana', 'Primary voters oppose the BLM. They do not want a war on a county road.'],
    ],
    choices: [
      { text: 'Hold the road until the BLM leaves.', fx: {},
        risk: { p: .55,
          win: { fx: { guns: 5, farm: 2, maga: 2, seniors: -1 }, fb: 'The BLM withdraws after three days. You are the most famous sheriff in America.' },
          lose: { fx: { seniors: -4, chamber: -2, label: 3 }, fb: 'A volunteer\'s rifle goes off by accident. No one is hurt. The video of everyone diving for cover is everywhere.' } } },
      { text: 'Negotiate a 90-day delay with the BLM, and send the volunteers home.', fx: { seniors: 3, farm: 1, guns: -2 },
        fb: 'You get the delay in writing. Some volunteers call it surrender.' },
      { text: 'Ask the President to call off the survey.', fx: {},
        risk: { p: s => s.pres / 110,
          win: { fx: { guns: 3, maga: 2, pres: 2 }, fb: 'The Interior Department pauses the survey the same afternoon. The President calls you "a great sheriff."' },
          lose: { fx: { guns: -1, label: 1 }, fb: 'The White House does not answer. You stand on the road for two more days, waiting for a call.' } } },
    ] },
  { id: 'krantz_sued', kind: 'Crisis', title: 'The State Sues', minStep: 11, weight: OWN, cond: s => only('krantz')(s) && inRace(s, 'castellano'),
    text: 'Governor Castellano\'s Attorney General sues you for refusing to enforce two state laws: a vehicle-registration fee and a rule on reporting stolen guns. The Governor says "no sheriff is above the law." Your supporters say the lawsuit is political.',
    advice: [
      ['pryce', 'If you comply, the lawsuit ends. If you fight, it lasts past the primary.'],
      ['wade', 'The Governor made himself your opponent in court. Let him.'],
      ['dana', 'Voters do not follow lawsuits. They follow who looks like the bully.'],
    ],
    choices: [
      { text: 'Comply with both laws under protest.', fx: { seniors: 2, guns: -3, label: -1 },
        fb: 'The lawsuit ends. Your supporters are confused.' },
      { text: 'Fight it in court with Judge Tate\'s arguments.', fx: { guns: 2, liberty: 2, money: -.3, label: 1 },
        fb: 'The case becomes a national test of sheriff authority. It is still in court on primary day.' },
      { text: '"The Governor sued forty-one times in Washington. Now he sues a sheriff."', fx: { maga: 2, guns: 2, opp: { castellano: -3 }, label: 1 },
        fb: 'A good line. The Governor\'s campaign does not have an answer for it.' },
    ] },
  { id: 'krantz_posse', kind: 'Scandal', title: 'The Posse Post', minStep: 13, weight: OWN, cond: only('krantz'),
    text: 'A member of your volunteer posse posts a photo of a county clerk\'s house with the words "we know where the traitors live." The clerk certified the 2028 election. The volunteer was deputized by your office last year.',
    advice: [
      ['pryce', 'Remove him from the posse today, and say it on camera.'],
      ['wade', 'He is one man out of five hundred. Do not let them define the posse by him.'],
      ['kyle', 'The other volunteers are defending him online. It is getting worse.'],
    ],
    choices: [
      { text: 'Remove him, apologize to the clerk, and review every posse member.', fx: { seniors: 3, guns: -1, label: -1 },
        fb: 'The clerk thanks you. Forty volunteers quit in protest.' },
      { text: '"One bad apple. The posse stays."', fx: { guns: 1, seniors: -2, label: 2 },
        fb: 'The posse stays. The photo stays on every channel.' },
      { text: 'Disband the volunteer posse.', fx: { seniors: 2, chamber: 1, guns: -3, label: -2 },
        fb: 'A serious answer. Your most loyal supporters feel you have abandoned them.' },
    ] },
);

EVENTS.push(
  // ================= BRENT VASKEL: THE CHECKBOOK =================
  { id: 'check_selffund', kind: 'The Checkbook', title: 'Another Ten Million', minStep: 3, weight: OWN, cond: only('vaskel'),
    text: 'Your campaign has spent $9 million of your own money. Your COO wants to add ten million more. Every dollar you give yourself is reported, and every rival will read the reports aloud.',
    advice: [
      ['wade', 'Money is our advantage. Use it before the others can raise theirs.'],
      ['dana', 'Voters say they do not mind self-funding. Then they read the number.'],
      ['pryce', 'Small donors are harder to raise and worth more. Ten thousand $50 checks look better than one $10 million check.'],
    ],
    choices: [
      { text: 'Put in ten million more.', fx: { money: 3, label: 2 },
        fb: 'The campaign can now outspend everyone combined. The Governor\'s campaign calls you "Brent Buys-kel."' },
      { text: 'Put in three million, and match every small donation.', fx: { money: 1.5, online: 1, label: 1 },
        fb: 'A match doubles every $50 gift. The small-donor count grows fast.' },
      { text: 'Stop self-funding and build a small-donor base.', fx: { money: .4, seniors: 1, label: -1 },
        fb: 'Slower and cheaper. Reporters stop writing about your checkbook.' },
    ] },
  { id: 'check_ads', kind: 'The Checkbook', title: 'Carpet-Bombing', minStep: 9, weight: OWN, cond: only('vaskel'),
    text: 'Your ad team has $4 million ready for one week of statewide television. They want your decision on the message by tonight.',
    advice: [
      ['wade', 'Hit the leader. Four million dollars of negative ads can move any race.'],
      ['dana', 'Voters do not know your story. A positive ad about why you moved here would help more.'],
      ['kyle', 'Put half of it online. The young voters are already with you.'],
    ],
    choices: [
      { text: 'Four million against the leader.', fx: { money: -1, oppLeader: -5, seniors: -1, label: 1 },
        fb: 'The leader falls three points in a week. Reporters count your ad dollars.' },
      { text: '"Cimarron by Choice": a biography ad about why you moved here.', fx: { money: -1, seniors: 2, farm: 1, label: -2 },
        fb: 'You, your wife and your three daughters at a Friday night football game. It works.' },
      { text: 'Split it between online and turnout.', fx: { money: -1, online: 2, gotvAll: .03 },
        fb: 'Less visible, and very efficient.' },
      { text: 'Keep the money for the final week.', fx: { seniors: -1 },
        fb: 'Your rivals fill the airwaves. You wait, and your ad team is not happy about it.' },
    ] },
  { id: 'check_stadium', kind: 'The Checkbook', title: 'The Stadium Gift', minStep: 15, weight: OWN, cond: only('vaskel'),
    text: 'Sumner High School\'s football stadium was damaged by a storm, and the district cannot pay to repair it. The superintendent asks if you can help. Everyone in Sumner Valley will know if you do, and everyone in the state will say why.',
    advice: [
      ['wade', 'Pay for it. Farm country needs to see you as one of them.'],
      ['pryce', 'Anything you give during the campaign looks like buying votes.'],
      ['dana', 'Sumner Valley is where we are weakest. This is the fastest way in.'],
    ],
    choices: [
      { text: 'Pay for the whole stadium, with your name on it.', fx: { farm: 3, seniors: 1, money: -.5, label: 2 },
        fb: '"Vaskel Field" opens in August. Some parents cover the sign with a tarp.' },
      { text: 'Pay for it anonymously.', fx: { farm: 1, money: -.5 },
        fb: 'The district keeps the secret for eleven days. Then someone tells the Ledger, and the story is kind.' },
      { text: 'Decline until after the election.', fx: { label: -1 },
        fb: 'The superintendent understands. The stadium stays closed.' },
    ] },
  { id: 'vaskel_ca', kind: 'Scandal', title: 'The California Donations', minStep: 4, weight: OWN, cond: only('vaskel'),
    text: 'Dunmore\'s researchers publish your donation history: $400,000 to California Democrats between 2012 and 2022, including a governor who supported sanctuary cities. The Governor\'s campaign runs it the same day.',
    advice: [
      ['wade', 'Say you changed. Then prove it with a check to the right people.'],
      ['dana', 'Voters forgive converts. They do not forgive people who pretend nothing happened.'],
      ['pryce', 'Every businessman in California gave to Democrats. Say that, once.'],
    ],
    choices: [
      { text: '"I evolved. California made me a conservative."', fx: { online: 2, seniors: 1, label: 1 },
        fb: 'A good line, and the base partly accepts it.' },
      { text: 'Give $1 million to border-security groups the same day.', fx: { maga: 2, money: -1, label: -1 },
        fb: 'Expensive proof. Reporters call it "penance."' },
      { text: '"I gave to both parties, like every businessman."', fx: { chamber: 1, maga: -2, label: 2 },
        fb: 'True and fatal. "Like every businessman" is on a Dunmore hat by Friday.' },
    ] },
  { id: 'vaskel_visas', kind: 'Crisis', title: 'The Visa Revolt', minStep: 7, weight: OWN, cond: only('vaskel'),
    text: 'Your data centers in Pratt Junction need 1,200 engineers. Your companies have applied for H-1B visas for most of them. The online right, which has been your strongest group, is in open revolt: "American jobs for Americans."',
    advice: [
      ['kyle', 'The New Right is our base. If they turn, we are finished.'],
      ['pryce', 'Without the engineers, the plants open a year late and the jobs promise is broken.'],
      ['dana', 'Farmers and older voters do not care about visas. They care about the jobs.'],
    ],
    choices: [
      { text: 'Hire Americans only, and delay the openings.', fx: { online: 3, maga: 2, chamber: -2, money: -.5 },
        fb: 'The online right celebrates. The plants open nine months late.' },
      { text: 'Keep the H-1B hires: "I hire the best in the world."', fx: { chamber: 3, liberty: 1, online: -5, label: 1 },
        fb: 'Honest. Your strongest supporters feel betrayed.' },
      { text: 'Train Cimarron workers through Vaskel Academy, and hire fewer visa workers.', fx: { farm: 2, seniors: 1, online: 1, money: -.5 },
        fb: 'A slower, better answer. 400 local students enroll in the first month.' },
    ] },
  { id: 'vaskel_water', kind: 'Crisis', title: 'The Freedomopolis Water', minStep: 11, weight: OWN, cond: only('vaskel'),
    text: 'Freedomopolis needs aquifer water. Your application would pump 3 billion gallons a year. The Panhandle water board meets next week, and 400 ranchers plan to attend.',
    advice: [
      ['pryce', 'Buy the water rights instead of fighting for permits. Pay three times the market price.'],
      ['wade', 'Withdraw the application until after the primary.'],
      ['dana', 'Farmers vote at high rates, and this is the only issue they are talking about.'],
    ],
    choices: [
      { text: 'Withdraw the application.', fx: { farm: 3, liberty: -2 },
        fb: 'The ranchers go home. Freedomopolis is on hold.' },
      { text: 'Buy water rights from farmers at three times the market price.', fx: { farm: 2, money: -1, label: 1 },
        fb: 'Many farmers sell. Their neighbors are not happy about it.' },
      { text: 'Fight for the permits at the hearing.', fx: { liberty: 2, farm: -4, label: 2 },
        fb: 'You win the permits. You may have lost the Panhandle.' },
    ] },
  { id: 'vaskel_outage', kind: 'Scandal', title: 'The Outage', minStep: 13, weight: OWN, cond: only('vaskel'),
    text: 'Two counties hired your company\'s "AI-first" system to process unemployment claims. It fails for six days. 3,000 claims are delayed, and a laid-off meatpacker tells the Ledger he cannot pay rent.',
    advice: [
      ['pryce', 'Take responsibility and pay the claims yourself if you have to.'],
      ['wade', 'The counties ran it wrong. Say so.'],
      ['kyle', 'Our engineers can fix it in 48 hours. Promise that.'],
    ],
    choices: [
      { text: 'Take responsibility, and advance every delayed payment from your own money.', fx: { seniors: 2, money: -.5, label: -1 },
        fb: 'Every claim is paid in two days. Critics call it buying forgiveness. The meatpacker calls it decent.' },
      { text: 'Blame the county IT departments.', fx: { label: 2, seniors: -2 },
        fb: 'The county IT departments have emails. They share them.' },
      { text: 'Promise a fix in 48 hours.', fx: {},
        risk: { p: .6,
          win: { fx: { liberty: 2, online: 1 }, fb: 'Fixed in 40 hours. Your engineers become the story.' },
          lose: { fx: { seniors: -2, label: 2 }, fb: 'It takes nine days. "In beta" becomes the Governor\'s favorite joke about you.' } } },
    ] },
  { id: 'vaskel_drone', kind: 'Party', title: 'Liberty Drone', minStep: 10, maxStep: 15, weight: OWN, cond: only('vaskel'),
    text: 'The Ledger learns that your fund owns 12% of Liberty Drone Systems, the company co-owned by the President\'s son, Chase. The company wants state contracts. Reporters ask whether you are running for governor or for the President\'s family.',
    advice: [
      ['pryce', 'Sell the stake now. Anything else becomes the story until August.'],
      ['wade', 'The President\'s son is your best way to the President. Do not throw that away.'],
      ['dana', 'Voters do not understand the stake. They understand "the President\'s family."'],
    ],
    choices: [
      { text: 'Sell the stake and announce a blind trust.', fx: { seniors: 2, pres: -4, money: -.3, label: -2 },
        fb: 'Clean. Chase stops answering your texts.' },
      { text: 'Keep the stake and disclose everything.', fx: { pres: 2, label: 1 },
        fb: 'Transparent and awkward. The story continues at a low level.' },
      { text: 'Invite Chase to Pratt Junction to open a drone factory.', fx: { pres: 7, maga: 1, seniors: -1, label: 2 },
        fb: 'Chase cuts the ribbon with you. The President posts the photo. The Ledger posts the contracts.' },
    ] },

  // ================= CAROL WHITLOCK: THE LONG GAME =================
  { id: 'long_register', kind: 'The Long Game', title: 'The Registration Drive', minStep: 1, maxStep: 10, weight: OWN, cond: only('whitlock'),
    text: 'Cimarron\'s primary is closed. 440,000 voters are unaffiliated, and many of them are older conservatives who left the party in disgust. If they register as Republicans before the deadline, they can vote for you. The deadline is in five weeks.',
    advice: [
      ['wade', 'This is the whole campaign. If they register, we have a chance. If not, we do not.'],
      ['dana', 'Every one of them we register is worth three voters we try to persuade.'],
      ['pryce', 'The business groups will fund it if you ask. They will want to be thanked later.'],
    ],
    choices: [
      { text: 'Spend $600,000 on a statewide registration drive.', fx: { money: -.6, seniors: 3, chamber: 2, gotvAll: .03, rino: 1 },
        fb: '14,000 new Republicans register in five weeks. Dunmore calls them "Carol\'s Democrats."' },
      { text: 'Let the business groups run it quietly.', fx: { seniors: 2, chamber: 2, rino: 1, label: 1 },
        fb: '9,000 register. The Chamber\'s name is on the mailers.' },
      { text: 'Skip it. Win the voters who are already Republicans.', fx: { maga: 1 },
        fb: 'Principled, and very hard.' },
    ] },
  { id: 'long_editorials', kind: 'The Long Game', title: 'The Editorial Boards', minStep: 8, weight: OWN, cond: only('whitlock'),
    text: 'All four major newspapers in the state endorse you on the same Sunday. The Ledger calls you "the only adult in the race." In this primary, that may not be a compliment.',
    advice: [
      ['wade', 'Put the endorsements in every ad. Older voters still read the paper.'],
      ['kyle', 'Online, a newspaper endorsement is a reason to vote against you.'],
      ['dana', 'Older voters trust the Ledger. MAGA voters do not. We need the first group more.'],
    ],
    choices: [
      { text: 'Put the endorsements in every ad.', fx: { seniors: 3, chamber: 2, maga: -2, rino: 1 },
        fb: 'Retirees clip the editorials and mail them to their friends. The base mocks them.' },
      { text: 'Thank the papers quietly and keep campaigning.', fx: { seniors: 1 },
        fb: 'A modest benefit, and no backlash.' },
      { text: '"I did not ask for their endorsement, and I do not work for them."', fx: { maga: 1, seniors: -1, label: -1 },
        fb: 'A surprise. Some voters notice that you are tougher than they thought.' },
    ] },
  { id: 'long_favors', kind: 'The Long Game', title: 'Thirty Years of Favors', minStep: 14, weight: OWN, cond: only('whitlock'),
    text: 'You helped half of the current legislature win their first races. Peg Olsen has a list of 22 legislators who owe you. Now is the time to ask.',
    advice: [
      ['pryce', 'Twelve of them will endorse you publicly. The rest will help quietly.'],
      ['wade', 'Endorsements from legislators do not move primary voters. Their field staff do.'],
      ['dana', 'Every one who endorses you becomes a target for Dunmore\'s audience.'],
    ],
    choices: [
      { text: 'Ask for public endorsements.', fx: { chamber: 2, seniors: 2, maga: -1, rino: 1 },
        fb: 'Twelve legislators stand with you at the Capitol. Dunmore lists their names on his show.' },
      { text: 'Ask for their field staff and volunteer lists, quietly.', fx: { gotvAll: .04, seniors: 1 },
        fb: 'Invisible and useful. Your turnout operation doubles.' },
      { text: 'Ask them to stay neutral, so the field splits.', fx: { seniors: 1, opp: { castellano: -2 } },
        fb: 'The Governor loses a dozen endorsements he expected. He knows who did it.' },
    ] },
  { id: 'whit_dems', kind: 'Scandal', title: 'The Democrats\' Gift', minStep: 6, weight: OWN, cond: only('whitlock'),
    text: 'A Democratic super PAC spends $1.2 million on ads calling you "too moderate for Cimarron Republicans." Everyone understands the trick: Democrats want to face you, or they want to split the field. Your rivals call you "the Democrats\' candidate."',
    advice: [
      ['wade', 'Denounce it loudly, today.'],
      ['dana', 'The ads raise your name recognition. They also raise your RINO problem.'],
      ['pryce', 'You cannot stop them. You can refuse to benefit.'],
    ],
    choices: [
      { text: 'Denounce the ads and ask stations to stop running them.', fx: { maga: 1, seniors: 1, label: -1 },
        fb: 'The stations keep running them. Voters notice that you asked.' },
      { text: '"I cannot control what others spend."', fx: { rino: 2, label: 1, seniors: 1 },
        fb: 'Technically true. It sounds like a thank-you note.' },
      { text: 'Give the same amount to Republican candidates for the legislature.', fx: { money: -.6, chamber: 2, maga: 1, rino: -1 },
        fb: 'An expensive answer that changes the story.' },
    ] },
  { id: 'whit_2020', kind: 'Party', title: 'The 2020 Question', minStep: 5, weight: OWN, cond: only('whitlock'),
    text: 'At a candidate forum in Osgood, a voter stands up: "Senator, yes or no: was the 2020 election stolen?" The room is silent. Every camera is on you.',
    advice: [
      ['pryce', 'You have said no for ten years. Say it again, and say it kindly.'],
      ['wade', 'Do not answer the question. Answer the voter.'],
      ['dana', 'Half the room believes it was stolen. The other half is waiting to see if you will lie.'],
    ],
    choices: [
      { text: '"No. And I respect you for asking me to my face."', fx: { seniors: 2, chamber: 2, maga: -4, rino: 1 },
        fb: 'Some boos, and some applause. The clip is shared by both sides for opposite reasons.' },
      { text: '"There were real problems, and I will fix them here."', fx: { maga: 1, seniors: 1, label: 1 },
        fb: 'A careful answer. Neither side is fully satisfied.' },
      { text: '"I am running for governor, not for 2020."', fx: { label: 2, maga: -1 },
        fb: 'The voter repeats the question. You repeat the answer. It looks like what it is.' },
    ] },
  { id: 'whit_stumble', kind: 'Crisis', title: 'The Stumble', minStep: 10, weight: OWN, cond: only('whitlock'),
    text: 'You trip on the stairs at a campaign event in Lake Cheney. You are not hurt, but the video has 4 million views. "Too old" is trending in Cimarron. You are 67.',
    advice: [
      ['wade', 'Make a joke about it, today, on camera.'],
      ['pryce', 'Release your full medical records. They are excellent.'],
      ['kyle', 'Do something physical and film it. Show them.'],
    ],
    choices: [
      { text: 'Joke about it on camera.', fx: {},
        risk: { p: .6,
          win: { fx: { seniors: 3, label: -2 }, fb: '"The stairs have been to the left of me for years." Even Dunmore\'s audience laughs.' },
          lose: { fx: { label: 1 }, fb: 'The joke is fine. The video of the stumble is more popular.' } } },
      { text: 'Release your full medical records.', fx: { seniors: 2, label: -1 },
        fb: 'Your records are better than most 40-year-olds\'. The story fades.' },
      { text: 'Hike Wheeler Peak with reporters.', fx: {},
        risk: { p: .5,
          win: { fx: { seniors: 3, farm: 1, label: -3 }, fb: 'Nine miles at 12,000 feet. Two of the reporters turn back. You do not.' },
          lose: { fx: { seniors: -1, label: 2 }, fb: 'You finish, slowly. A photographer gets you resting on a rock. It becomes the image of the week.' } } },
    ] },
  { id: 'whit_war', kind: 'Party', title: 'The Old Warrior', priority: true, cond: s => only('whitlock')(s) && s.war && s.step >= s.war.start + 2,
    text: 'The war you warned about is going badly. Gas is over $6. Older Republicans who stopped voting in primaries are calling your office. A national columnist writes that you were "right about everything, and too early."',
    advice: [
      ['wade', 'This is your moment. Do not be modest.'],
      ['dana', 'Farmers and older voters are moving. Speak to their costs, not to foreign policy.'],
      ['pryce', 'Do not attack the President. Attack the price of diesel.'],
    ],
    choices: [
      { text: '"I said so." A national interview about the war.', fx: { seniors: 3, chamber: 2, maga: -3, pres: -5 },
        fb: 'You are right, and people know it. The President\'s voters know it too, and they hate it.' },
      { text: 'Speak only about diesel, gas and the harvest.', fx: { farm: 4, seniors: 2 },
        fb: 'The most effective speech of your campaign. You never say the word "war."' },
      { text: 'Hold a rally with veterans in Fort Eisenhower.', fx: { seniors: 3, guns: 1, faith: 1 },
        fb: 'Two thousand veterans. Older voters who never heard your name now know it.' },
    ] },
  { id: 'whit_hecklers', kind: 'Media', title: 'The Hecklers', minStep: 3, weight: OWN, cond: only('whitlock'),
    text: 'At your town hall in Osgood, twenty young men in MAGA hats shout "RINO" every time you speak. Local television is recording.',
    advice: [
      ['wade', 'Keep talking. The cameras are on you, not them.'],
      ['kyle', 'Invite one of them to the microphone. It will be the best clip of the campaign, or the worst.'],
      ['tom', 'Pray for them, out loud. They will not know what to do.'],
    ],
    choices: [
      { text: 'Keep speaking, calmly, for an hour.', fx: { seniors: 3, chamber: 1 },
        fb: 'You finish every answer. By the end, the hecklers are bored and the room is on your side.' },
      { text: 'Invite one of them to the microphone.', fx: {},
        risk: { p: .45,
          win: { fx: { seniors: 2, maga: 2, label: -1 }, fb: 'He asks about gas prices. You answer, he nods, and the room applauds you both.' },
          lose: { fx: { seniors: -1, label: 2 }, fb: 'He uses the microphone for four minutes of insults. You stand there and take it.' } } },
      { text: 'End the event early.', fx: { label: 1, seniors: -1 },
        fb: 'Safe, and it looks like running away.' },
    ] },
);

// ================= RUNNING MATES: one story for each =================
// "Replace" choices use mate: 'alt', the first of your other running mates.
const replaceText = s => `Replace ${mateOf(s.mate).name.split(' ').slice(-1)[0]} on the ticket with ${altMate(s).name}.`;
const replaceFb = s => `${altMate(s).name} joins the ticket. The story ends, and a new one begins.`;
const mateEvent = (id, mate, title, minStep, text, advice, choices) => ({ id, kind: 'Running Mate', title, minStep, weight: PERSONAL, cond: s => s.mate === mate, text, advice, choices });
EVENTS.push(
  mateEvent('serrano_tuition', 'serrano', 'The Tuition Vote', 5,
    'Dunmore\'s researchers find that in 2019, Rep. Lupe Serrano voted for in-state college tuition for students brought to the U.S. as children. Your campaign ran on Operation Heartland. Her vote is now an ad.',
    [['wade', 'The base will call it amnesty for college students. Get ahead of it.'], ['dana', 'Voters in Pratt Junction like her more because of it. Voters in Osgood do not.'], ['pryce', 'She was a freshman legislator. People change.']],
    [{ text: 'Stand by her: "She voted for students. I stand with her."', fx: { farm: 2, chamber: 2, maga: -3 }, fb: 'Serrano thanks you in a very good speech. Dunmore plays her vote on a loop.' },
     { text: 'Have her say she regrets the vote.', fx: { maga: 1, farm: -1 }, fb: 'She says it, and does not sound like she means it.' },
     { text: 'Call the story an attack on a Hispanic conservative.', fx: { online: -1, seniors: 1, farm: 1 }, fb: 'A good defense. It changes the subject, but not the vote.' },
     { text: replaceText, fx: { mate: 'alt', farm: -2, seniors: 1 }, fb: replaceFb }]),
  mateEvent('crowder_contract', 'crowder', 'The Osgood Contract', 6,
    'The Ledger reports that Mayor Beth Ann Crowder\'s husband\'s construction company won $4 million in city contracts in Osgood. She voted on two of them.',
    [['pryce', 'If she voted on her husband\'s contracts, that is an ethics violation. It does not matter how small.'], ['wade', 'Moms trust her. Let her explain it herself.'], ['dana', 'Voters in Osgood know her. Voters elsewhere will only know this.']],
    [{ text: 'Let her explain it at a press conference.', fx: {}, risk: { p: .5,
        win: { fx: { seniors: 1, faith: 1 }, fb: 'The votes were on a consent calendar with 40 other items. She explains it clearly, and the story fades.' },
        lose: { fx: { seniors: -2, label: 1 }, fb: 'She loses her temper with a reporter. The clip is everywhere.' } } },
     { text: 'Ask the state ethics board to review it quickly.', fx: { seniors: 2, online: -1 }, fb: 'Responsible. The story stays open until the board meets.' },
     { text: 'Call it a smear on a mother who fought for children.', fx: { online: 2, faith: 1, seniors: -1 }, fb: 'Her supporters rally. The contracts are still the story.' },
     { text: replaceText, fx: { mate: 'alt', online: -2 }, fb: replaceFb }]),
  mateEvent('tilden_fund', 'tilden', 'The Member Projects', 7,
    'An audit finds that Sen. Wes Tilden steered $40 million in "member projects" to his home district over eight years, including a $9 million sports complex named after his father.',
    [['pryce', 'Everyone in the Senate does member projects. Wes just did more of them.'], ['wade', 'This is exactly the establishment story Dunmore wants to tell.'], ['dana', 'The Liberty Caucus will never forgive this.']],
    [{ text: 'Defend him: "Every legislator brings money home."', fx: { chamber: 1, liberty: -3, label: 1 }, fb: 'True. It sounds like the thing voters hate about the Capitol.' },
     { text: 'Have him give up his leadership post.', fx: { liberty: 2, chamber: -1 }, fb: 'He resigns as Majority Leader. He is not happy.' },
     { text: 'Announce a ban on member projects.', fx: { liberty: 3, maga: 1, chamber: -2 }, fb: 'Popular everywhere except in the Senate, where you will need votes in January.' },
     { text: replaceText, fx: { mate: 'alt', chamber: -3, liberty: 1 }, fb: replaceFb }]),
  mateEvent('barlow_tape', 'barlow', 'The 2016 Broadcast', 5,
    'The Governor\'s campaign finds a 2016 recording of Chet Barlow\'s radio show. On it, he calls the future President "a con man who could not run a lemonade stand." The clip plays on every station that does not carry his show.',
    [['wade', 'Half the country said worse in 2016. Most of them changed their minds.'], ['kyle', 'The President\'s son has already shared it.'], ['dana', 'MAGA voters remember who was with them early.']],
    [{ text: 'Have Barlow apologize to the President on the air.', fx: { maga: 1, pres: 2, seniors: -1 }, fb: 'A long, loud apology. The President does not respond.' },
     { text: '"Chet said what a lot of us said in 2016. Then he became a believer."', fx: { seniors: 2, maga: -2 }, fb: 'Honest. Some MAGA voters do not like "a lot of us."' },
     { text: 'Let Barlow fight back on his show.', fx: {}, risk: { p: .45,
        win: { fx: { seniors: 3, maga: 1 }, fb: 'Barlow does three hours on the Governor\'s own 2012 op-ed. The story turns around.' },
        lose: { fx: { maga: -3, pres: -3 }, fb: 'Barlow says the President "still cannot run a lemonade stand." It was supposed to be a joke.' } } },
     { text: replaceText, fx: { mate: 'alt', seniors: -2 }, fb: replaceFb }]),
  mateEvent('vance_machine', 'vance', 'The Voting Machine', 6,
    'The Secretary of State says Kristi Vance\'s group entered a county elections office in 2029 and copied the software from a voting machine without permission. A grand jury is reviewing the case.',
    [['wade', 'The base will see this as persecution. It helps us with them.'], ['pryce', 'If she is indicted during the campaign, she is indicted on your ticket.'], ['dana', 'Older voters want election integrity. They do not want people breaking into offices.']],
    [{ text: 'Defend her: "She was exposing the truth."', fx: { maga: 3, online: 2, seniors: -3, label: 1 }, fb: 'The base rallies. The grand jury keeps meeting.' },
     { text: '"Let the process work. She is innocent until proven guilty."', fx: { seniors: 1 }, fb: 'Careful. The story waits for the grand jury.' },
     { text: 'Call for the Secretary of State to be impeached.', fx: { maga: 2, online: 2, chamber: -2 }, fb: 'The legislature ignores you. Your audience does not.' },
     { text: replaceText, fx: { mate: 'alt', maga: -2, seniors: 2 }, fb: replaceFb }]),
  mateEvent('webb_sermon', 'webb', 'The Heartland Sermon', 5,
    'A video from 2029 shows Rev. Marcus Webb preaching against Operation Heartland: "Jesus was a refugee, and so were half the families in this room." The clip is shared by every rival campaign.',
    [['tom', 'Marcus preached the Gospel. Our pastors know it. Our voters may not.'], ['wade', 'Border hawks are a big part of our coalition. This hurts.'], ['dana', 'Older churchgoers are split. Younger online voters are not.']],
    [{ text: 'Stand by him: "He preached Scripture. So do I."', fx: { faith: 2, seniors: 1, maga: -3 }, fb: 'A principled answer. Pastors respect it. The border hawks go elsewhere.' },
     { text: 'Have him clarify that he supports enforcement against criminals.', fx: { maga: 1, faith: -1 }, fb: 'He clarifies, carefully. Some of his own congregation is disappointed.' },
     { text: 'Hold a joint prayer service on "mercy and law."', fx: { faith: 3, seniors: 1, maga: -1 }, fb: 'A beautiful service. It does not change the clip.' },
     { text: replaceText, fx: { mate: 'alt', faith: -2 }, fb: replaceFb }]),
  mateEvent('duvall_textbook', 'duvall', 'The Textbook', 7,
    'A history textbook sold through Hannah Duvall\'s homeschool network describes some slaves as "content with their station" and "cared for by Christian masters." Duvall wrote the introduction.',
    [['tom', 'This will hurt with every church that is not all white. Deal with it today.'], ['kyle', 'The homeschool moms are furious at the coverage, not at the book.'], ['dana', 'Older voters and business Republicans find this indefensible.']],
    [{ text: 'Have her pull the book and apologize.', fx: { seniors: 2, faith: 1, online: -2 }, fb: 'She does it. Part of her network says she caved.' },
     { text: 'Defend homeschool freedom, not the book.', fx: { online: 1, liberty: 1, seniors: -2, label: 1 }, fb: 'A careful line. Reporters keep asking about the book.' },
     { text: 'Call the story an attack on homeschool families.', fx: { online: 2, faith: 1, seniors: -3, chamber: -2, label: 1 }, fb: 'The homeschool moms rally. Everyone else reads the passages.' },
     { text: replaceText, fx: { mate: 'alt', online: -2, seniors: 1 }, fb: replaceFb }]),
  mateEvent('kittredge_water', 'kittredge', 'The Water Sale', 6,
    'Rep. Amos Kittredge sold the water rights under his ranch to Brent Vaskel\'s data-center company for $3.4 million. His neighbors in the Panhandle say their wells are dropping.',
    [['wade', 'The ranchers were our voters. Now they are angry at our ticket.'], ['pryce', 'It was his water to sell.'], ['dana', 'This is the only story in the Panhandle this week.']],
    [{ text: '"It was his water and his right."', fx: { liberty: 2, farm: -3 }, fb: 'Legally correct. Politically dry.' },
     { text: 'Have him give the money to a well-drilling fund for his neighbors.', fx: { farm: 3, money: -.1 }, fb: 'An expensive and generous answer. His neighbors are surprised.' },
     { text: 'Attack Vaskel for buying up the Panhandle\'s water.', cond: s => inRace(s, 'vaskel'), fx: { farm: 2, opp: { vaskel: -3 } }, fb: 'A good attack, if a strange one from the man who sold him the water.' },
     { text: replaceText, fx: { mate: 'alt', farm: -2 }, fb: replaceFb }]),
  mateEvent('crane_video', 'crane', 'The Training Video', 5,
    'A militia training video surfaces: Wyatt Crane\'s Patriot Rangers practicing on targets painted to look like federal agents. Crane says the targets were "a joke from years ago."',
    [['pryce', 'The FBI will open a file on him, and on us.'], ['wade', 'Gun owners know the Rangers. They will not care.'], ['dana', 'Older voters care very much.']],
    [{ text: 'Stand by him: "Training is not a crime."', fx: { guns: 3, seniors: -4, label: 2 }, fb: 'Gun owners rally. The video runs every night for a week.' },
     { text: 'Have Crane apologize and destroy the targets on camera.', fx: { seniors: 2, guns: -1 }, fb: 'He does it. Some Rangers call him weak.' },
     { text: 'Call the video "federal propaganda."', fx: { guns: 2, maga: 1, seniors: -2, label: 1 }, fb: 'Your base believes you. Nobody else does.' },
     { text: replaceText, fx: { mate: 'alt', guns: -3, seniors: 2 }, fb: replaceFb }]),
  mateEvent('pettit_fees', 'pettit', 'The Grazing Fees', 6,
    'Cora Lynn Pettit owes $80,000 in unpaid federal grazing fees. She says the fees are illegal. The Bureau of Land Management says she has twelve months of notices.',
    [['wade', 'Ranchers will cheer her. So will half of our voters.'], ['pryce', 'A candidate for Lieutenant Governor who does not pay what she owes is a problem.'], ['dana', 'Older voters pay what they owe.']],
    [{ text: 'Defend her: "The federal land belongs to Cimarron."', fx: { farm: 2, guns: 2, seniors: -2, label: 1 }, fb: 'Ranchers cheer. The BLM notices.' },
     { text: 'Have her pay under protest and sue for a refund.', fx: { seniors: 2, farm: 1 }, fb: 'A clean legal answer. She pays, and she is not happy.' },
     { text: 'Pay the fees yourself and keep the story short.', fx: { money: -.1, seniors: 1, label: 1 }, fb: 'The story ends. A new one begins: "The sheriff pays his running mate\'s debts."' },
     { text: replaceText, fx: { mate: 'alt', farm: -2 }, fb: replaceFb }]),
  mateEvent('tate_ruling', 'tate', 'The 2004 Ruling', 7,
    'The Rifle Association finds a 2004 ruling in which Judge Orrin Tate upheld a county ordinance banning loaded rifles in vehicles. Tate says he followed the law of the time.',
    [['wade', 'Gun owners will not care about a ruling from 2004. The Rifle Association will.'], ['pryce', 'A judge follows the law. That is the job. Say so.'], ['dana', 'Older voters trust judges. Gun owners do not.']],
    [{ text: '"A judge follows the law. Now he helps us change it."', fx: { seniors: 2, guns: -1 }, fb: 'A sensible answer that most gun owners accept.' },
     { text: 'Have Tate say he would rule differently today.', fx: { guns: 2, seniors: -1 }, fb: 'He says it. Legal scholars are unimpressed.' },
     { text: 'Attack the Rifle Association for digging up old rulings.', fx: { seniors: 1, guns: -3 }, fb: 'The Rifle Association remembers.' },
     { text: replaceText, fx: { mate: 'alt', seniors: -2 }, fb: replaceFb }]),
  mateEvent('mercer_freeze', 'mercer', 'The Exchange Freeze', 6,
    'Sloane Mercer\'s Prairie Exchange freezes all withdrawals after a hack. 60,000 Cimarron customers cannot reach their money. Some of them are retirees.',
    [['pryce', 'This is the worst possible story for our campaign. Act today.'], ['kyle', 'Crypto users know freezes happen. Normal people do not.'], ['dana', 'The retirees are the story. Nobody cares about the rest.']],
    [{ text: 'Guarantee every Cimarron customer\'s losses with your own money.', fx: { money: -1, seniors: 3, label: 1 }, fb: 'Enormous and effective. Reporters call it "the most expensive apology in state history."' },
     { text: 'Have Mercer promise to unfreeze within a week.', fx: {}, risk: { p: .5,
        win: { fx: { online: 2, liberty: 1 }, fb: 'Withdrawals resume in five days. The crypto community calls it a model response.' },
        lose: { fx: { seniors: -4, label: 2 }, fb: 'The freeze lasts a month. Retirees protest outside the campaign office.' } } },
     { text: '"Crypto is a free market. Customers accept the risk."', fx: { liberty: 1, seniors: -4, label: 2 }, fb: 'True, and cruel. The retirees are on every channel.' },
     { text: replaceText, fx: { mate: 'alt', online: -2, seniors: 1 }, fb: replaceFb }]),
  mateEvent('strand_votes', 'strand', 'The No Votes', 5,
    'Rival campaigns publish Rep. Colby Strand\'s record: he voted against the Ten Commandments law, the tornado relief bill and the abortion ban\'s funding. "No on God, no on Sumner, no on babies," says the ad.',
    [['wade', 'The Liberty Caucus loves him for those votes. Everyone else will not.'], ['tom', 'The Ten Commandments vote will hurt in every church.'], ['dana', 'The tornado vote is the one that moves voters.']],
    [{ text: 'Stand by his principles: "He voted against spending, not against God."', fx: { liberty: 3, faith: -3, farm: -2 }, fb: 'The Liberty Caucus is proud of you. Churches and farmers are not.' },
     { text: 'Have him say he regrets the tornado vote.', fx: { farm: 2, seniors: 1, liberty: -2 }, fb: 'He does it. The Liberty Caucus calls it "the first crack."' },
     { text: 'Point out that the Governor signed every one of those bills with pork in them.', cond: s => inRace(s, 'castellano'), fx: { liberty: 2, opp: { castellano: -2 } }, fb: 'A clever turn, and a small one.' },
     { text: replaceText, fx: { mate: 'alt', liberty: -3 }, fb: replaceFb }]),
  mateEvent('ostrowski_contract', 'ostrowski', 'The Pentagon Contract', 7,
    'General Mark Ostrowski\'s consulting firm helped your drone company win a $90 million Pentagon contract, six months after he retired. Ethics lawyers call it "a revolving door with a runway."',
    [['pryce', 'It was legal. It will not look legal.'], ['wade', 'Older voters love him. They do not read about contracts.'], ['dana', 'This connects the general to your money. That is the part that hurts.']],
    [{ text: 'Release every document about the contract.', fx: { seniors: 2, label: -1 }, fb: 'Legal, dull and complete. The story fades.' },
     { text: '"He served for thirty years. He can work for American companies."', fx: { seniors: 1, guns: 1, label: 1 }, fb: 'A strong defense of the man, and not of the contract.' },
     { text: 'Have your company give up the contract.', fx: { money: -.5, seniors: 2, label: -2 }, fb: 'Drastic and convincing. Your board is not pleased.' },
     { text: replaceText, fx: { mate: 'alt', seniors: -2 }, fb: replaceFb }]),
  mateEvent('sykes_subsidy', 'sykes', 'The Broadband Subsidy', 6,
    'Jolene Sykes\'s broadband co-op received $30 million in federal subsidies from the last Democratic administration. Your campaign\'s slogan is "No handouts, just freedom."',
    [['wade', 'Rural voters love her. Liberty voters hate subsidies.'], ['dana', 'Farmers who got fiber do not care where the money came from.'], ['pryce', 'Every rural co-op took that money. Say so.']],
    [{ text: '"She took Washington\'s money and gave it back to rural Cimarron."', fx: { farm: 3, liberty: -2 }, fb: 'Farmers love the line. The Liberty Caucus does not.' },
     { text: 'Have her promise never to take federal money again.', fx: { liberty: 2, farm: -2 }, fb: 'She promises. Her co-op board is furious.' },
     { text: 'Visit a town the co-op connected, and let the families talk.', fx: { farm: 2, seniors: 2, money: -.1 }, fb: 'A school principal cries on camera about her students\' homework. The ad writes itself.' },
     { text: replaceText, fx: { mate: 'alt', farm: -2 }, fb: replaceFb }]),
  mateEvent('ashby_expansion', 'ashby', 'The Expansion Vote', 5,
    'Rep. Jim Ashby voted for Medicaid expansion in 2021. It failed, but the vote is on the record. Dunmore calls your ticket "Obamacare Carol and Obamacare Jim."',
    [['wade', 'This is a gift to Dunmore. There is no way around it.'], ['dana', 'Older voters do not hate Medicaid as much as the base does.'], ['pryce', 'Three rural hospitals would still be open if that bill had passed.']],
    [{ text: 'Defend the vote: "Three hospitals would still be open."', fx: { seniors: 2, farm: 2, maga: -3, rino: 1 }, fb: 'True and brave. It confirms everything the base says about you.' },
     { text: 'Have him say he would vote differently today.', fx: { maga: 1, label: 1 }, fb: 'Nobody believes it, including him.' },
     { text: 'Change the subject to rural hospital closures.', fx: { farm: 1, seniors: 1 }, fb: 'Partly works. The nickname stays.' },
     { text: replaceText, fx: { mate: 'alt', seniors: -1 }, fb: replaceFb }]),
  mateEvent('ferris_donations', 'ferris', 'The Old Donations', 6,
    'Mayor Tom Ferris gave $2,800 to the Democratic presidential nominee in 2020, two years before he left the party. The receipt is in every rival\'s ad.',
    [['wade', 'He is a convert. Converts are welcome, but not on the ballot.'], ['dana', 'Unaffiliated voters like him more because of it. Primary voters do not.'], ['pryce', 'Let him tell his own story. It is a good story.']],
    [{ text: 'Let Ferris tell the story of why he left.', fx: {}, risk: { p: .55,
        win: { fx: { seniors: 2, chamber: 2 }, fb: '"I did not leave the Democrats. They left me." A strong speech that some Republicans share.' },
        lose: { fx: { maga: -2, rino: 1 }, fb: 'He admits he still agrees with the Democrats "on some things." That is the only clip.' } } },
     { text: 'Have him donate $28,000 to the state Republican party.', fx: { maga: 1, money: -.1 }, fb: 'Ten times the amount. The party accepts it.' },
     { text: '"Converts are welcome in this party. Ask Ronald Reagan."', fx: { seniors: 2, maga: -1 }, fb: 'A good line. Reagan was a Democrat too.' },
     { text: replaceText, fx: { mate: 'alt', chamber: -2, rino: -1 }, fb: replaceFb }]),
  mateEvent('park_paper', 'park', 'The Tariff Paper', 7,
    'The White House notices Dr. Helen Park\'s research paper: the President\'s tariffs cost Cimarron farmers $2.1 billion. The President\'s son calls her "a China apologist."',
    [['wade', 'Farmers agree with her. MAGA voters agree with the President.'], ['dana', 'The farm vote matters more to us than the President\'s favor.'], ['pryce', 'She is right. That is the problem.']],
    [{ text: 'Stand by her research: "Numbers do not have a party."', fx: { farm: 3, chamber: 1, maga: -3, pres: -5 }, fb: 'Farmers cheer. The President\'s voters do not.' },
     { text: 'Have her say the President\'s goals were right, even if the costs were high.', fx: { farm: 1, maga: 1 }, fb: 'A diplomatic answer. Both sides accept part of it.' },
     { text: 'Call for a state relief fund based on her numbers.', fx: { farm: 4, liberty: -2, money: -.1 }, fb: 'Her paper becomes a policy. Farmers remember that.' },
     { text: replaceText, fx: { mate: 'alt', farm: -2, pres: 2 }, fb: replaceFb }]),
  mateEvent('delacroix_letter', 'delacroix', 'The Officers\' Letter', 6,
    'Colonel Frank Delacroix signed a 2029 letter from 200 retired officers criticizing the President\'s withdrawal from NATO exercises. The President\'s allies call the signers "the disloyal brass."',
    [['wade', 'Veterans respect him. MAGA voters see a traitor.'], ['dana', 'Older voters are closer to the colonel than to the President on this.'], ['pryce', 'Do not attack the President. Defend the colonel\'s service.']],
    [{ text: 'Defend his service: "Thirty years in uniform earns you an opinion."', fx: { seniors: 3, guns: 1, maga: -3, pres: -4 }, fb: 'Veterans groups stand with you. The White House notices.' },
     { text: 'Have him say he supports the President as Commander in Chief.', fx: { maga: 1, seniors: -1 }, fb: 'A soldier\'s answer. Some veterans are disappointed.' },
     { text: 'Hold an event with veterans on the Fort Eisenhower base.', fx: { seniors: 2, guns: 2, faith: 1 }, fb: 'Two thousand veterans come. The letter is forgotten for a day.' },
     { text: replaceText, fx: { mate: 'alt', seniors: -2 }, fb: replaceFb }]),
);

// ================= ROLES: shared events and questions for every candidate =================
// Many events were written for the Governor. Here they are adapted for challengers:
// governor-only choices are hidden, and challengers get choices of their own (added at the end, so indices never change).
const ev = id => EVENTS.find(e => e.id === id);
const qu = id => QUESTIONS.find(q => q.id === id);
const andCond = (obj, c) => { const old = obj.cond; obj.cond = old ? s => c(s) && old(s) : c; };
const notGov = s => !isGov(s);
const vsGov = s => !isGov(s) && inRace(s, 'castellano');
const firstName = id => staffOf(id).name.replace(/^(Rev\.|Pastor|Elder|Chaplain) /, '').split(' ')[0];

// Events only the Governor can face.
for (const id of ['judge_blocks', 'contempt', 'vaskel_ads', 'oppo_revenge', 'indict_plea', 'indict_testimony', 'indict_verdict']) andCond(ev(id), s => isGov(s));
// Choices only the Governor can make.
const GOV_CHOICES = { church_arrest: [1, 3], tornado: [0, 1, 2], fbi_krantz: [3], krantz_standoff: [0], hospital: [0], shooting: [1],
  lawrenceville_murder: [3], mideast_war: [3], oil_shock: [3] };
for (const [id, idx] of Object.entries(GOV_CHOICES)) for (const i of idx) andCond(ev(id).choices[i], s => isGov(s));

andCond(ev('leaked_audio'), s => ['castellano', 'vaskel', 'whitlock'].includes(s.player));
// Whitlock would only make her offer to a candidate she could stand behind.
andCond(ev('whitlock_offer'), s => ['castellano', 'vaskel'].includes(s.player));
andCond(ev('rifle_q'), s => s.player !== 'krantz');
andCond(ev('fox_townhall').choices[2], s => inRace(s, 'dunmore'));

// Text that changes when you are not the Governor.
const forChallenger = (obj, key, fn) => { const orig = obj[key]; obj[key] = s => isGov(s) ? orig : fn(orig, s); };
forChallenger(ev('church_arrest'), 'text', t => t.replace('who campaigned for you in 2026', 'who campaigned for Governor Castellano in 2026'));
forChallenger(ev('donor_deal'), 'text', t => t.replace('he asks you to veto a bill', 'he asks you to promise that, as governor, you will veto a bill'));
forChallenger(ev('right_to_life'), 'text', t => t.replace('Your current law has', 'The state\'s current law has'));
forChallenger(ev('president_call'), 'text', t => t.replace('You will fire your Secretary of State', 'You will promise to fire the Secretary of State on your first day').replace('And you will publicly support', 'And you will publicly support'));
forChallenger(ev('president_call').choices[1], 'text', t => t.replace('Fire the Secretary', 'Promise to fire the Secretary'));
forChallenger(ev('fox_townhall').choices[3], 'text', () => 'Decline. You are busy campaigning.');
forChallenger(ev('donor_leak').choices[0], 'text', () => 'Return the $3 million and promise to sign the well-cleanup bill.');
forChallenger(ev('favor_drones').choices[1].risk.win, 'fb', () => 'The President\'s son says open bidding is "fair," and that his company expects to win it. The White House is satisfied.');
forChallenger(ev('favor_drones').choices[1].risk.lose, 'fb', () => 'The President\'s son hears a "no" in your answer. He stops returning your calls.');
forChallenger(ev('growth_club').choices[0], 'fb', () => 'The Club endorses you and funds ads. Its lawyers send you a copy of the pledge, with your signature highlighted.');
forChallenger(ev('favor_pardon'), 'text', t => t.replace('He would consider a pardon a personal kindness.', 'He would consider a public promise to pardon him, if you win, a personal kindness.'));
forChallenger(ev('favor_pardon').choices[0], 'text', () => 'Promise to pardon Renner if you win.');
forChallenger(ev('favor_pardon').choices[0], 'fb', () => 'The President calls you personally. In the Panhandle, the farm families hold a press conference in a church basement.');
forChallenger(ev('favor_pardon').choices[1], 'text', () => 'Promise to reduce his sentence, but keep the order to repay the families.');
forChallenger(ev('favor_drones'), 'text', t => t.replace('offers the state police a $140 million contract', 'wants a promise: a $140 million state police contract').replace('The President\'s son calls you himself.', 'If you win, the contract would be yours to sign. The President\'s son calls you himself.'));
forChallenger(ev('favor_drones').choices[0], 'text', () => 'Promise the no-bid contract.');
forChallenger(ev('favor_drones').choices[1], 'text', () => 'Promise open bidding, and invite Liberty Drone to compete.');
forChallenger(ev('favor_drones').choices[2], 'text', () => 'Promise a small pilot contract for $10 million.');
ev('staff_split').choices.forEach((c, i) => { const who = ['wade', 'dana', 'kyle', 'pryce'][i], orig = c.text; c.text = () => orig.replace(/^[A-Z][a-z]+'s plan/, `${firstName(who)}'s plan`); });

// Challengers' choices in the Governor's crises.
const add = (id, ...choices) => ev(id).choices.push(...choices);
add('church_arrest',
  { cond: notGov, text: 'Call on the Governor to keep troopers out of houses of worship.', fx: { faith: 3, seniors: 1, maga: -2, opp: { castellano: -1 } },
    fb: 'Pastors thank you. The Governor\'s office says it "does not take advice from candidates."' },
  { cond: notGov, text: 'Say the arrest was right, and the Governor should do more of them.', fx: { maga: 3, online: 2, faith: -3 },
    fb: 'The base agrees. Several pastors preach against your statement.' },
  { cond: only('rick'), unlock: 'You are a pastor', text: 'Open Cornerstone Church to the Nueva Vida congregation next Sunday.', fx: { faith: 4, seniors: 2, maga: -3 },
    fb: 'Nine thousand members and two hundred Nueva Vida families worship together. Border hawks in your campaign are quiet about it.' });
add('tornado',
  { cond: notGov, text: 'Suspend your campaign for a week and volunteer in Sumner.', fx: { farm: 3, seniors: 3, faith: 1, money: -.1 },
    fb: 'You spend a week clearing debris. The cameras find you on the third day.' },
  { cond: vsGov, text: 'Criticize the Governor\'s slow response.', fx: { maga: 2, farm: 1, seniors: -1, opp: { castellano: -3 } },
    fb: 'Fair or not, the charge sticks. Some voters think it is too early for politics.' },
  { cond: only('dunmore'), unlock: 'The Show', text: 'Broadcast the show live from Sumner for three days.', fx: { online: 3, maga: 2, farm: 2 },
    fb: 'Three days of live radio from a parking lot. Your listeners send 40 truckloads of supplies.' },
  { cond: only('rick'), unlock: 'Cornerstone Relief', text: 'Send three thousand Cornerstone volunteers.', fx: { faith: 3, farm: 3, seniors: 2 },
    fb: 'Your volunteers arrive before FEMA does. Sumner will not forget the yellow Cornerstone shirts.' },
  { cond: only('krantz'), unlock: 'Harlan deputies', text: 'Lead your deputies in the search and rescue.', fx: { guns: 3, farm: 3, seniors: 2 },
    fb: 'Your deputies pull four people from the rubble. The Sumner sheriff thanks you on television.' },
  { cond: only('vaskel'), unlock: 'Your companies', text: 'Donate satellite internet, drones and $2 million.', fx: { farm: 2, seniors: 2, money: -.5, label: 1 },
    fb: 'The drones find two missing people. Your logo is on every tent.' },
  { cond: only('whitlock'), unlock: 'Thirty years in the Senate', text: 'Call your old Senate allies and pass emergency relief in three days.', fx: { seniors: 3, farm: 2, chamber: 1 },
    fb: 'The relief bill passes in 72 hours. It reminds people what you used to do for a living.' });
add('fbi_krantz',
  { cond: notGov, text: 'Call for an independent investigation of the jail death.', fx: { seniors: 2, guns: -2, opp: { krantz: -3 } },
    fb: 'Responsible, and it keeps the story alive. Krantz calls you "a tool of the FBI."' });
add('krantz_standoff',
  { cond: notGov, text: 'Drive to Dry Fork and stand between the two sides yourself.', fx: {},
    risk: { p: .5,
      win: { fx: { seniors: 3, guns: 2, opp: { krantz: -3 } }, fb: 'You talk to both sides for five hours. The BLM agrees to wait, and the volunteers go home. Krantz looks like the man who started it.' },
      lose: { fx: { guns: -2, seniors: -2, label: 1 }, fb: 'Krantz\'s volunteers turn their backs on you. The cameras catch everything.' } } });
add('hospital',
  { cond: notGov, text: 'Promise to reopen the hospital in your first 100 days.', fx: { farm: 2, seniors: 2, liberty: -1 },
    fb: 'A promise the people of Dry Fork will remember, one way or another.' },
  { cond: vsGov, text: 'Blame the Governor\'s budget cuts for the closure.', fx: { farm: 2, seniors: 1, liberty: -1, opp: { castellano: -2 } },
    fb: 'The county aid cuts are real. The Governor\'s office says the hospital\'s problems are older.' });
add('shooting',
  { cond: notGov, text: 'Call on the Governor to hold a special session on school security.', fx: { seniors: 2, faith: 1, guns: 1 },
    fb: 'A reasonable demand. It puts the Governor on the defensive.' });
add('lawrenceville_murder',
  { cond: vsGov, text: 'Blame the Governor\'s release law.', fx: { maga: 3, guns: 1, opp: { castellano: -3 } },
    fb: 'The Governor signed the law. Dunmore made the same attack an hour earlier.' });
add('mideast_war',
  { cond: notGov, text: 'Call on the Governor to suspend the state gas tax.', fx: { farm: 2, seniors: 2, opp: { castellano: -1 } },
    fb: 'The Governor says the budget cannot afford it. Voters at the pump disagree.' });
// A challenger who backed the war cannot suspend a tax. The Governor's choice is hidden, and the challenger can promise it.
andCond(ev('hawk_diesel').choices[0], s => isGov(s));
add('hawk_diesel',
  { cond: notGov, text: 'Promise to suspend the state diesel tax on your first day, and ask the Governor to do it now.', fx: { farm: 3, seniors: 1, opp: { castellano: -1 } },
    fb: 'The farmers like the promise, and they like watching the Governor squirm even more.' });
add('oil_shock',
  { cond: notGov, text: 'Promise emergency fuel aid for farmers and seniors if you win.', fx: { farm: 2, seniors: 2, liberty: -2 },
    fb: 'A promise that sounds good at $6.80 a gallon.' });

// The first running-mate stories were written with a specific replacement. Now the replacement is your next running mate.
for (const [id, i, fb] of [['voss_posts', 1, s => `${altMate(s).name} files on Friday. Voss posts a long essay called "The Regime Always Wins." Many young activists share it.`],
  ['ruud_milk', 3, s => `${altMate(s).name} joins the ticket the next day. Ruud tells two hundred thousand followers that you "sold out mothers to protect Pharma."`],
  ['brannigan_record', 3, s => `Brannigan leaves quietly, and ${altMate(s).name} joins the ticket. Gun owners are angry that you did not wait for the facts.`],
  ['pryce_chamber', 1, s => `Pryce leaves the ticket with dignity, and ${altMate(s).name} replaces him. Several of his friends stop giving, and one of them says so in the Ledger.`]]) {
  const c = ev(id).choices[i];
  c.text = replaceText; c.fb = fb; c.fx = { ...c.fx, mate: 'alt' };
}

// ---- Questions ----
for (const [id, rival] of [['deport', 'dunmore'], ['travel_ban', 'rick'], ['badminton', 'krantz'], ['christian_nat', 'rick'], ['wind', 'dunmore'], ['everify', 'dunmore']]) andCond(qu(id), s => inRace(s, rival));
for (const id of ['alcatraz_citizen', 'btc_crash', 'dei_state', 'pardon_repeat', 'child_labor_followup', 'raw_milk_fda']) andCond(qu(id), s => isGov(s));
for (const [id, i] of [['deport', 1], ['badminton', 3], ['stolen', 1], ['krantz_sheriff', 1]]) andCond(qu(id).answers[i], s => isGov(s));
forChallenger(qu('stolen'), 'text', t => t.replace('"Governor, do you', '"{you}, do you'));
forChallenger(qu('university'), 'text', t => t.replace('after your executive order', 'after the Governor\'s executive order'));
forChallenger(qu('podcast'), 'text', t => t.replace('"Is the Governor Really a Conservative?"', '"Is {name} Really a Conservative?"'));

// Questions that only one candidate is asked.
QUESTIONS.push(
  { id: 'q_dunmore_show', cond: only('dunmore'), setting: 'Interview · Cimarron Ledger',
    text: '"If you are elected governor, will you keep hosting the show?"',
    answers: [
      { text: 'Yes. Every Monday, live from the Governor\'s office.', fx: { online: 3, maga: 2, seniors: -2, label: 1 }, fb: 'Your audience loves it. Older voters wonder when you would govern.' },
      { text: 'No. The show was how I got here. The job is why I came.', fx: { seniors: 3, online: -2 }, fb: 'A serious answer. Some of your listeners feel abandoned.' },
      { text: 'Once a month, and I will give the money to charity.', fx: { seniors: 1, online: 1 }, fb: 'A compromise that nobody hates.' },
    ] },
  { id: 'q_rick_pulpit', cond: only('rick'), setting: 'Interview · KCIM-TV Channel 4',
    text: '"If you are elected, will you still preach at Cornerstone on Sundays?"',
    answers: [
      { text: 'Yes. A governor can serve God on Sunday and the state the other six days.', fx: { faith: 3, liberty: -2, seniors: -1 }, fb: 'Your congregation is thrilled. Constitutional lawyers are already writing briefs.' },
      { text: 'No. My son will lead the church. I will lead the state.', fx: { seniors: 3, chamber: 1, faith: -1 }, fb: 'A clear line that reassures many voters.' },
      { text: 'Only on Easter and Christmas.', fx: { faith: 1, seniors: 1 }, fb: 'A graceful answer.' },
    ] },
  { id: 'q_krantz_badge', cond: only('krantz'), setting: 'Rally · Harlan County Courthouse',
    text: '"Sheriff, will you resign your badge while you run for governor?"',
    answers: [
      { text: 'No. Harlan County elected me, and I will serve until my last day.', fx: { guns: 3, seniors: -1 }, fb: 'Your county is proud. Critics say you are campaigning on the taxpayers\' time.' },
      { text: 'I will take unpaid leave until the primary.', fx: { seniors: 3, liberty: 1, guns: -1 }, fb: 'A careful answer that ends the question.' },
      { text: 'A sheriff never takes off the badge. Neither will this governor.', fx: { guns: 3, maga: 2, seniors: -2, label: 1 }, fb: 'A great line for a rally. A worrying one for anyone who was not there.' },
    ] },
  { id: 'q_vaskel_trust', cond: only('vaskel'), setting: 'Editorial Board · Cimarron Ledger',
    text: '"Will you put your companies in a blind trust if you are elected?"',
    answers: [
      { text: 'Yes. A full blind trust, on my first day.', fx: { seniors: 3, chamber: 1, label: -2 }, fb: 'The editorial board is impressed. Your investors are not.' },
      { text: 'No. My companies are my record. Voters can see them.', fx: { liberty: 2, online: 1, label: 2 }, fb: 'Honest, and a gift to every rival.' },
      { text: 'I will sell every company that does business with the state.', fx: { seniors: 2, liberty: 1, label: -1, money: -.3 }, fb: 'A strong answer that costs you real money.' },
    ] },
  { id: 'q_whitlock_age', cond: only('whitlock'), setting: 'Interview · Max News',
    text: '"Senator, you would be 68 on inauguration day. Are you too old for this job?"',
    answers: [
      { text: 'I am old enough to remember when this party balanced budgets.', fx: { seniors: 3, chamber: 1, label: -1 }, fb: 'The line is quoted in every paper. Younger voters roll their eyes.' },
      { text: 'Ask me again after the debate.', fx: { seniors: 1, label: -1 }, fb: 'Confident. Now the debate has to go well.' },
      { text: 'I will serve one term, and then hand it to the next generation.', fx: { seniors: 2, online: 1, label: -2 }, fb: 'A surprising promise. It takes the question away.' },
    ] },
);
// Every campaign meets its running mate's story, and the Governor his record's story, before the final weeks.
for (const e of EVENTS) if (e.kind === 'Running Mate' || e.kind === 'Record') e.due = 17;
// Some organizations already stand with some candidates.
PLAYER_INFO.krantz.endorsements = ['rifle'];
PLAYER_INFO.vaskel.endorsements = ['growth'];
andCond(ev('staff_split').choices[2], s => inRace(s, 'dunmore'));
