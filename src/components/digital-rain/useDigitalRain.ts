import type { CellRain } from '@/components/digital-rain/dr-utils.ts';
import { useState, useEffect } from 'react';

const stepsPerSecond = 5;

const emptyRain = (rows: number, cols: number): CellRain[][] => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      length: 0,
      position: 0,
    })),
  );
};

const moveRain = (rain: CellRain[][], rows: number, cols: number) => {
  const newRain = emptyRain(rows, cols);

  // top cells are "generators", they randomly generate rain from empty (black) cells
  for (let col = 0; col < cols; col++) {
    const cell = rain[0][col];
    if (cell.length === 0) {
      if (Math.floor(Math.random() * 10) === 0) {
        const newLength = Math.floor(Math.random() * 15) + 15; // random length + base length
        newRain[0][col] = {
          length: newLength,
          position: 0,
        };
      }
    } else {
      if (cell.position + 1 >= cell.length) {
        newRain[0][col] = {
          length: 0,
          position: 0,
        };
      } else {
        newRain[0][col] = { position: cell.position + 1, length: cell.length };
      }
    }
  }

  // update the board
  for (let row = rows - 1; row > 0; row--) {
    for (let col = 0; col < cols; col++) {
      const cell = rain[row][col];
      const aboveCell = rain[row - 1][col];

      if (cell.length === 0) {
        newRain[row][col] = structuredClone(aboveCell);
      } else {
        if (cell.position + 1 >= cell.length) {
          newRain[row][col] = { position: 0, length: 0 };
        } else {
          newRain[row][col] = {
            position: cell.position + 1,
            length: cell.length,
          };
        }

        if (aboveCell.length > 0 && aboveCell.position === 0) {
          newRain[row][col] = structuredClone(aboveCell);
        }
      }
    }
  }

  return newRain;
};

interface UseDigitalRainProps {
  rows: number;
  cols: number;
  running?: boolean;
}

export const useDigitalRain = ({
  rows,
  cols,
  running = true,
}: UseDigitalRainProps) => {
  const [rain, setRain] = useState<CellRain[][]>(() => emptyRain(rows, cols));

  // rain animation
  useEffect(() => {
    if (!running) return;

    const interval = 1000 / stepsPerSecond;
    let last = performance.now();
    let acc = 0;
    let id = 0;

    const loop = (now: number) => {
      acc += Math.min(now - last, 250); // clamp so a hidden tab doesn't cause a huge catch-up burst
      last = now;

      let stepped = false;
      let nextRain = rain;
      while (acc >= interval) {
        nextRain = moveRain(nextRain, rows, cols);
        acc -= interval;
        stepped = true;
      }
      if (stepped) {
        setRain(nextRain); // re-render
      }

      id = requestAnimationFrame(loop);
    };

    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [running, stepsPerSecond]);

  return { rain };
};
