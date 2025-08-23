'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { traditionalHouses } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

export default function TraditionalHouses() {
  const [currentHouse, setCurrentHouse] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});
  const [shuffledHouses, setShuffledHouses] = useState(traditionalHouses);

  useEffect(() => {
    const shuffled = [...traditionalHouses].sort(() => Math.random() - 0.5);
    setShuffledHouses(shuffled);
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentHouse(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    setShowInfo(false);
    const shuffled = [...traditionalHouses].sort(() => Math.random() - 0.5);
    setShuffledHouses(shuffled);
  };

  const checkAnswer = (selectedRegion: string) => {
    const correctRegion = shuffledHouses[currentHouse].region;
    
    if (selectedRegion === correctRegion) {
      setScore(prev => prev + 20);
      setShowInfo(true);
      setFeedback({show: true, type: 'success', message: 'Benar! Hebat! 🎉'});
      
      setTimeout(() => {
        if (currentHouse < shuffledHouses.length - 1) {
          setCurrentHouse(prev => prev + 1);
          setShowInfo(false);
        } else {
          endGame(true);
        }
      }, 3000);
    } else {
      setLives(prev => prev - 1);
      setFeedback({show: true, type: 'error', message: `Jawaban yang benar: ${correctRegion} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        } else {
          setShowInfo(false);
        }
      }, 2500);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, shuffledHouses.length * 20);
    
    updatePlayerScore({
      gameId: 'traditional-houses',
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
    const correct = shuffledHouses[currentHouse].region;
    const allRegions = traditionalHouses.map(h => h.region);
    const wrongOptions = allRegions.filter(r => r !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Tebak Rumah Adat" emoji="🏠">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tebak Rumah Adat Indonesia
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Kenali rumah adat dari berbagai daerah di Indonesia!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Lihat gambar rumah adat yang ditampilkan</li>
              <li>• Pilih daerah asal yang benar</li>
              <li>• Pelajari info menarik tentang rumah adat</li>
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
      <GameLayout title="Tebak Rumah Adat" emoji="🏠">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= shuffledHouses.length * 15 ? '🏆' : score >= shuffledHouses.length * 10 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= shuffledHouses.length * 15 ? 'Master Budaya!' : score >= shuffledHouses.length * 10 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Rumah adat dikenali: {currentHouse + (lives > 0 ? 1 : 0)} dari {shuffledHouses.length}
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

  const house = shuffledHouses[currentHouse];
  const options = getRandomOptions();

  return (
    <GameLayout title="Tebak Rumah Adat" emoji="🏠">
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
              {currentHouse + 1} / {shuffledHouses.length}
            </div>
          </div>
        </div>

        {/* House Display */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-3xl text-center">
          <div className="text-8xl mb-6">
            {house.image}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {house.name}
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Dari daerah mana rumah adat ini berasal?
          </p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((region, index) => (
            <GameButton
              key={index}
              onClick={() => checkAnswer(region)}
              variant="primary"
              size="lg"
              className="h-16"
              disabled={showInfo}
            >
              {region}
            </GameButton>
          ))}
        </div>

        {/* Info Display */}
        {showInfo && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-3xl">
            <div className="text-center">
              <div className="text-4xl mb-3">📚</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Tahukah Kamu?</h4>
              <p className="text-gray-700">{house.info}</p>
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