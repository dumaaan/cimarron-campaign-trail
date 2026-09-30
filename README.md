# The Campaign Trail: Cimarron 2030

**Play it in your browser: https://dumaaan.github.io/cimarron-campaign-trail/**

It is 2030. Cimarron is one of the most conservative states in the country, and Democrats have not won a statewide race in twenty years. You are its Republican Governor. The general election does not matter. The Republican primary does.

Your challengers each speak for a different part of the modern right: the MAGA populist with a podcast, the Christian nationalist pastor, the constitutional sheriff, the tech billionaire, and the last traditional conservative. Each one says you have not gone far enough. In this primary, voters punish any sign of moderation.

A political strategy game in the style of *The Campaign Trail*.

## How a campaign works

- **Your record and your running mate.** Choose the achievement you will run on, and a running mate who brings one faction closer to you. Both can come back during the campaign: your record can be challenged, and your running mate can become a problem you must solve, or replace.
- **Six months on the trail.** Answer questions at town halls, on talk radio and in interviews. Handle scandals, crises and tragedies, with advice from staff who do not always agree. Some decisions are gambles.
- **Campaign stops.** Choose where to go and what to do there: rallies, ads, fundraisers, or a turnout operation.
- **Two debates.** Every candidate answers every question. When the race is close, you can go after the rival nearest to you.
- **Endorsements.** Gun groups, pastors, farmers, sheriffs, donors, and in the end, the President.
- **Primary night.** The regions report one by one. If nobody reaches 40%, the top two go to a runoff, and you will have three weeks to win over the candidates who were eliminated.
- **What comes after.** The general election, the winner's victory speech, the first 100 days, and the consequences of what you promised.

After every decision, the cable news chyrons and the posters online react.

## Tips

- **The President's endorsement is the biggest prize in the race.** The MAGA base unites behind his choice, and his candidate never drops out. He endorses you only if his opinion of you is very high (the status bar shows how close you are), and his circle will ask for favors that can cost you with other voters.
- **Watch the RINO label.** Moderate answers raise it, and it costs you with almost everyone.
- **Turnout decides primaries.** Older voters and evangelicals vote in large numbers. Young online activists are loud, but many of them stay home. Click **State Profile** to see who actually votes, and click any region on the map for its details.
- **Every promise counts.** What you promise on the trail becomes your first 100 days, if you win.
- **Know your rivals.** Click any candidate for their profile, positions and strongest factions.
- **Check the crosstabs.** The polling panel shows who leads each faction and each region.
- **Decisions come back.** A scandal you handled badly, a donor you lost or a promise you made can return weeks later. In some scenarios, a story runs across the whole campaign.
- **Your rivals fight each other too.** When two of them feud, you can take a side, stay out, or quietly make it worse.
- **Earlier decisions open new choices.** A green tag on a choice shows that your record, your running mate, an endorsement or an earlier decision made it available.
- **Runoff deals have a price.** An endorsement can win you one faction and cost you another.

## Difficulty

Choose a level on the title screen:

- **Easy:** voters forgive more, rivals grow more slowly, gambles work more often, and you start with more money.
- **Normal:** the primary as designed.
- **Hard:** voters remember every mistake, rivals gang up on the leader, gambles fail more often, and you start with less money.

The difficulty does not change the scenario or the field. The same seed gives the same situation at every level.

## Seeds

Every game has a seed number, shown when the campaign starts and at the end. Enter the same seed on the title screen to play the same situation again, or share it with a friend. Not every year looks the same: sometimes the field changes, and sometimes events outside Cimarron change the race.

## Run it on your own computer

You need Python 3 and a web browser.

```bash
./play.sh
```

This opens the game at http://localhost:8766. To use another port, run `./play.sh 9000`.

## Project layout

```
index.html        the game page (GitHub Pages serves it from the root)
play.sh, serve.py start a local server
css/style.css     all styles
js/content/       the game's data and text: factions, regions, candidates and scenarios (data.js),
                  questions, debates, events, runoff, epilogue, media personas and reactions
js/engine/        the rules: config and difficulty, game state, the vote model, the campaign
                  schedule, decisions, the trail, election night and the runoff, saving
js/ui/            the interface: components, screens, endings, profile windows, and app.js,
                  which starts the game
dev/              tests.html (model and content checks) and sim.html + sim.js (balance simulator)
```

The scripts are plain browser scripts that share one global scope, so their order matters: content first, then the engine, then the interface. The order is listed in `index.html`, `dev/tests.html` and `dev/sim.html`.

With the server running, open http://localhost:8766/dev/tests.html for the checks and http://localhost:8766/dev/sim.html for the simulator.

---

This is a work of political fiction. Cimarron, its candidates, organizations, news outlets and events are fictional. The game portrays extremism, racism and political violence as part of its subject, and does not endorse them.
