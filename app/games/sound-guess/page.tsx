'use client';

import { useState } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import { updatePlayerScore } from '@/utils/scoreUtils';

interface Sound {
  id: string;
  name: string;
  emoji: string;
  category: 'animal' | 'vehicle' | 'nature' | 'instrument';
  description: string;
  soundText: string;
}

const sounds: Sound[] = [
  // Animals
  { id: 'cat', name: 'Kucing', emoji: '🐱', category: 'animal', description: 'Hewan peliharaan yang suka minum susu', soundText: 'Meong meong!' },
  { id: 'dog', name: 'Anjing', emoji: '🐶', category: 'animal', description: 'Sahabat setia manusia', soundText: 'Guk guk!' },
  { id: 'cow', name: 'Sapi', emoji: '🐄', category: 'animal', description: 'Hewan yang menghasilkan susu', soundText: 'Moo moo!' },
  { id: 'rooster', name: 'Ayam Jantan', emoji: '🐓', category: 'animal', description: 'Bangun pagi dengan suaranya', soundText: 'Kukuruyuk!' },
  { id: 'duck', name: 'Bebek', emoji: '🦆', category: 'animal', description: 'Hewan yang bisa berenang', soundText: 'Kwek kwek!' },
  
  // Vehicles
  { id: 'car', name: 'Mobil', emoji: '🚗', category: 'vehicle', description: 'Kendaraan roda empat', soundText: 'Brum brum!' },
  { id: 'motorcycle', name: 'Motor', emoji: '🏍️', category: 'vehicle', description: 'Kendaraan roda dua', soundText: 'Ngeng ngeng!' },
  { id: 'train', name: 'Kereta', emoji: '🚂', category: 'vehicle', description: 'Transportasi rel panjang', soundText: 'Choo choo!' },
  { id: 'airplane', name: 'Pesawat', emoji: '✈️', category: 'vehicle', description: 'Kendaraan yang terbang', soundText: 'Whoosh!' },
  
  // Nature
  { id: 'rain', name: 'Hujan', emoji: '🌧️', category: 'nature', description: 'Air yang turun dari langit', soundText: 'Tip tip tip!' },
  { id: 'thunder', name: 'Petir', emoji: '⚡', category: 'nature', description: 'Suara keras saat badai', soundText: 'Gledek!' },
  { id: 'wind', name: 'Angin', emoji: '💨', category: 'nature', description: 'Udara yang bergerak', soundText: 'Whooo!' },
  
  // Instruments
  { id: 'piano', name: 'Piano', emoji: '🎹', category: 'instrument', description: 'Alat musik dengan tuts', soundText: 'Ting ting!' },
  { id: 'drum', name: 'Drum', emoji: '🥁', category: 'instrument', description: 'Alat musik dipukul', soundText: 'Dung dung!' },
  { id: 'guitar', name: 'Gitar', emoji: '🎸', category: 'instrument', description: 'Alat musik berdawai', soundText: 'Jreng jreng!' }
];

const categories = {
  animal: { name: 'Hewan', emoji: '🐾', color: 'green' },
  vehicle: { name: 'Kendaraan', emoji: '🚗', color: 'blue' },
  nature: { name: 'Alam', emoji: '🌿', color: 'emerald' },
  instrument: { name: 'Alat Musik', emoji: '🎵', color: 'purple' }
};

export default function SoundGuess() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const [options, setOptions] = useState<Sound[]>([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setQuestionCount(0);
    setFeedback('');
    generateQuestion();
  };

  const generateQuestion = () => {
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    setCurrentSound(randomSound);
    setSelectedAnswer('');
    setShowHint(false);
    
    // Generate options from same category and different categories
    const sameCategory = sounds.filter(s => s.category === randomSound.category && s.id !== randomSound.id);
    const otherCategories = sounds.filter(s => s.category !== randomSound.category);
    
    const wrongAnswers = [
      ...sameCategory.sort(() => Math.random() - 0.5).slice(0, 1),
      ...otherCategories.sort(() => Math.random() - 0.5).slice(0, 2)
    ];
    
    const allOptions = [randomSound, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const playSound = () => {
    if (!currentSound) return;
    
    setIsPlaying(true);
    
    // Simulate sound playing with visual feedback
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const handleAnswer = (selectedSound: Sound) => {
    setSelectedAnswer(selectedSound.id);
    
    if (selectedSound.id === currentSound?.id) {
      const points = showHint ? 10 : 15;
      setScore(prev => prev + points);
      setFeedback(`🎉 Benar! ${currentSound.soundText} adalah suara ${currentSound.name}`);
      updatePlayerScore({
        gameId: 'sound-guess',
        score: points,
        timeSpent: 0,
        completed: questionCount >= 9,
        attempts: 1
      });
    } else {
      setFeedback(`❌ Salah! Itu suara ${currentSound?.name} (${currentSound?.soundText})`);
    }
    
    setTimeout(() => {
      if (questionCount < 9) {
        setQuestionCount(prev => prev + 1);
        generateQuestion();
        setFeedback('');
      } else {
        const finalScore = score + (selectedSound.id === currentSound?.id ? (showHint ? 10 : 15) : 0);
        setFeedback(`🏆 Game selesai! Skor akhir: ${finalScore}/150`);
      }
    }, 2500);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentSound(null);
    setScore(0);
    setQuestionCount(0);
    setFeedback('');
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Tebak Suara" emoji="🔊">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎧</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tebak Suara</h2>
          <p className="text-lg text-gray-600 mb-6">
            Dengarkan suara dan tebak sumbernya!
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-4">🔊</div>
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Tekan tombol play untuk mendengar suara</li>
              <li>• Pilih jawaban yang tepat dari 4 pilihan</li>
              <li>• Gunakan petunjuk jika kesulitan</li>
              <li>• Semakin cepat menjawab, semakin tinggi skor</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto">
            {Object.entries(categories).map(([key, cat]) => (
              <div key={key} className="bg-white p-3 rounded-xl text-center shadow-sm">
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="text-sm font-semibold text-gray-700">{cat.name}</div>
              </div>
            ))}
          </div>

          <GameButton onClick={startGame} variant="primary" size="lg" emoji="🎧">
            Mulai Mendengarkan
          </GameButton>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Tebak Suara" emoji="🔊">
      <div className="space-y-6">
        {/* Progress and Score */}
        <div className="flex justify-between items-center bg-purple-50 p-4 rounded-2xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{score}</div>
            <div className="text-sm text-gray-600">Skor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{questionCount + 1}/10</div>
            <div className="text-sm text-gray-600">Pertanyaan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">
              {currentSound ? categories[currentSound.category].emoji : '🔊'}
            </div>
            <div className="text-sm text-gray-600">Kategori</div>
          </div>
        </div>

        {/* Sound Player */}
        {currentSound && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Dengarkan suara ini dan tebak sumbernya!
              </h3>
              
              {/* Sound Visualization */}
              <div className={`text-8xl mb-4 transition-all duration-500 ${
                isPlaying ? 'animate-pulse scale-110' : ''
              }`}>
                {isPlaying ? '🔊' : '🔇'}
              </div>
              
              {/* Sound Text Display */}
              {isPlaying && (
                <div className="bg-white p-4 rounded-xl mb-4 animate-bounce">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentSound.soundText}
                  </div>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <GameButton 
                  onClick={playSound} 
                  variant="primary" 
                  size="lg" 
                  emoji="🔊"
                  disabled={isPlaying}
                >
                  {isPlaying ? 'Sedang Diputar...' : 'Putar Suara'}
                </GameButton>
                
                <GameButton 
                  onClick={toggleHint} 
                  variant="secondary" 
                  emoji="💡"
                >
                  {showHint ? 'Sembunyikan' : 'Petunjuk'}
                </GameButton>
              </div>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="bg-yellow-50 p-4 rounded-xl mb-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">💡</div>
                  <p className="text-gray-700 font-semibold">
                    Petunjuk: {currentSound.description}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Kategori: {categories[currentSound.category].name}
                  </p>
                </div>
              </div>
            )}

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {options.map((option) => {
                let buttonClass = 'bg-white hover:bg-gray-50 border-2 border-transparent';
                if (selectedAnswer) {
                  if (option.id === selectedAnswer) {
                    buttonClass = option.id === currentSound.id ? 
                      'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
                  } else if (option.id === currentSound.id) {
                    buttonClass = 'bg-green-100 border-green-500';
                  }
                }
                
                return (
                  <button
                    key={option.id}
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={`p-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none ${buttonClass}`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <div className="font-bold">{option.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {categories[option.category].name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-2xl text-center font-semibold ${
            feedback.includes('Benar') ? 'bg-green-100 text-green-800' : 
            feedback.includes('selesai') ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {feedback}
          </div>
        )}

        {/* Sound Categories Info */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl">
          <h4 className="font-bold text-center mb-3">🎧 Kategori Suara</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(categories).map(([key, cat]) => (
              <div key={key} className="bg-white p-3 rounded-xl text-center">
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="text-sm font-semibold text-gray-700">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        {questionCount >= 9 && (
          <div className="text-center">
            <GameButton onClick={resetGame} variant="secondary" size="lg" emoji="🔄">
              Main Lagi
            </GameButton>
          </div>
        )}
      </div>
    </GameLayout>
  );
}