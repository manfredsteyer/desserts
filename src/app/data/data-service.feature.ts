import { ProviderToken, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, debounceTime, pipe, switchMap, tap } from 'rxjs';

export type DataService<F, E> = {
  findPromise(filter: F): Promise<E[]>;
  find(filter: F): Observable<E[]>;
};

export function withDataService<F, E>(
  dataServiceToken: ProviderToken<DataService<F, E>>,
  entityFilter: F,
) {
  return signalStoreFeature(
    withState({
      filter: entityFilter,
      entities: [] as E[],
    }),
    withMethods((store, dataService = inject(dataServiceToken)) => ({
      updateFilter(filter: F): void {
        patchState(store, { filter });
      },
      async load(): Promise<void> {
        const entities = await dataService.findPromise(store.filter());
        patchState(store, { entities: entities });
      },
      loadByFilter: rxMethod<F>(
        pipe(
          debounceTime(300),
          switchMap((f) => dataService.find(f)),
          tap((entities) => patchState(store, { entities: entities })),
        ),
      ),
    })),
    withHooks({
      onInit(store) {
        const filter = store.filter;
        store.loadByFilter(filter);
      },
    }),
  );
}
