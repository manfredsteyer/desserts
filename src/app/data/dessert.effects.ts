import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStoreFeature } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { dessertEvents } from './dessert.events';
import { DessertService } from './dessert.service';

export function withDessertEffects() {
  return signalStoreFeature(
    withEffects(
      (
        _store,
        dessertService = inject(DessertService),
        events = inject(Events),
      ) => ({
        loadDesserts$: events.on(dessertEvents.loadDesserts).pipe(
          switchMap((e) =>
            dessertService.find(e.payload).pipe(
              mapResponse({
                next: (desserts) =>
                  dessertEvents.loadDessertsSuccess({ desserts }),
                error: (error) =>
                  dessertEvents.loadDessertsError({ error: String(error) }),
              }),
            ),
          ),
        ),
      }),
    ),
  );
}
