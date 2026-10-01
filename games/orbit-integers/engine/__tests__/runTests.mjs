import {
  generateIntegerQuestion,
  formatIntegerPrompt,
  formatInteger,
} from '../questionGenerator.js';
import { calculateStepGap, calculateProjectedFinishTime, rankPods } from '../raceMath.js';
import { STEP_PX, COURSE_LENGTH } from '../../constants.js';

console.log('--- RUNNING ORBIT INTEGERS ENGINE TEST SUITE ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  passedTests++;
}

// 1. Test Prompt Formatting
console.log('\nTesting Integer Display & Formatting:');
assert(formatInteger(-5) === '−5', 'Negative number uses real minus sign');
assert(formatInteger(7) === '7', 'Positive number formats correctly');
assert(formatIntegerPrompt(5, -3, '+') === '5 + (−3)', 'Negative second operand gets parentheses');
assert(formatIntegerPrompt(3, -2, '−') === '3 − (−2)', 'Subtraction with negative second operand');
assert(formatIntegerPrompt(-4, -6, '−') === '−4 − (−6)', 'Double negative subtraction prompt');
assert(formatIntegerPrompt(-4, 7, '+') === '−4 + 7', 'Negative first operand has no outer parens');
console.log('✅ Formatting tests passed.');

// 2. Test 1,000 Questions across multiple ranges
console.log('\nTesting 1,000 Integer Question Invariants across diverse ranges:');
const testRanges = [
  { from: -10, to: 10, op: 'mixed' },
  { from: -20, to: 20, op: 'add' },
  { from: -15, to: 5, op: 'subtract' },
  { from: -5, to: 5, op: 'mixed' },
  { from: -12, to: 12, op: 'mixed' },
];

for (const config of testRanges) {
  for (let i = 0; i < 200; i++) {
    const q = generateIntegerQuestion(config.from, config.to, config.op);

    // Invariant 1: Operands within range
    assert(
      q.a >= config.from && q.a <= config.to,
      `Operand a (${q.a}) outside [${config.from}, ${config.to}]`
    );
    assert(
      q.b >= config.from && q.b <= config.to,
      `Operand b (${q.b}) outside [${config.from}, ${config.to}]`
    );

    // Invariant 2: Mathematical correctness
    const expectedAns = q.op === '+' ? q.a + q.b : q.a - q.b;
    assert(
      q.answer === expectedAns,
      `Answer ${q.answer} does not match expected calculation ${expectedAns}`
    );

    // Invariant 3: Answer within range
    assert(
      q.answer >= config.from && q.answer <= config.to,
      `Answer ${q.answer} outside [${config.from}, ${config.to}]`
    );

    // Invariant 4: 4 options
    assert(q.options.length === 4, `Question does not have exactly 4 options (has ${q.options.length})`);

    // Invariant 5: Unique options
    const optionValues = q.options.map((o) => o.value);
    const uniqueValues = new Set(optionValues);
    assert(
      uniqueValues.size === 4,
      `Options are not unique: ${JSON.stringify(optionValues)}`
    );

    // Invariant 6: All options within [from, to]
    for (const opt of q.options) {
      assert(
        opt.value >= config.from && opt.value <= config.to,
        `Option value ${opt.value} outside [${config.from}, ${config.to}]`
      );
    }

    // Invariant 7: Exactly 1 correct option
    const correctOpts = q.options.filter((o) => o.isCorrect);
    assert(correctOpts.length === 1, `Question does not have exactly 1 correct option`);
    assert(
      correctOpts[0].value === q.answer,
      `Correct option value ${correctOpts[0].value} does not match question answer ${q.answer}`
    );
  }
}
console.log('✅ 1,000 Question Invariant tests passed successfully.');

// 3. Test Step Gap calculation
console.log('\nTesting Step Gap calculation:');
assert(calculateStepGap(400, 0) === 2, '2 steps ahead gives +2');
assert(calculateStepGap(0, 200) === -1, '1 step behind gives -1');
assert(calculateStepGap(200, 200) === 0, 'Equal distance gives 0');
console.log('✅ Step Gap tests passed.');

// 4. Test Pod Ranking
console.log('\nTesting Pod Ranking:');
const testPods = [
  { id: '1', name: 'Bot 1', finishedAtMs: 15000, wrongCount: 1, logicalS: COURSE_LENGTH },
  { id: '2', name: 'Player', finishedAtMs: 12000, wrongCount: 0, logicalS: COURSE_LENGTH },
  { id: '3', name: 'Bot 2', projectedFinishTimeMs: 18000, wrongCount: 2, logicalS: 2000 },
];
const ranked = rankPods(testPods);
assert(ranked[0].name === 'Player', 'Fastest pod is ranked 1st');
assert(ranked[1].name === 'Bot 1', 'Second fastest pod is ranked 2nd');
assert(ranked[2].name === 'Bot 2', 'Projected finish pod is ranked 3rd');
console.log('✅ Ranking tests passed.');

console.log(`\n🎉 ALL ${passedTests} / ${totalTests} TESTS PASSED CLEANLY!`);
