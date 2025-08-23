'use client';

import { useState, useEffect, useRef } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import { updatePlayerScore } from '@/utils/scoreUtils';

interface TypingLesson {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  words: string[];
  description: string;
}

const typingLessons: TypingLesson[] = [
  {
    id: 'letters',
    title: 'Huruf Dasar',
    level: 'beginner',
    words: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'h', 'g'],
    description: 'Belajar mengetik huruf dasar'
  },
  {
    id: 'simple-words',
    title: 'Kata Sederhana',
    level: 'beginner',
    words: ['aku', 'dia', 'kamu', 'kami', 'saya', 'nama', 'rumah', 'sekolah'],
    description: 'Kata-kata sederhana sehari-hari'
  },
  {
    id: 'animals',
    title: 'Nama Hewan',
    level: 'intermediate',
    words: ['kucing', 'anjing', 'kelinci', 'burung', 'ikan', 'gajah', 'harimau', 'singa'],
    description: 'Mengetik nama-nama hewan'
  },
  {
    id: 'colors',
    title: 'Warna-Warna',
    level: 'intermediate',
    words: ['merah', 'biru', 'hijau', 'kuning', 'ungu', 'orange', 'hitam', 'putih'],
    description: 'Belajar mengetik nama warna'
  },
  {
    id: 'sentences',
    title: 'Kalimat Pendek',
    level: 'advanced',
    words: ['aku suka belajar', 'rumah saya besar', 'kucing itu lucu', 'hari ini cerah'],
    description: 'Mengetik kalimat pendek'
  }
];

export default function TypingPractice() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<TypingLesson | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [typedText, setTypedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [completedWords, setCompletedWords] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = (lesson: TypingLesson) => {
    setGameStarted(true);
    setSelectedLesson(lesson);
    setCurrentWord(lesson.words[0]);
    setTypedText('');
    setWordIndex(0);
    setScore(0);
    setAccuracy(100);
    setWpm(0);
    setStartTime(Date.now());
    setFeedback('');
    setCompletedWords(0);
    
    // Focus input after a short delay
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTypedText(value);
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    // Calculate accuracy
    const correctChars = value.split('').filter((char, index) => 
      char === currentWord[index]
    ).length;
    const newAccuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;
    setAccuracy(newAccuracy);
    
    // Check if word is completed correctly
    if (value === currentWord) {
      handleWordComplete();
    }
  };

  const handleWordComplete = () => {
    if (!selectedLesson || !startTime) return;
    
    const points = Math.round(accuracy * 0.1) + 5;
    setScore(prev => prev + points);
    setCompletedWords(prev => prev + 1);
    
    // Calculate WPM
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = completedWords + 1;
    const newWpm = Math.round(wordsTyped / timeElapsed);
    setWpm(newWpm);
    
    setFeedback(`🎉 Benar! +${points} poin`);
    
    updatePlayerScore({
      gameId: 'typing-practice',
      score: points,
      timeSpent: Math.round((Date.now() - startTime) / 1000),
      completed: wordIndex >= selectedLesson.words.length - 1,
      attempts: 1
    });
    
    setTimeout(() => {
      if (wordIndex < selectedLesson.words.length - 1) {
        setWordIndex(prev => prev + 1);
        setCurrentWord(selectedLesson.words[wordIndex + 1]);
        setTypedText('');
        setFeedback('');
        inputRef.current?.focus();
      } else {
        setFeedback(`🏆 Selesai! Akurasi: ${accuracy}%, WPM: ${newWpm}`);
      }
    }, 1000);
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedLesson(null);
    setCurrentWord('');
    setTypedText('');
    setWordIndex(0);
    setScore(0);
    setAccuracy(100);
    setWpm(0);
    setStartTime(null);
    setFeedback('');
    setCompletedWords(0);
  };

  const getCharacterStatus = (char: string, index: number) => {
    if (index >= typedText.length) return 'pending';
    return typedText[index] === char ? 'correct' : 'incorrect';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Belajar Ketik" emoji="⌨️">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">💻</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Latihan Mengetik</h2>
          <p className="text-lg text-gray-600 mb-6">
            Belajar mengetik dengan cepat dan akurat!
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl max-w-md mx-auto mb-6">
            <div className="text-4xl mb-4">⌨️</div>
            <h3 className="font-bold text-gray-800 mb-2">Tips Mengetik:</h3>
            <ul className="text-left text-gray-600 space-y-1 text-sm">
              <li>• Gunakan semua jari untuk mengetik</li>
              <li>• Jangan melihat keyboard</li>
              <li>• Fokus pada akurasi dulu, kecepatan kemudian</li>
              <li>• Berlatih secara rutin</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Pilih Pelajaran:</h3>
            {typingLessons.map(lesson => (
              <div key={lesson.id} className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800">{lesson.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(lesson.level)}`}>
                    {lesson.level === 'beginner' ? 'Pemula' : 
                     lesson.level === 'intermediate' ? 'Menengah' : 'Lanjut'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{lesson.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {lesson.words.length} kata
                  </div>
                  <GameButton 
                    onClick={() => startGame(lesson)} 
                    variant="primary" 
                    size="sm"
                    emoji="▶️"
                  >
                    Mulai
                  </GameButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Belajar Ketik" emoji="⌨️">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Skor</div>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl text-center">
            <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-sm text-gray-600">Akurasi</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl text-center">
            <div className="text-2xl font-bold text-purple-600">{wpm}</div>
            <div className="text-sm text-gray-600">WPM</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-2xl text-center">
            <div className="text-2xl font-bold text-orange-600">{completedWords}/{selectedLesson?.words.length}</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>

        {/* Lesson Info */}
        {selectedLesson && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedLesson.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(selectedLesson.level)}`}>
                {selectedLesson.level === 'beginner' ? 'Pemula' : 
                 selectedLesson.level === 'intermediate' ? 'Menengah' : 'Lanjut'}
              </span>
            </div>
          </div>
        )}

        {/* Typing Area */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Ketik kata ini:</h4>
            
            {/* Word Display */}
            <div className="text-4xl font-mono mb-6 p-4 bg-gray-50 rounded-xl">
              {currentWord.split('').map((char, index) => {
                const status = getCharacterStatus(char, index);
                return (
                  <span
                    key={index}
                    className={`${
                      status === 'correct' ? 'text-green-600 bg-green-100' :
                      status === 'incorrect' ? 'text-red-600 bg-red-100' :
                      'text-gray-400'
                    } px-1 rounded`}
                  >
                    {char}
                  </span>
                );
              })}
              {typedText.length === currentWord.length && (
                <span className="animate-pulse text-green-600">|</span>
              )}
            </div>
            
            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={typedText}
              onChange={handleInputChange}
              className="w-full max-w-md p-4 text-2xl font-mono text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="Mulai mengetik..."
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedWords / (selectedLesson?.words.length || 1)) * 100}%` }}
            ></div>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            Kata {completedWords + 1} dari {selectedLesson?.words.length}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-2xl text-center font-semibold ${
            feedback.includes('Benar') ? 'bg-green-100 text-green-800' : 
            feedback.includes('Selesai') ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {feedback}
          </div>
        )}

        {/* Virtual Keyboard Hint */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl">
          <h4 className="font-bold text-center mb-3">⌨️ Posisi Jari</h4>
          <div className="text-center text-sm text-gray-600">
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              <div className="bg-white p-2 rounded text-xs">
                <div className="font-semibold">Jari Kelingking Kiri</div>
                <div>A, Q, Z</div>
              </div>
              <div className="bg-white p-2 rounded text-xs">
                <div className="font-semibold">Jari Manis Kiri</div>
                <div>S, W, X</div>
              </div>
              <div className="bg-white p-2 rounded text-xs">
                <div className="font-semibold">Jari Tengah Kiri</div>
                <div>D, E, C</div>
              </div>
              <div className="bg-white p-2 rounded text-xs">
                <div className="font-semibold">Jari Telunjuk Kiri</div>
                <div>F, R, V, G, T, B</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        {completedWords >= (selectedLesson?.words.length || 0) && (
          <div className="text-center">
            <GameButton onClick={resetGame} variant="secondary" size="lg" emoji="🔄">
              Pilih Pelajaran Lain
            </GameButton>
          </div>
        )}
      </div>
    </GameLayout>
  );
}