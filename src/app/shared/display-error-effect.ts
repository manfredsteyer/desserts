import { effect, Signal } from '@angular/core';
import { ToastService } from './toast';

export function displayErrorEffect(
  errorSignal: Signal<unknown>,
  toastService: ToastService,
) {
  effect(() => {
    const error = errorSignal();
    if (error) {
      toastService.show('Error: ' + getMessage(error));
    }
  });
}

function getMessage(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message;
  }
  return String(error);
}
