import { Routes } from '@angular/router';
import { DessertsComponent } from './desserts/desserts.component';
import { AboutComponent } from './about/about.component';

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
    path: 'about',
    component: AboutComponent,
  },
];
