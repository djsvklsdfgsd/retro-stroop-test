import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { MenuScreen } from './components/MenuScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultScreen';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

const MainRouter: React.FC = () => {
  const { state } = useGame();
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="crt-viewport" onMouseMove={handleMouseMove}>
      {/* Дугообразные линии кинескопа (SVG-сетка выпуклого экрана) */}
      <svg
        className="crt-curved-grid"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <path
          d="M 20,25 Q 500,-15 980,25 L 980,575 Q 500,615 20,575 Z"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="4"
        />
        <path
          d="M 0,100 Q 500,70 1000,100 M 0,200 Q 500,185 1000,200 M 0,300 L 1000,300 M 0,400 Q 500,415 1000,400 M 0,500 Q 500,530 1000,500"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Интерактивный электростатический блик под курсором (эффект стекла кинескопа) */}
      <div
        className="crt-static-cursor"
        style={{
          background: `radial-gradient(240px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(0, 210, 255, 0.14), rgba(255, 0, 128, 0.06) 45%, transparent 75%)`,
        }}
      />

      <div className="crt-scanlines-overlay" />
      <div className="crt-roll-bar" />
      <div className="crt-bulge-glass" />
      <div className="crt-curvature-vignette" />

      <ThemeToggle />

      <div className="app-wrapper">
        <header className="app-header">
          <div className="osd-top-row">
            <span>AV-1 // SIGNAL LOCKED</span>
            <span>FREQ: 174.80 MHz</span>
          </div>
          <h1>RETRO // STROOP-ТЕСТ</h1>
          <p className="subtitle">Когнитивный тренажер скорости реакции и внимания</p>
        </header>

        <main className="app-main">
          {state.stage === 'menu' && <MenuScreen />}
          {state.stage === 'playing' && <GameScreen />}
          {state.stage === 'results' && <ResultsScreen />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <MainRouter />
    </GameProvider>
  );
}

export default App;
