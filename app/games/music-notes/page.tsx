'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import { updatePlayerScore } from '@/utils/scoreUtils';

interface Note {
  id: string;
  name: string;
  solfege: string;
  color: string;
  position: number;
  frequency: number;
}

const notes: Note[] = [
  { id: 'do', name: 'Do', solfege: 'Do', color: '#FF6B6B', position: 1, frequency: 261.63 },
  { id: 're', name: 'Re', solfege: 'Re', color: '#4ECDC4', position: 2, frequency: 293.66 },
  { id: 'mi', name: 'Mi', solfege: 'Mi', color: '#45B7D1', position: 3, frequency: 329.63 },
  { id: 'fa', name: 'Fa', solfege: 'Fa', color: '#96CEB4', position: 4, frequency: 349.23 },
  { id: 'sol', name: 'Sol', solfege: 'Sol', color: '#FFEAA7', position: 5, frequency: 392.00 },
  { id: 'la', name: 'La', solfege: 'La', color: '#DDA0DD', position: 6, frequency: 440.00 },
  { id: 'si', name: 'Si', solfege: 'Si', color: '#98D8C8', position: 7, frequency: 493.88 }
];

const melodies = [
  { name: 'Twinkle Twinkle', notes: ['do', 'do', 'sol', 'sol', 'la', 'la', 'sol'] },
  { name: 'Mary Had a Little Lamb', notes: ['mi', 're', 'do', 're', 'mi', 'mi', 'mi'] },
  { name: 'Happy Birthday', notes: ['do', 'do', 're', 'do', 'fa', 'mi'] },
  { name: 'Lagu Anak', notes: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'] }
];

const gameTypes = [
  { id: 'identify', name: 'Kenali Nada', emoji: '🎵', description: 'Tebak nama nada yang dimainkan' },
  { id: 'sequence', name: 'Urutan Nada', emoji: '🎼', description: 'Ulangi urutan nada yang dimainkan' },
  { id: 'melody', name: 'Mainkan Melodi', emoji: '🎶', description: 'Mainkan melodi lagu sederhana' }
];

export default function MusicNotes() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameType, setGameType] = useState<'identify' | 'sequence' | 'melody'>('identify');
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [sequence, setSequence] = useState<Note[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Note[]>([]);
  const [currentMelody, setCurrentMelody] = useState<typeof melodies[0] | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSequence, setShowSequence] = useState(false);

  const startGame = (type: 'identify' | 'sequence' | 'melody') => {
    setGameStarted(true);
    setGameType(type);
    setScore(0);
    setLevel(1);
    setFeedback('');
    setPlayerSequence([]);
    
    if (type === 'identify') {
      generateIdentifyQuestion();
    } else if (type === 'sequence') {
      generateSequence();
    } else {
      selectMelody();
    }
  };

  const generateIdentifyQuestion = () => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setCurrentNote(randomNote);
  };

  const generateSequence = () => {
    const sequenceLength = Math.min(3 + level, 7);
    const newSequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(notes[Math.floor(Math.random() * notes.length)]);
    }
    setSequence(newSequence);
    setPlayerSequence([]);
    playSequence(newSequence);
  };

  const selectMelody = () => {
    const randomMelody = melodies[Math.floor(Math.random() * melodies.length)];
    setCurrentMelody(randomMelody);
    setPlayerSequence([]);
  };

  const playNote = (note: Note) => {
    setIsPlaying(true);
    // Simulate note playing with visual feedback
    setTimeout(() => {
      setIsPlaying(false);
    }, 500);
  };

  const playSequence = async (seq: Note[]) => {
    setShowSequence(true);
    for (let i = 0; i < seq.length; i++) {
      setCurrentNote(seq[i]);
      setIsPlaying(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsPlaying(false);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setCurrentNote(null);
    setShowSequence(false);
  };

  const handleNoteClick = (note: Note) => {
    playNote(note);
    
    if (gameType === 'identify') {
      if (note.id === currentNote?.id) {
        const points = 10;
        setScore(prev => prev + points);
        setFeedback(`🎉 Benar! Itu nada ${note.name} (${note.solfege})`);
        updatePlayerScore({
          gameId: 'music-notes',
          score: points,
          timeSpent: 0,
          completed: false,
          attempts: 1
        });
        setTimeout(() => {
          generateIdentifyQuestion();
          setFeedback('');
        }, 1500);
      } else {
        setFeedback(`❌ Salah! Itu nada ${currentNote?.name} (${currentNote?.solfege})`);
      }
    } else if (gameType === 'sequence') {
      const newPlayerSequence = [...playerSequence, note];
      setPlayerSequence(newPlayerSequence);
      
      // Check if current note is correct
      const currentIndex = newPlayerSequence.length - 1;
      if (sequence[currentIndex]?.id !== note.id) {
        setFeedback('❌ Salah! Coba lagi dari awal.');
        setTimeout(() => {
          setPlayerSequence([]);
          setFeedback('');
        }, 1500);
        return;
      }
      
      // Check if sequence is complete
      if (newPlayerSequence.length === sequence.length) {
        const points = 15 * level;
        setScore(prev => prev + points);
        setFeedback(`🎉 Sempurna! Level ${level} selesai!`);
        updatePlayerScore({
          gameId: 'music-notes',
          score: points,
          timeSpent: 0,
          completed: false,
          attempts: 1
        });
        setTimeout(() => {
          setLevel(prev => prev + 1);
          generateSequence();
          setFeedback('');
        }, 2000);
      }
    } else if (gameType === 'melody') {
      const newPlayerSequence = [...playerSequence, note];
      setPlayerSequence(newPlayerSequence);
      
      if (!currentMelody) return;
      
      const expectedNoteId = currentMelody.notes[newPlayerSequence.length - 1];
      if (expectedNoteId !== note.id) {
        setFeedback('❌ Salah! Coba lagi dari awal.');
        setTimeout(() => {
          setPlayerSequence([]);
          setFeedback('');
        }, 1500);
        return;
      }
      
      if (newPlayerSequence.length === currentMelody.notes.length) {
        const points = 20;
        setScore(prev => prev + points);
        setFeedback(`🎉 Lagu ${currentMelody.name} berhasil dimainkan!`);
        updatePlayerScore({
          gameId: 'music-notes',
          score: points,
          timeSpent: 0,
          completed: false,
          attempts: 1
        });
        setTimeout(() => {
          selectMelody();
          setFeedback('');
        }, 2000);
      }
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentNote(null);
    setSequence([]);
    setPlayerSequence([]);
    setCurrentMelody(null);
    setScore(0);
    setLevel(1);
    setFeedback('');
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Nada & Ritme" emoji="🎵">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎹</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Belajar Nada Musik</h2>
          <p className="text-lg text-gray-600 mb-6">
            Kenali nada-nada musik dan mainkan melodi sederhana!
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl max-w-md mx-auto mb-6">
            <div className="text-4xl mb-4">🎼</div>
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
    <GameLayout title="Nada & Ritme" emoji="🎵">
      <div className="space-y-6">
        {/* Progress and Score */}
        <div className="flex justify-between items-center bg-purple-50 p-4 rounded-2xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{score}</div>
            <div className="text-sm text-gray-600">Skor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{level}</div>
            <div className="text-sm text-gray-600">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">
              {gameType === 'identify' ? '🎵' : gameType === 'sequence' ? '🎼' : '🎶'}
            </div>
            <div className="text-sm text-gray-600">
              {gameType === 'identify' ? 'Kenali' : gameType === 'sequence' ? 'Urutan' : 'Melodi'}
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
          <div className="text-center mb-4">
            {gameType === 'identify' && currentNote && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Nada apa ini?
                </h3>
                <div 
                  className={`text-6xl mb-4 transition-all duration-300 ${
                    isPlaying ? 'animate-pulse scale-110' : ''
                  }`}
                  style={{ color: currentNote.color }}
                >
                  🎵
                </div>
                <GameButton onClick={() => playNote(currentNote)} variant="secondary" emoji="🔊">
                  Putar Nada
                </GameButton>
              </>
            )}
            
            {gameType === 'sequence' && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Ulangi urutan nada ini (Level {level})
                </h3>
                <div className="flex justify-center gap-2 mb-4">
                  {sequence.map((note, index) => (
                    <div 
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        showSequence && currentNote?.id === note.id ? 'animate-pulse scale-125' : ''
                      }`}
                      style={{ backgroundColor: note.color }}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-2 mb-4">
                  <GameButton onClick={() => playSequence(sequence)} variant="secondary" emoji="🔄">
                    Putar Ulang
                  </GameButton>
                </div>
                <div className="text-sm text-gray-600">
                  Progress: {playerSequence.length}/{sequence.length}
                </div>
              </>
            )}
            
            {gameType === 'melody' && currentMelody && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Mainkan: {currentMelody.name}
                </h3>
                <div className="flex justify-center gap-1 mb-4 flex-wrap">
                  {currentMelody.notes.map((noteId, index) => {
                    const note = notes.find(n => n.id === noteId);
                    const isPlayed = index < playerSequence.length;
                    return (
                      <div 
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          isPlayed ? 'opacity-100' : 'opacity-30'
                        }`}
                        style={{ backgroundColor: note?.color }}
                      >
                        {note?.name}
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm text-gray-600">
                  Progress: {playerSequence.length}/{currentMelody.notes.length}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Piano Keys */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h4 className="text-center font-bold text-gray-800 mb-4">🎹 Piano Virtual</h4>
          <div className="flex justify-center gap-2 flex-wrap">
            {notes.map(note => (
              <button
                key={note.id}
                onClick={() => handleNoteClick(note)}
                className={`w-16 h-20 rounded-lg font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                  isPlaying && currentNote?.id === note.id ? 'animate-pulse scale-110' : ''
                }`}
                style={{ backgroundColor: note.color }}
              >
                <div className="text-sm">{note.name}</div>
                <div className="text-xs opacity-80">{note.solfege}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-2xl text-center font-semibold ${
            feedback.includes('Benar') || feedback.includes('Sempurna') || feedback.includes('berhasil') ? 
            'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {feedback}
          </div>
        )}

        {/* Music Theory */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl">
          <h4 className="font-bold text-center mb-3">🎼 Tangga Nada</h4>
          <div className="flex justify-center gap-2 flex-wrap">
            {notes.map(note => (
              <div key={note.id} className="bg-white p-2 rounded-xl text-center text-xs">
                <div 
                  className="w-6 h-6 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: note.color }}
                ></div>
                <div className="font-semibold">{note.name}</div>
                <div className="text-gray-600">{note.solfege}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <GameButton onClick={resetGame} variant="secondary" size="lg" emoji="🔄">
            Ganti Mode
          </GameButton>
        </div>
      </div>
    </GameLayout>
  );
}