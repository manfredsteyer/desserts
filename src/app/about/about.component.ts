import { Component, effect } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  counter$ = interval(1000);
  counter = toSignal(this.counter$);

  constructor() {
    this.counter$.pipe(takeUntilDestroyed()).subscribe((c) => {
      console.log('counter$', c);
    });

    effect(() => {
      console.log('counter', this.counter());
    });
  }
}
