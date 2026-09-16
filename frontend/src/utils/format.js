export function formatDate(value) {
  if (!value) return "—";
  return String(value).slice(0, 10);
}
