import { MatrixCellDisplay } from '@/components/digital-rain/MatrixCellDisplay.tsx';
import type { CellRain } from '@/components/digital-rain/dr-utils.ts';

interface MatrixRowProps {
  rowText: string[];
  rowRain: CellRain[];
}

export const MatrixRow = ({ rowText, rowRain }: MatrixRowProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {rowText.map((item: string, index: number) => (
        <MatrixCellDisplay
          cellText={item}
          cellRain={rowRain[index]}
          key={index}
        />
      ))}
    </div>
  );
};
