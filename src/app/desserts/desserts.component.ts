import { Component, OnInit, inject } from '@angular/core';
import { DessertService } from '../data/dessert.service';
import { Dessert } from '../data/dessert';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../data/rating.service';
import { DessertFilter } from '../data/dessert-filter';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule, JsonPipe],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css'
})
export class DessertsComponent implements OnInit {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);

  originalName = '';
  englishName = '';

  desserts: Dessert[] = [];

  async ngOnInit() {
    this.search();
  }

  async search() {
    const filter: DessertFilter = {
      originalName: this.originalName,
      englishName: this.englishName
    };
    const desserts = await this.#dessertService.findPromise(filter);
  
    this.desserts = desserts;
  }

  async loadRatings() {
    const ratings = await this.#ratingService.loadExpertRatings();
    for (const d of this.desserts) {
      if (ratings[d.id]) {
        d.rating = ratings[d.id];
      }
    }
  }

  updateRating(id: number, rating: number): void {
    console.log('rating changed', id, rating);
  }
}
