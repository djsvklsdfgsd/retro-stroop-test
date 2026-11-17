import type { ColorOption, DifficultyConfig, DifficultyLevel } from '../types/game';

export const COLOR_PALETTE: ColorOption[] = [
  { id: 'red', label: 'КРАСНЫЙ', hex: '#ff3b30' },
  { id: 'blue', label: 'СИНИЙ', hex: '#007aff' },
  { id: 'green', label: 'ЗЕЛЁНЫЙ', hex: '#34c759' },
  { id: 'yellow', label: 'ЖЁЛТЫЙ', hex: '#ffcc00' },
  { id: 'purple', label: 'ФИОЛЕТОВЫЙ', hex: '#af52de' },
  { id: 'cyan', label: 'ГОЛУБОЙ', hex: '#32ade6' },
];

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    id: 'easy',
    title: 'КАНАЛ 01: БАЗОВЫЙ',
    description: '4 цвета, 30 кадров за 30 секунд',
    colorCount: 4,
    totalSessionTimeMs: 30000,
    hasGlitches: false,
    invertControls: false,
  },
  medium: {
    id: 'medium',
    title: 'КАНАЛ 02: ПОМЕХИ',
    description: '6 цветов, помехи экрана, 30 кадров за 22 секунды',
    colorCount: 6,
    totalSessionTimeMs: 22000,
    hasGlitches: true,
    invertControls: false,
  },
  hard: {
    id: 'hard',
    title: 'КАНАЛ 03: ЭКСТРИМ',
    description: '6 цветов, жёсткие сбои развёртки, 30 кадров за 15 секунд',
    colorCount: 6,
    totalSessionTimeMs: 15000,
    hasGlitches: true,
    invertControls: false,
  },
};

export const TOTAL_STIMULI_COUNT = 30;
