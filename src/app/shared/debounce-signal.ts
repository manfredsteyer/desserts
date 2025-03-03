import { Signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";

export function debounceSignal<T>(source: Signal<T>, timeMsec: number): Signal<T> {
    return toSignal(toObservable(source).pipe(debounceTime(timeMsec)), {
        initialValue: source()
    });
}
