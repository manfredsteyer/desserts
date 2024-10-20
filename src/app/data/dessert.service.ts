import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom, map } from 'rxjs';
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

  findPromise(filter: DessertFilter): Promise<Dessert[]> {
    return lastValueFrom(this.find(filter));
  }

  findById(id: number): Observable<Dessert | undefined> {
    return this.#http
      .get<Dessert[]>(dataFile)
      .pipe(map((result) => result.find((d) => d.id == id)));
  }

  findPromiseById(id: number, abortSignal?: AbortSignal): Promise<Dessert | undefined> {
    return toPromise(this.findById(id), abortSignal);
  }
}
