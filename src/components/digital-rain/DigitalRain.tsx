import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import {
  BASE_FONT_SIZE,
  BASE_SIZE,
  getMatrixChar,
} from '@/components/digital-rain/dr-utils.ts';
import { MatrixRow } from '@/components/digital-rain/MatrixRow.tsx';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useDigitalRain } from '@/components/digital-rain/useDigitalRain.ts';
import { getCellColor } from '@/components/digital-rain/color-cache.ts';

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

  const cellRefs = useRef(new Map<number, HTMLDivElement>());
  const setCellRef = useCallback((key: number, el: HTMLDivElement | null) => {
    if (el) cellRefs.current.set(key, el);
    else cellRefs.current.delete(key);
  }, []);

  const paintRef = useRef<() => void>(() => {});
  const { getLength, getPosition } = useDigitalRain({
    rows,
    cols,
    onFrame: () => paintRef.current(),
  });
  const paint = useCallback(() => {
    const cells = cellRefs.current;
    for (const [key, el] of cells) {
      const row = (key / cols) | 0;
      const col = key - row * cols;
      el.style.color = getCellColor(getLength(row, col), getPosition(row, col));
    }
  }, [cols, getLength, getPosition]);
  paintRef.current = paint;

  const listRef = useRef<HTMLDivElement | null>(null);
  const listOffsetRef = useRef(0);

  useLayoutEffect(() => {
    listOffsetRef.current = listRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: rows,
    estimateSize: () => BASE_SIZE,
    overscan: 10,
    scrollMargin: listOffsetRef.current,
  });

  useLayoutEffect(() => {
    paint();
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
              rowNum={item.index}
              cols={cols}
              setCellRef={setCellRef}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
