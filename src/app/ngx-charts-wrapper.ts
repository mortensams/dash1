import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Individual chart components
import {
  AreaChartComponent,
  BarComponent,
  BarHorizontalComponent,
  BarHorizontal2DComponent,
  BarHorizontalNormalizedComponent,
  BarHorizontalStackedComponent,
  BarVerticalComponent,
  BarVertical2DComponent,
  BarVerticalNormalizedComponent,
  BarVerticalStackedComponent,
  BoxChartComponent,
  BubbleChartComponent,
  ForceDirectedGraphComponent,
  GaugeComponent,
  HeatMapComponent,
  LineChartComponent,
  LineComponent,
  NumberCardComponent,
  PieChartComponent,
  PieGridComponent,
  PieSeriesComponent,
  PolarChartComponent,
  TreeMapComponent
} from '@swimlane/ngx-charts';

const CHART_COMPONENTS = [
  AreaChartComponent,
  BarComponent,
  BarHorizontalComponent,
  BarHorizontal2DComponent,
  BarHorizontalNormalizedComponent,
  BarHorizontalStackedComponent,
  BarVerticalComponent,
  BarVertical2DComponent,
  BarVerticalNormalizedComponent,
  BarVerticalStackedComponent,
  BoxChartComponent,
  BubbleChartComponent,
  ForceDirectedGraphComponent,
  GaugeComponent,
  HeatMapComponent,
  LineChartComponent,
  LineComponent,
  NumberCardComponent,
  PieChartComponent,
  PieGridComponent,
  PieSeriesComponent,
  PolarChartComponent,
  TreeMapComponent
];

@NgModule({
  imports: [
    CommonModule,
    ...CHART_COMPONENTS
  ],
  exports: [
    ...CHART_COMPONENTS
  ]
})
export class NgxChartsWrapper {}
