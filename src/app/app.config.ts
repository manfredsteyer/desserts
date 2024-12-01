import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAppErrorHandler } from './shared/app-error-handler';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withComponentInputBinding()
    ),
    provideHttpClient(
      withFetch(),
    ),
    provideClientHydration(withEventReplay()),
    provideAppErrorHandler(),
  ],
};
