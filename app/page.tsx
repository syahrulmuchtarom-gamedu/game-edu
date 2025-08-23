'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { games, Game } from '@/utils/gameData';
import { getExtendedGameData } from '@/utils/gameDataSplit';
import { getPlayerScore, PlayerScore } from '@/utils/scoreUtils';
import ScoreTracker from '@/components/ScoreTracker';
import LazyGameCard from '@/components/LazyGameCard';
import CriticalCSS from '@/components/CriticalCSS';
import ResourcePreloader from '@/components/ResourcePreloader';
import { useMemoryOptimization } from '@/hooks/useMemoryOptimization';
import { measurePerformance, monitorFPS } from '@/utils/performance';

export default function HomePage() {
  const [playerScore, setPlayerScore] = useState<PlayerScore | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [allGames, setAllGames] = useState<Game[]>(games);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const GAMES_PER_PAGE = 6;
  
  // Memory optimization
  useMemoryOptimization();

  useEffect(() => {
    setMounted(true);
    setPlayerScore(getPlayerScore());
    
    // Games are already loaded from import, no need for lazy loading
    setIsLoadingMore(false);
    
    // Performance monitoring (development only)
    if (process.env.NODE_ENV === 'development') {
      measurePerformance();
      monitorFPS();
    }
  }, []);

  const filteredGames = allGames.filter(game => selectedCategory === 'all' || game.category === selectedCategory);
  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
  const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
  const currentGames = filteredGames.slice(startIndex, startIndex + GAMES_PER_PAGE);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <CriticalCSS />
      <ResourcePreloader />
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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-blue-100'
            }`}
          >
            Semua ({allGames.length})
          </button>
          {Array.from(new Set(allGames.map(g => g.category))).map(category => {
            const count = allGames.filter(g => g.category === category).length;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-100'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentGames.map((game) => (
            <LazyGameCard
              key={game.id}
              game={game}
              playerScore={playerScore}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white text-gray-600 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 transition-all"
            >
              ← Sebelumnya
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full font-semibold transition-all ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-blue-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white text-gray-600 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 transition-all"
            >
              Selanjutnya →
            </button>
          </div>
        )}

        {/* Page Info */}
        <div className="text-center mt-4 text-white/80">
          <p className="text-sm">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + GAMES_PER_PAGE, filteredGames.length)} dari {filteredGames.length} game
            {selectedCategory !== 'all' && ` dalam kategori ${selectedCategory}`}
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mt-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-white">
            <div>
              <div className="text-3xl font-bold">{allGames.length}</div>
              <div className="text-sm opacity-80">Total Game</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{Array.from(new Set(allGames.map(g => g.category))).length}</div>
              <div className="text-sm opacity-80">Kategori</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{playerScore?.gamesPlayed || 0}</div>
              <div className="text-sm opacity-80">Dimainkan</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{playerScore?.totalPoints || 0}</div>
              <div className="text-sm opacity-80">Total Poin</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80">
          <p className="text-lg font-semibold mb-2">
            Selamat belajar dan bermain! 🌟
          </p>
          <p className="text-sm">
            30 Game Edukasi untuk anak-anak usia 6-12 tahun
          </p>
        </div>
      </div>
    </div>
    </>
  );
}