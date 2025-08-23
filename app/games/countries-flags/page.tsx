'use client';

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import AnimatedFeedback from '@/components/AnimatedFeedback';
import ScoreTracker from '@/components/ScoreTracker';
import { countriesFlags } from '@/utils/gameData';
import { updatePlayerScore, calculateScore } from '@/utils/scoreUtils';

const additionalCountries = [
  { country: 'Filipina', flag: '🇵🇭' },
  { country: 'Vietnam', flag: '🇻🇳' },
  { country: 'Korea Selatan', flag: '🇰🇷' },
  { country: 'China', flag: '🇨🇳' },
  { country: 'India', flag: '🇮🇳' },
  { country: 'Australia', flag: '🇦🇺' },
  { country: 'Inggris', flag: '🇬🇧' },
  { country: 'Jerman', flag: '🇩🇪' },
  { country: 'Prancis', flag: '🇫🇷' },
  { country: 'Brasil', flag: '🇧🇷' }
];

const allCountries = [...countriesFlags, ...additionalCountries];

export default function CountriesFlags() {
  const [currentFlag, setCurrentFlag] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [shuffledCountries, setShuffledCountries] = useState(allCountries);
  const [feedback, setFeedback] = useState<{show: boolean, type: 'success' | 'error', message?: string}>({show: false, type: 'success'});

  const getDifficultyCountries = () => {
    switch (difficulty) {
      case 'easy': return countriesFlags; // ASEAN countries
      case 'medium': return allCountries.slice(0, 10); // ASEAN + some popular
      case 'hard': return allCountries; // All countries
      default: return countriesFlags;
    }
  };

  useEffect(() => {
    const countries = getDifficultyCountries();
    const shuffled = [...countries].sort(() => Math.random() - 0.5);
    setShuffledCountries(shuffled);
  }, [difficulty, gameStarted]);

  const startGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setCurrentFlag(0);
    setScore(0);
    setLives(3);
    setGameEnded(false);
    
    const countries = selectedDifficulty === 'easy' ? countriesFlags :
                     selectedDifficulty === 'medium' ? allCountries.slice(0, 10) :
                     allCountries;
    const shuffled = [...countries].sort(() => Math.random() - 0.5);
    setShuffledCountries(shuffled);
  };

  const checkAnswer = (selectedCountry: string) => {
    const correctCountry = shuffledCountries[currentFlag].country;
    
    if (selectedCountry === correctCountry) {
      const points = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 20 : 25;
      setScore(prev => prev + points);
      setFeedback({show: true, type: 'success', message: `Benar! ${correctCountry}! 🎉`});
      
      setTimeout(() => {
        if (currentFlag < shuffledCountries.length - 1) {
          setCurrentFlag(prev => prev + 1);
        } else {
          endGame(true);
        }
      }, 1500);
    } else {
      setLives(prev => prev - 1);
      setFeedback({show: true, type: 'error', message: `Jawaban yang benar: ${correctCountry} 😊`});
      
      setTimeout(() => {
        if (lives <= 1) {
          endGame(false);
        }
      }, 2500);
    }
  };

  const endGame = (completed: boolean) => {
    setGameEnded(true);
    const maxScore = shuffledCountries.length * (difficulty === 'easy' ? 15 : difficulty === 'medium' ? 20 : 25);
    const finalScore = calculateScore(score, maxScore);
    
    updatePlayerScore({
      gameId: 'countries-flags',
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

  const getRandomOptions = () => {
    const correct = shuffledCountries[currentFlag].country;
    const allCountryNames = shuffledCountries.map(c => c.country);
    const wrongOptions = allCountryNames.filter(name => name !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Negara & Bendera" emoji="🌍">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Negara & Bendera Dunia
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Kenali bendera negara-negara di dunia!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <GameButton
              onClick={() => startGame('easy')}
              variant="success"
              size="lg"
              emoji="🟢"
            >
              <div className="text-center">
                <div className="font-bold">Mudah</div>
                <div className="text-sm opacity-75">ASEAN (6 negara)</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('medium')}
              variant="warning"
              size="lg"
              emoji="🟡"
            >
              <div className="text-center">
                <div className="font-bold">Sedang</div>
                <div className="text-sm opacity-75">Asia & Populer (10 negara)</div>
              </div>
            </GameButton>
            
            <GameButton
              onClick={() => startGame('hard')}
              variant="danger"
              size="lg"
              emoji="🔴"
            >
              <div className="text-center">
                <div className="font-bold">Sulit</div>
                <div className="text-sm opacity-75">Dunia (16 negara)</div>
              </div>
            </GameButton>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Negara ASEAN:</h3>
            <div className="grid grid-cols-3 gap-2">
              {countriesFlags.map((country, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl mb-1">{country.flag}</div>
                  <div className="text-xs">{country.country}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">Tahukah Kamu?</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• ASEAN = Association of Southeast Asian Nations</li>
              <li>• Indonesia adalah negara kepulauan terbesar</li>
              <li>• Setiap bendera punya makna dan sejarah</li>
              <li>• Warna merah-putih = Indonesia 🇮🇩</li>
            </ul>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (gameEnded) {
    return (
      <GameLayout title="Negara & Bendera" emoji="🌍">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">
            {score >= shuffledCountries.length * 12 ? '🏆' : score >= shuffledCountries.length * 8 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {score >= shuffledCountries.length * 12 ? 'Master Geografi!' : score >= shuffledCountries.length * 8 ? 'Hebat Sekali!' : 'Tetap Semangat!'}
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold">Skor Akhir: {score}</div>
            <div className="text-sm opacity-90">
              Level: {difficulty === 'easy' ? 'Mudah' : difficulty === 'medium' ? 'Sedang' : 'Sulit'} 
              ({shuffledCountries.length} negara)
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

  const country = shuffledCountries[currentFlag];
  const options = getRandomOptions();

  return (
    <GameLayout title="Negara & Bendera" emoji="🌍">
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
              {currentFlag + 1} / {shuffledCountries.length}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
              difficulty === 'easy' ? 'bg-green-500' : 
              difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {difficulty === 'easy' ? 'Mudah' : difficulty === 'medium' ? 'Sedang' : 'Sulit'}
            </div>
          </div>
        </div>

        {/* Flag Display */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-3xl text-center">
          <div className="text-8xl mb-6">
            {country.flag}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Bendera negara apa ini?
          </h3>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <GameButton
              key={index}
              onClick={() => checkAnswer(option)}
              variant="primary"
              size="lg"
              className="h-16"
            >
              {option}
            </GameButton>
          ))}
        </div>

        {/* Educational Info */}
        <div className="bg-yellow-50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            💡 Tips: Perhatikan warna, pola, dan simbol pada bendera
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-gray-50 p-4 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress:</span>
            <span className="text-sm text-gray-600">{currentFlag + 1} / {shuffledCountries.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentFlag + 1) / shuffledCountries.length) * 100}%` }}
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