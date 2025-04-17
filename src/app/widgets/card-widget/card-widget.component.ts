import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { WidgetBaseComponent } from '../widget-base/widget-base.component';
import { TelemetryService } from '../../services/telemetry.service';
import { TestDataService } from '../../services/test-data.service';

interface SeriesItem {
  name: Date;
  value: number;
}

@Component({
  selector: 'app-card-widget',
  templateUrl: './card-widget.component.html',
  styleUrls: ['./card-widget.component.scss'],
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule]
})
export class CardWidgetComponent extends WidgetBaseComponent {
  // Card options
  value: number = 0;
  units: string = '';
  icon: string = 'assessment';
  backgroundColor: string = '#5AA454';
  textColor: string = '#ffffff';
  decimals: number = 1;
  
  // Trend data
  trendValue: number = 0;
  trendDirection: 'up' | 'down' | 'stable' = 'stable';
  trendHistory: number[] = [];
  
  constructor(
    protected override elementRef: ElementRef,
    protected override telemetryService: TelemetryService,
    protected override testDataService: TestDataService,
    protected override cdr: ChangeDetectorRef
  ) {
    super(elementRef, telemetryService, testDataService, cdr);
  }
  
  protected override initWidget(): void {
    super.initWidget();
    this.updateCardOptions();
    this.loadData();
  }
  
  protected override handleData(data: any[]): void {
    if (data && data.length > 0) {
      // If we have multiple metrics, just use the first one for the card
      const firstMetric = data[0];
      
      if (firstMetric.series && firstMetric.series.length > 0) {
        // Extract the series data
        const series = firstMetric.series as SeriesItem[];
        
        // Get the latest value
        const latestValue = series[series.length - 1].value;
        this.value = latestValue;
        
        // Calculate trend if we have enough data points
        if (series.length > 1) {
          // Get previous value
          const previousValue = series[series.length - 2].value;
          
          // Calculate trend percentage
          if (previousValue !== 0) {
            this.trendValue = ((latestValue - previousValue) / previousValue) * 100;
          } else {
            this.trendValue = 0;
          }
          
          // Determine trend direction
          if (this.trendValue > 0.5) {
            this.trendDirection = 'up';
          } else if (this.trendValue < -0.5) {
            this.trendDirection = 'down';
          } else {
            this.trendDirection = 'stable';
          }
          
          // Store history for sparkline
          this.trendHistory = series.map((item: SeriesItem) => item.value).slice(-10);
        }
      }
    } else {
      this.value = 0;
      this.trendValue = 0;
      this.trendDirection = 'stable';
      this.trendHistory = [];
    }
    
    this.cdr.detectChanges();
  }
  
  private updateCardOptions(): void {
    const config = this.widget.config;
    if (!config) return;
    
    // Update card options from config
    this.units = config.units || '';
    this.icon = config.icon || 'assessment';
    this.backgroundColor = config.color || '#5AA454';
    this.textColor = config.textColor || '#ffffff';
    this.decimals = config.decimals !== undefined ? config.decimals : 1;
  }
  
  getTrendIcon(): string {
    switch (this.trendDirection) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }
  
  getTrendClass(): string {
    switch (this.trendDirection) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      default: return 'trend-stable';
    }
  }
  
  formatValue(value: number): string {
    return value.toFixed(this.decimals);
  }
}
