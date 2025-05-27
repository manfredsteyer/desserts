import { signalStoreFeature, type } from "@ngrx/signals";
import { DessertState } from "./dessert.state";
import { on, withReducer } from "@ngrx/signals/events";
import { dessertDetailStoreEvents } from "./dessert-detail.events";
import { dessertEvents } from "./dessert.events";

export function withDessertReducer() {
  return signalStoreFeature(
    {
      state: type<DessertState>()
    },
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
  );
}
