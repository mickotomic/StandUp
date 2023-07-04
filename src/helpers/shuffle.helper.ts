export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const z = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[z]] = [arr[z], arr[i]];
  }
  return arr;
}
