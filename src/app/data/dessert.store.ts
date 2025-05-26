import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ToastService } from '../shared/toast';
import { Dessert } from './dessert';
import { dessertDetailStoreEvents } from './dessert-detail.events';
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
  withProps(() => ({
    _dessertService: inject(DessertService),
    _ratingService: inject(RatingService),
    _toastService: inject(ToastService),
  })),
  withReducer(
    on(dessertDetailStoreEvents.dessertUpdated, ({ payload }) => {
      const updated = payload.dessert;
      return (store) => ({
        desserts: store.desserts.map((d) =>
          d.id === updated.id ? updated : d,
        ),
      });
      // return updateDessert(updated);
    }),
  ),
  withComputed((store) => ({
    ratedDesserts: computed(() => toRated(store.desserts(), store.ratings())),
  })),
  withMethods((store) => ({
    loadRatings(): void {
      patchState(store, { loading: true });

      store._ratingService.loadExpertRatings().subscribe({
        next: (ratings) => {
          patchState(store, { ratings, loading: false });
        },
        error: (error) => {
          patchState(store, { loading: false });
          store._toastService.show('Error loading ratings!');
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
          store._dessertService.find(f).pipe(
            tapResponse({
              next: (desserts) => {
                patchState(store, { desserts, loading: false });
              },
              error: (error) => {
                store._toastService.show('Error loading desserts!');
                console.error(error);
                patchState(store, { loading: false });
              },
            }),
          ),
        ),
      ),
    ),
  }))
);

export type DessertSlice = {
  desserts: Dessert[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateDessert(updated: Dessert) {
  return (store: DessertSlice) => ({
    desserts: store.desserts.map((d) => (d.id === updated.id ? updated : d)),
  });
}
