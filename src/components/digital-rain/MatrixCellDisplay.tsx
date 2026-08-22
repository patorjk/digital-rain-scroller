import type { MatrixCell } from '@/components/digital-rain/dr-utils.ts';
import { BASE_SIZE } from '@/components/digital-rain/DigitalRain.tsx';

interface MatrixCellDisplay {
  cell: MatrixCell;
}

export const MatrixCellDisplay = ({ cell }: MatrixCellDisplay) => {
  return (
    <div
      style={{
        width: `${BASE_SIZE}px`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {cell.char}
    </div>
  );
};
