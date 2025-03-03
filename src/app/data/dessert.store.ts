import { Injectable, inject, signal, computed, resource } from "@angular/core";
import { debounceTrue } from "../shared/resource-utils";
import { Dessert } from "./dessert";
import { DessertService } from "./dessert.service";
import { RatingService, DessertIdToRatingMap } from "./rating.service";
import { getErrorMessage } from "../shared/get-error-message";
import { DessertFilter } from "./dessert-filter";
import { debounceSignal } from "../shared/debounce-signal";

type Requested = undefined | true;

@Injectable({ providedIn: 'root' })
export class DessertStore {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);

  readonly originalName = signal('');
  readonly englishName = signal('');

  #ratingsRequested = signal<Requested>(undefined);

  #dessertsCriteria = computed(() => ({
    originalName: this.originalName(),
    englishName: this.englishName(),
  }));

  #debouncedCriteria = debounceSignal(this.#dessertsCriteria, 300);

  #dessertsResource = resource({
    request: this.#debouncedCriteria,
    loader: (param) => {
      return this.#dessertService.findPromise(param.request!, param.abortSignal);
    }
  });

  #ratingsResource = resource({
    request: this.#ratingsRequested,
    loader: () => {
      return this.#ratingService.loadExpertRatingsPromise();
    }
  });

  readonly desserts = computed(() => this.#dessertsResource.value() ?? []);
  readonly ratings = computed(() => this.#ratingsResource.value() ?? {});
  readonly ratedDesserts = computed(() => toRated(this.desserts(), this.ratings()));

  readonly loading = debounceTrue(() => this.#ratingsResource.isLoading() || this.#dessertsResource.isLoading(), 500);
  readonly error = computed(() => getErrorMessage(this.#dessertsResource.error() || this.#ratingsResource.error()));

  loadRatings(): void {
    this.#ratingsRequested.set(true);
    this.#ratingsResource.reload();
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
