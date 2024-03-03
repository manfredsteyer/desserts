import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ToastService } from '../shared/toast';
import { withDataService } from './data-service.feature';
import { DessertService } from './dessert.service';
import { DessertIdToRatingMap, RatingService } from './rating.service';
import { toRated } from './to-rated';

export const DessertStore = signalStore(
  { providedIn: 'root' },

  withDataService(DessertService, { englishName: 'Cake', originalName: '' }),

  //
  // Ratings-realated parts have been moved down
  // to make refactoring easier
  //
  withState({
    ratings: {} as DessertIdToRatingMap,
  }),
  withComputed((store) => ({
    ratedDesserts: computed(() => toRated(store.entities(), store.ratings())),
  })),
  withMethods(
    (
      store,
      ratingService = inject(RatingService),
      toastService = inject(ToastService),
    ) => ({
      loadRatings(): void {
        patchState(store, { loading: true });

        ratingService.loadExpertRatings().subscribe({
          next: (ratings) => {
            patchState(store, { ratings, loading: false });
          },
          error: (error) => {
            patchState(store, { loading: false });
            toastService.show('Error loading ratings!');
            console.error(error);
          },
        });
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
