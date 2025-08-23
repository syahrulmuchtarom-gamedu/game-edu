'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { moonPhases } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

export default function MoonPhases() {
  const [gameMode, setGameMode] = useState<'sequence' | 'identify' | null>(null);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});
  const [shuffledPhases, setShuffledPhases] = useState(moonPhases);

  useEffect(() => {
    const shuffled = [...moonPhases].sort(() => Math.random() - 0.5);
    setShuffledPhases(shuffled);
  }, [gameMode]);

  const startGame = (mode: 'sequence' | 'identify') => {
    setGameMode(mode);
    setGameStarted(true);
    setScore(0);
    setCurrentPhase(0);
    setUserSequence([]);
    setGameEnded(false);
    
    if (mode === 'identify') {
      const shuffled = [...moonPhases].sort(() => Math.random() - 0.5);
      setShuffledPhases(shuffled);
    }
  };

  const addToSequence = (phaseIndex: number) => {
    const newSequence = [...userSequence, phaseIndex];
    setUserSequence(newSequence);
    
    if (newSequence.length === moonPhases.length) {
      checkSequence(newSequence);
    }
  };

  const checkSequence = (sequence: number[]) => {
    const correctSequence = moonPhases.map((_, index) => index);
    const isCorrect = sequence.every((phase, index) => {
      const correctPhase = moonPhases.find(p => p.order === index + 1);
      return correctPhase && moonPhases.indexOf(correctPhase) === phase;
    });
    
    if (isCorrect) {
      setScore(100);
      setFeedback({show: true, type: 'success', message: 'Sempurna! Urutan fase bulan benar! 🌙'});
      setTimeout(() => endGame(true), 2000);
    } else {
      setFeedback({show: true, type: 'error', message: 'Urutan belum tepat, coba lagi! 😊'});
      setTimeout(() => setUserSequence([]), 2000);
    }
  };

  const checkPhaseIdentification = (selectedName: string) => {
    const correctName = shuffledPhases[currentPhase].name;
    
    if (selectedName === correctName) {
      setScore(prev => prev + 15);
      setFeedback({show: true, type: 'success', message: 'Benar! 🌙'});
      
      setTimeout(() => {
        if (currentPhase < shuffledPhases.length - 1) {
          setCurrentPhase(prev => prev + 1);
        } else {
          endGame(true);
        }
      }, 1500);
    } else {
      setFeedback({show: true, type: 'error', message: `Jawaban yang benar: ${correctName} 😊`});
      setTimeout(() => {
        if (currentPhase < shuffledPhases.length - 1) {
          setCurrentPhase(prev => prev + 1);
        } else {
          endGame(false);
        }
      }, 2500);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, gameMode === 'sequence' ? 100 : shuffledPhases.length * 15);
    
    updatePlayerScore({
      gameId: 'moon-phases',
      score: finalScore,
      timeSpent: 0,
      completed,
      attempts: 1
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameMode(null);
    setGameEnded(false);
  };

  const getRandomOptions = () => {
    const correct = shuffledPhases[currentPhase].name;
    const allNames = moonPhases.map(p => p.name);
    const wrongOptions = allNames.filter(n => n !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Fase Bulan" emoji="🌙">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🌙</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Belajar Fase Bulan
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Pelajari siklus 8 fase bulan dalam astronomi!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <GameButton
              onClick={() => startGame('sequence')}
              variant="primary"
              size="lg"
              emoji="🔄"
            >
              <div className="text-center">
                <div className="font-bold">Urutan Fase</div>
                <div className="text-sm opacity-75">Susun urutan yang benar</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('identify')}
              variant="success"
              size="lg"
              emoji="🎯"
            >
              <div className="text-center">
                <div className="font-bold">Tebak Fase</div>
                <div className="text-sm opacity-75">Kenali nama fase bulan</div>
              </div>
            </GameButton>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Tahukah Kamu?</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Siklus bulan berlangsung 29,5 hari</li>
              <li>• Ada 8 fase utama bulan</li>
              <li>• Fase bulan mempengaruhi pasang surut</li>
              <li>• Bulan tidak menghasilkan cahaya sendiri</li>
            </ul>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (gameEnded) {
    return (
      <GameLayout title="Fase Bulan" emoji="🌙">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= 80 ? '🏆' : score >= 60 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= 80 ? 'Astronom Muda!' : score >= 60 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Mode: {gameMode === 'sequence' ? 'Urutan Fase' : 'Tebak Fase'}
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

  if (gameMode === 'sequence') {
    return (
      <GameLayout title="Fase Bulan" emoji="🌙">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <ScoreTracker currentScore={score} showTotal={false} />
            <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
              {userSequence.length} / {moonPhases.length}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-3xl text-center">
            <div className="text-6xl mb-4">🌙</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Susun Urutan Fase Bulan
            </h3>
            <p className="text-gray-600 mb-6">
              Klik fase bulan sesuai urutan siklus yang benar!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {moonPhases.map((phase, index) => (
              <GameButton
                key={index}
                onClick={() => addToSequence(index)}
                variant={userSequence.includes(index) ? 'success' : 'primary'}
                size="lg"
                disabled={userSequence.includes(index)}
                className="h-24 flex-col"
              >
                <div className="text-3xl mb-1">{phase.emoji}</div>
                <div className="text-xs text-center">{phase.name}</div>
                {userSequence.includes(index) && (
                  <div className="text-lg font-bold mt-1">
                    {userSequence.indexOf(index) + 1}
                  </div>
                )}
              </GameButton>
            ))}
          </div>

          {userSequence.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-2xl">
              <h4 className="font-semibold text-gray-800 mb-2 text-center">Urutan yang dipilih:</h4>
              <div className="flex justify-center gap-2 flex-wrap">
                {userSequence.map((phaseIndex, order) => (
                  <div key={order} className="bg-yellow-200 px-3 py-2 rounded-xl text-center">
                    <div className="text-2xl">{moonPhases[phaseIndex].emoji}</div>
                    <div className="text-xs">{order + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

  if (gameMode === 'identify') {
    const phase = shuffledPhases[currentPhase];
    const options = getRandomOptions();
    
    return (
      <GameLayout title="Fase Bulan" emoji="🌙">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <ScoreTracker currentScore={score} showTotal={false} />
            <div className="bg-purple-100 px-3 py-1 rounded-full text-sm font-semibold">
              {currentPhase + 1} / {shuffledPhases.length}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-3xl text-center">
            <div className="text-8xl mb-6">{phase.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Apa nama fase bulan ini?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <GameButton
                key={index}
                onClick={() => checkPhaseIdentification(option)}
                variant="primary"
                size="lg"
                className="h-16"
              >
                {option}
              </GameButton>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl text-center">
            <p className="text-sm text-gray-600">
              💡 Tip: Perhatikan bentuk dan posisi bagian terang bulan
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

  return null;
}