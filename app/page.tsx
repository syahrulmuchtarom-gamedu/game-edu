'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { games } from '@/utils/gameData';
import { getPlayerScore, PlayerScore } from '@/utils/scoreUtils';
import ScoreTracker from '@/components/ScoreTracker';

export default function HomePage() {
  const [playerScore, setPlayerScore] = useState<PlayerScore | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPlayerScore(getPlayerScore());
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-pink-500';
      default: return 'from-blue-400 to-purple-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Mudah';
      case 'medium': return 'Sedang';
      case 'hard': return 'Sulit';
      default: return 'Sedang';
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🎮 Game Edukasi Anak
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Belajar sambil bermain dengan 15 permainan seru!
          </p>
          
          {/* Score Display */}
          <div className="flex justify-center mb-6">
            <ScoreTracker showTotal={true} />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={game.path}
              className="group block"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 h-full">
                {/* Game Icon */}
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3 group-hover:animate-bounce">
                    {game.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {game.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {game.description}
                  </p>
                </div>

                {/* Game Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getDifficultyColor(game.difficulty)}`}>
                      {getDifficultyText(game.difficulty)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {game.category}
                    </span>
                  </div>
                  
                  {/* High Score */}
                  {playerScore?.gameScores[game.id] && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <span className="text-sm">⭐</span>
                      <span className="text-sm font-bold">
                        {playerScore.gameScores[game.id]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Play Button */}
                <div className="mt-4">
                  <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl text-center group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-200">
                    Mainkan 🚀
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/80">
          <p className="text-lg font-semibold mb-2">
            Selamat belajar dan bermain! 🌟
          </p>
          <p className="text-sm">
            Aplikasi ini dirancang khusus untuk anak-anak usia 6-12 tahun
          </p>
        </div>
      </div>
    </div>
  );
}