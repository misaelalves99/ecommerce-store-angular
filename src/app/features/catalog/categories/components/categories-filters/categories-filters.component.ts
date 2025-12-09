// src/app/features/catalog/categories/components/categories-filters/categories-filters.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SearchInputComponent } from '../../../../../shared/components/ui/search-input/search-input.component';

@Component({
  standalone: true,
  selector: 'app-categories-filters',
  imports: [CommonModule, SearchInputComponent],
  templateUrl: './categories-filters.component.html',
  styleUrls: ['./categories-filters.component.css'],
})
export class CategoriesFiltersComponent {
  @Input() search = '';

  @Output() searchChange = new EventEmitter<string>();

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }
}
