'use client';

import { useEffect, useState } from 'react';

interface AnimatedFeedbackProps {
  type: 'success' | 'error' | 'score';
  message?: string;
  score?: number;
  show: boolean;
  onComplete?: () => void;
}

export default function AnimatedFeedback({
  type,
  message,
  score,
  show,
  onComplete
}: AnimatedFeedbackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  const getContent = () => {
    switch (type) {
      case 'success':
        return {
          emoji: '🎉',
          text: message || 'Benar! Hebat!',
          bgColor: 'from-green-400 to-emerald-500',
          animation: 'celebrate'
        };
      case 'error':
        return {
          emoji: '😅',
          text: message || 'Coba lagi ya!',
          bgColor: 'from-red-400 to-pink-500',
          animation: 'shake'
        };
      case 'score':
        return {
          emoji: '⭐',
          text: `+${score} poin!`,
          bgColor: 'from-yellow-400 to-orange-500',
          animation: 'score-animation'
        };
      default:
        return {
          emoji: '🎮',
          text: message || '',
          bgColor: 'from-blue-400 to-purple-500',
          animation: ''
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`
          bg-gradient-to-r ${content.bgColor} text-white px-8 py-4 rounded-2xl shadow-2xl
          flex items-center gap-4 text-xl font-bold transform transition-all duration-500
          ${content.animation} ${visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        `}
      >
        <span className="text-3xl">{content.emoji}</span>
        <span>{content.text}</span>
      </div>
    </div>
  );
}