const DEFAULT_NUM_ROWS = 200;

export function getParams() {
  const params = new URLSearchParams(window.location.search);
  const text = params.get('text') ?? '';

  const rowsParam = params.get('rows');
  const baseRows = rowsParam === null ? DEFAULT_NUM_ROWS : Number(rowsParam);
  const rows = !Number.isFinite(baseRows)
    ? DEFAULT_NUM_ROWS
    : Math.min(1000, Math.max(200, baseRows));

  return { text, rows };
}
