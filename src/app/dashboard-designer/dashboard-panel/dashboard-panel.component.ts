import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterConfig, GridsterItem, GridsterModule } from 'angular-gridster2';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Dashboard } from '../../models/dashboard.model';
import { WidgetItem, WidgetType } from '../../models/widget-item.model';
import { LineChartWidgetComponent } from '../../widgets/chart-widget/line-chart-widget/line-chart-widget.component';
import { BarChartWidgetComponent } from '../../widgets/chart-widget/bar-chart-widget/bar-chart-widget.component';
import { PieChartWidgetComponent } from '../../widgets/chart-widget/pie-chart-widget/pie-chart-widget.component';
import { GaugeWidgetComponent } from '../../widgets/gauge-widget/gauge-widget.component';
import { CardWidgetComponent } from '../../widgets/card-widget/card-widget.component';

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GridsterModule,
    MatIconModule,
    MatButtonModule,
    LineChartWidgetComponent,
    BarChartWidgetComponent,
    PieChartWidgetComponent,
    GaugeWidgetComponent,
    CardWidgetComponent
  ]
})
export class DashboardPanelComponent implements OnChanges {
  @Input() dashboard: Dashboard;
  @Input() selectedWidget: WidgetItem | null = null;
  
  @Output() selectWidget = new EventEmitter<WidgetItem>();
  @Output() updateWidget = new EventEmitter<WidgetItem>();
  @Output() removeWidget = new EventEmitter<WidgetItem>();
  @Output() clearSelection = new EventEmitter<void>();

  options: GridsterConfig;
  widgets: WidgetItem[] = [];
  WidgetType = WidgetType; // Make enum available to template

  constructor() {
    // Initialize with empty dashboard
    this.dashboard = {
      id: '',
      name: '',
      description: '',
      widgets: [],
      gridsterOptions: {}
    };
    this.options = this.dashboard.gridsterOptions;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboard'] && this.dashboard) {
      this.options = this.dashboard.gridsterOptions;
      this.widgets = this.dashboard.widgets;
    }
  }

  onItemChange(item: GridsterItem, itemComponent: any): void {
    // Update widget position and size
    const widgetIndex = this.widgets.findIndex(w => w['id'] === item['id']);
    if (widgetIndex !== -1) {
      const updatedWidget = { ...this.widgets[widgetIndex], ...item };
      this.updateWidget.emit(updatedWidget);
    }
  }

  onWidgetClick(event: MouseEvent, widget: WidgetItem): void {
    // Prevent event from bubbling to gridster container
    event.stopPropagation();
    
    // Select widget
    this.selectWidget.emit(widget);
  }

  onRemoveWidget(event: MouseEvent, widget: WidgetItem): void {
    event.stopPropagation();
    this.removeWidget.emit(widget);
  }

  onGridClick(event: MouseEvent): void {
    // Only clear selection if clicking directly on grid (not on a widget)
    if ((event.target as HTMLElement).classList.contains('gridster') || 
        (event.target as HTMLElement).classList.contains('dashboard-panel')) {
      this.clearSelection.emit();
    }
  }

  getWidgetClass(widget: WidgetItem): string {
    return this.selectedWidget && this.selectedWidget['id'] === widget['id'] ? 'selected-widget' : '';
  }
}
