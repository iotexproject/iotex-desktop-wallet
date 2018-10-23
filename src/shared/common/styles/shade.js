import shader from 'shader';

export function shade(color) {
  return shader(color, -0.09);
}
