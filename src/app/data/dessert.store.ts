import { Injectable, computed, inject, signal } from '@angular/core';
import { Dessert } from './dessert';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { DessertIdToRatingMap, RatingService } from './rating.service';
import { toRated } from './to-rated';

@Injectable({ providedIn: 'root' })
export class DessertStore {

    #dessertService = inject(DessertService);

    // When working with lightweight stores
    // rating could be put in a store of itself.
    #ratingService = inject(RatingService);

    #state = signal({
        filter: {
            originalName: '',
            englishName: '',
        },
        ratings: {} as DessertIdToRatingMap,
        desserts: [] as Dessert[],
    });

    readonly originalName = computed(() => this.#state().filter.originalName);
    readonly englishName = computed(() => this.#state().filter.englishName);

    readonly desserts = computed(() => this.#state().desserts);
    readonly ratings = computed(() => this.#state().ratings);
    readonly ratedDesserts = computed(() => toRated(this.desserts(), this.ratings()));

    updateFilter(filter: DessertFilter): void {
        this.#state.update(state => ({ ...state, filter }));
    }

    async loadDesserts(): Promise<void> {
        const desserts = await this.#dessertService.findPromise(this.#state().filter);
        this.#state.update(state => ({ ...state, desserts }));
    }

    async loadRatings(): Promise<void> {
        const ratings = await this.#ratingService.loadExpertRatings();
        this.#state.update(state => ({
            ...state,
            ratings
        }));
    }

    updateRating(id: number, rating: number): void {
        this.#state.update(state => ({
            ...state,
            ratings: {
                ...state.ratings,
                [id]: rating
            }
        }));
    }
}
