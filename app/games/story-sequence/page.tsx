'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { storySequences } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

export default function StorySequence() {
  const [currentStory, setCurrentStory] = useState(0);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  const startGame = () => {
    setGameStarted(true);
    setCurrentStory(0);
    setScore(0);
    setUserSequence([]);
    setGameEnded(false);
    setShowResult(false);
  };

  const addToSequence = (sceneIndex: number) => {
    if (userSequence.includes(sceneIndex)) return;
    
    const newSequence = [...userSequence, sceneIndex];
    setUserSequence(newSequence);
    
    if (newSequence.length === storySequences[currentStory].scenes.length) {
      checkSequence(newSequence);
    }
  };

  const checkSequence = (sequence: number[]) => {
    const story = storySequences[currentStory];
    const isCorrect = sequence.every((sceneIndex, position) => {
      return story.scenes[sceneIndex].order === position + 1;
    });
    
    if (isCorrect) {
      setScore(prev => prev + 50);
      setShowResult(true);
      setFeedback({show: true, type: 'success', message: 'Sempurna! Urutan cerita benar! 🎉'});
      
      setTimeout(() => {
        if (currentStory < storySequences.length - 1) {
          setCurrentStory(prev => prev + 1);
          setUserSequence([]);
          setShowResult(false);
        } else {
          endGame(true);
        }
      }, 3000);
    } else {
      setFeedback({show: true, type: 'error', message: 'Urutan belum tepat, coba lagi! 😊'});
      setTimeout(() => {
        setUserSequence([]);
        setShowResult(false);
      }, 2000);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, storySequences.length * 50);
    
    updatePlayerScore({
      gameId: 'story-sequence',
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

  if (!gameStarted) {
    return (
      <GameLayout title="Urutan Kejadian" emoji="🎪">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎪</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Urutan Kejadian
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Susun urutan cerita yang logis dan benar!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Lihat 4 gambar cerita yang acak</li>
              <li>• Klik gambar sesuai urutan yang logis</li>
              <li>• Pikirkan sebab dan akibat</li>
              <li>• Selesaikan semua cerita untuk menang</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cerita yang Tersedia:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              {storySequences.map((story, index) => (
                <li key={index}>• {story.title}</li>
              ))}
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
      <GameLayout title="Urutan Kejadian" emoji="🎪">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= storySequences.length * 40 ? '🏆' : score >= storySequences.length * 25 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= storySequences.length * 40 ? 'Master Cerita!' : score >= storySequences.length * 25 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Cerita diselesaikan: {currentStory + 1} dari {storySequences.length}
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

  const story = storySequences[currentStory];

  return (
    <GameLayout title="Urutan Kejadian" emoji="🎪">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <ScoreTracker currentScore={score} showTotal={false} />
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
              Cerita {currentStory + 1} / {storySequences.length}
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
              {userSequence.length} / {story.scenes.length}
            </div>
          </div>
        </div>

        {/* Story Title */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-3xl text-center">
          <div className="text-4xl mb-3">📖</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {story.title}
          </h3>
          <p className="text-gray-600">
            Klik gambar sesuai urutan kejadian yang benar!
          </p>
        </div>

        {/* Story Scenes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {story.scenes.map((scene, index) => (
            <GameButton
              key={index}
              onClick={() => addToSequence(index)}
              variant={userSequence.includes(index) ? 'success' : 'primary'}
              size="lg"
              disabled={userSequence.includes(index) || showResult}
              className="h-32 flex-col p-4"
            >
              <div className="text-4xl mb-2">{scene.image}</div>
              <div className="text-xs text-center leading-tight">{scene.text}</div>
              {userSequence.includes(index) && (
                <div className="text-lg font-bold mt-2 bg-white bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center">
                  {userSequence.indexOf(index) + 1}
                </div>
              )}
            </GameButton>
          ))}
        </div>

        {/* Current Sequence Display */}
        {userSequence.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-2xl">
            <h4 className="font-semibold text-gray-800 mb-3 text-center">Urutan yang dipilih:</h4>
            <div className="flex justify-center gap-3 flex-wrap">
              {userSequence.map((sceneIndex, order) => (
                <div key={order} className="bg-yellow-200 p-3 rounded-xl text-center min-w-[80px]">
                  <div className="text-3xl mb-1">{story.scenes[sceneIndex].image}</div>
                  <div className="text-xs font-semibold">{order + 1}</div>
                  <div className="text-xs text-gray-600 mt-1">{story.scenes[sceneIndex].text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result Display */}
        {showResult && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-3xl">
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Cerita Lengkap!</h4>
              <div className="flex justify-center gap-2 mb-4">
                {story.scenes.sort((a, b) => a.order - b.order).map((scene, index) => (
                  <div key={index} className="flex items-center">
                    <div className="text-2xl">{scene.image}</div>
                    {index < story.scenes.length - 1 && (
                      <span className="mx-2 text-gray-400">→</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-gray-700">
                <strong>Pembelajaran:</strong> Setiap kejadian memiliki urutan sebab-akibat yang logis. 
                Memahami urutan ini membantu kita berpikir sistematis!
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-gray-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Tips: Pikirkan "Apa yang terjadi pertama kali?" dan "Apa akibat dari kejadian sebelumnya?"
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