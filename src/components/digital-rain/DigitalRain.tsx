import { useMemo, useRef, useLayoutEffect } from 'react';
import { getMatrixChar } from '@/components/digital-rain/dr-utils.ts';
import { MatrixRow } from '@/components/digital-rain/MatrixRow.tsx';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useDigitalRain } from '@/components/digital-rain/useDigitalRain.ts';

export const BASE_FONT_SIZE = 24;
export const BASE_SIZE = BASE_FONT_SIZE * 1.5;

interface DigitalRainProps {
  rows: number;
  cols: number;
}

export const DigitalRain = ({ rows, cols }: DigitalRainProps) => {
  const theMatrix: string[][] = useMemo(() => {
    const matrix = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ''),
    );

    // fill chars up
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        matrix[row][col] = getMatrixChar();
      }
    }

    return matrix;
  }, [rows, cols]);

  const { rain } = useDigitalRain({ rows, cols });

  const listRef = useRef<HTMLDivElement | null>(null);
  const listOffsetRef = useRef(0);

  useLayoutEffect(() => {
    listOffsetRef.current = listRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: rows,
    estimateSize: () => BASE_SIZE,
    overscan: 50,
    scrollMargin: listOffsetRef.current,
  });

  return (
    <div
      ref={listRef}
      className={'List'}
      style={{
        fontSize: `${BASE_FONT_SIZE}px`,
        fontFamily: "'Noto Sans JP', ui-monospace, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${item.size}px`,
              transform: `translateY(${
                item.start - virtualizer.options.scrollMargin
              }px)`,
            }}
          >
            <MatrixRow
              rowText={theMatrix[item.index]}
              rowRain={rain[item.index]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
