import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { DessertService } from './data/dessert.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'desserts',
    renderMode: RenderMode.Server,
    headers: {
      'X-Secret': 'Manfred was here!',
    },
    status: 201,
  },
  {
    path: 'desserts/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
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
