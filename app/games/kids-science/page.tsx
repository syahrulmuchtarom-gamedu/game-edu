'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { scienceQuestions } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

const additionalQuestions = [
  { question: 'Apa yang dibutuhkan api untuk menyala?', options: ['Air', 'Oksigen', 'Tanah'], answer: 1, image: '🔥', explanation: 'Api membutuhkan oksigen untuk bisa menyala dan terus berkobar.' },
  { question: 'Planet mana yang paling dekat dengan Matahari?', options: ['Venus', 'Merkurius', 'Mars'], answer: 1, image: '☀️', explanation: 'Merkurius adalah planet terdekat dengan Matahari dalam tata surya kita.' },
  { question: 'Apa yang terjadi pada air saat dipanaskan?', options: ['Membeku', 'Menguap', 'Mengeras'], answer: 1, image: '💨', explanation: 'Air berubah menjadi uap air (gas) ketika dipanaskan hingga mendidih.' },
  { question: 'Hewan mana yang bernapas dengan insang?', options: ['Burung', 'Ikan', 'Kucing'], answer: 1, image: '🐟', explanation: 'Ikan bernapas menggunakan insang untuk mengambil oksigen dari air.' },
  { question: 'Apa fungsi akar pada tumbuhan?', options: ['Menyerap air', 'Membuat bunga', 'Menghasilkan buah'], answer: 0, image: '🌱', explanation: 'Akar berfungsi menyerap air dan nutrisi dari tanah untuk tumbuhan.' },
  { question: 'Berapa jumlah tulang pada tubuh manusia dewasa?', options: ['150', '206', '300'], answer: 1, image: '🦴', explanation: 'Tubuh manusia dewasa memiliki 206 tulang yang membentuk rangka.' },
  { question: 'Apa yang menyebabkan hujan?', options: ['Angin kencang', 'Awan yang jenuh air', 'Panas matahari'], answer: 1, image: '🌧️', explanation: 'Hujan terjadi ketika awan sudah jenuh dengan uap air dan tidak bisa menahan lagi.' },
  { question: 'Hewan mana yang mengalami metamorfosis?', options: ['Anjing', 'Kupu-kupu', 'Gajah'], answer: 1, image: '🦋', explanation: 'Kupu-kupu mengalami metamorfosis dari ulat → kepompong → kupu-kupu.' }
];

const allQuestions = [...scienceQuestions, ...additionalQuestions];

export default function KidsScience() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState(allQuestions);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 8);
    setShuffledQuestions(shuffled);
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    setShowExplanation(false);
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 8);
    setShuffledQuestions(shuffled);
  };

  const checkAnswer = (selectedIndex: number) => {
    const question = shuffledQuestions[currentQuestion];
    
    if (selectedIndex === question.answer) {
      setScore(prev => prev + 20);
      setShowExplanation(true);
      setFeedback({show: true, type: 'success', message: 'Benar! Hebat! 🔬'});
      
      setTimeout(() => {
        if (currentQuestion < shuffledQuestions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setShowExplanation(false);
        } else {
          endGame(true);
        }
      }, 4000);
    } else {
      setLives(prev => prev - 1);
      setShowExplanation(true);
      setFeedback({show: true, type: 'error', message: `Jawaban yang benar: ${question.options[question.answer]} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        } else {
          if (currentQuestion < shuffledQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setShowExplanation(false);
          } else {
            endGame(false);
          }
        }
      }, 4000);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const finalScore = calculateScore(score, shuffledQuestions.length * 20);
    
    updatePlayerScore({
      gameId: 'kids-science',
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

  if (!gameStarted) {
    return (
      <GameLayout title="Sains Anak" emoji="🔬">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🔬</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sains untuk Anak
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Jelajahi dunia sains dengan pertanyaan menarik!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Topik yang Dipelajari:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• 🐟 Hewan dan habitatnya</li>
              <li>• 🌱 Tumbuhan dan pertumbuhan</li>
              <li>• 🌍 Alam dan cuaca</li>
              <li>• 🦴 Tubuh manusia</li>
              <li>• ☀️ Tata surya dan planet</li>
              <li>• 🔥 Sifat-sifat benda</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Jawab 8 pertanyaan sains</li>
              <li>• Setiap jawaban benar dapat penjelasan</li>
              <li>• Belajar fakta menarik tentang alam</li>
              <li>• Kamu punya 3 nyawa ❤️</li>
            </ul>
          </div>

          <GameButton onClick={startGame} variant="primary" size="lg" emoji="🚀">
            Mulai Belajar
          </GameButton>
        </div>
      </GameLayout>
    );
  }

  if (gameEnded) {
    return (
      <GameLayout title="Sains Anak" emoji="🔬">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= shuffledQuestions.length * 15 ? '🏆' : score >= shuffledQuestions.length * 10 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= shuffledQuestions.length * 15 ? 'Ilmuwan Cilik!' : score >= shuffledQuestions.length * 10 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Pertanyaan dijawab: {currentQuestion + (lives > 0 ? 1 : 0)} dari {shuffledQuestions.length}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">🎓 Pesan untuk Ilmuwan Cilik:</h3>
            <p className="text-gray-600 text-sm">
              Terus bertanya dan belajar tentang dunia di sekitar kita! 
              Sains ada di mana-mana dan sangat menyenangkan untuk dipelajari.
            </p>
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

  const question = shuffledQuestions[currentQuestion];

  return (
    <GameLayout title="Sains Anak" emoji="🔬">
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
              {currentQuestion + 1} / {shuffledQuestions.length}
            </div>
          </div>
        </div>

        {/* Question Display */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-3xl text-center">
          <div className="text-8xl mb-6">
            {question.image}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {question.question}
          </h3>
        </div>

        {/* Answer Options */}
        {!showExplanation ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {question.options.map((option, index) => (
              <GameButton
                key={index}
                onClick={() => checkAnswer(index)}
                variant="primary"
                size="lg"
                className="h-16"
              >
                {option}
              </GameButton>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-3xl">
            <div className="text-center">
              <div className="text-4xl mb-3">💡</div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Penjelasan:</h4>
              <p className="text-gray-700 leading-relaxed">
                {question.explanation}
              </p>
              <div className="mt-4 p-4 bg-white rounded-2xl">
                <p className="text-sm text-gray-600">
                  <strong>Jawaban yang benar:</strong> {question.options[question.answer]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Educational Tip */}
        <div className="bg-purple-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            🧪 Tip: Sains membantu kita memahami bagaimana dunia bekerja!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-50 p-4 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress:</span>
            <span className="text-sm text-gray-600">{currentQuestion + 1} / {shuffledQuestions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
            ></div>
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