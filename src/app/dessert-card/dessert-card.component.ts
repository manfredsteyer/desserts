import { Component, Input } from '@angular/core';
import { Dessert } from '../data/dessert';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-dessert-card',
  standalone: true,
  imports: [RatingComponent],
  templateUrl: './dessert-card.component.html',
  styleUrl: './dessert-card.component.css'
})
export class DessertCardComponent {
  @Input({ required: true }) 
  dessert!: Dessert;
}
