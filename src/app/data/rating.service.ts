import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { toPromise } from '../shared/to-promise';

export type DessertIdToRatingMap = Record<number, number>;

@Injectable({ providedIn: 'root' })
export class RatingService {
  loadExpertRatings(): Observable<DessertIdToRatingMap> {
    return of({
      10: 500,
    });
  }
  loadExpertRatingsPromise(abortSignal?: AbortSignal): Promise<DessertIdToRatingMap> {
    return toPromise(this.loadExpertRatings(), abortSignal);
  }
}
