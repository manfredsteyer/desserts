import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

import { Dispatcher } from '@ngrx/signals/events';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ToastService } from '../shared/toast';
import { Dessert, initDessert } from './dessert';
import { DessertDetailFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { dessertDetailStoreEvents } from './dessert-detail.events';

export const DessertDetailStore = signalStore(
  { providedIn: 'root' },
  withState({
    filter: {
      dessertId: 0,
    },
    dessert: initDessert,
    processing: false,
    error: undefined as unknown,
  }),
  withProps(() => ({
    _dessertService: inject(DessertService),
    _toastService: inject(ToastService),
    _dispatcher: inject(Dispatcher)
  })),
  withMethods((store) => ({
    load: rxMethod<DessertDetailFilter>(
      pipe(
        tap(() => patchState(store, { processing: true })),
        switchMap((filter) => store._dessertService.findById(filter.dessertId)),
        tapResponse({
          next: (dessert) => {
            patchState(store, { dessert });
            patchState(store, { processing: false });
          },
          error: (error) => {
            patchState(store, { error });
            patchState(store, { processing: false });
          },
        }),
      ),
    ),
    save(id: number, dessert: Partial<Dessert>): void {
      patchState(store, {
        error: undefined,
        processing: true,
      });

      store._dessertService.save(id, dessert).subscribe({
        next: (savedDessert) => {
          patchState(store, { dessert: savedDessert });
          patchState(store, { processing: false });
          
          const event = dessertDetailStoreEvents.dessertUpdated({
            dessert: savedDessert
          });
          store._dispatcher.dispatch(event);

          store._toastService.show('Successfully saved!');
        },
        error: (error: unknown) => {
          patchState(store, { error });
          patchState(store, { processing: false });
          store._toastService.show('Error saving dessert!');
        },
      });
    },
  })),
);
