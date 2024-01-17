import { Injectable } from '@angular/core';

export type DessertIdToRatingMap = Record<number, number>;

@Injectable({ providedIn: 'root' })
export class RatingService {
    async loadExpertRatings(): Promise<DessertIdToRatingMap> {
        return Promise.resolve({
            10: 500
        });
    }
}
