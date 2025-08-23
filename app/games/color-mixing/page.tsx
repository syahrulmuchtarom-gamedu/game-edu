'use client';

import { useState } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { updatePlayerScore } from '@/utils/scoreUtils';

const primaryColors = [
  { name: 'Merah', color: '#FF0000', emoji: '🔴' },
  { name: 'Biru', color: '#0000FF', emoji: '🔵' },
  { name: 'Kuning', color: '#FFFF00', emoji: '🟡' }
];

const colorMixes = [
  { color1: 'Merah', color2: 'Kuning', result: 'Orange', resultColor: '#FFA500', emoji: '🟠' },
  { color1: 'Merah', color2: 'Biru', result: 'Ungu', resultColor: '#800080', emoji: '🟣' },
  { color1: 'Biru', color2: 'Kuning', result: 'Hijau', resultColor: '#008000', emoji: '🟢' },
  { color1: 'Kuning', color2: 'Merah', result: 'Orange', resultColor: '#FFA500', emoji: '🟠' },
  { color1: 'Biru', color2: 'Merah', result: 'Ungu', resultColor: '#800080', emoji: '🟣' },
  { color1: 'Kuning', color2: 'Biru', result: 'Hijau', resultColor: '#008000', emoji: '🟢' }
];

export default function ColorMixing() {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameMode, setGameMode] = useState<'mix' | 'guess'>('mix');
  const [mixResult, setMixResult] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  const startGame = (mode: 'mix' | 'guess') => {
    setGameMode(mode);
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setGameEnded(false);
    setSelectedColors([]);
    setMixResult(null);
  };

  const selectColor = (colorName: string) => {
    if (selectedColors.length < 2 && !selectedColors.includes(colorName)) {
      const newSelected = [...selectedColors, colorName];
      setSelectedColors(newSelected);
      
      if (newSelected.length === 2) {
        setTimeout(() => mixColors(newSelected), 500);
      }
    }
  };

  const mixColors = (colors: string[]) => {
    const mix = colorMixes.find(m => 
      (m.color1 === colors[0] && m.color2 === colors[1]) ||
      (m.color1 === colors[1] && m.color2 === colors[0])
    );
    
    if (mix) {
      setMixResult(mix.result);
      setScore(prev => prev + 25);
      setFeedback({show: true, type: 'success', message: `${colors[0]} + ${colors[1]} = ${mix.result}! 🎨`});
    }
  };

  const checkGuess = (guessedResult: string) => {
    const question = colorMixes[currentQuestion];
    
    if (guessedResult === question.result) {
      setScore(prev => prev + 20);
      setFeedback({show: true, type: 'success', message: 'Benar! Hebat! 🎨'});
      
      setTimeout(() => {
        if (currentQuestion < colorMixes.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          endGame(true);
        }
      }, 1500);
    } else {
      setFeedback({show: true, type: 'error', message: `Jawaban yang benar: ${question.result} 😊`});
    }
  };

  const resetMix = () => {
    setSelectedColors([]);
    setMixResult(null);
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    updatePlayerScore({
      gameId: 'color-mixing',
      score,
      timeSpent: 0,
      completed,
      attempts: 1
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Campur Warna" emoji="🎨">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Belajar Mencampur Warna
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Pelajari teori warna dasar dengan mencampur warna primer!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <GameButton
              onClick={() => startGame('mix')}
              variant="primary"
              size="lg"
              emoji="🎨"
            >
              <div className="text-center">
                <div className="font-bold">Mode Campur</div>
                <div className="text-sm opacity-75">Campur 2 warna primer</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('guess')}
              variant="success"
              size="lg"
              emoji="🤔"
            >
              <div className="text-center">
                <div className="font-bold">Mode Tebak</div>
                <div className="text-sm opacity-75">Tebak hasil campuran</div>
              </div>
            </GameButton>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Warna Primer:</h3>
            <div className="flex justify-center gap-4">
              {primaryColors.map((color, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-1">{color.emoji}</div>
                  <div className="text-sm font-semibold">{color.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Hasil Campuran:</h3>
            <div className="space-y-2 text-sm">
              <div>🔴 + 🟡 = 🟠 Orange</div>
              <div>🔴 + 🔵 = 🟣 Ungu</div>
              <div>🔵 + 🟡 = 🟢 Hijau</div>
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (gameEnded) {
    return (
      <GameLayout title="Campur Warna" emoji="🎨">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= 100 ? '🏆' : score >= 60 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= 100 ? 'Master Warna!' : score >= 60 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Mode: {gameMode === 'mix' ? 'Campur Warna' : 'Tebak Hasil'}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GameButton onClick={resetGame} variant="primary" emoji="🔄">
              Main Lagi
            </GameButton>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (gameMode === 'mix') {
    return (
      <GameLayout title="Campur Warna" emoji="🎨">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <ScoreTracker currentScore={score} showTotal={false} />
            <GameButton onClick={resetMix} variant="secondary" size="sm" emoji="🔄">
              Reset
            </GameButton>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Pilih 2 Warna untuk Dicampur
            </h3>
            
            {/* Color Selection */}
            <div className="flex justify-center gap-6 mb-8">
              {primaryColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => selectColor(color.name)}
                  disabled={selectedColors.includes(color.name) || selectedColors.length >= 2}
                  className={`
                    w-20 h-20 rounded-full text-4xl transition-all duration-200 transform hover:scale-110 active:scale-95
                    ${selectedColors.includes(color.name) 
                      ? 'ring-4 ring-blue-400 scale-110' 
                      : 'hover:shadow-xl'
                    }
                    ${selectedColors.length >= 2 && !selectedColors.includes(color.name) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                    }
                  `}
                  style={{ backgroundColor: color.color }}
                >
                  {color.emoji}
                </button>
              ))}
            </div>

            {/* Mixing Process */}
            {selectedColors.length > 0 && (
              <div className="bg-white p-6 rounded-2xl">
                <div className="flex items-center justify-center gap-4">
                  {selectedColors.map((colorName, index) => {
                    const color = primaryColors.find(c => c.name === colorName);
                    return (
                      <div key={index} className="text-center">
                        <div className="text-3xl">{color?.emoji}</div>
                        <div className="text-sm font-semibold">{colorName}</div>
                      </div>
                    );
                  })}
                  
                  {selectedColors.length === 2 && (
                    <>
                      <div className="text-2xl">+</div>
                      <div className="text-2xl">=</div>
                      {mixResult && (
                        <div className="text-center">
                          <div className="text-4xl">
                            {colorMixes.find(m => m.result === mixResult)?.emoji}
                          </div>
                          <div className="text-sm font-semibold">{mixResult}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-2xl text-center">
            <p className="text-sm text-gray-600">
              💡 Pilih 2 warna primer untuk melihat hasil campurannya!
            </p>
          </div>
        </div>

        <AnimatedFeedback
          type={feedback.type}
          message={feedback.message}
          show={feedback.show}
          onComplete={() => setFeedback({...feedback, show: false})}
        />
      </GameLayout>
    );
  }

  // Guess mode
  const question = colorMixes[currentQuestion];
  const options = ['Orange', 'Ungu', 'Hijau'].sort(() => Math.random() - 0.5);

  return (
    <GameLayout title="Campur Warna" emoji="🎨">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <ScoreTracker currentScore={score} showTotal={false} />
          <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
            {currentQuestion + 1} / {colorMixes.length}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-3xl text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Apa hasil campuran warna ini?
          </h3>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-5xl">
                {primaryColors.find(c => c.name === question.color1)?.emoji}
              </div>
              <div className="text-sm font-semibold">{question.color1}</div>
            </div>
            
            <div className="text-3xl">+</div>
            
            <div className="text-center">
              <div className="text-5xl">
                {primaryColors.find(c => c.name === question.color2)?.emoji}
              </div>
              <div className="text-sm font-semibold">{question.color2}</div>
            </div>
            
            <div className="text-3xl">=</div>
            <div className="text-5xl">❓</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map((option, index) => {
            const optionData = colorMixes.find(m => m.result === option);
            return (
              <GameButton
                key={index}
                onClick={() => checkGuess(option)}
                variant="primary"
                size="lg"
                className="h-20"
              >
                <div className="text-center">
                  <div className="text-3xl mb-1">{optionData?.emoji}</div>
                  <div className="font-semibold">{option}</div>
                </div>
              </GameButton>
            );
          })}
        </div>
      </div>

      <AnimatedFeedback
        type={feedback.type}
        message={feedback.message}
        show={feedback.show}
        onComplete={() => setFeedback({...feedback, show: false})}
      />
    </GameLayout>
  );
}