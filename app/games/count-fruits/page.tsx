'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

const fruits = ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍'];

export default function CountFruits() {
  const [currentFruits, setCurrentFruits] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  const generateFruits = () => {
    const maxFruits = Math.min(5 + level, 20);
    const count = Math.floor(Math.random() * maxFruits) + 1;
    const selectedFruit = fruits[Math.floor(Math.random() * fruits.length)];
    const fruitArray = Array(count).fill(selectedFruit);
    
    // Add some random other fruits for distraction (higher levels)
    if (level > 3) {
      const distractorCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < distractorCount; i++) {
        const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
        if (randomFruit !== selectedFruit) {
          fruitArray.push(randomFruit);
        }
      }
    }
    
    // Shuffle array
    for (let i = fruitArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fruitArray[i], fruitArray[j]] = [fruitArray[j], fruitArray[i]];
    }
    
    setCurrentFruits(fruitArray);
    setCorrectAnswer(count);
    setUserAnswer('');
  };

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    generateFruits();
  };

  const checkAnswer = () => {
    const answer = parseInt(userAnswer);
    
    if (answer === correctAnswer) {
      const points = level * 10;
      setScore(prev => prev + points);
      setFeedback({show: true, type: 'success', message: `Benar! Ada ${correctAnswer} buah! +${points} poin 🎉`});
      
      setTimeout(() => {
        setLevel(prev => prev + 1);
        generateFruits();
      }, 2000);
    } else {
      setLives(prev => prev - 1);
      setFeedback({show: true, type: 'error', message: `Jawaban yang benar adalah ${correctAnswer} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        } else {
          generateFruits();
        }
      }, 2500);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, level * 50);
    
    updatePlayerScore({
      gameId: 'count-fruits',
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
      <GameLayout title="Hitung Buah" emoji="🍎">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🍎</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Hitung Buah-Buahan
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Hitung berapa banyak buah yang sama!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Hitung buah yang sama dengan yang ditanyakan</li>
              <li>• Abaikan buah yang berbeda</li>
              <li>• Level semakin tinggi, semakin banyak buah</li>
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
      <GameLayout title="Hitung Buah" emoji="🍎">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {level >= 10 ? '🏆' : level >= 5 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {level >= 10 ? 'Master Berhitung!' : level >= 5 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
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

  const targetFruit = currentFruits.find(fruit => 
    currentFruits.filter(f => f === fruit).length === correctAnswer
  ) || currentFruits[0];

  return (
    <GameLayout title="Hitung Buah" emoji="🍎">
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

        {/* Question */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-3xl text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Hitung berapa banyak {targetFruit} yang ada:
          </h3>
          <div className="text-6xl mb-4">{targetFruit}</div>
        </div>

        {/* Fruits Display */}
        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 justify-items-center">
            {currentFruits.map((fruit, index) => (
              <div
                key={index}
                className={`text-4xl p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                  fruit === targetFruit ? 'bg-yellow-100' : 'bg-gray-50'
                }`}
              >
                {fruit}
              </div>
            ))}
          </div>
        </div>

        {/* Answer Input */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-3xl text-center">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Berapa banyak {targetFruit} yang kamu hitung?
          </p>
          <div className="max-w-xs mx-auto mb-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full text-3xl font-bold text-center p-4 border-4 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none"
              placeholder="?"
              min="0"
              max="20"
              autoFocus
            />
          </div>
          
          <GameButton
            onClick={checkAnswer}
            disabled={!userAnswer}
            variant="success"
            size="lg"
            emoji="✅"
          >
            Periksa Jawaban
          </GameButton>
        </div>

        {/* Hint */}
        <div className="bg-yellow-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Tip: Fokus hanya pada buah {targetFruit} dan abaikan buah lainnya!
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