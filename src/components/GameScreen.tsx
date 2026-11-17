import React, { useEffect, useState } from 'react';
import { MAX_ERRORS, useGame } from '../context/GameContext';
import { DIFFICULTY_CONFIGS } from '../logic/colors';

export const GameScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const currentStimulus = state.stimuli[state.currentIndex];
  const config = DIFFICULTY_CONFIGS[state.difficulty];
  const [timeLeftMs, setTimeLeftMs] = useState(config.totalSessionTimeMs);
  const [feedback, setFeedback] = useState<{
    key: 'left' | 'right';
    isCorrect: boolean;
  } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = performance.now() - state.sessionStartTime;
      const remaining = Math.max(0, config.totalSessionTimeMs - elapsed);
      setTimeLeftMs(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        dispatch({ type: 'SESSION_TIMEOUT' });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [state.sessionStartTime, config.totalSessionTimeMs, dispatch]);

  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(null), 180);
    return () => clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentStimulus) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const isCorrect = currentStimulus.isCongruent === true;
        setFeedback({ key: 'left', isCorrect });
        dispatch({ type: 'ANSWER', isMatchAnswer: true });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const isCorrect = currentStimulus.isCongruent === false;
        setFeedback({ key: 'right', isCorrect });
        dispatch({ type: 'ANSWER', isMatchAnswer: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStimulus, dispatch]);

  if (!currentStimulus) return null;

  const progressPercent = (timeLeftMs / config.totalSessionTimeMs) * 100;
  const livesLeft = Math.max(0, MAX_ERRORS - state.errorCount);
  const lifeColors = ['#ff3b30', '#34c759', '#007aff'];

  const getHintStyle = (side: 'left' | 'right'): React.CSSProperties => {
    const isActive = feedback?.key === side;
    if (!isActive) {
      return {
        color: 'var(--text-muted)',
        transition: 'color 0.15s ease, text-shadow 0.15s ease',
      };
    }

    const activeColor = feedback.isCorrect ? '#34c759' : '#ff3b30';
    return {
      color: activeColor,
      textShadow: `0 0 12px ${feedback.isCorrect ? 'rgba(52, 199, 89, 0.65)' : 'rgba(255, 59, 48, 0.65)'}`,
      transition: 'color 0.05s ease, text-shadow 0.05s ease',
    };
  };

  return (
    <div className="screen-box">
      <div className="hud-bar">
        <div className="hud-item">
          <span>
            КАДР: #{String(state.currentIndex + 1).padStart(2, '0')} / {state.stimuli.length}
          </span>
        </div>

        <div className="hud-item rgb-lives" title="Оставшиеся попытки">
          {Array.from({ length: MAX_ERRORS }).map((_, idx) => (
            <span
              key={idx}
              style={{
                color: idx < livesLeft ? lifeColors[idx] : 'var(--border-color)',
                opacity: idx < livesLeft ? 1 : 0.35,
                fontSize: '1.5rem',
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              +
            </span>
          ))}
        </div>

        <div className="hud-item">
          <span>{(timeLeftMs / 1000).toFixed(1)} сек</span>
        </div>
      </div>

      <div className="timer-track">
        <div
          className="timer-fill"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: progressPercent < 25 ? '#ff3b30' : '#34c759',
          }}
        />
      </div>

      <div
        key={currentStimulus.id}
        className={`crt-display tv-bump glitch-${currentStimulus.glitchType}`}
      >
        <span
          className="stimulus-word"
          style={{
            color: currentStimulus.inkColor.hex,
          }}
        >
          {currentStimulus.word}
        </span>
      </div>

      <div className="soft-hints">
        <span style={getHintStyle('left')}>[ ← ДА ]</span>
        <span> &nbsp;&nbsp;&bull;&nbsp;&nbsp; </span>
        <span style={getHintStyle('right')}>[ НЕТ → ]</span>
      </div>
    </div>
  );
};
