import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Dispatcher } from '@ngrx/signals/events';
import { dessertEvents } from '../data/dessert.events';
import { DessertStore } from '../data/dessert.store';
import { ratingEvents } from '../data/rating.events';
import { RatingsStore } from '../data/ratings.store';
import { toRated } from '../data/to-rated';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { DessertDetailComponent } from '../dessert-detail/dessert-detail.component';
import { ToastService } from '../shared/toast';

@Component({
  selector: 'app-desserts',
  imports: [DessertCardComponent, FormsModule],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DessertsComponent {
  #dessertStore = inject(DessertStore);
  #ratingStore = inject(RatingsStore);
  #dispatcher = inject(Dispatcher);

  #toast = inject(ToastService);
  #dialog = inject(MatDialog);

  originalName = linkedSignal(() => this.#dessertStore.filter.originalName());
  englishName = linkedSignal(() => this.#dessertStore.filter.englishName());

  loading = computed(
    () => this.#dessertStore.loading() || this.#ratingStore.loading(),
  );
  ratedDesserts = computed(() =>
    toRated(this.#dessertStore.desserts(), this.#ratingStore.ratings()),
  );

  constructor() {
    this.loadDesserts();

    effect(() => {
      const count = this.ratedDesserts().length;
      if (count > 0) {
        this.#toast.show(count + ' desserts loaded');
      }
    });
  }

  loadDesserts(): void {
    this.#dispatcher.dispatch(
      dessertEvents.loadDesserts({
        originalName: this.originalName(),
        englishName: this.englishName(),
      }),
    );
  }

  loadRatings(): void {
    this.#dispatcher.dispatch(ratingEvents.loadRatings(() => {}));
  }

  updateRating(dessertId: number, rating: number): void {
    this.#dispatcher.dispatch(
      ratingEvents.updateRating({
        dessertId,
        rating,
      }),
    );
  }

  showDetail(id: number) {
    this.#dialog.open(DessertDetailComponent, {
      width: '500px',
      data: {
        id,
      },
    });
  }
}
