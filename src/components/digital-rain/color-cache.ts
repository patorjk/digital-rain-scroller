import { fadeColors, getCssRgbaColor } from 'color-fader';

const ColorCache: string[][] = [];

export function getCellColor(length: number, index: number) {
  if (ColorCache[length]) {
    return ColorCache[length][index];
  } else if (length > 0) {
    const colors = ['#ccffcc', '#0aff0a', '#000'];
    ColorCache[length] = fadeColors(colors, length).map((color) =>
      getCssRgbaColor(color),
    );
    return ColorCache[length][index];
  } else {
    return '#000';
  }
}
