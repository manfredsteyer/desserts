import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { DessertService } from './data/dessert.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'desserts/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dessertService = inject(DessertService);
      const ids = await dessertService.findIdsPromise();
      return ids.map((id) => ({ id: String(id) }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
