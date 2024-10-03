/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnChanges, effect, inject, input, numberAttribute, signal, untracked } from '@angular/core';
import { DessertDetailStore } from '../data/dessert-detail.store';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { Dessert } from '../data/dessert';
import { DessertService } from '../data/dessert.service';
import { explicitEffect } from '../shared/explicit-effect';

@Component({
  selector: 'app-dessert-detail',
  standalone: true,
  imports: [JsonPipe, RouterLink, ReactiveFormsModule],
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

    console.log('a', this.store.c.a());

    effect(() => {
      this.formGroup.patchValue(this.dessert());
    });

    // effect(() => {
    //   const id = this.id();
    //   this.store.load(id);
    //     // loading(), userId()
    // })

    this.store.rxLoad(this.id);

    // effect(() => {
    //   const id = this.id();
    //   untracked(() => {
    //     this.store.load(id);
    //   });
    // })

    explicitEffect(this.id, (id) => {
      this.store.load(id);
    })


  }

  ngOnChanges(): void {
    const id = this.id();
    this.store.load(id);
  }

}
