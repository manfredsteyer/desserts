import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { DessertFilter } from '../data/dessert-filter';
import { DessertService } from '../data/dessert.service';
import { DessertIdToRatingMap, RatingService } from '../data/rating.service';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { ToastService } from '../shared/toast';
import { httpResource } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DessertsComponent implements OnInit {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);
  #toastService = inject(ToastService);

  originalName = signal('');
  englishName = signal('');

  dessertsResource = this.#dessertService.findResource(this.originalName, this.englishName)

  desserts = this.dessertsResource.value;
  errors = this.dessertsResource.error;
  isLoading = this.dessertsResource.isLoading;

  ratings = signal<DessertIdToRatingMap>({});
  ratedDesserts = computed(() => this.toRated(this.desserts(), this.ratings()));

  loading = signal(false);

  constructor() {
    effect(() => {
      this.logStuff();

      // Never call biz logic in an effect
      // this.service.deleteStuff()
      //    userId(), loading()
    });

    effect(() => {
      this.#toastService.show(this.desserts().length + ' loaded ...');
    });
  }

  private logStuff() {
    console.log('originalName', this.originalName());
    console.log('englishName', this.englishName());
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.dessertsResource.reload();
  }

  loadRatings(): void {
    this.loading.set(true);

    this.#ratingService.loadExpertRatings().subscribe({
      next: (ratings) => {
        this.ratings.set(ratings);
        this.loading.set(false);
      },
      error: (error) => {
        this.#toastService.show('Error loading ratings!');
        console.error(error);
        this.loading.set(false);
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
