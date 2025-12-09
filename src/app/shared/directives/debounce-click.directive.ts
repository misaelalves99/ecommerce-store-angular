// src/app/shared/directives/debounce-click.directive.ts

import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[appDebounceClick]',
})
export class DebounceClickDirective implements OnDestroy {
  /**
   * Tempo de debounce em milissegundos.
   * Ex: <button [debounceTime]="400" (appDebounceClick)="...">
   */
  @Input()
  debounceTime = 300;

  /**
   * Evento emitido após o tempo de debounce.
   */
  @Output()
  appDebounceClick = new EventEmitter<MouseEvent>();

  private clicks$ = new Subject<MouseEvent>();
  private subscription: Subscription;

  constructor() {
    this.subscription = this.clicks$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((event) => {
        this.appDebounceClick.emit(event);
      });
  }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicks$.next(event);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
