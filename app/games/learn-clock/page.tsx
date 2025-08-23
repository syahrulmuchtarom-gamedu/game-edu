'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

interface TimeQuestion {
  hour: number;
  minute: number;
  display: string;
}

export default function LearnClock() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [questions, setQuestions] = useState<TimeQuestion[]>([]);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  const generateQuestions = () => {
    const newQuestions: TimeQuestion[] = [];
    for (let i = 0; i < 10; i++) {
      const hour = Math.floor(Math.random() * 12) + 1;
      const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const display = `${hour}:${minute.toString().padStart(2, '0')}`;
      newQuestions.push({ hour, minute, display });
    }
    setQuestions(newQuestions);
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    generateQuestions();
  };

  const checkAnswer = (selectedTime: string) => {
    const correctTime = questions[currentQuestion].display;
    
    if (selectedTime === correctTime) {
      setScore(prev => prev + 15);
      setFeedback({show: true, type: 'success', message: 'Benar! Waktu tepat! 🕐'});
      
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          endGame(true);
        }
      }, 1500);
    } else {
      setLives(prev => prev - 1);
      setFeedback({show: true, type: 'error', message: `Waktu yang benar: ${correctTime} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        }
      }, 2500);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, questions.length * 15);
    
    updatePlayerScore({
      gameId: 'learn-clock',
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

  const getClockStyle = (hour: number, minute: number) => {
    const hourAngle = (hour % 12) * 30 + (minute / 60) * 30;
    const minuteAngle = minute * 6;
    
    return {
      hourHand: { transform: `rotate(${hourAngle}deg)` },
      minuteHand: { transform: `rotate(${minuteAngle}deg)` }
    };
  };

  const getRandomOptions = () => {
    const correct = questions[currentQuestion].display;
    const options = [correct];
    
    while (options.length < 4) {
      const randomHour = Math.floor(Math.random() * 12) + 1;
      const randomMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const randomTime = `${randomHour}:${randomMinute.toString().padStart(2, '0')}`;
      
      if (!options.includes(randomTime)) {
        options.push(randomTime);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Belajar Jam" emoji="🕐">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🕐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Belajar Membaca Jam
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Belajar membaca waktu pada jam analog!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Lihat jam analog yang ditampilkan</li>
              <li>• Pilih waktu digital yang tepat</li>
              <li>• Perhatikan jarum pendek (jam) dan panjang (menit)</li>
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
      <GameLayout title="Belajar Jam" emoji="🕐">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= questions.length * 12 ? '🏆' : score >= questions.length * 8 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= questions.length * 12 ? 'Master Waktu!' : score >= questions.length * 8 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Waktu dibaca: {currentQuestion + (lives > 0 ? 1 : 0)} dari {questions.length}
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

  const question = questions[currentQuestion];
  const clockStyles = getClockStyle(question.hour, question.minute);
  const options = getRandomOptions();

  return (
    <GameLayout title="Belajar Jam" emoji="🕐">
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
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Clock Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Jam berapa sekarang?
          </h3>
          
          {/* Analog Clock */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 border-8 border-gray-800 rounded-full bg-white">
              {/* Clock Numbers */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
                const angle = index * 30;
                const x = 50 + 35 * Math.sin((angle * Math.PI) / 180);
                const y = 50 - 35 * Math.cos((angle * Math.PI) / 180);
                return (
                  <div
                    key={num}
                    className="absolute text-lg font-bold text-gray-800"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {num}
                  </div>
                );
              })}
              
              {/* Hour Hand */}
              <div
                className="absolute top-1/2 left-1/2 origin-bottom bg-gray-800 rounded-full"
                style={{
                  width: '4px',
                  height: '60px',
                  marginLeft: '-2px',
                  marginTop: '-60px',
                  ...clockStyles.hourHand
                }}
              />
              
              {/* Minute Hand */}
              <div
                className="absolute top-1/2 left-1/2 origin-bottom bg-red-500 rounded-full"
                style={{
                  width: '2px',
                  height: '80px',
                  marginLeft: '-1px',
                  marginTop: '-80px',
                  ...clockStyles.minuteHand
                }}
              />
              
              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {options.map((option, index) => (
            <GameButton
              key={index}
              onClick={() => checkAnswer(option)}
              variant="primary"
              size="lg"
              className="h-16 text-xl font-bold"
            >
              {option}
            </GameButton>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Tips: Jarum pendek menunjukkan jam, jarum panjang menunjukkan menit
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