import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DessertsComponent } from './desserts/desserts.component';

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
