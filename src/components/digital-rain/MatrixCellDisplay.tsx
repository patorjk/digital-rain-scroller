import { BASE_FONT_SIZE } from '@/components/digital-rain/DigitalRain.tsx';
import { getCellColor } from '@/components/digital-rain/color-cache.ts';
import { memo } from 'react';

interface MatrixCellDisplayProps {
  cellText: string;
  rainLength: number;
  rainPosition: number;
  rainFrame: number;
}

export const MatrixCellDisplay = memo(function MatrixCellDisplay({
  cellText,
  rainLength,
  rainPosition,
}: MatrixCellDisplayProps) {
  return (
    <div
      style={{
        width: `${BASE_FONT_SIZE - 2}px`,
        display: 'flex',
        justifyContent: 'center',
        color: getCellColor(rainLength, rainPosition),
      }}
    >
      {cellText}
    </div>
  );
});
