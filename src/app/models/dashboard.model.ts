import { GridsterConfig } from 'angular-gridster2';
import { WidgetItem } from './widget-item.model';

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: WidgetItem[];
  gridsterOptions: GridsterConfig;
  timeContext?: TimeContext;
}

export interface TimeContext {
  mode: TimeMode;
  range: TimeRange;
  refreshInterval?: number; // in seconds
}

export enum TimeMode {
  HISTORICAL = 'historical',
  REALTIME = 'realtime',
  PAUSED = 'paused'
}

export interface TimeRange {
  from: string | Date;
  to: string | Date;
  relativeRange?: string; // e.g., 'last24h', 'lastWeek'
}
