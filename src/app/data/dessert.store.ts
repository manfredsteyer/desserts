import { computed, inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withComputed, withProps, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { ToastService } from '../shared/toast';
import { Dessert } from './dessert';
import { dessertDetailStoreEvents } from './dessert-detail.events';
import { dessertEvents } from './dessert.events';
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
    error: '',
  }),
  withProps(() => ({
    _dessertService: inject(DessertService),
    _ratingService: inject(RatingService),
    _toastService: inject(ToastService),
    _events: inject(Events),
  })),
  withComputed((store) => ({
    ratedDesserts: computed(() => toRated(store.desserts(), store.ratings())),
  })),
  withReducer(
    on(dessertDetailStoreEvents.dessertUpdated, ({ payload }) => {
      return (store) => ({
        desserts: store.desserts.map((d) =>
          d.id === payload.dessert.id ? payload.dessert : d,
        ),
      });
    }),
    on(dessertEvents.loadDesserts, ({ payload }) => {
      return {
        filter: payload,
        loading: true,
      };
    }),
    on(dessertEvents.loadDessertsSuccess, ({ payload }) => {
      return {
        desserts: payload.desserts,
        loading: false,
      };
    }),
    on(dessertEvents.loadRatings, () => {
      return {
        loading: false,
      };
    }),
    on(dessertEvents.loadRatingsSuccess, ({ payload }) => {
      return {
        ratings: payload.ratings,
        loading: false,
      };
    }),
    on(dessertEvents.updateRating, ({ payload }) => {
      return (state) => ({
        ratings: {
          ...state.ratings,
          [payload.dessertId]: payload.rating,
        },
      });
    }),
    on(
      dessertEvents.loadDessertsError,
      dessertEvents.loadRatingsError,
      ({ payload }) => {
        return {
          error: payload.error,
          loading: false,
        };
      },
    ),
  ),
  withEffects((store) => ({
    loadDesserts$: store._events.on(dessertEvents.loadDesserts).pipe(
      switchMap((e) => store._dessertService.find(e.payload)),
      mapResponse({
        next: (desserts) => dessertEvents.loadDessertsSuccess({ desserts }),
        error: (error) =>
          dessertEvents.loadDessertsError({ error: String(error) }),
      }),
    ),
    loadRatings$: store._events.on(dessertEvents.loadRatings).pipe(
      switchMap(() => store._ratingService.loadExpertRatings()),
      mapResponse({
        next: (ratings) => dessertEvents.loadRatingsSuccess({ ratings }),
        error: (error) =>
          dessertEvents.loadRatingsError({ error: String(error) }),
      }),
    ),
  })),
);
