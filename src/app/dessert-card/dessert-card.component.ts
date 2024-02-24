import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  effect,
  input,
} from '@angular/core';
import { Dessert } from '../data/dessert';
import { RatingComponent } from '../rating/rating.component';
import { injectCdBlink } from '../shared/inject-cd-blink';

@Component({
  selector: 'app-dessert-card',
  standalone: true,
  imports: [RatingComponent],
  templateUrl: './dessert-card.component.html',
  styleUrl: './dessert-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DessertCardComponent {
  dessert = input.required<Dessert>();
  blink = injectCdBlink();

  @Output()
  ratingChange = new EventEmitter<number>();

  constructor() {
    effect(() => {
      console.log('dessert', this.dessert().englishName, this.dessert().rating);
    });
  }

  updateRating(newRating: number): void {
    this.ratingChange.emit(newRating);
  }
}
