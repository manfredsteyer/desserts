import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Dessert, initDessert } from './dessert';
import { DessertDetailFilter, DessertFilter } from './dessert-filter';
import { BASE_URL } from './base-url';

@Injectable({ providedIn: 'root' })
export class DessertService {
  #http = inject(HttpClient);

  save(id: number, dessert: Partial<Dessert>): Observable<Dessert> {
    const url = `${BASE_URL}/desserts/${id}`;
    return this.#http.patch<Dessert>(url, dessert);
  }

  createResource(originalName: () => string, englishName: () => string) {
    return httpResource<Dessert[]>(
      () => ({
        url: `${BASE_URL}/desserts`,
        params: {
          originalName: originalName(),
          englishName: englishName(),
        },
      }),
      {
        defaultValue: [],
      },
    );
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
