import { Injectable } from '@angular/core';
import { 
  CompactType, 
  DisplayGrid, 
  GridsterConfig, 
  GridsterItem, 
  GridType 
} from 'angular-gridster2';
import { Dashboard, TimeMode } from '../models/dashboard.model';
import { WidgetItem, WidgetType } from '../models/widget-item.model';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'dashboard_data';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  getDefaultGridsterOptions(): GridsterConfig {
    return {
      gridType: GridType.Fit,
      compactType: CompactType.CompactUp,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 24,
      maxCols: 24,
      minRows: 24,
      maxRows: 100,
      maxItemCols: 24,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 6,
      defaultItemRows: 6,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true,
        ignoreContent: false,
        ignoreContentClass: 'gridster-item-content',
        dragHandleClass: 'drag-handle',
      },
      resizable: {
        enabled: true,
        handles: {
          s: true,
          e: true,
          n: true,
          w: true,
          se: true,
          ne: true,
          sw: true,
          nw: true
        },
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };
  }

  getAllDashboards(): Dashboard[] {
    const storageData = localStorage.getItem(STORAGE_KEY);
    if (storageData) {
      try {
        return JSON.parse(storageData);
      } catch (e) {
        console.error('Error parsing dashboard data', e);
        return [];
      }
    }
    return [];
  }

  getDashboard(id?: string): Dashboard | null {
    const dashboards = this.getAllDashboards();
    if (!id && dashboards.length > 0) {
      // Return the last dashboard if no ID is provided
      return dashboards[dashboards.length - 1];
    } else if (id) {
      // Find dashboard by ID
      const dashboard = dashboards.find(d => d.id === id);
      if (dashboard) {
        return dashboard;
      }
    }
    return null;
  }

  saveDashboard(dashboard: Dashboard): void {
    if (!dashboard.id) {
      dashboard.id = uuidv4();
    }

    const dashboards = this.getAllDashboards();
    const index = dashboards.findIndex(d => d.id === dashboard.id);

    if (index !== -1) {
      dashboards[index] = dashboard;
    } else {
      dashboards.push(dashboard);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards));
  }

  deleteDashboard(id: string): void {
    const dashboards = this.getAllDashboards();
    const index = dashboards.findIndex(d => d.id === id);
    
    if (index !== -1) {
      dashboards.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards));
    }
  }

  createWidget(widgetType: string): WidgetItem {
    const newWidget: WidgetItem = {
      id: uuidv4(),
      type: widgetType as WidgetType,
      title: this.getDefaultWidgetTitle(widgetType),
      x: 0,
      y: 0,
      cols: 6,
      rows: 6,
      config: this.getDefaultWidgetConfig(widgetType),
      dataSource: {
        type: 'telemetry',
        entityMapping: {},
        metrics: []
      },
      timeContext: {
        useGlobalTime: true
      }
    };

    return newWidget;
  }

  private getDefaultWidgetTitle(widgetType: string): string {
    switch (widgetType) {
      case WidgetType.LINE_CHART:
        return 'Line Chart';
      case WidgetType.BAR_CHART:
        return 'Bar Chart';
      case WidgetType.PIE_CHART:
        return 'Pie Chart';
      case WidgetType.GAUGE:
        return 'Gauge';
      case WidgetType.CARD:
        return 'Card';
      default:
        return 'New Widget';
    }
  }

  private getDefaultWidgetConfig(widgetType: string): any {
    const baseConfig = {
      scheme: {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
      },
      animations: true,
      legend: true,
      showXAxisLabel: true,
      showYAxisLabel: true,
      xAxisLabel: 'Time',
      yAxisLabel: 'Value',
      gradient: false
    };

    switch (widgetType) {
      case WidgetType.LINE_CHART:
        return {
          ...baseConfig,
          curve: 'linear',
          autoScale: true,
          timeline: false
        };
      case WidgetType.BAR_CHART:
        return {
          ...baseConfig,
          barPadding: 8,
          groupPadding: 16,
          showDataLabel: false,
          noBarWhenZero: true
        };
      case WidgetType.PIE_CHART:
        return {
          ...baseConfig,
          doughnut: false,
          explodeSlices: false,
          labels: true
        };
      case WidgetType.GAUGE:
        return {
          ...baseConfig,
          min: 0,
          max: 100,
          units: '%',
          angleSpan: 240,
          startAngle: -120,
          showAxis: true,
          bigSegments: 10,
          smallSegments: 5
        };
      case WidgetType.CARD:
        return {
          icon: 'insert_chart',
          color: '#5AA454',
          textColor: '#ffffff',
          decimals: 1,
          units: ''
        };
      default:
        return {};
    }
  }
}
