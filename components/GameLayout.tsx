'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface GameLayoutProps {
  children: ReactNode;
  title: string;
  emoji: string;
  onBack?: () => void;
}

export default function GameLayout({ children, title, emoji, onBack }: GameLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-white/30 hover:bg-white/40 px-4 py-2 rounded-xl transition-all duration-200 touch-target"
          >
            <span className="text-2xl">🏠</span>
            <span className="font-semibold text-white hidden sm:inline">Beranda</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-4xl">{emoji}</span>
            <h1 className="text-xl sm:text-2xl font-bold text-white text-center">
              {title}
            </h1>
          </div>
          
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/30 hover:bg-white/40 px-4 py-2 rounded-xl transition-all duration-200 touch-target"
          >
            <span className="text-2xl">🎮</span>
            <span className="font-semibold text-white hidden sm:inline">Menu</span>
          </Link>
        </div>

        {/* Game Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}