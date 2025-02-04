const VIDEOS_INFO = {
  french: {
    name: 'French Defense',
    title: '– A Solid Fortress for Black!',
    description:
      'Looking for a reliable and strategic opening as Black? In this tutorial, we’ll break down the French Defense, a powerful choice that allows you to build a strong pawn structure while counterattacking White’s center. Learn key plans, typical middlegame ideas, and how to handle White’s main responses!',
  },
  italian: {
    name: 'Italian Game',
    title: '– Classic, Aggressive, and Full of Traps!',
    description:
      'The Italian Game is one of the oldest and most popular chess openings, perfect for players who love fast development and active piece play. In this lesson, we’ll explore the key ideas behind this opening, including the Giuoco Piano and Evans Gambit, so you can launch devastating attacks against your opponents!',
  },
  scandinavian: {
    name: 'Scandinavian',
    title: 'Defense – Surprise Your Opponent with Early Counterplay!',
    description:
      'The Scandinavian Defense is an exciting and aggressive opening for Black, immediately challenging White’s center with 1. e4 d5. In this tutorial, we’ll examine different variations, including the modern and classical approaches, and show you how to seize the initiative early in the game!',
  },
  scotch: {
    name: 'Scotch Game',
    title: '– A Dynamic and Tactical Opening!',
    description:
      'The Scotch Game leads to open positions and sharp tactical battles, making it a favorite among aggressive players. In this video, we’ll uncover the key ideas, best move orders, and common traps to watch out for, so you can master this opening and put your opponents under early pressure!',
  },
};

export function convertVideoInfo(path: string) {
  const convertedPath = path
    .replace('openings/', '')
    .replace('.mp4', '') as keyof typeof VIDEOS_INFO;

  return VIDEOS_INFO[convertedPath];
}
