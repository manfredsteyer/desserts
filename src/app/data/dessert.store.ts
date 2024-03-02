import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
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
      englishName: '',
    },
    loading: false,
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
        try {
          patchState(store, { loading: true });
          const desserts = await dessertService.findPromise(store.filter());
          patchState(store, { desserts });
        }
        finally {
          patchState(store, { loading: false });
        }
      },
      async loadRatings(): Promise<void> {
        try {
          patchState(store, { loading: true });
          const ratings = await ratingService.loadExpertRatings();
          patchState(store, { ratings });
        }
        finally {
          patchState(store, { loading: false });
        }
      },
      updateRating(id: number, rating: number): void {
        patchState(store, (state) => ({
          ratings: {
            ...state.ratings,
            [id]: rating,
          },
        }));
      },
    }),
  ),
);
