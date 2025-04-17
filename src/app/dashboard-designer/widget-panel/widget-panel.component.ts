import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetType } from '../../models/widget-item.model';

interface WidgetCategory {
  name: string;
  widgets: WidgetDefinition[];
}

interface WidgetDefinition {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-widget-panel',
  templateUrl: './widget-panel.component.html',
  styleUrls: ['./widget-panel.component.scss'],
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatCardModule, MatIconModule, MatDividerModule]
})
export class WidgetPanelComponent {
  @Output() addWidget = new EventEmitter<string>();

  widgetCategories: WidgetCategory[] = [
    {
      name: 'Charts',
      widgets: [
        {
          type: WidgetType.LINE_CHART,
          name: 'Line Chart',
          description: 'Display data trends over time',
          icon: 'show_chart'
        },
        {
          type: WidgetType.BAR_CHART,
          name: 'Bar Chart',
          description: 'Compare values across categories',
          icon: 'bar_chart'
        },
        {
          type: WidgetType.PIE_CHART,
          name: 'Pie Chart',
          description: 'Show proportions of a whole',
          icon: 'pie_chart'
        }
      ]
    },
    {
      name: 'Indicators',
      widgets: [
        {
          type: WidgetType.GAUGE,
          name: 'Gauge',
          description: 'Display a value within a range',
          icon: 'speed'
        },
        {
          type: WidgetType.CARD,
          name: 'Metric Card',
          description: 'Show a key value with optional trend',
          icon: 'assessment'
        }
      ]
    }
  ];

  onAddWidget(widgetType: WidgetType): void {
    this.addWidget.emit(widgetType);
  }
}
