import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom, map } from 'rxjs';
import { Dessert } from './dessert';
import { DessertFilter } from './dessert-filter';

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

  findById(id: number): Observable<Dessert[]> {
    return this.#http
      .get<Dessert[]>(dataFile)
      .pipe(map((result) => result.filter((d) => d.id == id)));
  }

  findPromiseById(id: number): Promise<Dessert[]> {
    return lastValueFrom(this.findById(id));
  }
}
