import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, lastValueFrom, map } from 'rxjs';
import { Dessert } from './dessert';
import { DessertFilter } from './dessert-filter';
import { toPromise } from '../shared/to-promise';

const dataFile = '/assets/desserts.json';

@Injectable({ providedIn: 'root' })
export class DessertService {
  #http = inject(HttpClient);

  find(filter: DessertFilter): Observable<Dessert[]> {
    return this.#http
      .get<Dessert[]>(dataFile)
      .pipe(
        map((result) =>
          result.filter(
            (d) =>
              d.originalName
                .toLowerCase()
                .includes(filter.originalName.toLowerCase()) &&
              d.englishName
                .toLowerCase()
                .includes(filter.englishName.toLowerCase()),
          ),
        ),
      );
  }

  findPromise(filter: DessertFilter, abortSignal: AbortSignal): Promise<Dessert[]> {
    return toPromise(this.find(filter), abortSignal);
  }

  findById(id: number): Observable<Dessert[]> {
    return this.#http
      .get<Dessert[]>(dataFile)
      .pipe(map((result) => result.filter((d) => d.id == id)));
  }

  findPromiseById(id: number): Promise<Dessert[]> {
    return lastValueFrom(this.findById(id));
  }
}
