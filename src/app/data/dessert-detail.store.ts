import { Injectable, computed, inject, signal } from '@angular/core';
import { resource } from '../shared/resource/resource';
import { DessertService } from './dessert.service';
import { Dessert, initDessert } from './dessert';

@Injectable({ providedIn: 'root' })
export class DessertDetailStore {
  #dessertService = inject(DessertService);
  
  #id = signal<number | undefined>(undefined);

  #dessertResource = resource({
    request: computed(() => ({ id: this.#id() })),
    loader: (param) => {
      const id = param.request.id;
      if (id) {
        return this.#dessertService.findPromiseById(id);
      }
      else {
        return Promise.resolve(initDessert);
      }
    },
  });

  readonly dessert = computed(() => this.#dessertResource.value() ?? initDessert);
  readonly loading = computed(() => this.#dessertResource.isLoading());
  readonly error = this.#dessertResource.error;

  #saving = signal(false);

  load(id: number): void {
    this.#id.set(id);
  }

  save(dessert: Dessert): void {
    try {
      this.#saving.set(true);
      console.log('saving', dessert);
      // TODO: HTTP Call
      // TODO: this.#dessertResource.set(dessert);
    }
    finally {
      this.#saving.set(false);
    }    
  }
}
