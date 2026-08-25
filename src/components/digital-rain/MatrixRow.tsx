import { MatrixCellDisplay } from '@/components/digital-rain/MatrixCellDisplay.tsx';

interface MatrixRowProps {
  theMatrix: Uint32Array;
  rowNum: number;
  cols: number;
  setCellRef: (key: number, el: HTMLDivElement | null) => void;
}

export const MatrixRow = ({
  theMatrix,
  rowNum,
  cols,
  setCellRef,
}: MatrixRowProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {Array.from({ length: cols }).map((_item: unknown, col: number) => (
        <MatrixCellDisplay
          cellText={String.fromCodePoint(theMatrix[rowNum * cols + col])}
          key={col}
          cellKey={rowNum * cols + col}
          setCellRef={setCellRef}
        />
      ))}
    </div>
  );
};
