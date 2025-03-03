import {
  computed,
  ResourceLoader,
  ResourceLoaderParams,
  Signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, Observable, of, switchMap } from 'rxjs';

export function wait(
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
    await wait(time, param.abortSignal);
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

export function debounceTrue(
  computation: () => boolean,
  timeMsec = 300,
): Signal<boolean | undefined> {
  const source = computed(() => computation());

  return toSignal(
    toObservable(source).pipe(
      switchMap((value) => {
        if (value) {
          return of(value).pipe(debounceTime(timeMsec));
        } else {
          return of(value);
        }
      }),
    ),
    {
      initialValue: source(),
    },
  );
}

export type RxResourceLoader<T, R> = (
  params: ResourceLoaderParams<R>,
) => Observable<T>;

export function rxSkipInitial<T, U>(
  loader: RxResourceLoader<T, U>,
): RxResourceLoader<T, U> {
  let first = true;
  return (param) => {
    if (first) {
      first = false;
      return of(undefined as T);
    }
    return loader(param);
  };
}
