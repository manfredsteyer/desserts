import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DessertsComponent implements OnInit {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);

  #toastService = inject(ToastService);

  originalName = signal('');
  englishName = signal('');
  loading = signal(false);

  desserts = signal<Dessert[]>([]);
  ratings = signal<DessertIdToRatingMap>({});
  ratedDesserts = computed(() => this.toRated(this.desserts(), this.ratings()));

  constructor() {
    effect(() => {
      console.log('originalName', this.originalName());
      console.log('englishName', this.englishName());
    });

    this.originalName.set('Sacher');
    this.englishName.set('Cake');

    setTimeout(() => {
      this.originalName.set('Kaiser');
      this.englishName.set('Mess');
    }, 3000);

    effect(() => {
      this.#toastService.show(this.desserts().length + ' desserts loaded!');
    });
  }

  async ngOnInit() {
    this.search();
  }

  async search() {
    const filter: DessertFilter = {
      originalName: this.originalName(),
      englishName: this.englishName(),
    };

    try {
      this.loading.set(true);
      const desserts = await this.#dessertService.findPromise(filter);
      this.desserts.set(desserts);
    }
    finally {
      this.loading.set(false);
    }
  }

  toRated(desserts: Dessert[], ratings: DessertIdToRatingMap): Dessert[] {
    return desserts.map((d) =>
      ratings[d.id] ? { ...d, rating: ratings[d.id] } : d,
    );
  }

  async loadRatings() {
    try {
      this.loading.set(true);
      const ratings = await this.#ratingService.loadExpertRatings();
      this.ratings.set(ratings);
    }
    finally {
      this.loading.set(false);
    }
  }

  updateRating(id: number, rating: number): void {
    this.ratings.update((ratings) => ({
      ...ratings,
      [id]: rating,
    }));
  }
}
