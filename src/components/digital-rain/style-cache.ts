import { fadeColors, getCssRgbaColor, type RgbaColor } from 'color-fader';

interface CellStyle {
  color: string;
  shadow: string;
}
const StyleCache: CellStyle[][] = [];
const EMPTY_CELL: CellStyle = { color: '#000', shadow: 'none' };

// maps [a, b] to [c, d], ex: map [0, 0.5] and [1, 0]
function mapRangeClamped(
  x: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const t = Math.min(1, Math.max(0, (x - inMin) / (inMax - inMin)));
  return outMin + t * (outMax - outMin);
}

const getShadowFromPosition = (
  length: number,
  pos: number,
  rgba: RgbaColor,
) => {
  const ratio = pos / length;
  if (pos === 0) {
    return `0 0 4px rgba(255,255,255,0.9), 0 0 14px rgba(${rgba.r},${rgba.g},${rgba.b},0.9)`;
  } else if (ratio <= 0.75) {
    const radius = Math.ceil(mapRangeClamped(ratio, 0, 0.75, 1, 0) * 20);
    const alpha = mapRangeClamped(ratio, 0, 0.75, 0.9, 0);
    return `0 0 ${radius}px rgba(${rgba.r},${rgba.g},${rgba.b},${alpha})`;
  } else {
    return 'none';
  }
};

export function getCellData(length: number, pos: number) {
  if (length <= 0) return EMPTY_CELL;
  let styles = StyleCache[length];
  if (!styles) {
    const enhancer = 4;
    const faded = fadeColors(['#eee', '#0aff0a', '#000'], length + enhancer);
    faded.splice(1, enhancer);
    styles = faded.map((rgba, index) => ({
      color: getCssRgbaColor(rgba),
      shadow: getShadowFromPosition(length, index, rgba),
    }));
    StyleCache[length] = styles;
  }
  return styles[pos];
}
