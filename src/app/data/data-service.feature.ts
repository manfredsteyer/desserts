import { inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, filter, pipe, switchMap, tap } from 'rxjs';
import { Dessert } from './dessert';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { ToastService } from '../shared/toast';
import { tapResponse } from '@ngrx/operators';

export function withDataService() {
  return signalStoreFeature(
    withState({
      filter: {
        originalName: '',
        englishName: 'Cake',
      },
      loading: false,
      desserts: [] as Dessert[],
    }),
    withMethods((
      store,
      dessertService = inject(DessertService),
      toastService = inject(ToastService)
    ) => ({
      updateFilter(filter: DessertFilter): void {
        patchState(store, { filter });
      },
      async loadDesserts(): Promise<void> {
        const desserts = await dessertService.findPromise(store.filter());
        patchState(store, { desserts });
      },
      loadDessertsByFilter: rxMethod<DessertFilter>(
        pipe(
          filter(
            (f) => f.originalName.length >= 3 || f.englishName.length >= 3,
          ),
          debounceTime(300),
          tap(() => patchState(store, { loading: true })),
          switchMap((f) => dessertService.find(f).pipe(
            tapResponse({
              next: (desserts) => {
                patchState(store, { desserts, loading: false });
              },
              error: (error) => {
                toastService.show('Error loading desserts!');
                console.error(error);
                patchState(store, { loading: false })
              },
            })
          )),
        ),
      ),
    })),
    withHooks({
      onInit(store) {
        const filter = store.filter;
        store.loadDessertsByFilter(filter);
      },
    }),
  );
}
