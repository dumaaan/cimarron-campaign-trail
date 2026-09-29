# The Campaign Trail: Cimarron 2030

A political strategy game in the style of *The Campaign Trail*. You are the incumbent Republican governor of Cimarron, a fictional and very conservative U.S. state. You must win the Republican primary against five rivals. Each rival represents a different faction of the modern right.

This is a work of political fiction. The state, the candidates and the events are fictional.

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
| `game.js` | Vote model, game flow and all screens |
| `serve.py`, `play.sh` | Local server and launcher |

## Balance

The difficulty settings are in the `TUNE` object at the top of `game.js`:

| Setting | Effect |
|---|---|
| `T` | How strongly factions swing to their favorite candidate. |
| `posMult` | How much of each answer's gains you keep. Losses always count in full. |
| `oppMomentum` | How fast rivals grow in their core factions. |
| `clawback` | How fast rivals regain factions that you lead. |
| `rivalDebate` | How much of their debate gains rivals keep. |
| `runoffGangup` | How strongly eliminated campaigns unite against you in a runoff. |

With the current settings, random play almost never wins. Play that avoids moderate answers wins about 70% of the time.

## Adding content

- **Question:** add an object to `QUESTIONS` in `questions.js`. Each answer has `text`, `fx` (faction effects) and `fb` (feedback).
- **Event:** add an object to `EVENTS` in `events.js`. The comment at the top of that file lists all the effect keys, including `risk`, `endorse` and `flag`.
- **Promise for the 100-day timeline:** add `'questionId:answerIndex': 'text'` to `PROMISES` in `epilogue.js`.
