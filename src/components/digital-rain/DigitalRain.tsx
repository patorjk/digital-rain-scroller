import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import {
  BASE_FONT_SIZE,
  BASE_SIZE,
  getMatrixChar,
  MODE_BASIC,
  MODE_CUSTOM,
} from '@/components/digital-rain/dr-utils.ts';
import { MatrixRow } from '@/components/digital-rain/MatrixRow.tsx';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useDigitalRain } from '@/components/digital-rain/useDigitalRain.ts';
import { getCellData } from '@/components/digital-rain/style-cache.ts';
import { useFontsReady } from '@/components/digital-rain/useFontsReady.ts';

interface DigitalRainProps {
  rows: number;
  cols: number;
  text?: string;
}

export const DigitalRain = ({ rows, cols, text = '' }: DigitalRainProps) => {
  const theMatrix = useMemo(() => {
    const matrix = new Uint32Array(rows * cols);

    // fill chars up
    if (text) {
      const matrixChars = Array.from(text.replace(/ /g, '·') + '·');
      for (let col = 0; col < cols; col++) {
        const offset = Math.floor(matrixChars.length * Math.random());
        for (let row = 0; row < rows; row++) {
          const charIndex = (row + offset) % matrixChars.length;
          matrix[row * cols + col] = matrixChars[charIndex].codePointAt(0) ?? 0;
        }
      }
    } else {
      // no input text, so use matrix characters
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < cols; col++) {
          matrix[row * cols + col] = getMatrixChar().codePointAt(0) ?? 0;
        }
      }
    }

    return matrix;
  }, [rows, cols]);

  const dirtyText = useMemo(() => new Uint8Array(rows * cols), [rows, cols]);

  const mode = text ? MODE_CUSTOM : MODE_BASIC;

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
    matrix: theMatrix,
    dirtyText,
    mode,
  });

  const paint = useCallback(() => {
    const cells = cellRefs.current;
    for (const [key, el] of cells) {
      const row = (key / cols) | 0;
      const col = key - row * cols;
      const { color, shadow } = getCellData(
        getLength(row, col),
        getPosition(row, col),
      );
      el.style.color = color;
      el.style.textShadow = shadow;

      if (dirtyText[row * cols + col]) {
        dirtyText[row * cols + col] = 0;
        theMatrix[row * cols + col] = getMatrixChar().codePointAt(0) ?? 0;
        el.textContent = String.fromCodePoint(theMatrix[row * cols + col]);
      }
    }
  }, [cols, getLength, getPosition, theMatrix, dirtyText]);
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

  const isReady = useFontsReady();

  return (
    <div
      aria-hidden={'true'}
      ref={listRef}
      className={'List'}
      style={{
        fontSize: `${BASE_FONT_SIZE}px`,
        fontFamily: "Orbitron, 'Noto Sans JP', ui-monospace, sans-serif",
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: isReady ? 1 : 0,
        transition: 'opacity 600ms ease',
        paddingBottom: '4px',
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
              theMatrix={theMatrix}
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
