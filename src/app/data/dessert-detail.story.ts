import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { initDessert } from "./dessert";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { inject } from "@angular/core";
import { DessertService } from "./dessert.service";

export const DessertDetailStore = signalStore(
    { providedIn: 'root' },
    withState({
        dessert: initDessert,
        loading: false
    }),
    withMethods((
        store,
        dessertService = inject(DessertService)
    ) => ({
        rxLoad: rxMethod<number>(pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap((id) => dessertService.findById(id)),
            tap((dessert) => patchState(store, { dessert, loading: false })),
        )),

        load(id: number): void {
            patchState(store, { loading: true });
            dessertService.findById(id).subscribe(dessert => {
                patchState(store, { dessert, loading: false });
            });
        }

    }))
);
