import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAppErrorHandler } from './shared/app-error-handler';
import { ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withComponentInputBinding(),
    ),
    provideHttpClient(),
    provideAppErrorHandler(),
    importProvidersFrom(ReactiveFormsModule),
  ],
};
