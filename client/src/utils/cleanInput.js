export function cleanInput(value) {
  return value.replace(/[<>]/g, "").trim();
}