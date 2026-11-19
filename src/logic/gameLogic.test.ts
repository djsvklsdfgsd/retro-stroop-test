import { describe, expect, it } from 'vitest';
import { DIFFICULTY_CONFIGS, TOTAL_STIMULI_COUNT } from './colors';
import { calculateTestMetrics } from './metricsCalculator';
import {
  generateSingleStimulus,
  generateStimulusSequence,
  getAvailableColors,
} from './stimulusGenerator';
import type { ResponseRecord } from '../types/game';

describe('Модуль генерации стимулов (stimulusGenerator)', () => {
  it('должен генерировать ровно 30 стимулов для игровой сессии', () => {
    const sequence = generateStimulusSequence(
      TOTAL_STIMULI_COUNT,
      DIFFICULTY_CONFIGS.easy
    );
    expect(sequence).toHaveLength(30);
    expect(sequence.at(0)?.id).toBe(1);
    expect(sequence.at(-1)?.id).toBe(30);
  });

  it('должен создавать конгруэнтный стимул, где слово и цвет совпадают', () => {
    const colors = getAvailableColors(4);
    const stimulus = generateSingleStimulus(1, colors, true);
    expect(stimulus.isCongruent).toBe(true);
    expect(stimulus.word).toBe(stimulus.inkColor.label);
  });

  it('должен создавать неконгруэнтный стимул, где слово и цвет различаются', () => {
    const colors = getAvailableColors(4);
    const stimulus = generateSingleStimulus(1, colors, false);
    expect(stimulus.isCongruent).toBe(false);
    expect(stimulus.word).not.toBe(stimulus.inkColor.label);
  });
});

describe('Модуль расчета метрик (metricsCalculator)', () => {
  it('должен корректно вычислять среднее время реакции, ошибки и индекс интерференции', () => {
    const mockRecords: ResponseRecord[] = [
      {
        stimulusId: 1,
        word: 'ЗЕЛЕНЫЙ',
        inkColorLabel: 'ЗЕЛЕНЫЙ',
        userAnsweredMatch: true,
        isCorrect: true,
        isCongruent: true,
        reactionTimeMs: 480,
        isTimeout: false,
      },
      {
        stimulusId: 2,
        word: 'СИНИЙ',
        inkColorLabel: 'ЖЕЛТЫЙ',
        userAnsweredMatch: false,
        isCorrect: true,
        isCongruent: false,
        reactionTimeMs: 790,
        isTimeout: false,
      },
      {
        stimulusId: 3,
        word: 'КРАСНЫЙ',
        inkColorLabel: 'СИНИЙ',
        userAnsweredMatch: true,
        isCorrect: false,
        isCongruent: false,
        reactionTimeMs: 850,
        isTimeout: false,
      },
    ];

    const metrics = calculateTestMetrics(mockRecords);
    expect(metrics.totalStimuli).toBe(3);
    expect(metrics.correctCount).toBe(2);
    expect(metrics.errorCount).toBe(1);
    expect(metrics.accuracyPercent).toBe(67);
    expect(metrics.congruentAvgTimeMs).toBe(480);
    expect(metrics.incongruentAvgTimeMs).toBe(790);
    expect(metrics.interferenceIndexMs).toBe(310);
  });
});
