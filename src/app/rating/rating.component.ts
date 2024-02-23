import { Component, computed, model, signal } from '@angular/core';

const maxRatingInCheatMode = 500;

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class RatingComponent {
  rating = model.required<number>();

  cheatMode = signal(false);

  maxRating = computed(() =>
    this.cheatMode() || this.rating() > 5 ? maxRatingInCheatMode : 5,
  );
  stars = computed(() => this.toStars(this.rating(), this.maxRating()));

  private toStars(rating: number, maxRating: number): Array<boolean> {
    const stars = new Array<boolean>(rating);
    for (let i = 0; i < maxRating; i++) {
      stars[i] = i < rating;
    }
    return stars;
  }

  rate(rating: number): void {
    this.rating.set(rating);
  }

  enterCheatMode() {
    this.cheatMode.set(true);
  }
}
