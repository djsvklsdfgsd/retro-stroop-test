export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type GameStage = 'menu' | 'playing' | 'results';

export type GlitchType = 'none' | 'shake' | 'flicker' | 'roll';

export interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

export interface Stimulus {
  id: number;
  word: string;
  inkColor: ColorOption;
  isCongruent: boolean;
  glitchType: GlitchType;
}

export interface ResponseRecord {
  stimulusId: number;
  word: string;
  inkColorLabel: string;
  userAnsweredMatch: boolean | null;
  isCorrect: boolean;
  isCongruent: boolean;
  reactionTimeMs: number;
  isTimeout: boolean;
}

export interface TestMetrics {
  totalStimuli: number;
  correctCount: number;
  errorCount: number;
  accuracyPercent: number;
  averageReactionTimeMs: number;
  congruentAvgTimeMs: number;
  incongruentAvgTimeMs: number;
  interferenceIndexMs: number;
}

export interface DifficultyConfig {
  id: DifficultyLevel;
  title: string;
  description: string;
  colorCount: number;
  totalSessionTimeMs: number;
  hasGlitches: boolean;
  invertControls: boolean;
}
