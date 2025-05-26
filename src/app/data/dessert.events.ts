import { eventGroup } from '@ngrx/signals/events'; 
import { type } from '@ngrx/signals';
import { Dessert } from './dessert';
import { DessertIdToRatingMap } from './rating.service';

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
    loadRatings: type<void>,
    loadRatingsSuccess: type<{
        ratings: DessertIdToRatingMap
    }>(),
    updateRating: type<{
        dessertId: number,
        rating: number
    }>(),
    loadRatingsError: type<{
        error: string
    }>(),
  },
});