import { useEffect } from 'react';

export function useAutoScroll(
  seconds: number | null,
  targetRef?: React.RefObject<HTMLElement>,
) {
  useEffect(() => {
    if (!seconds) return;
    const el = targetRef?.current ?? document.documentElement;
    const start = el.scrollTop;
    const duration = seconds * 1000;
    let startTime: number | undefined;
    let rafId: number;

    const step = (now: number) => {
      startTime ??= now;
      const t = Math.min((now - startTime) / duration, 1);
      const end = el.scrollHeight - el.clientHeight;
      el.scrollTop = start + (end - start) * t;
      if (t < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [seconds, targetRef]);
}
