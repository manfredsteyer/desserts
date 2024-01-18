import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
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
  styleUrl: './desserts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DessertsComponent implements OnInit {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);

  originalName = signal('');
  englishName = signal('');

  desserts = signal<Dessert[]>([]);

  maxRating = computed(() => this.desserts().reduce(
    (acc, d) => Math.max(acc, d.rating),
    0
  ));

  constructor() {
    effect(() => {
      console.log('originalName', this.originalName());
      console.log('englishName', this.englishName());
    });

    effect(() => {
      this.originalName.set(this.englishName());
    }, { allowSignalWrites: true });
  }

  async ngOnInit() {
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

  async loadRatings() {
    const ratings = await this.#ratingService.loadExpertRatings();

    this.desserts.update(desserts => desserts.map(
      d => ratings[d.id] ?
        { ...d, rating: ratings[d.id] } :
        d
    ));
  }

  updateRating(id: number, rating: number): void {
    this.desserts.update(desserts => desserts.map(
      d => (d.id === id) ?
        { ...d, rating: rating } :
        d
    ));
  }
}
