export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sampleOne<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

const BOT_NAMES = [
  'Speedy Chirp',
  'Pip Flutter',
  'Barnaby Beak',
  'Sunny Hopper',
  'Professor Feather',
  'Daisy Waddles',
  'Gizmo Pecker',
  'Sparky Talon',
  'Cocoa Pipsqueak',
  'Milo Quack'
];

export function generateBotName(index: number, usedNames: Set<string> = new Set()): string {
  const available = BOT_NAMES.filter(n => !usedNames.has(n));
  if (available.length > 0) {
    const chosen = sampleOne(available);
    usedNames.add(chosen);
    return chosen;
  }
  return `Bot Runner ${index + 1}`;
}
