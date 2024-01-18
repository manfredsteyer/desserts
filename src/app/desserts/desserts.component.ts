import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { DessertService } from '../data/dessert.service';
import { Dessert } from '../data/dessert';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../data/rating.service';
import { DessertFilter } from '../data/dessert-filter';
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { combineLatest, debounceTime, filter } from 'rxjs';

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

  originalName$ = toObservable(this.originalName);
  englishName$ = toObservable(this.englishName);

  criteria$ = combineLatest({
    originalName: this.originalName$,
    englishName: this.englishName$
  })
    .pipe(
      filter(c =>
        c.originalName.length >= 3
        || c.englishName.length >= 3),
      debounceTime(300)
    );

  criteria = toSignal(this.criteria$, {
    initialValue: {
      originalName: '',
      englishName: ''
    }
  });

  maxRating = computed(() => this.desserts().reduce(
    (acc, d) => Math.max(acc, d.rating),
    0
  ));

  constructor() {
    // NOTE: We will get rid of this effect 
    // later when switching to state management 
    // and separating reading and writing
    effect(() => {
      this.search();
    });
  }

  async ngOnInit() {
    console.log('init');
  }

  async search() {
    const { originalName, englishName } = this.criteria();

    const filter: DessertFilter = {
      originalName,
      englishName
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
