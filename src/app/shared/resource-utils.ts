import { ResourceLoader } from './resource/api';

export function timeout(
  msec: number,
  signal: AbortSignal | undefined = undefined,
) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const timeoutId = setTimeout(() => {
      resolve();
    }, msec);

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export function debounce<T, U>(
  loader: ResourceLoader<T, U>,
  time = 300,
): ResourceLoader<T, U> {
  return async (param) => {
    await timeout(time, param.abortSignal);
    return await loader(param);
  };
}

export function skipInitial<T, U>(
  loader: ResourceLoader<T, U>,
): ResourceLoader<T, U> {
  let first = true;
  return (param) => {
    if (first) {
      first = false;
      return Promise.resolve<T>(undefined as T);
    }
    return loader(param);
  };
}
