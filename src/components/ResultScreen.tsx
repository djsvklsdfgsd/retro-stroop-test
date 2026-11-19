import React, { useState } from 'react';
import { RotateCcw, BarChart3, CheckCircle2, XCircle, Clock, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useGame } from '../context/GameContext';

export const ResultsScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showChart, setShowChart] = useState(true);

  if (!state.metrics) return null;

  const {
    totalStimuli,
    correctCount,
    errorCount,
    accuracyPercent,
    averageReactionTimeMs,
    congruentAvgTimeMs,
    incongruentAvgTimeMs,
    interferenceIndexMs,
  } = state.metrics;

  const chartData = state.records.map((rec) => ({
    name: `#${rec.stimulusId}`,
    reactionTime: rec.reactionTimeMs,
    avgLine: averageReactionTimeMs,
    type: rec.isCongruent ? 'Совпадение' : 'Конфликт',
  }));

  return (
    <div className="screen-box">
      <h2 className="section-title">ОТЧЕТ ПО КОГНИТИВНОМУ ТЕСТУ</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <Clock size={20} />
          <span className="metric-label">Среднее время реакции</span>
          <span className="metric-value">{averageReactionTimeMs} мс</span>
        </div>

        <div className="metric-card">
          <Activity size={20} />
          <span className="metric-label">Индекс интерференции</span>
          <span className="metric-value">
            {interferenceIndexMs > 0 ? `+${interferenceIndexMs}` : interferenceIndexMs} мс
          </span>
        </div>

        <div className="metric-card">
          <CheckCircle2 size={20} color="#34c759" />
          <span className="metric-label">Точность ответов</span>
          <span className="metric-value">
            {accuracyPercent}% ({correctCount}/{totalStimuli})
          </span>
        </div>

        <div className="metric-card">
          <XCircle size={20} color="#ff3b30" />
          <span className="metric-label">Количество ошибок</span>
          <span className="metric-value">{errorCount}</span>
        </div>
      </div>

      <div className="sub-metrics">
        <span>Конгруэнтные стимулы (средн.): <strong>{congruentAvgTimeMs} мс</strong></span>
        <span>Неконгруэнтные стимулы (средн.): <strong>{incongruentAvgTimeMs} мс</strong></span>
      </div>

      <div className="actions-row">
        <button
          className="action-btn primary"
          onClick={() => dispatch({ type: 'RESET_TO_MENU' })}
        >
          <RotateCcw size={18} />
          <span>Пройти заново</span>
        </button>

        <button
          className="action-btn secondary"
          onClick={() => setShowChart(!showChart)}
        >
          <BarChart3 size={18} />
          <span>{showChart ? 'Скрыть график' : 'Показать график'}</span>
        </button>
      </div>

      {showChart && (
        <div className="chart-container">
          <h3>Распределение времени реакции по стимулам (мс)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#555', color: '#fff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="reactionTime"
                name="Время реакции (мс)"
                stroke="#007aff"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="avgLine"
                name="Среднее время (мс)"
                stroke="#ff9500"
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
