import { MatrixCellDisplay } from '@/components/digital-rain/MatrixCellDisplay.tsx';

interface MatrixRowProps {
  rowText: string[];
  getPosition: (row: number, col: number) => number;
  getLength: (row: number, col: number) => number;
  rainFrame: number;
  rowNum: number;
}

export const MatrixRow = ({
  rowText,
  getLength,
  getPosition,
  rainFrame,
  rowNum,
}: MatrixRowProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {rowText.map((item: string, index: number) => (
        <MatrixCellDisplay
          cellText={item}
          rainLength={getLength(rowNum, index)}
          rainPosition={getPosition(rowNum, index)}
          key={index}
        />
      ))}
    </div>
  );
};
