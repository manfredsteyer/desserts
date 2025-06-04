import { computed, inject, resource } from '@angular/core';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { displayErrorEffect } from '../shared/display-error-effect';
import { ToastService } from '../shared/toast';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { RatingService } from './rating.service';
import { toRated } from './to-rated';

export type Requested = undefined | true;

export const DessertStore = signalStore(
  { providedIn: 'root' },
  withState({
    filter: {
      originalName: '',
      englishName: 'Cake',
    },
    ratingsRequested: undefined as Requested
  }),
  withProps(() => ({
    _dessertService: inject(DessertService),
    _ratingService: inject(RatingService),
    _toastService: inject(ToastService),
  })),
  withProps((store) => ({
    _dessertsResource: resource({
      params: store.filter,
      loader: (loaderParams) => {
        const filter = loaderParams.params;
        const abortSignal = loaderParams.abortSignal;
        return store._dessertService.findPromise(filter, abortSignal);
      },
    }),
    _ratingsResource: resource({
      params: store.ratingsRequested,
      loader: (loaderParams) => {
        const abortSignal = loaderParams.abortSignal;
        return store._ratingService.loadExpertRatingsPromise(abortSignal);
      },
    }),
  })),
  withProps((store) => ({
    dessertsResource: store._dessertsResource.asReadonly(),
    ratingsResource: store._ratingsResource.asReadonly(),
  })),
  withComputed((store) => ({
    ratedDesserts: computed(() =>
      toRated(store._dessertsResource.value(), store._ratingsResource.value()),
    ),
    loading: computed(
      () =>
        store._dessertsResource.isLoading() ||
        store._dessertsResource.isLoading(),
    ),
  })),
  withMethods((store) => ({
    updateFilter: signalMethod<DessertFilter>((filter) => {
      patchState(store, { filter });
    }),
    loadRatings: () => {
      patchState(store, { ratingsRequested: true });
      store._ratingsResource.reload();
    },
    updateRating: (id: number, rating: number) => {
      store._ratingsResource.update((ratings) => ({
        ...ratings,
        [id]: rating,
      }));
    },
  })),
  withHooks({
    onInit(store) {
      const toastService = store._toastService;
      const dessertsError = store._dessertsResource.error;
      const ratingsError = store._ratingsResource.error;

      displayErrorEffect(dessertsError, toastService);
      displayErrorEffect(ratingsError, toastService);
    },
  }),
);
