import { MatrixCellDisplay } from '@/components/digital-rain/MatrixCellDisplay.tsx';

interface MatrixRowProps {
  rowText: string[];
  rowNum: number;
  cols: number;
  setCellRef: (key: number, el: HTMLDivElement | null) => void;
}

export const MatrixRow = ({
  rowText,
  rowNum,
  cols,
  setCellRef,
}: MatrixRowProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {rowText.map((item: string, index: number) => (
        <MatrixCellDisplay
          cellText={item}
          key={index}
          cellKey={rowNum * cols + index}
          setCellRef={setCellRef}
        />
      ))}
    </div>
  );
};
