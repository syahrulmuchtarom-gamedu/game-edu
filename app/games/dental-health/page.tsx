'use client';

import { useState } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { dentalHealthData } from '@/utils/gameData';
import { updatePlayerScore } from '@/utils/scoreUtils';

type GameMode = 'tools' | 'steps' | 'foods';

export default function DentalHealth() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(true);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedSteps([]);
  };

  const checkToolAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback({show: true, type: 'success', message: 'Benar! Alat yang tepat! 🎉'});
    } else {
      setFeedback({show: true, type: 'error', message: 'Salah! Pilih alat yang benar 😊'});
    }
    
    setTimeout(() => {
      if (currentQuestion < dentalHealthData.tools.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        endGame();
      }
    }, 2000);
  };

  const checkFoodAnswer = (isGood: boolean, expectedGood: boolean) => {
    if (isGood === expectedGood) {
      setScore(prev => prev + 10);
      setFeedback({show: true, type: 'success', message: expectedGood ? 'Benar! Baik untuk gigi! 🦷' : 'Benar! Buruk untuk gigi! ⚠️'});
    } else {
      setFeedback({show: true, type: 'error', message: 'Coba pikirkan lagi! 😊'});
    }
    
    setTimeout(() => {
      if (currentQuestion < 8) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        endGame();
      }
    }, 2000);
  };

  const addStep = (step: string) => {
    if (!selectedSteps.includes(step)) {
      const newSteps = [...selectedSteps, step];
      setSelectedSteps(newSteps);
      
      if (newSteps.length === dentalHealthData.steps.length) {
        const isCorrectOrder = newSteps.every((step, index) => step === dentalHealthData.steps[index]);
        if (isCorrectOrder) {
          setScore(prev => prev + 50);
          setFeedback({show: true, type: 'success', message: 'Sempurna! Urutan benar! 🎉'});
        } else {
          setFeedback({show: true, type: 'error', message: 'Urutan belum tepat, coba lagi! 😊'});
          setSelectedSteps([]);
        }
        
        setTimeout(() => {
          if (isCorrectOrder) {
            endGame();
          }
        }, 2000);
      }
    }
  };

  const endGame = () => {
    updatePlayerScore({
      gameId: 'dental-health',
      score,
      timeSpent: 0,
      completed: true,
      attempts: 1
    });
    
    setTimeout(() => {
      setGameStarted(false);
      setGameMode(null);
    }, 2000);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameMode(null);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedSteps([]);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Kesehatan Gigi" emoji="🦷">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🦷</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Belajar Merawat Gigi
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Pilih mini game untuk belajar kesehatan gigi!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <GameButton
              onClick={() => startGame('tools')}
              variant="primary"
              size="lg"
              emoji="🪥"
            >
              <div className="text-center">
                <div className="font-bold">Alat Gigi</div>
                <div className="text-sm opacity-75">Pilih alat yang tepat</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('steps')}
              variant="success"
              size="lg"
              emoji="📋"
            >
              <div className="text-center">
                <div className="font-bold">Langkah Sikat</div>
                <div className="text-sm opacity-75">Urutkan langkah</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('foods')}
              variant="warning"
              size="lg"
              emoji="🍎"
            >
              <div className="text-center">
                <div className="font-bold">Makanan Sehat</div>
                <div className="text-sm opacity-75">Baik vs buruk</div>
              </div>
            </GameButton>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Tips Gigi Sehat:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Sikat gigi 2x sehari</li>
              <li>• Gunakan pasta gigi berfluoride</li>
              <li>• Kurangi makanan manis</li>
              <li>• Periksa ke dokter gigi rutin</li>
            </ul>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (gameMode === 'tools') {
    const tool = dentalHealthData.tools[currentQuestion];
    
    return (
      <GameLayout title="Kesehatan Gigi" emoji="🦷">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <ScoreTracker currentScore={score} showTotal={false} />
            <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
              {currentQuestion + 1} / {dentalHealthData.tools.length}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-3xl text-center">
            <div className="text-8xl mb-6">{tool.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {tool.name}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Apakah ini alat yang baik untuk merawat gigi?
            </p>
            
            <div className="flex gap-4 justify-center">
              <GameButton
                onClick={() => checkToolAnswer(true)}
                variant="success"
                size="lg"
                emoji="✅"
              >
                Ya, Baik
              </GameButton>
              <GameButton
                onClick={() => checkToolAnswer(false)}
                variant="danger"
                size="lg"
                emoji="❌"
              >
                Tidak Baik
              </GameButton>
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

  if (gameMode === 'steps') {
    return (
      <GameLayout title="Kesehatan Gigi" emoji="🦷">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <ScoreTracker currentScore={score} showTotal={false} />
            <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
              {selectedSteps.length} / {dentalHealthData.steps.length}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-3xl text-center">
            <div className="text-6xl mb-4">🪥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Urutkan Langkah Menyikat Gigi
            </h3>
            <p className="text-gray-600 mb-6">
              Klik langkah-langkah sesuai urutan yang benar!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dentalHealthData.steps.map((step, index) => (
              <GameButton
                key={index}
                onClick={() => addStep(step)}
                variant={selectedSteps.includes(step) ? 'success' : 'primary'}
                size="lg"
                disabled={selectedSteps.includes(step)}
                className="h-auto py-4"
              >
                <div className="text-center">
                  {selectedSteps.includes(step) && (
                    <span className="text-2xl mr-2">
                      {selectedSteps.indexOf(step) + 1}
                    </span>
                  )}
                  {step}
                </div>
              </GameButton>
            ))}
          </div>

          {selectedSteps.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-2xl">
              <h4 className="font-semibold text-gray-800 mb-2">Urutan yang dipilih:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSteps.map((step, index) => (
                  <span key={index} className="bg-yellow-200 px-3 py-1 rounded-full text-sm">
                    {index + 1}. {step}
                  </span>
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

  if (gameMode === 'foods') {
    const allFoods = [...dentalHealthData.foods.good, ...dentalHealthData.foods.bad];
    const currentFood = allFoods[currentQuestion % allFoods.length];
    const isGoodFood = dentalHealthData.foods.good.includes(currentFood);
    
    return (
      <GameLayout title="Kesehatan Gigi" emoji="🦷">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <ScoreTracker currentScore={score} showTotal={false} />
            <div className="bg-orange-100 px-3 py-1 rounded-full text-sm font-semibold">
              {currentQuestion + 1} / 8
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-8 rounded-3xl text-center">
            <div className="text-8xl mb-6">{currentFood}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Makanan ini untuk gigi...
            </h3>
            
            <div className="flex gap-4 justify-center">
              <GameButton
                onClick={() => checkFoodAnswer(true, isGoodFood)}
                variant="success"
                size="lg"
                emoji="😊"
              >
                Baik untuk Gigi
              </GameButton>
              <GameButton
                onClick={() => checkFoodAnswer(false, isGoodFood)}
                variant="danger"
                size="lg"
                emoji="😬"
              >
                Buruk untuk Gigi
              </GameButton>
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

  return null;
}