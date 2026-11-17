import type { ResponseRecord, TestMetrics } from '../types/game';

export function calculateTestMetrics(records: ResponseRecord[]): TestMetrics {
  const totalStimuli = records.length;

  if (totalStimuli === 0) {
    return {
      totalStimuli: 0,
      correctCount: 0,
      errorCount: 0,
      accuracyPercent: 0,
      averageReactionTimeMs: 0,
      congruentAvgTimeMs: 0,
      incongruentAvgTimeMs: 0,
      interferenceIndexMs: 0,
    };
  }

  const correctRecords = records.filter((r) => r.isCorrect);
  const answeredRecords = records.filter((r) => !r.isTimeout);
  const correctCount = correctRecords.length;
  const errorCount = totalStimuli - correctCount;
  const accuracyPercent = Math.round((correctCount / totalStimuli) * 100);

  const avg = (arr: ResponseRecord[]) => {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, item) => acc + item.reactionTimeMs, 0);
    return Math.round(sum / arr.length);
  };

  const averageReactionTimeMs = avg(answeredRecords);
  const congruentRecords = correctRecords.filter((r) => r.isCongruent);
  const incongruentRecords = correctRecords.filter((r) => !r.isCongruent);

  const congruentAvgTimeMs = avg(congruentRecords);
  const incongruentAvgTimeMs = avg(incongruentRecords);

  const interferenceIndexMs =
    congruentAvgTimeMs > 0 && incongruentAvgTimeMs > 0
      ? incongruentAvgTimeMs - congruentAvgTimeMs
      : 0;

  return {
    totalStimuli,
    correctCount,
    errorCount,
    accuracyPercent,
    averageReactionTimeMs,
    congruentAvgTimeMs,
    incongruentAvgTimeMs,
    interferenceIndexMs,
  };
}
