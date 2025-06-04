import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DessertStore } from '../data/dessert.store';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DessertsComponent {
  #store = inject(DessertStore);

  originalName = this.#store.originalName;
  englishName = this.#store.englishName;
  loading = this.#store.loading;
  error = this.#store.error;

  ratedDesserts = this.#store.ratedDesserts;

  loadRatings(): void {
    this.#store.loadRatings();
  }

  updateRating(id: number, rating: number): void {
    this.#store.updateRating(id, rating);
  }
}
