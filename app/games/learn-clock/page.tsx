'use client';

import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';

export default function LearnClock() {
  return (
    <GameLayout title="Belajar Jam" emoji="🕐">
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🕐</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Belajar Membaca Jam
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Game ini sedang dalam pengembangan!
        </p>
        
        <div className="bg-blue-50 p-6 rounded-2xl max-w-md mx-auto">
          <h3 className="font-bold text-gray-800 mb-2">Fitur yang akan datang:</h3>
          <ul className="text-left text-gray-600 space-y-1">
            <li>• Jam analog interaktif</li>
            <li>• Latihan membaca waktu</li>
            <li>• Format 12 dan 24 jam</li>
            <li>• Mini games waktu</li>
          </ul>
        </div>

        <GameButton variant="secondary" size="lg" emoji="🚧">
          Segera Hadir
        </GameButton>
      </div>
    </GameLayout>
  );
}