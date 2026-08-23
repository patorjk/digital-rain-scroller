import './App.css';
import { DigitalRain } from '@/components/digital-rain/DigitalRain.tsx';
import { CELL_WIDTH } from '@/components/digital-rain/dr-utils.ts';
import { useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { ConfigureMatrix } from '@/components/controls/ConfigureMatrix.tsx';
import { Footer } from '@/components/controls/Footer.tsx';

function App() {
  const htmlRef = useRef(document.documentElement);

  const { width } = useResizeDetector({
    targetRef: htmlRef,
    refreshMode: 'debounce', // optional: throttle noisy resize events
    refreshRate: 100,
  });

  if (!width) return null;
  const cols = Math.max(Math.floor(width / CELL_WIDTH), 1);

  return (
    <>
      <DigitalRain rows={200} cols={cols} />
      <ConfigureMatrix />
      <Footer />
    </>
  );
}

export default App;
