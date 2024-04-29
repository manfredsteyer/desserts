/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnChanges, effect, inject, input, numberAttribute, untracked } from '@angular/core';
import { DessertDetailStore } from '../data/dessert-detail.story';
import { explicitEffect } from '../shared/explicit-effect';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

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
    // Option 1
    // const id = this.id();
    // this.store.load(id);
  }

  // Option 2
  // constructor() {
  //   this.store.rxLoad(this.id);
  // }

  // Option 3 - error demonstration
  // constructor() {
  //   // try to avoid this
  //   effect(() => {
  //     this.store.load(this.id());
  //   });
  // }

  // Option 3
  // constructor() {
  //   // try to avoid this
  //   effect(() => {
  //     const id = this.id();
  //     untracked(() => {
  //       this.store.load(id);
  //     });
  //   });
  // }

  // Option 4
  // constructor() {
  //   explicitEffect(this.id, (id) => {
  //     this.store.load(id);
  //   });
  // }

}
