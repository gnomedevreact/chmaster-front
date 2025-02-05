export const whiteResults = {
  kings_gambit: {
    name: 'King’s Gambit',
    increase: 11,
  },
  scotch: {
    name: 'Scotch Game',
    increase: 28,
  },
  italian: {
    name: 'Italian Game',
    increase: 27,
  },
  ruy_lopez: {
    name: 'Ruy-Lopez',
    increase: 14,
  },
};

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    next: number | 'result';
    result?: keyof typeof whiteResults;
  }[];
}

export const questionsWhite: Question[] = [
  {
    id: 1,
    text: 'Do you prefer fast piece development and an aggressive attack on the king?',
    options: [
      { label: 'Yes', next: 2 },
      { label: 'No', next: 3 },
      { label: 'Not sure', next: 3 },
    ],
  },
  {
    id: 2,
    text: 'Are you comfortable sacrificing material for an aggressive attack?',
    options: [
      { label: 'Yes', next: 4 },
      { label: 'No', next: 5 },
      { label: 'Not sure', next: 5 },
    ],
  },
  {
    id: 3,
    text: 'Do you prefer a solid position with long-term control over the center?',
    options: [
      { label: 'Yes', next: 6 },
      { label: 'No', next: 4 },
      { label: 'Not sure', next: 6 },
    ],
  },
  {
    id: 4,
    text: 'Do you like launching early attacks at the risk of weakening your position?',
    options: [
      { label: 'Yes', next: 'result', result: 'kings_gambit' },
      { label: 'No', next: 'result', result: 'scotch' },
      { label: 'Not sure', next: 5 },
    ],
  },
  {
    id: 5,
    text: 'Do you enjoy sharp tactical battles over slow maneuvering?',
    options: [
      { label: 'Yes', next: 'result', result: 'scotch' },
      { label: 'No', next: 6 },
      { label: 'Not sure', next: 6 },
    ],
  },
  {
    id: 6,
    text: 'Do you like applying positional pressure over multiple moves rather than attacking immediately?',
    options: [
      { label: 'Yes', next: 7 },
      { label: 'No', next: 8 },
      { label: 'Not sure', next: 7 },
    ],
  },
  {
    id: 7,
    text: 'Do you enjoy long-term plans and maneuvering your pieces for maximum control?',
    options: [
      { label: 'Yes', next: 'result', result: 'ruy_lopez' },
      { label: 'No', next: 'result', result: 'italian' },
      { label: 'Not sure', next: 8 },
    ],
  },
  {
    id: 8,
    text: 'Do you prefer playing it safe and keeping a strong pawn structure?',
    options: [
      { label: 'Yes', next: 'result', result: 'italian' },
      { label: 'No', next: 'result', result: 'scotch' },
      { label: 'Not sure', next: 'result', result: 'scotch' },
    ],
  },
];
