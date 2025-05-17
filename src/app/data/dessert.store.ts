import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ToastService } from '../shared/toast';
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
      loadDesserts: rxMethod<DessertFilter>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((f) =>
            dessertService.find(f).pipe(
              tapResponse({
                next: (desserts) => {
                  patchState(store, { desserts, loading: false });
                },
                error: (error) => {
                  toastService.show('Error loading desserts!');
                  console.error(error);
                  patchState(store, { loading: false });
                },
              }),
            ),
          ),
        ),
      ),
    }),
  )
);
