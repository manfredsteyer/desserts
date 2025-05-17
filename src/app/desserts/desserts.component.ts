import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DessertStore } from '../data/dessert.store';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { ToastService } from '../shared/toast';

@Component({
    selector: 'app-desserts',
    imports: [DessertCardComponent, FormsModule],
    templateUrl: './desserts.component.html',
    styleUrl: './desserts.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DessertsComponent {
  #store = inject(DessertStore);
  #toast = inject(ToastService);

  originalName = linkedSignal(() => this.#store.filter.originalName());
  englishName = linkedSignal(() => this.#store.filter.englishName());

  ratedDesserts = this.#store.ratedDesserts;
  loading = this.#store.loading;

  #linkedFilter = computed(() => ({
    originalName: this.originalName(),
    englishName: this.englishName()
  }));

  constructor() {
    this.#store.updateFilter(this.#linkedFilter);

    effect(() => {
      const count = this.ratedDesserts().length;
      if (count > 0) {
        this.#toast.show(count + ' desserts loaded')
      }
    });
  }

  loadRatings(): void {
    this.#store.loadRatings();
  }

  updateRating(id: number, rating: number): void {
    this.#store.updateRating(id, rating);
  }
}
