'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { mathProblems } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function MathAdventure() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentProblem, setCurrentProblem] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});
  const [problems, setProblems] = useState(mathProblems.easy);

  useEffect(() => {
    setProblems(mathProblems[difficulty]);
    setCurrentProblem(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    setUserAnswer('');
  }, [difficulty]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentProblem(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    setUserAnswer('');
  };

  const checkAnswer = () => {
    const answer = parseInt(userAnswer);
    const correct = problems[currentProblem].answer;
    
    if (answer === correct) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      setScore(prev => prev + points);
      setFeedback({show: true, type: 'success', message: 'Benar! Hebat! 🎉'});
      
      setTimeout(() => {
        if (currentProblem < problems.length - 1) {
          setCurrentProblem(prev => prev + 1);
          setUserAnswer('');
        } else {
          endGame(true);
        }
      }, 1500);
    } else {
      setLives(prev => prev - 1);
      setFeedback({show: true, type: 'error', message: `Jawaban yang benar adalah ${correct} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        } else {
          setUserAnswer('');
        }
      }, 2000);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, problems.length * (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30));
    
    updatePlayerScore({
      gameId: 'math-adventure',
      score: finalScore,
      timeSpent: 0,
      completed,
      attempts: 4 - lives
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
    setCurrentProblem(0);
    setScore(0);
    setLives(3);
    setUserAnswer('');
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Petualangan Matematika" emoji="🧮">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🧮</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pilih Tingkat Kesulitan
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <GameButton
              variant={difficulty === 'easy' ? 'success' : 'secondary'}
              onClick={() => setDifficulty('easy')}
              emoji="🟢"
              size="lg"
            >
              Mudah (1-10)
            </GameButton>
            <GameButton
              variant={difficulty === 'medium' ? 'warning' : 'secondary'}
              onClick={() => setDifficulty('medium')}
              emoji="🟡"
              size="lg"
            >
              Sedang (1-50)
            </GameButton>
            <GameButton
              variant={difficulty === 'hard' ? 'danger' : 'secondary'}
              onClick={() => setDifficulty('hard')}
              emoji="🔴"
              size="lg"
            >
              Sulit (1-100)
            </GameButton>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Jawab soal matematika dengan benar</li>
              <li>• Kamu punya 3 nyawa ❤️</li>
              <li>• Semakin sulit, semakin banyak poin!</li>
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
      <GameLayout title="Petualangan Matematika" emoji="🧮">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score > problems.length * 15 ? '🏆' : score > problems.length * 10 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score > problems.length * 15 ? 'Luar Biasa!' : score > problems.length * 10 ? 'Bagus Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Soal dijawab: {currentProblem + (lives > 0 ? 1 : 0)} dari {problems.length}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GameButton onClick={resetGame} variant="primary" emoji="🔄">
              Main Lagi
            </GameButton>
            <GameButton onClick={() => setDifficulty(difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy')} variant="warning" emoji="⚡">
              Ganti Level
            </GameButton>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Petualangan Matematika" emoji="🧮">
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
              {currentProblem + 1} / {problems.length}
            </div>
          </div>
        </div>

        {/* Problem Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl text-center">
          <div className="text-lg text-gray-600 mb-4">
            {problems[currentProblem].visual}
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-6">
            {problems[currentProblem].question}
          </div>
          
          <div className="max-w-xs mx-auto">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full text-3xl font-bold text-center p-4 border-4 border-blue-300 rounded-2xl focus:border-blue-500 focus:outline-none"
              placeholder="?"
              autoFocus
            />
          </div>
        </div>

        {/* Answer Button */}
        <div className="text-center">
          <GameButton
            onClick={checkAnswer}
            disabled={!userAnswer}
            variant="success"
            size="lg"
            emoji="✅"
          >
            Jawab
          </GameButton>
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