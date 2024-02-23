import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DessertStore } from '../data/dessert.store';
import { DessertFilter } from '../data/dessert-filter';
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

  originalName = this.#store.originalName;
  englishName = this.#store.englishName;

  ratedDesserts = this.#store.ratedDesserts;

  constructor() {
    this.#store.loadDesserts();
  }

  async search() {
    this.#store.loadDesserts();
  }

  async loadRatings() {
    this.#store.loadRatings();
  }

  updateRating(id: number, rating: number): void {
    this.#store.updateRating(id, rating);
  }

  updateFilter(filter: DessertFilter): void {
    this.#store.updateFilter(filter);
  }
}
