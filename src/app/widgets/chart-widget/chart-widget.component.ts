import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { WidgetBaseComponent } from '../widget-base/widget-base.component';
import { TelemetryService } from '../../services/telemetry.service';
import { TestDataService } from '../../services/test-data.service';

@Component({
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss'],
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule]
})
export class ChartWidgetComponent extends WidgetBaseComponent {
  chartData: any[] = [];
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
    this.updateColorScheme();
    this.loadData();
  }
  
  protected override handleData(data: any[]): void {
    this.chartData = data;
    this.cdr.detectChanges();
  }
  
  protected updateColorScheme(): void {
    if (this.widget.config && this.widget.config.scheme) {
      if (typeof this.widget.config.scheme === 'string') {
        // If scheme is a string, use a predefined scheme
        this.colorScheme = { name: this.widget.config.scheme, selectable: true };
      } else if (this.widget.config.scheme.domain) {
        // If scheme has a domain, use it directly
        this.colorScheme = this.widget.config.scheme;
      }
    } else {
      this.colorScheme = this.getDefaultColorScheme();
    }
  }
  
  onSelect(event: any): void {
    // Handle chart selection events
    console.log('Item selected:', event);
  }
  
  getLegendPosition(): string {
    return this.widget.config?.legendPosition || 'right';
  }
}
