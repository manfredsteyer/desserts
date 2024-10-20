import { Injectable, inject, signal, computed, effect } from "@angular/core";
import { timer, switchMap } from "rxjs";
import { linkedSignal } from "../shared/linked/linked";
import { rxSkipInitial, debounceTrue } from "../shared/resource-utils";
import { rxResource } from "../shared/resource/rx-resource";
import { ToastService } from "../shared/toast";
import { Dessert } from "./dessert";
import { DessertService } from "./dessert.service";
import { RatingService, DessertIdToRatingMap } from "./rating.service";

@Injectable({ providedIn: 'root' })
export class DessertStore {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);
  #toastService = inject(ToastService);

  originalName = signal('');
  englishName = signal('');

  dessertsCriteria = computed(() => ({
    originalName: this.originalName(),
    englishName: this.englishName(),
  }));

  dessertsResource = rxResource({
    request: this.dessertsCriteria,
    loader: (param) => {
      return timer(300).pipe(switchMap(() => this.#dessertService.find(param.request)));
    }
  });

  desserts = computed(() => this.dessertsResource.value() ?? []);

  ratingsResource = rxResource({
    loader: rxSkipInitial(() => {
      return this.#ratingService.loadExpertRatings()
    })
  });

  ratings = linkedSignal(() => this.ratingsResource.value() ?? {});
  ratedDesserts = computed(() => this.toRated(this.desserts(), this.ratings()));

  loading = debounceTrue(() => this.ratingsResource.isLoading() || this.dessertsResource.isLoading(), 500);
  error = computed(() => getErrorMessage(this.dessertsResource.error() || this.ratingsResource.error()));

  constructor() {
    effect(() => {
      const error = this.error();
      if (error) {
        this.#toastService.show('Error: ' + error);
      }
    });
  }

  toRated(desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] {
    return desserts.map((d) =>
      ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
    );
  }

  loadRatings(): void {
    this.ratingsResource.refresh();
  }

  updateRating(id: number, rating: number): void {
    this.ratings.update((ratings) => ({
      ...ratings,
      [id]: rating,
    }));
  }
}
