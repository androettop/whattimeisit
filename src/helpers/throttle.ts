export function throttle<T, U>(func: (...args: T[]) => U, delay: number) {
  let timeout: number | null = null;
  return (...args: T[]) => {
    if (timeout === null) {
      timeout = setTimeout(() => {
        timeout = null;
      }, delay);
      func(...args);
    }
  };
}
