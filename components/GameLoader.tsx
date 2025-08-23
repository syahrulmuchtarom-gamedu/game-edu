'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Game } from '@/utils/gameData';

// Dynamic imports for all games
const gameComponents = {
  'math-adventure': dynamic(() => import('@/app/games/math-adventure/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'memory-animals': dynamic(() => import('@/app/games/memory-animals/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'spelling-game': dynamic(() => import('@/app/games/spelling-game/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'color-patterns': dynamic(() => import('@/app/games/color-patterns/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'count-fruits': dynamic(() => import('@/app/games/count-fruits/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'interactive-story': dynamic(() => import('@/app/games/interactive-story/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'traditional-houses': dynamic(() => import('@/app/games/traditional-houses/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'dental-health': dynamic(() => import('@/app/games/dental-health/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'moon-phases': dynamic(() => import('@/app/games/moon-phases/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'emotion-guess': dynamic(() => import('@/app/games/emotion-guess/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'story-sequence': dynamic(() => import('@/app/games/story-sequence/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'learn-clock': dynamic(() => import('@/app/games/learn-clock/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'math-balance': dynamic(() => import('@/app/games/math-balance/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'puzzle-game': dynamic(() => import('@/app/games/puzzle-game/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'sports-health': dynamic(() => import('@/app/games/sports-health/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'calendar-date': dynamic(() => import('@/app/games/calendar-date/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'shape-guess': dynamic(() => import('@/app/games/shape-guess/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'color-mixing': dynamic(() => import('@/app/games/color-mixing/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'countries-flags': dynamic(() => import('@/app/games/countries-flags/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'kids-science': dynamic(() => import('@/app/games/kids-science/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  }),
  'healthy-food': dynamic(() => import('@/app/games/healthy-food/page'), {
    loading: () => <GameLoadingSpinner />,
    ssr: false
  })
};

function GameLoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-4 mx-auto"></div>
        <div className="text-white text-xl font-bold">Loading Game...</div>
        <div className="text-white/80 text-sm mt-2">Memuat permainan...</div>
      </div>
    </div>
  );
}

interface GameLoaderProps {
  gameId: string;
}

export default function GameLoader({ gameId }: GameLoaderProps) {
  const GameComponent = gameComponents[gameId as keyof typeof gameComponents];
  
  if (!GameComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold mb-2">Game Belum Tersedia</h2>
          <p className="text-white/80">Game ini sedang dalam pengembangan</p>
        </div>
      </div>
    );
  }

  return <GameComponent />;
}