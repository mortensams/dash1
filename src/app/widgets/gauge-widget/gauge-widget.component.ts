import { Component, ElementRef, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { WidgetBaseComponent } from '../widget-base/widget-base.component';
import { TelemetryService } from '../../services/telemetry.service';
import { TestDataService } from '../../services/test-data.service';

@Component({
  selector: 'app-gauge-widget',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allow custom elements like ngx-charts
  template: `
    <div class="gauge-widget-container">
      <div *ngIf="loading" class="loading-overlay">
        <mat-spinner diameter="50"></mat-spinner>
      </div>
      
      <div *ngIf="error" class="error-overlay">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-button color="primary" (click)="loadData()">Retry</button>
      </div>
      
      <div *ngIf="noData" class="no-data-overlay">
        <mat-icon>speed</mat-icon>
        <p>No data available</p>
        <p class="hint">Configure a data source in the widget properties</p>
      </div>
      
      <div class="chart-container">
        <!-- Simple Gauge Implementation -->
        <div class="gauge-wrapper">
          <div class="gauge">
            <div class="gauge-background"></div>
            <div class="gauge-fill" [style.transform]="'rotate(' + ((gaugeValue - min) / (max - min) * angleSpan - (angleSpan/2)) + 'deg)'"></div>
            <div class="gauge-cover">
              <div class="gauge-value">{{ gaugeValue | number:'1.0-1' }}</div>
              <div class="gauge-units">{{ units }}</div>
            </div>
          </div>
          <div class="gauge-min">{{ min }}</div>
          <div class="gauge-max">{{ max }}</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./gauge-widget.component.scss']
})
export class GaugeWidgetComponent extends WidgetBaseComponent {
  // NgxCharts options
  gaugeValue: number = 0;
  min: number = 0;
  max: number = 100;
  units: string = '';
  angleSpan: number = 240;
  startAngle: number = -120;
  showAxis: boolean = true;
  bigSegments: number = 10;
  smallSegments: number = 5;
  animations: boolean = true;
  colorScheme: any;

  constructor(
    protected override elementRef: ElementRef,
    protected override telemetryService: TelemetryService,
    protected override testDataService: TestDataService,
    protected override cdr: ChangeDetectorRef
  ) {
    super(elementRef, telemetryService, testDataService, cdr);
    this.colorScheme = this.getDefaultColorScheme();
  }

  protected override initWidget(): void {
    super.initWidget();
    this.updateGaugeOptions();
    this.loadData();
  }

  protected override handleData(data: any[]): void {
    if (data && data.length > 0) {
      // If we have multiple metrics, just use the first one for the gauge
      const firstMetric = data[0];
      
      if (firstMetric.series && firstMetric.series.length > 0) {
        // Get the latest value
        const latestValue = firstMetric.series[firstMetric.series.length - 1].value;
        this.gaugeValue = latestValue;
      } else if (firstMetric.value !== undefined) {
        // Handle case where data is a simple value
        this.gaugeValue = firstMetric.value;
      }
    } else {
      this.gaugeValue = 0;
    }
    
    this.cdr.detectChanges();
  }

  private updateGaugeOptions(): void {
    const config = this.widget.config;
    if (!config) return;

    // Update gauge options from config
    this.min = config.min !== undefined ? config.min : 0;
    this.max = config.max !== undefined ? config.max : 100;
    this.units = config.units || '';
    this.angleSpan = config.angleSpan !== undefined ? config.angleSpan : 240;
    this.startAngle = config.startAngle !== undefined ? config.startAngle : -120;
    this.showAxis = config.showAxis !== undefined ? config.showAxis : true;
    this.bigSegments = config.bigSegments !== undefined ? config.bigSegments : 10;
    this.smallSegments = config.smallSegments !== undefined ? config.smallSegments : 5;
    this.animations = config.animations !== undefined ? config.animations : true;

    // Update color scheme
    if (config.scheme) {
      if (typeof config.scheme === 'string') {
        this.colorScheme = { name: config.scheme, selectable: true };
      } else if (config.scheme.domain) {
        this.colorScheme = config.scheme;
      }
    }
  }

  onSelect(event: any): void {
    console.log('Item selected:', event);
  }
}
