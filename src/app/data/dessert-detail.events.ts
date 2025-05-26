import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events'; 
import { Dessert } from './dessert';

export const dessertDetailStoreEvents = eventGroup({
  source: 'Dessert Detail Store',
  events: {
    dessertUpdated: type<{
        dessert: Dessert
    }>(),
  },
});