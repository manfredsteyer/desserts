import { Component, input, output } from '@angular/core';
import { Dessert } from '../data/dessert';
import { RatingComponent } from '../rating/rating.component';

@Component({
    selector: 'app-dessert-card',
    imports: [RatingComponent],
    templateUrl: './dessert-card.component.html',
    styleUrl: './dessert-card.component.css'
})
export class DessertCardComponent {
  dessert = input.required<Dessert>();

  ratingChange = output<number>();

  updateRating(newRating: number): void {
    this.ratingChange.emit(newRating);
  }
}
