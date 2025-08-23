'use client';

import { useState } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import { updatePlayerScore } from '@/utils/scoreUtils';

interface Transportation {
  id: string;
  name: string;
  emoji: string;
  era: 'old' | 'modern';
  type: 'land' | 'water' | 'air';
  description: string;
  modernEquivalent?: string;
}

const transportations: Transportation[] = [
  // Old Transportation
  { id: 'dokar', name: 'Dokar', emoji: '🐎', era: 'old', type: 'land', description: 'Kereta kuda tradisional', modernEquivalent: 'Mobil' },
  { id: 'becak', name: 'Becak', emoji: '🚲', era: 'old', type: 'land', description: 'Sepeda roda tiga', modernEquivalent: 'Ojek Online' },
  { id: 'perahu', name: 'Perahu Layar', emoji: '⛵', era: 'old', type: 'water', description: 'Kapal tradisional bertenaga angin', modernEquivalent: 'Kapal Motor' },
  { id: 'kereta-uap', name: 'Kereta Uap', emoji: '🚂', era: 'old', type: 'land', description: 'Kereta bertenaga uap', modernEquivalent: 'Kereta Listrik' },
  { id: 'kuda', name: 'Kuda', emoji: '🐎', era: 'old', type: 'land', description: 'Hewan tunggangan', modernEquivalent: 'Motor' },
  { id: 'sampan', name: 'Sampan', emoji: '🚣', era: 'old', type: 'water', description: 'Perahu kecil tradisional', modernEquivalent: 'Speed Boat' },
  
  // Modern Transportation
  { id: 'mobil', name: 'Mobil', emoji: '🚗', era: 'modern', type: 'land', description: 'Kendaraan bermotor roda empat' },
  { id: 'motor', name: 'Motor', emoji: '🏍️', era: 'modern', type: 'land', description: 'Kendaraan bermotor roda dua' },
  { id: 'pesawat', name: 'Pesawat', emoji: '✈️', era: 'modern', type: 'air', description: 'Kendaraan udara' },
  { id: 'kapal-motor', name: 'Kapal Motor', emoji: '🚢', era: 'modern', type: 'water', description: 'Kapal bermesin modern' },
  { id: 'kereta-listrik', name: 'Kereta Listrik', emoji: '🚄', era: 'modern', type: 'land', description: 'Kereta bertenaga listrik' },
  { id: 'bus', name: 'Bus', emoji: '🚌', era: 'modern', type: 'land', description: 'Kendaraan umum besar' }
];

const gameTypes = [
  { id: 'match', name: 'Pasangkan Era', emoji: '🔄', description: 'Cocokkan transportasi dengan eranya' },
  { id: 'evolution', name: 'Evolusi Transportasi', emoji: '🔄', description: 'Pasangkan transportasi lama dengan modern' },
  { id: 'category', name: 'Kategori Transportasi', emoji: '🏷️', description: 'Kelompokkan berdasarkan jenis' }
];

export default function OldTransportation() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameType, setGameType] = useState<'match' | 'evolution' | 'category'>('match');
  const [currentQuestion, setCurrentQuestion] = useState<Transportation | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const startGame = (type: 'match' | 'evolution' | 'category') => {
    setGameStarted(true);
    setGameType(type);
    setScore(0);
    setQuestionCount(0);
    setFeedback('');
    generateQuestion(type);
  };

  const generateQuestion = (type: 'match' | 'evolution' | 'category') => {
    const randomTransport = transportations[Math.floor(Math.random() * transportations.length)];
    setCurrentQuestion(randomTransport);
    setSelectedAnswer('');
    
    let correctAnswer = '';
    let wrongAnswers: string[] = [];
    
    if (type === 'match') {
      correctAnswer = randomTransport.era === 'old' ? 'Tempo Dulu' : 'Modern';
      wrongAnswers = ['Tempo Dulu', 'Modern'].filter(era => era !== correctAnswer);
      wrongAnswers.push('Masa Depan', 'Prasejarah');
    } else if (type === 'evolution') {
      if (randomTransport.era === 'old' && randomTransport.modernEquivalent) {
        correctAnswer = randomTransport.modernEquivalent;
        wrongAnswers = transportations
          .filter(t => t.era === 'modern' && t.name !== correctAnswer)
          .map(t => t.name)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      } else {
        // Find old equivalent
        const oldEquivalent = transportations.find(t => t.modernEquivalent === randomTransport.name);
        if (oldEquivalent) {
          correctAnswer = oldEquivalent.name;
          wrongAnswers = transportations
            .filter(t => t.era === 'old' && t.name !== correctAnswer)
            .map(t => t.name)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        } else {
          generateQuestion(type);
          return;
        }
      }
    } else {
      correctAnswer = randomTransport.type === 'land' ? 'Darat' : 
                    randomTransport.type === 'water' ? 'Air' : 'Udara';
      wrongAnswers = ['Darat', 'Air', 'Udara'].filter(cat => cat !== correctAnswer);
    }
    
    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    
    let correctAnswer = '';
    if (gameType === 'match') {
      correctAnswer = currentQuestion?.era === 'old' ? 'Tempo Dulu' : 'Modern';
    } else if (gameType === 'evolution') {
      if (currentQuestion?.era === 'old') {
        correctAnswer = currentQuestion.modernEquivalent || '';
      } else {
        const oldEquivalent = transportations.find(t => t.modernEquivalent === currentQuestion?.name);
        correctAnswer = oldEquivalent?.name || '';
      }
    } else {
      correctAnswer = currentQuestion?.type === 'land' ? 'Darat' : 
                    currentQuestion?.type === 'water' ? 'Air' : 'Udara';
    }
    
    if (answer === correctAnswer) {
      setScore(prev => prev + 15);
      setFeedback('🎉 Benar! ' + getFactText());
      updatePlayerScore({
        gameId: 'old-transportation',
        score: 15,
        timeSpent: 0,
        completed: questionCount >= 7,
        attempts: 1
      });
    } else {
      setFeedback(`❌ Salah! Jawaban yang benar: ${correctAnswer}`);
    }
    
    setTimeout(() => {
      if (questionCount < 7) {
        setQuestionCount(prev => prev + 1);
        generateQuestion(gameType);
        setFeedback('');
      } else {
        setFeedback(`🏆 Game selesai! Skor akhir: ${score + (answer === correctAnswer ? 15 : 0)}/120`);
      }
    }, 2500);
  };

  const getFactText = () => {
    if (!currentQuestion) return '';
    return currentQuestion.description;
  };

  const getQuestionText = () => {
    if (!currentQuestion) return '';
    
    if (gameType === 'match') {
      return `${currentQuestion.name} termasuk transportasi era apa?`;
    } else if (gameType === 'evolution') {
      if (currentQuestion.era === 'old') {
        return `Apa pengganti modern dari ${currentQuestion.name}?`;
      } else {
        return `Apa transportasi tempo dulu yang setara dengan ${currentQuestion.name}?`;
      }
    } else {
      return `${currentQuestion.name} termasuk transportasi jenis apa?`;
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
      <GameLayout title="Transportasi Tempo Dulu" emoji="🚂">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🚂</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Transportasi Tempo Dulu</h2>
          <p className="text-lg text-gray-600 mb-6">
            Bandingkan transportasi masa lalu dengan sekarang!
          </p>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl max-w-md mx-auto mb-6">
            <div className="text-4xl mb-4">🕰️</div>
            <h3 className="font-bold text-gray-800 mb-2">Pilih Mode Permainan:</h3>
          </div>

          <div className="space-y-4">
            {gameTypes.map(type => (
              <GameButton 
                key={type.id}
                onClick={() => startGame(type.id as any)} 
                variant="primary" 
                size="lg" 
                emoji={type.emoji}
                className="w-full max-w-sm"
              >
                <div className="text-center">
                  <div className="font-bold">{type.name}</div>
                  <div className="text-sm opacity-80">{type.description}</div>
                </div>
              </GameButton>
            ))}
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Transportasi Tempo Dulu" emoji="🚂">
      <div className="space-y-6">
        {/* Progress and Score */}
        <div className="flex justify-between items-center bg-amber-50 p-4 rounded-2xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{score}</div>
            <div className="text-sm text-gray-600">Skor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{questionCount + 1}/8</div>
            <div className="text-sm text-gray-600">Pertanyaan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">
              {gameType === 'match' ? '🔄' : gameType === 'evolution' ? '🔄' : '🏷️'}
            </div>
            <div className="text-sm text-gray-600">
              {gameType === 'match' ? 'Era' : gameType === 'evolution' ? 'Evolusi' : 'Kategori'}
            </div>
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{currentQuestion.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {getQuestionText()}
              </h3>
              <div className="bg-white p-3 rounded-xl inline-block">
                <div className="font-semibold text-gray-700">{currentQuestion.name}</div>
                <div className="text-sm text-gray-500">{currentQuestion.description}</div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((option, index) => {
                let buttonClass = 'bg-white hover:bg-gray-50';
                if (selectedAnswer) {
                  if (option === selectedAnswer) {
                    let isCorrect = false;
                    if (gameType === 'match') {
                      isCorrect = (currentQuestion.era === 'old' && option === 'Tempo Dulu') ||
                                 (currentQuestion.era === 'modern' && option === 'Modern');
                    } else if (gameType === 'evolution') {
                      if (currentQuestion.era === 'old') {
                        isCorrect = option === currentQuestion.modernEquivalent;
                      } else {
                        const oldEquivalent = transportations.find(t => t.modernEquivalent === currentQuestion.name);
                        isCorrect = option === oldEquivalent?.name;
                      }
                    } else {
                      const correctType = currentQuestion.type === 'land' ? 'Darat' : 
                                        currentQuestion.type === 'water' ? 'Air' : 'Udara';
                      isCorrect = option === correctType;
                    }
                    buttonClass = isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
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

        {/* Transportation Timeline */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl">
          <h4 className="font-bold text-center mb-3">🕰️ Evolusi Transportasi</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-100 p-3 rounded-xl text-center">
              <div className="text-2xl mb-2">🐎</div>
              <div className="font-semibold text-amber-800">Tempo Dulu</div>
              <div className="text-xs text-amber-600">Tenaga hewan & angin</div>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl text-center">
              <div className="text-2xl mb-2">🚗</div>
              <div className="font-semibold text-blue-800">Modern</div>
              <div className="text-xs text-blue-600">Mesin & teknologi</div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        {questionCount >= 7 && (
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