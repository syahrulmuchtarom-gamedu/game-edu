'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const holidays = [
  { date: '01-01', name: 'Tahun Baru', emoji: '🎊' },
  { date: '08-17', name: 'Hari Kemerdekaan', emoji: '🇮🇩' },
  { date: '12-25', name: 'Hari Natal', emoji: '🎄' },
  { date: '05-01', name: 'Hari Buruh', emoji: '👷' },
  { date: '04-21', name: 'Hari Kartini', emoji: '👩' },
];

type GameMode = 'day-date' | 'month-year' | 'holidays' | 'calendar';

export default function CalendarDate() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [questions, setQuestions] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  const generateQuestions = (mode: GameMode) => {
    const newQuestions = [];
    
    for (let i = 0; i < 8; i++) {
      const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      
      switch (mode) {
        case 'day-date':
          newQuestions.push({
            type: 'day-name',
            date: randomDate,
            question: `Hari apa tanggal ${randomDate.getDate()} ${months[randomDate.getMonth()]} ${randomDate.getFullYear()}?`,
            answer: days[randomDate.getDay()]
          });
          break;
          
        case 'month-year':
          newQuestions.push({
            type: 'month-name',
            date: randomDate,
            question: `Bulan ke berapa "${months[randomDate.getMonth()]}"?`,
            answer: (randomDate.getMonth() + 1).toString()
          });
          break;
          
        case 'holidays':
          const holiday = holidays[Math.floor(Math.random() * holidays.length)];
          newQuestions.push({
            type: 'holiday',
            holiday: holiday,
            question: `Kapan ${holiday.name} dirayakan?`,
            answer: holiday.date
          });
          break;
          
        case 'calendar':
          const today = new Date();
          const daysDiff = Math.floor((randomDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          newQuestions.push({
            type: 'date-diff',
            date: randomDate,
            question: `Berapa hari dari hari ini ke tanggal ${randomDate.getDate()} ${months[randomDate.getMonth()]}?`,
            answer: Math.abs(daysDiff).toString()
          });
          break;
      }
    }
    
    setQuestions(newQuestions);
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    generateQuestions(mode);
  };

  const checkAnswer = (selectedAnswer: string) => {
    const question = questions[currentQuestion];
    const correctAnswer = question.answer;
    
    if (selectedAnswer === correctAnswer) {
      setScore(prev => prev + 15);
      setFeedback({show: true, type: 'success', message: 'Benar! Hebat! 📅'});
      
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
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
    const finalScore = calculateScore(score, questions.length * 15);
    
    updatePlayerScore({
      gameId: 'calendar-date',
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

  const getRandomOptions = (correct: string, type: string) => {
    let allOptions: string[] = [];
    
    switch (type) {
      case 'day-name':
        allOptions = days;
        break;
      case 'month-name':
        allOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        break;
      case 'holiday':
        allOptions = ['01-01', '08-17', '12-25', '05-01', '04-21'];
        break;
      case 'date-diff':
        allOptions = ['1', '5', '10', '15', '20', '25', '30'];
        break;
    }
    
    const wrongOptions = allOptions.filter(option => option !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Hari & Tanggal" emoji="🗓️">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🗓️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Hari & Tanggal
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Belajar konsep waktu, kalender, dan hari libur!
          </p>
          
          {/* Current Date Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl max-w-md mx-auto mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Hari Ini:</h3>
            <div className="text-2xl font-bold text-blue-600">
              {days[currentDate.getDay()]}, {currentDate.getDate()} {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <GameButton
              onClick={() => startGame('day-date')}
              variant="primary"
              size="lg"
              emoji="📅"
            >
              <div className="text-center">
                <div className="font-bold">Hari & Tanggal</div>
                <div className="text-sm opacity-75">Tebak hari dari tanggal</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('month-year')}
              variant="success"
              size="lg"
              emoji="📆"
            >
              <div className="text-center">
                <div className="font-bold">Bulan & Tahun</div>
                <div className="text-sm opacity-75">Urutan bulan</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('holidays')}
              variant="warning"
              size="lg"
              emoji="🎉"
            >
              <div className="text-center">
                <div className="font-bold">Hari Libur</div>
                <div className="text-sm opacity-75">Hari penting Indonesia</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('calendar')}
              variant="danger"
              size="lg"
              emoji="🗓️"
            >
              <div className="text-center">
                <div className="font-bold">Hitung Hari</div>
                <div className="text-sm opacity-75">Selisih tanggal</div>
              </div>
            </GameButton>
          </div>

          <div className="bg-yellow-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Hari Libur Indonesia:</h3>
            <div className="space-y-1">
              {holidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{holiday.emoji} {holiday.name}</span>
                  <span className="text-gray-600">{holiday.date}</span>
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
      <GameLayout title="Hari & Tanggal" emoji="🗓️">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= questions.length * 12 ? '🏆' : score >= questions.length * 8 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= questions.length * 12 ? 'Master Kalender!' : score >= questions.length * 8 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Mode: {gameMode === 'day-date' ? 'Hari & Tanggal' : 
                     gameMode === 'month-year' ? 'Bulan & Tahun' :
                     gameMode === 'holidays' ? 'Hari Libur' : 'Hitung Hari'}
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
  const options = getRandomOptions(question.answer, question.type);

  return (
    <GameLayout title="Hari & Tanggal" emoji="🗓️">
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

        {/* Question Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl text-center">
          <div className="text-6xl mb-6">
            {question.type === 'holiday' ? question.holiday.emoji : '📅'}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {question.question}
          </h3>
          
          {question.type === 'day-name' && (
            <div className="bg-white p-4 rounded-2xl mb-4">
              <div className="text-lg text-gray-600">
                📅 {question.date.getDate()} {months[question.date.getMonth()]} {question.date.getFullYear()}
              </div>
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className={`grid gap-4 ${question.type === 'date-diff' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {options.map((option, index) => (
            <GameButton
              key={index}
              onClick={() => checkAnswer(option)}
              variant="primary"
              size="lg"
              className="h-16"
            >
              {question.type === 'month-name' ? `Bulan ke-${option}` :
               question.type === 'holiday' ? option :
               question.type === 'date-diff' ? `${option} hari` :
               option}
            </GameButton>
          ))}
        </div>

        {/* Helper Info */}
        <div className="bg-yellow-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Tips: {
              gameMode === 'day-date' ? 'Ingat urutan hari: Minggu, Senin, Selasa...' :
              gameMode === 'month-year' ? 'Januari = 1, Februari = 2, dst.' :
              gameMode === 'holidays' ? 'Hafalkan tanggal hari libur nasional' :
              'Hitung selisih hari dari hari ini'
            }
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