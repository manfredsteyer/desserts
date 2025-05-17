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
import { Dessert } from './dessert';
import { ToastService } from '../shared/toast';

export const DessertDetailStore = signalStore(
  { providedIn: 'root' },
  withState({
    filter: {
      dessertId: 0,
    },
    processing: false,
    error: undefined as unknown
  }),
  withProps(() => ({
    _dessertService: inject(DessertService),
    _toastService: inject(ToastService),
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
    save(id: number, dessert: Partial<Dessert>): void {
        patchState(store, { 
            error: undefined,
            processing: true
        });

        store._dessertService.save(id, dessert).subscribe({
            next: (savedDessert) => {
                store._dessertResource.value.set(savedDessert);
                patchState(store, { processing: false });
                store._toastService.show('Successfully saved!');
            },
            error: (error: unknown) => {
                patchState(store, { error });
                patchState(store, { processing: false });
                store._toastService.show('Error saving dessert!');
            }
        });
    }
  })),
);
