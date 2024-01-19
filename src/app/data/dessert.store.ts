import { computed, inject } from '@angular/core';
import { Dessert } from './dessert';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { RatingService } from './rating.service';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export const DessertStore = signalStore(
    { providedIn: 'root' },
    withState({
        filter: {
            originalName: '',
            englishName: '',
        },
        desserts: [] as Dessert[],
    }),
    withComputed((store) => ({
        maxRating: computed(() => store.desserts().reduce(
            (acc, d) => Math.max(acc, d.rating),
            0
        ))
    })),
    withMethods((
        store,
        dessertService = inject(DessertService),
        ratingService = inject(RatingService)
    ) => ({
        updateFilter(filter: DessertFilter): void {
            patchState(store, { filter });
        },
        async loadDesserts(): Promise<void> {
            const desserts = await dessertService.findPromise(store.filter());
            patchState(store, { desserts });
        },
        async loadRatings(): Promise<void> {
            const ratings = await ratingService.loadExpertRatings();

            patchState(store, state => ({
                desserts: state.desserts.map(
                    d => ratings[d.id] ?
                        { ...d, rating: ratings[d.id] } :
                        d
                )
            }));
        },
        updateRating(id: number, rating: number): void {
            patchState(store, state => ({
                ...state,
                desserts: state.desserts.map(
                    d => (d.id === id) ?
                        { ...d, rating: rating } :
                        d
                )
            }));
        }
    }))
);
