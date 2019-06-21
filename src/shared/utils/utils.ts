interface Cancelable {
  cancel(): void;
}

type Arg =
  | number
  | string
  | boolean
  | null
  | undefined
  // tslint:disable-next-line:no-any
  | { [key: string]: any };

type Fn<T> = (...params: Array<Arg>) => T;

export type ThrottledFn<T> = ((...args: Array<Arg>) => Promise<T>) & Cancelable;

/**
 * @param wait Throttle time;
 * @description Promise powered throttle function.
 * Result of the incoming function func can be obtained by the then method of the return function,
 * and the execution of the internal function can also be canceled by the cancel method of the return function.
 */
export function throttle<T>(func: Fn<T>, wait: number): ThrottledFn<T> {
  let timeout: NodeJS.Timeout | null;
  let previous = 0;

  const throttled = (...params: Array<Arg>): Promise<T> => {
    const current = Date.now();

    if (!previous) {
      previous = current;
    }

    const remaining = wait - (current - previous);

    return new Promise(resolve => {
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = current;
        resolve(func(params));
      } else if (!timeout) {
        timeout = setTimeout(() => {
          previous = Date.now();
          timeout = null;
          resolve(func(params));
        }, remaining);
      }
    });
  };

  throttled.cancel = () => {
    clearTimeout(timeout as NodeJS.Timeout);
    previous = 0;
    timeout = null;
  };

  return throttled;
}
