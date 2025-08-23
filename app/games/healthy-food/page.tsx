'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { healthyFoodCategories } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

const foodItems = [
  { name: 'Nasi', emoji: '🍚', category: 'carbs' },
  { name: 'Roti', emoji: '🍞', category: 'carbs' },
  { name: 'Kentang', emoji: '🥔', category: 'carbs' },
  { name: 'Ikan', emoji: '🐟', category: 'protein' },
  { name: 'Ayam', emoji: '🍗', category: 'protein' },
  { name: 'Telur', emoji: '🥚', category: 'protein' },
  { name: 'Tahu', emoji: '🧈', category: 'protein' },
  { name: 'Apel', emoji: '🍎', category: 'vitamins' },
  { name: 'Pisang', emoji: '🍌', category: 'vitamins' },
  { name: 'Wortel', emoji: '🥕', category: 'vitamins' },
  { name: 'Tomat', emoji: '🍅', category: 'vitamins' },
  { name: 'Bayam', emoji: '🥬', category: 'minerals' },
  { name: 'Brokoli', emoji: '🥦', category: 'minerals' },
  { name: 'Susu', emoji: '🥛', category: 'dairy' },
  { name: 'Keju', emoji: '🧀', category: 'dairy' },
  { name: 'Yogurt', emoji: '🍦', category: 'dairy' }
];

export default function HealthyFood() {
  const [gameMode, setGameMode] = useState<'categorize' | 'quiz' | null>(null);
  const [currentFood, setCurrentFood] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [plate, setPlate] = useState<{[key: string]: string[]}>({
    carbs: [],
    protein: [],
    vitamins: [],
    minerals: [],
    dairy: []
  });
  const [shuffledFoods, setShuffledFoods] = useState(foodItems);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  useEffect(() => {
    const shuffled = [...foodItems].sort(() => Math.random() - 0.5);
    setShuffledFoods(shuffled);
  }, [gameStarted]);

  const startGame = (mode: 'categorize' | 'quiz') => {
    setGameMode(mode);
    setGameStarted(true);
    setCurrentFood(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    setPlate({ carbs: [], protein: [], vitamins: [], minerals: [], dairy: [] });
    const shuffled = [...foodItems].sort(() => Math.random() - 0.5);
    setShuffledFoods(shuffled);
  };

  const addToPlate = (category: string) => {
    const food = shuffledFoods[currentFood];
    
    if (category === food.category) {
      setScore(prev => prev + 15);
      setPlate(prev => ({
        ...prev,
        [category]: [...prev[category], food.emoji]
      }));
      setFeedback({show: true, type: 'success', message: `Benar! ${food.name} masuk ${healthyFoodCategories[category as keyof typeof healthyFoodCategories].name}! 🍽️`});
      
      setTimeout(() => {
        if (currentFood < shuffledFoods.length - 1) {
          setCurrentFood(prev => prev + 1);
        } else {
          endGame(true);
        }
      }, 2000);
    } else {
      setLives(prev => prev - 1);
      setFeedback({show: true, type: 'error', message: `${food.name} seharusnya masuk ${healthyFoodCategories[food.category as keyof typeof healthyFoodCategories].name} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        }
      }, 2500);
    }
  };

  const checkQuizAnswer = (selectedCategory: string) => {
    const food = shuffledFoods[currentFood];
    
    if (selectedCategory === food.category) {
      setScore(prev => prev + 20);
      setFeedback({show: true, type: 'success', message: 'Benar! Hebat! 🥗'});
      
      setTimeout(() => {
        if (currentFood < shuffledFoods.length - 1) {
          setCurrentFood(prev => prev + 1);
        } else {
          endGame(true);
        }
      }, 1500);
    } else {
      setLives(prev => prev - 1);
      const correctCategory = healthyFoodCategories[food.category as keyof typeof healthyFoodCategories].name;
      setFeedback({show: true, type: 'error', message: `Jawaban yang benar: ${correctCategory} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        }
      }, 2500);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, shuffledFoods.length * (gameMode === 'categorize' ? 15 : 20));
    
    updatePlayerScore({
      gameId: 'healthy-food',
      score: finalScore,
      timeSpent: 0,
      completed,
      attempts: 4 - lives
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameMode(null);
    setGameEnded(false);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Makanan 4 Sehat 5 Sempurna" emoji="🥗">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🥗</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Makanan 4 Sehat 5 Sempurna
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Belajar mengelompokkan makanan sehat untuk tubuh!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <GameButton
              onClick={() => startGame('categorize')}
              variant="primary"
              size="lg"
              emoji="🍽️"
            >
              <div className="text-center">
                <div className="font-bold">Susun Piring</div>
                <div className="text-sm opacity-75">Kelompokkan makanan</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('quiz')}
              variant="success"
              size="lg"
              emoji="🧠"
            >
              <div className="text-center">
                <div className="font-bold">Kuis Nutrisi</div>
                <div className="text-sm opacity-75">Tebak kategori makanan</div>
              </div>
            </GameButton>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">5 Kelompok Makanan Sehat:</h3>
            <div className="space-y-2">
              {Object.entries(healthyFoodCategories).map(([key, category]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-2xl">{category.emoji}</span>
                  <span className="font-semibold">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Mengapa Penting?</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Tubuh butuh nutrisi lengkap</li>
              <li>• Setiap kelompok punya fungsi berbeda</li>
              <li>• Makan seimbang = tubuh sehat</li>
              <li>• Variasi makanan = nutrisi optimal</li>
            </ul>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (gameEnded) {
    return (
      <GameLayout title="Makanan 4 Sehat 5 Sempurna" emoji="🥗">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= shuffledFoods.length * 12 ? '🏆' : score >= shuffledFoods.length * 8 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= shuffledFoods.length * 12 ? 'Ahli Nutrisi!' : score >= shuffledFoods.length * 8 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Mode: {gameMode === 'categorize' ? 'Susun Piring' : 'Kuis Nutrisi'}
            </div>
          </div>

          {gameMode === 'categorize' && (
            <div className="bg-green-50 p-6 rounded-2xl max-w-md mx-auto">
              <h3 className="font-bold text-gray-800 mb-2">Piring Sehatmu:</h3>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(healthyFoodCategories).map(([key, category]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg mb-1">{category.emoji}</div>
                    <div className="text-xs font-semibold mb-1">{category.name}</div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {plate[key].map((food, index) => (
                        <span key={index} className="text-sm">{food}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GameButton onClick={resetGame} variant="primary" emoji="🔄">
              Main Lagi
            </GameButton>
          </div>
        </div>
      </GameLayout>
    );
  }

  const food = shuffledFoods[currentFood];

  if (gameMode === 'categorize') {
    return (
      <GameLayout title="Makanan 4 Sehat 5 Sempurna" emoji="🥗">
        <div className="space-y-6">
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
                {currentFood + 1} / {shuffledFoods.length}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-8 rounded-3xl text-center">
            <div className="text-8xl mb-4">{food.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{food.name}</h3>
            <p className="text-lg text-gray-600">Masukkan ke kelompok mana?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {Object.entries(healthyFoodCategories).map(([key, category]) => (
              <GameButton
                key={key}
                onClick={() => addToPlate(key)}
                variant="primary"
                size="lg"
                className="h-20 flex-col"
              >
                <div className="text-3xl mb-1">{category.emoji}</div>
                <div className="text-xs text-center">{category.name}</div>
              </GameButton>
            ))}
          </div>

          {/* Current Plate */}
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Piring Sehatmu:</h4>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(healthyFoodCategories).map(([key, category]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <div className="text-xs font-semibold mb-2">{category.name}</div>
                  <div className="min-h-[40px] bg-gray-50 rounded-lg p-2 flex flex-wrap justify-center gap-1">
                    {plate[key].map((foodEmoji, index) => (
                      <span key={index} className="text-lg">{foodEmoji}</span>
                    ))}
                  </div>
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

  // Quiz mode
  return (
    <GameLayout title="Makanan 4 Sehat 5 Sempurna" emoji="🥗">
      <div className="space-y-6">
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
            <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
              {currentFood + 1} / {shuffledFoods.length}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-8 rounded-3xl text-center">
          <div className="text-8xl mb-4">{food.emoji}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{food.name}</h3>
          <p className="text-lg text-gray-600">Termasuk kelompok makanan apa?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {Object.entries(healthyFoodCategories).map(([key, category]) => (
            <GameButton
              key={key}
              onClick={() => checkQuizAnswer(key)}
              variant="success"
              size="lg"
              className="h-20 flex-col"
            >
              <div className="text-3xl mb-1">{category.emoji}</div>
              <div className="text-xs text-center">{category.name}</div>
            </GameButton>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Tips: Pikirkan fungsi utama makanan ini untuk tubuh
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