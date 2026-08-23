import { memo } from 'react';
import { CELL_WIDTH } from '@/components/digital-rain/dr-utils.ts';

interface MatrixCellDisplayProps {
  cellText: string;
  cellKey: number;
  setCellRef: (key: number, el: HTMLDivElement | null) => void;
}

export const MatrixCellDisplay = memo(function MatrixCellDisplay({
  cellText,
  cellKey,
  setCellRef,
}: MatrixCellDisplayProps) {
  return (
    <div
      ref={(el) => setCellRef(cellKey, el)}
      style={{
        width: `${CELL_WIDTH}px`,
        display: 'flex',
        justifyContent: 'center',
        color: '#000',
      }}
    >
      {cellText}
    </div>
  );
});
