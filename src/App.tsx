import './App.css';
import { DigitalRain } from '@/components/digital-rain/DigitalRain.tsx';
import { CELL_WIDTH } from '@/components/digital-rain/dr-utils.ts';

function App() {
  const cols = Math.max(Math.floor(window.innerWidth / CELL_WIDTH), 1);

  return (
    <>
      <DigitalRain rows={1000} cols={cols} />
    </>
  );
}

export default App;
