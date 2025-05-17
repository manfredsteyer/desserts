import { Component, effect, inject } from '@angular/core';
import { DessertDetailStore } from '../data/dessert-detail.store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dessert-detail',
    imports: [ReactiveFormsModule],
    templateUrl: './dessert-detail.component.html',
    styleUrl: './dessert-detail.component.css'
})
export class DessertDetailComponent {
  store = inject(DessertDetailStore);
  fb = inject(FormBuilder);
  dialogData = inject(MAT_DIALOG_DATA);
  dialogRef= inject(MatDialogRef);

  formGroup = this.fb.nonNullable.group({
    englishName: [''],
    originalName: [''],
    description: [''],
    kcal: [0],
  });

  dessert = this.store.dessert;
  loading = this.store.processing;

  id = this.dialogData.id;

  constructor() {
    this.store.load({ dessertId: this.id });

    effect(() => {
      this.formGroup.patchValue(this.dessert());
    });
  }

  save(): void {
    const dessert: Partial<Dessert> = this.formGroup.value;
    this.store.save(this.id, dessert);
    this.dialogRef.close();
  }

}
