import { Signal } from "@angular/core";
import { toSignal, toObservable } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";

export function delaySignal<T>(source: Signal<T>, timeMsec: number): Signal<T> {
  return toSignal(toObservable(source).pipe(debounceTime(timeMsec)), {
    initialValue: source(),
  });
}
