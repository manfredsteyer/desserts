/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnChanges, computed, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DessertDetailStore } from '../data/dessert-detail.store';
import { linkedSignal } from '../shared/linked/linked';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dessert-detail',
  standalone: true,
  imports: [JsonPipe, RouterLink, FormsModule],
  templateUrl: './dessert-detail.component.html',
  styleUrl: './dessert-detail.component.css'
})
export class DessertDetailComponent implements OnChanges {
  store = inject(DessertDetailStore);

  id = input.required({
    transform: numberAttribute
  });

  loadedDessert = this.store.dessert;
  loading = this.store.loading;
  error = this.store.error;

  dessert = {
    originalName: linkedSignal(() => this.loadedDessert().originalName),
    englishName: linkedSignal(() => this.loadedDessert().englishName),
    kcal: linkedSignal(() => this.loadedDessert().kcal)
  };

  ngOnChanges(): void {
    const id = this.id();
    this.store.load(id);
  }

  save(): void {
    const patch = {
      originalName: this.dessert.originalName(),
      englishName: this.dessert.englishName(),
      kcal: this.dessert.kcal(),
    }

    const dessert = {
      ...this.loadedDessert(),
      ...patch
    };

    this.store.save(dessert);
  }

}
