import { HttpErrorResponse } from '@angular/common/http';
import {
  EnvironmentProviders,
  ErrorHandler,
  Injectable,
  NgZone,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { ToastService } from './toast';

@Injectable({ providedIn: 'root' })
export class AppErrorHandler extends ErrorHandler {
  #toastService = inject(ToastService);
  #zone = inject(NgZone);

  override handleError(error: unknown): void {
    this.#zone.run(() => {
      if (error instanceof HttpErrorResponse) {
        this.#toastService.show('Error during backend communication.');
      } else {
        this.#toastService.show('Unexpected error.');
      }
    });
    super.handleError(error);
  }
}

export function provideAppErrorHandler(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ]);
}
