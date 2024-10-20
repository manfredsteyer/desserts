import { Injectable, inject, signal, computed } from "@angular/core";
import { timer, switchMap } from "rxjs";
import { rxSkipInitial, debounceTrue } from "../shared/resource-utils";
import { rxResource } from "../shared/resource/rx-resource";
import { Dessert } from "./dessert";
import { DessertService } from "./dessert.service";
import { RatingService, DessertIdToRatingMap } from "./rating.service";
import { getErrorMessage } from "../shared/get-error-message";
import { DessertFilter } from "./dessert-filter";

@Injectable({ providedIn: 'root' })
export class DessertStore {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);

  readonly originalName = signal('');
  readonly englishName = signal('');

  #dessertsCriteria = computed(() => ({
    originalName: this.originalName(),
    englishName: this.englishName(),
  }));

  #dessertsResource = rxResource({
    request: this.#dessertsCriteria,
    loader: (param) => {
      return timer(300).pipe(switchMap(() => this.#dessertService.find(param.request)));
    }
  });

  #ratingsResource = rxResource({
    loader: rxSkipInitial(() => {
      return this.#ratingService.loadExpertRatings()
    })
  });

  readonly desserts = computed(() => this.#dessertsResource.value() ?? []);
  readonly ratings = computed(() => this.#ratingsResource.value() ?? {});
  readonly ratedDesserts = computed(() => toRated(this.desserts(), this.ratings()));

  readonly loading = debounceTrue(() => this.#ratingsResource.isLoading() || this.#dessertsResource.isLoading(), 500);
  readonly error = computed(() => getErrorMessage(this.#dessertsResource.error() || this.#ratingsResource.error()));

  loadRatings(): void {
    this.#ratingsResource.refresh();
  }

  updateFilter(filter: DessertFilter): void {
    this.originalName.set(filter.originalName);
    this.englishName.set(filter.englishName);
  }

  updateRating(id: number, rating: number): void {
    this.#ratingsResource.update((ratings) => ({
      ...ratings,
      [id]: rating,
    }));
  }
}

function toRated(desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] {
  return desserts.map((d) =>
    ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
  );
}
