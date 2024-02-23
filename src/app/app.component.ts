import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DessertsComponent } from './desserts/desserts.component';
import { ToastComponent } from './shared/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, DessertsComponent, ToastComponent],
})
export class AppComponent {
  title = 'dessert';
}
