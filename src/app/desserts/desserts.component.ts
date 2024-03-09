import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { DessertFilter } from '../data/dessert-filter';
import { DessertService } from '../data/dessert.service';
import { DessertIdToRatingMap, RatingService } from '../data/rating.service';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { ToastService } from '../shared/toast';

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
  #toastService = inject(ToastService);

  originalName = '';
  englishName = '';
  loading = false;

  desserts: Dessert[] = [];

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    const filter: DessertFilter = {
      originalName: this.originalName,
      englishName: this.englishName,
    };

    this.loading = true;

    this.#dessertService.find(filter).subscribe({
      next: (desserts) => {
        this.desserts = desserts;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.#toastService.show('Error loading desserts!');
        console.error(error);
      },
    });
  }

  toRated(desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] {
    return desserts.map((d) =>
      ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
    );
  }

  loadRatings(): void {
    this.loading = true;

    this.#ratingService.loadExpertRatings().subscribe({
      next: (ratings) => {
        const rated = this.toRated(this.desserts, ratings);
        this.desserts = rated;
        this.loading = false;
      },
      error: (error) => {
        this.#toastService.show('Error loading ratings!');
        console.error(error);
        this.loading = false;
      },
    });
  }

  updateRating(id: number, rating: number): void {
    console.log('rating changed', id, rating);
  }
}
