import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import {
  signalStore,
  withProps,
  withState,
} from '@ngrx/signals';
import { Events } from '@ngrx/signals/events';
import { ToastService } from '../shared/toast';
import { Dessert } from './dessert';
import { DessertService } from './dessert.service';
import { DessertState } from './dessert.state';
import { withDessertReducer } from './dessert.reducer';
import { withDessertEffects } from './dessert.effects';

export const DessertStore = signalStore(
  { providedIn: 'root' },
  withState<DessertState>({
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
  withDessertReducer(),
  withDessertEffects(),
  withDevtools('DessertStore'),
);
