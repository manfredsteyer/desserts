import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DessertsComponent } from './desserts/desserts.component';
import { DessertDetailComponent } from './dessert-detail/dessert-detail.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'desserts',
  },
  {
    path: 'desserts',
    component: DessertsComponent,
  },
  {
    path: 'desserts/:id',
    component: DessertDetailComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];
