'use client';

import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';

export default function HealthyFood() {
  return (
    <GameLayout title="Makanan 4 Sehat 5 Sempurna" emoji="🥗">
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🥗</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Makanan 4 Sehat 5 Sempurna</h2>
        <p className="text-lg text-gray-600 mb-6">Game ini sedang dalam pengembangan!</p>
        <GameButton variant="secondary" size="lg" emoji="🚧">Segera Hadir</GameButton>
      </div>
    </GameLayout>
  );
}