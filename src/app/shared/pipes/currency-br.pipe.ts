// src/app/shared/pipes/currency-br.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyBr',
  standalone: true,
})
export class CurrencyBrPipe implements PipeTransform {
  transform(value: unknown, currencyCode: string = 'BRL'): string {
    if (value === null || value === undefined) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currencyCode,
      }).format(0);
    }

    let numericValue: number | null = null;

    if (typeof value === 'number') {
      numericValue = value;
    } else if (typeof value === 'string') {
      const parsed = Number(value.replace(',', '.'));
      numericValue = Number.isNaN(parsed) ? 0 : parsed;
    } else if (typeof value === 'object') {
      // aceita objetos de domínio como Price { value } ou { amount }
      const anyValue = value as any;
      if (typeof anyValue.value === 'number') {
        numericValue = anyValue.value;
      } else if (typeof anyValue.amount === 'number') {
        numericValue = anyValue.amount;
      }
    }

    if (numericValue === null) {
      numericValue = 0;
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode,
    }).format(numericValue);
  }
}
