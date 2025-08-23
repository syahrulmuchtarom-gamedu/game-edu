'use client';

import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';

export default function ShapeGuess() {
  return (
    <GameLayout title="Tebak Bentuk" emoji="🔺">
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🔺</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tebak Bentuk Geometri</h2>
        <p className="text-lg text-gray-600 mb-6">Game ini sedang dalam pengembangan!</p>
        <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
          <h3 className="font-bold text-gray-800 mb-2">Fitur yang akan datang:</h3>
          <ul className="text-left text-gray-600 space-y-1">
            <li>• Pengenalan bentuk 2D dan 3D</li>
            <li>• Drag and drop interaktif</li>
            <li>• Pembelajaran sifat bentuk</li>
          </ul>
        </div>
        <GameButton variant="secondary" size="lg" emoji="🚧">Segera Hadir</GameButton>
      </div>
    </GameLayout>
  );
}