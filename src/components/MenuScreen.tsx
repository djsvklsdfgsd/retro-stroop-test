import React from 'react';
import { Tv, Play, ShieldAlert, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import { DIFFICULTY_CONFIGS } from '../logic/colors';
import { useGame } from '../context/GameContext';
import type { DifficultyLevel } from '../types/game';

export const MenuScreen: React.FC = () => {
  const { dispatch } = useGame();

  const handleStart = (level: DifficultyLevel) => {
    dispatch({ type: 'START_GAME', difficulty: level });
  };

  const getIcon = (level: DifficultyLevel) => {
    switch (level) {
      case 'easy':
        return <Play size={22} />;
      case 'medium':
        return <Zap size={22} />;
      case 'hard':
        return <ShieldAlert size={22} />;
    }
  };

  return (
    <div className="screen-box">
      <div className="badge">
        <Tv size={18} />
        <span>СИГНАЛ АКТИВЕН // СЕРИЯ ИЗ 30 СТИМУЛОВ</span>
      </div>

      <h2 className="section-title">ИНСТРУКЦИЯ ОПЕРАТОРА</h2>
      <p className="instruction-text">
        Определите, совпадает ли <strong>значение слова</strong> с{' '}
        <strong>цветом шрифта</strong>:
      </p>

      <div className="sub-metrics" style={{ marginBottom: '20px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34c759' }}>
          <ArrowLeft size={18} /> <strong>Стрелка ВЛЕВО (←)</strong> — ДА (совпадает)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff3b30' }}>
          <strong>Стрелка ВПРАВО (→)</strong> — НЕТ (не совпадает) <ArrowRight size={18} />
        </span>
      </div>

      <div className="difficulty-grid">
        {(Object.keys(DIFFICULTY_CONFIGS) as DifficultyLevel[]).map((key) => {
          const cfg = DIFFICULTY_CONFIGS[key];
          return (
            <button
              key={cfg.id}
              className="difficulty-card"
              onClick={() => handleStart(cfg.id)}
            >
              <div className="difficulty-header">
                {getIcon(cfg.id)}
                <span>{cfg.title}</span>
              </div>
              <p className="difficulty-desc">{cfg.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
