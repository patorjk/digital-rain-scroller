export const DEFAULT_NUM_ROWS = 500;
export const MATRIX_GREEN = '#227658'; // #0aff0a
export const MAX_ROWS = 2000;
export const MIN_AUTOSCROLL_SECONDS = 5;
export const MAX_AUTOSCROLL_SECONDS = 20;
export const DEFAULT_AUTOSCROLL_SECONDS = 10;

function isValidCSSColor(color: string): boolean {
  if (typeof window !== 'undefined' && window.CSS && window.CSS.supports) {
    return window.CSS.supports('color', color);
  }
  return false;
}

export function getParams() {
  const params = new URLSearchParams(window.location.search);
  const text = params.get('text') ?? '';
  let color = params.get('color') ?? '';
  if (!isValidCSSColor(color)) {
    color = MATRIX_GREEN;
  }

  const rowsParam = params.get('rows');
  const baseRows = rowsParam === null ? DEFAULT_NUM_ROWS : Number(rowsParam);
  const rows = !Number.isFinite(baseRows)
    ? DEFAULT_NUM_ROWS
    : Math.min(MAX_ROWS, Math.max(200, baseRows));

  // autoscroll is the number of seconds the scroll should take, null = no autoscroll
  const autoscrollParam = params.get('autoscroll');
  const baseAutoscroll =
    autoscrollParam === null ? NaN : Number(autoscrollParam);
  const autoscroll = Number.isFinite(baseAutoscroll)
    ? Math.min(
        MAX_AUTOSCROLL_SECONDS,
        Math.max(MIN_AUTOSCROLL_SECONDS, baseAutoscroll),
      )
    : null;

  return { text, rows, color, autoscroll };
}
