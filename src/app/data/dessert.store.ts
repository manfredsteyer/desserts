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
import { ToastService } from '../shared/toast';

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
      toastService = inject(ToastService)
    ) => ({
      updateFilter(filter: DessertFilter): void {
        patchState(store, { filter });
      },
      loadDesserts(): void {
        patchState(store, { loading: true });

        dessertService.find(store.filter()).subscribe({
          next: (desserts) => {
            patchState(store, { desserts, loading: false });
          },
          error: (error) => {
            patchState(store, { loading: false });
            toastService.show('Error loading desserts!');
            console.error(error);
          }
        });
      },
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
          }
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
