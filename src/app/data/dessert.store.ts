import { computed, effect, inject, resource, ResourceStatus } from '@angular/core';
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
import { ToastService } from '../shared/toast';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { RatingService } from './rating.service';
import { toRated } from './to-rated';
import { displayErrorEffect, getMessage } from '../shared/display-error-effect';

export const DessertStore = signalStore(
  { providedIn: 'root' },
  withState({
    filter: {
      originalName: '',
      englishName: 'Cake',
    },
  }),
  withProps(() => ({
    _dessertService: inject(DessertService),
    _ratingService: inject(RatingService),
    _toastService: inject(ToastService),
  })),
  withProps((store) => ({
    _dessertsResource: resource({
      request: store.filter,
      loader: (params) => {
        const filter = params.request;
        const abortSignal = params.abortSignal;
        return store._dessertService.findPromise(filter, abortSignal);
      },
    }),
    _ratingsResource: resource({
      loader: (params) => {
        if (params.previous.status === ResourceStatus.Idle) {
          return Promise.resolve(undefined);
        }
        const abortSignal = params.abortSignal;
        return store._ratingService.loadExpertRatingsPromise(abortSignal);
      }
    })
  })),
  withProps((store) => ({
    dessertsResource: store._dessertsResource.asReadonly(),
    ratingsResource: store._ratingsResource.asReadonly(),
  })),
  withComputed((store) => ({
    ratedDesserts: computed(() => toRated(
      store._dessertsResource.value(), 
      store._ratingsResource.value()
    )),
    loading: computed(() => store._dessertsResource.isLoading() || store._dessertsResource.isLoading())
  })),
  withMethods((store) => ({
    updateFilter: signalMethod<DessertFilter>((filter) => {
      patchState(store, { filter });
    }),
    loadRatings: () => {
      store._ratingsResource.reload();
    },
    updateRating: (id: number, rating: number) => {
      store._ratingsResource.update(ratings => ({
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

      effect(() => {
        const error = store._dessertsResource.error;
        if (error) {
          store._toastService.show('Error: ' + getMessage(error))
        }
      });

      displayErrorEffect(dessertsError, toastService);
      displayErrorEffect(ratingsError, toastService);
    }
  })
);
