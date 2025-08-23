// Split game data for better performance
export const coreGameData = [
  {
    id: 'math-adventure',
    title: 'Petualangan Matematika',
    emoji: '🧮',
    description: 'Belajar matematika dengan petualangan seru!',
    difficulty: 'medium' as const,
    category: 'Matematika',
    path: '/games/math-adventure'
  },
  {
    id: 'memory-animals',
    title: 'Memory Hewan',
    emoji: '🐱',
    description: 'Cocokkan kartu hewan yang sama!',
    difficulty: 'easy' as const,
    category: 'Memori',
    path: '/games/memory-animals'
  },
  {
    id: 'spelling-game',
    title: 'Tebak Ejaan',
    emoji: '📝',
    description: 'Eja kata dengan benar!',
    difficulty: 'medium' as const,
    category: 'Bahasa',
    path: '/games/spelling-game'
  },
  {
    id: 'color-patterns',
    title: 'Pola Warna',
    emoji: '🌈',
    description: 'Ikuti pola warna yang muncul!',
    difficulty: 'medium' as const,
    category: 'Logika',
    path: '/games/color-patterns'
  },
  {
    id: 'count-fruits',
    title: 'Hitung Buah',
    emoji: '🍎',
    description: 'Hitung buah-buahan!',
    difficulty: 'easy' as const,
    category: 'Matematika',
    path: '/games/count-fruits'
  },
  {
    id: 'interactive-story',
    title: 'Cerita Interaktif',
    emoji: '📚',
    description: 'Petualangan cerita pilihan!',
    difficulty: 'easy' as const,
    category: 'Cerita',
    path: '/games/interactive-story'
  }
];

// Lazy load extended game data
export const getExtendedGameData = async () => {
  const { games } = await import('./gameData');
  return games;
};