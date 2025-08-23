export interface Game {
  id: string;
  title: string;
  emoji: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  path: string;
}

export const games: Game[] = [
  {
    id: 'math-adventure',
    title: 'Petualangan Matematika',
    emoji: '🧮',
    description: 'Belajar matematika dengan petualangan seru!',
    difficulty: 'medium',
    category: 'Matematika',
    path: '/games/math-adventure'
  },
  {
    id: 'memory-animals',
    title: 'Memory Hewan',
    emoji: '🐱',
    description: 'Cocokkan kartu hewan yang sama!',
    difficulty: 'easy',
    category: 'Memori',
    path: '/games/memory-animals'
  },
  {
    id: 'spelling-game',
    title: 'Tebak Ejaan',
    emoji: '📝',
    description: 'Eja kata dengan benar!',
    difficulty: 'medium',
    category: 'Bahasa',
    path: '/games/spelling-game'
  },
  {
    id: 'color-patterns',
    title: 'Pola Warna',
    emoji: '🌈',
    description: 'Ikuti pola warna yang muncul!',
    difficulty: 'medium',
    category: 'Logika',
    path: '/games/color-patterns'
  },
  {
    id: 'learn-clock',
    title: 'Belajar Jam',
    emoji: '🕐',
    description: 'Belajar membaca waktu!',
    difficulty: 'medium',
    category: 'Waktu',
    path: '/games/learn-clock'
  },
  {
    id: 'shape-guess',
    title: 'Tebak Bentuk',
    emoji: '🔺',
    description: 'Kenali berbagai bentuk geometri!',
    difficulty: 'easy',
    category: 'Geometri',
    path: '/games/shape-guess'
  },
  {
    id: 'english-vocab',
    title: 'Kosakata Inggris',
    emoji: '🇬🇧',
    description: 'Belajar bahasa Inggris!',
    difficulty: 'medium',
    category: 'Bahasa',
    path: '/games/english-vocab'
  },
  {
    id: 'kids-science',
    title: 'Sains Anak',
    emoji: '🔬',
    description: 'Jelajahi dunia sains!',
    difficulty: 'medium',
    category: 'Sains',
    path: '/games/kids-science'
  },
  {
    id: 'count-fruits',
    title: 'Hitung Buah',
    emoji: '🍎',
    description: 'Hitung buah-buahan!',
    difficulty: 'easy',
    category: 'Matematika',
    path: '/games/count-fruits'
  },
  {
    id: 'music-notes',
    title: 'Nada & Ritme',
    emoji: '🎵',
    description: 'Belajar nada musik!',
    difficulty: 'medium',
    category: 'Musik',
    path: '/games/music-notes'
  },
  {
    id: 'countries-flags',
    title: 'Negara & Bendera',
    emoji: '🌍',
    description: 'Kenali bendera negara!',
    difficulty: 'hard',
    category: 'Geografi',
    path: '/games/countries-flags'
  },
  {
    id: 'puzzle-game',
    title: 'Puzzle Gambar',
    emoji: '🧩',
    description: 'Susun puzzle gambar!',
    difficulty: 'medium',
    category: 'Logika',
    path: '/games/puzzle-game'
  },
  {
    id: 'typing-practice',
    title: 'Belajar Ketik',
    emoji: '⌨️',
    description: 'Latihan mengetik!',
    difficulty: 'medium',
    category: 'Keterampilan',
    path: '/games/typing-practice'
  },
  {
    id: 'color-mixing',
    title: 'Campur Warna',
    emoji: '🎨',
    description: 'Belajar mencampur warna!',
    difficulty: 'easy',
    category: 'Seni',
    path: '/games/color-mixing'
  },
  {
    id: 'interactive-story',
    title: 'Cerita Interaktif',
    emoji: '📚',
    description: 'Petualangan cerita pilihan!',
    difficulty: 'easy',
    category: 'Cerita',
    path: '/games/interactive-story'
  }
];

// Math problems data
export const mathProblems = {
  easy: [
    { question: '2 + 3 = ?', answer: 5, visual: '🍎🍎 + 🍎🍎🍎' },
    { question: '5 - 2 = ?', answer: 3, visual: '🍎🍎🍎🍎🍎 - 🍎🍎' },
    { question: '1 + 4 = ?', answer: 5, visual: '🍎 + 🍎🍎🍎🍎' },
    { question: '6 - 3 = ?', answer: 3, visual: '🍎🍎🍎🍎🍎🍎 - 🍎🍎🍎' },
  ],
  medium: [
    { question: '12 + 8 = ?', answer: 20, visual: '🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱 + 🐱🐱🐱🐱🐱🐱🐱🐱' },
    { question: '15 - 7 = ?', answer: 8, visual: '15 - 7' },
    { question: '6 × 3 = ?', answer: 18, visual: '6 × 3' },
    { question: '20 ÷ 4 = ?', answer: 5, visual: '20 ÷ 4' },
  ],
  hard: [
    { question: '45 + 37 = ?', answer: 82, visual: '45 + 37' },
    { question: '63 - 28 = ?', answer: 35, visual: '63 - 28' },
    { question: '8 × 7 = ?', answer: 56, visual: '8 × 7' },
    { question: '72 ÷ 9 = ?', answer: 8, visual: '72 ÷ 9' },
  ]
};

// Animals for memory game
export const animals = [
  '🐱', '🐶', '🐰', '🐸', '🐧', '🦁', '🐯', '🐨', 
  '🐼', '🦊', '🐺', '🐮', '🐷', '🐹', '🐭', '🐻'
];

// Spelling words
export const spellingWords = [
  { word: 'KUCING', image: '🐱', hint: 'K' },
  { word: 'ANJING', image: '🐶', hint: 'A' },
  { word: 'RUMAH', image: '🏠', hint: 'R' },
  { word: 'MOBIL', image: '🚗', hint: 'M' },
  { word: 'BUNGA', image: '🌸', hint: 'B' },
  { word: 'MATAHARI', image: '☀️', hint: 'M' },
  { word: 'BULAN', image: '🌙', hint: 'B' },
  { word: 'BINTANG', image: '⭐', hint: 'B' },
];

// Shapes data
export const shapes = [
  { name: 'Lingkaran', shape: '⭕', sides: 0 },
  { name: 'Segitiga', shape: '🔺', sides: 3 },
  { name: 'Persegi', shape: '⬜', sides: 4 },
  { name: 'Persegi Panjang', shape: '▭', sides: 4 },
  { name: 'Pentagon', shape: '⬟', sides: 5 },
  { name: 'Hexagon', shape: '⬡', sides: 6 },
];

// English vocabulary
export const englishVocab = [
  { indonesian: 'Kucing', english: 'Cat', image: '🐱' },
  { indonesian: 'Anjing', english: 'Dog', image: '🐶' },
  { indonesian: 'Rumah', english: 'House', image: '🏠' },
  { indonesian: 'Mobil', english: 'Car', image: '🚗' },
  { indonesian: 'Apel', english: 'Apple', image: '🍎' },
  { indonesian: 'Buku', english: 'Book', image: '📚' },
];

// Science questions
export const scienceQuestions = [
  { question: 'Hewan apa yang hidup di air?', options: ['Kucing', 'Ikan', 'Burung'], answer: 1, image: '🐟' },
  { question: 'Apa yang dibutuhkan tanaman untuk tumbuh?', options: ['Air', 'Coklat', 'Mainan'], answer: 0, image: '🌱' },
  { question: 'Berapa kaki yang dimiliki laba-laba?', options: ['6', '8', '10'], answer: 1, image: '🕷️' },
];

// Countries and flags
export const countriesFlags = [
  { country: 'Indonesia', flag: '🇮🇩' },
  { country: 'Malaysia', flag: '🇲🇾' },
  { country: 'Singapura', flag: '🇸🇬' },
  { country: 'Thailand', flag: '🇹🇭' },
  { country: 'Amerika', flag: '🇺🇸' },
  { country: 'Jepang', flag: '🇯🇵' },
];

// Music notes
export const musicNotes = [
  { note: 'Do', frequency: 261.63, color: '#FF6B6B' },
  { note: 'Re', frequency: 293.66, color: '#4ECDC4' },
  { note: 'Mi', frequency: 329.63, color: '#45B7D1' },
  { note: 'Fa', frequency: 349.23, color: '#96CEB4' },
  { note: 'Sol', frequency: 392.00, color: '#FFEAA7' },
  { note: 'La', frequency: 440.00, color: '#DDA0DD' },
  { note: 'Si', frequency: 493.88, color: '#98D8C8' },
];

// Interactive story
export const storyData = {
  title: 'Petualangan di Hutan Ajaib',
  start: {
    text: 'Kamu menemukan hutan ajaib. Ada dua jalan di depanmu.',
    choices: [
      { text: 'Ambil jalan kiri 🌲', next: 'left' },
      { text: 'Ambil jalan kanan 🌸', next: 'right' }
    ]
  },
  scenes: {
    left: {
      text: 'Kamu bertemu kelinci ajaib! Dia menawarkan wortel ajaib.',
      choices: [
        { text: 'Terima wortel 🥕', next: 'carrot' },
        { text: 'Tolak dengan sopan 😊', next: 'polite' }
      ]
    },
    right: {
      text: 'Kamu menemukan taman bunga yang indah dengan kupu-kupu.',
      choices: [
        { text: 'Bermain dengan kupu-kupu 🦋', next: 'butterfly' },
        { text: 'Petik bunga 🌸', next: 'flower' }
      ]
    },
    carrot: {
      text: 'Wortel ajaib memberimu kekuatan super! Kamu bisa terbang!',
      choices: [{ text: 'Mulai lagi 🔄', next: 'start' }]
    },
    polite: {
      text: 'Kelinci senang dengan sopan santunmu dan memberi hadiah emas!',
      choices: [{ text: 'Mulai lagi 🔄', next: 'start' }]
    },
    butterfly: {
      text: 'Kupu-kupu mengajarkanmu tarian ajaib yang indah!',
      choices: [{ text: 'Mulai lagi 🔄', next: 'start' }]
    },
    flower: {
      text: 'Bunga berubah menjadi tongkat ajaib yang bisa mengabulkan permintaan!',
      choices: [{ text: 'Mulai lagi 🔄', next: 'start' }]
    }
  }
};