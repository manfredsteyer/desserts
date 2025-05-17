import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, inject, resource } from '@angular/core';
import { Observable, map } from 'rxjs';
import { toPromise } from '../shared/to-promise';
import { Dessert, initDessert } from './dessert';
import { DessertDetailFilter, DessertFilter } from './dessert-filter';
import { BASE_URL } from './base-url';

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

  findPromise(
    filter: DessertFilter,
    abortSignal?: AbortSignal,
  ): Promise<Dessert[]> {
    return toPromise(this.find(filter), abortSignal);
  }

  findById(id: number): Observable<Dessert> {
    return this.#http
      .get<Dessert[]>(dataFile)
      .pipe(map((result) => result.filter((d) => d.id === id)[0]));
  }

  findPromiseById(id: number, abortSignal?: AbortSignal): Promise<Dessert> {
    return toPromise(this.findById(id), abortSignal);
  }

  _createResource(filter: () => DessertFilter) {
    return resource({
      request: filter,
      loader: (params) => {
        const filter = params.request;
        const abortSignal = params.abortSignal;
        return this.findPromise(filter, abortSignal);
      },
    });
  }

  createResource(filter: () => DessertFilter) {
    return httpResource<Dessert[]>(
      () => ({
        url: `${BASE_URL}/desserts`,
        params: {
          originalName_like: filter().originalName,
          englishName_like: filter().englishName,
        },
      }),
      {
        defaultValue: [],
      },
    );
  }

  _createResourceById(filter: () => DessertDetailFilter) {
    return resource({
      request: filter,
      loader: (params) => {
        const filter = params.request;
        const abortSignal = params.abortSignal;
        return this.findPromiseById(filter.dessertId, abortSignal);
      },
      defaultValue: initDessert,
    });
  }

  createResourceById(filter: () => DessertDetailFilter) {
    return httpResource<Dessert>(
      () => `${BASE_URL}/desserts/${filter().dessertId}`,
      {
        defaultValue: initDessert,
      },
    );
  }


}
