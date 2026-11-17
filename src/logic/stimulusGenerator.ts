import type { ColorOption, DifficultyConfig, GlitchType, Stimulus } from '../types/game';
import { COLOR_PALETTE } from './colors';

export function getAvailableColors(colorCount: number): ColorOption[] {
  return COLOR_PALETTE.slice(0, Math.min(colorCount, COLOR_PALETTE.length));
}

const GLITCH_TYPES: GlitchType[] = ['shake', 'flicker', 'roll'];

export function generateSingleStimulus(
  id: number,
  colors: ColorOption[],
  forceCongruent?: boolean,
  hasGlitches = false
): Stimulus {
  const isCongruent =
    forceCongruent !== undefined ? forceCongruent : Math.random() < 0.5;

  const inkIndex = Math.floor(Math.random() * colors.length);
  const inkColor = colors[inkIndex];

  let wordColor = inkColor;
  if (!isCongruent && colors.length > 1) {
    const otherColors = colors.filter((c) => c.id !== inkColor.id);
    wordColor = otherColors[Math.floor(Math.random() * otherColors.length)];
  }

  let glitchType: GlitchType = 'none';
  if (hasGlitches && Math.random() < 0.45) {
    glitchType = GLITCH_TYPES[Math.floor(Math.random() * GLITCH_TYPES.length)];
  }

  return {
    id,
    word: wordColor.label,
    inkColor,
    isCongruent,
    glitchType,
  };
}

export function generateStimulusSequence(
  count: number,
  config: DifficultyConfig
): Stimulus[] {
  const availableColors = getAvailableColors(config.colorCount);
  const sequence: Stimulus[] = [];

  for (let i = 1; i <= count; i++) {
    sequence.push(
      generateSingleStimulus(i, availableColors, undefined, config.hasGlitches)
    );
  }

  return sequence;
}
