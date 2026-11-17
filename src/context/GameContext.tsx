import React, { createContext, useContext, useReducer } from 'react';
import {
  DIFFICULTY_CONFIGS,
  TOTAL_STIMULI_COUNT,
} from '../logic/colors';
import { calculateTestMetrics } from '../logic/metricsCalculator';
import { generateStimulusSequence } from '../logic/stimulusGenerator';
import type {
  DifficultyLevel,
  GameStage,
  ResponseRecord,
  Stimulus,
  TestMetrics,
} from '../types/game';

export const MAX_ERRORS = 3;

interface GameState {
  stage: GameStage;
  difficulty: DifficultyLevel;
  stimuli: Stimulus[];
  currentIndex: number;
  errorCount: number;
  records: ResponseRecord[];
  sessionStartTime: number;
  stimulusStartTime: number;
  metrics: TestMetrics | null;
}

type GameAction =
  | { type: 'START_GAME'; difficulty: DifficultyLevel }

  | { type: 'ANSWER'; isMatchAnswer: boolean }
  | { type: 'SESSION_TIMEOUT' }
  | { type: 'RESET_TO_MENU' };

const initialState: GameState = {
  stage: 'menu',
  difficulty: 'easy',
  stimuli: [],
  currentIndex: 0,
  errorCount: 0,
  records: [],
  sessionStartTime: 0,
  stimulusStartTime: 0,
  metrics: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const config = DIFFICULTY_CONFIGS[action.difficulty];
      const stimuli = generateStimulusSequence(TOTAL_STIMULI_COUNT, config);
      const now = performance.now();

      return {
        stage: 'playing',
        difficulty: action.difficulty,
        stimuli,
        currentIndex: 0,
        errorCount: 0,
        records: [],
        sessionStartTime: now,
        stimulusStartTime: now,
        metrics: null,
      };
    }

    case 'ANSWER': {
      if (state.stage !== 'playing') return state;

      const currentStimulus = state.stimuli[state.currentIndex];
      const now = performance.now();
      const reactionTimeMs = Math.max(1, Math.round(now - state.stimulusStartTime));
      const isCorrect = action.isMatchAnswer === currentStimulus.isCongruent;

      const newRecord: ResponseRecord = {
        stimulusId: currentStimulus.id,
        word: currentStimulus.word,
        inkColorLabel: currentStimulus.inkColor.label,
        userAnsweredMatch: action.isMatchAnswer,
        isCorrect,
        isCongruent: currentStimulus.isCongruent,
        reactionTimeMs,
        isTimeout: false,
      };

      const updatedRecords = [...state.records, newRecord];
      const newErrorCount = isCorrect ? state.errorCount : state.errorCount + 1;
      const nextIndex = state.currentIndex + 1;

      if (newErrorCount >= MAX_ERRORS || nextIndex >= state.stimuli.length) {
        return {
          ...state,
          stage: 'results',
          errorCount: newErrorCount,
          records: updatedRecords,
          metrics: calculateTestMetrics(updatedRecords),
        };
      }

      return {
        ...state,
        currentIndex: nextIndex,
        errorCount: newErrorCount,
        records: updatedRecords,
        stimulusStartTime: now,
      };
    }

    case 'SESSION_TIMEOUT': {
      if (state.stage !== 'playing') return state;

      const remainingStimuli = state.stimuli.slice(state.currentIndex);
      const timeoutRecords: ResponseRecord[] = remainingStimuli.map((stim) => ({
        stimulusId: stim.id,
        word: stim.word,
        inkColorLabel: stim.inkColor.label,
        userAnsweredMatch: null,
        isCorrect: false,
        isCongruent: stim.isCongruent,
        reactionTimeMs: 0,
        isTimeout: true,
      }));

      const finalRecords = [...state.records, ...timeoutRecords];

      return {
        ...state,
        stage: 'results',
        records: finalRecords,
        metrics: calculateTestMetrics(finalRecords),
      };
    }

    case 'RESET_TO_MENU':
      return initialState;

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame должен использоваться внутри GameProvider');
  }
  return context;
}
