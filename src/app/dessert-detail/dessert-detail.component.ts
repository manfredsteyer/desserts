/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnChanges, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { DessertDetailStore } from '../data/dessert-detail.store';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dessert-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './dessert-detail.component.html',
  styleUrl: './dessert-detail.component.css'
})
export class DessertDetailComponent implements OnChanges {
  store = inject(DessertDetailStore);
  fb = inject(FormBuilder);

  formGroup = this.fb.nonNullable.group({
    englishName: [''],
    originalName: [''],
    description: [''],
    kcal: [0],
  });

  dessert = this.store.dessert;
  loading = this.store.loading;

  id = input.required({
    transform: numberAttribute
  });

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.dessert());
    });
  }

  ngOnChanges(): void {
    const id = this.id();
    this.store.load(id);
  }

}
