import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { Dessert } from './dessert';
import { inject } from '@angular/core';
import { DessertService } from './dessert.service';
import { DessertFilter } from './dessert-filter';

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
        // 
        // TODO: Take care of race conditions
        //  and make solution reactive:
        //
        //  - Option 1: rxMethod 
        //      RxJS-Interop + switchMap
        //
        //  - Option 2: httpResource 
        //      once Signal Store supports
        //
        load(filter: DessertFilter): void {
            patchState(store, { 
                ...filter,
                loading: true 
            });

            store.dessertService.find(filter).subscribe({
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
            });
        }
    }))
);
