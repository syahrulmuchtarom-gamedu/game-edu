'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

interface BalanceItem {
  id: string;
  emoji: string;
  weight: number;
  name: string;
}

const balanceItems: BalanceItem[] = [
  { id: '1', emoji: '🍎', weight: 1, name: 'Apel' },
  { id: '2', emoji: '🍌', weight: 2, name: 'Pisang' },
  { id: '3', emoji: '🍊', weight: 3, name: 'Jeruk' },
  { id: '4', emoji: '🥝', weight: 4, name: 'Kiwi' },
  { id: '5', emoji: '🍇', weight: 5, name: 'Anggur' },
];

export default function MathBalance() {
  const [leftSide, setLeftSide] = useState<BalanceItem[]>([]);
  const [rightSide, setRightSide] = useState<BalanceItem[]>([]);
  const [targetWeight, setTargetWeight] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  const generateTarget = () => {
    const target = Math.floor(Math.random() * (5 + level * 2)) + 3;
    setTargetWeight(target);
    setLeftSide([]);
    setRightSide([]);
  };

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setScore(0);
    setGameEnded(false);
    generateTarget();
  };

  const addToSide = (item: BalanceItem, side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftSide(prev => [...prev, item]);
    } else {
      setRightSide(prev => [...prev, item]);
    }
  };

  const removeFromSide = (index: number, side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftSide(prev => prev.filter((_, i) => i !== index));
    } else {
      setRightSide(prev => prev.filter((_, i) => i !== index));
    }
  };

  const getWeight = (items: BalanceItem[]) => {
    return items.reduce((sum, item) => sum + item.weight, 0);
  };

  const checkBalance = () => {
    const leftWeight = getWeight(leftSide);
    const rightWeight = getWeight(rightSide);
    
    if (leftWeight === rightWeight && leftWeight === targetWeight) {
      setScore(prev => prev + level * 20);
      setFeedback({show: true, type: 'success', message: `Seimbang! +${level * 20} poin! ⚖️`});
      
      setTimeout(() => {
        if (level >= 5) {
          endGame(true);
        } else {
          setLevel(prev => prev + 1);
          generateTarget();
        }
      }, 2000);
    } else if (leftWeight === rightWeight) {
      setFeedback({show: true, type: 'error', message: `Seimbang tapi bukan target ${targetWeight}! 😊`});
    } else {
      setFeedback({show: true, type: 'error', message: 'Belum seimbang! Coba lagi! 😊'});
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, 5 * 20);
    
    updatePlayerScore({
      gameId: 'math-balance',
      score: finalScore,
      timeSpent: 0,
      completed,
      attempts: 1
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
  };

  const getBalanceRotation = () => {
    const leftWeight = getWeight(leftSide);
    const rightWeight = getWeight(rightSide);
    const diff = leftWeight - rightWeight;
    const maxRotation = 15;
    const rotation = Math.max(-maxRotation, Math.min(maxRotation, diff * 3));
    return rotation;
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Timbangan Matematika" emoji="⚖️">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Timbangan Matematika
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Seimbangkan timbangan dengan berat yang tepat!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Letakkan buah di kedua sisi timbangan</li>
              <li>• Buat kedua sisi seimbang dengan berat target</li>
              <li>• Setiap buah punya berat berbeda</li>
              <li>• Selesaikan 5 level untuk menang</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Berat Buah:</h3>
            <div className="grid grid-cols-5 gap-2">
              {balanceItems.map(item => (
                <div key={item.id} className="text-center">
                  <div className="text-2xl">{item.emoji}</div>
                  <div className="text-xs font-semibold">{item.weight}</div>
                </div>
              ))}
            </div>
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
      <GameLayout title="Timbangan Matematika" emoji="⚖️">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {level >= 5 ? '🏆' : level >= 3 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {level >= 5 ? 'Master Timbangan!' : level >= 3 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">Level tercapai: {level}</div>
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

  const leftWeight = getWeight(leftSide);
  const rightWeight = getWeight(rightSide);
  const balanceRotation = getBalanceRotation();

  return (
    <GameLayout title="Timbangan Matematika" emoji="⚖️">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <ScoreTracker currentScore={score} showTotal={false} />
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
              Level {level} / 5
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
              Target: {targetWeight}
            </div>
          </div>
        </div>

        {/* Balance Scale */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-3xl">
          <div className="relative">
            {/* Balance Beam */}
            <div 
              className="w-80 h-2 bg-gray-600 mx-auto rounded-full transition-transform duration-500"
              style={{ transform: `rotate(${balanceRotation}deg)` }}
            />
            
            {/* Center Support */}
            <div className="w-4 h-16 bg-gray-600 mx-auto -mt-1 rounded-b-full" />
            
            {/* Left Pan */}
            <div 
              className="absolute left-8 -top-4 w-24 h-16 bg-gray-300 rounded-2xl border-4 border-gray-400 flex flex-wrap items-center justify-center p-1"
              style={{ transform: `rotate(${balanceRotation}deg)` }}
            >
              {leftSide.map((item, index) => (
                <button
                  key={index}
                  onClick={() => removeFromSide(index, 'left')}
                  className="text-lg hover:scale-110 transition-transform"
                >
                  {item.emoji}
                </button>
              ))}
            </div>
            
            {/* Right Pan */}
            <div 
              className="absolute right-8 -top-4 w-24 h-16 bg-gray-300 rounded-2xl border-4 border-gray-400 flex flex-wrap items-center justify-center p-1"
              style={{ transform: `rotate(${-balanceRotation}deg)` }}
            >
              {rightSide.map((item, index) => (
                <button
                  key={index}
                  onClick={() => removeFromSide(index, 'right')}
                  className="text-lg hover:scale-110 transition-transform"
                >
                  {item.emoji}
                </button>
              ))}
            </div>
            
            {/* Weight Display */}
            <div className="flex justify-between mt-8 px-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{leftWeight}</div>
                <div className="text-sm text-gray-600">Kiri</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{rightWeight}</div>
                <div className="text-sm text-gray-600">Kanan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Items to Add */}
        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Pilih Buah untuk Ditambahkan:
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {balanceItems.map(item => (
              <div key={item.id} className="text-center">
                <div className="text-4xl mb-2">{item.emoji}</div>
                <div className="text-sm font-semibold mb-2">Berat: {item.weight}</div>
                <div className="flex flex-col gap-2">
                  <GameButton
                    onClick={() => addToSide(item, 'left')}
                    variant="primary"
                    size="sm"
                    className="text-xs"
                  >
                    Kiri
                  </GameButton>
                  <GameButton
                    onClick={() => addToSide(item, 'right')}
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                  >
                    Kanan
                  </GameButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Check Balance Button */}
        <div className="text-center">
          <GameButton
            onClick={checkBalance}
            variant="success"
            size="lg"
            emoji="⚖️"
            disabled={leftWeight === 0 || rightWeight === 0}
          >
            Periksa Keseimbangan
          </GameButton>
        </div>

        {/* Status */}
        <div className="bg-gray-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Target: Buat kedua sisi seimbang dengan berat total {targetWeight}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Klik buah di timbangan untuk menghapusnya
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