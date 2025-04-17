import { Component, ElementRef, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartWidgetComponent } from '../chart-widget.component';
import { TelemetryService } from '../../../services/telemetry.service';
import { TestDataService } from '../../../services/test-data.service';

@Component({
  selector: 'app-bar-chart-widget',
  standalone: true,
  imports: [CommonModule, ChartWidgetComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allow custom elements like ngx-charts
  template: `
    <app-chart-widget>
      <div class="chart-container">
        <!-- Display basic data information instead of chart for now -->
        <div class="chart-info">
          <div *ngFor="let item of chartData">
            <strong>{{item.name}}:</strong> 
            <span>{{item.value | number:'1.0-1'}}</span>
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
      text-align: center;
      font-size: 16px;
      line-height: 1.5;
    }
  `]
})
export class BarChartWidgetComponent extends ChartWidgetComponent {
  // NgxCharts options
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Category';
  yAxisLabel: string = 'Value';
  barPadding: number = 8;
  groupPadding: number = 16;
  showDataLabel: boolean = false;
  showGridLines: boolean = true;
  roundDomains: boolean = false;
  gradient: boolean = false;
  noBarWhenZero: boolean = true;
  
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
  
  protected override handleData(data: any[]): void {
    // Transform time series data to bar chart format if needed
    if (data && data.length > 0 && data[0].series && data[0].series.length > 0) {
      // For bar charts, we might want to restructure the data
      // For example, showing the latest value for each metric
      const transformedData = data.map(series => {
        const latestData = series.series[series.series.length - 1];
        return {
          name: series.name,
          value: latestData.value
        };
      });
      this.chartData = transformedData;
    } else {
      this.chartData = data;
    }
    this.cdr.detectChanges();
  }
  
  private updateChartOptions(): void {
    const config = this.widget.config;
    if (!config) return;
    
    // Update all options from the config
    this.animations = config.animations !== undefined ? config.animations : true;
    this.xAxis = config.xAxis !== undefined ? config.xAxis : true;
    this.yAxis = config.yAxis !== undefined ? config.yAxis : true;
    this.showXAxisLabel = config.showXAxisLabel !== undefined ? config.showXAxisLabel : true;
    this.showYAxisLabel = config.showYAxisLabel !== undefined ? config.showYAxisLabel : true;
    this.xAxisLabel = config.xAxisLabel || 'Category';
    this.yAxisLabel = config.yAxisLabel || 'Value';
    this.barPadding = config.barPadding !== undefined ? config.barPadding : 8;
    this.showDataLabel = config.showDataLabel !== undefined ? config.showDataLabel : false;
    this.gradient = config.gradient !== undefined ? config.gradient : false;
    this.showGridLines = config.showGridLines !== undefined ? config.showGridLines : true;
    this.roundDomains = config.roundDomains !== undefined ? config.roundDomains : false;
    this.noBarWhenZero = config.noBarWhenZero !== undefined ? config.noBarWhenZero : true;
  }
  
  // Helper function for template
  getMaxValue(): number {
    if (!this.chartData || this.chartData.length === 0) return 100;
    return Math.max(...this.chartData.map(item => item.value)) || 100;
  }
}
