import { GridsterItem } from 'angular-gridster2';

export interface WidgetItem extends GridsterItem {
  id: string;
  type: WidgetType;
  title: string;
  dataSource?: DataSource;
  timeContext?: TimeContextOverride;
  config: any;
}

export enum WidgetType {
  LINE_CHART = 'lineChart',
  BAR_CHART = 'barChart',
  PIE_CHART = 'pieChart',
  GAUGE = 'gauge',
  CARD = 'card'
}

export interface TimeContextOverride {
  useGlobalTime: boolean;
  timeRange?: {
    from: string | Date;
    to: string | Date;
    relativeRange?: string;
  };
  refreshInterval?: number;
}

export interface DataSource {
  type: 'telemetry' | 'static';
  entityMapping: EntityMapping;
  metrics: string[];
}

export interface EntityMapping {
  facility?: string;
  system?: string;
  device?: string;
  abstractEntity?: string;
  concreteEntity?: string;
}

// NGX-Chart Config Interfaces
export interface ChartConfig {
  // Common chart options
  view?: [number, number];
  scheme?: ColorScheme | string;
  schemeType?: string; // 'ordinal' or 'linear'
  customColors?: any[];
  animations?: boolean;
  legend?: boolean;
  legendTitle?: string;
  legendPosition?: string; // 'right' or 'below'
  xAxis?: boolean;
  yAxis?: boolean;
  showXAxisLabel?: boolean;
  showYAxisLabel?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGridLines?: boolean;
  roundDomains?: boolean;
  tooltipDisabled?: boolean;
  trimXAxisTicks?: boolean;
  trimYAxisTicks?: boolean;
  maxXAxisTickLength?: number;
  maxYAxisTickLength?: number;
  xAxisTickFormatting?: any;
  yAxisTickFormatting?: any;
  gradient?: boolean;
  colorScheme?: string;
}

export interface LineChartConfig extends ChartConfig {
  curve?: string; // 'linear', 'monotoneX', 'step', etc.
  rangeFillOpacity?: number;
  autoScale?: boolean;
  timeline?: boolean;
}

export interface BarChartConfig extends ChartConfig {
  barPadding?: number;
  groupPadding?: number;
  showDataLabel?: boolean;
  noBarWhenZero?: boolean;
}

export interface PieChartConfig extends ChartConfig {
  doughnut?: boolean;
  arcWidth?: number;
  explodeSlices?: boolean;
  labels?: boolean;
  labelFormatting?: any;
}

export interface GaugeChartConfig extends ChartConfig {
  min?: number;
  max?: number;
  value?: number;
  units?: string;
  angleSpan?: number;
  startAngle?: number;
  showAxis?: boolean;
  bigSegments?: number;
  smallSegments?: number;
  margin?: number[];
}

export interface ColorScheme {
  domain: string[];
  group?: string;
  selectable?: boolean;
  name?: string;
}
