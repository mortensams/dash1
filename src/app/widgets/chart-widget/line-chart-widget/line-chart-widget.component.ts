import { Component, ElementRef, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartWidgetComponent } from '../chart-widget.component';
import { TelemetryService } from '../../../services/telemetry.service';
import { TestDataService } from '../../../services/test-data.service';

@Component({
  selector: 'app-line-chart-widget',
  standalone: true,
  imports: [CommonModule, ChartWidgetComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allow custom elements like ngx-charts
  template: `
    <app-chart-widget>
      <div class="chart-container">
        <!-- Display basic data information instead of chart for now -->
        <div class="chart-info">
          <div *ngFor="let series of chartData; let i = index" class="series-item">
            <div class="series-color" [style.background-color]="getSeriesColor(i)"></div>
            <strong>{{series.name}}:</strong> 
            <span>{{getLatestValue(series) | number:'1.0-1'}}</span>
            <span class="trend-indicator" [class.up]="getTrend(series) > 0" [class.down]="getTrend(series) < 0">
              {{ getTrend(series) > 0 ? '↑' : (getTrend(series) < 0 ? '↓' : '→') }}
            </span>
          </div>
        </div>
      </div>
    </app-chart-widget>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chart-info {
      text-align: left;
      font-size: 16px;
      line-height: 1.5;
      width: 100%;
      padding: 16px;
    }
    .series-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .series-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      margin-right: 8px;
    }
    .trend-indicator {
      margin-left: 8px;
      font-weight: bold;
    }
    .trend-indicator.up {
      color: green;
    }
    .trend-indicator.down {
      color: red;
    }
  `]
})
export class LineChartWidgetComponent extends ChartWidgetComponent {
  // NgxCharts options
  curve: any = 'linear';
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'Value';
  timeline: boolean = false;
  autoScale: boolean = true;
  gradient: boolean = false;
  showGridLines: boolean = true;
  roundDomains: boolean = false;
  
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
    this.updateChartOptions();
  }
  
  private updateChartOptions(): void {
    const config = this.widget.config;
    if (!config) return;
    
    // Update all options from the config
    this.curve = config.curve || 'linear';
    this.animations = config.animations !== undefined ? config.animations : true;
    this.xAxis = config.xAxis !== undefined ? config.xAxis : true;
    this.yAxis = config.yAxis !== undefined ? config.yAxis : true;
    this.showXAxisLabel = config.showXAxisLabel !== undefined ? config.showXAxisLabel : true;
    this.showYAxisLabel = config.showYAxisLabel !== undefined ? config.showYAxisLabel : true;
    this.xAxisLabel = config.xAxisLabel || 'Time';
    this.yAxisLabel = config.yAxisLabel || 'Value';
    this.timeline = config.timeline !== undefined ? config.timeline : false;
    this.autoScale = config.autoScale !== undefined ? config.autoScale : true;
    this.gradient = config.gradient !== undefined ? config.gradient : false;
    this.showGridLines = config.showGridLines !== undefined ? config.showGridLines : true;
    this.roundDomains = config.roundDomains !== undefined ? config.roundDomains : false;
  }

  // Helper functions for the template
  getSeriesColor(index: number): string {
    const colors = [
      '#5AA454', '#A10A28', '#C7B42C', '#AAAAAA',
      '#4D8FB8', '#7D51A1', '#FB8281', '#F4D25A'
    ];
    return colors[index % colors.length];
  }

  getLatestValue(series: any): number {
    if (!series || !series.series || !series.series.length) return 0;
    return series.series[series.series.length - 1].value;
  }

  getTrend(series: any): number {
    if (!series || !series.series || series.series.length < 2) return 0;
    
    const lastValue = series.series[series.series.length - 1].value;
    const previousValue = series.series[series.series.length - 2].value;
    
    if (previousValue === 0) return 0;
    return (lastValue - previousValue) / previousValue;
  }
}
