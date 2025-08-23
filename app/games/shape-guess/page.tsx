'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { shapes } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

export default function ShapeGuess() {
  const [currentShape, setCurrentShape] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameMode, setGameMode] = useState<'name' | 'sides'>('name');
  const [shuffledShapes, setShuffledShapes] = useState(shapes);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  useEffect(() => {
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    setShuffledShapes(shuffled);
  }, [gameStarted]);

  const startGame = (mode: 'name' | 'sides') => {
    setGameMode(mode);
    setGameStarted(true);
    setCurrentShape(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    setShuffledShapes(shuffled);
  };

  const checkAnswer = (selectedAnswer: string | number) => {
    const shape = shuffledShapes[currentShape];
    const correctAnswer = gameMode === 'name' ? shape.name : shape.sides.toString();
    
    if (selectedAnswer.toString() === correctAnswer.toString()) {
      setScore(prev => prev + 20);
      setFeedback({show: true, type: 'success', message: 'Benar! Hebat! 🔺'});
      
      setTimeout(() => {
        if (currentShape < shuffledShapes.length - 1) {
          setCurrentShape(prev => prev + 1);
        } else {
          endGame(true);
        }
      }, 1500);
    } else {
      setLives(prev => prev - 1);
      setFeedback({show: true, type: 'error', message: `Jawaban yang benar: ${correctAnswer} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        }
      }, 2500);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, shuffledShapes.length * 20);
    
    updatePlayerScore({
      gameId: 'shape-guess',
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

  const getRandomOptions = () => {
    const shape = shuffledShapes[currentShape];
    if (gameMode === 'name') {
      const allNames = shapes.map(s => s.name);
      const wrongOptions = allNames.filter(name => name !== shape.name).sort(() => Math.random() - 0.5).slice(0, 3);
      return [shape.name, ...wrongOptions].sort(() => Math.random() - 0.5);
    } else {
      const allSides = [0, 3, 4, 5, 6, 8];
      const wrongOptions = allSides.filter(sides => sides !== shape.sides).sort(() => Math.random() - 0.5).slice(0, 3);
      return [shape.sides, ...wrongOptions].sort(() => Math.random() - 0.5);
    }
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Tebak Bentuk" emoji="🔺">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🔺</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tebak Bentuk Geometri
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Kenali berbagai bentuk geometri dan sifatnya!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <GameButton
              onClick={() => startGame('name')}
              variant="primary"
              size="lg"
              emoji="📝"
            >
              <div className="text-center">
                <div className="font-bold">Tebak Nama</div>
                <div className="text-sm opacity-75">Apa nama bentuk ini?</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('sides')}
              variant="success"
              size="lg"
              emoji="🔢"
            >
              <div className="text-center">
                <div className="font-bold">Hitung Sisi</div>
                <div className="text-sm opacity-75">Berapa sisi bentuk ini?</div>
              </div>
            </GameButton>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Bentuk yang Dipelajari:</h3>
            <div className="grid grid-cols-3 gap-4">
              {shapes.map((shape, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-1">{shape.shape}</div>
                  <div className="text-xs font-semibold">{shape.name}</div>
                  <div className="text-xs text-gray-600">{shape.sides} sisi</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Tahukah Kamu?</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Lingkaran tidak memiliki sisi</li>
              <li>• Segitiga memiliki 3 sisi</li>
              <li>• Persegi dan persegi panjang punya 4 sisi</li>
              <li>• Pentagon = 5 sisi, Hexagon = 6 sisi</li>
            </ul>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (gameEnded) {
    return (
      <GameLayout title="Tebak Bentuk" emoji="🔺">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= shuffledShapes.length * 15 ? '🏆' : score >= shuffledShapes.length * 10 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= shuffledShapes.length * 15 ? 'Master Geometri!' : score >= shuffledShapes.length * 10 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Mode: {gameMode === 'name' ? 'Tebak Nama' : 'Hitung Sisi'}
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

  const shape = shuffledShapes[currentShape];
  const options = getRandomOptions();

  return (
    <GameLayout title="Tebak Bentuk" emoji="🔺">
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
              {currentShape + 1} / {shuffledShapes.length}
            </div>
          </div>
        </div>

        {/* Shape Display */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl text-center">
          <div className="text-8xl mb-6">
            {shape.shape}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {gameMode === 'name' ? 'Apa nama bentuk ini?' : 'Berapa sisi bentuk ini?'}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <GameButton
              key={index}
              onClick={() => checkAnswer(option)}
              variant="primary"
              size="lg"
              className="h-16"
            >
              {gameMode === 'sides' && option !== 0 ? `${option} sisi` : 
               gameMode === 'sides' && option === 0 ? 'Tidak ada sisi' : 
               option}
            </GameButton>
          ))}
        </div>

        {/* Educational Info */}
        <div className="bg-yellow-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Tips: {gameMode === 'name' ? 'Perhatikan bentuk dan sudutnya' : 'Hitung garis tepi yang lurus'}
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