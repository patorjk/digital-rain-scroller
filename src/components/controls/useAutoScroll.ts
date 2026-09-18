import { useEffect, useRef } from 'react';

interface UseAutoScrollOptions {
  onComplete?: () => void;
  // stop when the bottom of this element reaches the bottom of the viewport
  // (defaults to the bottom of the page)
  bottomRef?: React.RefObject<HTMLElement | null>;
  targetRef?: React.RefObject<HTMLElement>;
}

// Scrolls to the bottom over a given number of seconds (null = disabled).
export function useAutoScroll(
  seconds: number | null,
  { onComplete, bottomRef, targetRef }: UseAutoScrollOptions = {},
) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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
      const eased = t * t * t; // cubic ease-in: slow start, full speed at the bottom
      const maxEnd = el.scrollHeight - el.clientHeight;
      const bottomEl = bottomRef?.current;
      const end = bottomEl
        ? Math.max(
            0,
            Math.min(
              maxEnd,
              bottomEl.offsetTop + bottomEl.offsetHeight - el.clientHeight,
            ),
          )
        : maxEnd;
      el.scrollTop = start + (end - start) * eased;
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        onCompleteRef.current?.();
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [seconds, targetRef, bottomRef]);
}
