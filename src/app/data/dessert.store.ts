import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withProps, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { ToastService } from '../shared/toast';
import { Dessert } from './dessert';
import { dessertDetailStoreEvents } from './dessert-detail.events';
import { dessertEvents } from './dessert.events';
import { DessertService } from './dessert.service';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export const DessertStore = signalStore(
  { providedIn: 'root' },
  withState({
    filter: {
      originalName: '',
      englishName: '',
    },
    loading: false,
    desserts: [] as Dessert[],
    error: '',
  }),
  withProps(() => ({
    _dessertService: inject(DessertService),
    _toastService: inject(ToastService),
    _events: inject(Events),
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
    on(dessertEvents.loadDessertsError, ({ payload }) => {
      return {
        error: payload.error,
        loading: false,
      };
    }),
  ),
  withEffects((store) => ({
    loadDesserts$: store._events.on(dessertEvents.loadDesserts).pipe(
      switchMap((e) =>
        store._dessertService.find(e.payload).pipe(
          mapResponse({
            next: (desserts) => dessertEvents.loadDessertsSuccess({ desserts }),
            error: (error) =>
              dessertEvents.loadDessertsError({ error: String(error) }),
          }),
        ),
      ),
    ),
  })),
  withDevtools('DessertStore')
);
