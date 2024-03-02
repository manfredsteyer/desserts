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
import { tapResponse } from '@ngrx/operators';

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
      loading: false,
      error: null as unknown,
      entities: [] as E[],
    }),
    withMethods((
      store,
      dataService = inject(dataServiceToken),
    ) => ({
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
          tap(() => patchState(store, { loading: true })),
          switchMap((f) => dataService.find(f).pipe(
            tapResponse({
              next: (entities) => {
                patchState(store, { entities, loading: false });
              },
              error: (error) => {
                console.error(error);
                patchState(store, { error, loading: false })
              },
            })
          )),
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
