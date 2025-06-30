import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { Dessert } from './dessert';
import { inject } from '@angular/core';
import { DessertService } from './dessert.service';
import { DessertFilter } from './dessert-filter';
import { debounceTime, switchMap, tap } from 'rxjs';

export const DessertStore = signalStore(
    { providedIn: 'root' },
    withState({
        originalName: '',
        englishName: '',
        desserts: [] as Dessert[],
        loading: false,
        error: ''
    }),
    withProps(() => ({
        dessertService: inject(DessertService)
    })),
    withMethods((store) => ({

        rxLoad: rxMethod<DessertFilter>(filter$ => filter$.pipe(
            debounceTime(300),
            tap(f => patchState(store, { ...f, loading: true })),
            switchMap(f => store.dessertService.find(f)),
            tapResponse({
                next: (desserts) => {
                    patchState(store, { 
                        desserts, 
                        loading: false 
                    });
                },
                error: (error) => {
                    patchState(store, { 
                        error: String(error),
                        loading: false
                    });
                }
            })
        )),

    }))
);
