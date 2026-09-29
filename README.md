# The Campaign Trail: Cimarron 2030

A political strategy game in the style of *The Campaign Trail*. You are the incumbent Republican governor of Cimarron, a fictional and very conservative U.S. state. You must win the Republican primary against five rivals. Each rival represents a different faction of the modern right.

This is a work of political fiction. The state, the candidates and the events are fictional.

**Play it in your browser: https://dumaaan.github.io/cimarron-campaign-trail/**

## How to play

You need Python 3 and a web browser. There is nothing to install.

```bash
./play.sh
```

This starts a local server at http://localhost:8765 and opens the game. To use a different port, run `./play.sh 9000`. To start only the server, run `python3 serve.py`.

The server turns off browser caching, so a normal reload shows your edits.

## The game

- **Setup:** choose the record of your first term and a running mate from one of the factions.
- **Campaign:** about 30 steps from February to August 2030.
  - Campaign questions from a pool of 49.
  - Events (scandals, crises, tragedies, endorsement fights, opposition research, party politics). Each event has staff advisors, and some choices are risky.
  - Four campaign stops: rally, ads, get-out-the-vote, or a fundraiser.
  - Two debates. Every candidate answers, and every answer is graded.
  - The President's endorsement.
- **Primary night:** the regions report one by one. If nobody reaches 40%, the top two go to a runoff.
- **Runoff:** if you are in it, a three-week campaign follows. You meet the eliminated candidates to win their endorsements, handle runoff crises, and then face a second election night.
- **After:** the concession, the general election, victory speeches, the first 100 days, and the consequences of your choices.

The **RINO Label** goes up with moderate answers and costs you support in every faction except business Republicans.

## Files

| File | Contents |
|---|---|
| `index.html` | The page |
| `style.css` | The look |
| `data.js` | State profile, factions, regions and demographics, candidates, endorsers, staff, schedule |
| `questions.js` | Campaign questions and the rival news wire |
| `debates.js` | Debate questions, with each rival's answer |
| `events.js` | Scandals, crises and other events |
| `epilogue.js` | Promises, speeches, 100-day timelines, concession options |
| `runoff.js` | The runoff campaign: meetings with eliminated candidates, runoff crises |
| `game.js` | Vote model, game flow and all screens |
| `serve.py`, `play.sh` | Local server and launcher |
| `tests.html` | Checks for the vote model and the numbers the game shows |
| `sim.html`, `sim.js` | Balance simulator |

## Balance

The difficulty settings are in the `TUNE` object at the top of `game.js`:

| Setting | Effect |
|---|---|
| `T` | How strongly factions swing to their favorite candidate. |
| `posMult` | How much of each answer's gains you keep. Losses always count in full. |
| `oppMomentum` | How fast rivals grow. They grow in the factions where they can win the most new votes. |
| `clawback` | How fast rivals regain factions that you lead. |
| `rivalDebate` | How much of their debate gains rivals keep. |
| `runoffGangup` | How strongly eliminated campaigns unite against you when a runoff starts. |
| `runoffMomentum` | How much your rival gains at each step of the runoff campaign. |
| `endorseTop`, `endorseAll` | How much a runoff endorsement moves the endorser's voters. |
| `fringeRunoff` | How strongly older, evangelical, business and farm voters unite against a fringe outsider in a runoff. |

The scenarios, the outsiders and the war are in `data.js` (`SCENARIOS`, `WAR`).

To measure the balance, open http://localhost:8765/sim.html with the server running. It plays hundreds of automatic games and reports:

- the win rate for each automatic strategy,
- how often each scenario's outsider reaches the top two and wins,
- how runoffs depend on the endorsements you win,
- how the war affects the President's endorsed candidate,
- who wins, overall and in each scenario.

Current results: random play almost never wins. Play that never gives a moderate answer wins about 55% of the time, and the best simple strategy wins about 85%. When you reach a runoff, you win about 80% of the time, but almost never if you win none of the endorsements.

## Seeds and scenarios

Every game has a seed. It is shown on the field screen and on the ending screen. The seed chooses the scenario and the random events, so you can replay a game by entering the same seed on the title screen.

| Scenario | Chance | Example seed | What changes |
|---|---|---|---|
| The Expected Field | 42% | 100000 | The usual five challengers. |
| The Celebrity | 13% | 100012 | Former NFL quarterback Jake Coburn enters the race in March. |
| The Doctor | 11% | 100001 | Dr. Renee Albright, a MAHA physician, replaces Vaskel. Health-freedom voters turn out. |
| The Streamer | 11% | 100034 | Mason Pike, an America First streamer, replaces Whitlock. Young voters turn out. |
| The Heir Apparent | 8% | 100007 | The President favors Dunmore from the start. |
| The Wounded Incumbent | 7% | 100002 | Your former Chief of Staff has been indicted. |
| The Reckoning | 4% | 100006 | A war in the Middle East starts early. Older and business Republicans return. This is Whitlock's best chance. |
| The Boom | 4% | 100025 | Vaskel's data centers brought 6,000 jobs. This is Vaskel's best chance. |

The seed decides the scenario and the random events. Your choices still decide the outcome.

In about 5% of the other games, the President starts a war in the Middle East and an oil shock follows (seed 100023 is a standard game with a war). Together with the Reckoning, about 9% of all games have a war. Candidates tied to the President, especially the one he endorsed, lose support among the New Right, farmers and older voters. Evangelicals move the other way.

### Who wins

From 400 simulated games with the natural mix of scenarios, with a player who never gives a moderate answer:

| Winner | Share |
|---|---|
| You | 59% |
| Pastor Rick | 14% |
| Sheriff Krantz | 12% |
| Lt. Gov. Dunmore | 12% |
| Jake Coburn (celebrity) | 3% |
| Carol Whitlock | 0.5% (only in the Reckoning) |
| Brent Vaskel | 0.3% (mostly in the Boom) |
| Dr. Albright, Mason Pike | under 0.5% each |

The doctor and the streamer can lead the race or reach a runoff, but they very rarely win. In a two-candidate runoff, older, evangelical, business and farm voters unite against them.

For testing, add `?scenario=streamer` or `?war=1` to the address.

## Checking the math

With the server running, open http://localhost:8765/tests.html. It checks that every vote count, share, crosstab, turnout figure, date and text claim agrees with the vote model.

## Adding content

- **Question:** add an object to `QUESTIONS` in `questions.js`. Each answer has `text`, `fx` (faction effects) and `fb` (feedback).
- **Event:** add an object to `EVENTS` in `events.js`. The comment at the top of that file lists all the effect keys, including `risk`, `endorse` and `flag`.
- **Promise for the 100-day timeline:** add `'questionId:answerIndex': 'text'` to `PROMISES` in `epilogue.js`.
