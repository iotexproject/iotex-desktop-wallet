// @ts-ignore
import shader from 'shader';

export function shade(color: string) {
  return shader(color, -0.09);
}
