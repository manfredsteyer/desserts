import { effect, Signal } from '@angular/core';
import { ToastService } from './toast';

export function displayErrorEffect(
  errorSignal: Signal<unknown>,
  toastService: ToastService,
) {
  effect(() => {
    const error = errorSignal();
    if (error) {
      toastService.show('Error loading data. Did you start the backend (npm start server)?');
      console.error('Error loading data', error);
    }
  });
}

export function getMessage(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message;
  }
  return String(error);
}
