import { Component, ElementRef, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartWidgetComponent } from '../chart-widget.component';
import { TelemetryService } from '../../../services/telemetry.service';
import { TestDataService } from '../../../services/test-data.service';

@Component({
  selector: 'app-pie-chart-widget',
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
export class PieChartWidgetComponent extends ChartWidgetComponent {
  // NgxCharts options
  animations: boolean = true;
  labels: boolean = true;
  doughnut: boolean = false;
  explodeSlices: boolean = false;
  gradient: boolean = false;
  
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
    // Transform time series data to pie chart format
    if (data && data.length > 0 && data[0].series && data[0].series.length > 0) {
      // For pie charts, we want to show the latest value for each metric
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
    this.labels = config.labels !== undefined ? config.labels : true;
    this.doughnut = config.doughnut !== undefined ? config.doughnut : false;
    this.explodeSlices = config.explodeSlices !== undefined ? config.explodeSlices : false;
    this.gradient = config.gradient !== undefined ? config.gradient : false;
  }
}
