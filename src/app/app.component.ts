import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DessertsComponent } from './desserts/desserts.component';
import { ToastComponent } from './shared/toast';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,
        RouterLink,
        ToastComponent,
        ToastComponent
    ]
})
export class AppComponent {
  title = 'dessert';
}
