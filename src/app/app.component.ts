import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DessertsComponent } from "./desserts/desserts.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, DessertsComponent]
})
export class AppComponent {
  title = 'dessert';
}
