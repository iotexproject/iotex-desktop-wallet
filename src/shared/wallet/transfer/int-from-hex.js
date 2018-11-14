export function intFromHexLE(str) {
  return parseInt(`0x${String(str).match(/../g).reverse().join('')}`, 16);
}
