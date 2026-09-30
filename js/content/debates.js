// ============================================================
// DEBATES — each question has your answers and each rival's answer.
// Rival answer: { text, fx: faction gains for that rival, attack: candidateId (optional) }
// An attack costs the target support in every faction and adds to the attacker's debate score.
// ============================================================

const DEBATE_QUESTIONS = [
  { id: 'd_prove', text: 'MODERATOR: "Each of you says you are the true conservative in this race. Name your single most conservative achievement."',
    answers: [
      { cond: s => isGov(s), text: '"I eliminated the state income tax."', fx: { liberty: 3, chamber: 2 }, fb: 'A strong answer on economic policy, based on a real record.' },
      { cond: s => isGov(s), text: '"I led the first state deportation program in the country."', fx: { maga: 4, farm: -1 }, fb: 'This speaks to the most important issue for primary voters.' },
      { cond: s => isGov(s), text: '"I signed the strongest abortion ban in America."', fx: { faith: 3, seniors: 1 }, fb: 'This reminds evangelicals that you delivered on their top issue.' },
      { text: '"I have fought the left on every issue, every day."', fx: { maga: 2, online: 2 }, fb: 'Energetic but vague. The audience responds to the tone more than the content.' },
      { cond: s => s.player === 'dunmore', text: '"I built a movement of two million listeners who are done with the uniparty."', fx: { maga: 3, online: 3 }, fb: 'Your audience is your record, and your audience is in the room.' },
      { cond: s => s.player === 'rick', text: '"Forty pregnancy centers. Thousands of babies who are alive today. Name a politician who can say that."', fx: { faith: 4, seniors: 1 }, fb: 'The strongest answer on the stage for evangelical voters.' },
      { cond: s => s.player === 'krantz', text: '"I told the ATF they would be arrested if they came into my county without permission. They never came."', fx: { guns: 4, maga: 1 }, fb: 'Gun owners cheer. Older voters wonder what happens next time.' },
      { cond: s => s.player === 'vaskel', text: '"I created fifteen hundred jobs in Pratt Junction without one dollar of government money."', fx: { liberty: 3, chamber: 2 }, fb: 'A businessman\'s answer. The Liberty Caucus likes it.' },
      { cond: s => s.player === 'whitlock', text: '"Twelve balanced budgets. Conservatism used to mean paying your bills."', fx: { chamber: 3, seniors: 2 }, fb: 'Older voters remember when that was the whole platform.' },
    ],
    rivals: {
      dunmore: { text: '"I built a movement of two million listeners who are done with the uniparty. The Governor built a budget surplus for the Chamber of Commerce."', fx: { maga: 3, online: 2 }, attack: 'castellano' },
      rick: { text: '"I have baptized more than four thousand Cimarronians. I have preached the truth when it was unpopular. That is my record."', fx: { faith: 3 } },
      krantz: { text: '"I told the ATF they would be arrested if they came into Harlan County without my permission. They have not come."', fx: { guns: 4, maga: 1 } },
      vaskel: { text: '"I have created 1,400 jobs in Pratt Junction. I have never been on a government payroll. None of these people can say that."', fx: { liberty: 3, chamber: 2 } },
      whitlock: { text: '"I balanced eleven state budgets. Conservatism used to mean paying your bills."', fx: { chamber: 2 } },
    } },
  { id: 'd_bible', text: 'MODERATOR: "Pastor Rick says biblical law should guide state law. Where does each of you stand?"',
    answers: [
      { text: '"Our laws should reflect God\'s law."', fx: { faith: 4, liberty: -3 }, fb: 'Evangelical voters respond strongly. Libertarians are uneasy.' },
      { text: '"Rick, which laws would you enforce, and who would decide?"', fx: { liberty: 2, seniors: 1, opp: { rick: -3 } }, fb: 'Pastor Rick struggles with the follow-up. Some evangelicals think you mocked the question.' },
      { text: '"The Constitution comes first, and it was written by men of faith."', fx: { faith: 2, seniors: 2, guns: 1 }, fb: 'A safe answer that most of the coalition accepts.' },
      { text: '"Rick should explain his church\'s finances before he explains God\'s law."', fx: { maga: 2, faith: -2, opp: { rick: -4 } }, fb: 'A sharp attack. The audience reacts loudly, both ways.' },
    ],
    rivals: {
      dunmore: { text: '"I am a Christian, but I am not running for pastor. I am running to deport criminals and end the uniparty."', fx: { maga: 2, liberty: 1 } },
      rick: { text: '"Every law is someone\'s morality. The only question is whose. I choose God\'s. My opponents choose the Chamber of Commerce\'s."', fx: { faith: 5, online: 1 }, attack: 'castellano' },
      krantz: { text: '"The Constitution is the law I swore to uphold. It was written by God-fearing men, and that is enough for me."', fx: { guns: 2, seniors: 1 } },
      vaskel: { text: '"Government should be neutral and small. I do not want the state in your church, and I do not want it in your wallet."', fx: { liberty: 3, faith: -2 } },
      whitlock: { text: '"I am a Methodist. I would never want a governor to decide which church is correct."', fx: { chamber: 1, faith: -1 } },
    } },
  { id: 'd_carpet', text: 'MODERATOR: "Mr. Vaskel calls the Governor a career politician. Governor, Mr. Vaskel moved here from California four years ago. Please respond, and then Mr. Vaskel."',
    answers: [
      { text: '"He moved here because of the tax cut I passed."', fx: { liberty: 2, opp: { vaskel: -3 } }, fb: 'Effective. It turns his move into your achievement.' },
      { text: '"Cimarron is not a startup, and it is not for sale."', fx: { farm: 2, seniors: 2, opp: { vaskel: -3 } }, fb: 'The line lands with rural and older voters.' },
      { text: '"He is welcome here, like any American."', fx: { chamber: 2, rino: 1 }, fb: 'Gracious, but it wastes an opening.' },
      { text: '"He gave money to California Democrats for ten years."', fx: { maga: 3, opp: { vaskel: -2 } }, fb: 'It is true, and much of the audience did not know it.' },
    ],
    rivals: {
      dunmore: { text: '"Brent, you gave to Kamala Harris\'s Senate campaign. That is not a startup. That is a confession."', fx: { maga: 2 }, attack: 'vaskel' },
      rick: { text: '"Where a man lived matters less than where he worships. Brent, where do you worship?"', fx: { faith: 2 }, attack: 'vaskel' },
      krantz: { text: '"I have lived in Harlan County for 61 years. I do not need to say more."', fx: { farm: 2, guns: 1 } },
      vaskel: { text: '"I left California because it failed. I came here so Cimarron would not make the same mistakes. The Governor is making them."', fx: { liberty: 3, online: 2 }, attack: 'castellano' },
      whitlock: { text: '"I welcome Mr. Vaskel. I only wish he had brought his checkbook to the schools and not to the super PACs."', fx: { chamber: 1 } },
    } },
  { id: 'd_arrest', text: 'MODERATOR: "Sheriff Krantz has refused to enforce state laws that he considers unconstitutional. Should a sheriff be allowed to do that?"',
    answers: [
      { text: '"A sheriff who picks which laws to follow should not be governor."', fx: { seniors: 3, chamber: 1, opp: { krantz: -3 } }, fb: 'A clear contrast on the rule of law.' },
      { text: '"Bo is a good sheriff. He is not ready to be governor."', fx: { seniors: 2, guns: 1, opp: { krantz: -2 } }, fb: 'Respectful, and effective with gun owners.' },
      { text: '"I respect any sheriff who stands up to federal overreach."', fx: { guns: 3, opp: { krantz: 1 } }, fb: 'Gun owners approve, but you did not answer the question about state law.' },
      { cond: s => isGov(s), text: '"Which of my laws does he oppose? The gun law or the tax cut?"', fx: { guns: 2, liberty: 2, opp: { krantz: -2 } }, fb: 'Krantz has no good answer. A strong moment.' },
      { cond: s => !isGov(s), text: '"If a law is wrong, repeal it. A sheriff who ignores laws is doing the same thing the left does with the border."', fx: { seniors: 2, liberty: 1, opp: { krantz: -2 } }, fb: 'A principled answer that turns Krantz\'s argument against him.' },
    ],
    rivals: {
      dunmore: { text: '"The problem is not sheriffs who defy bad laws. The problem is governors who sign them."', fx: { maga: 2, guns: 1 }, attack: 'castellano' },
      rick: { text: '"There is a higher law than any statute. A man of conscience must follow it."', fx: { faith: 2, guns: 1 } },
      krantz: { text: '"I took an oath to the Constitution, not to the Governor. When the Governor violates it, I will not help him."', fx: { guns: 5, liberty: 1 }, attack: 'castellano' },
      vaskel: { text: '"Rule of law matters to investors. But a sheriff is closer to the people than any bureaucrat in the capital."', fx: { liberty: 1 } },
      whitlock: { text: '"No. Laws are made by the legislature and reviewed by courts. That is how a republic works."', fx: { chamber: 2, seniors: 1 } },
    } },
  { id: 'd_chamber', text: 'MODERATOR: "Lt. Governor Dunmore says the Governor is controlled by the Chamber of Commerce. Is big business an ally or an enemy of conservatives today?"',
    answers: [
      { cond: s => isGov(s), text: '"The Chamber fought my deportation program. Ask them who controls me."', fx: { maga: 3, chamber: -3 }, fb: 'Your record defeats the attack.' },
      { cond: s => isGov(s), text: '"Travis has spent four years on a podcast. I have spent four years governing."', fx: { seniors: 3, chamber: 1, opp: { dunmore: -3 } }, fb: 'A strong contrast between experience and media.' },
      { text: '"Business creates jobs. I am proud to work with employers."', fx: { chamber: 4, rino: 2, maga: -3 }, fb: 'A traditional Republican answer. In this primary it confirms the attack.' },
      { text: '"Travis, your show is sponsored by a company with ties to China."', fx: { maga: 2, opp: { dunmore: -5 } }, fb: 'Dunmore denies it angrily. Reporters will check it tomorrow.' },
      { cond: s => !isGov(s), text: '"The Governor takes the Chamber\'s money and follows its orders. I do neither."', fx: { maga: 3, chamber: -2, opp: { castellano: -2 } }, fb: 'You aim Dunmore\'s charge at the Governor. It lands.' },
    ],
    rivals: {
      dunmore: { text: '"Big business wants cheap foreign labor and woke HR departments. They are not our allies. They are the other side with better lawyers."', fx: { maga: 4, online: 2, chamber: -2 } },
      rick: { text: '"Corporations that celebrate sin in June should not expect our votes in November."', fx: { faith: 3 } },
      krantz: { text: '"I do not care who is big or small. I care who follows the Constitution."', fx: { guns: 1 } },
      vaskel: { text: '"I am a businessman. The enemy is not business. The enemy is a government that makes business impossible."', fx: { liberty: 3, chamber: 2, maga: -1 } },
      whitlock: { text: '"Employers are our neighbors. When did we start hating the people who sign paychecks?"', fx: { chamber: 3, maga: -2 } },
    } },
  { id: 'd_compromise', text: 'FMR. SEN. WHITLOCK asks the other candidates: "Is there any issue on which you would work with Democrats?"',
    answers: [
      { text: '"No."', fx: { maga: 3, online: 2 }, fb: 'The loudest applause of the night.' },
      { text: '"Not while they support open borders and abortion."', fx: { maga: 2, faith: 2 }, fb: 'A firm answer, with reasons.' },
      { text: '"On roads and water, yes."', fx: { rino: 2, farm: 2, seniors: 1, maga: -2 }, fb: 'Reasonable, and Whitlock thanks you. That will hurt you.' },
      { text: '"Compromise is how we lost the country."', fx: { online: 3, maga: 1 }, fb: 'This connects with the anger of the base.' },
    ],
    rivals: {
      dunmore: { text: '"Carol, the Democrats want to put your grandchildren in drag shows. No, I will not work with them."', fx: { maga: 3, online: 2 }, attack: 'whitlock' },
      rick: { text: '"There is no compromise between good and evil."', fx: { faith: 3, online: 1 } },
      krantz: { text: '"I have worked with Democratic sheriffs on drug cases. That is the only thing I will work with them on."', fx: { guns: 1, seniors: 1 } },
      vaskel: { text: '"I would work with anyone to cut regulations. It turns out that is nobody in either party."', fx: { liberty: 2 } },
      whitlock: { text: '"I worked with Democrats to build the Sumner water project. Every farmer on this stage uses it."', fx: { farm: 2, chamber: 1, maga: -1 } },
    } },
  { id: 'd_accept', text: 'MODERATOR: "Lightning round. Will you accept the result of this primary, and support the nominee?"',
    answers: [
      { text: '"If the election is fair."', fx: { maga: 4, online: 2, seniors: -1 }, fb: 'What most of the base wants to hear. It will be quoted if you lose.' },
      { text: '"Yes."', fx: { rino: 2, maga: -2 }, fb: 'Some in the audience react with suspicion.' },
      { text: '"I expect to win, so the question does not apply."', fx: { maga: 2 }, fb: 'Confident, but not an answer.' },
      { text: '"I will accept it, and I will support the nominee."', fx: { seniors: 2, chamber: 1, rino: 1 }, fb: 'Older voters respect the commitment.' },
    ],
    rivals: {
      dunmore: { text: '"I will accept a clean election. We will have observers in every county."', fx: { maga: 3, online: 1 } },
      rick: { text: '"I accept God\'s will. I will also have lawyers."', fx: { faith: 1, maga: 1 } },
      krantz: { text: '"My deputies will be at the polls in Harlan County to make sure it is fair."', fx: { guns: 2, seniors: -1 } },
      vaskel: { text: '"Yes. Markets accept results, and so should candidates."', fx: { liberty: 1, maga: -1 } },
      whitlock: { text: '"Yes, without conditions. It is sad that this is now a hard question."', fx: { chamber: 2, maga: -2 } },
    } },
  { id: 'd_democrat', text: 'MODERATOR: "Name one thing you respect about the Democratic Party."',
    answers: [
      { text: '"Nothing."', fx: { maga: 3 }, fb: 'The audience cheers.' },
      { text: '"The Democrats of JFK\'s time. Not today\'s party."', fx: { seniors: 3 }, fb: 'A familiar answer that older voters like.' },
      { text: '"Their discipline. They vote together. We should learn from that."', fx: { online: 3, maga: 1 }, fb: 'A strategic answer that the New Right respects.' },
      { text: '"Many Democrats love their country. We just disagree."', fx: { rino: 2, chamber: 1 }, fb: 'Gracious. In this room it sounds weak.' },
    ],
    rivals: {
      dunmore: { text: '"They fight for their people. Our side sends thoughts and prayers and then funds Ukraine."', fx: { maga: 2, online: 3 } },
      rick: { text: '"I respect the Democrats who have left that party. There are more every year."', fx: { faith: 2, seniors: 1 } },
      krantz: { text: '"Some of them hunt."', fx: { guns: 2, farm: 1 } },
      vaskel: { text: '"Their technology operation. Ours is ten years behind, and I intend to fix that."', fx: { online: 2, liberty: 1 } },
      whitlock: { text: '"My late husband was a Democrat for forty years. He was the finest man I ever knew."', fx: { seniors: 1, maga: -2 } },
    } },
  { id: 'd_deport_num', text: 'MODERATOR: "Every candidate has promised deportations. How many people would you deport, and what happens to the plants and farms that lose their workers?"',
    answers: [
      { text: '"Every person who is here illegally. Employers will adjust."', fx: { maga: 4, online: 2, farm: -2 }, fb: 'The strongest answer. Farmers wonder who will work their fields.' },
      { cond: s => isGov(s), text: '"More than all my opponents combined, because I have already done it."', fx: { maga: 3, opp: { dunmore: -1 } }, fb: 'Your record gives this answer weight.' },
      { text: '"Criminals first. Then we fix the legal system."', fx: { seniors: 2, rino: 1, maga: -2 }, fb: 'Dunmore says this is "the answer Democrats give."' },
      { text: '"The number depends on federal cooperation."', fx: { rino: 1, maga: -1 }, fb: 'Honest, but it sounds like an excuse.' },
      { cond: s => !isGov(s), text: '"More than the Governor, who talks about four thousand like it is a lot."', fx: { maga: 3, opp: { castellano: -1 } }, fb: 'You make the incumbent\'s record look small.' },
    ],
    rivals: {
      dunmore: { text: '"All of them. Every single one. And if a plant cannot survive without illegal labor, it does not deserve to survive."', fx: { maga: 5, online: 2, farm: -2, chamber: -2 } },
      rick: { text: '"We must enforce the law, and our churches will care for families who are affected."', fx: { faith: 2, maga: 1 } },
      krantz: { text: '"My deputies have already turned over 300 people to ICE. I do not make promises. I make arrests."', fx: { guns: 3, maga: 2 } },
      vaskel: { text: '"Deport criminals, and give H-1B visas to the best engineers in the world. We need both."', fx: { liberty: 2, chamber: 2, maga: -3 } },
      whitlock: { text: '"The Garnett plant lost 40% of its workers this year. Somebody on this stage should talk about that honestly."', fx: { farm: 2, chamber: 2, maga: -3 }, attack: 'castellano' },
    } },
  { id: 'd_institutions', text: 'MODERATOR: "The New Right says conservatives must take control of universities, the media and the civil service. Do you agree?"',
    answers: [
      { text: '"Yes. We lost them to the left, and we must take them back."', fx: { online: 4, maga: 2, liberty: -2 }, fb: 'The New Right hears you speaking its language.' },
      { text: '"We should not take them. We should defund them."', fx: { liberty: 3, maga: 1 }, fb: 'The small-government answer. The New Right thinks it is too passive.' },
      { text: '"We must reform them, starting with the universities."', fx: { online: 2, seniors: 1, faith: 1 }, fb: 'A measured version of the same idea.' },
      { text: '"Government should be neutral. That is the conservative principle."', fx: { rino: 2, liberty: 1, online: -4 }, fb: 'The New Right considers this the failed approach of the old party.' },
    ],
    rivals: {
      dunmore: { text: '"Take them? We should fire every bureaucrat who voted against the President and replace them tomorrow."', fx: { maga: 3, online: 3, seniors: -1 } },
      rick: { text: '"We need to take back the schools first. The universities are lost."', fx: { faith: 2, online: 1 } },
      krantz: { text: '"I would start with the Department of Natural Resources."', fx: { guns: 2, farm: 1 } },
      vaskel: { text: '"Replace the civil service with software. You cannot capture an institution that no longer exists."', fx: { liberty: 3, online: 2, seniors: -1 } },
      whitlock: { text: '"Every time one side captures an institution, the other side captures it back. That is not governing."', fx: { chamber: 1, online: -2 } },
    } },
  { id: 'd_tariffs', text: 'MODERATOR: "Soybean prices are down 30% because of the trade war. Farmers in Sumner Valley are losing their land. Do you still support the President\'s tariffs?"',
    answers: [
      { text: '"Yes. China cheated for thirty years. We will not surrender now."', fx: { maga: 4, pres: 3, farm: -2 }, fb: 'Loyal and forceful. Farmers hear no plan.' },
      { text: '"Yes, and I have proposed a state relief fund for farmers."', fx: { farm: 4, maga: 1, liberty: -2 }, fb: 'You protect both flanks. It is the best answer available on this stage.' },
      { text: '"Tariffs are a tax on our own people."', fx: { liberty: 4, chamber: 3, maga: -5, pres: -6, rino: 2 }, fb: 'Economically sound, politically very costly.' },
      { text: '"I support the President. Farmers will be made whole by Washington."', fx: { maga: 2, farm: 1, pres: 2 }, fb: 'A hopeful answer that depends on others.' },
    ],
    rivals: {
      dunmore: { text: '"Farmers are patriots. They know this is a war with China, and wars have costs."', fx: { maga: 3, farm: -2 } },
      rick: { text: '"We should pray for our farmers, and our churches are already feeding families in Sumner."', fx: { faith: 2, farm: 1 } },
      krantz: { text: '"I am a rancher. I lost money this year. I still support the President."', fx: { farm: 3, maga: 2 } },
      vaskel: { text: '"Tariffs are bad economics. I will say it even if it costs me."', fx: { liberty: 3, chamber: 2, maga: -3 } },
      whitlock: { text: '"The Sumner Valley lost $400 million this year. Someone must say that this policy has failed."', fx: { farm: 2, chamber: 2, maga: -4 } },
    } },
  { id: 'd_closing', text: 'MODERATOR: "Closing statements. Thirty seconds each. Why should Cimarron Republicans choose you?"',
    answers: [
      { text: '"I did not just talk. I governed. Four years of results, and I am not finished."', fx: { seniors: 3, chamber: 1, maga: 1 }, fb: 'A strong incumbent close.' },
      { text: '"Every one of them says they will fight. I am the only one who already has."', fx: { maga: 3, guns: 1 }, fb: 'Combines your record with the language of the base.' },
      { text: '"This is a fight for the soul of our state. I will not back down."', fx: { faith: 2, online: 2, maga: 1 }, fb: 'Emotional and effective with activists.' },
      { text: '"I will be governor for every Cimarronian, not only the loudest ones."', fx: { rino: 3, chamber: 2, maga: -3 }, fb: 'A general-election message in a primary.' },
    ],
    rivals: {
      dunmore: { text: '"The establishment has had four years. Give the movement four."', fx: { maga: 3, online: 2 }, attack: 'castellano' },
      rick: { text: '"I do not want your vote for me. I want it for the Lord, and for your children."', fx: { faith: 4 } },
      krantz: { text: '"I have kept Harlan County free for sixteen years. I can do it for the whole state."', fx: { guns: 3, farm: 1 } },
      vaskel: { text: '"Every other candidate on this stage has spent your money. I have made money. Let me make it for you."', fx: { liberty: 3, chamber: 1 } },
      whitlock: { text: '"I will not win tonight. But one day this party will want to be serious again, and I will have been here."', fx: { chamber: 2, seniors: 1 } },
    } },
];

// ---------- Outsider answers (merged into the questions above) ----------
const DEBATE_OUTSIDERS = {
  d_prove: {
    castellano: { text: '"As Attorney General I sued Washington forty-one times and won twenty-nine. As Governor I ended the income tax. Results, not podcasts."', fx: { liberty: 3, maga: 2 } },
    coburn: { text: '"I won a state title, a Heisman and two division titles. I know how to win. The Governor knows how to hold press conferences."', fx: { maga: 3, seniors: 2 }, attack: 'castellano' },
  },
  d_bible: {
    castellano: { text: '"I argued religious liberty before the Supreme Court, and I won. Faith needs defenders who can win in court, not only in church."', fx: { faith: 2, seniors: 2 } },
    coburn: { text: '"I prayed before every game I ever played. But I will not tell your family how to pray."', fx: { seniors: 1, maga: 1, faith: -1 } },
  },
  d_carpet: {
    castellano: { text: '"Brent moved here for the tax cut I passed. He is welcome. He is not ready."', fx: { liberty: 1, seniors: 1 }, attack: 'vaskel' },
    coburn: { text: '"Brent, I grew up in Harlan. You grew up in a gated community. Voters can see the difference."', fx: { farm: 2, seniors: 1 }, attack: 'vaskel' },
  },
  d_arrest: {
    castellano: { text: '"Bo swore an oath to the same Constitution I have argued in court for twenty years. It does not say except in Harlan County."', fx: { seniors: 2, chamber: 1 }, attack: 'krantz' },
    coburn: { text: '"I respect sheriffs. I also respect the rules. You cannot pick which ones you follow, Bo."', fx: { seniors: 2 }, attack: 'krantz' },
  },
  d_chamber: {
    castellano: { text: '"The Chamber fought Operation Heartland. I did it anyway. Travis fought nothing. He was busy recording."', fx: { maga: 2, seniors: 1 }, attack: 'dunmore' },
    coburn: { text: '"Businesses sponsored my whole career. But the Chamber wants cheap labor, and I want Cimarron jobs for Cimarron workers."', fx: { maga: 2, chamber: -1 } },
  },
  d_compromise: {
    castellano: { text: '"I sued the last Democratic administration twenty-nine times. That is my kind of bipartisanship."', fx: { maga: 2, liberty: 1 } },
    coburn: { text: '"I would work with anyone to lower gas prices. That is not compromise. That is common sense."', fx: { seniors: 2, farm: 1 } },
  },
  d_accept: {
    castellano: { text: '"Yes. I am the Governor. The law says I certify the result, and I follow the law."', fx: { seniors: 2, chamber: 1, maga: -1 } },
    coburn: { text: '"If I lose, I will be the first one to shake the winner\'s hand. I have lost games before."', fx: { seniors: 2, maga: -1 } },
  },
  d_democrat: {
    castellano: { text: '"Their lawyers are very good. I know, because I beat them."', fx: { maga: 2, seniors: 1 } },
    coburn: { text: '"Some of my best teammates were Democrats. They still threw me the ball."', fx: { seniors: 2 } },
  },
  d_deport_num: {
    castellano: { text: '"Four thousand so far, under a law I wrote and defended in federal court. Everyone else on this stage has a slogan. I have a legal strategy."', fx: { maga: 3, seniors: 1 } },
    coburn: { text: '"All of them. And we will show it on television, so the next group does not come."', fx: { maga: 4, online: 1, farm: -1 } },
  },
  d_institutions: {
    castellano: { text: '"We do not seize institutions. We win them, in court and in the budget. I have done both."', fx: { liberty: 2, online: 1, seniors: 1 } },
    coburn: { text: '"I would start with the university athletic department. It is a mess."', fx: { seniors: 1, farm: 1 } },
  },
  d_tariffs: {
    castellano: { text: '"Yes. And the relief fund I signed has already paid two thousand farmers."', fx: { farm: 2, maga: 2 } },
    coburn: { text: '"I support the President. And I will cut the state gas tax to zero so farmers get relief now."', fx: { maga: 2, farm: 3, liberty: 1 } },
  },
  d_closing: {
    castellano: { text: '"Everyone up here says they will fight. I am the only one who has won. Forty-one lawsuits, one income tax repeal, four thousand deportations. Let me finish the job."', fx: { maga: 2, seniors: 2, chamber: 1 } },
    coburn: { text: '"I am not a politician. I am a winner. Let me win for Cimarron."', fx: { maga: 3, seniors: 2 } },
  },
};
for (const q of DEBATE_QUESTIONS) Object.assign(q.rivals, DEBATE_OUTSIDERS[q.id] || {});

// Questions that are about a specific rival are asked only when that rival is in the race.
const DEBATE_NEEDS = { d_bible: ['rick'], d_carpet: ['vaskel'], d_arrest: ['krantz'], d_compromise: ['whitlock'], d_chamber: ['dunmore'] };
for (const q of DEBATE_QUESTIONS) q.needs = DEBATE_NEEDS[q.id] || [];
// Questions addressed to the Governor are asked only when you are the Governor.
DEBATE_QUESTIONS.find(q => q.id === 'd_carpet').cond = s => isGov(s);

// ---------- Dynamic debate options ----------
// When the race with your nearest rival is close, every debate question gets an extra option to attack that rival.
const CLOSE_RACE = 6;   // points
const ATTACK_LINES = {
  castellano: ['"Victor, you sued Washington forty-one times. You never once sued the donors who fund you."',
    '"The Governor has a Harvard degree and a plan for 2032. Cimarron is a stepping stone to him."',
    '"Victor was a Chamber lawyer who supported guest workers. He did not change his mind. He changed his job."'],
  dunmore: ['"Travis has been Lieutenant Governor for four years and passed nothing. A podcast is not a record."',
    '"Travis sells hats made in Vietnam and calls it America First."',
    '"Travis wants a promotion. He never wanted to do the job he already has."'],
  rick: ['"Pastor Rick preaches small government, and his church took two million dollars in federal loans."',
    '"Rick, a private jet is not a ministry."',
    '"Rick has never run anything but a church budget. This is a state of three million people."'],
  krantz: ['"Bo refuses to enforce laws he does not like. What happens when he is governor and you are the one he disagrees with?"',
    '"A man died in Bo\'s jail, and he has never explained it."',
    '"Bo is the sheriff of one county. This is a state of three million."'],
  vaskel: ['"Brent gave four hundred thousand dollars to California Democrats. Now he wants to run Cimarron like a startup."',
    '"Brent wants his own city with his own laws. That is not freedom. That is a fiefdom."',
    '"Brent could not name the largest crop in this state."'],
  whitlock: ['"Carol says the party lost its way. The party moved on because Carol stopped listening."',
    '"Carol voted for every budget increase for twenty years."'],
  coburn: ['"Jake, this is not a football game. You voted in three of the last ten primaries."',
    '"Jake cannot tell you the size of the state budget. You cannot run a state on name recognition."'],
};
// Which voters like each attack.
const ATTACK_FX = {
  castellano: { maga: 2, online: 1 },
  dunmore: { chamber: 1, seniors: 2 }, rick: { liberty: 2, maga: 1 }, krantz: { seniors: 2, chamber: 1 },
  vaskel: { farm: 2, maga: 1 }, whitlock: { maga: 2, online: 1 }, coburn: { seniors: 1, faith: 1 },
};

// Closing statements are built from your record, your position in the race and your strongest faction.
const RECORD_CLOSE = {
  income: '"Four years ago I promised to end the income tax. I did it. Give me four more years and I will finish the job."',
  rifle: '"I made Cimarron a Second Amendment sanctuary. Nobody on this stage has done more to protect your rights."',
  commandments: '"I put God back in our classrooms, and I will defend that law all the way to the Supreme Court."',
  heartland: '"I did not talk about deportations. I did them. Four thousand so far, and I am not finished."',
  dictionary: '"I gave parents control of what their children read. I will never give it back to the bureaucrats."',
  d_border: '"For four years I told you the truth about the border every Monday night. Now let me fix it."',
  d_uniparty: '"I named every lobbyist who runs this Capitol. Send me there, and they will all need new jobs."',
  d_elections: '"I fought for every ballot to be counted by hand. I will fight just as hard for every one of you."',
  d_tiebreak: '"When they tried to raise your fees, I cast the deciding vote. I will keep voting for you."',
  r_life: '"Thousands of children are alive because this church said yes to life. Give me a state that says yes."',
  r_revival: '"Sixty thousand of you filled a stadium to pray. Now fill the polls on August 4."',
  r_academies: '"I built schools for your children when the state would not. I will give every family that choice."',
  r_relief: '"When the floods came, our church was there before the government. I will govern the same way."',
  k_atf: '"I kept federal agents out of Harlan County. I will keep them out of your county too."',
  k_blm: '"I stood on that road for eleven days so the ranchers could keep their land. I will stand for you."',
  k_border: '"My deputies went to the border when Washington would not. I will send the whole state."',
  k_jail: '"Crime in my county fell five years in a row. Let me do for the state what I did for Harlan."',
  v_datacenters: '"I did not promise you jobs. I built them. Give me the state and I will build more."',
  v_charter: '"Freedomopolis proves that freedom works. Let me make the whole state free."',
  v_bitcoin: '"I turned wasted gas into money. I will do the same with a wasteful government."',
  v_tutors: '"Two hundred schools use what I built, for free. Imagine what I could do with the whole state."',
  w_budget: '"Twelve balanced budgets and not one tax increase. That is not the old party. That is the conservative party."',
  w_water: '"I kept the Panhandle\'s wells running through the drought. I know how to keep this state working."',
  w_roads: '"I paved four thousand miles of your roads. I never asked you to cheer. I ask for your vote."',
  w_heartbeat: '"I wrote this state\'s first heartbeat law before most of these men found their convictions."',
};
const POSITION_CLOSE = {
  leading: { text: '"You know my record, and that is why I am leading this race. Do not trade a proven fighter for a promise."', fx: { seniors: 2, maga: 1, chamber: 1 } },
  behind: { text: '"The polls have been wrong about me before. The only poll that counts is on August 4."', fx: { maga: 2, online: 1, seniors: 1 } },
};
const FACTION_CLOSE = {
  maga: { text: '"This movement did not start with any of us. I will fight for it every day that I am governor."', fx: { maga: 3, online: 1 } },
  faith: { text: '"I ask for your vote, and I ask for your prayers. This state belongs to God before it belongs to any of us."', fx: { faith: 4 } },
  guns: { text: '"Your rights do not come from Washington. While I am governor, Washington will not take them."', fx: { guns: 3, maga: 1 } },
  liberty: { text: '"Every dollar the government does not take is a dollar that belongs to you. I will keep cutting."', fx: { liberty: 3, chamber: 1 } },
  online: { text: '"The institutions were turned against us. I will take them back, one by one."', fx: { online: 3, maga: 1 } },
  farm: { text: '"I will stand with the people who feed this country: their land, their water and their future."', fx: { farm: 3, seniors: 1 } },
  chamber: { text: '"I will make Cimarron the best state in America to build something and hire someone."', fx: { chamber: 3, liberty: 1 } },
  seniors: { text: '"You built this state. I will protect your home, your savings and your safety."', fx: { seniors: 3, faith: 1 } },
};
const MODERATE_CLOSE = { text: '"I will be governor for every Cimarronian, not only the loudest ones."', fx: { rino: 3, chamber: 2, maga: -3 }, fb: 'A general-election message in a primary.' };
