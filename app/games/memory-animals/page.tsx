'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { animals } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

interface Card {
  id: number;
  animal: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type GridSize = '2x2' | '3x2' | '4x3';

export default function MemoryAnimals() {
  const [gridSize, setGridSize] = useState<GridSize>('2x2');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error'}>({show: false, type: 'success'});

  const gridConfigs = {
    '2x2': { pairs: 2, cols: 2, difficulty: 'Mudah' },
    '3x2': { pairs: 3, cols: 3, difficulty: 'Sedang' },
    '4x3': { pairs: 6, cols: 4, difficulty: 'Sulit' }
  };

  const initializeGame = () => {
    const config = gridConfigs[gridSize];
    const selectedAnimals = animals.slice(0, config.pairs);
    const gameCards: Card[] = [];
    
    // Create pairs
    selectedAnimals.forEach((animal, index) => {
      gameCards.push(
        { id: index * 2, animal, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, animal, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setScore(0);
    setGameEnded(false);
  };

  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gridSize, gameStarted]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);

      if (firstCard && secondCard && firstCard.animal === secondCard.animal) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setScore(prev => prev + (gridSize === '2x2' ? 20 : gridSize === '3x2' ? 30 : 50));
          setFeedback({show: true, type: 'success'});
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFeedback({show: true, type: 'error'});
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards, gridSize]);

  useEffect(() => {
    const totalPairs = gridConfigs[gridSize].pairs;
    if (matches === totalPairs && gameStarted) {
      setTimeout(() => {
        setGameEnded(true);
        const finalScore = calculateScore(matches, totalPairs, Math.max(0, 100 - moves * 5));
        updatePlayerScore({
          gameId: 'memory-animals',
          score: finalScore,
          timeSpent: 0,
          completed: true,
          attempts: 1
        });
      }, 1500);
    }
  }, [matches, gridSize, gameStarted, moves]);

  const flipCard = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const startGame = () => {
    setGameStarted(true);
    initializeGame();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Memory Hewan" emoji="🐱">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🐱</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pilih Tingkat Kesulitan
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {Object.entries(gridConfigs).map(([size, config]) => (
              <GameButton
                key={size}
                variant={gridSize === size ? 'success' : 'secondary'}
                onClick={() => setGridSize(size as GridSize)}
                size="lg"
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {size === '2x2' ? '🟢' : size === '3x2' ? '🟡' : '🔴'}
                  </div>
                  <div>{config.difficulty}</div>
                  <div className="text-sm opacity-75">{size}</div>
                </div>
              </GameButton>
            ))}
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Klik kartu untuk membaliknya</li>
              <li>• Cari pasangan hewan yang sama</li>
              <li>• Semakin sedikit langkah, semakin tinggi skor!</li>
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
      <GameLayout title="Memory Hewan" emoji="🐱">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800">Selamat!</h2>
          <p className="text-xl text-gray-600">Kamu berhasil mencocokkan semua hewan!</p>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor: {score}</div>
            <div className="text-sm opacity-90">Langkah: {moves}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GameButton onClick={resetGame} variant="primary" emoji="🔄">
              Main Lagi
            </GameButton>
            <GameButton 
              onClick={() => {
                const sizes: GridSize[] = ['2x2', '3x2', '4x3'];
                const currentIndex = sizes.indexOf(gridSize);
                const nextSize = sizes[(currentIndex + 1) % sizes.length];
                setGridSize(nextSize);
                initializeGame();
              }} 
              variant="warning" 
              emoji="⚡"
            >
              Level Berikutnya
            </GameButton>
          </div>
        </div>
      </GameLayout>
    );
  }

  const config = gridConfigs[gridSize];

  return (
    <GameLayout title="Memory Hewan" emoji="🐱">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <ScoreTracker currentScore={score} showTotal={false} />
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
              Langkah: {moves}
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
              {matches} / {config.pairs} pasang
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div 
          className={`grid gap-4 max-w-2xl mx-auto`}
          style={{ 
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
            aspectRatio: config.cols === 2 ? '1' : config.cols === 3 ? '3/2' : '4/3'
          }}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => flipCard(card.id)}
              disabled={card.isFlipped || card.isMatched || flippedCards.length >= 2}
              className={`
                aspect-square rounded-2xl text-4xl sm:text-5xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95
                ${card.isFlipped || card.isMatched 
                  ? 'bg-white shadow-lg' 
                  : 'bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 shadow-xl'
                }
                ${card.isMatched ? 'ring-4 ring-green-400' : ''}
              `}
            >
              {card.isFlipped || card.isMatched ? card.animal : '❓'}
            </button>
          ))}
        </div>
      </div>

      <AnimatedFeedback
        type={feedback.type}
        show={feedback.show}
        onComplete={() => setFeedback({...feedback, show: false})}
      />
    </GameLayout>
  );
}