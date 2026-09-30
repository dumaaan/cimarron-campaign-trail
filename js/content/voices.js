// ============================================================
// VOICES — the same questions, in each candidate's own voice.
// For a challenger, questions about using the governor's power ask what they WOULD do.
// Each candidate also gets one answer of their own in the questions that matter most to them.
// Answers are added at the end of each question, so the original indices never change.
// ============================================================

// A challenger has no power yet: "What will you do?" becomes "What would you do as governor?"
for (const q of QUESTIONS) {
  if (/^q_/.test(q.id)) continue;
  const orig = q.text;
  q.text = s => {
    const t = textOf(s, orig);
    if (!s || isGov(s)) return t;
    return t.replace(/What will you do\?/g, 'What would you do as governor?').replace(/Will Cimarron send troops\?/, 'As governor, would you send them?')
      .replace(/\bWill you\b/g, 'Would you').replace(/\bwill you\b/g, 'would you');
  };
}

const VOICES = {
  deport: {
    rick: ['Scripture tells us to obey the law and to welcome the stranger. We deport criminals, and we protect the families who worship with us.', { faith: 3, seniors: 1, maga: -2 }, 'A pastor\'s answer. Evangelicals nod. Border hawks hear the word "protect" and frown.'],
    krantz: ['My deputies have done this for years. Give every sheriff the authority, and it will be done in a year.', { guns: 3, maga: 3, chamber: -2 }, 'Sheriffs across the state cheer. Employers wonder who will work their plants.'],
    vaskel: ['Deport every criminal, and let my engineers build the system that finds them in weeks, not years.', { liberty: 2, online: 2, maga: 1, farm: -1 }, 'A technology answer to a political question. Some voters like it more than they expected.'],
    whitlock: ['Nobody can deport 90,000 people in a year. I will not promise you something that cannot be done.', { seniors: 2, chamber: 2, maga: -4, rino: 2 }, 'Honest and unpopular. The room goes quiet.'],
  },
  sanctuary: {
    dunmore: ['I will stream every council meeting, put every member\'s name on the show, and cut off their state money.', { online: 3, maga: 3, chamber: -2 }, 'Your audience loves it. The council members start getting calls.'],
    rick: ['I will call every pastor in Lawrenceville and ask them to lead their city back to the law.', { faith: 2, maga: 1 }, 'A pastor\'s approach. Some pastors in Lawrenceville are not sure they agree.'],
    krantz: ['A sheriff enforces the law in every county, whatever a city council votes.', { guns: 4, maga: 2, seniors: -1 }, 'The clearest answer of the day. Lawyers note that sheriffs do not work for city councils.'],
    vaskel: ['Cities that ignore the law lose state contracts, and I will publish every dollar they lose.', { liberty: 3, maga: 1 }, 'A businessman\'s pressure. Effective and bloodless.'],
    whitlock: ['I will sit down with the council first. If they will not comply, the state will withhold its funds.', { seniors: 2, chamber: 2, maga: -2 }, 'A reasonable answer. The base wanted a fight.'],
  },
  prayer: {
    dunmore: ['Yes, and I will read the first prayer on the show.', { maga: 2, online: 2, faith: 2 }, 'Your audience approves. Pastors note that you rarely pray on the show.'],
    rick: ['Yes. I have prayed in public schools my whole life. I will lead the first prayer myself.', { faith: 5, liberty: -3, seniors: -1 }, 'The strongest faith answer of the campaign. Constitutional lawyers start writing.'],
    krantz: ['Yes. And no federal judge will enforce an order against it in this state.', { faith: 3, guns: 2, liberty: -1 }, 'Faith and defiance in one answer. Your base is thrilled.'],
    vaskel: ['Let parents choose: prayer, a moment of silence or nothing, school by school.', { liberty: 3, online: 1, faith: -1 }, 'A market answer to a question of faith. Pastors are not impressed.'],
    whitlock: ['I am a Methodist, and I pray every day. Schools should let children pray, not make them.', { seniors: 2, liberty: 1, faith: -1 }, 'Gentle and honest. The evangelical activists wanted a yes.'],
  },
  drag: {
    dunmore: ['I will play the video on the show every night until the library board resigns.', { online: 3, maga: 2, seniors: -1 }, 'The board members receive threats within a week. You condemn the threats on air.'],
    rick: ['Our children are not a stage for this. Every church in Lawrenceville will be at the next board meeting.', { faith: 4, maga: 1 }, 'Three hundred church members fill the board meeting. It is peaceful and very loud.'],
    krantz: ['If a law was broken, a sheriff will enforce it. If not, the voters can replace the library board.', { guns: 2, seniors: 2 }, 'A lawman\'s answer. Clear, calm, and it does not excite anyone.'],
    vaskel: ['Fund every library by its results and its parents\' ratings. Parents will decide.', { liberty: 3, online: 1, faith: -1 }, 'A ratings system for libraries. Librarians are alarmed. Libertarians are curious.'],
    whitlock: ['Library boards answer to local voters. Let Lawrenceville vote.', { liberty: 2, seniors: 1, faith: -3, rino: 1 }, 'Principled local control. Parents\' rights groups are furious.'],
  },
  stolen: {
    dunmore: ['Yes. I have said it on the show every week since 2020.', { maga: 5, online: 3, seniors: -1 }, 'No surprise, and no hesitation. The base loves consistency.'],
    rick: ['Only God knows every heart. I know what I saw, and I do not trust those machines.', { maga: 3, faith: 2 }, 'A pastor\'s way of saying yes.'],
    krantz: ['I have seen fraud in county elections with my own eyes. I have no doubt about 2020.', { maga: 4, guns: 1 }, 'A lawman\'s certainty. Older voters take it seriously.'],
    vaskel: ['The software was a mess. That is an engineering problem, and I fix engineering problems.', { online: 2, liberty: 1, maga: 1 }, 'Neither yes nor no. Engineers find it clever. The base finds it slippery.'],
    whitlock: ['No. And I will not tell you something I do not believe to win your vote.', { seniors: 2, chamber: 3, maga: -6, rino: 3 }, 'The most honest answer in the race, and the most costly.'],
  },
  measles: {
    dunmore: ['End the mandates. My listeners have been right about this since 2020.', { maga: 3, online: 4, seniors: -3 }, 'Your audience cheers. Pediatricians in Cloud County write an open letter.'],
    rick: ['Parents answer to God for their children, not to the health department. I will expand religious exemptions.', { faith: 4, online: 1, seniors: -2 }, 'Faith families are grateful. Doctors warn that the outbreak is growing.'],
    krantz: ['No deputy of mine will ever enforce a vaccine order. Parents decide.', { guns: 2, liberty: 2, seniors: -2 }, 'Freedom first. Older voters worry about their grandchildren.'],
    vaskel: ['Publish the real data, in real time, and let parents decide.', { liberty: 2, online: 2 }, 'A transparency answer. Nobody is angry, and nobody is excited.'],
    whitlock: ['Vaccines saved my generation from polio. Keep the requirements.', { seniors: 3, chamber: 1, maga: -3, online: -3, rino: 2 }, 'Older voters remember polio. Younger activists call you "a public-health bureaucrat."'],
  },
  soybeans: {
    dunmore: ['The President is right, and I will tell every farmer that on the show.', { maga: 4, pres: 5, farm: -3 }, 'The President\'s team notices. Farmers change the station.'],
    rick: ['We will pray for our farmers, and the state will help them through this season.', { faith: 2, farm: 3, liberty: -2 }, 'Compassion and a check. Farm families appreciate both.'],
    krantz: ['Ranchers and farmers built this state. The state will stand behind them.', { farm: 3, guns: 1, liberty: -1 }, 'Farm country hears a friend.'],
    vaskel: ['Tariffs are a tax. Let me find our farmers new buyers in Asia.', { liberty: 4, chamber: 2, maga: -4, pres: -5 }, 'The free-trade answer. Farmers are interested. The President is not.'],
    whitlock: ['I warned about this trade war in 2019. Tariffs are a tax on farmers.', { farm: 4, chamber: 3, maga: -5, pres: -6, rino: 2 }, 'Farmers remember your warning. The President\'s voters remember that you gave it.'],
  },
  teachers_carry: {
    dunmore: ['Yes. Every teacher who wants to carry should carry.', { guns: 4, maga: 2, seniors: -1 }, 'A simple answer. The Rifle Association nods.'],
    rick: ['Our Christian schools already have armed volunteers. Public schools should have them too.', { guns: 3, faith: 2 }, 'You speak from experience, and gun owners notice.'],
    krantz: ['Yes, and I will train them myself. My deputies have trained 300 teachers in Harlan County.', { guns: 5, seniors: 1 }, 'Real experience. The strongest gun answer of the campaign.'],
    vaskel: ['Technology first: smart locks, drones and cameras. Guns second.', { liberty: 2, online: 2, guns: -2 }, 'A modern answer. Gun owners hear "second."'],
    whitlock: ['Fund armed officers. Teachers should teach.', { seniors: 3, guns: -1, rino: 1 }, 'Sensible to most parents. The gun lobby rates you lower.'],
  },
  homeless: {
    dunmore: ['Enforce the camping ban, and send the bill to the city council that let it happen.', { maga: 3, guns: 1 }, 'Order, and someone to blame. Your audience is satisfied.'],
    rick: ['The churches will house them, if the state gets out of the way.', { faith: 4, liberty: 2 }, 'Cornerstone already runs two shelters. Your answer is believable.'],
    krantz: ['Arrest those who break the law, and offer every one of them a bed and a job on a work crew.', { guns: 3, seniors: 2 }, 'Tough and practical. It sounds like Harlan County.'],
    vaskel: ['Build modular housing in 90 days, and publish the results every week.', { liberty: 1, online: 2, chamber: 1, maga: -1 }, 'A builder\'s answer. Skeptics say 90 days is a startup promise.'],
    whitlock: ['Mental health beds. We closed half of them in the 1990s, and it was my vote too.', { seniors: 3, maga: -2, rino: 1 }, 'An honest answer that admits a mistake. Rare, and noticed.'],
  },
  covid: {
    dunmore: ['Yes. Names, dates and hearings, live on the show.', { online: 4, maga: 2, seniors: -2 }, 'Your audience wants a trial. Older voters want to move on.'],
    rick: ['They closed our churches. That will never happen again while I am governor.', { faith: 4, maga: 2 }, 'The strongest answer for church voters. You lived it.'],
    krantz: ['I refused to enforce those orders in 2020. The officials who did should answer for it.', { guns: 3, liberty: 2, maga: 2 }, 'You have a record on this. Nobody else does.'],
    vaskel: ['Audit every decision and publish the data. Accountability through transparency.', { liberty: 2, online: 3 }, 'Data instead of trials. Reasonable, and a little cold.'],
    whitlock: ['We made mistakes. We should learn from them without a witch hunt.', { seniors: 2, maga: -4, rino: 2 }, 'A moderate answer that the base hears as forgiveness.'],
  },
  crypto: {
    dunmore: ['Bitcoin is freedom money. Yes.', { online: 3, liberty: 2, seniors: -2 }, 'Your crypto sponsors are pleased.'],
    rick: ['I will not gamble the widows\' pensions on internet money.', { seniors: 3, faith: 1, online: -2 }, 'Retirees agree. The crypto crowd mocks you.'],
    krantz: ['Gold and silver. Real money that nobody can hack.', { liberty: 3, seniors: 2 }, 'The hard-money answer. Old-fashioned and popular.'],
    vaskel: ['Yes. I already mine Bitcoin in the Panhandle. Cimarron will be the first Bitcoin state.', { liberty: 4, online: 5, seniors: -3 }, 'Nobody doubts that you mean it. Retirees are worried.'],
    whitlock: ['The state should never speculate with public money.', { seniors: 3, liberty: -2, online: -2 }, 'Prudent. The young online right calls you a dinosaur.'],
  },
  secede: {
    dunmore: ['Put independence on the ballot. Let the people decide.', { online: 5, maga: 2, seniors: -4, chamber: -4 }, 'The most radical answer in the race. Your audience is thrilled.'],
    rick: ['We are one nation under God. I support a Convention of States, not secession.', { faith: 2, seniors: 3 }, 'Patriotic and firm. The fringe is disappointed.'],
    krantz: ['Every county sheriff should refuse unconstitutional federal laws. That is our independence.', { guns: 4, online: 2 }, 'Nullification, sheriff style. Your base loves it.'],
    vaskel: ['Charter cities first. Show that freedom works, one city at a time.', { liberty: 4, online: 2 }, 'A startup answer to secession. The network-state crowd is excited.'],
    whitlock: ['I have spent thirty years serving this country. I will not entertain secession.', { seniors: 3, rino: 1, online: -3 }, 'A dignified answer. The young right calls you a relic.'],
  },
  vouchers: {
    dunmore: ['Yes. Every family, every dollar, no exceptions.', { liberty: 3, online: 2, faith: 2, farm: -2 }, 'Clear and popular with the base. Rural school boards are worried.'],
    rick: ['Yes. I built twelve Christian schools. Every family deserves that choice.', { faith: 5, liberty: 2, farm: -3 }, 'Your strongest issue. Rural public schools feel threatened.'],
    krantz: ['Yes, but rural schools stay whole. In Harlan, the school is the town.', { farm: 3, faith: 1, liberty: 1 }, 'A rural answer that most voters accept.'],
    vaskel: ['Yes, and every child gets a free AI tutor, in public or private school.', { liberty: 3, online: 3, farm: 1 }, 'Your tutors are already in 200 schools. It is believable.'],
    whitlock: ['Only if rural schools are fully protected. I wrote their funding formula.', { farm: 3, seniors: 2, liberty: -2 }, 'Rural voters trust you on this. School-choice activists do not.'],
  },
  national_guard_city: {
    dunmore: ['Yes. Send them in. I will broadcast from the first checkpoint.', { maga: 4, online: 2, chamber: -3 }, 'Your audience loves it. Business owners downtown do not.'],
    rick: ['Crime is a spiritual problem too. Send the Guard, and send the churches with them.', { faith: 3, maga: 2 }, 'Law and faith together. Church volunteers sign up by the hundreds.'],
    krantz: ['Give the sheriffs the resources first. We know these streets.', { guns: 4, seniors: 1 }, 'Local lawmen before soldiers. Your base agrees.'],
    vaskel: ['Cameras, data and more police first. The Guard is a last resort.', { liberty: 2, chamber: 2, maga: -1 }, 'A tech-policing answer. Civil libertarians are uneasy about the cameras.'],
    whitlock: ['Only if the mayor asks. That is how federalism works.', { seniors: 2, liberty: 1, maga: -3, rino: 2 }, 'A constitutional answer. The base hears weakness.'],
  },
  red_flag: {
    dunmore: ['No. Red flag laws are how they take your guns without a trial.', { guns: 4, maga: 2 }, 'Gun owners agree completely.'],
    rick: ['The answer is prayer, fathers in the home and armed guards. Not red flag laws.', { faith: 3, guns: 2 }, 'A faith answer to gun violence. The mothers wanted more.'],
    krantz: ['No sheriff in Cimarron will enforce a red flag order. Not while I am governor.', { guns: 5, liberty: 2, seniors: -2 }, 'The strongest pro-gun answer possible. Older mothers are alarmed.'],
    vaskel: ['Better data on real threats, and due process for every gun owner.', { liberty: 2, seniors: 1, guns: -1 }, 'A careful middle. Gun owners hear "data" and worry.'],
    whitlock: ['A narrow law with a judge and a hearing. I would sign it.', { seniors: 3, chamber: 2, guns: -6, rino: 4 }, 'The mothers thank you. The Rifle Association will remember.'],
  },
  medicaid: {
    dunmore: ['No. Obamacare is still Obamacare.', { maga: 3, liberty: 2, seniors: -2 }, 'The base agrees. Rural hospital boards do not.'],
    rick: ['Churches ran hospitals before the government did. We will help these hospitals directly.', { faith: 3, farm: 2, liberty: -1 }, 'A faith-based answer with a check attached.'],
    krantz: ['Rural hospitals get state money directly. No federal strings.', { farm: 3, liberty: 1 }, 'Rural voters like it. The math is unclear.'],
    vaskel: ['Telemedicine in every rural county, paid for with private partners.', { liberty: 2, online: 2, farm: 1, seniors: -1 }, 'Innovative. Older rural voters want a building with a doctor in it.'],
    whitlock: ['Expand it, with work requirements. Three hospitals depend on it.', { seniors: 3, farm: 2, maga: -4, rino: 4 }, 'The rural hospital association endorses your answer. The base calls it Obamacare.'],
  },
  h1b: {
    dunmore: ['End it. American jobs for American workers.', { online: 4, maga: 3, chamber: -4 }, 'Your audience cheers. Tech investors call it economic suicide.'],
    rick: ['Hire Americans first, and let our Christian colleges train them.', { faith: 2, maga: 2 }, 'A reasonable answer that also promotes your colleges.'],
    krantz: ['Every job in Cimarron should go to a Cimarronian first.', { maga: 3, farm: 1, chamber: -2 }, 'Simple and popular.'],
    vaskel: ['My plants need 1,200 engineers. I will train Cimarron kids first, and hire the best in the world when I cannot.', { chamber: 3, liberty: 2, online: -4 }, 'Honest about your own business. The online right is angry.'],
    whitlock: ['Keep the program for the best engineers, and punish the abuse.', { chamber: 3, liberty: 1, online: -3 }, 'The Chamber agrees. Nobody else does.'],
  },
  ukraine: {
    dunmore: ['Not one dollar. America First.', { maga: 4, online: 3 }, 'No hesitation. Your audience agrees.'],
    rick: ['I pray for peace. America should stand with Israel before Ukraine.', { faith: 3, maga: 2 }, 'Your church hears its priorities.'],
    krantz: ['Our money should defend our own border first.', { maga: 3, guns: 2 }, 'A border-first answer. Clear and popular.'],
    vaskel: ['Europe should pay, and American companies should sell them the drones.', { liberty: 2, chamber: 2, online: 1 }, 'A business answer to a war. Some find it cynical.'],
    whitlock: ['Stopping Russia is in America\'s interest. I have said so for years.', { seniors: 2, chamber: 2, maga: -6, pres: -3, rino: 3 }, 'Consistent and courageous. The President\'s voters are furious.'],
  },
  pardons: {
    dunmore: ['All of them. They were fighting the uniparty.', { maga: 5, online: 4, chamber: -4, flag: 'pardons' }, 'Your audience cheers. Police unions do not.'],
    rick: ['Justice and mercy. I will pardon those who did not commit violence, and pray for the rest.', { faith: 3, maga: 1 }, 'A pastor\'s balance. Both sides accept part of it.'],
    krantz: ['Anyone who attacked an officer stays in prison. The rest go home.', { guns: 3, seniors: 2 }, 'A lawman\'s line. Police and the base both accept it.'],
    vaskel: ['Review every case, and pardon the ones who were overcharged.', { liberty: 2, online: 1 }, 'A process answer. Nobody is excited.'],
    whitlock: ['No. They attacked officers in the Capitol where I served for thirty years.', { seniors: 3, rino: 3, maga: -5 }, 'Personal and firm. The base will never forgive it.'],
  },
  property_tax: {
    dunmore: ['Abolish it. You should not rent your home from the government.', { liberty: 4, seniors: 4, farm: 2, chamber: -2, flag: 'no_prop_tax' }, 'A crowd-pleaser. Rural school districts are already doing the math.'],
    rick: ['Freeze it for every widow and retiree in this state.', { seniors: 5, faith: 1 }, 'The retired teacher who asked the question thanks you.'],
    krantz: ['Abolish it, and let counties fund their sheriffs with a sales tax.', { liberty: 3, guns: 2, seniors: 2, flag: 'no_prop_tax' }, 'Popular. County commissioners ask how the numbers work.'],
    vaskel: ['Cut it in half, and pay for it with efficiency. I will find the money.', { liberty: 4, seniors: 2, chamber: 1 }, 'A bold promise. Critics ask where "efficiency" is.'],
    whitlock: ['Cap it for homeowners. I know exactly what it pays for, and so should you.', { seniors: 4, farm: 1 }, 'A careful answer from someone who has read the budget.'],
  },
};
for (const [qid, byPlayer] of Object.entries(VOICES)) {
  const q = QUESTIONS.find(x => x.id === qid);
  for (const [p, [text, fx, fb]] of Object.entries(byPlayer)) q.answers.push({ cond: s => s.player === p, text, fx, fb });
}
