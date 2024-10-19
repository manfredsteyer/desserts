import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { DessertService } from '../data/dessert.service';
import { DessertIdToRatingMap, RatingService } from '../data/rating.service';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { ToastService } from '../shared/toast';
import { debounceTrue, rxSkipInitial } from '../shared/resource-utils';
import { linkedSignal } from '../shared/linked/linked';
import { getErrorMessage } from '../shared/get-error-message';
import { rxResource } from '../shared/resource/rx-resource';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule, JsonPipe],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
})
export class DessertsComponent {
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
