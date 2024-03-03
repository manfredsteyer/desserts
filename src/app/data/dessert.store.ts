import { Injectable, computed, inject, signal } from '@angular/core';
import { Dessert } from './dessert';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { DessertIdToRatingMap, RatingService } from './rating.service';
import { toRated } from './to-rated';
import { ToastService } from '../shared/toast';

@Injectable({ providedIn: 'root' })
export class DessertStore {
  #dessertService = inject(DessertService);

  // When working with lightweight stores
  // rating could be put in a store of itself.
  #ratingService = inject(RatingService);

  #toastService = inject(ToastService);

  #state = signal({
    filter: {
      originalName: '',
      englishName: '',
    },
    loading: false,
    ratings: {} as DessertIdToRatingMap,
    desserts: [] as Dessert[],
  });

  readonly originalName = computed(() => this.#state().filter.originalName);
  readonly englishName = computed(() => this.#state().filter.englishName);

  readonly desserts = computed(() => this.#state().desserts);
  readonly ratings = computed(() => this.#state().ratings);

  readonly loading = computed(() => this.#state().loading);

  readonly ratedDesserts = computed(() =>
    toRated(this.desserts(), this.ratings()),
  );

  updateFilter(filter: DessertFilter): void {
    this.#state.update((state) => ({ ...state, filter }));
  }

  loadDesserts(): void {
    this.#state.update((state) => ({ ...state, loading: true }));

    this.#dessertService.find(this.#state().filter).subscribe({
      next: (desserts) => {
        this.#state.update((state) => ({
          ...state,
          desserts,
          loading: false
        }));
      },
      error: (error) => {
        this.#state.update((state) => ({
          ...state,
          loading: false
        }));
        this.#toastService.show('Error loading desserts!');
        console.error(error);
      }
    });
  }

  loadRatings(): void {
    this.#state.update((state) => ({ ...state, loading: true }));

    this.#ratingService.loadExpertRatings().subscribe({
      next: (ratings) => {
        this.#state.update((state) => ({
          ...state,
          ratings,
          loading: false
        }));
      },
      error: (error) => {
        this.#toastService.show('Error loading ratings!');
        console.error(error);
        this.#state.update((state) => ({
          ...state,
          loading: false
        }));
      }
    });
  }

  updateRating(id: number, rating: number): void {
    this.#state.update((state) => ({
      ...state,
      ratings: {
        ...state.ratings,
        [id]: rating,
      },
    }));
  }
}
