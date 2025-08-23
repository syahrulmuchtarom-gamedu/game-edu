'use client';

import { useState } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import { updatePlayerScore } from '@/utils/scoreUtils';

interface Weather {
  id: string;
  name: string;
  emoji: string;
  temperature: string;
  description: string;
  clothes: string[];
  activities: string[];
  season: string;
}

const weathers: Weather[] = [
  {
    id: 'sunny',
    name: 'Cerah',
    emoji: '☀️',
    temperature: '28-35°C',
    description: 'Langit biru tanpa awan, matahari bersinar terang',
    clothes: ['👕', '🩳', '👑', '🕶️'],
    activities: ['🏈', '🏃', '🏊', '🌿'],
    season: 'Kemarau'
  },
  {
    id: 'rainy',
    name: 'Hujan',
    emoji: '🌧️',
    temperature: '20-25°C',
    description: 'Awan gelap, air turun dari langit',
    clothes: ['🧥', '☂️', '🥾', '👢'],
    activities: ['📚', '🎮', '🎨', '🎬'],
    season: 'Hujan'
  },
  {
    id: 'cloudy',
    name: 'Berawan',
    emoji: '☁️',
    temperature: '24-28°C',
    description: 'Langit tertutup awan putih atau abu-abu',
    clothes: ['👔', '👖', '👟', '🧢'],
    activities: ['🚶', '📷', '🌳', '📚'],
    season: 'Peralihan'
  },
  {
    id: 'windy',
    name: 'Berangin',
    emoji: '💨',
    temperature: '22-27°C',
    description: 'Udara bergerak kencang, daun bergoyang',
    clothes: ['🧥', '👖', '🧢', '👟'],
    activities: ['🪁', '⛵', '🏃', '🍃'],
    season: 'Peralihan'
  },
  {
    id: 'hot',
    name: 'Panas',
    emoji: '🌅',
    temperature: '32-38°C',
    description: 'Suhu sangat tinggi, udara terasa panas',
    clothes: ['🩳', '👕', '👑', '🕶️'],
    activities: ['🏊', '🧊', '🍿', '🏠'],
    season: 'Kemarau'
  },
  {
    id: 'cool',
    name: 'Sejuk',
    emoji: '🌌',
    temperature: '18-24°C',
    description: 'Udara segar dan tidak panas',
    clothes: ['🧥', '👖', '🧢', '👟'],
    activities: ['🚶', '🏃', '🌳', '📚'],
    season: 'Hujan'
  }
];

const gameTypes = [
  { id: 'weather', name: 'Tebak Cuaca', emoji: '🌤️', description: 'Kenali jenis cuaca dari deskripsi' },
  { id: 'clothes', name: 'Pakaian Tepat', emoji: '👕', description: 'Pilih pakaian sesuai cuaca' },
  { id: 'activity', name: 'Aktivitas Cocok', emoji: '🏃', description: 'Pilih kegiatan sesuai cuaca' }
];

export default function WeatherClimate() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameType, setGameType] = useState<'weather' | 'clothes' | 'activity'>('weather');
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const startGame = (type: 'weather' | 'clothes' | 'activity') => {
    setGameStarted(true);
    setGameType(type);
    setScore(0);
    setQuestionCount(0);
    setFeedback('');
    generateQuestion(type);
  };

  const generateQuestion = (type: 'weather' | 'clothes' | 'activity') => {
    const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
    setCurrentWeather(randomWeather);
    setSelectedAnswer('');
    
    let correctAnswer = '';
    let wrongAnswers: string[] = [];
    
    if (type === 'weather') {
      correctAnswer = randomWeather.name;
      wrongAnswers = weathers
        .filter(w => w.id !== randomWeather.id)
        .map(w => w.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    } else if (type === 'clothes') {
      correctAnswer = randomWeather.clothes[0];
      const allClothes = weathers.flatMap(w => w.clothes).filter(c => c !== correctAnswer);
      wrongAnswers = Array.from(new Set(allClothes))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    } else {
      correctAnswer = randomWeather.activities[0];
      const allActivities = weathers.flatMap(w => w.activities).filter(a => a !== correctAnswer);
      wrongAnswers = Array.from(new Set(allActivities))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    }
    
    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    
    let correctAnswer = '';
    if (gameType === 'weather') {
      correctAnswer = currentWeather?.name || '';
    } else if (gameType === 'clothes') {
      correctAnswer = currentWeather?.clothes[0] || '';
    } else {
      correctAnswer = currentWeather?.activities[0] || '';
    }
    
    if (answer === correctAnswer) {
      const points = 12;
      setScore(prev => prev + points);
      setFeedback(`🎉 Benar! ${getFactText()}`);
      updatePlayerScore({
        gameId: 'weather-climate',
        score: points,
        timeSpent: 0,
        completed: questionCount >= 9,
        attempts: 1
      });
    } else {
      setFeedback(`❌ Salah! Jawaban yang benar: ${correctAnswer}`);
    }
    
    setTimeout(() => {
      if (questionCount < 9) {
        setQuestionCount(prev => prev + 1);
        generateQuestion(gameType);
        setFeedback('');
      } else {
        const finalScore = score + (answer === correctAnswer ? 12 : 0);
        setFeedback(`🏆 Game selesai! Skor akhir: ${finalScore}/120`);
      }
    }, 2000);
  };

  const getFactText = () => {
    if (!currentWeather) return '';
    return `Suhu ${currentWeather.name}: ${currentWeather.temperature}`;
  };

  const getQuestionText = () => {
    if (!currentWeather) return '';
    
    if (gameType === 'weather') {
      return `Cuaca apa ini? "${currentWeather.description}"`;
    } else if (gameType === 'clothes') {
      return `Pakaian apa yang cocok untuk cuaca ${currentWeather.name}?`;
    } else {
      return `Aktivitas apa yang cocok untuk cuaca ${currentWeather.name}?`;
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentWeather(null);
    setScore(0);
    setQuestionCount(0);
    setFeedback('');
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Cuaca & Iklim" emoji="🌡️">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🌤️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cuaca & Iklim</h2>
          <p className="text-lg text-gray-600 mb-6">
            Pelajari berbagai jenis cuaca dan cara menghadapinya!
          </p>
          
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl max-w-md mx-auto mb-6">
            <div className="text-4xl mb-4">🌡️</div>
            <h3 className="font-bold text-gray-800 mb-2">Pilih Mode Permainan:</h3>
          </div>

          <div className="space-y-4">
            {gameTypes.map(type => (
              <GameButton 
                key={type.id}
                onClick={() => startGame(type.id as any)} 
                variant="primary" 
                size="lg" 
                emoji={type.emoji}
                className="w-full max-w-sm"
              >
                <div className="text-center">
                  <div className="font-bold">{type.name}</div>
                  <div className="text-sm opacity-80">{type.description}</div>
                </div>
              </GameButton>
            ))}
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Cuaca & Iklim" emoji="🌡️">
      <div className="space-y-6">
        {/* Progress and Score */}
        <div className="flex justify-between items-center bg-sky-50 p-4 rounded-2xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-600">{score}</div>
            <div className="text-sm text-gray-600">Skor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{questionCount + 1}/10</div>
            <div className="text-sm text-gray-600">Pertanyaan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">
              {gameType === 'weather' ? '🌤️' : gameType === 'clothes' ? '👕' : '🏃'}
            </div>
            <div className="text-sm text-gray-600">
              {gameType === 'weather' ? 'Cuaca' : gameType === 'clothes' ? 'Pakaian' : 'Aktivitas'}
            </div>
          </div>
        </div>

        {/* Question */}
        {currentWeather && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{currentWeather.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {getQuestionText()}
              </h3>
              
              {/* Weather Info */}
              <div className="bg-white p-4 rounded-xl inline-block max-w-sm">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-gray-700">Suhu</div>
                    <div className="text-blue-600">{currentWeather.temperature}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700">Musim</div>
                    <div className="text-green-600">{currentWeather.season}</div>
                  </div>
                </div>
                {gameType === 'weather' && (
                  <div className="mt-2 text-gray-600 text-sm">
                    {currentWeather.description}
                  </div>
                )}
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => {
                let buttonClass = 'bg-white hover:bg-gray-50 border-2 border-transparent';
                if (selectedAnswer) {
                  let isCorrect = false;
                  if (gameType === 'weather') {
                    isCorrect = option === currentWeather.name;
                  } else if (gameType === 'clothes') {
                    isCorrect = option === currentWeather.clothes[0];
                  } else {
                    isCorrect = option === currentWeather.activities[0];
                  }
                  
                  if (option === selectedAnswer) {
                    buttonClass = isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
                  } else if (isCorrect) {
                    buttonClass = 'bg-green-100 border-green-500';
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={`p-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none ${buttonClass}`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{option}</div>
                      {gameType !== 'weather' && (
                        <div className="text-sm text-gray-600">
                          {gameType === 'clothes' ? 'Pakaian' : 'Aktivitas'}
                        </div>
                      )}
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

        {/* Weather Guide */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl">
          <h4 className="font-bold text-center mb-3">🌡️ Panduan Cuaca</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">☀️</div>
              <div className="font-semibold">Cerah</div>
              <div className="text-gray-600">28-35°C</div>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">🌧️</div>
              <div className="font-semibold">Hujan</div>
              <div className="text-gray-600">20-25°C</div>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">☁️</div>
              <div className="font-semibold">Berawan</div>
              <div className="text-gray-600">24-28°C</div>
            </div>
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