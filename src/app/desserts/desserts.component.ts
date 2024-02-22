import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DessertService } from '../data/dessert.service';
import { Dessert } from '../data/dessert';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DessertIdToRatingMap, RatingService } from '../data/rating.service';
import { DessertFilter } from '../data/dessert-filter';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule, JsonPipe],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DessertsComponent {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);

  originalName = signal('');
  englishName = signal('');

  desserts = signal<Dessert[]>([]);
  ratings = signal<DessertIdToRatingMap>({});
  ratedDesserts = computed(() => this.toRated(this.desserts(), this.ratings()));

  constructor() {
    this.search();
  }

  async search() {
    const filter: DessertFilter = {
      originalName: this.originalName(),
      englishName: this.englishName()
    };

    const desserts = await this.#dessertService.findPromise(filter);

    this.desserts.set(desserts);
  }

  toRated(desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] {
    return desserts.map(
      d => ratings[d.id] ?
        { ...d, rating: ratings[d.id] } :
        d
    );
  }

  async loadRatings() {
    const ratings = await this.#ratingService.loadExpertRatings();
    this.ratings.set(ratings);
  }

  updateRating(id: number, rating: number): void {
    this.ratings.update(ratings => ({
      ...ratings,
      [id]: rating
    }));
  }
}
