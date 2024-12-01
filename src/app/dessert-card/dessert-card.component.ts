import { afterNextRender, Component, input, output, signal } from '@angular/core';
import { Dessert } from '../data/dessert';
import { RatingComponent } from '../rating/rating.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dessert-card',
  standalone: true,
  imports: [RatingComponent, RouterLink],
  templateUrl: './dessert-card.component.html',
  styleUrl: './dessert-card.component.css',
})
export class DessertCardComponent {
  dessert = input.required<Dessert>();
  ratingChange = output<number>();

  hydrated = signal(false);

  constructor() {
    afterNextRender(() => {
      this.hydrated.set(true);
    });
  }

  updateRating(newRating: number): void {
    this.ratingChange.emit(newRating);
  }
}
