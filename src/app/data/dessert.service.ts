import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom, map } from 'rxjs';
import { Dessert } from './dessert';

const dataFile = '/assets/desserts.json';

@Injectable({ providedIn: 'root' })
export class DessertService {

    #http = inject(HttpClient);

    find(originalName = '', englishName = ''): Observable<Dessert[]> {
        return this.#http.get<Dessert[]>(dataFile).pipe(
            map(result => result.filter(
                d => d.originalName.toLowerCase().includes(originalName.toLowerCase())
                    && d.englishName.toLowerCase().includes(englishName.toLowerCase())))
        );
    }

    findPromise(originalName: string, englishName: string): Promise<Dessert[]> {
        return lastValueFrom(this.find(originalName, englishName));
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