import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import {
  BASE_FONT_SIZE,
  BASE_SIZE,
  CELL_WIDTH,
  getMatrixChar,
  MODE_BASIC,
  MODE_CUSTOM,
} from '@/components/digital-rain/dr-utils.ts';
import { useDigitalRain } from '@/components/digital-rain/useDigitalRain.ts';
import {
  brighten,
  getCellData,
} from '@/components/digital-rain/style-cache.ts';
import { useFontsReady } from '@/components/digital-rain/useFontsReady.ts';
import { MATRIX_GREEN } from '@/components/controls/basic-utils.ts';

interface DigitalRainProps {
  rows: number;
  cols: number;
  text?: string;
  rainColor?: string;
}

const FONT = `bold ${BASE_FONT_SIZE}px Orbitron, 'Noto Sans JP', ui-monospace, sans-serif`;

export const DigitalRain = ({
  rows,
  cols,
  text = '',
  rainColor = MATRIX_GREEN,
}: DigitalRainProps) => {
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerTopRef = useRef(0);
  const sizeRef = useRef({ cssW: 0, cssH: 0 });

  const paintRef = useRef<() => void>(() => {});
  const { getLength, getPosition } = useDigitalRain({
    rows,
    cols,
    onFrame: () => paintRef.current(),
    matrix: theMatrix,
    dirtyText,
    mode,
  });

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = container.clientWidth;
    const cssH = window.innerHeight;

    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    }

    sizeRef.current = { cssW, cssH };
    containerTopRef.current = container.offsetTop;
  }, []);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { cssW, cssH } = sizeRef.current;
    ctx.clearRect(0, 0, cssW, cssH);

    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const scrollY = window.scrollY;
    const top = containerTopRef.current;

    const first = Math.max(0, Math.floor((scrollY - top) / BASE_SIZE) - 1);
    const last = Math.min(
      rows,
      Math.ceil((scrollY - top + cssH) / BASE_SIZE) + 1,
    );
    const leftOffset = (cssW - cols * CELL_WIDTH) / 2;

    // Pass 1: Basic chars
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    for (let row = first; row < last; row++) {
      const y = top + row * BASE_SIZE - scrollY + BASE_SIZE / 2;
      const rowBase = row * cols;
      for (let col = 0; col < cols; col++) {
        const idx = rowBase + col;

        if (mode === MODE_BASIC && dirtyText[idx]) {
          dirtyText[idx] = 0;
          theMatrix[idx] = getMatrixChar().codePointAt(0) ?? 0;
        }

        const len = getLength(row, col);
        if (len <= 0) continue;

        const { color } = getCellData(len, getPosition(row, col), rainColor);
        ctx.fillStyle = color;
        ctx.fillText(
          String.fromCodePoint(theMatrix[idx]),
          leftOffset + col * CELL_WIDTH + CELL_WIDTH / 2,
          y,
        );
      }
    }

    // Pass 2: Bloom
    if (typeof ctx.filter === 'string') {
      ctx.fillStyle = brighten(rainColor, 120); //'#f4fff4';
      for (let row = first; row < last; row++) {
        const y = top + row * BASE_SIZE - scrollY + BASE_SIZE / 2;
        const rowBase = row * cols;
        for (let col = 0; col < cols; col++) {
          const len = getLength(row, col);
          if (len <= 0 || getPosition(row, col) !== 0) continue;
          ctx.fillText(
            String.fromCodePoint(theMatrix[rowBase + col]),
            leftOffset + col * CELL_WIDTH + CELL_WIDTH / 2,
            y,
          );
        }
      }

      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = `blur(${4 * dpr}px)`; // tight glow
      ctx.drawImage(canvas, 0, 0);
      ctx.globalAlpha = 0.5;
      ctx.filter = `blur(${14 * dpr}px)`; // wide halo
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    } else {
      // fallback
      for (let row = first; row < last; row++) {
        const y = top + row * BASE_SIZE - scrollY + BASE_SIZE / 2;
        const rowBase = row * cols;
        for (let col = 0; col < cols; col++) {
          const len = getLength(row, col);
          if (len <= 0) continue;

          const { color, glow } = getCellData(
            len,
            getPosition(row, col),
            rainColor,
          );
          if (glow.length === 0) continue;

          const idx = rowBase + col;
          const ch = String.fromCodePoint(theMatrix[idx]);
          const x = leftOffset + col * CELL_WIDTH + CELL_WIDTH / 2;
          ctx.fillStyle = color;
          for (const layer of glow) {
            ctx.shadowBlur = layer.blur;
            ctx.shadowColor = layer.color;
            ctx.fillText(ch, x, y);
          }
        }
      }
    }

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }, [
    rows,
    cols,
    rainColor,
    mode,
    getLength,
    getPosition,
    theMatrix,
    dirtyText,
  ]);
  paintRef.current = paint;

  useLayoutEffect(() => {
    resize();
    paintRef.current();
  }, [rows, cols, resize]);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        paintRef.current();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      resize();
      paintRef.current();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resize]);

  const isReady = useFontsReady();

  useEffect(() => {
    if (isReady) paintRef.current();
  }, [isReady]);

  return (
    <div
      aria-hidden={'true'}
      ref={containerRef}
      className={'List'}
      style={{
        position: 'relative',
        width: '100%',
        userSelect: 'none',
        paddingBottom: '4px',
      }}
    >
      <div style={{ height: `${rows * BASE_SIZE}px` }} />
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 600ms ease',
        }}
      />
    </div>
  );
};
