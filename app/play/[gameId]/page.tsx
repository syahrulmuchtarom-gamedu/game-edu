import GameLoader from '@/components/GameLoader';
import { games } from '@/utils/gameData';

interface PlayGamePageProps {
  params: { gameId: string };
}

export default async function PlayGamePage({ params }: PlayGamePageProps) {
  const { gameId } = await params;
  
  // Validate game exists
  const game = games.find(g => g.id === gameId);
  
  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Game Tidak Ditemukan</h2>
          <p className="text-white/80 mb-4">Game dengan ID "{gameId}" tidak tersedia</p>
          <a 
            href="/" 
            className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-all"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return <GameLoader gameId={gameId} />;
}