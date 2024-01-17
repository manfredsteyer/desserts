import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom, map } from 'rxjs';
import { Dessert } from './dessert';

const dataFile = '/assets/desserts.json';

@Injectable({ providedIn: 'root' })
export class DessertService {

    #http = inject(HttpClient);

    find(name: string, englishName: string): Observable<Dessert[]> {
        return this.#http.get<Dessert[]>(dataFile).pipe(
            map(result => result.filter(
                d => d.name.includes(name)
                    && d.englishName.includes(englishName)))
        );
    }

    findPromise(name: string, englishName: string): Promise<Dessert[]> {
        return lastValueFrom(this.find(name, englishName));
    }

    findById(id: number): Observable<Dessert[]> {
        return this.#http.get<Dessert[]>(dataFile).pipe(
            map(result => result.filter(d => d.id == id))
        );
    }

    findPromiseById(id: number): Promise<Dessert[]> {
        return lastValueFrom(this.findById(id));
    }
}