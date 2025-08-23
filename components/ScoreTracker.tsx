'use client';

import { useState, useEffect } from 'react';
import { getPlayerScore, PlayerScore } from '@/utils/scoreUtils';

interface ScoreTrackerProps {
  currentScore?: number;
  showTotal?: boolean;
}

export default function ScoreTracker({ currentScore = 0, showTotal = true }: ScoreTrackerProps) {
  const [playerScore, setPlayerScore] = useState<PlayerScore | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPlayerScore(getPlayerScore());
  }, []);

  if (!mounted || !playerScore) {
    return (
      <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl">
        <span className="text-2xl">⭐</span>
        <span className="font-bold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {/* Current Game Score */}
      {currentScore > 0 && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg">
          <span className="text-2xl">🎯</span>
          <span className="font-bold text-lg">{currentScore}</span>
        </div>
      )}

      {/* Total Score */}
      {showTotal && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg">
          <span className="text-2xl">⭐</span>
          <div className="flex flex-col">
            <span className="font-bold text-lg">{playerScore.totalPoints}</span>
            <span className="text-xs opacity-90">{playerScore.gamesPlayed} games</span>
          </div>
        </div>
      )}

      {/* Achievements */}
      {playerScore.achievements.length > 0 && (
        <div className="flex items-center gap-1">
          {playerScore.achievements.slice(0, 3).map((achievement, index) => (
            <div
              key={achievement}
              className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
              title={achievement}
            >
              {index === 0 ? '🏆' : index === 1 ? '🌟' : '💎'}
            </div>
          ))}
          {playerScore.achievements.length > 3 && (
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
              +{playerScore.achievements.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}