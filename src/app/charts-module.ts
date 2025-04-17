import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import ngx-charts components individually
import { LineChartComponent } from '@swimlane/ngx-charts';
import { BarVerticalComponent } from '@swimlane/ngx-charts';
import { PieChartComponent } from '@swimlane/ngx-charts';
import { PieGridComponent } from '@swimlane/ngx-charts';
import { GaugeComponent } from '@swimlane/ngx-charts';

// Create a custom module for ngx-charts components
@NgModule({
  imports: [CommonModule],
  exports: [
    LineChartComponent,
    BarVerticalComponent,
    PieChartComponent,
    PieGridComponent,
    GaugeComponent
  ]
})
export class CustomNgxChartsModule {}
