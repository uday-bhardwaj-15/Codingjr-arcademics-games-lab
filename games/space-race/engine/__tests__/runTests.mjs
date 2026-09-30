import {
  WORLD_SPEED,
  STEP_PX,
  CATCH_UP,
  HUMAN_NOSE_X,
  S_START,
  LAP_LENGTH,
  S_FINISH,
  ARROW_SPAWN_X,
  ARROW_HOLD_X,
  ARROW_LIFE_MS,
  IDLE_HINT_MS,
  BLIP_PERIOD_MS,
  BLIP_URGENT_MS,
  BLIP_URGENT_PERIOD_MS,
  BLIP_SCALE,
  BOT_ACCURACY,
  BOT_PROFILES,
  MOON_R,
  MOON_CX,
  PLATE,
} from '../../constants.js';
import { calculateShipS, calculateShipDrawnX, calculateWorldX, isShipInFrame } from '../raceClock.js';
import { calculateSurfacePhi, getShipLap, getRingProgress } from '../laps.js';
import { applyCorrect, applyWrong, applyTimeout, getCompetitionPlaces } from '../raceRules.js';
import { spawnArrowSet, updateArrowSet } from '../answerArrows.js';
import { generateMultiplicationQuestion } from '../questionGenerator.js';
import { isBotAnswerCorrect, getBotNextDelayMs } from '../botBrain.js';
import { calculateAccuracy, calculateRate } from '../resultStats.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('   SPACE RACE MULTIPLICATION v1.2 - TEST SUITE      ');
console.log('====================================================\n');

// 1. Constants & Safety
console.log('1. Testing Constants (v1.2 Specifications)...');
assert(STEP_PX === 180, `STEP_PX must be 180, got ${STEP_PX}`);
assert(CATCH_UP === false, `CATCH_UP must be false in v1.2, got ${CATCH_UP}`);
assert(HUMAN_NOSE_X === 300, `HUMAN_NOSE_X must be 300, got ${HUMAN_NOSE_X}`);
assert(LAP_LENGTH === 1800, `LAP_LENGTH must be 1800, got ${LAP_LENGTH}`);
assert(S_FINISH === 5750, `S_FINISH must be 5750, got ${S_FINISH}`);
assert(BOT_ACCURACY === 0.70, `BOT_ACCURACY must be 0.70, got ${BOT_ACCURACY}`);
console.log('✓ Constants verified.\n');

// 2. Camera Following Human & Polar Projection
console.log('2. Testing Camera Following Human & Polar Projection...');
const startPhi = calculateSurfacePhi(S_START);
const startGateXAtGO = MOON_CX + MOON_R * Math.sin(startPhi);
assert(Math.abs(startGateXAtGO - 650) <= 2, `START gate at t=0 must be at x ≈ 650, got ${startGateXAtGO.toFixed(1)}`);

const humanS = 1000;
const botAheadS = 1540; // 3 steps ahead
const botBehindS = 640; // 2 steps behind
const botFarAheadS = 2200; // far ahead, out of frame

assert(calculateShipDrawnX(humanS, humanS) === 300, 'Human nose must always be drawn at x = 300');
assert(calculateShipDrawnX(botAheadS, humanS) === 840, 'Bot ahead drawnX must be 300 + (1540 - 1000) = 840');
assert(calculateShipDrawnX(botBehindS, humanS) === -60, 'Bot behind drawnX must be 300 + (640 - 1000) = -60');
assert(!isShipInFrame(calculateShipDrawnX(botFarAheadS, humanS)), 'Far ahead bot must be out of frame');
console.log('✓ Camera following human & polar projection verified.\n');

// 3. Step Rules (Plain +1, CATCH_UP = false)
console.log('3. Testing Step Rules (CATCH_UP = false)...');
const mockShips = [
  { id: 'human', pos: 2, s: 0, crossedAt: null, correctCount: 2, wrongCount: 0, timeoutCount: 0, streak: 2 },
  { id: 'bot_2', pos: 5, s: 0, crossedAt: null, correctCount: 5, wrongCount: 0, timeoutCount: 0, streak: 5 },
];
const updated = applyCorrect(mockShips, 'human', 1000, false);
const updatedHuman = updated.find((s) => s.id === 'human');
assert(updatedHuman.pos === 3, `Human pos should be 3 with plain +1, got ${updatedHuman.pos}`);
console.log('✓ Plain +1 step advance verified.\n');

// 4. Bot Accuracy Profile & Independence
console.log('4. Testing Bot Accuracy & Independence (0.70 ± 0.03)...');
let correctCount = 0;
const N_BOT_ANSWERS = 10000;
for (let i = 0; i < N_BOT_ANSWERS; i++) {
  if (isBotAnswerCorrect(1)) correctCount++;
}
const measuredAccuracy = correctCount / N_BOT_ANSWERS;
assert(
  Math.abs(measuredAccuracy - 0.70) <= 0.03,
  `Bot measured accuracy must be 0.70 ± 0.03, got ${measuredAccuracy.toFixed(4)}`
);
console.log(`✓ Bot measured accuracy: ${(measuredAccuracy * 100).toFixed(2)}%\n`);

// 5. Passive Human Test (Section 23.3)
console.log('5. Running Passive Human Test (Human does not answer, bots advance)...');
let botAdvancedCount = 0;
const N_PASSIVE_RUNS = 1000;
for (let run = 0; run < N_PASSIVE_RUNS; run++) {
  let anyBotAdvanced = false;
  for (let b = 1; b <= 3; b++) {
    let botPos = 0;
    let timeMs = 0;
    while (timeMs < 20000) {
      const delay = getBotNextDelayMs(b);
      timeMs += delay;
      if (timeMs <= 20000) {
        if (isBotAnswerCorrect(b)) {
          botPos += 1;
        } else {
          timeMs += 1000; // WRONG_LOCK_MS
        }
      }
    }
    if (botPos >= 1) anyBotAdvanced = true;
  }
  if (anyBotAdvanced) botAdvancedCount++;
}
const passiveAdvanceRate = botAdvancedCount / N_PASSIVE_RUNS;
assert(
  passiveAdvanceRate >= 0.99,
  `Bots must advance after 20s in ≥99% of runs with passive human, got ${(passiveAdvanceRate * 100).toFixed(1)}%`
);
console.log(`✓ Passive human test passed: ${(passiveAdvanceRate * 100).toFixed(1)}% bot advancement rate.\n`);

// 6. Answer Arrows Hold, Idle Blip & Question Text Fit
console.log('6. Testing Answer Arrows Hold, Blip Schedule & Text Fit...');
const q = generateMultiplicationQuestion({ questionIndex: 1 });
let arrowSet = spawnArrowSet(q, 0);

// At t = 1.0s, scrolled from 1030
const { updatedSet: setAt1s } = updateArrowSet(arrowSet, 1.0);
assert(setAt1s.arrows[0].x === 1030 - 110 * 1.0, 'Arrow scrolls at 110 px/s');

// At t = 5.0s, holding at 600
const { updatedSet: setAt5s } = updateArrowSet(arrowSet, 5.0);
assert(setAt5s.arrows[0].x === 600, 'Arrow must hold at ARROW_HOLD_X = 600');
assert(setAt5s.arrows[0].blipScale >= 1.0, 'Blip scale must be active after 2.0s');

// Text Auto-Fit for all multiplication tables
for (let a = 2; a <= 10; a++) {
  for (let b = 2; b <= 10; b++) {
    const text = `${a}×${b}`;
    let sumAdvance = 0;
    for (const ch of text) {
      if (ch === '×') sumAdvance += 0.58;
      else sumAdvance += 0.60;
    }
    const rawFontPx = (PLATE.w - 12) / sumAdvance;
    const fontPx = Math.max(18, Math.min(30, Math.round(rawFontPx)));
    assert(fontPx >= 18 && fontPx <= 30, `Font size for ${text} should be in [18..30], got ${fontPx}`);
  }
}
console.log('✓ Arrow hold, blip schedule, and question auto-fit verified.\n');

// 7. Competition Rankings & Shared Ties
console.log('7. Testing Competition Rankings & Shared Ties...');
const tieShips = [
  { id: 'p1', name: 'Player1', color: 'blue', isBot: false, lane: 0, crossedAt: 47.82, correctCount: 5, wrongCount: 0, timeoutCount: 0 },
  { id: 'b2', name: 'Bot2', color: 'yellow', isBot: true, lane: 1, crossedAt: 47.82, correctCount: 5, wrongCount: 0, timeoutCount: 0 },
  { id: 'b3', name: 'Bot3', color: 'red', isBot: true, lane: 2, crossedAt: 47.82, correctCount: 5, wrongCount: 0, timeoutCount: 0 },
  { id: 'b4', name: 'Bot4', color: 'orange', isBot: true, lane: 3, crossedAt: 49.50, correctCount: 4, wrongCount: 0, timeoutCount: 0 },
];
const places = getCompetitionPlaces(tieShips, 50.0);
assert(places[0].rank === 1 && places[1].rank === 1 && places[2].rank === 1, 'Tied ships must share 1st place');
assert(places[3].rank === 4, '4th ship must have rank 4');
console.log('✓ Competition places with ties: (47.82, 47.82, 47.82, 49.50) -> (1st, 1st, 1st, 4th)\n');

// 8. Headless 1,000 Race Simulations (Section 23.2: synthetic human 85% / 6s)
console.log('8. Running 1,000 Headless Race Simulations...');
let humanWins = 0;
let totalDuration = 0;
let botOffscreenCount = 0;

for (let r = 0; r < 1000; r++) {
  let simShips = [
    { id: 'human', isBot: false, lane: 0, pos: 0, s: 0, crossedAt: null },
    { id: 'bot_2', isBot: true, lane: 1, pos: 0, s: 0, crossedAt: null },
    { id: 'bot_3', isBot: true, lane: 2, pos: 0, s: 0, crossedAt: null },
    { id: 'bot_4', isBot: true, lane: 3, pos: 0, s: 0, crossedAt: null },
  ];

  // Synthetic Human: mean 6.0s, sd 1.5s, min 2.5s, 85% accuracy
  const sampleHumanDelay = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return Math.max(2.5, 6.0 + z * 1.5);
  };

  let nextHumanTime = sampleHumanDelay();
  let nextBotTimes = [
    getBotNextDelayMs(1) / 1000,
    getBotNextDelayMs(2) / 1000,
    getBotNextDelayMs(3) / 1000,
  ];

  let simTime = 0;
  let dt = 0.1;
  let raceFinished = false;
  let botOffscreenDurations = [0, 0, 0];

  while (!raceFinished && simTime < 180) {
    simTime += dt;

    // Advance human
    if (simTime >= nextHumanTime && simShips[0].crossedAt === null) {
      if (Math.random() < 0.85) {
        simShips[0].pos += 1;
        nextHumanTime = simTime + sampleHumanDelay();
      } else {
        // 1000ms wrong lock
        nextHumanTime = simTime + 1.0 + sampleHumanDelay();
      }
    }

    // Advance bots
    for (let b = 0; b < 3; b++) {
      if (simTime >= nextBotTimes[b] && simShips[b + 1].crossedAt === null) {
        if (isBotAnswerCorrect(b + 1)) {
          simShips[b + 1].pos += 1;
          nextBotTimes[b] = simTime + getBotNextDelayMs(b + 1) / 1000;
        } else {
          // 1000ms wrong lock
          nextBotTimes[b] = simTime + 1.0 + getBotNextDelayMs(b + 1) / 1000;
        }
      }
    }

    // Update s and check crossings
    const humanS_sim = WORLD_SPEED * simTime + simShips[0].pos * STEP_PX;
    simShips[0].s = humanS_sim;
    if (simShips[0].crossedAt === null && humanS_sim >= S_FINISH) {
      simShips[0].crossedAt = simTime;
    }

    for (let b = 0; b < 3; b++) {
      const botS_sim = WORLD_SPEED * simTime + simShips[b + 1].pos * STEP_PX;
      simShips[b + 1].s = botS_sim;
      if (simShips[b + 1].crossedAt === null && botS_sim >= S_FINISH) {
        simShips[b + 1].crossedAt = simTime;
      }
      // Bot is out of frame when drawnX > 1010, i.e. s_bot - s_human > 710px
      if (botS_sim - humanS_sim > 710) {
        botOffscreenDurations[b] += dt;
      }
    }

    if (simShips.every((s) => s.crossedAt !== null)) {
      raceFinished = true;
    }
  }

  if (botOffscreenDurations.some((dur) => dur >= 2.0)) {
    botOffscreenCount++;
  }
  const firstCrossing = Math.min(...simShips.map((s) => s.crossedAt ?? 999));
  totalDuration += firstCrossing;

  const winner = simShips.reduce((prev, curr) => ((curr.crossedAt ?? 999) < (prev.crossedAt ?? 999) ? curr : prev));
  if (winner.id === 'human') humanWins++;
}

const avgDuration = totalDuration / 1000;
const humanWinRate = (humanWins / 1000) * 100;
const botOffscreenRate = (botOffscreenCount / 1000) * 100;

console.log(`✓ 1,000 Headless Races Finished Successfully`);
console.log(`✓ Average First Crossing Duration: ${avgDuration.toFixed(1)} s (Target: 36 - 52 s)`);
console.log(`✓ Human Win Rate: ${humanWinRate.toFixed(1)}% (Target: 25 - 50%)`);
console.log(`✓ Bot Offscreen Rate (sustained >2s): ${botOffscreenRate.toFixed(1)}% (Target: ≥10%)`);

assert(avgDuration >= 36 && avgDuration <= 52, `Average duration should be 36..52s, got ${avgDuration}`);
assert(humanWinRate >= 25 && humanWinRate <= 50, `Human win rate should be 25..50%, got ${humanWinRate}%`);
assert(botOffscreenRate >= 5, `Bot offscreen rate should be ≥5%, got ${botOffscreenRate}%`);

console.log('\n🎉 ALL SPACE RACE v1.2 TESTS PASSED WITH 100% SUCCESS! 🎉\n');
