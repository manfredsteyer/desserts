import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, inject, resource } from '@angular/core';
import { Observable } from 'rxjs';
import { toPromise } from '../shared/to-promise';
import { BASE_URL } from './base-url';
import { Dessert, initDessert } from './dessert';
import { DessertDetailFilter, DessertFilter } from './dessert-filter';

@Injectable({ providedIn: 'root' })
export class DessertService {
  #http = inject(HttpClient);

  save(id: number, dessert: Partial<Dessert>): Observable<Dessert> {
    const url = `${BASE_URL}/desserts/${id}`;
    return this.#http.patch<Dessert>(url, dessert);
  }

  find(params: DessertFilter): Observable<Dessert[]> {
    const url = `${BASE_URL}/desserts`;
    return this.#http.get<Dessert[]>(url, { params });
  }

  findPromise(
    filter: DessertFilter,
    abortSignal?: AbortSignal,
  ): Promise<Dessert[]> {
    return toPromise(this.find(filter), abortSignal);
  }

  findById(id: number): Observable<Dessert> {
    const url = `${BASE_URL}/desserts/${id}`;
    return this.#http.get<Dessert>(url);
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
