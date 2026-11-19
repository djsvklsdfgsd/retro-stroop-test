import type { ColorOption, DifficultyConfig, DifficultyLevel } from '../types/game';

export const COLOR_PALETTE: ColorOption[] = [
  // Первые 4 цвета (Канал 01)
  { id: 'red', label: 'КРАСНЫЙ', hex: '#ff3b30' },
  { id: 'blue', label: 'СИНИЙ', hex: '#007aff' },
  { id: 'green', label: 'ЗЕЛЕНЫЙ', hex: '#34c759' },
  { id: 'yellow', label: 'ЖЕЛТЫЙ', hex: '#ffcc00' },

  // +4 цвета = 8 цветов (Канал 02)
  { id: 'purple', label: 'ФИОЛЕТОВЫЙ', hex: '#af52de' },
  { id: 'cyan', label: 'ГОЛУБОЙ', hex: '#32ade6' },
  { id: 'orange', label: 'ОРАНЖЕВЫЙ', hex: '#ff9500' },
  { id: 'pink', label: 'РОЗОВЫЙ', hex: '#ff2d55' },

  // +8 цветов = 16 цветов (Канал 03)
  { id: 'white', label: 'БЕЛЫЙ', hex: '#ffffff' },
  { id: 'gray', label: 'СЕРЫЙ', hex: '#8e8e93' },
  { id: 'brown', label: 'КОРИЧНЕВЫЙ', hex: '#a2845e' },
  { id: 'teal', label: 'БИРЮЗОВЫЙ', hex: '#00c7be' },
  { id: 'lime', label: 'ЛАЙМОВЫЙ', hex: '#a8ff00' },
  { id: 'crimson', label: 'МАЛИНОВЫЙ', hex: '#d70040' },
  { id: 'indigo', label: 'ИНДИГО', hex: '#5856d6' },
  { id: 'gold', label: 'ЗОЛОТОЙ', hex: '#ffd60a' },
];

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    id: 'easy',
    title: 'КАНАЛ 01: БАЗОВЫЙ',
    description: '',
    colorCount: 4,
    totalSessionTimeMs: 30000,
    hasGlitches: false,
    invertControls: false,
  },
  medium: {
    id: 'medium',
    title: 'КАНАЛ 02: ПОМЕХИ',
    description: '',
    colorCount: 8,
    totalSessionTimeMs: 22000,
    hasGlitches: true,
    invertControls: false,
  },
  hard: {
    id: 'hard',
    title: 'КАНАЛ 03: ЭКСТРИМ',
    description: '',
    colorCount: 16,
    totalSessionTimeMs: 15000,
    hasGlitches: true,
    invertControls: false,
  },
};

export const TOTAL_STIMULI_COUNT = 30;
