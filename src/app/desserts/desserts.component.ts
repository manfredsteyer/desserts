import {
  Component,
  OnInit,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

import { httpResource } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { DessertFilter } from '../data/dessert-filter';
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
})
export class DessertsComponent implements OnInit {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);
  #toastService = inject(ToastService);

  originalName = signal('');
  englishName = signal('');
  loading = signal(false);

  criteria = computed(() => ({
    originalName: this.originalName(),
    englishName: this.englishName(),
  }));

  delayed = delaySignal(this.criteria, 300);

  dessertsResource = httpResource<Dessert[]>(
    () => ({
      url: 'http://localhost:3000/desserts',
      params: {
        originalName_like: this.delayed().originalName,
        englishName_like: this.delayed().englishName
      },
    }),
    { defaultValue: [] },
  );

  desserts = this.dessertsResource.value;
  error = this.dessertsResource.error;
  isLoading = this.dessertsResource.isLoading;

  ratings = signal<DessertIdToRatingMap>({});

  ratedDesserts = computed(() => this.toRated(this.desserts(), this.ratings()));

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    const filter: DessertFilter = {
      originalName: this.originalName(),
      englishName: this.englishName(),
    };

    this.loading.set(true);

    this.#dessertService.find(filter).subscribe({
      next: (desserts) => {
        this.desserts.set(desserts);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.#toastService.show('Error loading desserts!');
        console.error(error);
      },
    });
  }

  toRated(desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] {
    return desserts.map((d) =>
      ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
    );
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

  updateRating(id: number, rating: number): void {
    console.log('rating changed', id, rating);
  }
}

function delaySignal<T>(source: Signal<T>, timeMsec: number): Signal<T> {
  return toSignal(toObservable(source).pipe(debounceTime(timeMsec)), {
    initialValue: source(),
  });
}
