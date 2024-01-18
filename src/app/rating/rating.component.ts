import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

const maxRatingInCheatMode = 500;

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnChanges {
  @Input({ required: true })
  rating = 0;

  @Output()
  ratingChange = new EventEmitter<number>();

  maxRating = 5;
  stars: Array<boolean> = [];

  ngOnChanges(): void {
    if (this.rating > this.maxRating) {
      this.maxRating = maxRatingInCheatMode;
    } 
    this.#updateStars();
  }

  #updateStars() {
    this.stars = new Array<boolean>(this.maxRating);
    for (let i = 0; i < this.maxRating; i++) {
      this.stars[i] = (i < this.rating);
    }
  }

  rate(rating: number): void {
    this.rating = rating;
    this.#updateStars();
    this.ratingChange.next(rating);
  }

  enterCheatMode() {
    this.maxRating = maxRatingInCheatMode;
    this.#updateStars();
  }

}
