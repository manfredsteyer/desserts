import { signalStoreFeature } from "@ngrx/signals";
import { inject } from '@angular/core';
import { Dessert } from './dessert';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { patchState, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, filter, pipe, switchMap, tap } from 'rxjs';

export function withDataService() {
    return signalStoreFeature(
        withState({
            filter: {
                originalName: '',
                englishName: 'Cake',
            },
            desserts: [] as Dessert[],
        }),
        withMethods((
            store,
            dessertService = inject(DessertService),
        ) => ({
            updateFilter(filter: DessertFilter): void {
                patchState(store, { filter });
            },
            async loadDesserts(): Promise<void> {
                const desserts = await dessertService.findPromise(store.filter());
                patchState(store, { desserts });
            },
            loadDessertsByFilter: rxMethod<DessertFilter>(pipe(
                filter(f => f.originalName.length >= 3 || f.englishName.length >= 3),
                debounceTime(300),
                switchMap(f => dessertService.find(f)),
                tap(desserts => patchState(store, { desserts }))
            ))
        })),
        withHooks({
            onInit(store) {
                const filter = store.filter;
                store.loadDessertsByFilter(filter);
            }
        }),
    )
}