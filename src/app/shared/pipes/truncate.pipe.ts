// src/app/shared/pipes/truncate.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    maxLength: number = 80,
    completeWords: boolean = true,
    ellipsis: string = '…',
  ): string {
    if (!value) return '';
    if (value.length <= maxLength) return value;

    let truncated = value.slice(0, maxLength);

    if (completeWords) {
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 0) {
        truncated = truncated.slice(0, lastSpace);
      }
    }

    return `${truncated}${ellipsis}`;
  }
}
