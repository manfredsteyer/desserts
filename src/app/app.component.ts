import { Component } from '@angular/core';
import { ToastComponent } from './shared/toast';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, RouterLink, ToastComponent, ToastComponent],
})
export class AppComponent {
  title = 'dessert';
}
