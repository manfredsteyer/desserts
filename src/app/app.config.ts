import { ApplicationConfig, provideAppInitializer, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withComponentInputBinding()
    ),
    provideHttpClient(
      withFetch(),
    ),
    provideClientHydration(
      withIncrementalHydration(),
    ),
    provideExperimentalZonelessChangeDetection(),
    provideAppInitializer(() => {
      console.log('init application');
      // return Promise.resolve();
      return of();
    })
  ],
};
