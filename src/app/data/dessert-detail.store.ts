import { inject } from '@angular/core';
import {
  patchState,
  signalMethod,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { DessertService } from './dessert.service';
import { DessertDetailFilter } from './dessert-filter';


export const DessertDetailStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState({
    filter: {
      dessertId: 0,
    },
    loading: false,
  }),
  withProps(() => ({
    _dessertService: inject(DessertService),
  })),
  withProps((store) => ({
    _dessertResource: store._dessertService.createResourceById(store.filter)
  })),
  withProps((store) => ({
    dessertResource: store._dessertResource.asReadonly()
  })),
  withMethods((store) => ({
    updateFilter: signalMethod<DessertDetailFilter>((filter) => {
      patchState(store, { filter });
    }),
  })),
);
