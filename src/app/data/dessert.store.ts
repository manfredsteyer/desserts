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
import { catchError, debounceTime, filter, pipe, switchMap, tap, throwError } from 'rxjs';
import { Dessert } from './dessert';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { DessertIdToRatingMap, RatingService } from './rating.service';
import { toRated } from './to-rated';
import { tapResponse } from '@ngrx/operators';
import { ToastService } from '../shared/toast';

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
      toastService = inject(ToastService)
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
      loadDessertsByFilter: rxMethod<DessertFilter>(
        pipe(
          filter(
            (f) => f.originalName.length >= 3 || f.englishName.length >= 3,
          ),
          debounceTime(300),
          tap(() => patchState(store, { loading: true })),
          switchMap((f) => dessertService.find(f).pipe(
            tapResponse({
              next: (desserts) => {
                patchState(store, { desserts, loading: false });
              },
              error: (error) => {
                toastService.show('Error loading desserts!');
                console.error(error);
                patchState(store, { loading: false })
              },
            })
          )),
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
