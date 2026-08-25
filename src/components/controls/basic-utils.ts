export const DEFAULT_NUM_ROWS = 500;

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
    color = '#0aff0a';
  }

  const rowsParam = params.get('rows');
  const baseRows = rowsParam === null ? DEFAULT_NUM_ROWS : Number(rowsParam);
  const rows = !Number.isFinite(baseRows)
    ? DEFAULT_NUM_ROWS
    : Math.min(1000, Math.max(200, baseRows));

  return { text, rows, color };
}
