'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { emotions } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

export default function EmotionGuess() {
  const [currentEmotion, setCurrentEmotion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showSituation, setShowSituation] = useState(false);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});
  const [shuffledEmotions, setShuffledEmotions] = useState(emotions);

  useEffect(() => {
    const shuffled = [...emotions].sort(() => Math.random() - 0.5);
    setShuffledEmotions(shuffled);
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentEmotion(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    setShowSituation(false);
    const shuffled = [...emotions].sort(() => Math.random() - 0.5);
    setShuffledEmotions(shuffled);
  };

  const checkAnswer = (selectedEmotion: string) => {
    const correctEmotion = shuffledEmotions[currentEmotion].name;
    
    if (selectedEmotion === correctEmotion) {
      setScore(prev => prev + 20);
      setShowSituation(true);
      setFeedback({show: true, type: 'success', message: 'Benar! Hebat! 😊'});
      
      setTimeout(() => {
        if (currentEmotion < shuffledEmotions.length - 1) {
          setCurrentEmotion(prev => prev + 1);
          setShowSituation(false);
        } else {
          endGame(true);
        }
      }, 3000);
    } else {
      setLives(prev => prev - 1);
      setFeedback({show: true, type: 'error', message: `Jawaban yang benar: ${correctEmotion} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        } else {
          setShowSituation(false);
        }
      }, 2500);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, shuffledEmotions.length * 20);
    
    updatePlayerScore({
      gameId: 'emotion-guess',
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
    const correct = shuffledEmotions[currentEmotion].name;
    const allEmotions = emotions.map(e => e.name);
    const wrongOptions = allEmotions.filter(e => e !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Tebak Emosi" emoji="🎭">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tebak Emosi & Perasaan
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Kenali berbagai ekspresi emosi dan perasaan!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Lihat ekspresi emoji yang ditampilkan</li>
              <li>• Pilih nama emosi yang tepat</li>
              <li>• Pelajari situasi yang memicu emosi</li>
              <li>• Kamu punya 3 nyawa ❤️</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Mengapa Penting?</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Memahami perasaan diri sendiri</li>
              <li>• Berempati dengan orang lain</li>
              <li>• Komunikasi yang lebih baik</li>
              <li>• Mengelola emosi dengan sehat</li>
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
      <GameLayout title="Tebak Emosi" emoji="🎭">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= shuffledEmotions.length * 15 ? '🏆' : score >= shuffledEmotions.length * 10 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= shuffledEmotions.length * 15 ? 'Ahli Emosi!' : score >= shuffledEmotions.length * 10 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Emosi dikenali: {currentEmotion + (lives > 0 ? 1 : 0)} dari {shuffledEmotions.length}
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

  const emotion = shuffledEmotions[currentEmotion];
  const options = getRandomOptions();

  return (
    <GameLayout title="Tebak Emosi" emoji="🎭">
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
              {currentEmotion + 1} / {shuffledEmotions.length}
            </div>
          </div>
        </div>

        {/* Emotion Display */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-3xl text-center">
          <div className="text-8xl mb-6">
            {emotion.emoji}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Apa nama emosi ini?
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
              disabled={showSituation}
            >
              {option}
            </GameButton>
          ))}
        </div>

        {/* Situation Display */}
        {showSituation && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-3xl">
            <div className="text-center">
              <div className="text-4xl mb-3">💭</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Contoh Situasi:</h4>
              <p className="text-gray-700 mb-4">"{emotion.situation}"</p>
              <div className="bg-white p-4 rounded-2xl">
                <p className="text-sm text-gray-600">
                  <strong>Tips:</strong> Saat merasa {emotion.name.toLowerCase()}, 
                  {emotion.name === 'Senang' ? ' bagikan kebahagiaan dengan orang lain!' :
                   emotion.name === 'Sedih' ? ' tidak apa-apa untuk menangis dan minta bantuan.' :
                   emotion.name === 'Marah' ? ' tarik napas dalam dan hitung sampai 10.' :
                   emotion.name === 'Takut' ? ' ceritakan pada orang dewasa yang dipercaya.' :
                   emotion.name === 'Terkejut' ? ' ambil waktu sejenak untuk memahami situasi.' :
                   ' tanyakan pada guru atau orang tua untuk penjelasan.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Emotion Learning */}
        <div className="bg-yellow-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Semua emosi itu normal dan wajar dirasakan. Yang penting adalah bagaimana kita mengekspresikannya dengan baik!
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