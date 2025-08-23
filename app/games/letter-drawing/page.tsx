'use client';

import { useState, useRef, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import { updatePlayerScore } from '@/utils/scoreUtils';

interface Letter {
  id: string;
  letter: string;
  word: string;
  emoji: string;
  strokeOrder: string[];
}

const letters: Letter[] = [
  { id: 'a', letter: 'A', word: 'Apel', emoji: '🍎', strokeOrder: ['Garis miring kiri', 'Garis miring kanan', 'Garis tengah'] },
  { id: 'b', letter: 'B', word: 'Bola', emoji: '⚽', strokeOrder: ['Garis vertikal', 'Lengkung atas', 'Lengkung bawah'] },
  { id: 'c', letter: 'C', word: 'Ceri', emoji: '🍒', strokeOrder: ['Lengkung dari atas ke bawah'] },
  { id: 'd', letter: 'D', word: 'Durian', emoji: '🐲', strokeOrder: ['Garis vertikal', 'Lengkung besar'] },
  { id: 'e', letter: 'E', word: 'Elang', emoji: '🦅', strokeOrder: ['Garis vertikal', 'Garis atas', 'Garis tengah', 'Garis bawah'] },
  { id: 'f', letter: 'F', word: 'Flamingo', emoji: '🦩', strokeOrder: ['Garis vertikal', 'Garis atas', 'Garis tengah'] },
  { id: 'g', letter: 'G', word: 'Gajah', emoji: '🐘', strokeOrder: ['Lengkung C', 'Garis horizontal pendek'] },
  { id: 'h', letter: 'H', word: 'Harimau', emoji: '🐅', strokeOrder: ['Garis vertikal kiri', 'Garis vertikal kanan', 'Garis tengah'] }
];

export default function LetterDrawing() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGuide, setShowGuide] = useState(true);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCompletedLetters([]);
    setFeedback('');
    selectRandomLetter();
  };

  const selectRandomLetter = () => {
    const availableLetters = letters.filter(l => !completedLetters.includes(l.id));
    if (availableLetters.length === 0) {
      setFeedback('🎉 Selamat! Kamu telah menyelesaikan semua huruf!');
      return;
    }
    const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    setCurrentLetter(randomLetter);
    setCurrentStep(0);
    setShowGuide(true);
    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLetterGuide(ctx);
      }
    }
  };

  const drawLetterGuide = (ctx: CanvasRenderingContext2D) => {
    if (!currentLetter || !showGuide) return;
    
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 3;
    ctx.font = '120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw dotted letter outline
    ctx.setLineDash([5, 5]);
    ctx.strokeText(currentLetter.letter, 150, 100);
    ctx.setLineDash([]);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const nextStep = () => {
    if (!currentLetter) return;
    
    if (currentStep < currentLetter.strokeOrder.length - 1) {
      setCurrentStep(prev => prev + 1);
      setFeedback(`Bagus! Sekarang: ${currentLetter.strokeOrder[currentStep + 1]}`);
    } else {
      // Letter completed
      const points = 20;
      setScore(prev => prev + points);
      setCompletedLetters(prev => [...prev, currentLetter.id]);
      setFeedback(`🎉 Huruf ${currentLetter.letter} selesai! +${points} poin`);
      
      updatePlayerScore({
        gameId: 'letter-drawing',
        score: points,
        timeSpent: 0,
        completed: completedLetters.length >= 7,
        attempts: 1
      });
      
      setTimeout(() => {
        selectRandomLetter();
        setFeedback('');
      }, 2000);
    }
  };

  const toggleGuide = () => {
    setShowGuide(!showGuide);
    clearCanvas();
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentLetter(null);
    setScore(0);
    setCompletedLetters([]);
    setFeedback('');
  };

  useEffect(() => {
    if (currentLetter) {
      clearCanvas();
    }
  }, [currentLetter, showGuide]);

  if (!gameStarted) {
    return (
      <GameLayout title="Menggambar Huruf" emoji="🎨">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">✏️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Belajar Menulis Huruf</h2>
          <p className="text-lg text-gray-600 mb-6">
            Latih kemampuan menulis huruf dengan panduan langkah demi langkah!
          </p>
          
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Ikuti panduan garis putus-putus</li>
              <li>• Gambar huruf sesuai urutan goresan</li>
              <li>• Gunakan jari atau mouse untuk menggambar</li>
              <li>• Selesaikan semua huruf untuk skor maksimal</li>
            </ul>
          </div>

          <GameButton onClick={startGame} variant="primary" size="lg" emoji="✏️">
            Mulai Menulis
          </GameButton>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Menggambar Huruf" emoji="🎨">
      <div className="space-y-6">
        {/* Progress and Score */}
        <div className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{score}</div>
            <div className="text-sm text-gray-600">Skor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{completedLetters.length}/8</div>
            <div className="text-sm text-gray-600">Huruf Selesai</div>
          </div>
          <div className="text-center">
            <button
              onClick={toggleGuide}
              className={`text-2xl p-2 rounded-xl transition-all ${
                showGuide ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              👁️
            </button>
            <div className="text-sm text-gray-600">Panduan</div>
          </div>
        </div>

        {/* Current Letter Info */}
        {currentLetter && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{currentLetter.emoji}</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                Huruf {currentLetter.letter}
              </h3>
              <p className="text-lg text-gray-600">
                {currentLetter.letter} untuk {currentLetter.word} {currentLetter.emoji}
              </p>
            </div>

            {/* Stroke Instructions */}
            <div className="bg-white p-4 rounded-xl mb-4">
              <h4 className="font-bold text-gray-800 mb-2">
                Langkah {currentStep + 1}/{currentLetter.strokeOrder.length}:
              </h4>
              <p className="text-gray-600">{currentLetter.strokeOrder[currentStep]}</p>
            </div>
          </div>
        )}

        {/* Drawing Canvas */}
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="text-center mb-4">
            <h4 className="font-bold text-gray-800">Area Menggambar</h4>
            <p className="text-sm text-gray-600">Gambar huruf di area ini</p>
          </div>
          
          <div className="flex justify-center">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
              <canvas
                ref={canvasRef}
                width={300}
                height={200}
                className="border border-gray-200 rounded-lg cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <GameButton onClick={clearCanvas} variant="secondary" emoji="🧽">
              Hapus
            </GameButton>
            <GameButton onClick={nextStep} variant="primary" emoji="✅">
              {currentStep < (currentLetter?.strokeOrder.length || 1) - 1 ? 'Langkah Selanjutnya' : 'Selesai'}
            </GameButton>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-2xl text-center font-semibold ${
            feedback.includes('selesai') || feedback.includes('Selamat') ? 'bg-green-100 text-green-800' : 
            feedback.includes('Bagus') ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {feedback}
          </div>
        )}

        {/* Completed Letters */}
        {completedLetters.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-2xl">
            <h4 className="font-bold text-center mb-3">🏆 Huruf yang Sudah Selesai</h4>
            <div className="flex justify-center gap-2 flex-wrap">
              {completedLetters.map(letterId => {
                const letter = letters.find(l => l.id === letterId);
                return (
                  <div key={letterId} className="bg-white px-3 py-2 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">{letter?.letter}</div>
                    <div className="text-xs text-gray-600">{letter?.word}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reset Button */}
        {completedLetters.length >= 8 && (
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