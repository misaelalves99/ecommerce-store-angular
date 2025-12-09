// src/app/shared/pipes/date-br.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

type DateBrFormat = 'date' | 'datetime' | 'time' | 'short';

@Pipe({
  name: 'dateBr',
  standalone: true,
  pure: true,
})
export class DateBrPipe implements PipeTransform {
  transform(
    value: Date | string | number | null | undefined,
    format: DateBrFormat = 'date',
  ): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const options = this.getOptions(format);
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  }

  private getOptions(format: DateBrFormat): Intl.DateTimeFormatOptions {
    switch (format) {
      case 'datetime':
        return {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        };
      case 'time':
        return {
          hour: '2-digit',
          minute: '2-digit',
        };
      case 'short':
        return {
          day: '2-digit',
          month: '2-digit',
        };
      case 'date':
      default:
        return {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        };
    }
  }
}
