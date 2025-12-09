// src/app/shared/components/layout/metric-card/metric-card.component.ts

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type MetricTrend = 'up' | 'down' | 'neutral';

@Component({
  standalone: true,
  selector: 'app-metric-card',
  imports: [CommonModule],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css'],
})
export class MetricCardComponent {
  @Input() label = 'Métrica';
  @Input() value = '0';
  @Input() helper?: string;
  @Input() trend: MetricTrend = 'neutral';
  @Input() trendLabel?: string;
  @Input() icon?: string; // pode usar emoji ou ícone simples (ex: "🛒")

  get trendClass(): string {
    if (this.trend === 'up') return 'metric-card__trend--up';
    if (this.trend === 'down') return 'metric-card__trend--down';
    return 'metric-card__trend--neutral';
  }
}
