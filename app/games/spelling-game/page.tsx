'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { spellingWords } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

export default function SpellingGame() {
  const [currentWord, setCurrentWord] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});
  const [shuffledWords, setShuffledWords] = useState(spellingWords);

  useEffect(() => {
    // Shuffle words when game starts
    const shuffled = [...spellingWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentWord(0);
    setUserInput('');
    setScore(0);
    setLives(3);
    setGameEnded(false);
    setShowHint(false);
    const shuffled = [...spellingWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  };

  const checkSpelling = () => {
    const correctWord = shuffledWords[currentWord].word;
    const userAnswer = userInput.toUpperCase().trim();
    
    if (userAnswer === correctWord) {
      setScore(prev => prev + 20);
      setFeedback({show: true, type: 'success', message: 'Benar! Ejaan sempurna! 🎉'});
      
      setTimeout(() => {
        if (currentWord < shuffledWords.length - 1) {
          setCurrentWord(prev => prev + 1);
          setUserInput('');
          setShowHint(false);
        } else {
          endGame(true);
        }
      }, 1500);
    } else {
      setLives(prev => prev - 1);
      setFeedback({show: true, type: 'error', message: `Ejaan yang benar: ${correctWord} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        } else {
          setUserInput('');
          setShowHint(false);
        }
      }, 2500);
    }
  };

  const useHint = () => {
    setShowHint(true);
    setScore(prev => Math.max(0, prev - 5)); // Penalty for using hint
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, shuffledWords.length * 20);
    
    updatePlayerScore({
      gameId: 'spelling-game',
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
      <GameLayout title="Tebak Ejaan" emoji="📝">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tebak Ejaan Kata
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Lihat gambar dan eja kata dengan benar!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Lihat gambar yang ditampilkan</li>
              <li>• Ketik ejaan kata yang benar</li>
              <li>• Gunakan petunjuk jika kesulitan</li>
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
      <GameLayout title="Tebak Ejaan" emoji="📝">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= shuffledWords.length * 15 ? '🏆' : score >= shuffledWords.length * 10 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= shuffledWords.length * 15 ? 'Luar Biasa!' : score >= shuffledWords.length * 10 ? 'Bagus Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Kata berhasil: {currentWord + (lives > 0 ? 1 : 0)} dari {shuffledWords.length}
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

  const word = shuffledWords[currentWord];

  return (
    <GameLayout title="Tebak Ejaan" emoji="📝">
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
              {currentWord + 1} / {shuffledWords.length}
            </div>
          </div>
        </div>

        {/* Word Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl text-center">
          <div className="text-8xl mb-6">
            {word.image}
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Eja kata untuk gambar di atas:
          </p>
          
          <div className="max-w-xs mx-auto mb-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.toUpperCase())}
              className="w-full text-2xl font-bold text-center p-4 border-4 border-blue-300 rounded-2xl focus:border-blue-500 focus:outline-none uppercase"
              placeholder="KETIK DI SINI"
              autoFocus
              maxLength={word.word.length + 2}
            />
          </div>

          {/* Hint Section */}
          <div className="mb-4">
            {showHint ? (
              <div className="bg-yellow-100 p-3 rounded-xl">
                <p className="text-sm text-gray-600">Petunjuk:</p>
                <p className="font-bold text-lg">Dimulai dengan huruf "{word.hint}"</p>
              </div>
            ) : (
              <GameButton
                onClick={useHint}
                variant="warning"
                size="sm"
                emoji="💡"
              >
                Petunjuk (-5 poin)
              </GameButton>
            )}
          </div>
        </div>

        {/* Answer Button */}
        <div className="text-center">
          <GameButton
            onClick={checkSpelling}
            disabled={!userInput.trim()}
            variant="success"
            size="lg"
            emoji="✅"
          >
            Periksa Ejaan
          </GameButton>
        </div>

        {/* Letter Helper */}
        <div className="bg-gray-50 p-4 rounded-2xl">
          <p className="text-center text-sm text-gray-600 mb-2">Panjang kata: {word.word.length} huruf</p>
          <div className="flex justify-center gap-2">
            {word.word.split('').map((_, index) => (
              <div
                key={index}
                className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-lg font-bold"
              >
                {userInput[index] || ''}
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