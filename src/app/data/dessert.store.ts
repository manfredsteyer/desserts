import { Injectable, computed, inject, signal } from '@angular/core';
import { Dessert } from './dessert';
import { DessertFilter } from './dessert-filter';
import { DessertService } from './dessert.service';
import { RatingService } from './rating.service';

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
        desserts: [] as Dessert[],
    });

    readonly originalName = computed(() => this.#state().filter.originalName);
    readonly englishName = computed(() => this.#state().filter.englishName);

    readonly desserts = computed(() => this.#state().desserts);

    readonly maxRating = computed(() => this.desserts().reduce(
        (acc, d) => Math.max(acc, d.rating),
        0
    ));

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
            desserts: state.desserts.map(
                d => ratings[d.id] ?
                    { ...d, rating: ratings[d.id] } :
                    d
            )
        }));
    }

    updateRating(id: number, rating: number): void {
        this.#state.update(state => ({
            ...state,
            desserts: state.desserts.map(
                d => (d.id === id) ?
                    { ...d, rating: rating } :
                    d
            )
        }));
    }
}
