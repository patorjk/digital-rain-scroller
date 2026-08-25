import { useEffect, useState } from 'react';

export const useFontsReady = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([
      document.fonts.load('700 24px "Noto Sans JP"'),
      document.fonts.load('700 24px "Orbitron"'),
    ]).then(() => {
      if (active) {
        setReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return ready;
};
