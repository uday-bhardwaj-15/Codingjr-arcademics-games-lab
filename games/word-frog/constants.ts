import { WordFrogSettings, AntonymPair } from './types';

export const DEFAULT_SETTINGS: WordFrogSettings = {
  category: 'antonyms',
  speed: 'normal',
  durationSeconds: 60,
  soundOn: true,
};

// 6 Fly Spawn Coordinates centered around the frog (GameWindow 1010 x 577)
// Center Frog is at (505, 240), Bottom HUD is at (0, 505) to (1010, 577)
export const FLY_POSITIONS: Array<{ x: number; y: number; keyNum: number }> = [
  { x: 235, y: 125, keyNum: 1 }, // 0: Top-Left (safely below top bar)
  { x: 775, y: 125, keyNum: 2 }, // 1: Top-Right (safely below top bar)
  { x: 165, y: 260, keyNum: 3 }, // 2: Mid-Left
  { x: 845, y: 260, keyNum: 4 }, // 3: Mid-Right
  { x: 250, y: 395, keyNum: 5 }, // 4: Bottom-Left
  { x: 760, y: 395, keyNum: 6 }, // 5: Bottom-Right
];

// Rich Curated Vocabulary Database
export const ANTONYMS_LIST: AntonymPair[] = [
  { prompt: 'After', answer: 'Before' },
  { prompt: 'Sit', answer: 'Stand' },
  { prompt: 'Take', answer: 'Give' },
  { prompt: 'Go', answer: 'Stop' },
  { prompt: 'Hot', answer: 'Cold' },
  { prompt: 'Fast', answer: 'Slow' },
  { prompt: 'Happy', answer: 'Sad' },
  { prompt: 'Up', answer: 'Down' },
  { prompt: 'Big', answer: 'Small' },
  { prompt: 'Hard', answer: 'Soft' },
  { prompt: 'Dark', answer: 'Light' },
  { prompt: 'Begin', answer: 'End' },
  { prompt: 'Quiet', answer: 'Loud' },
  { prompt: 'Clean', answer: 'Dirty' },
  { prompt: 'Win', answer: 'Lose' },
  { prompt: 'Early', answer: 'Late' },
  { prompt: 'Near', answer: 'Far' },
  { prompt: 'Strong', answer: 'Weak' },
  { prompt: 'Open', answer: 'Close' },
  { prompt: 'Rich', answer: 'Poor' },
  { prompt: 'Young', answer: 'Old' },
  { prompt: 'Heavy', answer: 'Light' },
  { prompt: 'Safe', answer: 'Dangerous' },
  { prompt: 'Smooth', answer: 'Rough' },
  { prompt: 'Thick', answer: 'Thin' },
  { prompt: 'Sweet', answer: 'Sour' },
  { prompt: 'True', answer: 'False' },
  { prompt: 'Above', answer: 'Below' },
  { prompt: 'Always', answer: 'Never' },
  { prompt: 'Full', answer: 'Empty' },
  { prompt: 'First', answer: 'Last' },
  { prompt: 'Push', answer: 'Pull' },
  { prompt: 'Right', answer: 'Wrong' },
  { prompt: 'Sharp', answer: 'Dull' },
  { prompt: 'Tight', answer: 'Loose' },
  { prompt: 'Alive', answer: 'Dead' },
  { prompt: 'Brave', answer: 'Afraid' },
  { prompt: 'Create', answer: 'Destroy' },
  { prompt: 'Friend', answer: 'Enemy' },
  { prompt: 'Freeze', answer: 'Melt' },
  { prompt: 'Giant', answer: 'Tiny' },
  { prompt: 'Inside', answer: 'Outside' },
  { prompt: 'Laugh', answer: 'Cry' },
  { prompt: 'Love', answer: 'Hate' },
  { prompt: 'North', answer: 'South' },
  { prompt: 'Peace', answer: 'War' },
  { prompt: 'Public', answer: 'Private' },
  { prompt: 'Rise', answer: 'Fall' },
  { prompt: 'Simple', answer: 'Complex' },
  { prompt: 'Start', answer: 'Finish' },
  { prompt: 'Sunny', answer: 'Rainy' },
  { prompt: 'Tame', answer: 'Wild' },
  { prompt: 'Under', answer: 'Over' },
  { prompt: 'Wide', answer: 'Narrow' },
  { prompt: 'Day', answer: 'Night' },
  { prompt: 'Dry', answer: 'Wet' },
  { prompt: 'High', answer: 'Low' },
  { prompt: 'Pass', answer: 'Fail' },
  { prompt: 'Front', answer: 'Back' },
  { prompt: 'True', answer: 'False' },
];

export const SYNONYMS_LIST: AntonymPair[] = [
  { prompt: 'Big', answer: 'Large' },
  { prompt: 'Quick', answer: 'Fast' },
  { prompt: 'Glad', answer: 'Happy' },
  { prompt: 'Small', answer: 'Tiny' },
  { prompt: 'Smart', answer: 'Clever' },
  { prompt: 'Begin', answer: 'Start' },
  { prompt: 'Shut', answer: 'Close' },
  { prompt: 'Calm', answer: 'Peaceful' },
  { prompt: 'Gift', answer: 'Present' },
  { prompt: 'Tired', answer: 'Sleepy' },
  { prompt: 'Simple', answer: 'Easy' },
  { prompt: 'Correct', answer: 'Right' },
  { prompt: 'Chilly', answer: 'Cold' },
  { prompt: 'Silent', answer: 'Quiet' },
  { prompt: 'Brave', answer: 'Courageous' },
  { prompt: 'Wealthy', answer: 'Rich' },
  { prompt: 'Neat', answer: 'Tidy' },
  { prompt: 'Loud', answer: 'Noisy' },
];

export const HOMOPHONES_LIST: AntonymPair[] = [
  { prompt: 'Hear', answer: 'Here' },
  { prompt: 'See', answer: 'Sea' },
  { prompt: 'Right', answer: 'Write' },
  { prompt: 'Son', answer: 'Sun' },
  { prompt: 'Night', answer: 'Knight' },
  { prompt: 'Pair', answer: 'Pear' },
  { prompt: 'Two', answer: 'Too' },
  { prompt: 'Bored', answer: 'Board' },
  { prompt: 'Flour', answer: 'Flower' },
  { prompt: 'Tail', answer: 'Tale' },
  { prompt: 'Meat', answer: 'Meet' },
  { prompt: 'Piece', answer: 'Peace' },
  { prompt: 'Witch', answer: 'Which' },
  { prompt: 'Brake', answer: 'Break' },
  { prompt: 'Stare', answer: 'Stair' },
];

// General pool of filler words for high quality distractors
export const DISTRACTOR_POOL = [
  'Sit', 'Him', 'Go', 'Ride', 'Take', 'Jump', 'Walk', 'Play',
  'Read', 'Look', 'Sing', 'Swim', 'Fly', 'Run', 'Hold', 'Find',
  'Keep', 'Tell', 'Help', 'Come', 'Make', 'Say', 'See', 'Know',
  'Think', 'Good', 'New', 'First', 'Last', 'Long', 'Great', 'Little',
  'Other', 'Old', 'Right', 'Big', 'High', 'Small', 'Next', 'Early',
  'Young', 'Few', 'Both', 'Same', 'Sure', 'Kind', 'True', 'Fine'
];
