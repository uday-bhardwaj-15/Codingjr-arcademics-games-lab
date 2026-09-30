import assert from 'node:assert';

function generateDivisionQuestions(count = 10) {
  const questions = [];
  const pool = [];

  for (let divisor = 1; divisor <= 10; divisor++) {
    for (let quotient = 1; quotient <= 10; quotient++) {
      pool.push({
        dividend: divisor * quotient,
        divisor,
        quotient,
      });
    }
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  let poolIdx = 0;
  while (questions.length < count) {
    const item = shuffled[poolIdx % shuffled.length];
    poolIdx++;

    const optionsSet = new Set([item.quotient]);
    const candidates = [
      item.quotient + 1,
      item.quotient - 1,
      item.quotient + 2,
      item.quotient - 2,
      item.quotient + 3,
      item.quotient - 3,
      item.divisor,
    ].filter((val) => val > 0 && val !== item.quotient);

    for (const cand of candidates.sort(() => Math.random() - 0.5)) {
      if (optionsSet.size >= 4) break;
      optionsSet.add(cand);
    }

    let fallback = 1;
    while (optionsSet.size < 4) {
      if (!optionsSet.has(fallback)) optionsSet.add(fallback);
      fallback++;
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(item.quotient);

    questions.push({
      id: `q_${questions.length + 1}`,
      dividend: item.dividend,
      divisor: item.divisor,
      quotient: item.quotient,
      prompt: `${item.dividend} ÷ ${item.divisor}`,
      options,
      correctIndex,
    });
  }

  return questions;
}

console.log('Testing Drag Race Division Question Generator...');

for (let iter = 0; iter < 100; iter++) {
  const questions = generateDivisionQuestions(10);
  assert.strictEqual(questions.length, 10, 'Must generate 10 questions');

  for (const q of questions) {
    assert.ok(q.dividend > 0, `Dividend must be > 0, got ${q.dividend}`);
    assert.ok(q.divisor > 0, `Divisor must be > 0, got ${q.divisor}`);
    assert.strictEqual(q.dividend / q.divisor, q.quotient, `Division must be exact: ${q.dividend} / ${q.divisor} = ${q.quotient}`);
    assert.strictEqual(q.options.length, 4, 'Must have 4 options');

    const uniqueOptions = new Set(q.options);
    assert.strictEqual(uniqueOptions.size, 4, 'Options must be unique');
    assert.ok(uniqueOptions.has(q.quotient), 'Options must include correct quotient');
    assert.strictEqual(q.options[q.correctIndex], q.quotient, 'correctIndex must point to quotient');
  }
}

console.log('All 1000 division questions validated successfully! 100% test pass.');
