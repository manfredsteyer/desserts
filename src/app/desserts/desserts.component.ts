import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DessertStore } from '../data/dessert.store';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { FormUpdateDirective } from '../shared/form-update.directive';

@Component({
    selector: 'app-desserts',
    imports: [DessertCardComponent, FormsModule],
    templateUrl: './desserts.component.html',
    styleUrl: './desserts.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DessertsComponent {
  #store = inject(DessertStore);

  originalName = linkedSignal(() => this.#store.filter.originalName());
  englishName = linkedSignal(() => this.#store.filter.englishName());

  ratedDesserts = this.#store.ratedDesserts;
  loading = this.#store.loading;

  #linkedFilter = computed(() => ({
    originalName: this.originalName(),
    englishName: this.englishName()
  }));

  constructor() {
    this.#store.updateFilter(this.#linkedFilter)
  }

  loadRatings(): void {
    this.#store.loadRatings();
  }

  updateRating(id: number, rating: number): void {
    this.#store.updateRating(id, rating);
  }
}
