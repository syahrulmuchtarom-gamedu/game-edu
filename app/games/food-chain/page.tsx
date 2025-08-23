'use client';

import { useState } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import { updatePlayerScore } from '@/utils/scoreUtils';

interface Organism {
  id: string;
  name: string;
  emoji: string;
  type: 'producer' | 'primary' | 'secondary' | 'decomposer';
  level: number;
}

const organisms: Organism[] = [
  { id: 'grass', name: 'Rumput', emoji: '🌱', type: 'producer', level: 1 },
  { id: 'tree', name: 'Pohon', emoji: '🌳', type: 'producer', level: 1 },
  { id: 'rabbit', name: 'Kelinci', emoji: '🐰', type: 'primary', level: 2 },
  { id: 'deer', name: 'Rusa', emoji: '🦌', type: 'primary', level: 2 },
  { id: 'fox', name: 'Rubah', emoji: '🦊', type: 'secondary', level: 3 },
  { id: 'eagle', name: 'Elang', emoji: '🦅', type: 'secondary', level: 3 },
  { id: 'mushroom', name: 'Jamur', emoji: '🍄', type: 'decomposer', level: 4 },
  { id: 'bacteria', name: 'Bakteri', emoji: '🦠', type: 'decomposer', level: 4 }
];

const correctChains = [
  ['grass', 'rabbit', 'fox', 'mushroom'],
  ['tree', 'deer', 'eagle', 'bacteria'],
  ['grass', 'deer', 'fox', 'bacteria']
];

export default function FoodChain() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string[]>([]);
  const [availableOrganisms, setAvailableOrganisms] = useState(organisms);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [level, setLevel] = useState(1);

  const startGame = () => {
    setGameStarted(true);
    setSelectedChain([]);
    setAvailableOrganisms(organisms);
    setScore(0);
    setFeedback('');
    setLevel(1);
  };

  const addToChain = (organism: Organism) => {
    const newChain = [...selectedChain, organism.id];
    setSelectedChain(newChain);
    setAvailableOrganisms(prev => prev.filter(o => o.id !== organism.id));
  };

  const removeFromChain = (index: number) => {
    const removedOrganism = organisms.find(o => o.id === selectedChain[index]);
    if (removedOrganism) {
      setAvailableOrganisms(prev => [...prev, removedOrganism].sort((a, b) => a.level - b.level));
    }
    setSelectedChain(prev => prev.filter((_, i) => i !== index));
  };

  const checkChain = () => {
    const isCorrect = correctChains.some(chain => 
      chain.length === selectedChain.length && 
      chain.every((org, index) => org === selectedChain[index])
    );

    if (isCorrect) {
      const points = 30;
      setScore(prev => prev + points);
      setFeedback('🎉 Benar! Rantai makanan yang sempurna!');
      updatePlayerScore({
        gameId: 'food-chain',
        score: points,
        timeSpent: 0,
        completed: true,
        attempts: 1
      });
      setTimeout(() => {
        setLevel(prev => prev + 1);
        resetRound();
      }, 2000);
    } else {
      setFeedback('❌ Coba lagi! Ingat: Produsen → Konsumen Primer → Konsumen Sekunder → Pengurai');
    }
  };

  const resetRound = () => {
    setSelectedChain([]);
    setAvailableOrganisms(organisms);
    setFeedback('');
  };

  const getOrganismByType = (type: string) => {
    return availableOrganisms.filter(o => o.type === type);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Rantai Makanan" emoji="🍯">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🍯</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Rantai Makanan Ekosistem</h2>
          <p className="text-lg text-gray-600 mb-6">
            Susun rantai makanan yang benar dari produsen hingga pengurai!
          </p>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="font-bold text-gray-800 mb-2">Cara Bermain:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Pilih organisme sesuai urutan rantai makanan</li>
              <li>• Mulai dari Produsen (tumbuhan)</li>
              <li>• Lanjut ke Konsumen Primer (herbivora)</li>
              <li>• Kemudian Konsumen Sekunder (karnivora)</li>
              <li>• Akhiri dengan Pengurai (jamur/bakteri)</li>
            </ul>
          </div>

          <GameButton onClick={startGame} variant="primary" size="lg" emoji="🌱">
            Mulai Menyusun Rantai
          </GameButton>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Rantai Makanan" emoji="🍯">
      <div className="space-y-6">
        {/* Score and Level */}
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Skor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{level}</div>
            <div className="text-sm text-gray-600">Level</div>
          </div>
        </div>

        {/* Current Chain */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-center mb-4">🔗 Rantai Makanan Kamu</h3>
          <div className="flex justify-center items-center gap-2 flex-wrap min-h-[80px]">
            {selectedChain.length === 0 ? (
              <div className="text-gray-400 text-center">
                <div className="text-4xl mb-2">🌱</div>
                <p>Mulai dengan memilih Produsen</p>
              </div>
            ) : (
              selectedChain.map((orgId, index) => {
                const org = organisms.find(o => o.id === orgId);
                return (
                  <div key={index} className="flex items-center">
                    <button
                      onClick={() => removeFromChain(index)}
                      className="bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      <div className="text-3xl">{org?.emoji}</div>
                      <div className="text-sm font-semibold mt-1">{org?.name}</div>
                    </button>
                    {index < selectedChain.length - 1 && (
                      <div className="mx-2 text-2xl text-gray-400">→</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          {selectedChain.length >= 4 && (
            <div className="text-center mt-4">
              <GameButton onClick={checkChain} variant="primary" size="lg" emoji="✅">
                Periksa Rantai
              </GameButton>
            </div>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-2xl text-center font-semibold ${
            feedback.includes('Benar') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {feedback}
          </div>
        )}

        {/* Available Organisms by Category */}
        <div className="space-y-4">
          {/* Producers */}
          <div className="bg-green-50 p-4 rounded-2xl">
            <h4 className="font-bold text-green-800 mb-3 text-center">🌱 Produsen (Tumbuhan)</h4>
            <div className="grid grid-cols-2 gap-3">
              {getOrganismByType('producer').map(org => (
                <GameButton
                  key={org.id}
                  onClick={() => addToChain(org)}
                  variant="secondary"
                  className="h-auto py-3"
                >
                  <div className="text-center">
                    <div className="text-2xl">{org.emoji}</div>
                    <div className="text-sm font-semibold">{org.name}</div>
                  </div>
                </GameButton>
              ))}
            </div>
          </div>

          {/* Primary Consumers */}
          <div className="bg-yellow-50 p-4 rounded-2xl">
            <h4 className="font-bold text-yellow-800 mb-3 text-center">🐰 Konsumen Primer (Herbivora)</h4>
            <div className="grid grid-cols-2 gap-3">
              {getOrganismByType('primary').map(org => (
                <GameButton
                  key={org.id}
                  onClick={() => addToChain(org)}
                  variant="secondary"
                  className="h-auto py-3"
                >
                  <div className="text-center">
                    <div className="text-2xl">{org.emoji}</div>
                    <div className="text-sm font-semibold">{org.name}</div>
                  </div>
                </GameButton>
              ))}
            </div>
          </div>

          {/* Secondary Consumers */}
          <div className="bg-red-50 p-4 rounded-2xl">
            <h4 className="font-bold text-red-800 mb-3 text-center">🦊 Konsumen Sekunder (Karnivora)</h4>
            <div className="grid grid-cols-2 gap-3">
              {getOrganismByType('secondary').map(org => (
                <GameButton
                  key={org.id}
                  onClick={() => addToChain(org)}
                  variant="secondary"
                  className="h-auto py-3"
                >
                  <div className="text-center">
                    <div className="text-2xl">{org.emoji}</div>
                    <div className="text-sm font-semibold">{org.name}</div>
                  </div>
                </GameButton>
              ))}
            </div>
          </div>

          {/* Decomposers */}
          <div className="bg-purple-50 p-4 rounded-2xl">
            <h4 className="font-bold text-purple-800 mb-3 text-center">🍄 Pengurai (Dekomposer)</h4>
            <div className="grid grid-cols-2 gap-3">
              {getOrganismByType('decomposer').map(org => (
                <GameButton
                  key={org.id}
                  onClick={() => addToChain(org)}
                  variant="secondary"
                  className="h-auto py-3"
                >
                  <div className="text-center">
                    <div className="text-2xl">{org.emoji}</div>
                    <div className="text-sm font-semibold">{org.name}</div>
                  </div>
                </GameButton>
              ))}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <GameButton onClick={resetRound} variant="secondary" size="lg" emoji="🔄">
            Reset Rantai
          </GameButton>
        </div>
      </div>
    </GameLayout>
  );
}