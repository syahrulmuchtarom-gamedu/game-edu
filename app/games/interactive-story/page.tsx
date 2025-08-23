'use client';

import { useState } from 'react';
import GameLayout from '@/components/GameLayout';
import GameButton from '@/components/GameButton';
import { storyData } from '@/utils/gameData';
import { updatePlayerScore } from '@/utils/scoreUtils';

type SceneKey = 'start' | 'left' | 'right' | 'carrot' | 'polite' | 'butterfly' | 'flower';

export default function InteractiveStory() {
  const [currentScene, setCurrentScene] = useState<SceneKey>('start');
  const [storyPath, setStoryPath] = useState<string[]>(['start']);
  const [gameStarted, setGameStarted] = useState(false);

  const startStory = () => {
    setGameStarted(true);
    setCurrentScene('start');
    setStoryPath(['start']);
  };

  const makeChoice = (nextScene: string) => {
    const newPath = [...storyPath, nextScene];
    setStoryPath(newPath);
    
    if (nextScene === 'start') {
      // Restart story
      setCurrentScene('start');
      setStoryPath(['start']);
    } else {
      setCurrentScene(nextScene as SceneKey);
    }

    // Award points for completing story paths
    if (['carrot', 'polite', 'butterfly', 'flower'].includes(nextScene)) {
      updatePlayerScore({
        gameId: 'interactive-story',
        score: 25,
        timeSpent: 0,
        completed: true,
        attempts: 1
      });
    }
  };

  const getCurrentScene = () => {
    if (currentScene === 'start') {
      return storyData.start;
    }
    return storyData.scenes[currentScene];
  };

  const getSceneEmoji = (scene: SceneKey) => {
    const emojis = {
      start: '🌟',
      left: '🌲',
      right: '🌸',
      carrot: '🥕',
      polite: '✨',
      butterfly: '🦋',
      flower: '🌸'
    };
    return emojis[scene] || '📖';
  };

  if (!gameStarted) {
    return (
      <GameLayout title="Cerita Interaktif" emoji="📚">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Petualangan di Hutan Ajaib
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Pilih jalanmu sendiri dalam cerita yang menarik!
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-4xl mb-4">🏰</div>
            <h3 className="font-bold text-gray-800 mb-2">Tentang Cerita:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Cerita interaktif dengan pilihan</li>
              <li>• Setiap pilihan membawa ke petualangan berbeda</li>
              <li>• Pelajari nilai-nilai moral yang baik</li>
              <li>• Dapat dimainkan berulang kali</li>
            </ul>
          </div>

          <GameButton onClick={startStory} variant="primary" size="lg" emoji="📖">
            Mulai Cerita
          </GameButton>
        </div>
      </GameLayout>
    );
  }

  const scene = getCurrentScene();

  return (
    <GameLayout title="Cerita Interaktif" emoji="📚">
      <div className="space-y-6">
        {/* Story Progress */}
        <div className="bg-blue-50 p-4 rounded-2xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">📍</span>
            <span className="font-semibold text-gray-800">Perjalanan Cerita</span>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {storyPath.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <span>{getSceneEmoji(step as SceneKey)}</span>
                  <span className="capitalize">{step}</span>
                </div>
                {index < storyPath.length - 1 && (
                  <span className="mx-2 text-gray-400">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Story Content */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{getSceneEmoji(currentScene)}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {currentScene === 'start' ? storyData.title : 'Petualangan Berlanjut...'}
            </h2>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              {scene.text}
            </p>
          </div>

          {/* Story Choices */}
          <div className="space-y-4">
            <p className="text-center font-semibold text-gray-800 mb-4">
              Apa yang akan kamu lakukan?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scene.choices.map((choice, index) => (
                <GameButton
                  key={index}
                  onClick={() => makeChoice(choice.next)}
                  variant={choice.next === 'start' ? 'secondary' : 'primary'}
                  size="lg"
                  className="text-left justify-start h-auto py-4"
                >
                  <div className="text-center w-full">
                    <div className="text-lg font-semibold">{choice.text}</div>
                  </div>
                </GameButton>
              ))}
            </div>
          </div>
        </div>

        {/* Story Endings Info */}
        {['carrot', 'polite', 'butterfly', 'flower'].includes(currentScene) && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold mb-2">Cerita Selesai!</h3>
            <p className="text-sm opacity-90">+25 poin untuk menyelesaikan petualangan!</p>
            <div className="mt-4">
              <p className="text-sm">
                <strong>Pesan Moral:</strong> {
                  currentScene === 'carrot' ? 'Keberanian membawa keajaiban!' :
                  currentScene === 'polite' ? 'Kesopanan selalu dihargai!' :
                  currentScene === 'butterfly' ? 'Bermain dengan alam itu indah!' :
                  'Kebaikan hati mendatangkan keajaiban!'
                }
              </p>
            </div>
          </div>
        )}

        {/* Story Statistics */}
        <div className="bg-gray-50 p-4 rounded-2xl">
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-2">Statistik Petualangan</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded-xl">
                <div className="text-2xl mb-1">🎯</div>
                <div className="font-semibold">Pilihan Dibuat</div>
                <div className="text-gray-600">{storyPath.length - 1}</div>
              </div>
              <div className="bg-white p-3 rounded-xl">
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-semibold">Ending Dicapai</div>
                <div className="text-gray-600">
                  {['carrot', 'polite', 'butterfly', 'flower'].includes(currentScene) ? 'Ya' : 'Belum'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}