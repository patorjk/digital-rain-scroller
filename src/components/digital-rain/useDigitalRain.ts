import { useEffect, useRef, useCallback } from 'react';

const stepsPerSecond = 15;

const moveRain = (
  getLength: (row: number, col: number) => number,
  setLength: (row: number, col: number, val: number) => void,
  getPosition: (row: number, col: number) => number,
  setPosition: (row: number, col: number, val: number) => void,
  rows: number,
  cols: number,
) => {
  // update the board
  for (let row = rows - 1; row > 0; row--) {
    for (let col = 0; col < cols; col++) {
      const cellLength = getLength(row, col);
      const cellPosition = getPosition(row, col);
      const aboveCellLength = getLength(row - 1, col);
      const aboveCellPosition = getPosition(row - 1, col);

      if (cellLength === 0) {
        setLength(row, col, aboveCellLength);
        setPosition(row, col, aboveCellPosition);
      } else {
        if (cellPosition + 1 >= cellLength) {
          setLength(row, col, 0);
          setPosition(row, col, 0);
        } else {
          setLength(row, col, cellLength);
          setPosition(row, col, cellPosition + 1);
        }

        if (aboveCellLength > 0 && aboveCellPosition === 0) {
          setLength(row, col, aboveCellLength);
          setPosition(row, col, aboveCellPosition);
        }
      }
    }
  }

  // top cells are "generators", they randomly generate rain from empty (black) cells
  for (let col = 0; col < cols; col++) {
    const cellLength = getLength(0, col);
    const cellPosition = getPosition(0, col);

    if (cellLength === 0) {
      if (Math.floor(Math.random() * 10) === 0) {
        const newLength = Math.floor(Math.random() * 15) + 15; // random length + base length
        setLength(0, col, newLength);
        setPosition(0, col, 0);
      }
    } else {
      if (cellPosition + 1 >= cellLength) {
        setLength(0, col, 0);
        setPosition(0, col, 0);
      } else {
        setLength(0, col, cellLength);
        setPosition(0, col, cellPosition + 1);
      }
    }
  }
};

interface UseDigitalRainProps {
  rows: number;
  cols: number;
  running?: boolean;
  onFrame?: () => void;
}

export const useDigitalRain = ({
  rows,
  cols,
  running = true,
  onFrame,
}: UseDigitalRainProps) => {
  const rainLength = useRef(new Int16Array(rows * cols));
  const rainPosition = useRef(new Int16Array(rows * cols));

  const getLength = useCallback(
    (row: number, col: number) => rainLength.current[row * cols + col],
    [cols],
  );
  const setLength = useCallback(
    (row: number, col: number, val: number) => {
      rainLength.current[row * cols + col] = val;
    },
    [cols],
  );
  const getPosition = useCallback(
    (row: number, col: number) => rainPosition.current[row * cols + col],
    [cols],
  );
  const setPosition = useCallback(
    (row: number, col: number, val: number) => {
      rainPosition.current[row * cols + col] = val;
    },
    [cols],
  );

  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  // this ensures the full rain-area has rain in it when it starts
  useEffect(() => {
    for (let i = 0; i < rows; i++) {
      moveRain(getLength, setLength, getPosition, setPosition, rows, cols);
    }
  }, [rows, cols]);

  // rain animation
  useEffect(() => {
    if (!running) return;

    const interval = 1000 / stepsPerSecond;
    let last = performance.now();
    let acc = 0;
    let id = 0;

    const loop = (now: number) => {
      acc += Math.min(now - last, 250);
      last = now;

      let steps = 0;
      while (acc >= interval) {
        acc -= interval;
        steps++;
      }
      if (steps > 0) {
        for (let i = 0; i < steps; i++) {
          moveRain(getLength, setLength, getPosition, setPosition, rows, cols);
        }

        onFrameRef.current?.();
      }
      id = requestAnimationFrame(loop);
    };

    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [running, rows, cols]);

  return { getLength, getPosition };
};
