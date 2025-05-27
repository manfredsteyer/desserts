import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { DessertIdToRatingMap } from './rating.service';

export const ratingEvents = eventGroup({
  source: '',
  events: {
    loadRatings: type<void>(),
    loadRatingsSuccess: type<{
      ratings: DessertIdToRatingMap;
    }>(),
    updateRating: type<{
      dessertId: number;
      rating: number;
    }>(),
    loadRatingsError: type<{
      error: string;
    }>(),
  },
});
