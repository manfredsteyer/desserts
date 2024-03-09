import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DessertFilter } from '../data/dessert-filter';
import { DessertStore } from '../data/dessert.store';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { FormUpdateDirective } from '../shared/form-update.directive';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule, JsonPipe, FormUpdateDirective],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DessertsComponent {
  #store = inject(DessertStore);

  originalName = this.#store.filter.originalName;
  englishName = this.#store.filter.englishName;

  ratedDesserts = this.#store.ratedDesserts;
  loading = this.#store.loading;

  loadRatings(): void {
    this.#store.loadRatings();
  }

  updateRating(id: number, rating: number): void {
    this.#store.updateRating(id, rating);
  }

  updateFilter(filter: DessertFilter): void {
    this.#store.updateFilter(filter);
  }
}
