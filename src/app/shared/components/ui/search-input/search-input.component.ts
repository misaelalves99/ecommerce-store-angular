// src/app/shared/components/ui/search-input/search-input.component.ts

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-search-input',
  imports: [CommonModule],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Buscar...';
  @Input() debounceMs = 300;
  @Input() value = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (this.value) {
      this.search.emit(this.value);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  onInputChange(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.valueChange.emit(newValue);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.search.emit(this.value);
    }, this.debounceMs);
  }

  onClear(): void {
    this.value = '';
    this.valueChange.emit('');
    this.search.emit('');
  }
}
