import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, filter, pipe, switchMap, tap } from 'rxjs';
import { Dessert } from './dessert';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { DessertIdToRatingMap, RatingService } from './rating.service';
import { toRated } from './to-rated';

export const DessertStore = signalStore(
  { providedIn: 'root' },
  withState({
    filter: {
      originalName: '',
      englishName: 'Cake',
    },
    ratings: {} as DessertIdToRatingMap,
    desserts: [] as Dessert[],
  }),
  withComputed((store) => ({
    ratedDesserts: computed(() => toRated(store.desserts(), store.ratings())),
  })),
  withMethods(
    (
      store,
      dessertService = inject(DessertService),
      ratingService = inject(RatingService),
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
        patchState(store, { ratings });
      },
      updateRating(id: number, rating: number): void {
        patchState(store, (state) => ({
          ratings: {
            ...state.ratings,
            [id]: rating,
          },
        }));
      },
      loadDessertsByFilter: rxMethod<DessertFilter>(
        pipe(
          filter(
            (f) => f.originalName.length >= 3 || f.englishName.length >= 3,
          ),
          debounceTime(300),
          switchMap((f) => dessertService.find(f)),
          tap((desserts) => patchState(store, { desserts })),
        ),
      ),
    }),
  ),
  withHooks({
    onInit(store) {
      const filter = store.filter;
      store.loadDessertsByFilter(filter);
    },
  }),
);
