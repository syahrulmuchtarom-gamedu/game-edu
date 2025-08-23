'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Game } from '@/utils/gameData';
import { PlayerScore } from '@/utils/scoreUtils';

interface LazyGameCardProps {
  game: Game;
  playerScore: PlayerScore | null;
}

export default function LazyGameCard({ game, playerScore }: LazyGameCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
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

  return (
    <div ref={cardRef} className="h-full">
      {isVisible ? (
        <Link href={`/play/${game.id}`} className="group block">
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
      ) : (
        <div className="bg-gray-200 animate-pulse rounded-3xl h-80">
          <div className="p-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded-2xl"></div>
          </div>
        </div>
      )}
    </div>
  );
}