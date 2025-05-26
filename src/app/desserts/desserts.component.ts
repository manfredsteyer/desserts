import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  linkedSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Dispatcher } from '@ngrx/signals/events';
import { dessertEvents } from '../data/dessert.events';
import { DessertStore } from '../data/dessert.store';
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
  #store = inject(DessertStore);
  #dispatcher = inject(Dispatcher);
  #toast = inject(ToastService);
  #dialog = inject(MatDialog);

  originalName = linkedSignal(() => this.#store.filter.originalName());
  englishName = linkedSignal(() => this.#store.filter.englishName());

  ratedDesserts = this.#store.ratedDesserts;
  loading = this.#store.loading;

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
    this.#dispatcher.dispatch(
      dessertEvents.loadRatings(() => {}),
    );
  }

  updateRating(dessertId: number, rating: number): void {
    this.#dispatcher.dispatch(
      dessertEvents.updateRating({
        dessertId,
        rating,
      })
    )
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
