import { Component, OnChanges, inject, input, numberAttribute } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DessertDetailStore } from '../data/dessert-detail.store';
import { FormsModule } from '@angular/forms';
import { deepLink, flatten } from '../shared/linked-utils';

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

  dessert = deepLink(this.loadedDessert);

  ngOnChanges(): void {
    const id = this.id();
    this.store.load(id);
  }

  save(): void {
    const dessert = flatten(this.dessert);
    this.store.save(dessert);
  }

}
