import { Dessert } from './dessert';
import { DessertIdToRatingMap } from './rating.service';

export function toRated(
  desserts: Dessert[],
  ratings: DessertIdToRatingMap,
): Dessert[] {
  return desserts.map((d) =>
    ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
  );
}
