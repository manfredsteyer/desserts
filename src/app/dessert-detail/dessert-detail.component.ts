/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnChanges, inject, input, numberAttribute } from '@angular/core';
import { DessertDetailStore } from '../data/dessert-detail.story';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dessert-detail',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  templateUrl: './dessert-detail.component.html',
  styleUrl: './dessert-detail.component.css'
})
export class DessertDetailComponent implements OnChanges {

  store = inject(DessertDetailStore);

  dessert = this.store.dessert;
  loading = this.store.loading;

  id = input.required({
    transform: numberAttribute
  });

  ngOnChanges(): void {
    const id = this.id();
    this.store.load(id);
  }
}
