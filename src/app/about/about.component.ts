import { Component, inject, PendingTasks, signal } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  initialized = signal(false);
  pendingTasks = inject(PendingTasks);
  
  constructor() {
    // Option 1: add()
    const timerTask = this.pendingTasks.add();

    timer(1000).subscribe(() => {
      this.initialized.set(true);
      timerTask();
    });

    // Option 2: run()
    this.pendingTasks.run(() => new Promise<void>(resolve => {
      timer(1000).subscribe(() => {
        this.initialized.set(true);
        resolve();
      });
    }));
  }
}
