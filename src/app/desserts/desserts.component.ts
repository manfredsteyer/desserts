import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DessertService } from '../data/dessert.service';
import { Dessert } from '../data/dessert';
import { DessertCardComponent } from '../dessert-card/dessert-card.component';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DessertIdToRatingMap, RatingService } from '../data/rating.service';
import { combineLatest, debounceTime, filter, switchMap } from 'rxjs';

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
  englishName = signal('Cake');

  desserts = signal<Dessert[]>([]);
  ratings = signal<DessertIdToRatingMap>({});
  ratedDesserts = computed(() => this.toRated(this.desserts(), this.ratings()));

  originalName$ = toObservable(this.originalName);
  englishName$ = toObservable(this.englishName);

  desserts$ = combineLatest({
    originalName: this.originalName$,
    englishName: this.englishName$
  })
    .pipe(
      filter(c =>
        c.originalName.length >= 3
        || c.englishName.length >= 3),
      debounceTime(300),
      switchMap(c => this.#dessertService.find(c)),
      takeUntilDestroyed()
    );

  maxRating = computed(() => this.desserts().reduce(
    (acc, d) => Math.max(acc, d.rating),
    0
  ));

  constructor() {
  }

  async ngOnInit() {
    this.desserts$
      .subscribe(desserts => {

        // NOTE: For the sake of simplicity, we stick 
        // with a writable Signal for the time being, 
        // while toSignal would lead to a readonly Signal.
        // We will switch to unidirectional dataflow
        // and readonly Signals, when we talk about 
        // state management
        this.desserts.set(desserts);
      });  
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
