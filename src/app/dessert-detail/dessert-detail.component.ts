import { Component, OnChanges, effect, inject, input, numberAttribute } from '@angular/core';
import { DessertDetailStore } from '../data/dessert-detail.store';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';

@Component({
    selector: 'app-dessert-detail',
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
  loading = this.store.processing;

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
    this.store.load({ dessertId: id });
  }

  save(): void {
    const dessert: Partial<Dessert> = this.formGroup.value;
    this.store.save(this.id(), dessert);
  }

}
