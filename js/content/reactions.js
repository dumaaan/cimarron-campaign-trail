// ============================================================
// REACTIONS — the media reaction to every decision in the game.
//
// REACTIONS['id:choiceIndex'] = [gary, leonidas, chyron]
//   or, for a gamble:           [gary, leonidas, chyron, garyIfItFails, leonidasIfItFails, chyronIfItFails]
// Keys: questions and events use 'id:index'. Runoff meetings use 'court_candidateId:index'.
// Debates: 'debateId:index', 'attack:candidateId', 'close:record:recordId', 'close:leading', 'close:behind',
//          'close:factionId', 'close:moderate'.
// A chyron may start with 'fax:' or 'max:' to choose the network. Otherwise the two networks take turns.
// Text may use {last} / {LAST} (your last name) and {rival} / {RIVAL} (the rival you attacked).
// Posts never quote the decision. Each one reacts to it in the persona's own voice.
// ============================================================

const REACTIONS = {};
const rx = (id, rows) => rows.forEach((r, i) => { if (r) REACTIONS[`${id}:${i}`] = r; });

// ---------------- QUESTIONS ----------------
rx('deport', [
  [`NATIONAL GUARD!!! Now THAT is a plan. My father served in the Guard and he would be proud today 🇺🇸🇺🇸`, `Every. Single. One. {last} said the quiet part out loud and the sky did not fall. We are so back.`, `max:GOV. {LAST} VOWS TO USE GUARD FOR MASS DEPORTATIONS`],
  [`4,000 already gone and more coming. That is RESULTS, not talk. Dunmore has a microphone. {last} has a record!!`, `"We will expand it." Expand it to what, 4,500? Dunmore said all of them. Do the math, Governor.`, `fax:{LAST} TOUTS OPERATION HEARTLAND, PROMISES EXPANSION`],
  [`Guest workers?? We have heard this before. It is called AMNESTY with extra steps 😡`, `"Guest-worker path." The Chamber of Commerce wrote this answer and {last} read it off the card. ngmi.`, `max:{LAST} FLOATS GUEST-WORKER PLAN; BASE CALLS IT AMNESTY`],
  [`A place to HOLD them so they do not disappear before court. Why has nobody done this before?? 🙏`, `A state detention camp. In Cimarron. Six months ago this was a meme. Now it is policy. Beautiful.`, `fax:{LAST} PROPOSES STATE-RUN IMMIGRATION DETENTION CENTER`],
]);
rx('travel_ban', [
  [`I am pro-life but prosecuting grown women?? My wife Linda says this is too far and she is usually right.`, `Full send on adults too. {last} is the only candidate who read the pro-life argument to the end.`, `max:{LAST} WOULD CRIMINALIZE HELPING ADULTS TRAVEL FOR ABORTIONS`],
  [`If my granddaughter was ever in that kind of trouble, I would want to be told. Mom and Dad come first. Good answer.`, `Minors only. So the principle stops at 18? Fine. Boomer-coded, but fine.`, `fax:{LAST} BACKS TRAVEL BAN FOR MINORS SEEKING ABORTIONS`],
  [`Enforce the law we have. That is what a Governor does. Not everything needs a new law!!`, `"Our law is already strong." Translation: I will do nothing more and hope you forget. Weak.`, `max:{LAST} DECLINES TO BACK PASTOR RICK'S TRAVEL BAN`],
  [`IVF?? My nephew and his wife have twins from IVF. Those boys are a BLESSING. Not sure about this one.`, `IVF restrictions. The Catholic integralists are cheering and every suburban mom just unsubscribed.`, `max:{LAST} OPENS DOOR TO RESTRICTING IVF IN CIMARRON`],
]);
rx('badminton', [
  [`A task force. Good. Laws without enforcement are just suggestions!! 🏅`, `One athlete, one task force. Honestly? Based use of state capacity.`, `fax:{LAST} CREATES TASK FORCE TO ENFORCE GIRLS' SPORTS BAN`],
  [`Verification for EVERY girl?? My granddaughter plays volleyball. Nobody is checking her. Absolutely not.`, `Sex verification for all. The bureaucracy of it is funny but the principle is correct.`, `max:{LAST} CALLS FOR SEX VERIFICATION IN ALL GIRLS' SPORTS`],
  [`One student and the whole state is yelling. {last} is right that there are bigger problems. Like my property taxes.`, `"Focus on other issues." This is how Conservative Inc. surrenders: politely.`, `max:{LAST}: ONE TRANSGENDER ATHLETE "NOT A PRIORITY"`],
  [`Signed it, will defend it. Simple. That is leadership 🇺🇸`, `Defend it in court. Fine. Courts are not where this is won, but fine.`, `fax:{LAST} PLEDGES TO DEFEND SPORTS BAN "IN EVERY COURT"`],
]);
rx('stolen', [
  [`FINALLY a politician who will say it!!! I knew it that night in 2020 and I know it now.`, `Said it. On camera. No "concerns about irregularities." Just yes. Respect.`, `max:{LAST}: 2020 ELECTION WAS STOLEN`],
  [`Massive fraud, and {last} DID SOMETHING ABOUT IT. Election integrity law. That is a record 🇺🇸`, `The "I signed a bill" answer. Clean dodge, but at least it landed on the right side.`, `fax:{LAST} CITES "MASSIVE FRAUD," POINTS TO ELECTION LAW`],
  [`Our county clerk is a Republican and a deacon at my church. I trust her. But the 2020 thing still bothers me.`, `Defending the clerks who certified 2020. The uniparty just nodded in approval. It is over for {last}.`, `max:{LAST} BREAKS WITH BASE, DEFENDS ELECTION SECURITY`],
  [`PAPER BALLOTS COUNTED BY HAND. Like when I was young. Nobody hacked a pencil 📝`, `Hand counts everywhere. Slow, expensive and correct. The machines cannot be trusted.`, `fax:{LAST} WANTS VOTING MACHINES BANNED, HAND COUNTS STATEWIDE`],
]);
rx('measles', [
  [`My kids got their shots and they are fine. But it is the PARENTS' choice. Not the government's. OK.`, `Medical freedom from the Governor's office. The COVID people are finally getting their apology.`, `max:{LAST} MOVES TO END SCHOOL VACCINE MANDATES DURING OUTBREAK`],
  [`Forty sick kids. Keep the shots. I had measles in 1962 and my brother almost died. This is not a joke.`, `"Public health emergency." We heard those words in 2020. We remember what came next.`, `fax:{LAST} KEEPS VACCINE RULES AS MEASLES SPREADS`],
  [`Exemptions for religion makes sense. Freedom of religion is the FIRST amendment for a reason 🙏`, `Keep the mandate but make it optional. Galaxy-brained middle path. Mid.`, `fax:{LAST} EXPANDS VACCINE EXEMPTIONS, KEEPS REQUIREMENTS`],
  [`Praying for the children in Cloud County tonight. God is in control 🙏🙏`, `Thoughts and prayers as health policy. Unironically better than the CDC.`, `max:{LAST} CALLS FOR PRAYER AS MEASLES OUTBREAK GROWS`],
]);
rx('soybeans', [
  [`China has been ripping us off for 40 years. Short-term pain. Long-term WIN. Stand with the President!!`, `Loyalty to the tariffs even when it hurts. Farmers are coping and seething, but the principle is sound.`, `fax:{LAST} BACKS PRESIDENT'S TARIFFS DESPITE SOYBEAN SLUMP`],
  [`Help the farmers AND stand up to China. That is how you do both. My cousin farms soybeans in Sumner. Thank you!!`, `Tariffs that need a bailout. So the tariff is paying the farmers with extra steps. OK boomer economics.`, `fax:{LAST} ANNOUNCES STATE RELIEF FUND FOR SOYBEAN FARMERS`],
  [`Against the PRESIDENT'S tariffs?? In THIS state?? I do not know what {last} is thinking.`, `Free trade answer. Milton Friedman just rose from the grave to thank you. Nobody else will.`, `max:{LAST} BREAKS WITH PRESIDENT ON TARIFFS`],
  [`Blame China. EXACTLY. They are the ones who stopped buying. Not our guy 🇺🇸`, `"China did it." Technically true, strategically empty. Mid.`, `fax:{LAST} BLAMES CHINA, NOT TARIFFS, FOR SOYBEAN PRICES`],
]);
rx('drag', [
  [`No tax dollars for this. My taxes should pay for books, not THAT. Well said!!`, `Defund the libraries that do this. Simple, effective, legal. Rare competent move.`, `fax:{LAST} WOULD CUT FUNDS TO LIBRARIES HOSTING DRAG EVENTS`],
  [`Prosecute them? Maybe. I just want the kids kept out of it.`, `Obscenity law. Finally someone remembers we already have the tools. Use them.`, `max:{LAST}: PROSECUTE DRAG PERFORMERS UNDER OBSCENITY LAW`],
  [`Keep the kids out of it. That is all anybody normal wants. Good law 👍`, `A ban where minors are present. The Texas version. Safe, predictable, fine.`, `fax:{LAST} BACKS BAN ON DRAG SHOWS WITH MINORS PRESENT`],
  [`"Parents made that choice"?? Then the PARENTS are the problem!! Not what I expected from {last}.`, `Libertarian brain rot. Hands off, says {last}, as if the state is not already deciding everything.`, `max:{LAST} DECLINES TO ACT ON DRAG STORY HOUR`],
]);
rx('christian_nat', [
  [`I do not know about the label but I know this is a Christian country. My pastor will like this.`, `{last} took the label. Live on camera. The Overton window is now a door.`, `max:{LAST} EMBRACES "CHRISTIAN NATIONALIST" LABEL`],
  [`Exactly how I feel. I love Jesus and I love America. Do not need a fancy word for it 🇺🇸✝️`, `The "I don't need labels" answer. {last} needs them. Just will not say it.`, `fax:{LAST} SIDESTEPS CHRISTIAN NATIONALIST LABEL`],
  [`Washington prayed at Valley Forge. Read the history!! They teach it wrong in schools now.`, `"Return to that." Good. Now define "that" in legislation.`, `fax:{LAST}: AMERICA MUST "RETURN" TO CHRISTIAN ROOTS`],
  [`That wall between church and state is not even in the Constitution!! It is from a LETTER. Look it up!!`, `Quoting Jefferson's letter at a Republican primary. Bold. Suicidal, but bold.`, `max:{LAST} DEFENDS SEPARATION OF CHURCH AND STATE`],
]);
rx('teachers_carry', [
  [`A trained teacher with a gun is a hero waiting to happen. Pay for the training. 100% 🇺🇸`, `Arm the teachers and pay for it. The Rifle Association just printed the rating in gold.`, `fax:{LAST}: STATE SHOULD PAY TO ARM TEACHERS`],
  [`Local control. Let each school board decide. That is how it should work 👍`, `"Where school boards approve." Federalism answer. Fine. Boring.`, `fax:{LAST} BACKS ARMED TEACHERS WITH LOCAL APPROVAL`],
  [`Eighteen?? My grandson is 18 and he cannot remember to feed his dog. Too young.`, `Constitutional carry at 18. The young men of Cimarron have a candidate.`, `max:{LAST} WOULD LOWER CONCEALED CARRY AGE TO 18`],
  [`A real officer in every school. That is a professional. I like this better than arming teachers.`, `Resource officers. The answer a focus group of suburban moms wrote. Mid.`, `fax:{LAST} PREFERS ARMED OFFICERS TO ARMED TEACHERS`],
]);
rx('university', [
  [`Replace the whole board. They let this happen. Clean house!! 🧹`, `Take the Regents. Take the university. Take the institutions. This is the way.`, `max:{LAST} MOVES TO REPLACE UNIVERSITY'S BOARD OF REGENTS`],
  [`My tax dollars should not pay for that stuff. Close it down!!`, `Eliminate the departments. Good start. Now the rest of the humanities.`, `fax:{LAST} VOWS TO ELIMINATE DEI DEPARTMENTS`],
  [`Cut their money until they listen. That always works with my grandkids 😂`, `Defunding works, but it hurts the engineering school too. Crude tool. Still funny.`, `max:{LAST} THREATENS TO CUT STATE UNIVERSITY FUNDING`],
  [`Teach the kids about Washington and Lincoln and the Greeks. What a wonderful idea!!`, `A School of Civic Thought. Build parallel institutions inside their institutions. Chad move.`, `fax:{LAST} PROPOSES NEW SCHOOL OF WESTERN CIVILIZATION`],
]);
rx('pardons', [
  [`They were protesting a TAX. Americans have done that since 1773!! Pardon them all 🇺🇸`, `All twelve walk free. {last} actually did it. Political prisoners liberated.`, `max:{LAST} PROMISES TO PARDON ALL CAPITOL PROTESTERS`],
  [`Nonviolent ones out. Violent ones stay. Seems fair to me.`, `Pardons for "some." The coward's half-measure. Either they were right or they were not.`, `fax:{LAST}: PARDONS ONLY FOR NONVIOLENT PROTESTERS`],
  [`I support the police. If you attack officers you go to jail. Period. Proud of {last}.`, `{last} called them criminals. Remember this in August.`, `max:{LAST} REFUSES PARDONS FOR CAPITOL PROTESTERS`],
  [`Pardon them AND investigate the prosecutors!! Somebody should pay for this.`, `Pardon and investigate the investigators. This is what winning looks like.`, `max:{LAST}: FULL PARDONS AND PROBE OF PROSECUTORS`],
]);
rx('property_tax', [
  [`ABOLISH IT!!! I have paid off my house for 20 years and I still pay rent to the county 😡`, `Abolish property tax. Finally a policy that makes owning a home actually mean owning it.`, `fax:{LAST} VOWS TO ABOLISH PROPERTY TAXES`],
  [`A freeze for us over 65!! Thank you {last}!! Linda and I can stay in our house now 🏡`, `A boomer bribe with a boomer bow on top. Effective though.`, `fax:{LAST} PROPOSES PROPERTY TAX FREEZE FOR SENIORS`],
  [`Higher sales tax? I buy everything at the store. That is just moving the money around.`, `Swap one tax for another. The Chamber approves. Nobody else noticed.`, `max:{LAST} WOULD REPLACE PROPERTY TAX WITH SALES TAX`],
  [`The SCHOOL BOARDS. I knew it. Cap them!!`, `Blame the school boards. They deserve it. Every time.`, `fax:{LAST} TARGETS SCHOOL BOARDS OVER PROPERTY TAXES`],
]);
rx('wind', [
  [`Those turbines kill eagles and they ruin the view from my porch. Good!! 🦅`, `Ban the windmills. Aesthetic and political victory in one.`, `max:{LAST} BACKS BAN ON NEW WIND FARMS`],
  [`My neighbor makes $36,000 a year from three turbines. It is his land. {last} is right.`, `"The farmer's choice." Libertarian cope for letting Big Wind carpet the prairie.`, `fax:{LAST}: FARMERS SHOULD DECIDE ON WIND LEASES`],
  [`No subsidies. If it works, it works on its own. Makes sense 👍`, `End the subsidies and let the market kill wind. Actually smart.`, `fax:{LAST} WOULD END STATE SUBSIDIES FOR WIND`],
  [`OIL AND GAS. That is what built this state and my father's business. God bless 🛢️`, `Oil state pride. Vibes-based energy policy. I accept.`, `max:{LAST}: "WIND IS NOT OUR FUTURE"`],
]);
rx('rick_jet', [
  [`Hmm. A $60 million jet IS a lot for a church. I tithe and my church has a van with no AC.`, `A Republican asking a televangelist about his jet. Unprecedented. Keep going.`, `max:{LAST} QUESTIONS PASTOR RICK'S $60M CHURCH JET`],
  [`Good. Do not attack a pastor. We have enough fighting.`, `Too polite to mention the jet. Rick's Gulfstream salutes you from 40,000 feet.`, `fax:{LAST} REFUSES TO CRITICIZE RICK'S MINISTRY`],
  [`Between him and his church. Fair enough.`, `The "not my business" answer. It is literally a tax question, Governor.`, `fax:{LAST}: JET IS "BETWEEN RICK AND HIS CONGREGATION"`],
  [`Tax the jet if it goes to the beach. My fishing boat is taxed and it has never been to a beach!!`, `Tax the jet. Populism that hits a pastor. Did not see it coming.`, `max:{LAST} CALLS FOR TAXING CHURCH AIRCRAFT`],
]);
rx('freedomopolis', [
  [`EXACTLY. Money does not make you a king. Not even if you are a billionaire from California!!`, `Vaskel's techno-fief denied. Silicon Valley does not get a colony here.`, `fax:{LAST} REJECTS VASKEL'S CHARTER CITY`],
  [`An "experiment"?? I do not want to live in an experiment. What does that even mean.`, `Charter cities are genuinely interesting. {last} read a Substack. Respect.`, `max:{LAST} CALLS VASKEL CHARTER CITY "INTERESTING"`],
  [`One law for everybody. That is the American way 🇺🇸`, `No exceptions. Sovereignty of the state over Vaskel's startup kingdom. Correct.`, `fax:{LAST}: "NO EXCEPTIONS" FOR CHARTER CITY`],
  [`Jobs for Cimarron workers. If it creates jobs, OK. But I want to see the jobs first.`, `"If it creates jobs." The Chamber answer. Vaskel will write a check by morning.`, `max:{LAST} OPEN TO CHARTER CITY "IF IT CREATES JOBS"`],
]);
rx('krantz_sheriff', [
  [`Sheriffs are great. But the Governor is the Governor. Somebody has to be in charge.`, `Defending the chain of command against a constitutional sheriff. Very Federalist Society of you.`, `fax:{LAST}: SHERIFFS NOT ABOVE STATE LAW`],
  [`He refused to enforce YOUR laws?? Then he is not a conservative. Good point!!`, `Calling Krantz lawless. Bold. The gun guys will remember.`, `max:{LAST} CALLS KRANTZ "LAWLESS"`],
  [`Sheriffs are elected by the people. They know the county. I agree 100%!!`, `Sheriff supremacy endorsed by the sitting Governor. Based. Krantz just got a free ad.`, `max:{LAST} BACKS KRANTZ ON SHERIFF AUTHORITY`],
  [`Protect the sheriffs who stand up to the feds. Yes!! 🇺🇸`, `A shield law for sheriffs. Institutional power for our side. More of this.`, `fax:{LAST} PROPOSES LAW PROTECTING SHERIFFS WHO DEFY FEDS`],
]);
rx('podcast', [
  [`A Governor with a podcast. My grandson says I can listen on my phone. Somebody help me find it 😂`, `The Governor starts a podcast. Everyone has a podcast. At least this one has a budget.`, `fax:GOV. {LAST} LAUNCHES WEEKLY SHOW`],
  [`Go right into the lion's den. That takes guts!!`, `Walking into Dunmore's studio. Either very brave or very stupid. Grabbing popcorn.`, `max:{LAST} ACCEPTS DUNMORE'S PODCAST CHALLENGE`],
  [`Four years and no laws passed? That IS a good point. What has he done?`, `Attacking the podcaster for not passing laws. Fair hit, boomer delivery.`, `fax:{LAST} HITS DUNMORE'S EMPTY LEGISLATIVE RECORD`],
  [`Do not give him attention. That is what my wife says about the neighbor's dog.`, `No response. 400,000 downloads and the Governor is "above it." LMAO.`, `max:{LAST} IGNORES DUNMORE PODCAST ATTACKS`],
]);
rx('whitlock_extreme', [
  [`Carol Whitlock says you are extreme? Then you are doing something RIGHT 😂`, `Taking "dangerously extreme" as a compliment. Put it on a shirt.`, `max:{LAST}: WHITLOCK'S ATTACK IS "A COMPLIMENT"`],
  [`The party changed and so did I. I voted for Reagan and now I vote for the President. Makes sense.`, `"The party has changed." Correct, and {last} is fine with it. Good.`, `fax:{LAST}: "THE PARTY HAS CHANGED"`],
  [`Agree with Carol Whitlock?? She supported the Iraq war AND amnesty. No thank you.`, `{last} agrees with Carol Whitlock. That is the whole campaign ad. Just that sentence.`, `max:{LAST} AGREES WITH WHITLOCK "ON MORE THAN PEOPLE THINK"`],
  [`HAHA. 4%. That is a burn!!`, `"A candidate at 4%." Mean. Accurate. Funny.`, `fax:{LAST} DISMISSES WHITLOCK AS "A CANDIDATE AT 4%"`],
]);
rx('meatpacking', [
  [`I worked at 14 on my uncle's farm and it made me who I am. Kids today need work!!`, `Child labor to replace the deported workers. The accelerationists are thrilled and so is the Chamber.`, `max:{LAST} WOULD LOOSEN CHILD LABOR LAWS FOR MEATPACKING`],
  [`Put the inmates to work!! They get fed on our dime. Earn it.`, `Prison labor at the pork plant. Law and order meets supply chain. Efficient.`, `fax:{LAST} PROPOSES INMATE LABOR AT PORK PLANT`],
  [`Pay Americans a real wage and they will come. That is how it was when I was young.`, `Enforcement first, jobs will follow. The correct answer and the one nobody else will give.`, `fax:{LAST}: "AMERICAN WORKERS WILL FILL THESE JOBS"`],
  [`MORE visas?? We just got rid of them and now we bring in more?? What is the point?`, `Deport them, then import them with a visa. The uniparty in one sentence.`, `max:{LAST} ASKS WASHINGTON FOR MORE MEATPACKING VISAS`],
]);
rx('alcatraz_citizen', [
  [`A Navy vet held six weeks?? And the answer is "mistakes happen"?? I am a vet. That is not OK.`, `Mistakes happen. The machine keeps running. Cold, but correct.`, `max:{LAST}: DETAINED VETERAN WAS "A MISTAKE," PROGRAM CONTINUES`],
  [`Review it. Fine. But somebody owes that man an apology.`, `Review the case and keep going. Normal, boring, correct.`, `fax:{LAST} ORDERS REVIEW OF VETERAN'S DETENTION`],
  [`He was a CITIZEN and a NAVY VETERAN. It is not his job to prove it in a cell!! Shame on {last}.`, `"His responsibility." Carry your papers, citizen. Dark but consistent.`, `max:{LAST} BLAMES DETAINED VETERAN FOR LACK OF DOCUMENTS`],
  [`Thank you. That man served this country. He deserves an apology and more. 🇺🇸⚓`, `Paying off a lawsuit from the detention camp. They always fold eventually.`, `fax:{LAST} APOLOGIZES TO DETAINED NAVY VETERAN`],
]);
rx('social_media', [
  [`Protect the kids from the internet!! My grandkids are on their phones 12 hours a day.`, `ID to use the internet. They are building the surveillance state and calling it child safety.`, `fax:{LAST} BACKS ID CHECKS FOR SOCIAL MEDIA`],
  [`Free speech. OK. But somebody has to protect these kids from the phones.`, `Correct. No ID for the internet. Anonymous posting is a civil right.`, `max:{LAST} REJECTS AGE VERIFICATION AS "FREE SPEECH" ISSUE`],
  [`Block the dirty sites, let parents handle the rest. Sensible.`, `Porn ID yes, social media ID no. Splitting the difference like a pro.`, `fax:{LAST} BACKS ID FOR ADULT SITES, NOT SOCIAL MEDIA`],
  [`BAN TIKTOK. China is spying on our kids!! 🇨🇳❌`, `Ban the Chinese app first. Yes. Then the rest of them.`, `max:{LAST}: BAN CHINESE-OWNED APPS FIRST`],
]);
rx('esg', [
  [`Hmm. $180 million out of MY pension?? I am retired. I do not care about woke, I care about my check.`, `No more woke capital. Our money, our values.`, `max:{LAST} PULLS PENSION FROM ESG FIRMS`],
  [`Ban them from everything. They want to be political? Fine. No contracts!!`, `Blacklist the ESG firms. Using state power against hostile institutions. Textbook.`, `max:{LAST} BANS ESG FIRMS FROM STATE CONTRACTS`],
  [`THANK YOU. Do not play games with my retirement. Linda and I depend on it!!`, `"Returns before politics." Spoken like a Chamber lobbyist.`, `fax:{LAST}: PENSION RETURNS "COME BEFORE POLITICS"`],
  [`BITCOIN?? With my PENSION?? Absolutely not. That is internet money!!`, `A state pension in Bitcoin. Absolutely based. Absolutely insane. Both.`, `max:{LAST} WANTS PENSION FUND TO BUY BITCOIN`],
]);
rx('machine_guns', [
  [`Made in Cimarron, sold in Cimarron. The feds have NO business there. Constitution 101 🇺🇸`, `Intrastate commerce. The Wickard v. Filburn slayer has arrived.`, `fax:{LAST} BACKS "MADE IN CIMARRON" GUN EXEMPTION`],
  [`Tell the ATF to get lost!! About time somebody did 😤`, `State police told not to help the ATF. Nullification speedrun. Love to see it.`, `max:{LAST} ORDERS STATE POLICE NOT TO ASSIST ATF`],
  [`Wait. {last} will not sign a pro-gun bill?? I do not care what the lawyers say. Disappointed.`, `"I know it is unconstitutional." Imagine losing the gun vote to a law professor bit.`, `max:{LAST} REFUSES TO SIGN GUN EXEMPTION BILL`],
  [`Let the nine justices sort it out first. Makes sense I guess. Do not want to waste money on lawsuits.`, `Punting to the nine robes in D.C. Waiting is what they always say. Nothing ever happens.`, `fax:{LAST} WILL WAIT FOR SUPREME COURT ON GUN EXEMPTION`],
]);
rx('snap', [
  [`Drug test them. I had to take a drug test for my job for 30 years!! Fair is fair.`, `Drug tests for food stamps. Costs more than it saves. The boomers will love it though.`, `fax:{LAST} WANTS DRUG TESTS FOR FOOD ASSISTANCE`],
  [`If you can work, WORK. My dad worked two jobs and never took a dime.`, `Work requirements. The 1996 answer, still correct.`, `fax:{LAST} PROPOSES WORK REQUIREMENTS FOR SNAP`],
  [`No soda on MY dime. Buy milk and eggs like a normal person!! 🥛🥚`, `Ban soda from food stamps. MAHA meets welfare reform. Fine by me.`, `max:{LAST}: NO SODA, CANDY ON FOOD STAMPS`],
  [`Feeding kids is important. But there is a LOT of abuse in that program too. Hmm.`, `Defending food stamps at a GOP primary. {last} has been taken over by a social worker.`, `max:{LAST} REFUSES TO CUT FOOD ASSISTANCE`],
]);
rx('homeless', [
  [`Clean up the streets. I do not go downtown anymore because of it. Enforce the law!!`, `Clear the camps. Order is a policy. Cities are not campgrounds.`, `fax:{LAST}: BAN PUBLIC CAMPING, ARREST VIOLATORS`],
  [`Get them help, even if they do not want it. My cousin's boy needed that and never got it. 😢`, `Civil commitment. Bring back the asylums. Unironically the right answer.`, `fax:{LAST} CALLS FOR MANDATORY TREATMENT FOR HOMELESS`],
  [`Free housing?? That is what California did and look at San Francisco!!`, `Housing First. Straight from the Democratic platform. Unreal.`, `max:{LAST} BACKS "HOUSING FIRST" PROGRAM`],
  [`The churches do it better than the government ever could. My church runs a shelter every winter 🙏`, `Let the churches handle it. Subsidiarity. Based and Catholic-pilled.`, `fax:{LAST} TURNS TO CHURCHES ON HOMELESSNESS`],
]);
rx('covid', [
  [`They closed my church for a year. My CHURCH. Fire them!!`, `Remove the lockdown bureaucrats. Accountability is overdue.`, `max:{LAST}: FIRE OFFICIALS WHO ENFORCED LOCKDOWNS`],
  [`A commission? I just want to forget about the whole thing honestly.`, `A COVID truth commission with subpoenas. Nuremberg for the mask people. Finally.`, `max:{LAST} WANTS COVID COMMISSION WITH SUBPOENA POWER`],
  [`Move forward. OK. But nobody ever said sorry for closing my church.`, `"Learn and move forward." Amnesty for the lockdowners. Never forget.`, `fax:{LAST} URGES STATE TO "MOVE FORWARD" FROM COVID`],
  [`NEVER AGAIN. No more masks. No more shots by force. Good!! 😷❌`, `Ban future mandates. Solid. Now make it a constitutional amendment.`, `fax:{LAST}: BAN ALL FUTURE VACCINE, MASK MANDATES`],
]);
rx('aquifer', [
  [`The farmers own the water. The government does not. Simple.`, `Water rights for the farmers. Property is property.`, `fax:{LAST}: NO MANDATORY WATER CUTS FOR FARMERS`],
  [`MANDATORY cuts?? The government telling farmers how to farm?? My cousin is going to be furious.`, `Mandatory pumping cuts. Water central planning. The farmers will remember.`, `max:{LAST} BACKS MANDATORY CUTS TO AQUIFER PUMPING`],
  [`Voluntary with help. That is the conservative way. Nobody gets forced 👍`, `Incentives, not mandates. A normal answer. Fine.`, `fax:{LAST} PROPOSES VOLUNTARY WATER CONSERVATION`],
  [`Environmentalists exaggerate EVERYTHING. They said we would be underwater by now!!`, `Climate skepticism applied to groundwater. Maybe wrong, definitely on brand.`, `max:{LAST}: AQUIFER CRISIS "EXAGGERATED"`],
]);
rx('crypto', [
  [`Cimarron the Bitcoin capital?? I do not understand crypto and neither does anybody I know.`, `Cimarron as the Bitcoin state. Number go up. Governor based.`, `max:{LAST} WANTS STATE BITCOIN RESERVE`],
  [`Pay your fishing license in Bitcoin? Sure, whatever. Just do not gamble with the money.`, `Crypto payments but no reserve. Half-pilled. Better than nothing.`, `fax:{LAST}: ACCEPT CRYPTO, NO PUBLIC INVESTMENT`],
  [`GOLD AND SILVER!!! Real money. My grandfather never trusted paper and neither do I 🪙`, `Gold and silver as legal tender. Ron Paul is smiling somewhere.`, `max:{LAST} PUSHES GOLD AND SILVER AS LEGAL TENDER`],
  [`Good. No gambling with our money. That is common sense.`, `No Bitcoin reserve because it is "risky." Spoken like someone who bought Pets.com in 1999.`, `fax:{LAST} REJECTS STATE BITCOIN RESERVE`],
]);
rx('secede', [
  [`A Convention of States. That is IN the Constitution. Limit Washington!! 🇺🇸`, `Convention of States. The respectable version of the real idea. Fine.`, `fax:{LAST} BACKS CONVENTION OF STATES`],
  [`LEAVE THE UNION?? My father fought for this country. I am an AMERICAN. What is going on.`, `Independence on the table. The Republic of Cimarron has a nice ring to it. 🏛️`, `max:{LAST} OPEN TO CIMARRON INDEPENDENCE`],
  [`Refuse unconstitutional laws. Yes. The states are supposed to push back!!`, `Nullification. The founders did it. So can we.`, `max:{LAST}: IGNORE UNCONSTITUTIONAL FEDERAL LAWS`],
  [`WE ARE AMERICANS. Thank you {last}. Some of these people have lost their minds 🇺🇸`, `Shut the door on independence. Sure. Enjoy being ruled from D.C. forever.`, `fax:{LAST} REJECTS SECESSION TALK`],
]);
rx('pledge', [
  [`Sign it AND cut the sales tax!! Groceries cost too much!! 🛒`, `Pledge plus a cut. The Taxpayers Association will frame it.`, `fax:{LAST} SIGNS TAX PLEDGE, PROMISES SALES TAX CUT`],
  [`Signed. Good. Now keep it.`, `Signed the pledge. The minimum. Next.`, `fax:{LAST} SIGNS NO-NEW-TAXES PLEDGE`],
  [`No pledge?? Every Republican signs the pledge!! What are you planning, {last}??`, `Too proud to sign the tax pledge. Grover Norquist just marked you down for a tax hike.`, `max:{LAST} REFUSES TO SIGN TAX PLEDGE`],
  [`Cut spending every year. Like a family budget. Linda runs our house better than the state runs anything.`, `Cut spending every year. Starve the beast. Correct.`, `fax:{LAST} PLEDGES TO CUT STATE SPENDING EVERY YEAR`],
]);
rx('farmland', [
  [`MAKE THEM SELL. The Chinese should not own one acre of Cimarron!! 🇺🇸🌾`, `Forced sale of CCP farmland. Economic nationalism with teeth.`, `max:{LAST}: FORCE CHINESE OWNERS TO SELL FARMLAND`],
  [`No more sales to China. Good. Should have happened years ago.`, `New purchases only. The existing Chinese farms stay. Mid.`, `fax:{LAST} BACKS BAN ON NEW CHINESE FARMLAND PURCHASES`],
  [`No foreign owners at all? Even Canadians? Hmm. OK I guess. American land for Americans.`, `All foreign ownership banned. Blood and soil, but make it zoning law.`, `max:{LAST} WANTS BAN ON ALL FOREIGN FARMLAND OWNERSHIP`],
  [`"Federal review is enough"?? Washington has done NOTHING. Very disappointed.`, `Trusting CFIUS to protect farmland. Conservative Inc. at its finest.`, `max:{LAST}: FEDERAL REVIEW OF CHINESE FARMLAND "ENOUGH"`],
]);
rx('pipeline', [
  [`Nobody takes a farmer's land for a private company. That is STEALING. Good for {last}!!`, `Property rights over the carbon capture grift. Farmers win.`, `fax:{LAST} OPPOSES EMINENT DOMAIN FOR CO2 PIPELINE`],
  [`Take a man's land for a pipeline?? For JOBS?? Tell that to the farmer.`, `Eminent domain for a green pipeline. The Chamber owns {last}.`, `max:{LAST} BACKS CO2 PIPELINE OVER FARMERS' OBJECTIONS`],
  [`Carbon capture is a SCAM. Pumping air into the ground. Come on!!`, `Climate scam called out. Farmers and anti-ESG in one move.`, `max:{LAST}: CARBON CAPTURE A "CLIMATE SCAM"`],
  [`The Public Utilities Commission?? Nobody even knows who they are.`, `Punting to a commission nobody has heard of. Coward's answer.`, `fax:{LAST} DEFERS PIPELINE DECISION TO REGULATORS`],
]);
rx('vouchers', [
  [`School choice!! My granddaughter goes to a Christian school and we pay every penny. Finally some help!!`, `Universal vouchers. Defund the teachers' unions by letting parents leave.`, `fax:{LAST} BACKS UNIVERSAL SCHOOL VOUCHERS`],
  [`Choice AND protect the rural schools. The school in my town is the heart of the town. Good.`, `Vouchers with a guarantee. Paying twice for the same kid. Boomer economics again.`, `fax:{LAST}: VOUCHERS WITHOUT RURAL SCHOOL CUTS`],
  [`Only failing districts?? My district is not failing and I still want choice!!`, `Vouchers for "failing districts only." The Jeb Bush answer. 2005 called.`, `max:{LAST} LIMITS VOUCHERS TO FAILING DISTRICTS`],
  [`Put the curriculum ONLINE. I want to see what they teach my grandkids!!`, `Vouchers plus curriculum transparency. Parents' rights full package.`, `fax:{LAST} PAIRS VOUCHERS WITH CURRICULUM TRANSPARENCY`],
]);
rx('everify', [
  [`Every employer. No exceptions. If you hire illegals you pay!! 💪`, `Universal E-Verify with real penalties. The immigration hawks win this round.`, `max:{LAST} BACKS E-VERIFY FOR ALL EMPLOYERS`],
  [`Except farms? My cousin needs workers at harvest. I get it. But still.`, `E-Verify except for the one industry that uses the most illegal labor. Incredible.`, `fax:{LAST}: E-VERIFY, BUT NOT FOR AGRICULTURE`],
  [`Only state contractors?? That is basically nobody.`, `E-Verify for state contractors only. A policy designed to do nothing.`, `max:{LAST} LIMITS E-VERIFY TO STATE CONTRACTORS`],
  [`Make it a CRIME to hire them. That will stop it overnight!!`, `Criminalize the employers. Hit the demand side. Finally.`, `max:{LAST}: MAKE HIRING ILLEGAL WORKERS A STATE CRIME`],
]);
rx('busing', [
  [`500 of our boys on the border. Proud of them. God bless the Cimarron Guard 🇺🇸🪖`, `Troops to the border on the state's dime. Action over words.`, `fax:{LAST} SENDS 500 GUARD TROOPS TO SOUTHERN BORDER`],
  [`Send them but Washington pays. That is fair. Why should we pay for Washington's job?`, `Troops, but send the bill to D.C. Fine. Petty, but fine.`, `fax:{LAST}: GUARD TO BORDER IF WASHINGTON PAYS`],
  [`Border AND here at home. Double. Love it!!`, `Border troops plus state police working with ICE. The full package.`, `max:{LAST} SENDS GUARD TO BORDER, STATE POLICE TO ICE`],
  [`"Needed here"?? The border IS Cimarron's problem!! Everybody's problem!!`, `Refusing to help Texas. {last} does not think the border is a real emergency.`, `max:{LAST} REFUSES TO SEND GUARD TO BORDER`],
]);
rx('ivf', [
  [`I understand life begins at conception. But my nephew's twins are from IVF. This is hard.`, `Embryos are persons. Consistent. Politically radioactive, but consistent.`, `max:{LAST} BACKS COURT RULING ON FROZEN EMBRYOS`],
  [`Both? You can do both? OK. I trust {last}.`, `Support the ruling and also overturn it by law. Schrödinger's pro-lifer.`, `fax:{LAST} BACKS RULING, VOWS TO PROTECT IVF`],
  [`Protect IVF. Families need children. That is pro-LIFE too.`, `Protecting IVF against the pro-life movement. The Catholic side of the timeline is furious.`, `max:{LAST} BREAKS WITH COURT, PROTECTS IVF`],
  [`Let the judges handle it. Fine. Politicians should not play doctor.`, `"For the courts." Translation: please stop asking me.`, `fax:{LAST} DEFERS TO COURTS ON IVF`],
]);
rx('dei_state', [
  [`Fire them. They were told to stop and they did not. That is insubordination!!`, `End the programs, fire the commissars. Personnel is policy.`, `max:{LAST} ORDERS DEI STAFF FIRED`],
  [`Loyalty tests for state jobs? I do not know about that. Sounds like something from the old USSR.`, `Loyalty in hiring. They did it to us for decades. Now it is our turn.`, `max:{LAST}: STATE HIRING TO REQUIRE "LOYALTY TO STATE POLICY"`],
  [`Keep the ones the feds require. Well, OK. Do not want to lose federal money I guess.`, `"Keep those required by federal law." Every program will suddenly be required by federal law.`, `fax:{LAST} ORDERS REVIEW OF STATE DIVERSITY PROGRAMS`],
  [`Teach them the CONSTITUTION. Every American should know it. Great idea 📜`, `Constitution training replaces DEI. Positive vision, not just deletion. Good.`, `fax:{LAST} REPLACES DEI WITH CONSTITUTION TRAINING`],
]);
rx('national_guard_city', [
  [`Fort Eisenhower is not safe anymore. My wife will not go downtown at night. Send the Guard!!`, `Troops in the capital. Restore order. This is what the people want.`, `max:{LAST} WOULD DEPLOY GUARD IN FORT EISENHOWER`],
  [`If the President wants to send help, we should take it. Good answer.`, `"If he chooses." Deferring to the President. Safe. Loyal. Fine.`, `fax:{LAST} WELCOMES FEDERAL TROOPS IF PRESIDENT CHOOSES`],
  [`Fund the police. Back the Blue. That is always the right answer 🚔`, `Trusting the city cops. They could not handle it. That is why we are asking.`, `fax:{LAST}: MORE POLICE FUNDING, NOT GUARD`],
  [`Only if the MAYOR asks?? The mayor is the problem!!`, `Waiting for the Democratic mayor to ask for help. Brilliant strategy.`, `max:{LAST}: GUARD ONLY IF LOCAL OFFICIALS ASK`],
]);
rx('porn', [
  [`Ban it. It ruins marriages. My pastor preached on this last month 🙏`, `Total ban. The Liberty Caucus is crying. The future is trad.`, `max:{LAST} CALLS FOR TOTAL PORN BAN`],
  [`Strict age checks. Keep the kids away from it. Reasonable.`, `Age verification. The Utah model. Works fine.`, `fax:{LAST} BACKS STRICT AGE VERIFICATION FOR ADULT SITES`],
  [`"Adults can choose"?? Not what I expected from a Republican. My church would not like this.`, `The libertarian answer, delivered to a room full of pastors. Brave.`, `max:{LAST}: ADULTS HAVE RIGHT TO VIEW PORNOGRAPHY`],
  [`Filters. My grandson set one up on my computer and now I cannot open half my emails 😂`, `Internet filters as crime policy. The 2006 answer.`, `fax:{LAST}: PARENTS SHOULD USE INTERNET FILTERS`],
]);
rx('podcast_guest', [
  [`I did not understand what the guest was talking about but it sounded strange. Hmm.`, `The Governor let him cook. Free speech on the show. The algorithm will reward this.`, `max:{LAST} LETS GUEST'S "GLOBALIST BANKERS" REMARKS STAND`],
  [`Good. Talk about something else. That guy was weird.`, `Changed the subject. Neither brave nor useful.`, `fax:{LAST} CHANGES SUBJECT AFTER GUEST'S REMARKS`],
  [`Good for {last}. We do not talk like that about anybody. My church supports Israel 🇺🇸🇮🇱`, `Pushing back on a guest, live, on the Governor's own show. The ADL just gained a subscriber.`, `fax:{LAST} REBUKES GUEST'S ANTISEMITIC LANGUAGE ON AIR`],
]);
rx('pardon_repeat', [
  [`Due process. He is innocent until proven guilty. But threatening a clerk is not OK.`, `No comment. Correct. Never apologize for a pardon.`, `max:{LAST} DECLINES COMMENT ON RE-ARRESTED PARDON RECIPIENT`],
  [`Right. Nobody threatens a county clerk. Our clerk is a grandmother. Lock him up.`, `Throwing his own pardon under the bus. Loyalty runs one way with {last}.`, `fax:{LAST}: PARDONED MAN "WILL FACE THE LAW"`],
  [`"I understand why"?? He threatened a GRANDMOTHER. Nobody should understand that.`, `The clerk certified a fraud. People are angry. {last} gets it.`, `max:{LAST} SAYS ANGER AT ELECTION CLERK IS UNDERSTANDABLE`],
]);
rx('child_labor_followup', [
  [`I worked at 14. But 40 hours a week during school?? Night shifts?? That is too much. That boy got hurt.`, `"Work builds character." The Chamber is thrilled. Somebody's kid lost a hand.`, `max:{LAST} DEFENDS CHILD LABOR LAW AFTER TEEN'S INJURY`],
  [`Limit the hours during school. Kids need school AND work. Balanced.`, `A fix that keeps the reform. Adults in the room.`, `fax:{LAST} WILL LIMIT TEEN WORK HOURS DURING SCHOOL`],
  [`Investigate the plant!! They put that boy on a night shift. Somebody should pay.`, `Blame the plant, keep the law. Effective deflection.`, `fax:{LAST} ORDERS INVESTIGATION OF GARNETT PORK PLANT`],
]);
rx('red_flag', [
  [`No red flag. Due process!! They come for your guns because your ex-wife is mad. Not in America 🇺🇸`, `No red flags. Rights are not suspended by a judge's hunch.`, `fax:{LAST} REJECTS RED FLAG LAW`],
  [`BAN red flag laws. Good. Protect our rights before the feds try something.`, `Banning red flag orders preemptively. Offensive defense. Love it.`, `max:{LAST} WOULD BAN RED FLAG ORDERS IN CIMARRON`],
  [`Consider a red flag law?? That is how it starts. First the "narrow" law, then they take everything.`, `A "narrow" red flag law. Every gun grabber in history started with that word.`, `max:{LAST} OPEN TO "NARROW" RED FLAG LAW`],
  [`Armed guards and mental health. That is the RIGHT answer. Not taking guns from law-abiding people.`, `Guards and mental health. The standard NRA answer. It works.`, `fax:{LAST}: ARMED SECURITY, MENTAL HEALTH, NOT RED FLAGS`],
]);
rx('medicaid', [
  [`Medicaid expansion is Obamacare. We know that. Good answer.`, `No expansion. The rural hospitals can figure it out. Tough but consistent.`, `fax:{LAST} REJECTS MEDICAID EXPANSION`],
  [`Keep the hospitals open without Obamacare. Smart. My hospital in Sumner needs help.`, `Emergency grants. Pay for hospitals without saying the M-word. Clever.`, `fax:{LAST} OFFERS EMERGENCY GRANTS TO RURAL HOSPITALS`],
  [`EXPAND Medicaid?? With work requirements or not, that is Obamacare. Come on {last}.`, `Medicaid expansion from a Republican governor. Uniparty confirmed.`, `max:{LAST} BACKS MEDICAID EXPANSION WITH WORK RULES`],
  [`Health savings accounts. Sounds good. But how does a poor family fill one?`, `HSAs instead of Medicaid. Libertarian theory. Hospitals still close.`, `fax:{LAST} PROPOSES HEALTH SAVINGS ACCOUNTS INSTEAD OF MEDICAID`],
]);
rx('raw_milk_fda', [
  [`FEDS OFF OUR FARMS!!! Proud of {last} today 🐄🇺🇸`, `State troopers standing up to the feds. This is what sovereignty looks like. More.`, `max:STANDOFF: CIMARRON TROOPERS BLOCK FEDERAL AGENTS AT DAIRY`],
  [`Let people buy milk from a farmer. What happened to this country?? Good law.`, `Food Freedom Act. Raw milk is the red pill of dairy.`, `fax:{LAST} SIGNS "FOOD FREEDOM ACT" FOR RAW MILK`],
  [`I drank raw milk as a boy on my grandpa's farm and I turned out fine!! Disappointed.`, `{last} sided with the FDA against a farmer. Remember this.`, `max:{LAST} STAYS OUT OF FDA RAID ON AMISH DAIRY`],
  [`Abolish the FDA? Who checks my medicine then? I am on six pills a day.`, `Abolish the FDA. The MAHA dream, live from the Governor's office.`, `max:{LAST} CALLS FOR ABOLISHING THE FDA`],
]);
rx('h1b', [
  [`American jobs for AMERICANS!!! Why is this even a question?? 🇺🇸`, REMOVED_POST('97,000'), `max:{LAST} CALLS FOR END OF H-1B PROGRAM`],
  [`I don't know. My granddaughter's doctor is from India and she is wonderful. Seems reasonable to me.`, `{last} just told every American engineer they are replaceable. Conservative Inc. mask off.`, `fax:{LAST} DEFENDS H-1B FOR "THE BEST ENGINEERS"`],
  [`Makes sense. Hire Americans first. Common sense!!`, `A tax is not a ban. Do better. Mid.`, `fax:{LAST} PROPOSES TAX PENALTY ON H-1B REPLACEMENTS`],
  [`Federal issue? The data centers are in PRATT JUNCTION, {last}. That is Cimarron.`, `"A federal issue." Hiding behind the Constitution to avoid the one question that matters.`, `max:{LAST} CALLS H-1B VISAS "A FEDERAL ISSUE"`],
]);
rx('ukraine', [
  [`Not one more dollar. We have our own problems here. Gas is $4!!`, `Not one dollar. America First means America First.`, `max:{LAST}: "NOT ONE MORE DOLLAR" FOR UKRAINE`],
  [`Europe should pay. They have been freeloading since WW2. My dad said that.`, `"Europe should pay." The polite version. Still correct.`, `fax:{LAST}: EUROPE SHOULD PAY FOR ITS OWN DEFENSE`],
  [`I was in the Army during the Cold War. I do not trust Russia either. But the President says no. Hmm.`, `Supporting Ukraine in a MAGA primary. Lindsey Graham has entered the chat.`, `max:{LAST} BREAKS WITH PRESIDENT, BACKS UKRAINE AID`],
  [`Focus on Cimarron. Good. Fix the roads first!!`, `"Focused on Cimarron." A non-answer, but a smart one.`, `fax:{LAST} SIDESTEPS UKRAINE QUESTION`],
]);
rx('btc_crash', [
  [`"Long-term investment"?? I am 71 years old, {last}. I do not HAVE a long term. Give me my pension back 😡`, `HODL. Diamond hands at the state level. The boomers are panicking. Buy the dip.`, `max:{LAST} REFUSES TO SELL AS PENSION LOSES $900M`],
  [`Blame the Federal Reserve. Well, they DID print a lot of money. But still. $900 million!!`, `The Fed caused it. Correct. Still lost $900 million though.`, `fax:{LAST} BLAMES FEDERAL RESERVE FOR BITCOIN LOSSES`],
  [`GET OUT of Bitcoin. Thank God. Put it back in something real.`, `Sold the bottom. Paper hands. Never trust a boomer with a wallet.`, `fax:{LAST} ORDERS PENSION OUT OF BITCOIN`],
]);
rx('fluoride', [
  [`Hmm. My dentist says fluoride is good. But I do not like them putting things in my water either.`, `No fluoride statewide. Clean water, sharp minds. MAHA wins.`, `max:{LAST} WOULD BAN FLUORIDE STATEWIDE`],
  [`Let the counties decide. That is how it should be.`, `County option. Federalism for tap water. Fine.`, `fax:{LAST}: COUNTIES SHOULD DECIDE ON FLUORIDE`],
  [`Ban fluoride AND review the shots?? My grandkids had all their shots. That is going too far.`, `Fluoride and vaccines in one breath. Full health-freedom speedrun.`, `max:{LAST}: BAN FLUORIDE, REVIEW ALL VACCINE RULES`],
  [`"The science supports fluoride." OK. My dentist agrees. But the young people will not like it.`, `"Trust the science." We have heard that one before, Governor.`, `fax:{LAST} REFUSES TO BAN FLUORIDE, CITES SCIENCE`],
]);
rx('sanctuary', [
  [`Send in the Guard!! Lawrenceville does not get to make its own immigration law!!`, `The Guard into a sanctuary city. They always said we would not. We did.`, `max:{LAST} THREATENS GUARD DEPLOYMENT IN LAWRENCEVILLE`],
  [`Cut off their money. That always gets their attention.`, `Defund the sanctuary city. The effective, boring option.`, `fax:{LAST} WOULD WITHHOLD FUNDS FROM LAWRENCEVILLE`],
  [`CHARGE the council members?? Arrest elected officials?? I do not know. That feels like a lot.`, `Prosecuting city council members. Lawfare, but for us. Finally.`, `max:{LAST} WANTS SANCTUARY COUNCIL MEMBERS CHARGED`],
  [`A LOCAL decision?? Immigration is not local!! What is {last} doing??`, `Letting Lawrenceville become a sanctuary. Surrender dressed as local control.`, `max:{LAST} WON'T OVERRIDE LAWRENCEVILLE SANCTUARY VOTE`],
]);
rx('prayer', [
  [`YES. We prayed every morning when I was in school and we turned out fine 🙏`, `Prayer back in schools. Short answer. Right answer.`, `fax:{LAST} WILL SIGN SCHOOL PRAYER BILL`],
  [`Prayer AND chaplains. Wonderful!! Our kids need God more than ever 🙏✝️`, `State-funded chaplains. Taking the schools back one hallway at a time.`, `max:{LAST} ADDS STATE-FUNDED CHAPLAINS TO PRAYER BILL`],
  [`A moment of silence. That is what the liberals want. Say the word PRAYER, {last}!!`, `A moment of silence. The religion of people who are afraid of religion.`, `max:{LAST} OFFERS "MOMENT OF SILENCE" INSTEAD OF PRAYER`],
  [`Parents should lead. OK. But the schools used to help and now they teach the opposite.`, `"Parents, not the state." Libertarian cope. The state is already teaching them something.`, `fax:{LAST}: PARENTS, NOT SCHOOLS, SHOULD LEAD PRAYER`],
]);

// ---------------- EVENTS ----------------
rx('leaked_audio', [
  [`I KNEW it was fake. They can make anybody say anything with that AI now. Leave {last} alone!!`, `Called it AI and it worked. The deepfake defense is undefeated.`, `fax:{LAST} CAMP: DONOR TAPE "MANIPULATED BY AI"`,
   `So it was REAL. And then {last} lied about it. I defended {last} to my whole family. Never again.`, `"It's AI." Then the full tape drops. Historic self-own. Screenshotting everything.`, `max:FULL TAPE RELEASED: {LAST}'S AI CLAIM COLLAPSES`],
  [`An apology to US, not to the media. That means something. Everybody makes mistakes. I forgive {last} 🙏`, `Apologized to the base. Groveling is not a strategy, but at least it was aimed at the right people.`, `fax:{LAST} APOLOGIZES TO BASE: "I WAS WRONG"`],
  [`Describing Democrats. OK. Makes sense. Democrats DO believe things that are not true 😂`, `"I meant Democrats." Weak, but the normies bought it. Fine.`, `fax:{LAST}: TAPE REMARKS WERE ABOUT DEMOCRATS`,
   `The full clip says REPUBLICANS. Clear as day. Why lie about it, {last}??`, `Even the fact-checkers and Dunmore agree. Imagine uniting those two against yourself.`, `max:FACT CHECK: {LAST} WAS DESCRIBING REPUBLICANS ON TAPE`],
  [`Changing the subject with MORE dirt?? Now everybody is fighting. The Democrats are laughing at us.`, `Answer a scandal with a scandal. Chaos candidate. Respect the move.`, `max:{LAST} CAMP DROPS DUNMORE OPPO SAME DAY AS TAPE`],
]);
rx('second_tape', [
  [`Looked right into the camera and owned it. That takes guts. I respect that. Look at the record 👍`, `The direct-to-camera apology. Boomers eat this up. It will work, sadly.`, `fax:{LAST} RUNS AD ADMITTING DONOR TAPE REMARKS`],
  [`The donor leaked it for his OWN business. Figures. Everybody in the capital is in it for themselves.`, `Attack the leaker. Correct instinct. The Chamber is sweating.`, `max:{LAST} TARGETS DONOR WHO LEAKED TAPE`],
  [`Saying nothing while the ad runs every night on my TV. Not a good look.`, `Silence while Dunmore runs the tape 40 times a day. It is over.`, `max:DUNMORE AD RUNS; {LAST} SILENT`],
]);
rx('affair_rumor', [
  [`SUE HIM. You cannot just say things like that about somebody's marriage!!`, `The lawsuit worked. Dunmore retracting on air is the funniest thing this cycle.`, `fax:DUNMORE RETRACTS AFFAIR CLAIM AFTER {LAST} LAWSUIT`,
   `The lawsuit made it worse. Now they want private messages?? This is a mess.`, `Suing a podcaster. Streisand effect speedrun. Discovery is going to be glorious.`, `max:DUNMORE LAWYERS DEMAND {LAST}'S PRIVATE MESSAGES`],
  [`The whole family in the front pew. That says it all. No need for words 🙏⛪`, `The church photo op. Boomers crying in the comments. Effective.`, `fax:{LAST} FAMILY ATTENDS CHURCH AMID AFFAIR RUMORS`],
  [`One denial and done. Good. I do not want to hear about anybody's bedroom.`, `Denied once and moved on. Standard crisis PR. Fine.`, `fax:{LAST} FIRMLY DENIES DUNMORE AFFAIR CLAIM`],
  [`Divorce records?? Now BOTH of them are in the gutter. My wife turned off the TV.`, `Divorce records for divorce records. The race is now a reality show. I am entertained.`, `max:{LAST} CAMP RELEASES DUNMORE DIVORCE RECORDS`],
  [`Three years of NO TAXES?? And HE talks about other people?? Wow.`, `Held the tax file and used it at the perfect moment. Machiavelli would approve.`, `max:DUNMORE SKIPPED TAXES FOR 3 YEARS, FILES SHOW`],
]);
rx('discovery', [
  [`Drop it. The whole thing is a circus.`, `Dropped the suit. Dunmore wins without doing anything. Classic.`, `fax:{LAST} DROPS DEFAMATION SUIT AGAINST DUNMORE`],
  [`Keep fighting!! The judge agreed with {last}. Good.`, `Kept fighting and won the motion. Lawfare against a podcaster. Actually won.`, `fax:JUDGE RULES FOR {LAST} IN DUNMORE CASE`,
   `"Low-information voters"?? That is what they call people like ME. I heard it. I will remember it.`, `"Low-information voters" on a T-shirt. The merch writes itself. Dunmore is printing money.`, `max:NEW {LAST} STAFF MESSAGES MOCK "LOW-INFORMATION" VOTERS`],
  [`Fire them. You do not talk about voters like that. Ever.`, `Sacrificed the staffers. The base accepts a blood offering.`, `fax:{LAST} FIRES STAFFERS OVER "LOW-INFORMATION" MESSAGES`],
]);
rx('donor_deal', [
  [`$3 million and a promise. Hmm. My cousin has a leaking well on his land. Who is going to fix that?`, `Took the oil money. Energy dominance, bought and paid for.`, `max:OIL EXEC VOIGT FUNDS PRO-{LAST} SUPER PAC`],
  [`Take the money and promise nothing. That is just smart politics.`, `Took the money, made no promise. Galaxy brain.`, `fax:VOIGT GIVES $3M TO {LAST} SUPER PAC`,
   `Only $1 million? And he wants the veto first? Sounds like a bribe to me.`, `Voigt paid a third and wants the rest on delivery. Everyone can see the deal.`, `max:VOIGT: REST OF MONEY "WHEN I SEE THE VETO"`],
  [`Said NO to $3 million to protect farmers. That is character!! 👏`, `Turned down $3 million. Vaskel will take it. Principles are expensive.`, `fax:{LAST} TURNS DOWN OIL EXEC'S $3M OFFER`],
]);
rx('donor_leak', [
  [`Gave it all back AND signed the bill. That is how you fix a mistake. Respect.`, `Returned the money and caved to the farmers. Folded completely, but cleanly.`, `fax:{LAST} RETURNS $3M, SIGNS WELL-CLEANUP BILL`],
  [`"Not a crime"?? Maybe not. But it is WRONG. The farmers got sold out.`, `"Not a crime." Technically true, and the worst possible thing to say.`, `max:{LAST}: VOIGT DEAL "NOT A CRIME"`],
  [`Deny it. OK. The tape is fuzzy. I believe {last}.`, `Denied it and the tape was too muddy to prove anything. Lucky.`, `fax:{LAST} DENIES VETO DEAL WITH OIL DONOR`,
   `The full transcript is in the paper. It is VERY clear. {last} lied to all of us.`, `Denied it, then the transcript dropped. The ledger of lies grows.`, `max:TRANSCRIPT: {LAST} AGREED TO VETO FOR VOIGT`],
]);
rx('church_arrest', [
  [`The law is the law. But arresting a man in church during service... I do not know. My pastor was upset.`, `No sanctuary for anyone. Not even in the pews. Consistent.`, `max:{LAST} DEFENDS ARREST DURING CHURCH SERVICE`],
  [`Churches are sacred. Good call {last}. Except for violent criminals of course.`, `"Sanctuary churches." Dunmore will run this ad every day until August.`, `max:{LAST} LIMITS ICE ARRESTS AT CHURCHES`],
  [`A private visit, no cameras. That is what a Christian does 🙏`, `Visiting the pastor quietly. Church networks talk. Smart.`, `fax:{LAST} MEETS PASTOR OF RAIDED CHURCH`],
  [`Blame ICE? Your troopers were in the video, {last}. Come on.`, `Blaming the feds when your own troopers are on camera. Bold. Stupid, but bold.`, `max:{LAST} BLAMES FEDERAL ICE POLICY FOR CHURCH ARREST`],
  [`Sen. Ellender praying with Pastor Ortega. Beautiful picture. That is what the church is about 🙏`, `The abortion-ban author kneeling with a Hispanic Baptist. The pastors are melting.`, `fax:ELLENDER LEADS PRAYER AT RAIDED CHURCH`],
]);
rx('tornado', [
  [`The Governor stopped campaigning to help Sumner. That is a LEADER. Praying for those families 🙏`, `Suspended the campaign for disaster response. Boomers will vote on this alone.`, `fax:{LAST} SUSPENDS CAMPAIGN TO LEAD TORNADO RECOVERY`],
  [`Thank you Mr. President!! This is how it should work 🇺🇸`, `Thanked the President on camera. Loyalty points secured.`, `fax:PRESIDENT APPROVES CIMARRON DISASTER AID, THANKS {LAST}`],
  [`No federal help?? Those people lost everything!! This is not the time for principles, {last}.`, `Refused FEMA money. Actual fiscal conservatism. Sumner will not enjoy it.`, `max:{LAST} REFUSES FEDERAL TORNADO AID`],
  [`FEMA was slow and {last} called them out. Now they are moving. Good!!`, `Bullied FEMA into moving. Wins are wins.`, `fax:FEMA SPEEDS UP AFTER {LAST} CRITICISM`,
   `Attacking the President's FEMA?? In a disaster?? Not the time.`, `The President called {last} "ungrateful." That is a death sentence in this primary.`, `max:PRESIDENT CALLS {LAST} "UNGRATEFUL"`],
]);
rx('judge_blocks', [
  [`Follow the law and appeal. That is responsible. But the base wanted a fight.`, `Complied with an activist judge. The Texas way was right there. ngmi.`, `fax:{LAST} COMPLIES WITH RULING, WILL APPEAL`],
  [`We will keep enforcing!! One judge does not run Cimarron!! 🇺🇸`, `Defying a federal judge. This is the moment. The republic of Cimarron awakens.`, `max:{LAST} DEFIES FEDERAL JUDGE, KEEPS ENFORCING LAW`],
  [`Impeach her!! These judges think they are kings.`, `Impeachment will fail, but the energy is correct.`, `max:{LAST} CALLS FOR IMPEACHMENT OF FEDERAL JUDGE`],
  [`Rewrite the law. That sounds like giving up.`, `"Rewrite the law." Surrender with extra paperwork.`, `fax:{LAST} ASKS LEGISLATURE TO REWRITE BLOCKED LAW`],
]);
rx('contempt', [
  [`Cimarron will not pay!! Let them come. I am behind {last} 100% but I am a little worried now.`, `Refusing to pay the fines. The state versus the federal judiciary. History is being made.`, `max:{LAST}: CIMARRON "WILL NOT PAY" CONTEMPT FINES`],
  [`Quietly complied?? After all that big talk?? I feel like a fool for cheering.`, `All that talk and then a quiet surrender. Fold of the year.`, `max:{LAST} QUIETLY COMPLIES AFTER DEFIANCE`],
  [`The President stepped in!! That is what friends do. God bless 🇺🇸`, `The DOJ backed Cimarron. The President has our back. We are so back.`, `fax:DOJ FILES IN SUPPORT OF CIMARRON; FINES PAUSED`,
   `Asked the President for help and he did not answer. That is embarrassing.`, `Begged the White House and got left on read. Brutal.`, `max:WHITE HOUSE SILENT ON {LAST} REQUEST`],
]);
rx('fbi_krantz', [
  [`The FBI raided a SHERIFF. This is the weaponized government we warned about. Stand with Krantz!!`, `Defending your own rival against the feds. Principled. Also, Krantz says thanks.`, `max:{LAST} DEFENDS KRANTZ, CONDEMNS "WEAPONIZED FBI"`],
  [`"Let the investigation proceed"?? You sound like a Democrat. The FBI is not our friend.`, `Siding with the FBI. In 2030. In a Republican primary. Incredible.`, `max:{LAST} BACKS FBI PROBE OF SHERIFF KRANTZ`],
  [`No comment? Hmm. Somebody died in that jail. Somebody should say something.`, `Silence. Everyone noticed. Nobody respects it.`, `fax:{LAST} SILENT ON FBI SEARCH OF KRANTZ OFFICE`],
  [`A man DIED in that jail. Somebody should look into it. But this looks political.`, `A state investigation of your rival. Using the machine against Krantz. Cold.`, `max:{LAST} ORDERS STATE PROBE OF HARLAN JAIL DEATH`],
]);
rx('krantz_standoff', [
  [`Nobody got hurt. Thank God. That is what matters 🙏`, `Troopers between ranchers and feds. Nobody is happy. That is the establishment for you.`, `fax:{LAST} SENDS TROOPERS TO DEFUSE DRY FORK STANDOFF`],
  [`Stand with the ranchers!! The BLM has no business there. It is THEIR land!!`, `Siding with the ranchers against the BLM. Bundy energy. Beautiful.`, `max:{LAST} STANDS WITH RANCHERS, DEMANDS BLM LEAVE`],
  [`Called the President and he fixed it. That is how you get things done 🇺🇸`, `Got the President to call off the BLM. Loyalty pays dividends.`, `fax:PRESIDENT PAUSES BLM SURVEY AFTER {LAST} REQUEST`],
  [`Illegal? Maybe. But those ranchers are our people. Careful, {last}.`, `Called the ranchers criminals. Harlan County will never forget.`, `max:{LAST} CALLS KRANTZ STANDOFF "ILLEGAL AND DANGEROUS"`],
  [`Brannigan walked up there alone and talked them down. A real Ranger. Proud of that ticket!! 🪖`, `Brannigan de-escalated like an operator. The ticket just ended the standoff, not Krantz.`, `fax:BRANNIGAN ENDS DRY FORK STANDOFF`,
   `They told Brannigan to leave. Not good. Krantz is laughing at us now.`, `The volunteers sent Brannigan home. Krantz owns the road now.`, `max:VOLUNTEERS REBUFF BRANNIGAN AT DRY FORK`],
]);
rx('hospital', [
  [`Reopen the hospital. People in Dry Fork need it. My sister lives near there. Thank you!!`, `A state grant for the hospital. Fine. The budget hawks are crying.`, `fax:{LAST} ANNOUNCES GRANT TO REOPEN DRY FORK HOSPITAL`],
  [`Federal rules and bad management. Maybe. But a woman DIED. Blaming people will not help.`, `Blame the regulators. Standard. Dry Fork is not buying it.`, `max:{LAST} BLAMES REGULATIONS FOR HOSPITAL CLOSURE`],
  [`Medicaid expansion?? That is Obamacare!! I cannot believe {last} said that.`, `Medicaid expansion. Rural hospitals, sure. Still the uniparty.`, `max:{LAST} BACKS MEDICAID EXPANSION AFTER HOSPITAL CLOSES`],
  [`Went to the funeral. That was the right thing. Politics can wait 🙏`, `No policy, just a funeral. Respectful. The question is not going away.`, `fax:{LAST} ATTENDS FUNERAL IN DRY FORK`],
]);
rx('donor_wife', [
  [`Good for {last}. Dr. Hale is a heart doctor and a citizen. That IS the American Dream. The people attacking her should be ashamed of themselves.`, REMOVED_POST('212,000'), `fax:GOV. {LAST} STANDS WITH DONOR'S WIFE AFTER RACIST ATTACKS`],
  [`Hate is hate. Glad {last} said something. Now can we get back to the issues please.`, `"All hate." LOL. {last} could not even say who they were defending. Weak.`, `fax:{LAST} CONDEMNS "ALL FORMS OF HATE"`],
  [`Not sure why this is even a story. Politicians should stay out of Twitter fights.`, `Silence is agreement. {last} knows exactly who the voters are.`, `max:{LAST} STAYS SILENT AS ONLINE ATTACKS ON DONOR'S WIFE GROW`],
  [`Probably the safe thing for her. Too many crazies online these days.`, `They are learning. First one gone. 🏛️`, `fax:DONOR'S WIFE STEPS BACK FROM {LAST} CAMPAIGN AFTER ATTACKS`],
  [`200 business owners standing up for a doctor. That is Cimarron. Good people 👍`, `The Chamber signed a letter. Of course they did. They are the ones who want the visas.`, `fax:200 BUSINESS OWNERS BACK DR. HALE IN LEDGER LETTER`],
]);
rx('shooting', [
  [`A guard at every school door. That is how you protect the children. God bless those families 🙏`, `Guards in every school. The only answer that does not touch the Second Amendment. Correct.`, `fax:{LAST} PROPOSES ARMED GUARDS IN EVERY SCHOOL`],
  [`Raise the age?? That is gun control. I am sad for those families but this is NOT the answer.`, `Gun control from a Republican. The Rifle Association just endorsed Krantz. It is over.`, `max:{LAST} CALLS SPECIAL SESSION ON RIFLE AGE LIMIT`],
  [`Faith and mental health. Not new laws. The problem is the heart, not the gun 🙏`, `Mental health and God. The standard answer. It works in this state.`, `fax:{LAST}: "FAITH AND MENTAL HEALTH," NOT NEW LAWS`],
  [`Just be with the families. That is the right thing. Politics can wait.`, `No position. Respectful, and the debate goes on without {last}.`, `fax:{LAST} FOCUSES ON FAMILIES AFTER OSGOOD SHOOTING`],
  [`The Rifle Association paying for training. Gun owners taking care of our own. Good!!`, `The NRA of Cimarron paying for church-school safety. Better than any law.`, `fax:RIFLE ASSOCIATION TO FUND SAFETY TRAINING AFTER SHOOTING`],
]);
rx('lawrenceville_murder', [
  [`Called the family first. Then a real law. Emily's Law. That is how you do it. RIP Emily 🙏`, `A dead girl's name on a detention bill. A name and a policy. Effective.`, `fax:{LAST} PROPOSES "EMILY'S LAW" AFTER LAWRENCEVILLE MURDER`],
  [`OPEN BORDERS KILLED THAT GIRL. Somebody had to say it!!`, `Open borders did this. Said it at the podium. Good.`, `max:{LAST}: "OPEN BORDERS" TO BLAME FOR CARTER MURDER`],
  [`Respecting the family is right. But Dunmore is out there fighting and {last} is quiet.`, `A week of silence while Dunmore owns the issue. Nice guys finish third.`, `fax:{LAST} RESPECTS CARTER FAMILY'S PLEA, AVOIDS POLITICS`],
  [`Blame the county? The county said they followed YOUR law. Hmm.`, `Blamed the county. The county blamed the state law. Oops.`, `max:{LAST} BLAMES COUNTY FOR RELEASE OF SUSPECT`],
  [`The detention center {last} promised. If that was open, Emily would be alive. Build it NOW!!`, `The camp that critics mocked is now the answer. Called it.`, `max:{LAST}: DETENTION CENTER WOULD HOLD "MEN LIKE HIM"`],
]);
rx('rifle_q', [
  [`All three!! A+ from the Rifle Association. That is my Governor 🇺🇸🔫`, `Endorsed. Full gun-rights package. Krantz is seething.`, `fax:RIFLE ASSOCIATION ENDORSES {LAST}`],
  [`Keep background checks and still got the endorsement. Smart!!`, `Squeaked by with a one-vote endorsement. The fence-sitting worked, barely.`, `fax:RIFLE BOARD ENDORSES {LAST} BY ONE VOTE`,
   `The Rifle Association went with Krantz. Background checks are a hill to die on?? Really??`, `Kept background checks and lost the endorsement to Krantz. Deserved.`, `max:RIFLE ASSOCIATION PICKS KRANTZ OVER {LAST}`],
  [`Would not even fill out the questionnaire?? An "F"?? From the RIFLE Association?? Unbelievable.`, `Got an F from the gun lobby. On purpose. What.`, `max:{LAST} SKIPS RIFLE QUESTIONNAIRE, GETS "F"`],
]);
rx('right_to_life', [
  [`Every life matters. Except when the mother will die. That is reasonable. Proud of {last} 🙏`, `No exceptions except life. The pro-life movement accepts the hand.`, `fax:RIGHT TO LIFE ENDORSES {LAST}`],
  [`Even when the MOTHER could die?? My daughter had a tough pregnancy. I do not like this at all.`, `No exceptions at all. Ideological purity at the cost of every swing voter. Respect the commitment.`, `max:{LAST} PLEDGES TO END ALL ABORTION EXCEPTIONS`],
  [`Defend the current law. It is already strong. OK. But Right to Life went with Pastor Rick.`, `Right to Life picked Rick. {last} defended the status quo. Boring loss.`, `fax:RIGHT TO LIFE ENDORSES PASTOR RICK`],
]);
rx('farm_bureau', [
  [`All three?? Including farm AMNESTY? The farmers are happy but the base is not.`, `The immigration exemption for farms. Amnesty with a tractor. Dunmore's ad writes itself.`, `max:{LAST} ACCEPTS FARM BUREAU'S IMMIGRATION EXEMPTION`],
  [`Farmers got help and no amnesty. Best of both. The Bureau endorsed!!`, `Got the Farm Bureau without the amnesty. Clean win.`, `fax:FARM BUREAU ENDORSES {LAST}`,
   `Krantz got the farmers. Hmm. He is a rancher. They trust him more I guess.`, `Lost the farmers to a rancher sheriff. Figures.`, `max:FARM BUREAU PICKS KRANTZ`],
  [`A bailout is a bailout. OK. But the farmers really are hurting from the tariffs.`, `No farm bailouts. Principled. Krantz takes the endorsement.`, `fax:{LAST} REJECTS FARM RELIEF FUND AS "BAILOUT"`],
]);
rx('youth_summit', [
  [`I do not really understand the question. But the young people went crazy. I guess it was a good answer?`, REMOVED_POST('340,000'), `max:{LAST} ENDORSES "REPLACEMENT" CLAIM AT YOUTH SUMMIT`],
  [`Reduce immigration. That is what everybody I know wants. Good answer.`, `A careful answer to a question that wanted a yes. The room wanted more.`, `fax:{LAST}: MASS IMMIGRATION "A POLICY CHOICE"`],
  [`Reject the conspiracy stuff but fight illegal immigration. That is exactly right.`, `Booed at the youth summit. {last} is a boomer in a Governor's suit.`, `max:{LAST} BOOED FOR REJECTING "REPLACEMENT" THEORY`],
  [`That young Voss fellow talked for three minutes and I did not understand a word. The kids loved it though!`, `Voss cooked. "A nation, not an economy." Future President.`, `fax:VOSS WOWS YOUTH SUMMIT; FRONTLINE ENDORSES TICKET`,
   `Voss said YES?? On camera?? That is going to be on the news forever. Who picked this guy??`, REMOVED_POST('410,000'), `max:{LAST} RUNNING MATE ENDORSES "REPLACEMENT" CLAIM ON CAMERA`],
]);
rx('pastors_breakfast', [
  [`Chaplains in every school, paid by the state. Wonderful!! And the pastors switched to {last} 🙏`, `The pastors abandoned Rick for {last}. The Christian right just changed sides.`, `fax:PASTORS' COUNCIL SWITCHES ENDORSEMENT TO {LAST}`,
   `The pastors stayed with Rick by two votes. So close!! But they like {last} now.`, `Two votes short. The Council stays with Rick. Close is not a win.`, `max:PASTORS' COUNCIL STAYS WITH RICK BY TWO VOTES`],
  [`Local districts choose. Fair. The pastors liked it.`, `"Where local districts choose." Nice answer. Not enough to flip the room.`, `fax:{LAST} BACKS OPTIONAL SCHOOL CHAPLAINS`],
  [`Counselors over chaplains?? At a PASTORS' breakfast?? Awkward.`, `Told a room of pastors their chaplains were not qualified. Legendary.`, `max:{LAST} TELLS PASTORS: CHILDREN NEED "TRAINED COUNSELORS"`],
]);
rx('growth_club', [
  [`Cut the sales tax and no new spending. Sign me up!! 💵`, `Club for Growth money secured. Vaskel lost his own donors to {last}.`, `fax:CLUB FOR GROWTH ENDORSES {LAST}`],
  [`Half a promise and they still endorsed. Good negotiating!!`, `Half-promise, full endorsement. Artful.`, `fax:CLUB FOR GROWTH BACKS {LAST} AFTER VETO PLEDGE`,
   `The Club went with the California billionaire. Figures. Money goes to money.`, `Half a promise got {last} zero endorsements. The Club went with Vaskel.`, `max:CLUB FOR GROWTH ENDORSES VASKEL`],
  [`No pledges. OK. Principles. But now they call {last} a tax-and-spend Republican 😬`, `Refused the Club's pledge out of pride. The Club's attack ads will be merciless.`, `max:CLUB FOR GROWTH ATTACKS "TAX-AND-SPEND" {LAST}`],
]);
rx('vaskel_ads', [
  [`The ads said 140 taxes but most were old fees. Good that {last} explained it.`, `Explaining is losing, but it stopped the bleeding.`, `fax:{LAST} ANSWERS VASKEL'S "140 TAXES" ADS`],
  [`Vaskel gave money to CALIFORNIA DEMOCRATS?? Knew it. Never trusted that guy.`, `California Democrat donations. The perfect hit on Vaskel. His numbers fell.`, `max:VASKEL GAVE $400K TO CALIFORNIA DEMOCRATS`],
  [`The ethics commission is looking at Vaskel's PAC. Good. Rules are rules.`, `The complaint worked. Stations pulled his ads. Lawfare, but useful.`, `fax:ETHICS PANEL PROBES VASKEL SUPER PAC`,
   `Complaint dismissed. Now Vaskel looks like the victim.`, `"A politician using bureaucracy against a job creator." Vaskel won that exchange.`, `max:ETHICS COMPLAINT AGAINST VASKEL DISMISSED`],
  [`Ignoring ads that say 140 taxes?? Now everybody thinks you raised 140 taxes!!`, `Ignored $6 million in ads. The number is now true.`, `max:VASKEL ADS GO UNANSWERED`],
]);
rx('oppo_file', [
  [`Dunmore did not pay his TAXES?? He talks about everybody else!!`, `Dunmore's tax file. He says the taxes were illegitimate. Honestly, fair.`, `max:DUNMORE SKIPPED STATE TAXES, FILES SHOW`],
  [`$2 million in COVID loans to a megachurch?? And he says he is against big government?`, `Rick took the COVID money. Big government for thee, PPP for me.`, `max:PASTOR RICK'S CHURCH GOT $2.1M IN FORGIVEN LOANS`],
  [`$400,000 to California Democrats!! Vaskel is a Democrat. Knew it.`, `Vaskel funded Democrats. He "evolved." Sure.`, `fax:VASKEL DONATED $400K TO CALIFORNIA DEMOCRATS`],
  [`Keep the files for later. Smart. Save the ammo 😏`, `Held all three files. Patience. Menace.`, `fax:{LAST} CAMP HOLDS OPPO FILES FOR FINAL WEEKS`],
]);
rx('oppo_release', [
  [`Dunmore and his taxes. Right before the vote. Good timing!!`, `Final-week drop on Dunmore. The file was worth the wait.`, `max:FINAL WEEK: DUNMORE TAX FILES RELEASED`],
  [`Rick and the COVID money. Right at the end. Hmm. A little dirty but true.`, `Rick's PPP loans, one week out. Timing is everything.`, `max:FINAL WEEK: RICK CHURCH LOAN FILES RELEASED`],
  [`Vaskel spent $2 million answering it. That means it hurt!!`, `Vaskel's Democrat donations in the last week. He paid to make it bigger.`, `max:FINAL WEEK: VASKEL'S DEMOCRAT DONATIONS RELEASED`],
  [`Never used them. That is class. Clean campaign 👏`, `Sat on three nukes and never used them. Principled or stupid. Both.`, `fax:{LAST} NEVER RELEASES OPPO FILES`],
]);
rx('president_call', [
  [`Whatever the President needs. He has done so much for us 🇺🇸🇺🇸`, `Fired the Secretary of State and backed the tariffs. Full loyalty. The White House noticed.`, `max:{LAST} FIRES SECRETARY OF STATE, BACKS POTASH TARIFFS`],
  [`Fired the Secretary of State. Good. But what about the potash tariffs? Farmers need fertilizer.`, `Half the deal. Trump-world remembers halves.`, `fax:{LAST} FIRES SECRETARY OF STATE AT WHITE HOUSE REQUEST`],
  [`Said NO to the President?? Twice?? In THIS state?? {last} is done.`, `Refused the President to his face. Either brave or finished. Probably finished.`, `max:{LAST} REFUSES WHITE HOUSE DEMANDS`],
  [`"Look at it." Smart. Keep everybody happy.`, `The White House forgot about it. The oldest trick worked.`, `fax:{LAST} STALLS WHITE HOUSE REQUESTS`,
   `The White House called twice and then STOPPED calling. That is not good.`, `Ghosted by the White House. The slow-walk failed.`, `max:WHITE HOUSE STOPS CALLING {LAST}`],
]);
rx('straw_poll', [
  [`The hall was LOUD!! I watched it on the local news. Great speech!!`, `Deportation, election integrity, uniparty. The holy trinity of convention speeches.`, `max:{LAST} FIRES UP CONVENTION WITH "UNIPARTY" SPEECH`],
  [`Everybody stood and prayed together. Beautiful. God is still in this party 🙏`, `The faith speech. Delegates praying. Pastor Rick is sweating.`, `fax:{LAST} DELIVERS FAITH SPEECH AT CONVENTION`],
  [`Tax cuts, jobs, results. That is what a Governor talks about. Good.`, `The record speech. Polite applause. Nobody remembers it.`, `fax:{LAST} RUNS ON RECORD AT STATE CONVENTION`],
  [`BOOED for talking about unity?? At a Republican convention?? What happened to us.`, `A unity speech to activists. Booed. Deserved.`, `max:DELEGATES BOO {LAST} UNITY SPEECH`],
]);
rx('whitlock_offer', [
  [`Carol Whitlock endorsing {last}?? Hmm. The establishment coming home, like Dunmore said.`, `Took the Whitlock endorsement. "Carol's candidate." It is on a shirt already.`, `max:WHITLOCK DROPS OUT, ENDORSES {LAST}`],
  [`She dropped out quietly. Good. No drama. Her voters can come to us.`, `Whitlock gone quietly. No endorsement stain. Clean.`, `fax:WHITLOCK WITHDRAWS FROM GOVERNOR'S RACE`,
   `She would not drop out. Good for her I guess. She believes what she believes.`, `Whitlock refused. "I will lose saying what I believe." Respect, honestly.`, `fax:WHITLOCK STAYS IN RACE, REJECTS {LAST}'S REQUEST`],
  [`Declined politely. Fine. Carol is harmless.`, `Said no thanks. Whitlock stays at 5% forever.`, `fax:{LAST} DECLINES WHITLOCK DEAL`],
  [`Leaked it to embarrass her?? She is 67 years old. That was petty.`, `Leaked Whitlock's offer. Pettiness is a virtue in primaries.`, `max:{LAST} CAMP LEAKS WHITLOCK'S DROPOUT OFFER`],
]);
rx('favor_pardon', [
  [`Pardon him? He stole from FARMERS. 200 families!! I love the President but this is wrong.`, `Pardoned the President's golf buddy. Loyalty is the only currency that matters.`, `max:{LAST} PARDONS PRESIDENT'S FRIEND CAL RENNER`],
  [`Less prison but he still pays the families back. That is fair. Good compromise.`, `Half a pardon. The White House hates half of anything.`, `fax:{LAST} CUTS RENNER SENTENCE, KEEPS RESTITUTION`],
  [`Said no to the President's golf buddy for 200 farm families. THANK YOU {last}. Somebody finally stands up for regular people.`, `Refused the President. Justice for the farmers, political death for {last}.`, `max:{LAST} REFUSES WHITE HOUSE PARDON REQUEST`],
  [`"After the primary." Smart. Nobody said no, nobody said yes.`, `The White House took the stall as a yes. Now {last} owes one.`, `fax:{LAST} WILL REVIEW RENNER PARDON "AFTER THE PRIMARY"`,
   `The President does not like to wait. Nobody tells HIM "later."`, `Tried to stall the President. The President does not wait.`, `max:WHITE HOUSE COOLS ON {LAST} AFTER PARDON DELAY`],
]);
rx('favor_drones', [
  [`Drones from the President's son's company?? No bidding?? My Linda says this smells bad and she is right.`, `No-bid contract for the President's son. The drones are just the receipt.`, `max:{LAST} SIGNS NO-BID DRONE DEAL WITH PRESIDENT'S SON'S FIRM`],
  [`Open bidding and they won fair and square. That is the American way 👍`, `They won the bid "fairly." Sure. Everyone is happy.`, `fax:LIBERTY DRONE WINS STATE POLICE CONTRACT`,
   `A Cimarron company won the bid!! Local jobs!! But the President's son is mad now.`, `The son lost the bid and stopped returning calls. Oops.`, `max:PRESIDENT'S SON'S FIRM LOSES CIMARRON DRONE BID`],
  [`A small test program. Makes sense. See if they even work first.`, `A $10 million pilot. A little tribute to the royal family.`, `fax:{LAST} APPROVES $10M DRONE PILOT PROGRAM`],
  [`No surveillance drones over Cimarron. Good. I do not want the government watching my backyard.`, `No drones. The Liberty Caucus is in love. The President's son is not.`, `max:{LAST} REJECTS DRONE DEAL, SON CALLS {LAST} "NOT A TEAM PLAYER"`],
]);
rx('poll_shock', [
  [`Negative ads. OK. I hate them but they work.`, `Went negative on the leader. Correct. Nice guys lose primaries.`, `max:{LAST} GOES NEGATIVE AFTER LEDGER POLL`],
  [`Stay the course. Do not panic. That is a leader.`, `"Trust the plan." Q-coded campaign strategy.`, `fax:{LAST} STAYS ON MESSAGE DESPITE POLL`],
  [`Get people to the polls. That is how you win. My church has a van.`, `Turnout over TV. Boring. Probably right.`, `fax:{LAST} SHIFTS MONEY TO TURNOUT`],
]);
rx('staff_split', [
  [`Bigger rallies!! I am going to the one in Osgood next week 🇺🇸`, `Base mobilization. The rallies are the campaign now. Correct.`, `max:{LAST} CAMPAIGN GOES ALL-IN ON BASE`],
  [`Talking to regular people like me. Good. We are the ones who vote.`, `Chasing boomers and undecideds. The pollster won the argument. Sad.`, `fax:{LAST} TARGETS OLDER, UNDECIDED VOTERS`],
  [`An "online war"?? I do not even know what that means.`, `Online war with Dunmore. Kyle is a legend. We are so back.`, `max:{LAST} DECLARES ONLINE WAR ON DUNMORE`],
  [`Knocking on doors. That is how my dad's generation did it. It still works.`, `Ground game. The adults took over the campaign.`, `fax:{LAST} TRIPLES FIELD TEAM`],
]);
rx('fox_townhall', [
  [`An hour about the President's agenda. Loved it. The President even posted about it!!`, `A full hour of loyalty. The President clipped it. Mission accomplished.`, `fax:{LAST} PLEDGES LOYALTY TO PRESIDENT'S AGENDA AT TOWN HALL`],
  [`A solid hour about Cimarron. Not flashy but smart. I learned things I did not know.`, `An hour about the record. Zero viral clips. Boomer content.`, `fax:{LAST} TOUTS RECORD AT NATIONAL TOWN HALL`],
  [`A full hour attacking Dunmore. Kind of petty. Talk about what YOU will do.`, `An hour on Dunmore. Personal. Good TV.`, `max:{LAST} SPENDS TOWN HALL ATTACKING DUNMORE`],
  [`Turned down Fax News?? Now Dunmore got the hour. Bad move.`, `Gave the hour to Dunmore for free. Genius.`, `max:{LAST} DECLINES TOWN HALL; DUNMORE ACCEPTS`],
]);
rx('commandments_ruling', [
  [`The Supreme Court let the Commandments stay!! Praise God!! 🙏📜`, `The Court granted the stay. 5 to 4. We are winning the long game.`, `fax:SUPREME COURT LETS TEN COMMANDMENTS STAY IN CLASSROOMS`,
   `The Commandments came down Monday. A sad day for Cimarron. We tried.`, `Stay denied. The posters came down. Rick is holding a vigil. {last} lost this one.`, `max:SUPREME COURT DENIES STAY; COMMANDMENTS COME DOWN`],
  [`Keep them up!! Let the judge come take them down herself!! 🙏🇺🇸`, `Defying the appeals court over the Ten Commandments. Moses energy.`, `max:{LAST} ORDERS SCHOOLS TO DEFY COMMANDMENTS RULING`],
  [`"In God We Trust" is on the money. So it should be OK in schools. Not the same though.`, `Replaced Moses with a motto. Rick calls it a coward's compromise. Rick is right.`, `fax:"IN GOD WE TRUST" POSTERS REPLACE COMMANDMENTS`],
  [`Billboards across from the schools!! Ha!! Clever. The kids will see them every day.`, `Moses on a billboard across from recess. Malicious compliance. Beautiful.`, `max:{LAST} PUTS COMMANDMENTS ON BILLBOARDS OUTSIDE SCHOOLS`],
]);
rx('income_county', [
  [`Help Harlan County pay its deputies. They keep us safe. Good.`, `A loan for Harlan. The tax repeal was never paid for. The Club is right.`, `fax:{LAST} GIVES HARLAN COUNTY EMERGENCY LOAN`],
  [`Live within your means. Right!! But the jail let 40 criminals out. That is not good either.`, `"Live within their means." Now on a sign in front of the Harlan jail.`, `max:{LAST} REFUSES AID AS HARLAN RELEASES INMATES`],
  [`A LOTTERY?? Gambling is a sin. My pastor will preach against this Sunday.`, `A lottery to fund counties. Tax on the poor, make it fun.`, `max:{LAST} PROPOSES STATE LOTTERY FOR COUNTIES`],
  [`An armored truck?? $600,000 in overtime?? Krantz has some explaining to do.`, `The Ledger found Krantz's armored truck. The sheriff got audited by the news.`, `fax:KRANTZ OFFICE SPENT $600K ON OVERTIME, ARMORED TRUCK`,
   `The auditor found nothing. So {last} attacked a sheriff for no reason. Bad.`, `Attacked the sheriff's budget and the audit came back clean. Humiliating.`, `max:AUDIT CLEARS KRANTZ OFFICE; {LAST} ATTACK BACKFIRES`],
]);
rx('heartland_mateo', [
  [`The law is the law. But that boy was two years old when he came. It is hard. I pray for him.`, `No exceptions. Not even for the linebacker. The machine does not care about Friday nights.`, `max:SUMNER VALEDICTORIAN DEPORTED UNDER OPERATION HEARTLAND`],
  [`ICE deferred his case!! Sumner is celebrating. This is a good day for Cimarron 🏈🙏`, `"Amnesty one linebacker at a time." Dunmore's line is funny. The exception was still granted.`, `fax:ICE DEFERS VALEDICTORIAN'S CASE AFTER {LAST} REQUEST`,
   `ICE said no. So {last} asked for an exception AND failed. Worst of both.`, `Begged ICE for an exception and got rejected. The base heard the begging.`, `max:ICE REJECTS {LAST}'S REQUEST TO SPARE VALEDICTORIAN`],
  [`"A federal matter"?? State troopers arrested him. Everybody in Sumner knows it.`, `Pretending it is federal. Nobody believes it. Mid.`, `fax:{LAST} CALLS VALEDICTORIAN CASE "A FEDERAL MATTER"`],
  [`Prayed with the family. That is what a Christian does. No promises, but it was right 🙏`, `Prayed with the family and did nothing. Peak boomer governance.`, `fax:{LAST} VISITS FAMILY OF DETAINED VALEDICTORIAN`],
]);
rx('books_prize', [
  [`Grownups can read any book they like. Right. The law was about kids. Fair enough.`, `Hid behind "it's only for kids." Libertarian cope. The activists wanted more.`, `fax:{LAST}: BOOK LAW "IS ABOUT CHILDREN"`],
  [`Cut the library money over ONE reading?? It is a book about farmers. My mother read it.`, `Defunding the library for hosting her. The book is now a bestseller. Streisand effect.`, `max:{LAST} CUTS OSGOOD LIBRARY FUNDING OVER BOOK READING`],
  [`Congratulations to a Cimarron writer. Proud of her. But the book is for grownups. Good answer!!`, `Praised the author, kept the ban. Gracious and firm. Rare.`, `fax:{LAST} CONGRATULATES BANNED AUTHOR, KEEPS BAN`,
   `Praising a book {last} banned?? Which one is it?? I am confused.`, `Praised a banned book. Activists call it praising porn. {last} lost both sides.`, `max:ACTIVISTS BLAST {LAST} FOR PRAISING BANNED BOOK`],
  [`Went to the reading?? After banning the book?? I do not understand {last} anymore.`, `Sat in the second row at the banned-book reading. The photo is going to be everywhere.`, `max:{LAST} ATTENDS READING OF BOOK REMOVED FROM SCHOOLS`],
]);
rx('rifle_roadrage', [
  [`One bad man does not cancel the Second Amendment. EXACTLY. Praying for the youth pastor 🙏`, `Stood by the law. No backing down after one bad day. Correct.`, `fax:{LAST} STANDS BY PERMITLESS CARRY AFTER SHOOTING`],
  [`Free training for anyone who wants it. Nobody forced. I would go!!`, `Free voluntary training. Nobody will go. Good optics though.`, `fax:{LAST} OFFERS FREE STATE FIREARMS TRAINING`],
  [`Training requirement? That is how it starts. First training, then permits, then registration.`, `A training mandate. The Rifle Association is revoking the A+.`, `max:{LAST} BACKS TRAINING MANDATE FOR YOUNG CARRIERS`],
  [`Prayed with the church. Good. Some things are bigger than politics 🙏`, `Prayed, did nothing. The question comes back.`, `fax:{LAST} VISITS WOUNDED PASTOR'S CHURCH`],
  [`The Rifle Association is paying for the pastor. Gun owners take care of people. Proud 🇺🇸`, `The gun lobby paid the hospital bill. Protect the law and look good doing it.`, `fax:RIFLE ASSOCIATION TO PAY WOUNDED PASTOR'S BILLS`],
]);
rx('voss_posts', [
  [`"Democracy was a mistake"?? And we are keeping him on the ticket?? My wife is FURIOUS.`, `Stood by Voss. Loyalty to the young right. The boomer women are leaving. Worth it.`, `max:{LAST} STANDS BY VOSS AFTER ANONYMOUS POSTS`],
  [`Sen. Ellender is a good Christian lady. Better choice. Thank you {last}.`, `Dumped Voss for a pastor's favorite. The regime always wins. He was right.`, `fax:{LAST} DROPS VOSS, NAMES ELLENDER RUNNING MATE`],
  [`He apologized. Good. Young people make mistakes. Move on.`, `Voss apologized. Broken. The regime got him.`, `fax:VOSS APOLOGIZES FOR ANONYMOUS POSTS`,
   `He apologized and then said it was fake on his stream?? This young man is a disaster.`, `Apologized to the "regime" then un-apologized. Voss is the most honest man in politics.`, `max:VOSS RETRACTS APOLOGY ON LIVESTREAM`],
  [`The media attacks every young conservative. True. But those posts were bad.`, `Blame the Ledger. Correct framing. Keep going.`, `max:{LAST} CALLS VOSS STORY "A MEDIA ATTACK"`],
]);
rx('ruud_milk', [
  [`Children in the hospital and we are defending the DAIRY?? One of them is on dialysis!!`, `Defended Ruud. Health freedom does not bend to one outbreak.`, `max:{LAST} DEFENDS RUUD AFTER RAW MILK OUTBREAK`],
  [`She visited the children. Held a mother's hand. That is what a woman of God does 🙏`, `Ruud visited the kids. The photo worked. Pharma lost this round.`, `fax:RUUD VISITS SICK CHILDREN WITH {LAST}`,
   `She REFUSED?? In public?? The running mate is arguing with the Governor now. Mess.`, `"I will not bow to the narrative." Ruud is based and the ticket is on fire.`, `max:RUUD REFUSES {LAST}, KEEPS OUTBREAK POST`],
  [`Inspect the dairies. Kids got sick. That is just responsible.`, `State inspections of raw milk. Ruud calls it a raid. She is right.`, `fax:{LAST} ORDERS INSPECTIONS OF RAW MILK DAIRIES`],
  [`Colt Brannigan. Former Army Ranger. A real American. Good pick!!`, `Swapped the MAHA mom for a Ranger. The health-freedom moms are gone.`, `fax:{LAST} REPLACES RUUD WITH BRANNIGAN`],
]);
rx('ellender_women', [
  [`Prosecute the WOMEN?? My daughter, my granddaughter?? No. That is too far. Sorry.`, `If it is murder, it is murder. Logically consistent. Electorally fatal.`, `max:{LAST} BACKS PROSECUTING WOMEN WHO TRAVEL FOR ABORTIONS`],
  [`Never the women. Good. Go after the doctors. That is the pro-life position.`, `"Never women." Undercut the running mate on live TV. Awkward.`, `fax:{LAST}: TICKET WILL "NEVER" PROSECUTE WOMEN`],
  [`Let the lawmakers decide. OK. The press moved on. Good.`, `Punted to the legislature. It worked. For now.`, `fax:{LAST} DEFERS TO LEGISLATURE ON ELLENDER REMARKS`,
   `Pastor Rick asked yes or no and {last} could not answer. Not a good look.`, `"Yes or no." {last} could not say either. A million views.`, `max:RICK CHALLENGES {LAST}: "YES OR NO?"`],
]);
rx('ellender_women', [null, null, null,
  [`Maternity homes!! Help the mothers. THAT is pro-life. Beautiful idea Sen. Ellender 🙏👶`, `Changed the subject to maternity homes. Clever pivot. Did not answer the question.`, `fax:{LAST}, ELLENDER ANNOUNCE STATE MATERNITY HOMES`],
]);
rx('brannigan_record', [
  [`Two soldiers backed him up!! I knew it. You do not question a Ranger's service 🪖🇺🇸`, `Stood by the Ranger and his unit backed him. Loyalty rewarded.`, `fax:SOLDIERS BACK BRANNIGAN'S KANDAHAR ACCOUNT`,
   `Forty miles away?? He was NOT THERE?? I am a veteran. Stolen valor is the lowest thing a man can do.`, `The records say he was forty miles away. {last} vouched for a fake war hero. Brutal.`, `max:ARMY RECORDS CONTRADICT BRANNIGAN'S WAR STORY`],
  [`Release the records. Smart. Let the facts decide. And they did!!`, `Checked the receipts before defending him. The adults are in charge.`, `fax:BRANNIGAN RECORD SUPPORTS SERVICE CLAIMS`,
   `The record does not say if he was there or not. Hmm. Now I do not know what to believe.`, `The records are "unclear." Every speech gets fact-checked now. Death by footnotes.`, `max:BRANNIGAN RECORDS LEAVE KANDAHAR QUESTIONS`],
  [`A DEMOCRAT?? He is a registered Republican!! He showed his card!! Embarrassing.`, `Called the sergeant a Democrat. He had his voter card ready. Owned.`, `max:SERGEANT IS A REGISTERED REPUBLICAN, CONTRARY TO {LAST} CLAIM`],
  [`Dropped him before the facts came out?? Not fair to Brannigan. But Ellender is a good woman.`, `Ditched the Ranger before the facts. Loyalty is dead in Cimarron.`, `fax:{LAST} DROPS BRANNIGAN, NAMES ELLENDER`],
]);
rx('pryce_chamber', [
  [`A jobs ad. Fine. But the Chamber paid for it. Everybody can see that.`, `The Chamber paid for an ad defending the Chamber ticket. Self-parody.`, `max:CHAMBER-FUNDED AD DEFENDS {LAST}-PRYCE TICKET`],
  [`Pryce is out and that young Voss is in?? Big change. I hope he is ready.`, `Pryce out, Voss in. The ticket just went from Chamber to Substack. We are so back.`, `max:{LAST} NAMES VOSS AFTER PRYCE STEPS ASIDE`],
  [`Keep him raising money. Smart. He is good at that. Nobody likes him on TV anyway 😂`, `A running mate nobody sees. The money is good. The vibes are not.`, `fax:PRYCE MOVES OFF TRAIL TO FOCUS ON FUNDRAISING`],
  [`Pryce went on Dunmore's show and held his own!! I did not expect that. Impressive.`, `The establishment guy on Dunmore's show and he was funny. Respect where it is due.`, `fax:PRYCE HOLDS HIS OWN ON DUNMORE'S PODCAST`,
   `Two hours of Dunmore reading lobbying reports. Pryce looked terrible. Who thought this was a good idea?`, `Dunmore read the lobbying reports for two hours. Pryce got cooked alive.`, `max:DUNMORE GRILLS PRYCE OVER LOBBYING PAST`],
]);
rx('hale_money', [
  [`Apologized to Dr. Hale. By name. That took courage. Good for {last} 👏`, `Apologized to the donor's wife. The Chamber is pleased. Nobody else cares.`, `fax:{LAST} APOLOGIZES PUBLICLY TO DR. PRIYA HALE`],
  [`Calling Richard Hale bitter? He has a point though. His wife was treated badly.`, `Two rich guys fighting on TV. Grab the popcorn.`, `max:{LAST} ADS CALL HALE "A BITTER DONOR"`],
  [`A private meeting. They pulled the ads. Good. Handle it like adults.`, `Talked the Hales down. Quiet diplomacy. It worked.`, `fax:HALE SUPER PAC PULLS ADS AFTER MEETING`,
   `He RECORDED the meeting?? And put it in an ad?? That is low. But {last} walked into it.`, `Hale recorded the meeting. {last} got played like a fiddle.`, `max:HALE PAC AD USES SECRET RECORDING OF {LAST}`],
]);
rx('oppo_revenge', [
  [`900 pages and nothing illegal. {last} is clean. Told my whole church!!`, `Released everything and it was boring. Transparency as a weapon.`, `fax:LEDGER: {LAST} LAND DEAL LEGAL, IF GENEROUS`,
   `"Thanks for everything." From a CONTRACTOR. That does not look good at all.`, `"Thanks for everything." Four words that end campaigns.`, `max:CONTRACTOR EMAIL THANKS {LAST} "FOR EVERYTHING"`],
  [`Two Republicans calling each other crooks on my TV every night. I am sick of it.`, `Mutual assured destruction. Both of them are dropping. Whoever is third says thanks.`, `max:{LAST}, DUNMORE TRADE CORRUPTION ATTACKS`],
  [`A truce. Finally some sense. Dunmore said no of course.`, `Asked for a truce. Dunmore laughed. Fair enough.`, `fax:{LAST} CALLS FOR END TO NEGATIVE ADS`],
]);
rx('superintendents', [
  [`Rent your home from the government. That is TRUE. But our school cannot close either.`, `Holding firm on property tax abolition. The school boards can cope.`, `max:{LAST} HOLDS FIRM AS 40 SCHOOL BOARDS OBJECT`],
  [`Ten years. That is reasonable. The schools stay open. Good.`, `Ten-year phase-out. They will never actually do it. Nothing ever happens.`, `fax:{LAST} WILL PHASE OUT PROPERTY TAX OVER 10 YEARS`],
  [`No tax on my HOUSE!! Wonderful. My cousin with the farm is not happy though.`, `Homes exempt, farms pay. Suburbs over farmers. Interesting choice.`, `fax:{LAST} EXEMPTS HOMES FROM PROPERTY TAX`],
]);
rx('dove_rally', [
  [`$7 diesel is REAL. The President should hear that. Said with respect. Good answer.`, `Respectful, firm, and about diesel. Farmers loved it.`, `fax:{LAST} ANSWERS PRESIDENT: "CIMARRON IS PAYING $7 FOR DIESEL"`],
  [`"He has changed"?? About the PRESIDENT?? I cannot believe what I am hearing.`, `Told the President to his face that HE is the one who changed. Most based sentence of the cycle. Screenshot it.`, `max:{LAST} FIRES BACK AT PRESIDENT: "HE HAS CHANGED"`],
  [`Praise the troops. Always. Hope the President calls back.`, `Blinked. The New Right noticed.`, `fax:{LAST} PRAISES TROOPS, SEEKS MEETING WITH PRESIDENT`],
]);
rx('hawk_diesel', [
  [`Diesel tax suspended!! My cousin can finish the harvest now. Thank you!! 🚜`, `A tax holiday for tractors. Populist and practical.`, `fax:{LAST} SUSPENDS DIESEL TAX THROUGH HARVEST`],
  [`Sacrifice?? The farmers ARE sacrificing. They cannot afford the diesel.`, `Told the farmers to sacrifice. From the Governor's mansion. Bold.`, `max:{LAST} TO FARMERS: "VICTORY TAKES SACRIFICE"`],
  [`The President released the reserve and thanked {last} by name!! Teamwork 🇺🇸`, `Got the SPR released. The loyalty paid off.`, `fax:PRESIDENT RELEASES OIL RESERVE AFTER {LAST} REQUEST`,
   `"For real emergencies." $7 diesel IS a real emergency!! Tell that to the farmers.`, `Asked for the reserve, got told no. The farmers noticed.`, `max:WHITE HOUSE REJECTS {LAST}'S RESERVE REQUEST`],
]);
rx('indict_plea', [
  [`Four thousand emails and nothing bad. Told you {last} was honest!!`, `Released everything and it was boring. Nothing to see. Rare W.`, `fax:{LAST} EMAILS SHOW NOTHING IMPROPER`,
   `"You know why"?? What does that mean?? Not good. Not good at all.`, `"Make sure Garrison gets the Route 9 job. You know why." Screenshotted forever.`, `max:{LAST} EMAIL: "YOU KNOW WHY"`],
  [`A pardon?? Before the trial?? That sounds like telling him to keep quiet.`, `Floating a pardon for the witness. Loyalty or tampering. Both.`, `max:{LAST} FLOATS PARDON FOR INDICTED EX-AIDE`],
  [`The Attorney General IS Dunmore's friend. Everybody knows it. Good point.`, `The AG is Dunmore's guy. Correct attack. Did not answer the question.`, `max:{LAST} CALLS ATTORNEY GENERAL A DUNMORE ALLY`],
  [`No comment on an active case. That is what a lawyer would say. OK.`, `No comment. Every news channel will fill the silence.`, `fax:{LAST} SILENT ON TOLLIVER PLEA DEAL`],
]);
rx('indict_testimony', [
  [`Under OATH. Three hours. Calm. That is an honest person. {last} has nothing to hide!!`, `Testified and won. The judge did not refer {last}. Tolliver is toast.`, `fax:{LAST} TESTIFIES; JUDGE DECLINES REFERRAL`,
   `"Official 1"?? The court is calling {last} "Official 1"?? This is bad.`, `Official 1. They always give you a number right before the end.`, `max:COURT RECORD NAMES {LAST} "OFFICIAL 1"`],
  [`He WOULD say anything to stay out of prison. True. But twenty years together...`, `"He will say anything." True of everyone in the capital.`, `max:{LAST} CALLS TOLLIVER A LIAR`],
  [`Taking back the pardon talk. Good. Should never have said it.`, `Withdrew the pardon. Late, but smart.`, `fax:{LAST} WITHDRAWS PARDON TALK FOR TOLLIVER`],
  [`Again with the pardon?? The prosecutors are writing it all down, {last}!!`, `Doubled down on the pardon. Loyalty to the end. Also, possibly obstruction.`, `max:{LAST} REPEATS PARDON OFFER; PROSECUTORS TAKE NOTE`],
]);
rx('indict_verdict', [
  [`Tolliver stabbed {last} in the back. Justice was served. Case closed. Move on.`, `Threw the old friend under the bus. Standard.`, `fax:{LAST}: TOLLIVER "BETRAYED MY TRUST"`],
  [`An inspector general for every contract. Good government. That is conservative too!!`, `Ethics reform. Now we have an inspector general. Great. More bureaucrats.`, `fax:{LAST} ANNOUNCES STATE CONTRACT INSPECTOR GENERAL`],
  [`Political prosecution? Maybe. But he pleaded GUILTY. Hard to argue with that.`, `Called it political. Demanded the AG resign. Never back down.`, `max:{LAST} CALLS TOLLIVER CASE "POLITICAL," DEMANDS AG RESIGN`],
  [`PARDONED him?? The SAME DAY?? That looks terrible. Even I can see it.`, `Pardoned him on the spot. A promise kept. Loyalty over everything.`, `max:{LAST} PARDONS CONVICTED FORMER CHIEF OF STAFF`],
]);
rx('coburn_dui', [
  [`One law for everybody. Even football heroes. Good question to ask!!`, `The county attorney was a family friend. Celebrity justice exposed.`, `max:WHO DROPPED COBURN'S DUI CASE?`],
  [`Nothing to say. OK. Everybody makes mistakes.`, `Stayed quiet about the DUI. Coburn is untouchable.`, `fax:{LAST} SILENT ON COBURN ARREST VIDEO`],
  [`Classy. Defend the man and talk about ideas. That is how you do it 👏`, `Defended Coburn, then asked about his plans. He has none. Galaxy brain.`, `fax:{LAST} DEFENDS COBURN, ASKS ABOUT HIS PLANS`],
  [`Coburn did not know the state budget?? A QUARTERBACK does not know the budget!! Ha!!`, `He agreed to debate and got destroyed on policy. Ball don't lie.`, `fax:COBURN STRUGGLES ON POLICY IN DEBATE WITH {LAST}`,
   `He said no to the debate and 12,000 people came to his rally. That is a lot of people.`, `Coburn skipped the debate and drew 12,000. Celebrity beats policy. Always.`, `max:COBURN DECLINES DEBATE, DRAWS 12,000 AT RALLY`],
]);
rx('albright_measles', [
  [`Two BABIES in the hospital. Somebody should say it. Good for {last}.`, `Blaming the MAHA doctor for measles. Big Pharma is pleased.`, `max:{LAST} BLAMES ALBRIGHT FOR SUMNER MEASLES OUTBREAK`],
  [`Free clinics, nobody forced. That is how you do it. I got my shot at the church hall when I was a kid.`, `"Voluntary" clinics. The trap is voluntary until it is not.`, `fax:{LAST} OPENS FREE, VOLUNTARY VACCINE CLINICS`],
  [`Parents' choice. But there are sick BABIES. Keep your kids home at least.`, `Parental choice, even during an outbreak. Consistent. Albright gains.`, `max:{LAST} DEFENDS PARENTAL CHOICE AMID MEASLES OUTBREAK`],
]);
rx('pike_stream', [
  [`Hatred of the Jewish people is NOT who we are. Thank you {last}. My church stands with Israel 🇺🇸🇮🇱`, `Condemned Pike by name. The chat is not happy. Neither am I.`, `fax:{LAST} CONDEMNS PIKE'S "ANTISEMITISM"`],
  [`"All forms of bigotry." OK. But say his name, {last}.`, `Could not even name him. Pike laughed on stream.`, `max:{LAST} CONDEMNS "ALL BIGOTRY" WITHOUT NAMING PIKE`],
  [`No comment on a streamer? It was on EVERY channel. It is a big deal.`, `Refused to condemn. Pike thanked {last} on air. Noted.`, `max:{LAST} DECLINES TO COMMENT ON PIKE REMARKS`],
  [`{last} went on his show and beat him!! He ended the stream early 😂`, `Walked into Pike's stream and won. Nobody expected it. Respect.`, `fax:PIKE ENDS STREAM EARLY AFTER {LAST} DEBATE`,
   `Two hours on that man's show and just NODDING?? What was {last} doing??`, `Two hours of nodding along on Pike's stream. The clip is everywhere.`, `max:{LAST} NODS ALONG ON PIKE'S STREAM`],
]);
rx('frontrunner', [
  [`Knock out number two. Then it is over. Good strategy.`, `Hit second place. Make it a two-person race you win. Correct.`, `max:{LAST} TARGETS SECOND PLACE RIVAL`],
  [`Get out the vote!! Do not get cocky. My dad always said that.`, `Turnout while ahead. Boring. Smart.`, `fax:FRONT-RUNNER {LAST} DOUBLES FIELD STAFF`],
  [`Staying positive. I like that. Above the fighting 👍`, `Stayed positive under a joint attack. The ads keep running.`, `fax:{LAST} STAYS POSITIVE DESPITE "ANYBODY BUT" ADS`],
]);
rx('cash_crunch', [
  [`Putting in own money. That is skin in the game. Respect.`, `Self-funding a million. Vaskel-lite.`, `fax:{LAST} LENDS CAMPAIGN $1 MILLION`],
  [`I gave $25!! Somebody is trying to rig this thing. Everybody chip in!! 🇺🇸`, `The fear email raised a million. Boomers and their credit cards. Undefeated.`, `max:{LAST} FUNDRAISING EMAIL RAISES $1M`,
   `The email only raised $300,000? And the paper says it was fear-mongering. Hmm.`, `"They are stealing the primary" raised $300K and a Ledger story. Flop.`, `max:LEDGER: {LAST} "FUNDRAISING BY FEAR"`],
  [`Crypto money?? From those internet people?? I do not trust it.`, `Crypto PAC money. Number go up. Bills to be signed later.`, `max:CRYPTO PAC GIVES $1.5M TO {LAST}`],
  [`Laying off the field staff?? Nobody is calling the volunteers now. Bad sign.`, `Cut the field staff. The campaign is on life support.`, `fax:{LAST} CAMPAIGN CUTS FIELD STAFF IN HALF`],
]);
rx('rino_censure', [
  [`Signed the pledge. Good. Now the county party is happy.`, `Censured into compliance. The base has power. Good.`, `max:{LAST} SIGNS COUNTY PARTY PLEDGE AFTER CENSURE`],
  [`The Osgood committee is 47 people. The state is three million. Well said. I agree actually.`, `Defied the county party. Two more censures incoming. Deserved.`, `fax:{LAST} DEFENDS RECORD AFTER OSGOOD CENSURE`],
  [`Just ignore it? OK. Osgood is Osgood.`, `Ignored the censure. The Osgood GOP will never forget.`, `fax:{LAST} IGNORES OSGOOD GOP CENSURE`],
]);
rx('white_house_trip', [
  [`On Air Force One with the President!! I saw {last} on TV every night. So proud 🇺🇸✈️`, `Four nights on the President's stage. National figure now.`, `fax:{LAST} JOINS PRESIDENT ON FOUR-STATE RALLY TOUR`],
  [`"Hired to be here." Good. Cimarron first. But the President will not be happy.`, `Turned down Air Force One. The White House scheduler has deleted the number.`, `max:{LAST} DECLINES WHITE HOUSE RALLY TOUR`],
  [`One night. Smart. Get the picture and come home 😊`, `One night on the tour. Enough for a clip. Not enough for a friendship.`, `fax:{LAST} JOINS PRESIDENT FOR ONE RALLY`],
]);
rx('dropout_talk', [
  [`Back to the basics. Border. That is what we care about!!`, `Border, uniparty, fight. The only path from third. Go.`, `max:{LAST} RELAUNCHES CAMPAIGN ON BORDER, "UNIPARTY"`],
  [`Churches, farms and retirees. That is ME!! Finally somebody is talking to us.`, `Chasing the boomers from third place. Slow and sad.`, `fax:{LAST} TARGETS CHURCHES, FARMS, RETIREES`],
  [`Own money on the line. Not quitting. I like the fight 💪`, `Loaned a million to kill the drop-out rumors. Expensive cope.`, `fax:{LAST} LOANS CAMPAIGN $1M, ENDS DROPOUT RUMORS`],
]);
rx('feud_jet', [
  [`Stay out of it. Good. Those two are embarrassing themselves.`, `Watched two rivals destroy each other. The chess move.`, `fax:{LAST} STAYS OUT OF DUNMORE-RICK FEUD`],
  [`You do not mock a man of God over his airplane. Thank you {last}.`, `Defended Rick's jet. The pastors are grateful. Dunmore is not.`, `fax:{LAST} DEFENDS RICK AGAINST DUNMORE'S JET ATTACK`],
  [`Jesus rode a donkey!! HA. But maybe do not say that about a pastor.`, `Agreed with Dunmore on the jet. Rick is being dogpiled. Good.`, `max:{LAST} JOINS DUNMORE IN MOCKING RICK'S JET`],
  [`$4 million for a jet. From the church offering plate. Wow.`, `Leaked the invoices through Dunmore. Both rivals bleeding. 4D chess.`, `max:DUNMORE READS RICK JET INVOICES ON AIR`,
   `{last} leaked the invoices?? Using somebody else to do the dirty work. That is cowardly.`, `Got caught leaking through Dunmore. "A coward who uses other men's mouths." Brutal.`, `max:LEDGER: {LAST} CAMP LEAKED RICK JET INVOICES`],
]);
rx('feud_sunday', [
  [`Honor the Sabbath. My father closed his store every Sunday. Good tradition 🙏`, `Sabbath laws. Blue laws are back. Trad win.`, `fax:{LAST} BACKS RICK ON SUNDAY CLOSING`],
  [`Keep the stores open. But do not insult believers. Fair.`, `Sided with Vaskel's policy. Rick says you stand with the scoffer.`, `fax:{LAST} OPPOSES SUNDAY CLOSING, REBUKES VASKEL'S WORDS`],
  [`Both of them went too far. {last} is the adult here 👍`, `Both rivals look extreme. {last} looks boring. Strategy.`, `fax:{LAST} REJECTS BOTH RICK AND VASKEL IN SUNDAY FIGHT`],
]);
rx('feud_water', [
  [`The water belongs to the farmers. Stand with them!! 🌾💧`, `Water for farms, not server farms. Blood and soil and irrigation.`, `fax:{LAST} HALTS DATA CENTER WATER PERMITS`],
  [`Jobs are good. But 3 BILLION gallons?? For computers?? My cousin's well is already low.`, `Sided with Big Tech's water grab. The Panhandle will not forget.`, `max:{LAST} APPROVES VASKEL WATER PERMITS`],
  [`Farms first, then the courts. Sounds fair to me.`, `A lawyer's answer. Farms first on paper. Fine.`, `fax:{LAST} PROPOSES WATER LAW GIVING FARMS PRIORITY`],
]);
rx('feud_streamers', [
  [`"Adults in charge." EXACTLY what I have been saying for years!!`, `Called both of them children. Boomer energy. It will work on boomers.`, `fax:{LAST}: "CIMARRON NEEDS ADULTS IN CHARGE"`],
  [`Siding with the streamer?? The young man with the video games?? Hmm.`, `Sided with Pike. The zoomers noticed. Dunmore is coping.`, `max:{LAST} SIDES WITH PIKE AGAINST DUNMORE`],
  [`That kid plays video games for money. Right. Get a job, young man.`, `Sided with the podcast boomer. Pike's chat is spamming L.`, `max:{LAST} BACKS DUNMORE AGAINST "STREAMER WITH NO RECORD"`],
]);
rx('mideast_war', [
  [`They killed 14 of our boys. We finish this. God bless our troops 🇺🇸🪖`, `Full hawk. Hope the neocons send a thank-you card.`, `fax:{LAST} STANDS WITH PRESIDENT ON WAR`],
  [`Support the troops, no ground war. That is what I want too. No more Iraqs.`, `Support the troops, oppose the war. The fence is comfortable.`, `fax:{LAST}: SHORT CAMPAIGN, NO GROUND WAR`],
  [`Oppose the war?? While our troops are fighting?? My grandson is in the Army!!`, `No more forever wars. {last} remembered what we voted for.`, `max:{LAST} OPPOSES PRESIDENT'S WAR`],
  [`Gas tax suspended!! Saved $10 filling up my truck today. Thank you!!`, `Talked about gas prices, not the war. Normie-brained but effective.`, `fax:{LAST} SUSPENDS STATE GAS TAX FOR 90 DAYS`],
]);
rx('oil_shock', [
  [`Do not waver. We are in it now. But $6.80 gas is killing us.`, `Loyal to the war to the end. The farmers are furious.`, `fax:{LAST} STAYS LOYAL AS OIL SHOCK DEEPENS`],
  [`A ceasefire. Maybe it is time. Six weeks is long enough.`, `Ceasefire from a Republican governor. The New Right is winning the argument.`, `max:{LAST} CALLS FOR CEASEFIRE`],
  [`The generals always mess it up. The President is doing his best.`, `Blame the generals. Criticize the war without criticizing the man. Smooth.`, `fax:{LAST} BLAMES PENTAGON FOR WAR TROUBLES`],
  [`Fuel help for farmers and seniors. I am a senior!! Thank you {last} ⛽`, `Emergency fuel aid. Big government for the oil shock. Liberty Caucus is crying.`, `fax:{LAST} ANNOUNCES EMERGENCY FUEL AID`],
]);

// ---------------- RUNOFF ----------------
rx('r_turnout', [
  [`A million dollars to knock on doors. That is how you win a runoff. My neighbor got a knock yesterday!!`, `Spent the last million on turnout. Boring. Correct.`, `fax:{LAST} LAUNCHES $1M RUNOFF TURNOUT DRIVE`],
  [`Church rides to the polls!! My church is doing it. We will be there 🙏🚐`, `Church vans to the polls. The evangelical machine, activated.`, `fax:{LAST} ORGANIZES CHURCH RIDES TO RUNOFF POLLS`],
  [`Text messages to young people. OK. Will they actually vote though?`, `Texting zoomers to vote in August. Bold assumption.`, `max:{LAST} TEXTS YOUNG VOTERS AHEAD OF RUNOFF`],
  [`Trust the voters. Hmm. In August? Everybody is on vacation.`, `No turnout plan. "Trust your voters." Your voters are at the lake.`, `max:{LAST} SKIPS RUNOFF TURNOUT PUSH`],
]);
rx('r_attack', [
  [`Hit back!! Do not let them get away with it 💪`, `Hit back at {rival}'s weak spot. The runoff is a knife fight.`, `max:{LAST} FIRES BACK WITH RUNOFF ATTACK AD`],
  [`Four years of results. That is the best answer to any attack.`, `Answered an attack with a record. Boomer strategy. It might work on boomers.`, `fax:{LAST} ANSWERS ATTACK WITH RECORD`],
  [`Ignore it?? Three weeks left!! Fight back!!`, `Ignored the final attack ad. Nothing like losing on purpose.`, `max:{LAST} LETS FINAL ATTACK AD GO UNANSWERED`],
]);
rx('r_president', [
  [`The President endorsed {last}!! In the runoff!! Now we have to win this 🇺🇸🇺🇸`, `Asked for the endorsement and got it. The kingmaker has spoken.`, `fax:PRESIDENT ENDORSES {LAST} IN RUNOFF`,
   `Asked the President and he picked the OTHER one?? Ouch. That hurts.`, `Asked the President for help and he endorsed the rival. Brutal.`, `max:PRESIDENT BACKS {LAST}'S RUNOFF RIVAL`],
  [`Stay quiet and hope. OK. Maybe he stays out.`, `Hoping the President stays out. Hope is not a plan.`, `fax:{LAST} STAYS QUIET ON PRESIDENT'S RUNOFF ROLE`],
]);
rx('r_rival_pres', [
  [`Support the President AND have a better record. Both true!! 👍`, `"100% with the President, just better." The only answer that works.`, `fax:{LAST}: "I SUPPORT THE PRESIDENT 100%"`],
  [`"Cimarron decides for itself." I agree, but you cannot fight the President in a runoff!!`, `Told the President to stay out of Cimarron. Unbelievable courage. Or suicide.`, `max:{LAST} CRITICIZES PRESIDENT'S RUNOFF ENDORSEMENT`],
  [`Local issues. Roads, schools, water. What actually matters to us.`, `Changed the subject to potholes. Did not work for anyone, ever.`, `fax:{LAST} FOCUSES ON LOCAL ISSUES AFTER TELE-RALLY`],
]);
rx('r_debate', [
  [`Already DONE it. Not just talk. That line won the debate for me 👏`, `"I already did what my opponent talks about." Good line. Boomers loved it.`, `fax:{LAST}: "I HAVE ALREADY DONE IT"`],
  [`Went right at {rival}. Tough. Maybe too tough?`, `Went for the throat on live TV. The runoff is personal.`, `max:{LAST} ATTACKS {RIVAL} HEAD-ON IN RUNOFF DEBATE`],
  [`Room for everybody. That is how you bring the party together. Smart!!`, `Spoke to the losers' voters. Coalition math. Clever.`, `fax:{LAST} COURTS VOTERS OF ELIMINATED CANDIDATES`],
  [`"Every Cimarronian." In a RUNOFF?? Talking like it is November already.`, `General election message in a runoff. Conservative Inc. cannot help itself.`, `max:{LAST} PIVOTS TO "EVERY CIMARRONIAN"`],
]);
rx('r_early_vote', [
  [`Call every supporter. That is how you get people out 📞`, `Last money into turnout. Correct.`, `fax:{LAST} POURS LAST FUNDS INTO TURNOUT`],
  [`One last TV ad. I saw it during the news!! Good ad.`, `One last ad for the boomers watching the 6 o'clock news.`, `fax:{LAST} RUNS FINAL STATEWIDE AD`],
  [`Saving money for November?? You have to WIN first!!`, `Saving money for a general election {last} might not reach. Galaxy brain.`, `max:{LAST} HOLDS MONEY FOR GENERAL ELECTION`],
]);
rx('court_dunmore', [
  [`Dunmore as Border Director?? With his own budget?? Hmm. He will be on TV every day.`, `Dunmore gets a department. The movement just captured a piece of the state.`, `max:{LAST} OFFERS DUNMORE BORDER ENFORCEMENT POST`],
  [`Hand counts everywhere. The clerks will complain but it is worth it.`, `Adopted the hand-count plan. The movement's price is paid.`, `fax:{LAST} ADOPTS DUNMORE HAND-COUNT PLAN`],
  [`Three hours on Dunmore's show!! I listened to the whole thing. Pretty good actually.`, `Three hours on the podcast. His audience met {last} for the first time.`, `fax:{LAST} SPENDS THREE HOURS ON DUNMORE PODCAST`],
  [`Talk to the voters, not to Dunmore. Right. The voters are what matter.`, `Skipped the kingmaker. Talked to his voters directly. They do not listen to anyone but him.`, `fax:{LAST} APPEALS DIRECTLY TO DUNMORE VOTERS`],
  [`Not for sale. I like that. No deals.`, `Refused to court Dunmore. His voters will remember who asked.`, `max:{LAST} REFUSES TO COURT DUNMORE`],
]);
rx('court_rick', [
  [`Close the stores on Sunday!! Like the old days. My grandfather would be happy 🙏`, `Blue laws for an endorsement. The Chamber is screaming. Worth it.`, `max:{LAST} PLEDGES SUNDAY CLOSING LAW FOR RICK'S SUPPORT`],
  [`A whole state office just for families and faith. Beautiful. Families need support.`, `A new state office run by Rick's church. Theocracy speedrun, any%.`, `fax:{LAST} CREATES OFFICE OF FAITH AND FAMILY`],
  [`Asked for prayers. That is humble. I like that.`, `Asked for prayers, promised nothing. Pastors are not that easy.`, `fax:{LAST} ASKS RICK FOR PRAYERS AND ENDORSEMENT`],
  [`Let the pastors decide. Respectful.`, `Stayed away from the pastor. The church vans may stay home.`, `fax:{LAST} STAYS AWAY FROM PASTOR RICK`],
]);
rx('court_krantz', [
  [`Sheriffs above the state?? I like Krantz, but the Governor is the Governor.`, `A constitutional amendment for sheriff supremacy. Posse Comitatus is back.`, `max:{LAST} BACKS SHERIFF SUPREMACY AMENDMENT FOR KRANTZ`],
  [`End the jail investigation?? A man DIED there. That does not sit right with me.`, `Dropped the jail probe for an endorsement. Cold. Effective.`, `max:{LAST} ENDS HARLAN JAIL PROBE`],
  [`Federal land back to the state. YES. Washington owns too much of the West!!`, `Federal land transfer. The Sagebrush Rebellion rides again.`, `fax:{LAST} PLEDGES FEDERAL LAND TRANSFER`],
  [`Rule of law over an endorsement. That is integrity. Respect.`, `Refused to trade with Krantz. The gun guys noticed.`, `fax:{LAST} REFUSES KRANTZ'S TERMS`],
]);
rx('court_vaskel', [
  [`The California billionaire gets his own city. For money. I do not like it.`, `Sold the charter city for $1.5 million. Silicon Valley has a colony now.`, `max:{LAST} APPROVES VASKEL CHARTER CITY EXEMPTIONS`],
  [`An Efficiency Commission. Cut the waste. OK. As long as he does not cut my Medicare.`, `Vaskel gets a DOGE of his own. Chainsaw time.`, `fax:VASKEL TO LEAD STATE EFFICIENCY COMMISSION`],
  [`His donors, not his name. Smart. Money without the baggage.`, `Took the donors, skipped the billionaire. Clever.`, `fax:VASKEL DONORS SHIFT TO {LAST}`],
  [`Rich men always want something back. RIGHT. Good for {last}.`, `Turned down the billionaire. Moral victory. Actual defeat, probably.`, `fax:{LAST} REJECTS VASKEL'S OFFER`],
]);
rx('court_whitlock', [
  [`Balanced budget and rural aid. That is how Reagan did it. I like it.`, `Promised Carol a balanced budget. The RINO wing just joined the campaign.`, `max:{LAST} ACCEPTS WHITLOCK'S BUDGET TERMS`],
  [`Fixing the water out west. Good. My cousin needs it.`, `Bipartisan water plan. The word "bipartisan" in a runoff. Wow.`, `fax:{LAST} PROMISES BIPARTISAN PANHANDLE WATER PLAN`],
  [`Take Carol's people and leave Carol. That is smart politics.`, `Wants Carol's voters, not Carol. Fair enough.`, `fax:{LAST} COURTS WHITLOCK VOTERS QUIETLY`],
  [`Stay away from Carol. Her endorsement is poison with the base. Right call.`, `Did not touch the Whitlock endorsement. Correct.`, `fax:{LAST} STAYS AWAY FROM WHITLOCK`],
]);
rx('court_coburn', [
  [`ZERO gas tax!! Coburn had one good idea and now {last} has it too ⛽`, `Adopted the quarterback's only policy. Gas tax zero. Populism wins.`, `fax:{LAST} ADOPTS COBURN'S ZERO GAS TAX PLAN`],
  [`Coburn as sports commissioner. Perfect job for him!! 🏈`, `Gave the QB a commission. He is happy. Everyone is happy.`, `fax:COBURN TO CHAIR STATE SPORTS COMMISSION`],
  [`A rally at the stadium with Jake Coburn!! I am going!! 🏈🇺🇸`, `Stadium rally with the Heisman winner. Peak Americana. Great optics.`, `fax:{LAST}, COBURN HOLD JOINT STADIUM RALLY`],
  [`Celebrities endorse the winner. True. We do not need him.`, `Skipped Coburn. The fans will follow the QB wherever he points.`, `max:{LAST} DOESN'T COURT COBURN`],
]);
rx('court_albright', [
  [`No shots even for NURSES?? In a HOSPITAL?? That does not make sense to me.`, `Ended all vaccine mandates. Albright's army is on board. The MAHA takeover is complete.`, `max:{LAST} ENDS ALL VACCINE MANDATES FOR ALBRIGHT'S SUPPORT`],
  [`Albright as Surgeon General?? She lost her hospital privileges!!`, `Dr. Albright as Surgeon General. The health-freedom movement has a ministry.`, `max:{LAST} TO APPOINT ALBRIGHT SURGEON GENERAL`],
  [`Review the medical board. OK. Doctors should not be punished for having opinions I guess.`, `A review of the medical board. Small win for medical freedom.`, `fax:{LAST} PROMISES MEDICAL BOARD REVIEW`],
  [`Her conditions ARE dangerous. Good for {last} for saying no.`, `Called Albright's conditions dangerous. Her voters stay home.`, `fax:{LAST} REJECTS ALBRIGHT'S CONDITIONS`],
]);
rx('court_pike', [
  [`No LEGAL immigration either?? My granddaughter's husband is from Ireland!! This is too much.`, `A full immigration moratorium. Pike got everything. The young right is united.`, `max:{LAST} AGREES TO PIKE'S IMMIGRATION MORATORIUM`],
  [`Going on that man's stream?? And criticizing the President's wars?? Not good.`, `On Pike's stream, anti-war. The zoomers are converting.`, `max:{LAST} JOINS PIKE STREAM, OPPOSES FOREIGN WARS`],
  [`Condemned him. Good. We do not need his kind of people.`, `Condemned Pike. His chat will stay home or vote for the rival out of spite.`, `fax:{LAST} CONDEMNS PIKE, REFUSES TO APPEAR`],
  [`Do not even say his name. Best way to deal with people like that.`, `Ignored Pike completely. His followers noticed.`, `fax:{LAST} IGNORES PIKE IN RUNOFF`],
]);

// ---------------- DEBATES ----------------
rx('d_prove', [
  [`No income tax!! Best thing that ever happened to my retirement 💵`, `Cut the income tax. The Liberty Caucus answer. Solid.`, `fax:DEBATE: {LAST} POINTS TO INCOME TAX REPEAL`],
  [`First in the NATION. Nobody else on that stage can say that!!`, `First state deportation program. Receipts, not promises.`, `max:DEBATE: {LAST} TOUTS STATE DEPORTATION PROGRAM`],
  [`The strongest abortion ban. That is a real achievement 🙏`, `The abortion ban. The pastors nodded. Rick frowned.`, `fax:DEBATE: {LAST} CITES ABORTION BAN`],
  [`Fighting every day. OK. But what did you DO?`, `"Fought the left every day." A vibe, not an achievement.`, `max:DEBATE: {LAST} "FOUGHT THE LEFT EVERY DAY"`],
]);
rx('d_bible', [
  [`God's law first. Amen 🙏`, `Scripture as the law of the land, from the Governor. Rick has competition.`, `max:DEBATE: {LAST} BACKS "GOD'S LAW" IN STATE LAW`],
  [`Good question for Rick. Which laws? Who decides? He did not really answer.`, `Asked Rick which laws. He froze. Clinical.`, `fax:DEBATE: {LAST} PRESSES RICK ON "BIBLICAL LAW"`],
  [`Our founders were believers AND they wrote the Constitution. PERFECT answer 📜🙏`, `Constitution first, men of faith. Threading the needle.`, `fax:DEBATE: {LAST}: CONSTITUTION FIRST`],
  [`Bringing up the church money on stage? Kind of low. True though.`, `Hit Rick's finances in front of his flock. The crowd gasped.`, `max:DEBATE: {LAST} HITS RICK'S CHURCH FINANCES`],
]);
rx('d_carpet', [
  [`Vaskel came for OUR tax cut. HA. Great comeback!!`, `"He moved here for my tax cut." Took credit for the carpetbagger. Funny.`, `fax:DEBATE: {LAST}: VASKEL MOVED HERE FOR MY TAX CUT`],
  [`"Cimarron is not for sale." Put it on a bumper sticker!! 🇺🇸`, `"Not a startup, not for sale." Best line of the night.`, `fax:DEBATE: {LAST}: "CIMARRON IS NOT FOR SALE"`],
  [`Welcoming the California guy? He called {last} a career politician!! Fight back!!`, `Welcomed Vaskel. Politely lost the exchange.`, `max:DEBATE: {LAST} WELCOMES VASKEL "LIKE ANY AMERICAN"`],
  [`Ten years giving money to California DEMOCRATS. That says everything.`, `The Democrat donations on live TV. Vaskel had no answer.`, `max:DEBATE: {LAST} HITS VASKEL'S DEMOCRAT DONATIONS`],
]);
rx('d_arrest', [
  [`A sheriff who picks and chooses cannot be Governor. That makes sense.`, `Said Krantz is unfit because he picks laws. The gun guys are mad.`, `fax:DEBATE: {LAST}: KRANTZ "SHOULD NOT BE GOVERNOR"`],
  [`Nice to Krantz but still said no. Fair. Respectful too.`, `"Good sheriff, not a governor." The polite kill.`, `fax:DEBATE: {LAST}: KRANTZ "NOT READY"`],
  [`Stand up to the feds. Yes. Krantz does that. Respect.`, `Complimented Krantz on stage. The sheriff smiled.`, `max:DEBATE: {LAST} PRAISES SHERIFFS WHO RESIST FEDS`],
  [`Made Krantz pick which law he hates. HA. Krantz did not know what to say!!`, `Asked Krantz which law he opposed. He could not pick one. Checkmate.`, `fax:DEBATE: {LAST} CORNERS KRANTZ ON UNENFORCED LAWS`],
]);
rx('d_chamber', [
  [`The Chamber FOUGHT the deportations. So {last} is not their puppet. Good point!!`, `"The Chamber fought me." Nice reversal. Dunmore had no answer.`, `max:DEBATE: {LAST}: "THE CHAMBER FOUGHT MY DEPORTATION PROGRAM"`],
  [`Microphone versus actual work. Ha!! Good one.`, `Podcast versus governing. A classic boomer burn, and it landed.`, `fax:DEBATE: {LAST} MOCKS DUNMORE'S "FOUR YEARS ON A PODCAST"`],
  [`Proud to work with business. OK. But Dunmore will make an ad out of that.`, `Bragged about loving business. Dunmore got his ad.`, `max:DEBATE: {LAST} EMBRACES BUSINESS "PARTNERSHIP"`],
  [`Dunmore's sponsor has ties to CHINA?? Wow. Dunmore looked shocked.`, `The China sponsor. Dunmore was not ready. Devastating.`, `max:DEBATE: {LAST} TIES DUNMORE SPONSOR TO CHINA`],
]);
rx('d_compromise', [
  [`No. Simple. Good answer 💪`, `"No." One word. Crowd went wild.`, `max:DEBATE: {LAST}'S ONE-WORD ANSWER: "NO"`],
  [`Not with THOSE Democrats. Exactly.`, `Principled no. Fine.`, `fax:DEBATE: {LAST} RULES OUT WORKING WITH DEMOCRATS`],
  [`Roads and water. OK. Everybody needs roads. But the crowd did not like it.`, `Would work with Democrats on roads. Whitlock nodded. That is bad.`, `max:DEBATE: {LAST} OPEN TO WORKING WITH DEMOCRATS`],
  [`Every deal we made, we lost something. So true. My whole life they compromised.`, `Anti-compromise maximalism on a debate stage. Put it on a flag.`, `max:DEBATE: {LAST}: "COMPROMISE IS HOW WE LOST"`],
]);
rx('d_accept', [
  [`Only if it is clean. Right. We have seen what they do.`, `Conditional acceptance. Keep your options open.`, `max:DEBATE: {LAST} WILL ACCEPT RESULT "IF THE ELECTION IS FAIR"`],
  [`Yes. Good. Simple. That is what a grownup says.`, `A simple yes. The establishment applauds. Weak.`, `fax:DEBATE: {LAST} WILL ACCEPT PRIMARY RESULT`],
  [`"I expect to win." Confidence!! I like it 😎`, `Dodged it with confidence. Very Trump.`, `max:DEBATE: {LAST}: "I EXPECT TO WIN"`],
  [`Accept it and support the nominee. That is how a party works.`, `Pledged to support the nominee. Party loyalty. Boring.`, `fax:DEBATE: {LAST} PLEDGES TO SUPPORT NOMINEE`],
]);
rx('d_democrat', [
  [`NOTHING. HA!! Best answer of the night 😂`, `"Nothing." Crowd loved it. Correct.`, `max:DEBATE: {LAST}: "NOTHING"`],
  [`The JFK Democrats. That was my dad's party. It is not that party anymore.`, `JFK nostalgia. Every boomer in the room teared up.`, `fax:DEBATE: {LAST} PRAISES "DEMOCRATS OF JFK'S TIME"`],
  [`They DO vote together. We should too. Good point.`, `Respect their discipline. A New Right talking point on stage. Nice.`, `fax:DEBATE: {LAST} PRAISES DEMOCRATS' "DISCIPLINE"`],
  [`Democrats love their country?? Some of them maybe. Not the ones in charge.`, `Said something nice about Democrats. That clip will be in every ad.`, `max:DEBATE: {LAST}: MANY DEMOCRATS "LOVE THEIR COUNTRY"`],
]);
rx('d_deport_num', [
  [`Every one of them. Employers will figure it out. They always do.`, `"Every person. Employers will adjust." The correct and complete answer.`, `max:DEBATE: {LAST}: DEPORT "EVERY PERSON" HERE ILLEGALLY`],
  [`More than all of them combined, because {last} ALREADY did it. Great line!!`, `Receipts on stage. Dunmore has only promises.`, `fax:DEBATE: {LAST}: "I HAVE ALREADY DONE IT"`],
  [`Criminals first. Reasonable. But the crowd wanted more.`, `"Criminals first." The Bush-era answer. Mid.`, `fax:DEBATE: {LAST}: CRIMINALS FIRST`],
  [`"Depends on federal cooperation"?? That is a politician's answer.`, `Blamed the feds for a number. Weakest answer of the night.`, `max:DEBATE: {LAST} WON'T GIVE DEPORTATION NUMBER`],
]);
rx('d_institutions', [
  [`Take them back. The universities, the media. They were ours once!!`, `"Take them back." The New Right platform, on a debate stage.`, `max:DEBATE: {LAST}: TAKE BACK THE INSTITUTIONS`],
  [`Defund them. Why pay for people who hate us?`, `Defund, not capture. The libertarian answer. Leaves power on the table.`, `fax:DEBATE: {LAST}: DEFUND THE INSTITUTIONS`],
  [`Reform the universities first. Yes. My granddaughter came home from college with crazy ideas.`, `Reform, starting with universities. The sensible version.`, `fax:DEBATE: {LAST} CALLS FOR UNIVERSITY REFORM`],
  [`"Government should be neutral." Hmm. It is not neutral now. It is against us.`, `"Neutrality." The principle that lost us every institution.`, `max:DEBATE: {LAST}: GOVERNMENT "SHOULD BE NEUTRAL"`],
]);
rx('d_tariffs', [
  [`The Chinese have been robbing us since I was working. Do not surrender now!! Stand with the President 🇺🇸`, `No surrender on tariffs. Loyal and correct.`, `fax:DEBATE: {LAST}: "WE WILL NOT SURRENDER" ON TARIFFS`],
  [`Tariffs AND help for farmers. That is the right answer. My cousin agrees.`, `Tariffs plus relief. Pay the farmers to support the tariff. Fine.`, `fax:DEBATE: {LAST} BACKS TARIFFS AND FARM RELIEF`],
  [`Called tariffs a tax?? Against the PRESIDENT'S tariffs?? On stage??`, `The free-trade answer in a MAGA debate. Brave. Doomed.`, `max:DEBATE: {LAST} CALLS TARIFFS "A TAX ON OUR OWN PEOPLE"`],
  [`Washington will make the farmers whole. I hope so. They promised last time too.`, `"Washington will pay." Passing the buck with loyalty.`, `fax:DEBATE: {LAST}: WASHINGTON WILL MAKE FARMERS WHOLE`],
]);

// Attack lines: 'attack:rival:lineIndex'.
rx('attack:dunmore', [
  [`Four years and NOTHING passed. All talk, no bills. Ha!! Got him.`, `Called Dunmore's whole career a podcast. Brutal. Dunmore looked at the floor.`, `max:DEBATE: {LAST}: "A PODCAST IS NOT A RECORD"`],
  [`Hats made in VIETNAM?? Is that true?? My hat says America First. I need to check the tag.`, `The Vietnam hats. Dunmore's merch table is in shambles.`, `max:DEBATE: {LAST}: DUNMORE HATS "MADE IN VIETNAM"`],
  [`He wants a promotion but never did his job. True. What DOES a Lieutenant Governor do anyway?`, `"He never wanted the job he has." Painful because it is true.`, `fax:DEBATE: {LAST}: DUNMORE "WANTS A PROMOTION"`],
]);
rx('attack:rick', [
  [`Small government preacher who took $2 million from the government. Hmm. That IS a problem.`, `Rick's PPP money on stage. The hypocrisy lands.`, `max:DEBATE: {LAST} HITS RICK OVER FEDERAL LOANS`],
  [`Jesus did not fly private. Oof. That will sting.`, `One sentence. Rick's jet is now a meme.`, `max:DEBATE: {LAST}: "A PRIVATE JET IS NOT A MINISTRY"`],
  [`A church is not a state. Three million people. Good point.`, `The "he has only run a church" attack. Effective with boomers.`, `fax:DEBATE: {LAST} QUESTIONS RICK'S EXPERIENCE`],
]);
rx('attack:krantz', [
  [`What happens when YOU disagree with him? That is scary actually. Good question.`, `Turned Krantz's nullification on the voters. Clever.`, `fax:DEBATE: {LAST} WARNS OF GOVERNOR KRANTZ`],
  [`A man died in his jail. He never explained it. That is serious.`, `Brought up the dead inmate. The room went quiet. Heavy.`, `max:DEBATE: {LAST} RAISES HARLAN JAIL DEATH`],
  [`One county is not a state. True. Harlan is small.`, `"Sheriff of one county." The scale attack. Clean.`, `fax:DEBATE: {LAST}: KRANTZ IS "SHERIFF OF ONE COUNTY"`],
]);
rx('attack:vaskel', [
  [`California Democrats AND he wants to run us like a startup. No thank you!!`, `Democrat donor who wants a startup state. Two hits in one.`, `max:DEBATE: {LAST} HITS VASKEL'S CALIFORNIA DONATIONS`],
  [`A fiefdom!! Great word. A kingdom for one rich man. Not in America.`, `"Not freedom, a fiefdom." Vaskel's Substack readers are crying.`, `fax:DEBATE: {LAST}: CHARTER CITY IS "A FIEFDOM"`],
  [`He could not name our biggest crop?? It is WHEAT. Everybody knows that!! 🌾`, `Vaskel does not know the biggest crop. Ratio'd by a farm fact.`, `max:DEBATE: {LAST}: VASKEL "COULD NOT NAME" STATE'S TOP CROP`],
]);
rx('attack:whitlock', [
  [`Carol stopped listening. True. She is stuck in 1985.`, `"Carol stopped listening." The party moved on. Brutal.`, `max:DEBATE: {LAST}: WHITLOCK "STOPPED LISTENING"`],
  [`Twenty years of voting yes on spending. That is Carol.`, `Her voting record read aloud. The last moderate is finished.`, `fax:DEBATE: {LAST} HITS WHITLOCK'S SPENDING RECORD`],
]);
rx('attack:coburn', [
  [`Three out of ten primaries?? He did not even VOTE?? And he wants to be Governor??`, `"Voted in three of ten primaries." Jake's fans do not care. The boomers do.`, `max:DEBATE: {LAST}: COBURN SKIPPED 7 OF 10 PRIMARIES`],
  [`He does not know the size of the budget. Name recognition is not enough. True.`, `Ask Jake the budget. He does not know. Neither do his fans.`, `fax:DEBATE: {LAST}: COBURN DOESN'T KNOW STATE BUDGET`],
]);
rx('attack:albright', [
  [`No vaccines while kids have MEASLES. That is dangerous. Good point.`, `Measles attack on the MAHA doctor. Pharma-coded, but it landed.`, `max:DEBATE: {LAST} HITS ALBRIGHT OVER MEASLES`],
  [`She lost her hospital privileges. That is a big deal for a doctor.`, `Brought up her lost privileges. Her fans say it proves she was right.`, `fax:DEBATE: {LAST}: ALBRIGHT "LOST HER HOSPITAL PRIVILEGES"`],
]);
rx('attack:pike', [
  [`Never had a real job. Just a camera and a chair. Ha!!`, `Mocked Pike for never having a real job. Pike's chat is spamming L.`, `max:DEBATE: {LAST}: PIKE "NEVER HELD A JOB"`],
  [`"Ugly." Exactly. Thank you for saying it on stage. My pastor will be proud 🙏`, `Called Pike ugly in front of the pastors. The zoomers will not forget.`, `fax:DEBATE: {LAST}: PIKE'S RHETORIC IS "UGLY"`],
]);

// Closing statements.
REACTIONS['close:record:income'] = [`No income tax. Four more years to finish the job. SOLD 💵`, `Closed on the tax repeal. Effective. Boring.`, `fax:DEBATE CLOSE: {LAST} RUNS ON INCOME TAX REPEAL`];
REACTIONS['close:record:rifle'] = [`Made Cimarron a safe place for gun owners. Nobody did more. Correct!! 🇺🇸`, `Closed on guns. The Rifle Association clapped.`, `fax:DEBATE CLOSE: {LAST} RUNS ON GUN RIGHTS`];
REACTIONS['close:record:commandments'] = [`God back in the classroom and ready to fight for it. Amen 🙏📜`, `Closed on the Ten Commandments. The pastors are in tears.`, `fax:DEBATE CLOSE: {LAST} RUNS ON TEN COMMANDMENTS LAW`];
REACTIONS['close:record:heartland'] = [`Did not talk about it. DID it. 4,000. Best closing of the night!!`, `Talkers talk, {last} deports. The best close on the stage.`, `max:DEBATE CLOSE: {LAST}: "I DID THEM"`];
REACTIONS['close:record:dictionary'] = [`Parents in control of what kids read. Never give it back. YES.`, `Closed on the book law. Parents' rights moms are fired up.`, `fax:DEBATE CLOSE: {LAST} RUNS ON PARENTS' RIGHTS`];
REACTIONS['close:leading'] = [`Do not trade a proven fighter for a promise. Well said. Staying with {last}.`, `The front-runner's close. Confident. Boring. Winning.`, `fax:DEBATE CLOSE: FRONT-RUNNER {LAST} ASKS VOTERS TO STAY`];
REACTIONS['close:behind'] = [`The only poll that counts is on August 4!! That is right. Do not believe the polls!!`, `"The only poll that counts." Classic underdog close. Energy.`, `max:DEBATE CLOSE: {LAST}: "THE ONLY POLL THAT COUNTS"`];
REACTIONS['close:maga'] = [`The movement did not start with any of them. Fight for it. Love it 🇺🇸`, `A movement close. The base is fired up.`, `max:DEBATE CLOSE: {LAST} PLEDGES TO "FIGHT FOR THE MOVEMENT"`];
REACTIONS['close:faith'] = [`Asked for our prayers. This state belongs to God. Amen 🙏`, `The prayer close. Rick has real competition now.`, `fax:DEBATE CLOSE: {LAST} ASKS FOR "YOUR PRAYERS"`];
REACTIONS['close:guns'] = [`Our rights do not come from Washington!! They come from GOD!! 🇺🇸`, `The Second Amendment close. Gun owners are locked in.`, `fax:DEBATE CLOSE: {LAST}: "YOUR RIGHTS DO NOT COME FROM WASHINGTON"`];
REACTIONS['close:liberty'] = [`Every dollar they do not take is MINE. Good close!! 💵`, `The taxpayer close. The Liberty Caucus is happy.`, `fax:DEBATE CLOSE: {LAST} RUNS ON TAX FREEDOM`];
REACTIONS['close:online'] = [`Take back the institutions. OK. I do not totally understand but I am with {last}.`, `"The institutions were turned against us." The New Right close. We are so back.`, `max:DEBATE CLOSE: {LAST} VOWS TO TAKE BACK INSTITUTIONS`];
REACTIONS['close:farm'] = [`Standing with the people who FEED this country. My cousin will vote for {last} now 🌾🚜`, `A farm close. Wholesome. Effective in the Panhandle.`, `fax:DEBATE CLOSE: {LAST} STANDS WITH FARMERS`];
REACTIONS['close:chamber'] = [`Best state to build a business. OK. Good for the economy.`, `The Chamber close. Donors happy, base asleep.`, `max:DEBATE CLOSE: {LAST} PITCHES BUSINESS CLIMATE`];
REACTIONS['close:seniors'] = [`Protect our homes and savings. That is ME. Thank you {last}!! 🏡`, `A boomer close aimed directly at boomers. Will work.`, `fax:DEBATE CLOSE: {LAST} PLEDGES TO PROTECT SENIORS`];
REACTIONS['close:moderate'] = [`"Every Cimarronian, not only the loudest." Nice for November. Not what we wanted tonight.`, `A general-election close in a primary. Conservative Inc. cannot help itself.`, `max:DEBATE CLOSE: {LAST} PIVOTS TO GENERAL ELECTION`];
