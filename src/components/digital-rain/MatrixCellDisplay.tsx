import { BASE_FONT_SIZE } from '@/components/digital-rain/DigitalRain.tsx';
import type { CellRain } from '@/components/digital-rain/dr-utils.ts';
import { getCellColor } from '@/components/digital-rain/color-cache.ts';

interface MatrixCellDisplay {
  cellText: string;
  cellRain: CellRain;
}

export const MatrixCellDisplay = ({
  cellText,
  cellRain,
}: MatrixCellDisplay) => {
  return (
    <div
      style={{
        width: `${BASE_FONT_SIZE - 2}px`,
        display: 'flex',
        justifyContent: 'center',
        color: getCellColor(cellRain.length, cellRain.position),
      }}
    >
      {cellText}
    </div>
  );
};
