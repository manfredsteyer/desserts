import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { DessertIdToRatingMap, RatingService } from '../data/rating.service';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { ToastService } from '../shared/toast';
import { DessertStore } from '../data/dessert.store';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DessertsComponent implements OnInit {

  #ratingService = inject(RatingService);
  #toastService = inject(ToastService);

  #dessertStore = inject(DessertStore);

  originalName = linkedSignal(() => this.#dessertStore.originalName());
  englishName = linkedSignal(() => this.#dessertStore.englishName());

  criteria = computed(() => ({
    originalName: this.originalName(),
    englishName: this.englishName(),
  }));

  desserts = this.#dessertStore.desserts;

  ratings = signal<DessertIdToRatingMap>({});
  ratedDesserts = computed(() => this.toRated(this.desserts(), this.ratings()));
  
  isLoadingRatings = signal(false);

  loading = this.#dessertStore.loading;
  error = this.#dessertStore.error;

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.#dessertStore.load(this.criteria());
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
