import { computed, inject, linkedSignal, resource, ResourceStatus } from '@angular/core';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ToastService } from '../shared/toast';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { RatingService } from './rating.service';
import { toRated } from './to-rated';

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

  // Experiment
  withProps((store) => ({
    _loadingError: linkedSignal(() => store._dessertsResource.error() ?? store._dessertsResource.error()),
  })),
  withProps((store) => ({
    loadingError: store._loadingError.asReadonly()
  })),
  withMethods((store) => ({
    resetLoadingError() {
      store._loadingError.set(undefined);
    }
  })),
);
