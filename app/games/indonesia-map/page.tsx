'use client';

import { useState } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import { updatePlayerScore } from '@/utils/scoreUtils';

interface Province {
  id: string;
  name: string;
  capital: string;
  island: string;
  emoji: string;
  landmark: string;
}

const provinces: Province[] = [
  { id: 'jakarta', name: 'DKI Jakarta', capital: 'Jakarta', island: 'Jawa', emoji: '🏙️', landmark: 'Monas' },
  { id: 'jabar', name: 'Jawa Barat', capital: 'Bandung', island: 'Jawa', emoji: '🏔️', landmark: 'Tangkuban Perahu' },
  { id: 'jateng', name: 'Jawa Tengah', capital: 'Semarang', island: 'Jawa', emoji: '🏛️', landmark: 'Candi Borobudur' },
  { id: 'jatim', name: 'Jawa Timur', capital: 'Surabaya', island: 'Jawa', emoji: '🌋', landmark: 'Gunung Bromo' },
  { id: 'bali', name: 'Bali', capital: 'Denpasar', island: 'Bali', emoji: '🏖️', landmark: 'Pura Tanah Lot' },
  { id: 'sumut', name: 'Sumatera Utara', capital: 'Medan', island: 'Sumatera', emoji: '🦍', landmark: 'Danau Toba' },
  { id: 'sumbar', name: 'Sumatera Barat', capital: 'Padang', island: 'Sumatera', emoji: '🏠', landmark: 'Rumah Gadang' },
  { id: 'kalbar', name: 'Kalimantan Barat', capital: 'Pontianak', island: 'Kalimantan', emoji: '🐒', landmark: 'Taman Nasional Gunung Palung' },
  { id: 'sulsel', name: 'Sulawesi Selatan', capital: 'Makassar', island: 'Sulawesi', emoji: '⛵', landmark: 'Tana Toraja' },
  { id: 'papua', name: 'Papua', capital: 'Jayapura', island: 'Papua', emoji: '🏔️', landmark: 'Puncak Jaya' }
];

const islands = ['Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali', 'Papua'];

export default function IndonesiaMap() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<'province' | 'capital' | 'island'>('province');
  const [currentQuestion, setCurrentQuestion] = useState<Province | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const startGame = (mode: 'province' | 'capital' | 'island') => {
    setGameStarted(true);
    setGameMode(mode);
    setScore(0);
    setQuestionCount(0);
    setFeedback('');
    generateQuestion(mode);
  };

  const generateQuestion = (mode: 'province' | 'capital' | 'island') => {
    const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
    setCurrentQuestion(randomProvince);
    setSelectedAnswer('');
    
    let correctAnswer = '';
    let wrongAnswers: string[] = [];
    
    if (mode === 'province') {
      correctAnswer = randomProvince.name;
      wrongAnswers = provinces
        .filter(p => p.id !== randomProvince.id)
        .map(p => p.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    } else if (mode === 'capital') {
      correctAnswer = randomProvince.capital;
      wrongAnswers = provinces
        .filter(p => p.id !== randomProvince.id)
        .map(p => p.capital)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    } else {
      correctAnswer = randomProvince.island;
      wrongAnswers = islands
        .filter(i => i !== randomProvince.island)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    }
    
    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    
    let correctAnswer = '';
    if (gameMode === 'province') correctAnswer = currentQuestion?.name || '';
    else if (gameMode === 'capital') correctAnswer = currentQuestion?.capital || '';
    else correctAnswer = currentQuestion?.island || '';
    
    if (answer === correctAnswer) {
      setScore(prev => prev + 10);
      setFeedback('🎉 Benar! ' + getFactText());
      updatePlayerScore({
        gameId: 'indonesia-map',
        score: 10,
        timeSpent: 0,
        completed: questionCount >= 9,
        attempts: 1
      });
    } else {
      setFeedback(`❌ Salah! Jawaban yang benar: ${correctAnswer}`);
    }
    
    setTimeout(() => {
      if (questionCount < 9) {
        setQuestionCount(prev => prev + 1);
        generateQuestion(gameMode);
        setFeedback('');
      } else {
        setFeedback(`🏆 Game selesai! Skor akhir: ${score + (answer === correctAnswer ? 10 : 0)}/100`);
      }
    }, 2000);
  };

  const getFactText = () => {
    if (!currentQuestion) return '';
    return `${currentQuestion.landmark} adalah landmark terkenal di ${currentQuestion.name}.`;
  };

  const getQuestionText = () => {
    if (!currentQuestion) return '';
    
    if (gameMode === 'province') {
      return `Provinsi mana yang memiliki landmark ${currentQuestion.landmark}?`;
    } else if (gameMode === 'capital') {
      return `Apa ibu kota dari ${currentQuestion.name}?`;
    } else {
      return `${currentQuestion.name} terletak di pulau mana?`;
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(null);
    setScore(0);
    setQuestionCount(0);
    setFeedback('');
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Peta Indonesia" emoji="🏔️">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🇮🇩</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Jelajahi Indonesia</h2>
          <p className="text-lg text-gray-600 mb-6">
            Kenali provinsi, ibu kota, dan pulau-pulau di Indonesia!
          </p>
          
          <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-2xl max-w-md mx-auto mb-6">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="font-bold text-gray-800 mb-2">Pilih Mode Permainan:</h3>
          </div>

          <div className="space-y-4">
            <GameButton 
              onClick={() => startGame('province')} 
              variant="primary" 
              size="lg" 
              emoji="🏛️"
              className="w-full max-w-sm"
            >
              <div className="text-center">
                <div className="font-bold">Tebak Provinsi</div>
                <div className="text-sm opacity-80">Dari landmark terkenal</div>
              </div>
            </GameButton>
            
            <GameButton 
              onClick={() => startGame('capital')} 
              variant="primary" 
              size="lg" 
              emoji="🏙️"
              className="w-full max-w-sm"
            >
              <div className="text-center">
                <div className="font-bold">Tebak Ibu Kota</div>
                <div className="text-sm opacity-80">Dari nama provinsi</div>
              </div>
            </GameButton>
            
            <GameButton 
              onClick={() => startGame('island')} 
              variant="primary" 
              size="lg" 
              emoji="🏝️"
              className="w-full max-w-sm"
            >
              <div className="text-center">
                <div className="font-bold">Tebak Pulau</div>
                <div className="text-sm opacity-80">Lokasi provinsi</div>
              </div>
            </GameButton>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Peta Indonesia" emoji="🏔️">
      <div className="space-y-6">
        {/* Progress and Score */}
        <div className="flex justify-between items-center bg-red-50 p-4 rounded-2xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{score}</div>
            <div className="text-sm text-gray-600">Skor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{questionCount + 1}/10</div>
            <div className="text-sm text-gray-600">Pertanyaan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">
              {gameMode === 'province' ? '🏛️' : gameMode === 'capital' ? '🏙️' : '🏝️'}
            </div>
            <div className="text-sm text-gray-600">
              {gameMode === 'province' ? 'Provinsi' : gameMode === 'capital' ? 'Ibu Kota' : 'Pulau'}
            </div>
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">{currentQuestion.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {getQuestionText()}
              </h3>
              {gameMode === 'province' && (
                <div className="bg-white p-3 rounded-xl inline-block">
                  <div className="text-2xl mb-1">📍</div>
                  <div className="font-semibold text-gray-700">{currentQuestion.landmark}</div>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((option, index) => {
                let buttonClass = 'bg-white hover:bg-gray-50';
                if (selectedAnswer) {
                  if (option === selectedAnswer) {
                    const isCorrect = 
                      (gameMode === 'province' && option === currentQuestion.name) ||
                      (gameMode === 'capital' && option === currentQuestion.capital) ||
                      (gameMode === 'island' && option === currentQuestion.island);
                    buttonClass = isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
                  } else {
                    const isCorrect = 
                      (gameMode === 'province' && option === currentQuestion.name) ||
                      (gameMode === 'capital' && option === currentQuestion.capital) ||
                      (gameMode === 'island' && option === currentQuestion.island);
                    if (isCorrect) buttonClass = 'bg-green-100 border-green-500';
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={`p-4 rounded-xl border-2 border-transparent font-semibold transition-all transform hover:scale-105 disabled:transform-none ${buttonClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-2xl text-center font-semibold ${
            feedback.includes('Benar') ? 'bg-green-100 text-green-800' : 
            feedback.includes('selesai') ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {feedback}
          </div>
        )}

        {/* Indonesia Facts */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl">
          <h4 className="font-bold text-center mb-3">🇮🇩 Fakta Indonesia</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">🏝️</div>
              <div className="font-semibold">17.508 Pulau</div>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">🏛️</div>
              <div className="font-semibold">34 Provinsi</div>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">👥</div>
              <div className="font-semibold">270+ Juta Penduduk</div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        {questionCount >= 9 && (
          <div className="text-center">
            <GameButton onClick={resetGame} variant="secondary" size="lg" emoji="🔄">
              Main Lagi
            </GameButton>
          </div>
        )}
      </div>
    </GameLayout>
  );
}