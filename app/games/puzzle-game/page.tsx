'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

const puzzleImages = ['🐱', '🐶', '🦁', '🐸', '🦋', '🌸', '🌈', '⭐'];

export default function PuzzleGame() {
  const [puzzle, setPuzzle] = useState<(string | null)[]>(Array(9).fill(null));
  const [solution, setSolution] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentImage, setCurrentImage] = useState('🐱');
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  const initializePuzzle = () => {
    const image = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
    setCurrentImage(image);
    
    // Create solved state (8 pieces + 1 empty)
    const solvedPuzzle = Array(8).fill(image).concat([null]);
    setSolution([...solvedPuzzle]);
    
    // Shuffle puzzle
    const shuffled = [...solvedPuzzle];
    for (let i = 0; i < 100; i++) {
      const emptyIndex = shuffled.indexOf(null);
      const possibleMoves = getPossibleMoves(emptyIndex);
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
    }
    
    setPuzzle(shuffled);
    setMoves(0);
  };

  const getPossibleMoves = (emptyIndex: number) => {
    const moves = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;
    
    // Up
    if (row > 0) moves.push(emptyIndex - 3);
    // Down
    if (row < 2) moves.push(emptyIndex + 3);
    // Left
    if (col > 0) moves.push(emptyIndex - 1);
    // Right
    if (col < 2) moves.push(emptyIndex + 1);
    
    return moves;
  };

  const moveTile = (index: number) => {
    const emptyIndex = puzzle.indexOf(null);
    const possibleMoves = getPossibleMoves(emptyIndex);
    
    if (possibleMoves.includes(index)) {
      const newPuzzle = [...puzzle];
      [newPuzzle[emptyIndex], newPuzzle[index]] = [newPuzzle[index], newPuzzle[emptyIndex]];
      setPuzzle(newPuzzle);
      setMoves(prev => prev + 1);
      
      // Check if solved
      if (isPuzzleSolved(newPuzzle)) {
        const points = Math.max(100 - moves, 20);
        setScore(prev => prev + points);
        setFeedback({show: true, type: 'success', message: `Selesai! +${points} poin! 🧩`});
        
        setTimeout(() => {
          endGame(true);
        }, 2000);
      }
    }
  };

  const isPuzzleSolved = (currentPuzzle: (string | null)[]) => {
    return currentPuzzle.every((piece, index) => piece === solution[index]);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameEnded(false);
    initializePuzzle();
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, 100);
    
    updatePlayerScore({
      gameId: 'puzzle-game',
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

  const shufflePuzzle = () => {
    initializePuzzle();
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Puzzle Gambar" emoji="🧩">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🧩</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Puzzle Gambar 8-Tile
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Susun puzzle dengan menggeser tile ke posisi yang benar!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Klik tile yang ingin digeser</li>
              <li>• Tile hanya bisa bergerak ke kotak kosong</li>
              <li>• Susun semua tile sesuai pola</li>
              <li>• Semakin sedikit langkah, semakin tinggi skor!</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Target Susunan:</h3>
            <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
              {Array(8).fill('🧩').map((emoji, index) => (
                <div key={index} className="w-10 h-10 bg-white rounded border-2 border-gray-300 flex items-center justify-center text-lg">
                  {emoji}
                </div>
              ))}
              <div className="w-10 h-10 bg-gray-200 rounded border-2 border-gray-300"></div>
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
      <GameLayout title="Puzzle Gambar" emoji="🧩">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {moves <= 20 ? '🏆' : moves <= 40 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {moves <= 20 ? 'Master Puzzle!' : moves <= 40 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">Langkah: {moves}</div>
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
    <GameLayout title="Puzzle Gambar" emoji="🧩">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <ScoreTracker currentScore={score} showTotal={false} />
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
              Langkah: {moves}
            </div>
            <GameButton
              onClick={shufflePuzzle}
              variant="warning"
              size="sm"
              emoji="🔀"
            >
              Acak Ulang
            </GameButton>
          </div>
        </div>

        {/* Puzzle Grid */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Susun Puzzle {currentImage}
          </h3>
          
          <div className="grid grid-cols-3 gap-2 w-80 mx-auto">
            {puzzle.map((piece, index) => (
              <button
                key={index}
                onClick={() => moveTile(index)}
                className={`
                  w-24 h-24 rounded-2xl border-4 flex items-center justify-center text-4xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95
                  ${piece === null 
                    ? 'bg-gray-200 border-gray-300 cursor-default' 
                    : 'bg-white border-gray-400 hover:border-blue-400 shadow-lg hover:shadow-xl cursor-pointer'
                  }
                `}
                disabled={piece === null}
              >
                {piece}
              </button>
            ))}
          </div>
        </div>

        {/* Reference Image */}
        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Target Susunan:
          </h4>
          <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
            {solution.map((piece, index) => (
              <div 
                key={index} 
                className={`
                  w-10 h-10 rounded border-2 flex items-center justify-center text-lg
                  ${piece === null ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-400'}
                `}
              >
                {piece}
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Tips: Mulai dari sudut dan tepi, lalu susun bagian tengah
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