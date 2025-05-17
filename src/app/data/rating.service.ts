import { Injectable, resource } from '@angular/core';
import { Observable, of } from 'rxjs';
import { toPromise } from '../shared/to-promise';
import { Requested } from './requested';

export type DessertIdToRatingMap = Record<number, number>;

@Injectable({ providedIn: 'root' })
export class RatingService {
  loadExpertRatings(): Observable<DessertIdToRatingMap> {
    return of({
      10: 500,
    });
  }
  loadExpertRatingsPromise(
    abortSignal?: AbortSignal,
  ): Promise<DessertIdToRatingMap> {
    return toPromise(this.loadExpertRatings(), abortSignal);
  }

  createResource(requested: () => Requested) {
    return resource({
      request: requested,
      loader: (params) => {
        const abortSignal = params.abortSignal;
        return this.loadExpertRatingsPromise(abortSignal);
      },
    });
  }
}
