// src/app/shared/directives/autofocus.directive.ts
import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements AfterViewInit {
  // aceita boolean OU string vazia (quando usado só como atributo)
  @Input() appAutofocus: boolean | '' = true;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    // se for explicitamente false, não foca
    if (this.appAutofocus === false) {
      return;
    }

    // pequeno delay pra garantir que o elemento já esteja renderizado
    setTimeout(() => {
      this.el.nativeElement?.focus();
    }, 0);
  }
}
