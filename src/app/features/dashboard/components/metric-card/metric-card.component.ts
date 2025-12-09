// src/app/features/dashboard/components/metric-card/metric-card.component.ts

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-metric-card',
  imports: [CommonModule],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css'],
})
export class MetricCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() hint?: string;
}
