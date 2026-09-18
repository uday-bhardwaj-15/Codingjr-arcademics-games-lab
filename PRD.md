Jumping Chicks — Product & Technical Design Doc
Game #1 on a scalable, multi-game Next.js arcade platform

1. Vision
   Build a Next.js arcade platform that can host many small browser games (starting with Jumping Chicks, a counting/matching game), with:

No backend, no database — all state lives client-side (localStorage)
A game-agnostic core (player profiles, session engine, leaderboard, sound, storage) so game #2, #3, #4 plug in without touching game #1
Each match: 1 human + 3 bots, everyone plays independently and continuously — nobody waits on anyone else
Wrong answers never end the game — you just get dunked and respawn on the spot 2. Platform Architecture (scalable to N games)
2.1 Core principle: "Game Module" pattern
Every game is a self-contained folder exposing a manifest + a root component. A central registry lists all games; the hub/lobby page renders itself from that registry. Adding game #2 means adding one new folder + one registry entry — nothing in jumping-chicks/ or core/ changes.

src/
├── app/ # Next.js App Router (routes only, thin)
│ ├── page.tsx # Arcade hub — lists all games from registry
│ ├── games/
│ │ └── [gameId]/
│ │ ├── page.tsx # Lobby (matches screenshot 2)
│ │ ├── play/page.tsx # Active match (matches screenshot 1)
│ │ └── results/page.tsx # Leaderboard for that match
│ └── layout.tsx
│
├── games/ # ⭐ one folder per game — fully isolated
│ └── jumping-chicks/
│ ├── manifest.ts # id, title, thumbnail, route, config schema
│ ├── engine/
│ │ ├── roundGenerator.ts # picks target number + 4 platform options
│ │ ├── botAI.ts # bot decision + reaction-time simulation
│ │ └── sessionMachine.ts # per-player state machine (see §4.6)
│ ├── components/
│ │ ├── Scene.tsx # sky/trees/pond background
│ │ ├── PlatformCluster.tsx # one leaf/petal group (clickable)
│ │ ├── Chick.tsx # player avatar (idle/jump/fall states)
│ │ ├── NumberBanner.tsx # the target-number display
│ │ ├── ProgressRail.tsx # right-side vertical race track
│ │ └── SplashFX.tsx # wrong-answer dunk animation
│ ├── hooks/
│ │ └── usePlayerRound.ts # drives one player's independent loop
│ ├── types.ts
│ ├── constants.ts # NUMBER_RANGE, ROUNDS_TO_WIN, etc.
│ └── assets/ # sprites/sounds scoped to this game
│
├── core/ # ⭐ shared by every game, forever
│ ├── components/
│ │ ├── Lobby/ # generic "N/4 ready, START/LEAVE" UI
│ │ ├── Leaderboard/ # generic ranked results table
│ │ └── PlayerBadge/
│ ├── state/
│ │ ├── useMatchStore.ts # zustand store: players, status, scores
│ │ └── storage.ts # typed localStorage read/write + versioning
│ ├── types/
│ │ ├── player.ts # PlayerProfile, BotProfile
│ │ └── match.ts # MatchSession, MatchResult
│ ├── audio/soundManager.ts
│ └── utils/random.ts
│
├── lib/
│ └── gameRegistry.ts # ⭐ single source of truth: array of manifests
│
└── styles/
// lib/gameRegistry.ts — adding a new game = adding one entry here
export const gameRegistry: GameManifest[] = [
jumpingChicksManifest,
// memoryMatchManifest, <- game #2 later, zero changes to game #1
];
Why this shape: the hub page, the lobby, and the leaderboard are all generic — they read PlayerProfile[] and MatchResult[], not Chick. Only games/jumping-chicks/ knows what a "chick" or a "petal" is. This is what makes it scalable without a database or monorepo tooling — it's just disciplined folder boundaries inside one Next.js app. (If you eventually have many contributors/teams, this same structure lifts cleanly into a Turborepo later — not needed at your current scale.)

2.2 Tech stack
Concern Choice Why
Framework Next.js 14/15, App Router, TypeScript your ask
Visual style 2.5D layered sprites + CSS/SVG "3D" perspective (see §5) — Framer Motion for jump/fall/idle transitions matches the reference screenshots exactly (they're pre-rendered art composited on a gradient field, not a live 3D engine); far cheaper to build/tune than WebGL
State Zustand + persist middleware → localStorage tiny, no boilerplate, easy per-game namespacing
Storage core/state/storage.ts — typed wrapper, versioned keys safe schema upgrades later
Styling Tailwind fast iteration
Audio (optional) Howler.js or native Audio correct chime / splash sfx
Bots Pure client-side timers + weighted RNG, no AI/LLM needed deterministic, cheap, tunable difficulty
Alternative: if you specifically want true 3D (WebGL depth, camera movement, rotating chicks) rather than the flat pre-rendered look in your screenshots, swap the rendering layer for React Three Fiber. Everything above components/ in the folder tree stays identical — only Scene.tsx, Chick.tsx, PlatformCluster.tsx change internally. I'd only recommend this if you have 3D model assets already, since it's meaningfully more build time for a visual style the source game doesn't actually use.

3. Game Design — Jumping Chicks
   3.1 Players
   Always 4 seats: 1 human + 3 bots (matches screenshot 2's lobby exactly)
   Each seat = a PlayerProfile { id, name, color, isBot }
   Colors fixed: blue (human default), yellow, red, orange
   3.2 Core loop (per round)
   System generates a target number (default range 1–10) and 4 platform clusters, each rendering a distinct leaf/petal count. Exactly one cluster's count equals the target; the other 3 are distractors (no duplicate counts).
   Target number shown in the banner.
   Player selects a cluster (click/tap for human; bot AI "decides" after a simulated reaction delay).
   Correct → chick hops onto that platform, progress advances one step on their personal rail, a brand-new round is generated immediately for that player only.
   Wrong → chick falls into the water at that platform, a splash plays, chick respawns standing at that same spot after a short beat, and gets a fresh round (same or new target — configurable). No life lost, no reset to start.
   Steps 1–5 repeat independently per player — a fast bot might be on round 9 while the human is on round 2. Nobody's screen blocks on anyone else. (This is the "no one waits" behavior you described.)
   3.3 Win condition / match end
   Each player has a personal progress rail (right-side vertical bar in your screenshot) divided into N segments (default 10, configurable in constants.ts).
   First player to bank N correct answers finishes; they keep idling in a "finished" pose while the rest continue.
   Match ends when all 4 players finish (or an optional max-time cap you set) → route to Results/Leaderboard.
   Ranking: 1st = fewest total rounds/time to finish; ties broken by fewest wrong answers.
   3.4 Bot AI (simple, tunable, no ML needed)
   Per bot: reactionTimeMs (random within a band, e.g. 800–2500ms) and accuracy (e.g. 70–95%).
   On accuracy roll = correct → bot picks the right cluster.
   On roll = wrong → bot picks a random wrong cluster (so bots visibly get dunked too — this matters for a kid watching, it feels fair).
   Difficulty knobs live in botAI.ts so you can add an easy/medium/hard bot roster later with zero engine changes.
   3.5 Screens (routes)
   Route Matches your screenshot Purpose
   / — Arcade hub, all games (just this one for now)
   /games/jumping-chicks Screenshot 2 Lobby — "0/1 ready", START/LEAVE
   /games/jumping-chicks/play Screenshot 1 Live match, 4 independent racers
   /games/jumping-chicks/results — Leaderboard: all 4 players ranked, "Play again"
4. Data Model
   // core/types/player.ts
   interface PlayerProfile {
   id: string;
   name: string; // "Player852", "Computer 2"...
   color: 'blue' | 'yellow' | 'red' | 'orange';
   isBot: boolean;
   botConfig?: { reactionMsRange: [number, number]; accuracy: number };
   }

// games/jumping-chicks/types.ts
interface RoundState {
targetNumber: number;
options: { id: string; count: number; isCorrect: boolean }[];
}

interface PlayerRunState {
playerId: string;
currentRound: RoundState;
correctCount: number;
wrongCount: number;
status: 'idle' | 'jumping' | 'falling' | 'respawning' | 'finished';
finishedAtMs?: number;
}

// core/types/match.ts
interface MatchResult {
gameId: string; // 'jumping-chicks'
playedAt: string; // ISO date
players: {
playerId: string;
name: string;
isBot: boolean;
rank: number;
correctCount: number;
wrongCount: number;
finishTimeMs: number;
}[];
} 5. LocalStorage schema
arcade:playerProfile → { id, name, color } (the human, persists across games)
arcade:leaderboard:<gameId> → MatchResult[] (append one entry per completed match)
arcade:settings:<gameId> → { numberRange, roundsToWin, soundOn, ... }
All keys go through core/state/storage.ts, which stamps a schemaVersion so you can migrate safely when a game's shape changes later.

6. Visual asset spec (Option A — recommended, matches your screenshots)
   Layered 2D sprites over a CSS-gradient sky, arranged with slight perspective (transform: scale() + shadows) to read as "3D-ish" without a 3D engine:

Layer Asset Notes
Background sky gradient (CSS) + tree clusters trees can be one SVG repeated/scattered
Water/ground pond ring / green platform 2 static images
Platforms one single leaf/petal sprite, arranged programmatically in clusters of N i.e. you only need one leaf asset — the engine renders count-many of them per cluster, not 10 pre-made cluster images
Chicks 4 color variants × 4 poses (idle, jump, fall/splash, celebrate) can start as simple recolored SVGs, upgrade later
UI number banner, START/LEAVE buttons, progress rail can be built in Tailwind, no image assets needed 7. Explicit assumptions (flag if any are wrong)
Independent per-player rounds — each of the 4 players sees their own number/options and advances the instant they answer, never blocked by others. (Directly from your "no player will wait" note.)
Respawn = same spot, no penalty beyond time — a wrong answer costs time, not progress or a "life." There is no game-over state, ever.
Match ends when all 4 finish — then leaderboard shows. (Could instead end when the human finishes, or after a fixed timer — your call, see below.)
Number range defaults to 1–10, 4 options per round, matching your screenshots. 8. Information / decisions I need from you
Quick decisions:

Confirm the win condition: all 4 finish vs human finishes vs fixed timer ends the match
Number range per round (1–10? higher for older kids?)
How many correct answers to "finish" a race (default 10)?
Sound on by default, or silent v1?
Mobile/touch support required for v1, or desktop-first?
Assets (optional — I can build clean placeholder/CSS versions for all of these if you don't have source files):

Chick sprites per color × pose (or okay with simple placeholder shapes to start)
Single leaf/petal sprite (engine tiles it into clusters)
Background art (trees, sky, pond) or okay with CSS/SVG placeholders
Sound effects (correct chime, splash) — optional for v1
App/platform name + brand color for the arcade hub (since more games are coming) 9. Suggested build order
Scaffold Next.js app + core/ (storage, player profile, generic Lobby/Leaderboard UI)
Wire the game registry + hub page with just Jumping Chicks in it
Build jumping-chicks engine (round generator, bot AI, per-player state machine) with placeholder squares/numbers — no art yet, prove the loop works
Swap in real visuals (sprites/CSS scene) once mechanics feel right
Add sound (optional), polish animations, mobile pass
Once you confirm the decisions above, I'll scaffold the actual Next.js project.
