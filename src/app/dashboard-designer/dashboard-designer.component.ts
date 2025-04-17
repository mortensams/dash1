import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DashboardService } from '../services/dashboard.service';
import { Dashboard } from '../models/dashboard.model';
import { WidgetItem } from '../models/widget-item.model';
import { WidgetPanelComponent } from './widget-panel/widget-panel.component';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { WidgetPropertiesDialogComponent } from './widget-properties-dialog/widget-properties-dialog.component';

@Component({
  selector: 'app-dashboard-designer',
  templateUrl: './dashboard-designer.component.html',
  styleUrls: ['./dashboard-designer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    WidgetPanelComponent,
    DashboardPanelComponent
  ]
})
export class DashboardDesignerComponent implements OnInit {
  dashboard: Dashboard;
  selectedWidget: WidgetItem | null = null;
  showWidgetPanel: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // Initialize with empty dashboard
    this.dashboard = {
      id: '',
      name: 'New Dashboard',
      description: '',
      widgets: [],
      gridsterOptions: this.dashboardService.getDefaultGridsterOptions()
    };
  }

  ngOnInit(): void {
    // Load last dashboard from local storage
    this.loadDashboard();
  }

  loadDashboard(id?: string): void {
    const dashboard = this.dashboardService.getDashboard(id);
    if (dashboard) {
      this.dashboard = dashboard;
      this.snackBar.open('Dashboard loaded', 'Dismiss', { duration: 2000 });
    } else if (id) {
      this.snackBar.open('Dashboard not found', 'Dismiss', { duration: 2000 });
    }
  }

  saveDashboard(): void {
    this.dashboardService.saveDashboard(this.dashboard);
    this.snackBar.open('Dashboard saved', 'Dismiss', { duration: 2000 });
  }

  addWidget(widgetType: string): void {
    const widget = this.dashboardService.createWidget(widgetType);
    this.dashboard.widgets.push(widget);
    this.selectWidget(widget);
  }

  removeWidget(widget: WidgetItem): void {
    const index = this.dashboard.widgets.findIndex(w => w.id === widget.id);
    if (index !== -1) {
      this.dashboard.widgets.splice(index, 1);
      if (this.selectedWidget && this.selectedWidget.id === widget.id) {
        this.selectedWidget = null;
      }
    }
  }

  selectWidget(widget: WidgetItem): void {
    this.selectedWidget = widget;
    this.openWidgetPropertiesDialog(widget);
  }

  updateWidget(widget: WidgetItem): void {
    const index = this.dashboard.widgets.findIndex(w => w.id === widget.id);
    if (index !== -1) {
      this.dashboard.widgets[index] = { ...widget };
    }
  }

  clearSelection(): void {
    this.selectedWidget = null;
  }

  toggleWidgetPanel(): void {
    this.showWidgetPanel = !this.showWidgetPanel;
  }

  openWidgetPropertiesDialog(widget: WidgetItem): void {
    const dialogRef = this.dialog.open(WidgetPropertiesDialogComponent, {
      width: '600px',
      height: '80vh',
      data: widget,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateWidget(result);
      }
    });
  }
}
