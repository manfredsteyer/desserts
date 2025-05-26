import { eventGroup } from '@ngrx/signals/events'; 
import { type } from '@ngrx/signals';
import { DessertFilter } from './dessert-filter';
import { Dessert } from './dessert';
import { DessertIdToRatingMap } from './rating.service';

export const dessertStoreEvents = eventGroup({
  source: 'Dessert Feature',
  events: {
    loadDesserts: type<{
        filter: DessertFilter
    }>(),
    loadDessertsSuccess: type<{
        desserts: Dessert[]
    }>(),
    loadDessertsError: type<{
        error: string
    }>(),
    loadRatings: type<void>,
    loadRatingsSuccess: type<{
        ratings: DessertIdToRatingMap
    }>(),
    loadRatingsError: type<{
        error: string
    }>(),
  },
});