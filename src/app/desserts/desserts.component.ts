import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { DessertFilter } from '../data/dessert-filter';
import { DessertService } from '../data/dessert.service';
import { DessertIdToRatingMap, RatingService } from '../data/rating.service';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule, JsonPipe],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
})
export class DessertsComponent implements OnInit {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);

  originalName = signal('');
  englishName = signal('');

  desserts = signal<Dessert[]>([]);

  async ngOnInit() {
    this.search();
  }

  async search() {
    const filter: DessertFilter = {
      originalName: this.originalName(),
      englishName: this.englishName(),
    };
    const desserts = await this.#dessertService.findPromise(filter);

    this.desserts.set(desserts);
  }

  toRated(desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] {
    return desserts.map((d) =>
      ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
    );
  }

  async loadRatings() {
    const ratings = await this.#ratingService.loadExpertRatings();
    const rated = this.toRated(this.desserts(), ratings);
    this.desserts.set(rated);
  }

  updateRating(id: number, rating: number): void {
    const ratings = { [id]: rating };
    const rated = this.toRated(this.desserts(), ratings);
    this.desserts.set(rated);
  }
}
