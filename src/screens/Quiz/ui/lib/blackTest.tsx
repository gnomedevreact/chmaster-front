export const blackResults = {
  french_defense: {
    name: 'French Defense',
    increase: 24,
  },
  scandinavian: {
    name: 'Scandinavian Defense',
    increase: 26,
  },
  sicilian_defense: {
    name: 'Sicilian Defense',
    increase: 16,
  },
  caro_kann: {
    name: 'Caro-Kann Defense',
    increase: 12,
  },
};

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    next: number | 'result';
    result?: keyof typeof blackResults;
  }[];
}

export const questionsBlack: Question[] = [
  {
    id: 1,
    text: 'Do you like to immediately challenge White’s control of the center?',
    options: [
      { label: 'Yes', next: 2 },
      { label: 'No', next: 3 },
      { label: 'Not sure', next: 3 },
    ],
  },
  {
    id: 2,
    text: 'Do you prefer an open and tactical game rather than a slow, strategic battle?',
    options: [
      { label: 'Yes', next: 4 },
      { label: 'No', next: 5 },
      { label: 'Not sure', next: 5 },
    ],
  },
  {
    id: 3,
    text: 'Do you prefer a solid, defensive setup with strong pawn structures?',
    options: [
      { label: 'Yes', next: 6 },
      { label: 'No', next: 4 },
      { label: 'Not sure', next: 6 },
    ],
  },
  {
    id: 4,
    text: 'Do you like counterattacking immediately, even if it means weakening your position?',
    options: [
      { label: 'Yes', next: 'result', result: 'scandinavian' },
      { label: 'No', next: 5 },
      { label: 'Not sure', next: 5 },
    ],
  },
  {
    id: 5,
    text: 'Do you enjoy sharp tactical battles and playing for active piece play?',
    options: [
      { label: 'Yes', next: 'result', result: 'sicilian_defense' },
      { label: 'No', next: 6 },
      { label: 'Not sure', next: 6 },
    ],
  },
  {
    id: 6,
    text: 'Do you prefer a flexible but defensive approach, preparing counterattacks later?',
    options: [
      { label: 'Yes', next: 7 },
      { label: 'No', next: 8 },
      { label: 'Not sure', next: 7 },
    ],
  },
  {
    id: 7,
    text: 'Do you like controlling the center with a strong pawn chain and slow maneuvering?',
    options: [
      { label: 'Yes', next: 'result', result: 'french_defense' },
      { label: 'No', next: 'result', result: 'caro_kann' },
      { label: 'Not sure', next: 8 },
    ],
  },
  {
    id: 8,
    text: 'Do you want a safe, structured opening that minimizes risks while still fighting for the center?',
    options: [
      { label: 'Yes', next: 'result', result: 'caro_kann' },
      { label: 'No', next: 'result', result: 'french_defense' },
      { label: 'Not sure', next: 'result', result: 'scandinavian' },
    ],
  },
];
