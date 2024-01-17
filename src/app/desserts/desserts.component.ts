import { Component, OnInit, inject, signal } from '@angular/core';
import { DessertService } from '../data/dessert-service';
import { Dessert } from '../data/dessert';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [RatingComponent],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css'
})
export class DessertsComponent implements OnInit {
  #dessertService = inject(DessertService);
  
  desserts = signal<Dessert[]>([]);

  async ngOnInit() {
    const desserts = await this.#dessertService.findPromise('', '')
    this.desserts.set(desserts);
  }



}
