import './App.css';
import { DigitalRain } from '@/components/digital-rain/DigitalRain.tsx';
import { CELL_WIDTH } from '@/components/digital-rain/dr-utils.ts';
import { useFontsReady } from '@/components/digital-rain/useFontsReady.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { ConfigureMatrix } from '@/components/controls/ConfigureMatrix.tsx';
import { Footer } from '@/components/controls/Footer.tsx';
import { getParams } from '@/components/controls/basic-utils.ts';
import { useAutoScroll } from '@/components/controls/useAutoScroll.ts';

// the canvas fades in over 600ms once fonts are ready (see DigitalRain.tsx)
const FADE_IN_MS = 600;

function App() {
  const htmlRef = useRef(document.documentElement);
  const { text, rows, color, autoscroll } = getParams();

  const { width } = useResizeDetector({
    targetRef: htmlRef,
    refreshMode: 'debounce',
    refreshRate: 100,
  });

  // don't start the autoscroll until the page has loaded and faded in
  const fontsReady = useFontsReady();
  const [fadedIn, setFadedIn] = useState(false);
  useEffect(() => {
    if (!fontsReady) return;
    const id = setTimeout(() => setFadedIn(true), FADE_IN_MS);
    return () => clearTimeout(id);
  }, [fontsReady]);

  const [flashSignal, setFlashSignal] = useState(0);
  const onScrollComplete = useCallback(
    () => setFlashSignal((num) => num + 1),
    [],
  );

  // stop scrolling when the bottom of the rain area reaches the bottom of
  // the screen (not the bottom of the page, which includes the controls)
  const rainRef = useRef<HTMLDivElement>(null);
  useAutoScroll(fadedIn && width ? autoscroll : null, {
    onComplete: onScrollComplete,
    bottomRef: rainRef,
  });

  if (!width) return null;
  const cols = Math.max(Math.floor(width / CELL_WIDTH), 1);

  return (
    <>
      <div ref={rainRef}>
        <DigitalRain
          rows={rows}
          cols={cols}
          text={text}
          rainColor={color}
          flashSignal={flashSignal}
        />
      </div>
      <ConfigureMatrix />
      <Footer />
    </>
  );
}

export default App;
