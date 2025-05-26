import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withProps, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { exhaustMap } from 'rxjs';
import { ToastService } from '../shared/toast';
import { ratingEvents } from './rating.events';
import { DessertIdToRatingMap, RatingService } from './rating.service';

export const RatingsStore = signalStore(
  { providedIn: 'root' },
  withState({
    loading: false,
    ratings: {} as DessertIdToRatingMap,
    error: '',
  }),
  withProps(() => ({
    _ratingService: inject(RatingService),
    _toastService: inject(ToastService),
    _events: inject(Events),
  })),
  withReducer(
    on(ratingEvents.loadRatings, () => {
      return { loading: true };
    }),
    on(ratingEvents.loadRatingsSuccess, ({ payload }) => {
      return {
        ratings: payload.ratings,
        loading: false,
      };
    }),
    on(ratingEvents.updateRating, ({ payload }) => {
      return (state) => ({
        ratings: {
          ...state.ratings,
          [payload.dessertId]: payload.rating,
        },
      });
    }),
    on(ratingEvents.loadRatingsError, ({ payload }) => {
      return { 
        error: payload.error, 
        loading: false 
      };
    }),
  ),
  withEffects((store) => ({
    loadRatings$: store._events.on(ratingEvents.loadRatings).pipe(
      exhaustMap(() => store._ratingService.loadExpertRatings()),
      mapResponse({
        next: (ratings) => ratingEvents.loadRatingsSuccess({ ratings }),
        error: (error) =>
          ratingEvents.loadRatingsError({ error: String(error) }),
      }),
    ),
  })),
);
