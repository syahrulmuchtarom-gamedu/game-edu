'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

const colors = [
  { name: 'Merah', color: '#EF4444', emoji: '🔴' },
  { name: 'Biru', color: '#3B82F6', emoji: '🔵' },
  { name: 'Hijau', color: '#10B981', emoji: '🟢' },
  { name: 'Kuning', color: '#F59E0B', emoji: '🟡' },
  { name: 'Ungu', color: '#8B5CF6', emoji: '🟣' },
  { name: 'Orange', color: '#F97316', emoji: '🟠' }
];

export default function ColorPatterns() {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  const generatePattern = (length: number) => {
    const newPattern = [];
    for (let i = 0; i < length; i++) {
      newPattern.push(Math.floor(Math.random() * Math.min(4 + Math.floor(level / 3), colors.length)));
    }
    return newPattern;
  };

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    startNewRound();
  };

  const startNewRound = () => {
    const patternLength = Math.min(3 + Math.floor(level / 2), 8);
    const newPattern = generatePattern(patternLength);
    setPattern(newPattern);
    setUserPattern([]);
    setCurrentStep(0);
    showPattern(newPattern);
  };

  const showPattern = (patternToShow: number[]) => {
    setShowingPattern(true);
    let step = 0;
    
    const showNext = () => {
      if (step < patternToShow.length) {
        setCurrentStep(step);
        step++;
        setTimeout(showNext, 800);
      } else {
        setShowingPattern(false);
        setCurrentStep(-1);
      }
    };
    
    setTimeout(showNext, 1000);
  };

  const handleColorClick = (colorIndex: number) => {
    if (showingPattern) return;
    
    const newUserPattern = [...userPattern, colorIndex];
    setUserPattern(newUserPattern);
    
    // Check if current step is correct
    if (newUserPattern[newUserPattern.length - 1] !== pattern[newUserPattern.length - 1]) {
      // Wrong color
      setLives(prev => prev - 1);
      setFeedback({show: true, type: 'error', message: 'Warna salah! Coba lagi 😊'});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        } else {
          showPattern(pattern); // Show pattern again
        }
      }, 2000);
      return;
    }
    
    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      // Pattern completed successfully
      const points = level * 10 + pattern.length * 5;
      setScore(prev => prev + points);
      setFeedback({show: true, type: 'success', message: `Benar! +${points} poin! 🎉`});
      
      setTimeout(() => {
        setLevel(prev => prev + 1);
        startNewRound();
      }, 2000);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, level * 50);
    
    updatePlayerScore({
      gameId: 'color-patterns',
      score: finalScore,
      timeSpent: 0,
      completed,
      attempts: 4 - lives
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Pola Warna" emoji="🌈">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🌈</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pola Warna Simon Says
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Perhatikan urutan warna dan ulangi dengan benar!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Perhatikan urutan warna yang muncul</li>
              <li>• Klik warna sesuai urutan yang benar</li>
              <li>• Pola akan semakin panjang setiap level</li>
              <li>• Kamu punya 3 nyawa ❤️</li>
            </ul>
          </div>

          <GameButton onClick={startGame} variant="primary" size="lg" emoji="🚀">
            Mulai Bermain
          </GameButton>
        </div>
      </GameLayout>
    );
  }

  if (gameEnded) {
    return (
      <GameLayout title="Pola Warna" emoji="🌈">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {level >= 10 ? '🏆' : level >= 5 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {level >= 10 ? 'Master Pola!' : level >= 5 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">Level tercapai: {level - 1}</div>
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

  return (
    <GameLayout title="Pola Warna" emoji="🌈">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <ScoreTracker currentScore={score} showTotal={false} />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-2xl">
                  {i < lives ? '❤️' : '🤍'}
                </span>
              ))}
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
              Level {level}
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center">
          {showingPattern ? (
            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                Perhatikan urutan warna:
              </p>
              <p className="text-sm text-gray-600">
                Pola {currentStep + 1} dari {pattern.length}
              </p>
            </div>
          ) : (
            <div className="bg-green-50 p-4 rounded-2xl">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                Ulangi urutan warna:
              </p>
              <p className="text-sm text-gray-600">
                {userPattern.length} dari {pattern.length}
              </p>
            </div>
          )}
        </div>

        {/* Color Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          {colors.slice(0, Math.min(4 + Math.floor(level / 3), colors.length)).map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorClick(index)}
              disabled={showingPattern}
              className={`
                aspect-square rounded-3xl text-4xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg
                ${showingPattern && currentStep === index 
                  ? 'ring-4 ring-white ring-opacity-80 animate-pulse scale-110' 
                  : ''
                }
                ${!showingPattern ? 'hover:shadow-xl' : 'cursor-not-allowed opacity-75'}
              `}
              style={{ 
                backgroundColor: color.color,
                color: 'white'
              }}
            >
              {color.emoji}
            </button>
          ))}
        </div>

        {/* Pattern Progress */}
        <div className="bg-gray-50 p-4 rounded-2xl">
          <p className="text-center text-sm text-gray-600 mb-2">Pola saat ini:</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {pattern.map((colorIndex, index) => (
              <div
                key={index}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${index < userPattern.length 
                    ? userPattern[index] === colorIndex 
                      ? 'ring-2 ring-green-400' 
                      : 'ring-2 ring-red-400'
                    : 'opacity-50'
                  }
                `}
                style={{ backgroundColor: colors[colorIndex].color }}
              >
                {colors[colorIndex].emoji}
              </div>
            ))}
          </div>
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