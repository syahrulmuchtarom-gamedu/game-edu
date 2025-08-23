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
  // Original 15 games
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
  },
  // New 15 games
  {
    id: 'traditional-houses',
    title: 'Tebak Rumah Adat',
    emoji: '🏠',
    description: 'Kenali rumah adat dari seluruh Indonesia!',
    difficulty: 'medium',
    category: 'Budaya',
    path: '/games/traditional-houses'
  },
  {
    id: 'dental-health',
    title: 'Kesehatan Gigi',
    emoji: '🦷',
    description: 'Belajar cara merawat gigi yang benar!',
    difficulty: 'easy',
    category: 'Kesehatan',
    path: '/games/dental-health'
  },
  {
    id: 'moon-phases',
    title: 'Fase Bulan',
    emoji: '🌙',
    description: 'Pelajari siklus fase bulan!',
    difficulty: 'medium',
    category: 'Astronomi',
    path: '/games/moon-phases'
  },
  {
    id: 'food-chain',
    title: 'Rantai Makanan',
    emoji: '🍯',
    description: 'Susun rantai makanan yang benar!',
    difficulty: 'medium',
    category: 'Biologi',
    path: '/games/food-chain'
  },
  {
    id: 'emotion-guess',
    title: 'Tebak Emosi',
    emoji: '🎭',
    description: 'Kenali berbagai ekspresi emosi!',
    difficulty: 'easy',
    category: 'Sosial',
    path: '/games/emotion-guess'
  },
  {
    id: 'indonesia-map',
    title: 'Peta Indonesia',
    emoji: '🏔️',
    description: 'Jelajahi peta Indonesia!',
    difficulty: 'hard',
    category: 'Geografi',
    path: '/games/indonesia-map'
  },
  {
    id: 'weather-climate',
    title: 'Cuaca & Iklim',
    emoji: '🌡️',
    description: 'Pelajari jenis-jenis cuaca!',
    difficulty: 'easy',
    category: 'Sains',
    path: '/games/weather-climate'
  },
  {
    id: 'old-transportation',
    title: 'Transportasi Tempo Dulu',
    emoji: '🚂',
    description: 'Bandingkan transportasi dulu dan sekarang!',
    difficulty: 'medium',
    category: 'Sejarah',
    path: '/games/old-transportation'
  },
  {
    id: 'healthy-food',
    title: 'Makanan 4 Sehat 5 Sempurna',
    emoji: '🥗',
    description: 'Susun menu makanan sehat!',
    difficulty: 'medium',
    category: 'Nutrisi',
    path: '/games/healthy-food'
  },
  {
    id: 'letter-drawing',
    title: 'Menggambar Huruf',
    emoji: '🎨',
    description: 'Belajar menulis huruf dengan benar!',
    difficulty: 'easy',
    category: 'Motorik',
    path: '/games/letter-drawing'
  },
  {
    id: 'math-balance',
    title: 'Timbangan Matematika',
    emoji: '⚖️',
    description: 'Seimbangkan persamaan matematika!',
    difficulty: 'medium',
    category: 'Logika',
    path: '/games/math-balance'
  },
  {
    id: 'story-sequence',
    title: 'Urutan Kejadian',
    emoji: '🎪',
    description: 'Susun urutan cerita yang benar!',
    difficulty: 'medium',
    category: 'Logika',
    path: '/games/story-sequence'
  },
  {
    id: 'sports-health',
    title: 'Olahraga & Kesehatan',
    emoji: '🏃♂️',
    description: 'Kenali olahraga dan manfaatnya!',
    difficulty: 'easy',
    category: 'Kesehatan',
    path: '/games/sports-health'
  },
  {
    id: 'sound-guess',
    title: 'Tebak Suara',
    emoji: '🔊',
    description: 'Tebak sumber suara yang dimainkan!',
    difficulty: 'medium',
    category: 'Audio',
    path: '/games/sound-guess'
  },
  {
    id: 'calendar-date',
    title: 'Hari & Tanggal',
    emoji: '🗓️',
    description: 'Belajar konsep waktu dan kalender!',
    difficulty: 'medium',
    category: 'Waktu',
    path: '/games/calendar-date'
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
  { question: 'Hewan apa yang hidup di air?', options: ['Kucing', 'Ikan', 'Burung'], answer: 1, image: '🐟', explanation: 'Ikan hidup di air dan bernapas menggunakan insang untuk mengambil oksigen dari air.' },
  { question: 'Apa yang dibutuhkan tanaman untuk tumbuh?', options: ['Air', 'Coklat', 'Mainan'], answer: 0, image: '🌱', explanation: 'Tanaman membutuhkan air, sinar matahari, dan nutrisi dari tanah untuk bisa tumbuh dengan baik.' },
  { question: 'Berapa kaki yang dimiliki laba-laba?', options: ['6', '8', '10'], answer: 1, image: '🕷️', explanation: 'Laba-laba memiliki 8 kaki dan termasuk dalam kelompok hewan arthropoda.' },
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

// Traditional houses data
export const traditionalHouses = [
  { name: 'Joglo', region: 'Jawa Tengah', image: '🏠', info: 'Rumah tradisional dengan atap berbentuk kerucut' },
  { name: 'Gadang', region: 'Sumatera Barat', image: '🏠', info: 'Rumah adat Minangkabau dengan atap melengkung' },
  { name: 'Tongkonan', region: 'Sulawesi Selatan', image: '🏠', info: 'Rumah adat Toraja dengan atap seperti perahu' },
  { name: 'Honai', region: 'Papua', image: '🏠', info: 'Rumah bulat tradisional suku Dani' },
  { name: 'Limas', region: 'Sumatera Selatan', image: '🏠', info: 'Rumah panggung dengan atap limas' },
  { name: 'Betang', region: 'Kalimantan', image: '🏠', info: 'Rumah panjang suku Dayak' }
];

// Dental health data
export const dentalHealthData = {
  tools: [
    { name: 'Sikat Gigi', emoji: '🦷', correct: true },
    { name: 'Pasta Gigi', emoji: '🧴', correct: true },
    { name: 'Obeng', emoji: '🔧', correct: false },
    { name: 'Air', emoji: '💧', correct: true }
  ],
  steps: [
    'Basahi sikat gigi',
    'Oleskan pasta gigi',
    'Sikat gigi selama 2 menit',
    'Kumur dengan air bersih'
  ],
  foods: {
    good: ['🥛', '🥕', '🍎', '🥦'],
    bad: ['🍭', '🍰', '🍬', '🥤']
  }
};

// Moon phases data
export const moonPhases = [
  { name: 'Bulan Baru', phase: 'new', emoji: '⚫', order: 1 },
  { name: 'Sabit Muda', phase: 'waxing-crescent', emoji: '🌒', order: 2 },
  { name: 'Separuh Awal', phase: 'first-quarter', emoji: '🌓', order: 3 },
  { name: 'Cembung Awal', phase: 'waxing-gibbous', emoji: '🌔', order: 4 },
  { name: 'Bulan Purnama', phase: 'full', emoji: '🌕', order: 5 },
  { name: 'Cembung Akhir', phase: 'waning-gibbous', emoji: '🌖', order: 6 },
  { name: 'Separuh Akhir', phase: 'last-quarter', emoji: '🌗', order: 7 },
  { name: 'Sabit Tua', phase: 'waning-crescent', emoji: '🌘', order: 8 }
];

// Emotions data
export const emotions = [
  { name: 'Senang', emoji: '😊', situation: 'Mendapat hadiah' },
  { name: 'Sedih', emoji: '😢', situation: 'Kehilangan mainan' },
  { name: 'Marah', emoji: '😡', situation: 'Diganggu teman' },
  { name: 'Takut', emoji: '😨', situation: 'Melihat petir' },
  { name: 'Terkejut', emoji: '😲', situation: 'Mendengar suara keras' },
  { name: 'Bingung', emoji: '😕', situation: 'Tidak mengerti pelajaran' }
];

// Weather data
export const weatherTypes = [
  { name: 'Cerah', emoji: '☀️', clothes: ['👕', '🩳'], activity: 'Bermain di luar' },
  { name: 'Hujan', emoji: '🌧️', clothes: ['🧥', '☔'], activity: 'Bermain di dalam' },
  { name: 'Berawan', emoji: '☁️', clothes: ['👔'], activity: 'Jalan-jalan' },
  { name: 'Berangin', emoji: '💨', clothes: ['🧥'], activity: 'Main layang-layang' }
];

// Sports data
export const sportsData = [
  { name: 'Sepak Bola', emoji: '⚽', equipment: '🥅', benefit: 'Melatih kaki dan koordinasi' },
  { name: 'Renang', emoji: '🏊', equipment: '👙', benefit: 'Melatih seluruh tubuh' },
  { name: 'Bulu Tangkis', emoji: '🏸', equipment: '🏸', benefit: 'Melatih refleks dan mata' },
  { name: 'Lari', emoji: '🏃', equipment: '👟', benefit: 'Melatih jantung dan paru-paru' }
];

// Story sequences
export const storySequences = [
  {
    title: 'Menanam Bunga',
    scenes: [
      { order: 1, image: '🌱', text: 'Menanam benih' },
      { order: 2, image: '💧', text: 'Menyiram tanaman' },
      { order: 3, image: '🌿', text: 'Tanaman tumbuh' },
      { order: 4, image: '🌸', text: 'Bunga mekar' }
    ]
  },
  {
    title: 'Membuat Kue',
    scenes: [
      { order: 1, image: '🥚', text: 'Siapkan telur' },
      { order: 2, image: '🥛', text: 'Tambahkan susu' },
      { order: 3, image: '🍰', text: 'Aduk adonan' },
      { order: 4, image: '🎂', text: 'Kue siap disajikan' }
    ]
  }
];

// Healthy food categories
export const healthyFoodCategories = {
  carbs: { name: 'Karbohidrat', foods: ['🍚', '🍞', '🥔'], emoji: '🍚' },
  protein: { name: 'Protein', foods: ['🐟', '🍗', '🥚'], emoji: '🐟' },
  vitamins: { name: 'Vitamin', foods: ['🍎', '🍌', '🥕'], emoji: '🍎' },
  minerals: { name: 'Mineral', foods: ['🥬', '🥦', '🥗'], emoji: '🥬' },
  dairy: { name: 'Susu', foods: ['🥛', '🧀', '🍦'], emoji: '🥛' }
};