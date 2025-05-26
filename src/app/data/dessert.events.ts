import { eventGroup } from '@ngrx/signals/events'; 
import { type } from '@ngrx/signals';
import { Dessert } from './dessert';

export const dessertEvents = eventGroup({
  source: 'Dessert Feature',
  events: {
    loadDesserts: type<{
        originalName: string,
        englishName: string,
    }>(),
    loadDessertsSuccess: type<{
        desserts: Dessert[]
    }>(),
    loadDessertsError: type<{
        error: string
    }>(),
  },
});