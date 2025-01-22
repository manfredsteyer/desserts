import { ResourceLoader, ResourceLoaderParams } from '@angular/core';

export type Action<T> = (param: T) => void;

export function skipFirst<T, R>(
  originalLoader: ResourceLoader<T, R>,
): ResourceLoader<T | undefined, R> {
  let isFirstExecution = true;

  return async (param: ResourceLoaderParams<R>): Promise<T | undefined> => {
    if (isFirstExecution) {
      isFirstExecution = false;
      return undefined;
    }
    return originalLoader(param);
  };
}
