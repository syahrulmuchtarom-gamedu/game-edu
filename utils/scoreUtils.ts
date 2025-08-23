export interface PlayerScore {
  totalPoints: number;
  gamesPlayed: number;
  achievements: string[];
  lastPlayed: Date;
  gameScores: { [gameId: string]: number };
}

export interface GameSession {
  gameId: string;
  score: number;
  timeSpent: number;
  completed: boolean;
  attempts: number;
}

const STORAGE_KEY = 'educational-games-score';

export const getPlayerScore = (): PlayerScore => {
  if (typeof window === 'undefined') {
    return {
      totalPoints: 0,
      gamesPlayed: 0,
      achievements: [],
      lastPlayed: new Date(),
      gameScores: {}
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      totalPoints: 0,
      gamesPlayed: 0,
      achievements: [],
      lastPlayed: new Date(),
      gameScores: {}
    };
  }

  try {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      lastPlayed: new Date(parsed.lastPlayed)
    };
  } catch {
    return {
      totalPoints: 0,
      gamesPlayed: 0,
      achievements: [],
      lastPlayed: new Date(),
      gameScores: {}
    };
  }
};

export const updatePlayerScore = (session: GameSession): PlayerScore => {
  const currentScore = getPlayerScore();
  
  const newScore: PlayerScore = {
    ...currentScore,
    totalPoints: currentScore.totalPoints + session.score,
    gamesPlayed: currentScore.gamesPlayed + 1,
    lastPlayed: new Date(),
    gameScores: {
      ...currentScore.gameScores,
      [session.gameId]: Math.max(currentScore.gameScores[session.gameId] || 0, session.score)
    }
  };

  // Add achievements
  const newAchievements = [...currentScore.achievements];
  
  if (session.score >= 100 && !newAchievements.includes('first-100')) {
    newAchievements.push('first-100');
  }
  
  if (newScore.totalPoints >= 1000 && !newAchievements.includes('score-master')) {
    newAchievements.push('score-master');
  }
  
  if (newScore.gamesPlayed >= 5 && !newAchievements.includes('game-explorer')) {
    newAchievements.push('game-explorer');
  }

  if (session.completed && session.attempts === 1 && !newAchievements.includes('perfect-game')) {
    newAchievements.push('perfect-game');
  }

  newScore.achievements = newAchievements;

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newScore));
  }

  return newScore;
};

export const calculateScore = (correct: number, total: number, timeBonus: number = 0): number => {
  const baseScore = Math.round((correct / total) * 100);
  return Math.max(0, baseScore + timeBonus);
};

export const getAchievementTitle = (achievement: string): string => {
  const titles: { [key: string]: string } = {
    'first-100': '🌟 Skor Pertama 100!',
    'score-master': '🏆 Master Skor 1000!',
    'game-explorer': '🎮 Penjelajah Game!',
    'perfect-game': '💎 Permainan Sempurna!',
  };
  return titles[achievement] || achievement;
};

export const resetPlayerScore = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};