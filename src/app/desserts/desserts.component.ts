import { Component, computed, inject, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { DessertService } from '../data/dessert.service';
import { DessertIdToRatingMap, RatingService } from '../data/rating.service';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { ToastService } from '../shared/toast';
import { wait } from '../shared/wait';
import { debounceTrue } from '../shared/resource-utils';

@Component({
    selector: 'app-desserts',
    imports: [DessertCardComponent, FormsModule],
    templateUrl: './desserts.component.html',
    styleUrl: './desserts.component.css'
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

  dessertsResource = resource({
    request: this.dessertsCriteria,
    loader: async (param) => {
      await wait(300, param.abortSignal);
      return await this.#dessertService.findPromise(param.request, param.abortSignal);
    }
  });

  desserts = computed(() => this.dessertsResource.value() ?? []);

  loading = debounceTrue(this.dessertsResource.isLoading, 300);
  error = this.dessertsResource.error;

  ratings = signal<DessertIdToRatingMap>({});
  ratedDesserts = computed(() => this.toRated(this.desserts(), this.ratings()));

  loadingRatings = signal(false);

  toRated(desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] {
    return desserts.map((d) =>
      ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
    );
  }

  loadRatings(): void {
    this.loadingRatings.set(true);

    this.#ratingService.loadExpertRatings().subscribe({
      next: (ratings) => {
        this.ratings.set(ratings);
        this.loadingRatings.set(false);
      },
      error: (error) => {
        this.#toastService.show('Error loading ratings!');
        console.error(error);
        this.loadingRatings.set(false);
      },
    });
  }

  updateRating(id: number, rating: number): void {
    this.ratings.update((ratings) => ({
      ...ratings,
      [id]: rating,
    }));
  }
}
