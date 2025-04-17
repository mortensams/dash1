import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';

// Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Third-party modules
import { GridsterModule } from 'angular-gridster2';

// Application components
import { DashboardDesignerComponent } from './dashboard-designer/dashboard-designer.component';
import { WidgetPanelComponent } from './dashboard-designer/widget-panel/widget-panel.component';
import { DashboardPanelComponent } from './dashboard-designer/dashboard-panel/dashboard-panel.component';
import { WidgetPropertiesDialogComponent } from './dashboard-designer/widget-properties-dialog/widget-properties-dialog.component';
import { WidgetBaseComponent } from './widgets/widget-base/widget-base.component';
import { ChartWidgetComponent } from './widgets/chart-widget/chart-widget.component';
import { LineChartWidgetComponent } from './widgets/chart-widget/line-chart-widget/line-chart-widget.component';
import { BarChartWidgetComponent } from './widgets/chart-widget/bar-chart-widget/bar-chart-widget.component';
import { PieChartWidgetComponent } from './widgets/chart-widget/pie-chart-widget/pie-chart-widget.component';
import { GaugeWidgetComponent } from './widgets/gauge-widget/gauge-widget.component';
import { CardWidgetComponent } from './widgets/card-widget/card-widget.component';

// Services
import { TelemetryService } from './services/telemetry.service';
import { TestDataService } from './services/test-data.service';

// Routes array
const routes: Routes = [];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GridsterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    DragDropModule,
    
    // Import standalone components
    DashboardDesignerComponent,
    WidgetPanelComponent,
    DashboardPanelComponent,
    WidgetPropertiesDialogComponent,
    ChartWidgetComponent,
    LineChartWidgetComponent,
    BarChartWidgetComponent,
    PieChartWidgetComponent,
    GaugeWidgetComponent,
    CardWidgetComponent
  ],
  providers: [
    TelemetryService,
    TestDataService,
    provideRouter(routes)
  ],
  exports: [
    DashboardDesignerComponent
  ]
})
export class AppModule { }
