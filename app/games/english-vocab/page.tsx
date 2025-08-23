'use client';

import { useState } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import { updatePlayerScore } from '@/utils/scoreUtils';

interface VocabWord {
  id: string;
  indonesian: string;
  english: string;
  emoji: string;
  category: string;
  pronunciation: string;
}

const vocabularyWords: VocabWord[] = [
  // Animals
  { id: 'cat', indonesian: 'Kucing', english: 'Cat', emoji: '🐱', category: 'Animals', pronunciation: '/kæt/' },
  { id: 'dog', indonesian: 'Anjing', english: 'Dog', emoji: '🐶', category: 'Animals', pronunciation: '/dɔːɡ/' },
  { id: 'bird', indonesian: 'Burung', english: 'Bird', emoji: '🐦', category: 'Animals', pronunciation: '/bɜːrd/' },
  { id: 'fish', indonesian: 'Ikan', english: 'Fish', emoji: '🐟', category: 'Animals', pronunciation: '/fɪʃ/' },
  { id: 'rabbit', indonesian: 'Kelinci', english: 'Rabbit', emoji: '🐰', category: 'Animals', pronunciation: '/ˈræbɪt/' },
  
  // Food
  { id: 'apple', indonesian: 'Apel', english: 'Apple', emoji: '🍎', category: 'Food', pronunciation: '/ˈæpəl/' },
  { id: 'banana', indonesian: 'Pisang', english: 'Banana', emoji: '🍌', category: 'Food', pronunciation: '/bəˈnænə/' },
  { id: 'orange', indonesian: 'Jeruk', english: 'Orange', emoji: '🍊', category: 'Food', pronunciation: '/ˈɔːrɪndʒ/' },
  { id: 'bread', indonesian: 'Roti', english: 'Bread', emoji: '🍞', category: 'Food', pronunciation: '/bred/' },
  { id: 'milk', indonesian: 'Susu', english: 'Milk', emoji: '🥛', category: 'Food', pronunciation: '/mɪlk/' },
  
  // Colors
  { id: 'red', indonesian: 'Merah', english: 'Red', emoji: '🔴', category: 'Colors', pronunciation: '/red/' },
  { id: 'blue', indonesian: 'Biru', english: 'Blue', emoji: '🔵', category: 'Colors', pronunciation: '/bluː/' },
  { id: 'green', indonesian: 'Hijau', english: 'Green', emoji: '🟢', category: 'Colors', pronunciation: '/ɡriːn/' },
  { id: 'yellow', indonesian: 'Kuning', english: 'Yellow', emoji: '🟡', category: 'Colors', pronunciation: '/ˈjeloʊ/' },
  { id: 'black', indonesian: 'Hitam', english: 'Black', emoji: '⚫', category: 'Colors', pronunciation: '/blæk/' },
  
  // Family
  { id: 'mother', indonesian: 'Ibu', english: 'Mother', emoji: '👩', category: 'Family', pronunciation: '/ˈmʌðər/' },
  { id: 'father', indonesian: 'Ayah', english: 'Father', emoji: '👨', category: 'Family', pronunciation: '/ˈfɑːðər/' },
  { id: 'sister', indonesian: 'Saudara Perempuan', english: 'Sister', emoji: '👧', category: 'Family', pronunciation: '/ˈsɪstər/' },
  { id: 'brother', indonesian: 'Saudara Laki-laki', english: 'Brother', emoji: '👦', category: 'Family', pronunciation: '/ˈbrʌðər/' },
  
  // Objects
  { id: 'book', indonesian: 'Buku', english: 'Book', emoji: '📚', category: 'Objects', pronunciation: '/bʊk/' },
  { id: 'car', indonesian: 'Mobil', english: 'Car', emoji: '🚗', category: 'Objects', pronunciation: '/kɑːr/' },
  { id: 'house', indonesian: 'Rumah', english: 'House', emoji: '🏠', category: 'Objects', pronunciation: '/haʊs/' },
  { id: 'ball', indonesian: 'Bola', english: 'Ball', emoji: '⚽', category: 'Objects', pronunciation: '/bɔːl/' },
  { id: 'pen', indonesian: 'Pulpen', english: 'Pen', emoji: '🖊️', category: 'Objects', pronunciation: '/pen/' }
];

const categories = ['All', 'Animals', 'Food', 'Colors', 'Family', 'Objects'];

const gameTypes = [
  { id: 'translate', name: 'Terjemahkan', emoji: '🔄', description: 'Terjemahkan dari Indonesia ke Inggris' },
  { id: 'match', name: 'Cocokkan', emoji: '🎯', description: 'Cocokkan kata dengan gambar' },
  { id: 'spell', name: 'Eja Kata', emoji: '⌨️', description: 'Eja kata bahasa Inggris' }
];

export default function EnglishVocab() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameType, setGameType] = useState<'translate' | 'match' | 'spell'>('translate');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentWord, setCurrentWord] = useState<VocabWord | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showPronunciation, setShowPronunciation] = useState(false);

  const startGame = (type: 'translate' | 'match' | 'spell', category: string) => {
    setGameStarted(true);
    setGameType(type);
    setSelectedCategory(category);
    setScore(0);
    setQuestionCount(0);
    setFeedback('');
    generateQuestion(type, category);
  };

  const getFilteredWords = (category: string) => {
    return category === 'All' ? vocabularyWords : vocabularyWords.filter(w => w.category === category);
  };

  const generateQuestion = (type: 'translate' | 'match' | 'spell', category: string) => {
    const filteredWords = getFilteredWords(category);
    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setCurrentWord(randomWord);
    setSelectedAnswer('');
    setUserInput('');
    setShowPronunciation(false);
    
    if (type === 'translate' || type === 'match') {
      const correctAnswer = randomWord.english;
      const wrongAnswers = filteredWords
        .filter(w => w.id !== randomWord.id)
        .map(w => w.english)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    }
  };

  const handleAnswer = (answer: string) => {
    if (!currentWord) return;
    
    setSelectedAnswer(answer);
    
    if (answer.toLowerCase() === currentWord.english.toLowerCase()) {
      const points = 10;
      setScore(prev => prev + points);
      setFeedback(`🎉 Benar! "${currentWord.indonesian}" = "${currentWord.english}"`);
      setShowPronunciation(true);
      updatePlayerScore({
        gameId: 'english-vocab',
        score: points,
        timeSpent: 0,
        completed: questionCount >= 9,
        attempts: 1
      });
    } else {
      setFeedback(`❌ Salah! "${currentWord.indonesian}" = "${currentWord.english}"`);
      setShowPronunciation(true);
    }
    
    setTimeout(() => {
      if (questionCount < 9) {
        setQuestionCount(prev => prev + 1);
        generateQuestion(gameType, selectedCategory);
        setFeedback('');
      } else {
        const finalScore = score + (answer.toLowerCase() === currentWord.english.toLowerCase() ? 10 : 0);
        setFeedback(`🏆 Game selesai! Skor akhir: ${finalScore}/100`);
      }
    }, 3000);
  };

  const handleSpellSubmit = () => {
    if (!currentWord) return;
    handleAnswer(userInput);
  };

  const getQuestionText = () => {
    if (!currentWord) return '';
    
    if (gameType === 'translate') {
      return `Bagaimana bahasa Inggris dari "${currentWord.indonesian}"?`;
    } else if (gameType === 'match') {
      return `Kata bahasa Inggris apa yang cocok dengan gambar ini?`;
    } else {
      return `Eja kata bahasa Inggris dari "${currentWord.indonesian}":`;
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentWord(null);
    setScore(0);
    setQuestionCount(0);
    setFeedback('');
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Kosakata Inggris" emoji="🇬🇧">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🇬🇧</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Kosakata Bahasa Inggris</h2>
          <p className="text-lg text-gray-600 mb-6">
            Belajar kosakata bahasa Inggris dengan cara yang menyenangkan!
          </p>
          
          {/* Game Type Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Pilih Mode Permainan:</h3>
            {gameTypes.map(type => (
              <div key={type.id} className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.emoji}</span>
                    <div>
                      <h4 className="font-bold text-gray-800">{type.name}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </div>
                
                {/* Category Selection */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Pilih Kategori:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map(category => (
                      <GameButton
                        key={category}
                        onClick={() => startGame(type.id as any, category)}
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                      >
                        {category === 'All' ? 'Semua' : category}
                      </GameButton>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Kosakata Inggris" emoji="🇬🇧">
      <div className="space-y-6">
        {/* Progress and Score */}
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Skor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{questionCount + 1}/10</div>
            <div className="text-sm text-gray-600">Pertanyaan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">
              {gameType === 'translate' ? '🔄' : gameType === 'match' ? '🎯' : '⌨️'}
            </div>
            <div className="text-sm text-gray-600">
              {selectedCategory === 'All' ? 'Semua' : selectedCategory}
            </div>
          </div>
        </div>

        {/* Question */}
        {currentWord && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {getQuestionText()}
              </h3>
              
              {/* Word Display */}
              <div className="bg-white p-4 rounded-xl inline-block mb-4">
                <div className="text-4xl mb-2">{currentWord.emoji}</div>
                {gameType !== 'spell' && (
                  <div className="font-bold text-gray-800">{currentWord.indonesian}</div>
                )}
                {gameType === 'match' && (
                  <div className="text-sm text-gray-600 mt-1">{currentWord.category}</div>
                )}
              </div>
              
              {/* Pronunciation */}
              {showPronunciation && (
                <div className="bg-yellow-50 p-3 rounded-xl mb-4">
                  <div className="text-lg font-bold text-gray-800">{currentWord.english}</div>
                  <div className="text-sm text-gray-600">{currentWord.pronunciation}</div>
                </div>
              )}
            </div>

            {/* Answer Options or Input */}
            {gameType === 'spell' ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full max-w-sm mx-auto block p-4 text-xl text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Ketik jawaban..."
                  autoFocus
                />
                <div className="text-center">
                  <GameButton
                    onClick={handleSpellSubmit}
                    disabled={!userInput.trim()}
                    variant="primary"
                    size="lg"
                    emoji="✅"
                  >
                    Periksa Jawaban
                  </GameButton>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {options.map((option, index) => {
                  let buttonClass = 'bg-white hover:bg-gray-50 border-2 border-transparent';
                  if (selectedAnswer) {
                    if (option === selectedAnswer) {
                      buttonClass = option === currentWord.english ? 
                        'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
                    } else if (option === currentWord.english) {
                      buttonClass = 'bg-green-100 border-green-500';
                    }
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !selectedAnswer && handleAnswer(option)}
                      disabled={!!selectedAnswer}
                      className={`p-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none ${buttonClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}
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

        {/* Vocabulary Categories */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl">
          <h4 className="font-bold text-center mb-3">📚 Kategori Kosakata</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-sm">
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">🐱</div>
              <div className="font-semibold">Animals</div>
              <div className="text-gray-600">Hewan</div>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">🍎</div>
              <div className="font-semibold">Food</div>
              <div className="text-gray-600">Makanan</div>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">🔴</div>
              <div className="font-semibold">Colors</div>
              <div className="text-gray-600">Warna</div>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">👩</div>
              <div className="font-semibold">Family</div>
              <div className="text-gray-600">Keluarga</div>
            </div>
            <div className="bg-white p-3 rounded-xl">
              <div className="text-2xl mb-1">📚</div>
              <div className="font-semibold">Objects</div>
              <div className="text-gray-600">Benda</div>
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