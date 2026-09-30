# PRD: Space Race Multiplication (game #4, versus) — v1.0

**Read `CLAUDE.md` first**, then this PRD. This PRD adds one new game. It must not change any existing game.

> **Verify before coding:** folder names, file names, `GameManifest` fields, the generic `Lobby`, `PlayerBadge`, `useMatchStore` and the optional `avatar` manifest field (added for Island Chase) in `CLAUDE.md` were written from PRDs, not from the code. Read the real repo first. If something differs, fix `CLAUDE.md` and tell the user. Do not guess.

This game reuses the rules and lessons of Island Chase (`island-chase-prd.md` v1.2): constant world speed, steps, catch-up, distance-based finish, phase machine with a hard stop on RESULTS, in-game Results screen. Where this PRD says "same as Island Chase", copy the logic into this game's own folder (see 3.3).

---

## 0. What the reference screenshots show, and what we build

| # | Reference (Space Race) | Decision for our game |
|---|---|---|
| 1 | Start scene: 4 ships (blue, yellow, red, orange) parked in 4 lanes at the left, dark space with stars and small asteroids, curved moon surface at the bottom, a **START flag** (two leaning poles, white banner) planted on the moon to the right of the ships, a **grandstand full of colourful spectators** beside it, a **LAP ring** at the bottom right showing 0 | Same scene. Ships start behind the START flag. Flag and grandstand are world objects |
| 2 | World has scrolled: the START flag is now behind the ships (only its pole is visible at the left edge), the grandstand is under the ships, LAP ring shows **1**, a question **3×3** is written on the blue ship's hull, a big red-orange rock/planet enters from the right edge | After GO the world scrolls left at constant speed; the lap counter becomes 1 when a ship's nose passes the START flag. The **human's ship carries the question on its hull** |
| 3 | Four chevron **answer arrows** (6, 16, 9, 4) float in the four lanes to the right of the ships, each with a dark-red glow trail | The 4 answer options are 4 arrows, one per lane. The player taps the arrow with the right answer |
| 4 | Arrows have moved left toward the ships. **Yellow and red ships have surged ahead** of the pack (blue and orange are still at the start positions). LAP ring dots have moved clockwise | Correct answer = ship moves **one step ahead**. Ships keep the lead, everyone keeps flying at the same speed |
| — | User request | **FINISH banner uses the same design as the START banner.** All ships always fly at the same constant speed |

**Reproduce the behavior and the layout, not the art.** All art is original SVG/CSS. Never trace or copy the reference sprites, text or logos.

---

## 1. Summary

A side-scrolling **space race** over a moon surface. 1 human + 3 computer players in 4 lanes. The human sees a multiplication question on their ship and four answer arrows. **All ships always fly at the same constant speed.** A correct answer moves a ship ahead in **steps**. The race is **3 laps**. The first ship whose nose passes the **FINISH banner** wins.

| Field | Value |
|---|---|
| id | `space-race` |
| Title | Space Race Multiplication |
| Subject | `multiplication` (new subject, order after `subtraction`) |
| Mode | `versus` (generic Lobby, **own Results screen inside the game**, `/play` route) |
| Players | 1 human + 3 bots (Computer 2, 3, 4) |
| Target age | class 3 (tables up to 10) |
| Stage | 1010 × 577 design px (shared `GameWindow`) |
| Art | Original SVG/CSS only |

## 2. Goals and non-goals

**Goals:** fast, fair, kid-friendly race; correct answers feel like a boost; close races (catch-up rule); consistent world (START behind you, FINISH ahead of you, laps you can see); a game that always ends and never keeps running after the finish.

**Non-goals (v1):** online multiplayer, accounts, backend, options screen (fixed Normal), power-ups, ship upgrades, different tracks.

## 3. Integration

### 3.1 New folder (all new code lives here)
```
src/games/space-race/
├── manifest.ts
├── SpaceRaceGame.tsx          # root component, phase state machine
├── constants.ts               # every number in this PRD
├── types.ts
├── engine/
│   ├── raceRules.ts           # applyCorrect (with catch-up), places with shared ties (pure)
│   ├── raceMachine.ts         # phase reducer COUNTDOWN/RACING/FINISHING/RESULTS + watchdog (pure)
│   ├── raceClock.ts           # s_i(t), crossing detection, worldX(s,t) (pure)
│   ├── laps.ts                # gates, lap index per ship, lap ring progress (pure)
│   ├── answerArrows.ts        # spawn/expire arrow sets, lane assignment (pure)
│   ├── questionGenerator.ts   # a × b question + 4 options (pure, RNG injected)
│   ├── botBrain.ts            # answer timing + accuracy (pure, RNG injected)
│   ├── resultStats.ts         # accuracy, rate/min, missed questions (pure)
│   ├── scenery.ts             # seeded stars, asteroids, craters, set pieces, crowd colours (pure)
│   └── __tests__/
├── components/                # Ship, ShipHullQuestion, AnswerArrow, World (layers), Gate (flag + grandstand),
│                              # LapRing, CountdownCard, ResultsScreen, Confetti
├── hooks/                     # useRaceLoop, useBots, useAnswerInput
└── assets/                    # original SVG: ship, dome + eyes, flag, grandstand, spectators, arrow, asteroids
```

### 3.2 Manifest
```ts
export const spaceRaceManifest: GameManifest = {
  id: 'space-race',
  title: 'Space Race Multiplication',
  subject: 'multiplication',
  mode: 'versus',
  thumbnail: '/thumbs/space-race.png',
  avatar: SpaceShipAvatar,                       // optional field, see below
  component: dynamic(() => import('./SpaceRaceGame'), { ssr: false }),
};
```

### 3.3 Allowed changes outside the game folder (small, backward compatible)
1. `lib/gameRegistry.ts`: one line.
2. `lib/subjects.ts`: add `multiplication` ("Multiplication", after `subtraction`).
3. `public/thumbs/space-race.png`: original thumbnail.
4. `avatar` manifest field: reuse the optional field added for Island Chase. If it does not exist yet, add it as **optional** with the chick as default; Jumping Chicks and Island Chase must render exactly as before. List it in your plan and wait for approval.
5. Only if the generic result/profile types lack fields: add **optional** fields only.

**Do not touch:** `src/games/jumping-chicks/`, `src/games/alien-addition/`, `src/games/island-chase/`, their storage keys, and nav/hub behavior other than the new subject and card appearing automatically.

**No cross-game imports.** The pure race logic (`raceRules`, `raceMachine`, `resultStats`) is copied into this folder. Promoting it to `core/race/` is a separate, deliberate change for later (see section 20).

## 4. Player flow and phases

```
Hub card / Subjects > Multiplication > Space Race
  -> /games/space-race        generic Lobby ("<Name>'s Game", 0/1 players ready, START, LEAVE)   [same start screen as the other games]
  -> /games/space-race/play   COUNTDOWN -> RACING -> FINISHING -> RESULTS (own screen, same route, no navigation)
```
- **Lobby:** 4 slots: human (host star badge, shared profile name and colour) and Computer 2, 3, 4, each with a **spaceship avatar** (dome with two eyes; blue, yellow, red, orange; human uses the profile colour, bots take the remaining colours).
- Refresh on `/play` returns to the Lobby. Never persist live race state.

### 4.1 Phase machine (mandatory, same as Island Chase 23.1)
`engine/raceMachine.ts` is a pure reducer. **Only the reducer changes the phase.**

| Transition | Trigger | Actions |
|---|---|---|
| COUNTDOWN → RACING | GO | start race clock `t = 0`, start bots, spawn first question and arrows, start engine sound |
| RACING → FINISHING | first ship crosses the FINISH banner (`T_f`) | lock input, hide arrows, stop bots, freeze all `pos`, keep world and ships flying at `v`, record `crossedAt` for each ship as it crosses, place badges, confetti, crowd cheers |
| FINISHING → RESULTS | all 4 crossed **+ `RESULTS_DELAY_MS`**, or `FINISH_MAX_MS` after `T_f` (watchdog), whichever first | compute places and stats, save result once, **stop everything**, show Results screen |
| RESULTS → COUNTDOWN | PLAY AGAIN | reset all race state, new seeds, new countdown |
| RESULTS → Lobby route | END GAME | navigate to `/games/space-race` |

**When entering RESULTS (mandatory):** cancel the `requestAnimationFrame` loop; clear every timer (bots, tweens, countdown, watchdog, question delays) through one `stopAll()` that also runs on unmount; stop bots and looping sounds; ignore keys and late events. The Results screen replaces the whole stage content. **The game must never keep running after the finish.**

Checklist for bugs of the "kept running" kind: crossing detection dispatches to the reducer and does not depend on frozen `pos`; the loop keeps running in FINISHING and stops in RESULTS; watchdog/delay timers are not restarted by re-renders; StrictMode cannot create two loops; no navigation to a generic `/results` route; dev log `console.debug('[space-race] phase', prev, '->', next)`.

## 5. Step rules (same as Island Chase 5)

Each player has integer `pos` (steps), start `0`, max `MAX_STEPS = 20`. `leaderPos = max(pos)`.

```
on correct answer:
  if (CATCH_UP && player.pos < leaderPos)  player.pos = leaderPos                      // behind: match the leader, do not pass
  else                                     player.pos = min(player.pos + 1, MAX_STEPS) // leading or tied: one step ahead
  if (pos changed) player.reachedAt = now
```
- A ship that is behind matches the leader with **one** correct answer and needs **another** to get ahead. Tied at the front: first correct answer goes +1 and leads alone.
- `CATCH_UP = true` (constant, so it can be switched off if you prefer plain "+1 step" for everyone).
- Answers are processed in strict timestamp order, one at a time.
- **Wrong answer or timeout:** no position change. Ship shakes with a small spark puff, soft "Oops!" on the hull plate, input locked `WRONG_LOCK_MS = 1000` (wrong only), then a **new** question and new arrows. A timeout (arrows left the screen) counts as a missed question with "—" as the player's answer, no lock.

Worked example (positions A, B, C, D): start 0,0,0,0 → A correct 1,0,0,0 → B correct 1,1,0,0 → A correct 2,1,0,0 → D correct 2,1,0,2 → C correct 2,1,2,2 → A correct 3,1,2,2.

## 6. World model

### 6.1 One formula for every ship
`t` = seconds since GO (paused when the tab is hidden). Distances in design px along the track.
```
v         = WORLD_SPEED                      // 100 px/s, identical for every ship, always, after GO
off_i(t)  = tweened value of  pos_i * STEP_PX  // temporary surge while tweening, then it flies at v again, just further ahead
s_i(t)    = v * t + off_i(t)                 // distance of ship i's NOSE; s = 0 at GO
worldX(s,t) = GATE_ANCHOR_X + s - v * t      // screen x of a world object at distance s (GATE_ANCHOR_X = 269)
ship drawn x = LANE_NOSE_X[lane] + off_i     // LANE_NOSE_X = [269, 277, 285, 293]: small perspective stagger, drawn only
```
- The camera is fixed (no rotation, straight track). The moon surface arcs at the bottom for style only.
- The lane stagger is **visual only**. All crossings are judged with `s_i`, never with the drawn x.
- With no answers, all four ships fly side by side at `v`.

### 6.2 Gates, laps, finish
The track has 4 gates (a gate = flag + grandstand, section 10.4):

| Gate | Distance `s` | Label |
|---|---|---|
| START | `S_START = 350` (ships start 350 px behind it, so it looks like the reference: flag at screen x ≈ 619 at GO) | `START` |
| Lap 2 | `S_START + LAP_LENGTH` | `LAP 2` |
| Lap 3 | `S_START + 2 × LAP_LENGTH` | `LAP 3` |
| **FINISH** | `S_FINISH = S_START + LAPS × LAP_LENGTH` | `FINISH` (**same banner design as START, only the text changes**) |

`LAPS = 3`, `LAP_LENGTH = 1500` → `S_FINISH = 4850`. With no answers a ship crosses FINISH at about 48.5 s; with normal play about 40 to 55 s.

- `lap_i` = number of gates among START / LAP 2 / LAP 3 with `s <= s_i` (0 before START, max 3). Shown as `LAP n` on the ring (`LAP 0` during the countdown, becomes 1 when the nose passes the START flag, as in reference image 2).
- `ringProgress_i` = `0` if `lap_i = 0`, else `(s_i − gateS[lap_i − 1]) / LAP_LENGTH`, clamped to `[0, 1]`. At FINISH the ring shows full.
- The ring shows the **human's** lap number and 4 dots (one per ship, using each ship's own progress).
- **Crossing detection** each frame per ship: `if (crossedAt[i] == null && s_i >= S_FINISH) crossedAt[i] = t` (interpolate inside the frame for sub-frame accuracy).

### 6.3 Finish times, places, stats (same as Island Chase 23.2)
- `finishTime_i` = seconds since GO at nose crossing, shown with 2 decimals: `47.82 sec`.
- **Places:** sort by `finishTime` ascending, compared at 0.01 s. **Equal times share the place** (1st, 1st, 1st, 4th). Human "won" = place 1 (ties count). Ships not crossed when the watchdog fires get the projected time `(S_FINISH − STEP_PX × pos) / v`.
- **Accuracy** = `round(100 × correct / (correct + wrong + timeouts))` %, `0%` if none. **Rate** = `round(correct / (humanFinishTime / 60))` per minute. **Missed Questions** = every wrong or timed-out question of the human: `7 × 8`, correct answer, chosen answer or `—`.

### 6.4 Step tween
- **+1 step:** ease-out with a tiny overshoot over `STEP_TWEEN_MS = 500`, engine flame flare, short streak lines, whoosh.
- **Catch-up:** faster surge, duration `clamp(300 + 80 × stepsBehind, 300, 900)` ms, ends exactly level with the leader.
- Crossing detection, lap ring dots and results use the **displayed** (tweened) `s_i`. What the player sees is the result.

### 6.5 Screen safety
Max lead = `MAX_STEPS × STEP_PX = 560 px`, so the furthest nose is at x = 293 + 560 = 853, left of the lap ring (x ≥ 890). A unit test checks this from the constants.

## 7. Questions and answer arrows

### 7.1 Questions
- Each player has an **independent question sequence**. Only the human sees theirs, written on their ship's hull.
- **Normal (fixed in v1):** `a × b` with `a, b ∈ [2, 10]`. **Warm-up:** questions 1 and 2 use `a, b <= 5`. No identical question, and no reversed question (`3×4` then `4×3`), twice in a row.
- **Options:** exactly 4, unique, all `>= 0`, one correct. Distractors from near misses: `(a±1)×b`, `a×(b±1)`, `correct ± 1`, `correct ± 2`, `a + b`. Pick 3, shuffle across the 4 lanes. The correct lane is never the same more than 2 times in a row. Randomness only in handlers/effects.

### 7.2 Answer arrows (the input)
- 4 chevron **arrows**, one per lane, each showing one option on a dark number plate, with a dark-red glow trail. Chevrons point right.
- They are **world objects**: an arrow set spawns at the right edge (`ARROW_SPAWN_X = 1030`) and scrolls left at `v` like the rest of the world. Arrows are drawn **behind** ships.
- **Select** by tapping/clicking an arrow or pressing keys **1 to 4** (top lane to bottom lane). Selecting is possible from the moment the arrows appear (the player does not wait for them to reach the ships).
- **Correct:** the arrow bursts (green sparkle), the human's ship surges, `NEXT_QUESTION_DELAY_MS = 400` later the next question is on the hull and a new set spawns.
- **Wrong:** the chosen arrow cracks and turns grey, the set fades, ship shakes, lock `WRONG_LOCK_MS`, then a new question and a new set.
- **Timeout:** if the arrows' tips pass `ARROW_EXPIRE_X = 120` unanswered (about 9 s), the set fades, "Time's up!" (gentle wording) on the hull plate, missed question recorded, next question after 400 ms.
- Arrow art: original double-chevron shape in orange/red gradient with a dark maroon number plate (white number). **Do not copy the reference sprite.**

## 8. Computer players

Same rules as the human: own question, own 1 s wrong-answer lock, same `applyCorrect`. They do not use arrows; they only have timers. Loop: wait `answerTime`, then correct with probability `accuracy`.

| Bot | Accuracy | Answer time (s), normal dist. | Min |
|---|---|---|---|
| Computer 2 | 0.65 | mean 7.0, sd 1.5 | 2.5 |
| Computer 3 | 0.80 | mean 5.5, sd 1.2 | 2.2 |
| Computer 4 | 0.90 | mean 4.5, sd 1.0 | 2.0 |

Seed the bot RNG per race in the START handler / play-mount effect. Bot timers pause when the tab is hidden, during COUNTDOWN and after `T_f`.

## 9. Screen layout (design px, 1010 × 577; taken from the reference and rounded)

| Element | Position / size |
|---|---|
| Lane centres (ship body y) | 107, 222, 336, 452 (pitch about 115) |
| Ship sprite | about 187 × 93 (dome included), nose to the right, tail fin left. Nose x at zero steps: 269, 277, 285, 293 (lane 1 to 4) |
| Hull question plate | dark navy plate about 85 × 49, slightly skewed, white bold text about 46 px (`3×3`), centred on the ship body, follows the ship |
| Answer arrows | one per lane, about 178 × 71, centre y = lane centre − 12 (95, 210, 324, 440), tip x about 656 to 660 when just spawned in the reference view; number plate about 60 × 60 with 56 px white number |
| Moon surface | curved arc along the bottom: top at y ≈ 520 near x = 500, down to y ≈ 575 at both edges; teal-grey, dark elliptical craters |
| Gate (flag) | about 150 wide × 350 tall, planted on the moon; two poles leaning outward about ±10°, white banner between the pole tops with a V-cut bottom, bold slanted stencil text |
| Gate (grandstand) | starts 180 px to the right of the flag centre, about 672 wide × 147 tall, sits on the moon (bottom y ≈ 547), 3 rows of colourful spectators |
| Lap ring | centre (945, 512), outer diameter 110, stroke about 12; "LAP" small (about 20 px) above a big number (about 64 px); lap-line tick at 3 o'clock; dots start at 3 o'clock and move **clockwise** |
| Countdown | centred glowing number card (space style), about 220 × 220 at (505, 250) |
| Big set pieces | occasional large red-orange rock/planet fragments enter from the right edge (reference image 2), behind ships |

Portrait phones (<640 px): shared "rotate your device" hint. Fullscreen via the shared `GameWindow`.

**Countdown phase (as reference image 1):** ships parked, no flame trail, world static, START flag and grandstand visible, ring shows `LAP 0`, no question and no arrows yet.

## 10. Visuals

### 10.1 Ships
Original design: elongated rounded body (fish/saucer-like), tail fin and small rear thrusters, glass dome cockpit with a cartoon creature with two eyes looking forward, body colour per player (blue, yellow, red, orange) with a darker underside. Small "YOU" arrow above the human's ship. Gentle bob ±3 px (seeded phase). Cruise: small flickering exhaust. Surge: big flame and streak lines. Wrong: shake and grey spark puff. Finish: glow.

### 10.2 Space scene (all seeded, world-space, parallax factor of `v` in brackets)
1. Deep navy gradient background (darker at the top).
2. Stars: far layer (0.05) and near layer (0.15), twinkle. Faint dust (0.3).
3. Small drifting dark asteroids (0.6), some rotating slowly.
4. Big set pieces: red-orange rock/planet fragments (0.8).
5. **Moon surface with craters and small rocks (1.0)** along the bottom; **gates** (1.0).
6. Answer arrows (1.0, screen space spawn).
Everything from a **seeded generator** (`mulberry32`, fixed seed + chunk index). No `Math.random()` at render.

### 10.3 Gate assembly (`Gate` component, same for all gates)
Flag + grandstand + spectators. **One component, one design** used for START, LAP 2, LAP 3 and FINISH; only the banner text changes. FINISH additionally gets confetti when the first ship crosses and the spectators bounce. Spectator colours and heads are seeded per gate.

### 10.4 Effects
Burst on correct arrow, crack on wrong arrow, streak lines on catch-up, place badges ("1st", "2nd", "3rd", "4th", shared places repeat) above ships as they cross, winner banner, confetti. Cheap SVG/canvas only.

### 10.5 Countdown
`3`, `2`, `1`, `GO!` (`COUNTDOWN_STEP_MS = 1000`, GO shows 700 ms), beep per number, higher beep at GO. At GO: race clock starts, flames on, question 1 on the hull, first arrow set spawns, bots start.

## 11. Constants (`constants.ts`)

```ts
export const WORLD_SPEED = 100;            // px/s, all ships, always
export const STEP_PX = 28;
export const MAX_STEPS = 20;               // max lead 560 px
export const CATCH_UP = true;
export const GATE_ANCHOR_X = 269;
export const LANE_CENTER_Y = [107, 222, 336, 452];
export const LANE_NOSE_X = [269, 277, 285, 293];
export const S_START = 350;
export const LAPS = 3;
export const LAP_LENGTH = 1500;
export const S_FINISH = S_START + LAPS * LAP_LENGTH;   // 4850
export const ARROW_SPAWN_X = 1030;
export const ARROW_EXPIRE_X = 120;
export const COUNTDOWN_STEP_MS = 1000;
export const STEP_TWEEN_MS = 500;
export const CATCHUP_BASE_MS = 300;
export const CATCHUP_PER_STEP_MS = 80;
export const CATCHUP_MAX_MS = 900;
export const WRONG_LOCK_MS = 1000;
export const NEXT_QUESTION_DELAY_MS = 400;
export const FINISH_MAX_MS = 6000;         // watchdog: FINISHING -> RESULTS at the latest
export const RESULTS_DELAY_MS = 1000;      // after the last ship crosses
export const DT_CLAMP_MS = 100;
```

## 12. Controls and audio

- Mouse/touch: tap an arrow. Keyboard: **1 to 4**. Input disabled during COUNTDOWN, during the wrong-answer lock, after `T_f` and in RESULTS. After scaling, each arrow's tap area stays about 44 px or more on screen.
- Audio via `core/audio/soundManager.ts` (respects the nav toggle): countdown beeps, GO horn, engine hum loop (low, stops at RESULTS), correct chime + whoosh, soft wrong "bonk", lap chime, crowd cheer + fanfare at the finish. No new audio system.

## 13. Results screen (same as Island Chase 23.3, own screen inside the game)

Space-themed variant of the reference results page: blue/dark water replaced by deep-space backdrop with soft nebula shapes.

| Element | Position / style |
|---|---|
| Left panel | x 0 to 605. Title "Results" at (30, 30), white italic bold about 40 px. Optional print button at x 526 to 578, y 28 to 71 (skip in v1 if short on time) |
| Rows | 4 rows, 100 px high, pitch 108, tops at y = 90, 198, 306, 414 |
| Human row | translucent white highlight, x 0 to 578 |
| Row content | medal (x 30; original gold/silver/bronze, none for 4th) · place `1st:` (x 94, white 30 px; shared places repeat the label) · finish time under it in coral `#f0466e` about 26 px (`47.82 sec`) · **spaceship avatar** (x 233, about 117 × 82, player's colour) · name (x 376, white 24 px) |
| Row order | by place, then slot (human first among equals) |
| Right panel | x 605 to 1010, dark teal/navy. Stats line at y ≈ 33: `Accuracy: **0%**   Rate: **0/min**`. Divider at y ≈ 65. "Missed Questions" at y ≈ 100. Scrollable list y 130 to 450: `7 × 8`  `Correct: 56`  `Yours: 54` (or `—`). If the human answered at least one question and missed none: "No missed questions!" |
| Buttons | divider y ≈ 470. **PLAY AGAIN** (orange chevron, about 155 × 46, x 630, y 500) and **END GAME** (dark rectangle, about 130 × 42) |

- PLAY AGAIN (Enter): fresh countdown, clean state, one loop. END GAME (Esc): Lobby.
- Kid-friendly copy, no "You lost". Original medals and avatars.

## 14. Storage

Write the human's result **once** when entering RESULTS (`resultSavedRef` guard) via `core/state/storage.ts`, key `arcade:leaderboard:space-race` (place, finishTime, accuracy, rate, correct, wrong). Shared `arcade:playerProfile` for name/colour. **Never persist** phase, positions, timers, questions.

## 15. Architecture and hard rules

- `engine/` is pure: no React, no DOM, no `Math.random` (inject RNG), no `Date.now` (inject clock).
- `useRaceLoop`: one rAF loop. Per frame: clamp `dt` to 100 ms, advance `t` (skip while hidden or before GO), update tweens and arrows, compute all `s_i`, laps, crossings, write transforms to refs. **No per-frame React state.** React state only for phase, question/answer UI and scores.
- All answer events go through one reducer so order is deterministic. Shared player list from `useMatchStore` (read only). Lazy-load the game (`ssr: false`).
- **Rules from `CLAUDE.md`:** hydration safe (no `Math.random()`, `Date.now()`, `performance.now()`, locale formatting in first render; seeded scenery; stable keys); no edits to other games; data-driven from the registry; no backend and no persisted live state; original art; kid-friendly; end with `npm run build`, type-check, no hydration warnings after a hard refresh; update `CLAUDE.md`.

## 16. Acceptance criteria

**Platform / regression**
- [ ] Nav Subjects shows **Multiplication > Space Race Multiplication**; hub has a Multiplication section with one card; nothing hard-coded.
- [ ] Jumping Chicks, Alien Addition and Island Chase unchanged.
- [ ] `npm run build` and type-check pass; no hydration warnings on `/`, Lobby, `/play`.

**Lobby / countdown**
- [ ] Same start screen as the other games with 4 spaceship avatars, START, LEAVE.
- [ ] Countdown: ships parked, START flag and grandstand visible, ring `LAP 0`, no question, no arrows, 3-2-1-GO with beeps.

**Race**
- [ ] After GO the world scrolls at `WORLD_SPEED` for the whole race; ships with equal steps stay exactly level; START flag and grandstand scroll away behind the ships and never come back; ring switches to `LAP 1` when the nose passes the START flag.
- [ ] Question is written on the human's hull; 4 arrows, one per lane, scroll in from the right, behind the ships; keys 1 to 4 and taps work.
- [ ] Correct: ship moves exactly `STEP_PX` ahead (tween), or level with the leader if it was behind. Wrong: shake, 1 s lock, new question and arrows. Timeout: gentle "Time's up!", missed question recorded, new question.
- [ ] Lap ring dots move clockwise from 3 o'clock, wrap at each lap gate; ring shows the human's lap. LAP 2 and LAP 3 gates appear at the right distances.
- [ ] The **FINISH banner has the same design as START** (text "FINISH") and comes in from the right; ships physically reach it; first nose to cross wins.

**Finish / results**
- [ ] First crossing → FINISHING (input locked, arrows hidden, bots stopped, ships keep crossing, place badges). After all 4 crossed +1 s (or 6 s watchdog) → Results screen.
- [ ] Results show places with shared ties, times, ship avatars, human row highlighted, Accuracy, Rate, Missed Questions, PLAY AGAIN, END GAME.
- [ ] On Results nothing runs: no animation loop, timers, bots or sound. PLAY AGAIN starts a fresh countdown with exactly one loop; END GAME goes to the Lobby.
- [ ] With zero answers all four ships cross together and Results shows four "1st" rows.
- [ ] Refresh on `/play` returns to the Lobby; result saved once; nothing live persisted.
- [ ] Hiding the tab pauses everything; resuming causes no jumps.

## 17. Tests to write

**Unit (engine)**
- `applyCorrect`: front +1, tied front +1, behind matches leader (also 5 steps behind), cap at `MAX_STEPS`, `CATCH_UP = false` gives plain +1; the worked example in section 5 replays exactly.
- `raceClock`: `s_i` formula; equal steps → equal `s`; crossing time monotonic and interpolated; `worldX` of the START gate at `t = 0` is 619.
- `laps`: `lap_i` values around each gate, ring progress 0..1, wrap at the gates, full at FINISH.
- `answerArrows`: 4 arrows, unique numbers, correct lane not repeated more than 2 times, expiry at `ARROW_EXPIRE_X`.
- `questionGenerator`: 10,000 questions: factors in range, 4 unique options >= 0, exactly one correct, warm-up rule, no repeat or reverse repeat.
- `botBrain`: seeded RNG, times >= min, accuracy near profile.
- `raceRules` places: `47.82, 47.82, 47.82, 48.82` → 1, 1, 1, 4; rounding at 0.01; watchdog projection.
- `resultStats`: accuracy and rate (including 0 answers), missed list with timeouts as `—`.
- Constants: `293 + MAX_STEPS × STEP_PX < 890`.

**Phase machine and cleanup**
- RACING → FINISHING on the first crossing; FINISHING → RESULTS when all crossed (+ delay) and via the watchdog; RESULTS ignores `TICK`, `ANSWER`, `FINISH_DETECTED`; PLAY AGAIN returns to COUNTDOWN with fresh state.
- With fake timers: after RESULTS `stopAll()` leaves 0 pending timers and the frame callback is cancelled; unmounting during FINISHING clears everything; two PLAY AGAINs in a row never create two loops.

**Race simulation (must pass)**
Headless: 1,000 races with the 3 bot profiles + a synthetic human (85% accuracy, 6 s mean). Assert: average crossing time 40 to 55 s; `MAX_STEPS` reached in fewer than 5% of races; every ship crosses or is ranked; a winner always exists. If not, adjust `STEP_PX` (for example 22), `LAP_LENGTH` or bot times, rerun.

## 18. Build phases (verify each before the next)

1. **Skeleton:** folder, manifest, registry, `subjects.ts`, Lobby shows the game with spaceship avatars, `/play` renders an empty `GameWindow`. Regression check.
2. **Engine + tests:** all `engine/` modules with the unit, phase machine and simulation tests green.
3. **Plain-box race:** boxes for ships, gates, arrows, ring; countdown, steps, catch-up, laps, finish crossing, FINISHING, RESULTS with `stopAll()`. Rules fully working with ugly art.
4. **Visuals:** ships, scene layers, moon, gates with grandstand, arrows, ring.
5. **Polish:** tweens, effects, place badges, confetti, crowd cheer.
6. **Results screen** exactly as in section 13.
7. **Sound.**
8. **Mobile and fullscreen check, hydration check, balance playtest.**
9. **Regression and docs:** all games, `npm run build`, update `CLAUDE.md`.

## 19. CLAUDE.md updates required when done

- Section 1 table: add **Space Race Multiplication**, Multiplication, versus, done v1.0.
- Section 3 layout tree: add `games/space-race/`.
- Section 4: add **4.x Space Race Multiplication** (step rules, world formula `s = v·t + steps·STEP_PX`, gates and laps, answer arrows, phase machine, Results screen, constants).
- Section 8 change log: `Space Race v1.0 | Multiplication subject, 3-lap space race, answer arrows, gates with grandstand, in-game Results`.
- Section 9: the planned games are now decided (subtraction and multiplication).

## 20. Decisions made (change any before build)

1. **Catch-up rule** as in Island Chase (behind ship matches the leader with one correct answer). Switch off with `CATCH_UP = false` for plain "+1 for everyone".
2. **Answer arrows are the input** and belong to the human only; bots use timers.
3. **3 laps**, about 45 s, START flag 350 px ahead of the ships, lap gates use the same flag and grandstand with text `LAP 2` / `LAP 3`.
4. **FINISH banner = START banner design**, text only differs.
5. **Timeout** after about 9 s counts as a missed question, without a lock.
6. **Fixed Normal difficulty** (tables 2 to 10), no options screen.
7. **Bot skill** fixed by profile.
8. **Race logic is copied** from Island Chase into this game's folder (no cross-game imports). Promoting `raceRules`, `raceMachine`, `resultStats` and the Results screen shell to `core/race/` is a separate, deliberate change to do after this game works.
9. **Names:** "Space Race" and "Island Chase" are the reference site's game names. Like the nav placeholder brand in `CLAUDE.md`, rename both before any public release.

---

## 21. Ready-to-paste agent prompt

```
Read CLAUDE.md first, then space-race-prd.md (v1.0). island-chase-prd.md (v1.2) is the model for the shared rules.
Goal: build "Space Race Multiplication" exactly as in space-race-prd.md.
Where: new folder src/games/space-race/ + one line in lib/gameRegistry.ts + multiplication in lib/subjects.ts (+ the optional avatar manifest field only if it does not exist yet).
Key logic to get exactly right: s_i = v*t + steps*STEP_PX for every ship; START, LAP 2, LAP 3 and FINISH are world objects (same flag + grandstand component, only the text differs) that scroll left at v; laps and the lap ring come from s_i; the human's question is written on their hull and the 4 answer arrows (one per lane) are the input; phase machine COUNTDOWN -> RACING -> FINISHING -> RESULTS with a hard stopAll() on RESULTS (the game must never keep running after the finish); in-game Results screen as in section 13.
Constraints: do NOT touch jumping-chicks, alien-addition or island-chase. No cross-game imports (copy the pure race logic). Hydration safe. Original art only. No live state persisted; save the result once.
First: verify the real repo against CLAUDE.md (folders, GameManifest, Lobby, useMatchStore, storage), list mismatches and the files you will change, then wait.
Then build in the phases of section 18, verifying each phase. Do not skip the phase machine, cleanup and race simulation tests.
Verify: acceptance criteria in section 16, tests in section 17, npm run build, type-check, no hydration warnings after a hard refresh, existing games unchanged, console shows the phase sequence once per race.
When done: update CLAUDE.md as in section 19.
```
