# Arcademics Games Platform

## 1. Registered Games

| ID | Title | Subject | Mode | Status |
|---|---|---|---|---|
| `jumping-chicks` | Jumping Chicks | Counting | Versus (1 Human + 3 Bots) | Done v1.0 |
| `alien-addition` | Alien Addition | Addition | Solo (6-Stage Timed Shooter) | Done v1.4 |
| `island-chase` | Island Chase Subtraction | Subtraction | Versus (1 Human + 3 Bots) | Done v1.2 |
| `space-race` | Space Race Multiplication | Multiplication | Versus (1 Human + 3 Bots) | Done v1.2 |
| `drag-race` | Drag Race Division | Division | Versus (1 Human + 3 Bots) | Done v1.0 |
| `orbit-integers` | Orbit Integers | Integers | Versus (1 Human + 3 Bots) | Done v1.0 |

---

## 2. Directory Structure

```
src/
├── app/                        # Next.js App Router
│   ├── games/[gameId]/         # Generic Lobby & Solo Runner
│   ├── games/[gameId]/play/    # Active Game Runner
│   ├── games/[gameId]/results/ # Generic Leaderboard Results
│   └── page.tsx                # Arcade Hub & Profile Customizer
├── core/
│   ├── audio/                  # Central soundManager
│   ├── components/             # GameWindow, Lobby, Leaderboard
│   ├── state/                  # useMatchStore, ArcadeStorage
│   └── types/                  # match, player
├── games/
│   ├── jumping-chicks/
│   ├── alien-addition/
│   ├── island-chase/
│   ├── space-race/
│   ├── drag-race/
│   └── orbit-integers/
│       ├── manifest.ts
│       ├── OrbitIntegersGame.tsx
│       ├── constants.ts
│       ├── types.ts
│       ├── engine/             # questionGenerator, course, raceMath, __tests__
│       ├── components/         # SpaceScene, Pod, PodAvatar, LaunchTower, FinishRing, QuestionPanel, TrackMiniMap
│       └── screens/            # NameScreen, OptionsScreen, LobbyScreen, ResultsScreen
└── lib/
    ├── gameRegistry.ts
    └── subjects.ts
```

---

## 3. Game Rules: Space Race Multiplication (v1.2)

### 3.1 Camera Follows Human & Polar Orbit Model
- **Camera-Locked Model**: The camera is locked to the human ship at distance $s_h(t) = v \cdot t + \text{off}_h(t)$.
  - Human ship nose is always fixed at screen $x = 300\text{ px}$.
  - Any ship $i$'s screen position is $x_i = 300 + (s_i - s_h)$. Ships outside the stage viewport ($x_i < -230$ or $x_i > 1050$) are clipped and visible on the map ring.
  - World objects / gates at distance $s$: `worldX(s) = 300 + (s - s_h)`.
  - Moon disc ($R = 1600\text{ px}$) and surface objects rotate around $C = (505, 2100)$ by $-s_h / R$. Sky layers rotate with respective parallax ratios.
  - Track consists of 3 laps ($\text{LAP\_LENGTH} = 1800\text{ px}$, $\text{S\_START} = 350\text{ px}$, $\text{S\_FINISH} = 5750\text{ px}$).

### 3.2 Step Rules & Pacing (v1.2)
- `CATCH_UP = false`: Plain $+1$ step advance per correct answer ($\text{STEP\_PX} = 180\text{ px} \approx 1\text{ ship length}$). No lead cap.
- All 3 bots have accuracy $0.70$ with independent scheduled timers (Computer 2 mean 7.0s, Computer 3 mean 5.5s, Computer 4 mean 4.5s).

### 3.3 Persistent Lane Swapping & Anchored Flame
- Selecting an arrow in lane $k$ initiates simultaneous visual glides: human glides to lane $k$ with banking angle $\pm 12^\circ$, and the displaced ship glides to the human's previous lane.
- **Steering persists**: The human stays in the new lane and never returns to the top lane.
- **Flame**: Anchored directly at the rear metal nozzle at local `(10, 58)` inside the ship SVG group.

### 3.4 Auto-Fit Hull Question Plate & Floating Status
- Hull plate $84 \times 34\text{ px}$ with auto-fitted font size ($18\text{ px}$ to $30\text{ px}$) ensuring $10 \times 10$ and all tables stay inside the plate.
- Status messages ("Oops!", "Time's up!") display in a rounded bubble above the ship.

### 3.5 Answer Arrows & Idle Blip Attention Wave
- 4 chevron arrows spawn at $x = 1030\text{ px}$, scroll in screen space at $110\text{ px/s}$, and hold at $x = 600\text{ px}$ (drawn above all ships).
- Idle blip wave starts $2.0\text{s}$ after spawn ($1.0 \to 1.14 \to 1.0$), accelerating in the last $3\text{s}$ before $9\text{s}$ timeout.

### 3.6 Phase Machine & In-Game Results
- State machine: `COUNTDOWN -> RACING -> FINISHING -> RESULTS`.
- `FINISHING -> RESULTS`: When the human crosses the finish line $+ 1\text{s}$, or after $12\text{s}$ watchdog.
- `RESULTS`: All timers and rAF loop stopped via `stopAll()`. Displays custom in-game Results screen with shared competition places, times, Accuracy %, Rate/min, Missed Questions, `PLAY AGAIN` and `END GAME`.

---

## 4. Change Log

- **Orbit Integers v1.0:** Integer arithmetic space race added (Subject: Integers). 4 pods (Blue Human + 3 Bots in Yellow, Red, Orange) drift at constant speed along a 3,000 px Catmull-Rom spline orbit path past planets and asteroids. Correct answers add +1 step (`200 px`), display position and heading smoothed with exponential decay, 120 px camera lookahead, 1.5s lockout on wrong answers with green answer hint, dynamic opponent gap pills (`▲ 2` / `▼ 1`), 2.5s post-human finish timer with projected bot times, and comprehensive 12,000+ case unit test suite.
- **Demolition Division v1.0:** Division solo desert shooter game added. 6-stage 60s timed rounds, dual tank visual variants (red front-facing & yellow angled), telegraphed enemy shells with stun effect, ray-cast aiming and firing, barrel rotation with arrow keys or mouse click, question generation with exact division invariants, Try Again danger line pause, and full Results screen.
- **Space Race v1.2:** Camera follows human at $x=300$, `CATCH_UP = false`, `STEP_PX = 180`, `LAP_LENGTH = 1800`, `S_FINISH = 5750`, all bots at 70% accuracy, persistent lane swapping, nozzle-anchored flame at `(10, 58)`, auto-fit hull plate, and 2.0s idle blip attention wave.
- **Space Race v1.1:** Orbit look with rotating moon group and parallax sky layers about $C = (505, 2100)$, teal-grey moon surface with craters and crystals, polished ship art and avatar, moon-conforming sliced grandstands, lane steering with bank angle, answer arrows holding at $x=600$ above ships, and idle blip attention wave.
- **Space Race v1.0:** Multiplication subject, 3-lap space race on the moon, hull question plate, 4-lane chevron answer arrows, unified gates with grandstand spectators, lap ring with clockwise progress, phase machine, in-game Results screen, and 1,000-race simulation test suite.
- **Island Chase v1.2:** Phase machine (`COUNTDOWN -> RACING -> FINISHING -> RESULTS`), custom in-game Results screen with competition ranking (shared ties), Accuracy %, Rate/min, Missed Questions, PLAY AGAIN / END GAME, and +1 step advance per correct answer.
- **Alien Addition v1.4:** 6-stage progression system with decreasing timers (60s -> 50s -> 40s -> 30s -> 20s -> 10s) and Grand Victory celebration screen.
- **Jumping Chicks v1.0:** 4-chick counting arcade race across lily pads to the trophy nest.
