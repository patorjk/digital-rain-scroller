import { useEffect, useRef, useCallback } from 'react';

const stepsPerSecond = 20;

/*
  Basic idea of the rain:

  My original idea for the rain was something like a cellular automaton where each cell in the grid held some state,
  and its next state would be based on the cell above it. The top cells would act as generators and randomly start new
  rain if they were "blank". It still works like this, but I had to break the data out because the browser kept
  having memory issues. So now there are fixed grids that represent each important piece of data:

  * length - Each piece of rain has a "length". If a cell isn't in a rain strand, it's length is zero.
  * position - The grid cell's position in the rain strand.

  As the rain slides down, these values change (mostly just the position). Additionally, I realized digital rain
  strands have different speeds, so different columns flow faster than others.
 */

// This is for updating a single column
const moveRainColumn = (
  col: number,
  getLength: (row: number, col: number) => number,
  setLength: (row: number, col: number, val: number) => void,
  getPosition: (row: number, col: number) => number,
  setPosition: (row: number, col: number, val: number) => void,
  rows: number,
) => {
  for (let row = rows - 1; row > 0; row--) {
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

  // top cells are "generators", they randomly generate rain from empty (black) cells
  const cellLength = getLength(0, col);
  const cellPosition = getPosition(0, col);

  if (cellLength === 0) {
    if (Math.floor(Math.random() * 25) === 0) {
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
};

const moveRain = (
  rainSpeed: Float32Array,
  rainAccum: Float32Array,
  getLength: (row: number, col: number) => number,
  setLength: (row: number, col: number, val: number) => void,
  getPosition: (row: number, col: number) => number,
  setPosition: (row: number, col: number, val: number) => void,
  rows: number,
  cols: number,
  skipAccumulatorCheck = false,
) => {
  // update the board
  for (let col = 0; col < cols; col++) {
    rainAccum[col] = rainAccum[col] + rainSpeed[col];
    if (rainAccum[col] >= 1 || skipAccumulatorCheck) {
      moveRainColumn(col, getLength, setLength, getPosition, setPosition, rows);
      rainAccum[col] = Math.max(rainAccum[col] - 1, 0);
    }
  }
};

// this gets called when the user resizes the window and we have to adjust the grid
function resizeGrid(
  src: Int16Array,
  oldRows: number,
  oldCols: number,
  newRows: number,
  newCols: number,
) {
  const dst = new Int16Array(newRows * newCols);
  const rowCount = Math.min(oldRows, newRows);
  const colCount = Math.min(oldCols, newCols);
  for (let row = 0; row < rowCount; row++) {
    const oldBase = row * oldCols;
    const newBase = row * newCols;
    dst.set(src.subarray(oldBase, oldBase + colCount), newBase);
  }
  return dst;
}

const getRainSpeeds = (cols: number) => {
  return new Float32Array(
    Array.from({ length: cols }, () => 0.3 + Math.random() * 0.7),
  );
};

const getRainAccumulation = (cols: number) => {
  return new Float32Array(Array.from({ length: cols }, () => 0));
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

  const rainSpeed = useRef(getRainSpeeds(cols));
  const rainSpeedAccumulation = useRef(getRainAccumulation(cols));

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

  const prevRows = useRef(rows);
  const prevCols = useRef(cols);
  if (prevRows.current !== rows || prevCols.current !== cols) {
    rainLength.current = resizeGrid(
      rainLength.current,
      prevRows.current,
      prevCols.current,
      rows,
      cols,
    );
    rainPosition.current = resizeGrid(
      rainPosition.current,
      prevRows.current,
      prevCols.current,
      rows,
      cols,
    );

    const colCount = Math.min(rainSpeed.current.length, cols);

    const newSpeeds = getRainSpeeds(cols);
    newSpeeds.set(rainSpeed.current.subarray(0, colCount));
    rainSpeed.current = newSpeeds;

    const newAccu = getRainAccumulation(cols);
    newAccu.set(rainSpeedAccumulation.current.subarray(0, colCount));
    rainSpeedAccumulation.current = newAccu;

    prevRows.current = rows;
    prevCols.current = cols;
  }

  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  // this ensures the full rain-area has rain in it when it starts
  useEffect(() => {
    for (let i = 0; i < rows; i++) {
      moveRain(
        rainSpeed.current,
        rainSpeedAccumulation.current,
        getLength,
        setLength,
        getPosition,
        setPosition,
        rows,
        cols,
        true, // this runs all strands at full speed
      );
    }
  }, []);

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
          moveRain(
            rainSpeed.current,
            rainSpeedAccumulation.current,
            getLength,
            setLength,
            getPosition,
            setPosition,
            rows,
            cols,
          );
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
