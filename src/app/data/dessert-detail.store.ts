import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { DessertService } from './dessert.service';
import { Dessert, initDessert } from './dessert';

@Injectable({ providedIn: 'root' })
export class DessertDetailStore {
  #dessertService = inject(DessertService);
  
  #id = signal<number | undefined>(undefined);

  #dessertResource = resource({
    params: computed(() => ({ id: this.#id() })),
    loader: async (loaderParams) => {
      const id = loaderParams.params.id;
      if (id) {
        const result = await this.#dessertService.findPromiseById(id);
        return result || initDessert;
      }
      else {
        return Promise.resolve(initDessert);
      }
    },
    defaultValue: initDessert
  });

  readonly dessert = this.#dessertResource.value;
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
