// ============================================================
// THE SECOND DEBATE — questions that come from the campaign so far.
// A round-2 question is asked only when its cond is true: the President's endorsement, the war, the front-runner,
// the Governor's scandals, dropouts, Pike, Coburn, and your own weak spot. The second debate asks up to three of them.
// Rival answers may be functions of the game state (for example, the endorsed rival answers differently).
// ============================================================

// How the moderator addresses you: "Governor", "Sheriff Krantz", "Senator Whitlock"...
const who2 = s => ({ castellano: 'Governor', dunmore: 'Lieutenant Governor', rick: 'Pastor Rick', krantz: 'Sheriff Krantz', vaskel: 'Mr. Vaskel', whitlock: 'Senator Whitlock' })[s.player];
const leaderOf = s => sorted(stateShares(s))[0][0];
const pr = (s, id) => id === 'whitlock' ? 'her' : 'him';
// Only the strongest rivals go on the attack; the others answer without attacking.
const attackers = (s, n = 2) => sorted(stateShares(s)).map(e => e[0]).filter(id => id !== 'you').slice(0, n);

DEBATE_QUESTIONS.push(
  { id: 'd2_endorsed', round: 2, cond: s => !!s.endorsed,
    text: s => s.endorsed === 'you'
      ? `MODERATOR: "${who2(s)}, the President has endorsed you. What do you owe him? And to everyone else: why should Republicans vote against the President's choice?"`
      : `MODERATOR: "The President has endorsed ${displayName(s, s.endorsed)}. Why should Republicans vote against the President's choice?"`,
    answers: [
      { cond: s => s.endorsed === 'you', text: '"I owe him my loyalty and my results. Cimarron will be the first state to finish his agenda."', fx: { maga: 3, pres: 3, seniors: -1 }, fb: 'Loyal and energetic. The MAGA base is locked in.' },
      { cond: s => s.endorsed === 'you', text: '"I owe him good government. That is what he endorsed."', fx: { seniors: 2, chamber: 1, maga: -1 }, fb: 'A careful answer. Some MAGA voters wanted more gratitude.' },
      { cond: s => s.endorsed !== 'you', text: '"I support the President. I just know Cimarron better than his political team does."', fx: { maga: 2, seniors: 1 }, fb: 'You disagree with the endorsement without disagreeing with the President.' },
      { cond: s => s.endorsed !== 'you', text: '"The President does not vote in our primary. You do."', fx: { liberty: 2, seniors: 1, maga: -2, pres: -4 }, fb: 'Independent and bold. The President\'s voters hear defiance.' },
    ],
    rivals: {
      castellano: s => s.endorsed === 'castellano' ? { text: '"The President knows a winner in court when he sees one. I am grateful, and I will deliver."', fx: { maga: 3 } } : { text: '"I have sued the last administration forty-one times. I do not need permission to be a conservative."', fx: { liberty: 2, seniors: 1 } },
      dunmore: s => s.endorsed === 'dunmore' ? { text: '"The President and I have built this movement together. Now we finish it."', fx: { maga: 4, online: 1 } } : { text: '"I love the President. He was badly advised on this one."', fx: { maga: 2 } },
      rick: s => s.endorsed === 'rick' ? { text: '"The President saw a man of faith. I will not let him down, and I will not let the Lord down."', fx: { faith: 3, maga: 2 } } : { text: '"I answer to a higher authority than any President."', fx: { faith: 3, maga: -1 } },
      krantz: s => s.endorsed === 'krantz' ? { text: '"The President backs sheriffs. I back him."', fx: { guns: 3, maga: 2 } } : { text: '"Endorsements do not enforce laws. Sheriffs do."', fx: { guns: 2, liberty: 1 } },
      vaskel: s => s.endorsed === 'vaskel' ? { text: '"The President understands builders. So do the voters."', fx: { chamber: 2, maga: 2 } } : { text: '"I respect the President. I also respect a good product, and I have the better product."', fx: { liberty: 2 } },
      whitlock: { text: '"The President has never endorsed me, and I sleep fine."', fx: { seniors: 2, chamber: 1 } },
      coburn: s => s.endorsed === 'coburn' ? { text: '"The President is my friend and my coach. Let\'s go win."', fx: { maga: 3, seniors: 1 } } : { text: '"The President and I talk every week. He will come around."', fx: { maga: 1 } },
    } },
  { id: 'd2_war', round: 2, cond: s => !!s.war,
    text: 'MODERATOR: "Diesel is over $7 a gallon, and the war has no end in sight. Was the President right to start it, and what will you do about fuel prices?"',
    answers: [
      { text: '"He was right. America does not negotiate with people who kill our soldiers. And I will suspend the state diesel tax."', fx: { maga: 3, faith: 2, farm: 1, online: -3, pres: 3 }, fb: 'Loyal to the war and practical about diesel. The hawks cheer.' },
      { text: '"It is time for a ceasefire. Our farmers are paying for a war they did not choose."', fx: { online: 3, farm: 3, seniors: 2, pres: -6, faith: -2 }, fb: 'A break with the President. Farmers and the New Right agree with you.' },
      { text: '"I support our troops. I will not second-guess the Commander in Chief on a debate stage."', fx: { seniors: 1, maga: 1 }, fb: 'A safe answer that avoids the question.' },
      { cond: s => s.player === 'whitlock', text: '"I warned about this war two years ago. I take no pleasure in being right."', fx: { seniors: 3, chamber: 2, maga: -3, pres: -4 }, fb: 'The strongest moment of your campaign. Older voters remember your warnings.' },
    ],
    rivals: {
      castellano: { text: '"I support the President, and my Attorney General is suing the oil companies for price gouging."', fx: { maga: 2, farm: 1 } },
      dunmore: { text: '"The President is a wartime leader. I stand with him, and I will cut every state fuel tax."', fx: { maga: 3, farm: 1 } },
      rick: { text: '"We pray for our troops, and for Israel. The President has my support."', fx: { faith: 3 } },
      krantz: { text: '"My deputies are guarding fuel depots in the Panhandle. Diesel first, politics later."', fx: { farm: 2, guns: 1 } },
      vaskel: { text: '"This war proves we need energy independence. I will build it, starting with the gas we waste in the Panhandle."', fx: { liberty: 2, farm: 2 } },
      whitlock: { text: '"I said this would happen. Farmers deserve a governor who tells them the truth."', fx: { seniors: 3, farm: 2 } },
      coburn: { text: '"Our troops are the real team. And I will cut the gas tax to zero."', fx: { maga: 2, farm: 2 } },
    } },
  { id: 'd2_leader', round: 2, cond: s => s.step >= 20,
    text: s => leaderOf(s) === 'you'
      ? `MODERATOR: "${who2(s)}, you lead every poll. Your rivals say you cannot win in November. Why are they wrong?"`
      : `MODERATOR: "${displayName(s, leaderOf(s))} leads every poll. Why should Republicans stop the front-runner?"`,
    answers: [
      { cond: s => leaderOf(s) === 'you', text: '"Because the voters of this state already trust me, and they will again."', fx: { seniors: 2, maga: 1, chamber: 1 }, fb: 'A calm front-runner\'s answer.' },
      { cond: s => leaderOf(s) === 'you', text: '"Front-runners get attacked. The people attacking me are the ones who are losing."', fx: { maga: 2, online: 1, seniors: -1 }, fb: 'Confident, maybe a little arrogant. The base likes it.' },
      { cond: s => leaderOf(s) !== 'you', text: '"The front-runner is exactly the candidate the Democrats want to face in November."', fx: { seniors: 2, chamber: 1, oppLeader: -2 }, fb: 'An electability attack. It lands with older voters.' },
      { cond: s => leaderOf(s) !== 'you', text: '"Polls do not vote. I will see you on August 4."', fx: { maga: 1, online: 1 }, fb: 'A classic underdog line.' },
    ],
    rivals: Object.fromEntries(['castellano', 'dunmore', 'rick', 'krantz', 'vaskel', 'whitlock', 'coburn'].map(id => [id, s => {
      const L = leaderOf(s), lines = {
        castellano: ['"I have won a statewide race before. None of these men have."', '"The front-runner has a slogan. I have a record."'],
        dunmore: ['"They attack me because the uniparty is scared."', '"The front-runner is the establishment\'s last hope."'],
        rick: ['"I lead because the churches of this state are awake."', '"The front-runner has not said one word about the unborn tonight."'],
        krantz: ['"I lead because people trust a man who keeps his oath."', '"The front-runner has never stood on a road for anybody."'],
        vaskel: ['"The market has spoken."', '"The front-runner has never built anything."'],
        whitlock: ['"If I am leading, something very unusual is happening, and I am grateful."', '"The front-runner will lose the general election. I have seen it before."'],
        coburn: ['"Scoreboard."', '"Nobody remembers who led at halftime."'],
      }[id];
      return L === id ? { text: lines[0], fx: { seniors: 1, maga: 1 } } : { text: lines[1], fx: { seniors: 1 }, attack: attackers(s).includes(id) ? L : undefined };
    }])) },
  { id: 'd2_resort', round: 2, cond: s => !!s.flags.resort_seen || s.seenEvents.includes('gov_resort'),
    text: s => isGov(s)
      ? 'MODERATOR: "Governor, during the ice storm you were at a resort in Mexico. Forty thousand families had no heat. What do you say to them tonight?"'
      : 'MODERATOR: "During the ice storm, Governor Castellano was at a resort in Mexico. Is that a reason to fire him?"',
    answers: [
      { cond: s => isGov(s), text: '"I should have been home. I was wrong, and I have been in the Panhandle every week since."', fx: { seniors: 2, farm: 2, label: -1 }, fb: 'A sincere answer. It takes the air out of the attack.' },
      { cond: s => isGov(s), text: '"My staff did their jobs. The power came back faster than in any storm in state history."', fx: { chamber: 1, farm: -2, label: 1 }, fb: 'True, and nobody wants to hear it.' },
      { cond: s => !isGov(s), text: '"A governor on a beach during a disaster has told you everything you need to know."', fx: { maga: 2, farm: 2, opp: { castellano: -3 } }, fb: 'A clean, cutting line. The Governor looks at his notes.' },
      { cond: s => !isGov(s), text: '"Everyone deserves a vacation. Not that week."', fx: { seniors: 2, farm: 1, opp: { castellano: -1 } }, fb: 'Fair and memorable.' },
    ],
    rivals: {
      castellano: { text: '"I made a mistake, and I came home. I have been in the Panhandle every week since."', fx: { seniors: 1 } },
      dunmore: { text: '"I was acting governor that week. I know exactly where he was."', fx: { maga: 2, farm: 1 }, attack: 'castellano' },
      rick: { text: '"Our volunteers were in Dry Fork before the Governor\'s plane landed."', fx: { faith: 2, farm: 1 }, attack: 'castellano' },
      krantz: { text: '"My deputies drove generators to Dry Fork. The Governor sent a press release."', fx: { guns: 2, farm: 1 }, attack: 'castellano' },
      vaskel: { text: '"My satellites kept Dry Fork online. The Governor\'s phone worked fine in Mexico."', fx: { online: 2 }, attack: 'castellano' },
      whitlock: { text: '"Victor made a mistake. The question is whether he learned anything from it."', fx: { seniors: 2 } },
      coburn: { text: '"You don\'t leave the stadium in the fourth quarter."', fx: { seniors: 1, farm: 1 }, attack: 'castellano' },
    } },
  { id: 'd2_tolliver', round: 2, cond: s => !!s.flags.indicted,
    text: s => isGov(s)
      ? 'MODERATOR: "Governor, your former Chief of Staff has pleaded guilty. Yes or no: did you know about the contracts?"'
      : 'MODERATOR: "The Governor\'s former Chief of Staff has pleaded guilty. What would you change so this never happens again?"',
    answers: [
      { cond: s => isGov(s), text: '"No. I have released every email to prove it."', fx: { seniors: 2, chamber: 1 }, fb: 'A direct answer. The moderator moves on.' },
      { cond: s => isGov(s), text: '"I trusted a friend, and he betrayed that trust."', fx: { seniors: 1, faith: 1 }, fb: 'Human, and it does not answer the question.' },
      { cond: s => !isGov(s), text: '"An inspector general for every state contract, starting on my first day."', fx: { seniors: 2, liberty: 2, opp: { castellano: -1 } }, fb: 'A solution, not an accusation. Older voters like it.' },
      { cond: s => !isGov(s), text: '"The Governor knew. Everyone in the Capitol knows he knew."', fx: { maga: 2, seniors: -1, opp: { castellano: -3 } }, fb: 'The crowd gasps. The Governor asks for a chance to respond, and does not get one.' },
    ],
    rivals: {
      castellano: { text: '"Mark lied to me, and he will go to prison for it. I did not know."', fx: { seniors: 1 } },
      dunmore: { text: '"The Attorney General is investigating the Governor\'s office. So are the voters."', fx: { maga: 2 }, attack: 'castellano' },
      rick: { text: '"What is done in darkness will come to light."', fx: { faith: 2 }, attack: 'castellano' },
      krantz: { text: '"I have arrested men for less."', fx: { guns: 2 }, attack: 'castellano' },
      vaskel: { text: '"In my companies, a scandal like this ends a career."', fx: { liberty: 2 }, attack: 'castellano' },
      whitlock: { text: '"I wrote the ethics law he broke. It needs teeth."', fx: { seniors: 2, chamber: 1 } },
      coburn: { text: '"A team is only as good as its captain."', fx: { seniors: 1 }, attack: 'castellano' },
    } },
  { id: 'd2_dropped', round: 2, cond: s => s.dropped.length > 0,
    text: s => { const d = s.dropped[s.dropped.length - 1]; return `MODERATOR: "${CAND[d].name} has left the race. What do you say to the voters who supported ${pr(s, d)}?"`; },
    answers: [
      { text: '"Come home. This party has room for every one of you."', fx: { seniors: 1, faith: 1, guns: 1, farm: 1, online: 1 }, fb: 'A generous answer that reaches a little of everyone.' },
      { text: '"Your candidate is gone, but your issues are not. I will fight for them."', fx: { maga: 2, seniors: 1 }, fb: 'A direct appeal. Some of those voters listen.' },
      { text: '"They chose a candidate who could not win. I can."', fx: { maga: 1, seniors: -1 }, fb: 'Blunt. Some of those voters are offended.' },
    ],
    rivals: {
      castellano: { text: '"Those voters want results. I have a record of results."', fx: { seniors: 2 } },
      dunmore: { text: '"The movement is bigger than any candidate. Come on the show, and let\'s talk."', fx: { maga: 2, online: 1 } },
      rick: { text: '"The church doors are open to every one of you."', fx: { faith: 2 } },
      krantz: { text: '"If you want someone who keeps his word, you know where Harlan County is."', fx: { guns: 2 } },
      vaskel: { text: '"I will keep every good idea your candidate had, and pay for it."', fx: { liberty: 2 } },
      whitlock: { text: '"You are welcome here, even if you never agreed with me before."', fx: { seniors: 2 } },
      coburn: { text: '"Join the team. We need everybody."', fx: { maga: 1, seniors: 1 } },
    } },
  { id: 'd2_pike', round: 2, cond: s => !!s.flags.pike_ally || !!s.flags.pike_snub || s.seenEvents.includes('pike_stream'),
    text: 'MODERATOR: "Mason Pike has two million followers and a direct line to the President\'s son. Is he a leader of this party, or a danger to it?"',
    answers: [
      { text: '"He speaks to young people nobody else reaches. I will not apologize for talking to them."', fx: { online: 3, seniors: -2 }, fb: 'The young right hears a friend. Older voters hear a warning sign.' },
      { text: '"Some of what he says is ugly, and I have said so. The party does not need him."', fx: { faith: 2, seniors: 2, online: -3 }, fb: 'Pastors and older voters applaud. Pike\'s chat does not.' },
      { text: '"He is a streamer. I am running for governor. Next question."', fx: { seniors: 1 }, fb: 'A dismissal that satisfies nobody and offends nobody.' },
      { cond: s => !!s.flags.pike_ally, unlock: 'You went on his stream', text: '"He was with me before it was popular. I stand with my friends."', fx: { online: 3, maga: 1, seniors: -2, label: 1 }, fb: 'Loyal. The clips from his stream are now your clips too.' },
    ],
    rivals: {
      castellano: { text: '"Every movement has people who say ugly things. Leaders say no to them."', fx: { seniors: 2, faith: 1 } },
      dunmore: { text: '"Mason calls me a boomer. He also sells merch to children. I know which of us is the grifter."', fx: { maga: 2, online: -1 } },
      rick: { text: '"What he says about Jewish people is a sin. I will not share a stage with him."', fx: { faith: 3, online: -2 } },
      krantz: { text: '"I do not watch streams. I watch my county."', fx: { seniors: 1 } },
      vaskel: { text: '"He is the most important media figure under 35 in this state. Ignore that at your peril."', fx: { online: 3 } },
      whitlock: { text: '"He is a danger, and the party should say so out loud."', fx: { seniors: 2, online: -2 } },
      coburn: { text: '"My teammates\' kids watch him. I wish they didn\'t."', fx: { seniors: 2 } },
    } },
  { id: 'd2_label', round: 2, cond: s => (s.label || 0) >= 2,
    text: s => { const L = PLAYER_INFO[s.player].label.toLowerCase(); return `MODERATOR: "${who2(s)}, your rivals call you ${/less$/.test(L) ? L : `a ${L}`}. Tonight, answer them."`; },
    answers: [
      { text: '"I have made mistakes this year, and I have owned every one of them."', fx: { seniors: 2, label: -1 }, fb: 'An honest answer. It takes some of the sting out of the label.' },
      { text: '"Name-calling is what candidates do when they cannot beat your record."', fx: { maga: 2, online: 1 }, fb: 'A fighter\'s answer. The label stays where it is.' },
      { cond: s => s.player === 'castellano', text: '"A phony changes with the wind. I have sued Washington forty-one times, and I never changed sides once."', fx: { maga: 2, label: -1 }, fb: 'A lawyer\'s closing argument, and a good one.' },
      { cond: s => s.player === 'dunmore', text: '"A grifter takes your money and gives you nothing. My listeners get the truth every Monday, for free."', fx: { online: 2, maga: 1, label: -1 }, fb: 'Your audience roars. The Patriot Protein ads are not mentioned.' },
      { cond: s => s.player === 'rick', text: '"I am a sinner saved by grace, like everyone in this room. That is not hypocrisy. That is the Gospel."', fx: { faith: 3, seniors: 1, label: -1 }, fb: 'The best answer of the night for church voters.' },
      { cond: s => s.player === 'krantz', text: '"Lawless? I have enforced the law in Harlan County for sixteen years. I have just never let Washington write it."', fx: { guns: 3, label: -1 }, fb: 'Gun owners stand up. Older voters are half convinced.' },
      { cond: s => s.player === 'vaskel', text: '"I chose Cimarron. My children go to school here. Some of these men were born here and never did anything for it."', fx: { farm: 1, seniors: 1, label: -2 }, fb: 'A sharp answer that turns the attack around.' },
      { cond: s => s.player === 'whitlock', text: '"I am 67, and I have been right about more things than everyone on this stage put together."', fx: { seniors: 3, label: -2 }, fb: 'The line of the night. Even the hecklers laugh.' },
    ],
    rivals: Object.fromEntries(['castellano', 'dunmore', 'rick', 'krantz', 'vaskel', 'whitlock', 'coburn'].map(id => [id, s => {
      const L = PLAYER_INFO[s.player].label.toLowerCase();
      const t = { castellano: `"I did not choose the word ${L}. The voters did."`, dunmore: `"We said ${L} on the show a hundred times. Nobody has disproved it."`,
        rick: '"The truth sets you free. It does not always get you elected."', krantz: '"A man\'s reputation is what his neighbors say when he is not in the room."',
        vaskel: '"The data on this are very clear."', whitlock: '"I will not call anyone names. I will let the voters decide."', coburn: '"Words hurt. Scoreboards hurt more."' }[id];
      return { text: t, fx: { seniors: 1 }, attack: id !== 'whitlock' && attackers(s).includes(id) ? 'you' : undefined };
    }])) },
  { id: 'd2_coburn', round: 2, cond: s => inRace(s, 'coburn'),
    text: 'MODERATOR: "Mr. Coburn has voted in three of the last ten Republican primaries. Is that disqualifying?"',
    answers: [
      { text: '"Voting is the least a citizen can do. He could not do the least."', fx: { seniors: 2, opp: { coburn: -3 } }, fb: 'A tough line. Coburn\'s fans boo.' },
      { text: '"Jake is welcome in this party. The governorship is not an entry-level job."', fx: { seniors: 2, chamber: 1, opp: { coburn: -1 } }, fb: 'Gracious and pointed.' },
      { text: '"Plenty of good people stopped voting because politicians let them down. Jake is not the problem."', fx: { maga: 2, online: 1 }, fb: 'You defend the non-voters. Many of them are watching.' },
    ],
    rivals: {
      coburn: { text: '"I was playing football on Sundays. Now I am showing up for Cimarron."', fx: { maga: 2, seniors: 1 } },
      castellano: { text: '"Jake is a great quarterback. I would not let him argue a case before the Supreme Court."', fx: { seniors: 1 }, attack: 'coburn' },
      dunmore: { text: '"The movement is for people who stopped voting. Jake is one of us."', fx: { maga: 2 } },
      rick: { text: '"Showing up matters. On Sunday and on election day."', fx: { faith: 2 }, attack: 'coburn' },
      krantz: { text: '"I have voted in every election for forty years."', fx: { seniors: 2 } },
      vaskel: { text: '"Voting history is data. The data are not good, Jake."', fx: { liberty: 1 }, attack: 'coburn' },
      whitlock: { text: '"It is not disqualifying. It is revealing."', fx: { seniors: 2 }, attack: 'coburn' },
    } },
);
// Round-2 questions are never asked in the first debate, and generic questions are asked only when fewer than three round-2 questions apply.
for (const q of DEBATE_QUESTIONS) q.needs = q.needs || [];
