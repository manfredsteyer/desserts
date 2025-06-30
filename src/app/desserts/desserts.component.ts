import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { DessertService } from '../data/dessert.service';
import { DessertIdToRatingMap, RatingService } from '../data/rating.service';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { ToastService } from '../shared/toast';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DessertsComponent {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);
  #toastService = inject(ToastService);

  originalName = signal('');
  englishName = signal('');

  criteria = computed(() => ({
    originalName: this.originalName(),
    englishName: this.englishName(),
  }));

  dessertResource = this.#dessertService.findResource(this.criteria);

  desserts = this.dessertResource.value;
  ratings = signal<DessertIdToRatingMap>({});
  ratedDesserts = computed(() => this.toRated(this.desserts(), this.ratings()));
  
  isLoadingRatings = signal(false);

  loading = this.dessertResource.isLoading;
  error = this.dessertResource.error;

  search(): void {
  }

  loadRatings(): void {
    this.isLoadingRatings.set(true);

    this.#ratingService.loadExpertRatings().subscribe({
      next: (ratings) => {
        this.ratings.set(ratings);
        this.isLoadingRatings.set(false);
      },
      error: (error) => {
        this.#toastService.show('Error loading ratings!');
        console.error(error);
        this.isLoadingRatings.set(false);
      },
    });
  }

  toRated(desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] {
    return desserts.map((d) =>
      ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
    );
  }

  updateRating(id: number, rating: number): void {
    this.ratings.update(r => ({
      ...r,
      [id]: rating
    }));
  }
}
