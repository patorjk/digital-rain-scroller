import { useRef, type RefObject } from 'react';

const UNSET = Symbol('unset');

export function useLazyRef<T>(init: () => T): RefObject<T> {
  const ref = useRef<T | typeof UNSET>(UNSET);
  if (ref.current === UNSET) {
    ref.current = init();
  }
  return ref as RefObject<T>;
}
