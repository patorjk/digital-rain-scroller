import {
  cssColorToRgba,
  fadeColors,
  getCssRgbaColor,
  type RgbaColor,
} from 'color-fader';
import { MATRIX_GREEN } from '@/components/controls/basic-utils.ts';

interface GlowLayer {
  blur: number;
  color: string;
}
interface CellStyle {
  color: string;
  glow: GlowLayer[];
}
const StyleCache: CellStyle[][] = [];
const EMPTY_CELL: CellStyle = { color: '#000', glow: [] };

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

export function brighten(hex: string, brightness: number): string {
  let { r, g, b, a } = cssColorToRgba(hex);

  r = r / 255;
  g = g / 255;
  b = b / 255;

  // RGB to HSL
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let l = (max + min) / 2,
    s = 0,
    hue = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    hue =
      max === r
        ? ((g - b) / d) % 6
        : max === g
          ? (b - r) / d + 2
          : (r - g) / d + 4;
    hue = (hue * 60 + 360) % 360;
  }

  // Increase lightness by brightness percent (relative), clamped to [0, 1]
  l = Math.min(1, Math.max(0, l * (1 + brightness / 100)));

  // HSL to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] =
    hue < 60
      ? [c, x, 0]
      : hue < 120
        ? [x, c, 0]
        : hue < 180
          ? [0, c, x]
          : hue < 240
            ? [0, x, c]
            : hue < 300
              ? [x, 0, c]
              : [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return a !== 1
    ? `#${toHex(r1)}${toHex(g1)}${toHex(b1)}${a}`
    : `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}

const getGlowFromPosition = (
  length: number,
  pos: number,
  rgba: RgbaColor,
): GlowLayer[] => {
  const ratio = pos / length;
  if (pos === 0) {
    return [
      { blur: 14, color: `rgba(${rgba.r},${rgba.g},${rgba.b},0.9)` },
      { blur: 4, color: 'rgba(255,255,255,0.9)' },
    ];
  } else if (ratio <= 0.75) {
    const blur = Math.ceil(mapRangeClamped(ratio, 0, 0.75, 1, 0) * 20);
    const alpha = mapRangeClamped(ratio, 0, 0.75, 0.9, 0);
    return [{ blur, color: `rgba(${rgba.r},${rgba.g},${rgba.b},${alpha})` }];
  }
  return [];
};

export function getCellData(
  length: number,
  pos: number,
  color: string = MATRIX_GREEN,
) {
  if (length <= 0) return EMPTY_CELL;
  let styles = StyleCache[length];
  if (!styles) {
    const enhancer = 4;
    const faded = fadeColors(
      [brighten(color, 100), color, '#000'],
      length + enhancer,
    );

    faded.splice(1, enhancer);
    styles = faded.map((rgba, index) => ({
      color: getCssRgbaColor(rgba),
      glow: getGlowFromPosition(length, index, rgba),
    }));
    StyleCache[length] = styles;
  }
  return styles[pos];
}
