'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { sportsData } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

type GameMode = 'equipment' | 'benefits' | 'quiz';

const additionalSports = [
  { name: 'Basket', emoji: '🏀', equipment: '🏀', benefit: 'Melatih koordinasi dan tinggi badan' },
  { name: 'Voli', emoji: '🏐', equipment: '🏐', benefit: 'Melatih kerjasama tim dan lompatan' },
  { name: 'Tenis', emoji: '🎾', equipment: '🎾', benefit: 'Melatih refleks dan konsentrasi' },
  { name: 'Yoga', emoji: '🧘', equipment: '🧘‍♀️', benefit: 'Melatih kelenturan dan ketenangan' },
];

const allSports = [...sportsData, ...additionalSports];

export default function SportsHealth() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [shuffledSports, setShuffledSports] = useState(allSports);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  useEffect(() => {
    const shuffled = [...allSports].sort(() => Math.random() - 0.5);
    setShuffledSports(shuffled);
  }, [gameMode]);

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    const shuffled = [...allSports].sort(() => Math.random() - 0.5);
    setShuffledSports(shuffled);
  };

  const checkAnswer = (selectedAnswer: string, correctAnswer: string) => {
    if (selectedAnswer === correctAnswer) {
      setScore(prev => prev + 15);
      setFeedback({show: true, type: 'success', message: 'Benar! Hebat! 🏆'});
      
      setTimeout(() => {
        if (currentQuestion < shuffledSports.length - 1) {
          setCurrentQuestion(prev => prev + 1);
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
    const finalScore = calculateScore(score, shuffledSports.length * 15);
    
    updatePlayerScore({
      gameId: 'sports-health',
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

  const getRandomOptions = (correct: string, type: 'equipment' | 'benefit') => {
    const allOptions = allSports.map(sport => type === 'equipment' ? sport.equipment : sport.benefit);
    const wrongOptions = allOptions.filter(option => option !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Olahraga & Kesehatan" emoji="🏃♂️">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🏃♂️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Olahraga & Kesehatan
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Pelajari berbagai olahraga dan manfaatnya untuk kesehatan!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <GameButton
              onClick={() => startGame('equipment')}
              variant="primary"
              size="lg"
              emoji="🏀"
            >
              <div className="text-center">
                <div className="font-bold">Peralatan</div>
                <div className="text-sm opacity-75">Cocokkan olahraga dengan alat</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('benefits')}
              variant="success"
              size="lg"
              emoji="💪"
            >
              <div className="text-center">
                <div className="font-bold">Manfaat</div>
                <div className="text-sm opacity-75">Pelajari manfaat olahraga</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('quiz')}
              variant="warning"
              size="lg"
              emoji="🧠"
            >
              <div className="text-center">
                <div className="font-bold">Kuis Umum</div>
                <div className="text-sm opacity-75">Pertanyaan campuran</div>
              </div>
            </GameButton>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Mengapa Olahraga Penting?</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Membuat tubuh sehat dan kuat</li>
              <li>• Melatih kerjasama tim</li>
              <li>• Meningkatkan konsentrasi</li>
              <li>• Membuat perasaan senang</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Olahraga yang Dipelajari:</h3>
            <div className="grid grid-cols-4 gap-2">
              {allSports.slice(0, 8).map((sport, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl">{sport.emoji}</div>
                  <div className="text-xs">{sport.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (gameEnded) {
    return (
      <GameLayout title="Olahraga & Kesehatan" emoji="🏃♂️">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= shuffledSports.length * 12 ? '🏆' : score >= shuffledSports.length * 8 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= shuffledSports.length * 12 ? 'Atlet Hebat!' : score >= shuffledSports.length * 8 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Mode: {gameMode === 'equipment' ? 'Peralatan' : gameMode === 'benefits' ? 'Manfaat' : 'Kuis Umum'}
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

  const sport = shuffledSports[currentQuestion];

  if (gameMode === 'equipment') {
    const options = getRandomOptions(sport.equipment, 'equipment');
    
    return (
      <GameLayout title="Olahraga & Kesehatan" emoji="🏃♂️">
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
                {currentQuestion + 1} / {shuffledSports.length}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-3xl text-center">
            <div className="text-8xl mb-6">{sport.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {sport.name}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Apa peralatan yang digunakan untuk olahraga ini?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {options.map((option, index) => (
              <GameButton
                key={index}
                onClick={() => checkAnswer(option, sport.equipment)}
                variant="primary"
                size="lg"
                className="h-20 text-3xl"
              >
                {option}
              </GameButton>
            ))}
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

  if (gameMode === 'benefits') {
    const options = getRandomOptions(sport.benefit, 'benefit');
    
    return (
      <GameLayout title="Olahraga & Kesehatan" emoji="🏃♂️">
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
                {currentQuestion + 1} / {shuffledSports.length}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-3xl text-center">
            <div className="text-8xl mb-6">{sport.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {sport.name}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Apa manfaat dari olahraga ini?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <GameButton
                key={index}
                onClick={() => checkAnswer(option, sport.benefit)}
                variant="success"
                size="lg"
                className="h-auto py-4 text-left"
              >
                <div className="text-sm leading-relaxed">{option}</div>
              </GameButton>
            ))}
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

  // Quiz mode - random questions
  const questionType = Math.random() > 0.5 ? 'equipment' : 'benefit';
  const options = questionType === 'equipment' 
    ? getRandomOptions(sport.equipment, 'equipment')
    : getRandomOptions(sport.benefit, 'benefit');
  const correctAnswer = questionType === 'equipment' ? sport.equipment : sport.benefit;

  return (
    <GameLayout title="Olahraga & Kesehatan" emoji="🏃♂️">
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
            <div className="bg-orange-100 px-3 py-1 rounded-full text-sm font-semibold">
              {currentQuestion + 1} / {shuffledSports.length}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-8 rounded-3xl text-center">
          <div className="text-8xl mb-6">{sport.emoji}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {sport.name}
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            {questionType === 'equipment' 
              ? 'Apa peralatan yang digunakan?' 
              : 'Apa manfaat dari olahraga ini?'
            }
          </p>
        </div>

        <div className={`grid gap-4 ${questionType === 'equipment' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {options.map((option, index) => (
            <GameButton
              key={index}
              onClick={() => checkAnswer(option, correctAnswer)}
              variant="warning"
              size="lg"
              className={questionType === 'equipment' ? 'h-20 text-3xl' : 'h-auto py-4 text-left'}
            >
              {questionType === 'equipment' ? (
                option
              ) : (
                <div className="text-sm leading-relaxed">{option}</div>
              )}
            </GameButton>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Mode Kuis: Pertanyaan tentang peralatan dan manfaat olahraga
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