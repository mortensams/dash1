import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { WidgetItem, WidgetType } from '../../models/widget-item.model';
import { TelemetryService } from '../../services/telemetry.service';

@Component({
  selector: 'app-detail-panel',
  templateUrl: './detail-panel.component.html',
  styleUrls: ['./detail-panel.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class DetailPanelComponent implements OnChanges {
  @Input() widget: WidgetItem | null = null;
  @Output() updateWidget = new EventEmitter<WidgetItem>();

  widgetForm: FormGroup;
  widgetType = WidgetType;
  activeTabIndex = 0;
  
  // Data source selection
  facilities: any[] = [];
  systems: any[] = [];
  devices: any[] = [];
  availableMetrics: any[] = [];
  
  // Color schemes (for ngx-charts)
  colorSchemes = [
    { name: 'Vivid', value: 'vivid' },
    { name: 'Natural', value: 'natural' },
    { name: 'Cool', value: 'cool' },
    { name: 'Fire', value: 'fire' },
    { name: 'Solar', value: 'solar' },
    { name: 'Air', value: 'air' },
    { name: 'Aqua', value: 'aqua' }
  ];

  // Curve types for line charts
  curveTypes = [
    { name: 'Linear', value: 'linear' },
    { name: 'Monotone X', value: 'monotoneX' },
    { name: 'Monotone Y', value: 'monotoneY' },
    { name: 'Step', value: 'step' },
    { name: 'Step After', value: 'stepAfter' },
    { name: 'Step Before', value: 'stepBefore' },
    { name: 'Basis', value: 'basis' },
    { name: 'Cardinal', value: 'cardinal' },
    { name: 'Catmull Rom', value: 'catmullRom' }
  ];

  constructor(
    private fb: FormBuilder,
    private telemetryService: TelemetryService
  ) {
    this.widgetForm = this.createWidgetForm();
    this.loadFacilities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['widget'] && this.widget) {
      this.resetForm();
      this.updateFormValues();
      this.activeTabIndex = 0;
    }
  }

  createWidgetForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      
      // General settings
      general: this.fb.group({
        x: [0, [Validators.required, Validators.min(0)]],
        y: [0, [Validators.required, Validators.min(0)]],
        cols: [6, [Validators.required, Validators.min(1)]],
        rows: [6, [Validators.required, Validators.min(1)]],
      }),
      
      // Data source settings
      dataSource: this.fb.group({
        facilityId: [''],
        systemId: [''],
        deviceId: [''],
        metrics: [[]]
      }),
      
      // Time settings
      timeSettings: this.fb.group({
        useGlobalTime: [true],
        customTimeRange: this.fb.group({
          from: [''],
          to: [''],
          relativeRange: ['']
        }),
        refreshInterval: [0]
      }),
      
      // Visualization settings
      visualization: this.fb.group({
        scheme: ['vivid'],
        schemeType: ['ordinal'],
        animations: [true],
        legend: [true],
        showXAxisLabel: [true],
        showYAxisLabel: [true],
        xAxisLabel: [''],
        yAxisLabel: [''],
        showGridLines: [true],
        gradient: [false],
        roundDomains: [false],
        
        // Line chart specific
        curve: ['linear'],
        autoScale: [true],
        
        // Bar chart specific
        barPadding: [8],
        groupPadding: [16],
        showDataLabel: [false],
        
        // Pie chart specific
        doughnut: [false],
        explodeSlices: [false],
        labels: [true],
        
        // Gauge specific
        min: [0],
        max: [100],
        units: [''],
        angleSpan: [240],
        startAngle: [-120]
      })
    });
  }

  resetForm(): void {
    // Reset form without emitting value changes
    this.widgetForm.reset({
      title: '',
      general: {
        x: 0,
        y: 0,
        cols: 6,
        rows: 6
      },
      dataSource: {
        facilityId: '',
        systemId: '',
        deviceId: '',
        metrics: []
      },
      timeSettings: {
        useGlobalTime: true,
        customTimeRange: {
          from: '',
          to: '',
          relativeRange: ''
        },
        refreshInterval: 0
      },
      visualization: {
        scheme: 'vivid',
        schemeType: 'ordinal',
        animations: true,
        legend: true,
        showXAxisLabel: true,
        showYAxisLabel: true,
        xAxisLabel: '',
        yAxisLabel: '',
        showGridLines: true,
        gradient: false,
        roundDomains: false,
        
        // Line chart specific
        curve: 'linear',
        autoScale: true,
        
        // Bar chart specific
        barPadding: 8,
        groupPadding: 16,
        showDataLabel: false,
        
        // Pie chart specific
        doughnut: false,
        explodeSlices: false,
        labels: true,
        
        // Gauge specific
        min: 0,
        max: 100,
        units: '',
        angleSpan: 240,
        startAngle: -120
      }
    }, { emitEvent: false });
  }

  updateFormValues(): void {
    if (!this.widget) return;

    // Update basic info
    this.widgetForm.patchValue({
      title: this.widget.title
    }, { emitEvent: false });

    // Update general info
    this.widgetForm.get('general')?.patchValue({
      x: this.widget.x,
      y: this.widget.y,
      cols: this.widget.cols,
      rows: this.widget.rows
    }, { emitEvent: false });

    // Update data source settings if available
    if (this.widget.dataSource) {
      const ds = this.widget.dataSource;
      const entityMapping = ds.entityMapping || {};
      
      this.widgetForm.get('dataSource')?.patchValue({
        facilityId: entityMapping.facility || '',
        systemId: entityMapping.system || '',
        deviceId: entityMapping.device || '',
        metrics: ds.metrics || []
      }, { emitEvent: false });

      // Load the dependent data
      if (entityMapping.facility) {
        this.onFacilityChange({ value: entityMapping.facility } as MatSelectChange);
        
        if (entityMapping.system) {
          this.onSystemChange({ value: entityMapping.system } as MatSelectChange);
          
          if (entityMapping.device) {
            this.onDeviceChange({ value: entityMapping.device } as MatSelectChange);
          }
        }
      }
    }

    // Update time settings if available
    if (this.widget.timeContext) {
      const tc = this.widget.timeContext;
      
      this.widgetForm.get('timeSettings')?.patchValue({
        useGlobalTime: tc.useGlobalTime,
        refreshInterval: tc.refreshInterval || 0
      }, { emitEvent: false });

      if (tc.timeRange) {
        this.widgetForm.get('timeSettings.customTimeRange')?.patchValue({
          from: tc.timeRange.from,
          to: tc.timeRange.to,
          relativeRange: tc.timeRange.relativeRange
        }, { emitEvent: false });
      }
    }

    // Update visualization settings if available
    if (this.widget.config) {
      const config = this.widget.config;
      this.widgetForm.get('visualization')?.patchValue({
        scheme: config.scheme?.name || config.scheme || 'vivid',
        schemeType: config.schemeType || 'ordinal',
        animations: config.animations !== undefined ? config.animations : true,
        legend: config.legend !== undefined ? config.legend : true,
        showXAxisLabel: config.showXAxisLabel !== undefined ? config.showXAxisLabel : true,
        showYAxisLabel: config.showYAxisLabel !== undefined ? config.showYAxisLabel : true,
        xAxisLabel: config.xAxisLabel || '',
        yAxisLabel: config.yAxisLabel || '',
        showGridLines: config.showGridLines !== undefined ? config.showGridLines : true,
        gradient: config.gradient !== undefined ? config.gradient : false,
        roundDomains: config.roundDomains !== undefined ? config.roundDomains : false
      }, { emitEvent: false });

      // Update widget-specific settings
      switch (this.widget.type) {
        case WidgetType.LINE_CHART:
          this.widgetForm.get('visualization')?.patchValue({
            curve: config.curve || 'linear',
            autoScale: config.autoScale !== undefined ? config.autoScale : true
          }, { emitEvent: false });
          break;
          
        case WidgetType.BAR_CHART:
          this.widgetForm.get('visualization')?.patchValue({
            barPadding: config.barPadding !== undefined ? config.barPadding : 8,
            groupPadding: config.groupPadding !== undefined ? config.groupPadding : 16,
            showDataLabel: config.showDataLabel !== undefined ? config.showDataLabel : false
          }, { emitEvent: false });
          break;
          
        case WidgetType.PIE_CHART:
          this.widgetForm.get('visualization')?.patchValue({
            doughnut: config.doughnut !== undefined ? config.doughnut : false,
            explodeSlices: config.explodeSlices !== undefined ? config.explodeSlices : false,
            labels: config.labels !== undefined ? config.labels : true
          }, { emitEvent: false });
          break;
          
        case WidgetType.GAUGE:
          this.widgetForm.get('visualization')?.patchValue({
            min: config.min !== undefined ? config.min : 0,
            max: config.max !== undefined ? config.max : 100,
            units: config.units || '',
            angleSpan: config.angleSpan !== undefined ? config.angleSpan : 240,
            startAngle: config.startAngle !== undefined ? config.startAngle : -120
          }, { emitEvent: false });
          break;
      }
    }
  }

  onFormChanges(): void {
    if (!this.widget) return;

    // Create a new widget object with updated values
    const updatedWidget: WidgetItem = { ...this.widget };
    
    // Update basic properties
    updatedWidget.title = this.widgetForm.get('title')?.value;
    
    // Update position and size
    const general = this.widgetForm.get('general')?.value;
    updatedWidget.x = general.x;
    updatedWidget.y = general.y;
    updatedWidget.cols = general.cols;
    updatedWidget.rows = general.rows;
    
    // Update data source
    const ds = this.widgetForm.get('dataSource')?.value;
    if (!updatedWidget.dataSource) {
      updatedWidget.dataSource = {
        type: 'telemetry',
        entityMapping: {},
        metrics: []
      };
    }
    
    updatedWidget.dataSource.entityMapping = {
      facility: ds.facilityId,
      system: ds.systemId,
      device: ds.deviceId
    };
    updatedWidget.dataSource.metrics = ds.metrics;
    
    // Update time context
    const ts = this.widgetForm.get('timeSettings')?.value;
    if (!updatedWidget.timeContext) {
      updatedWidget.timeContext = {
        useGlobalTime: true
      };
    }
    
    updatedWidget.timeContext.useGlobalTime = ts.useGlobalTime;
    updatedWidget.timeContext.refreshInterval = ts.refreshInterval;
    
    if (!ts.useGlobalTime) {
      updatedWidget.timeContext.timeRange = {
        from: ts.customTimeRange.from,
        to: ts.customTimeRange.to,
        relativeRange: ts.customTimeRange.relativeRange
      };
    } else {
      delete updatedWidget.timeContext.timeRange;
    }
    
    // Update visualization config
    const vis = this.widgetForm.get('visualization')?.value;
    updatedWidget.config = {
      ...this.widget.config,
      scheme: vis.scheme,
      schemeType: vis.schemeType,
      animations: vis.animations,
      legend: vis.legend,
      showXAxisLabel: vis.showXAxisLabel,
      showYAxisLabel: vis.showYAxisLabel,
      xAxisLabel: vis.xAxisLabel,
      yAxisLabel: vis.yAxisLabel,
      showGridLines: vis.showGridLines,
      gradient: vis.gradient,
      roundDomains: vis.roundDomains
    };
    
    // Update widget-specific config
    switch (updatedWidget.type) {
      case WidgetType.LINE_CHART:
        updatedWidget.config = {
          ...updatedWidget.config,
          curve: vis.curve,
          autoScale: vis.autoScale
        };
        break;
        
      case WidgetType.BAR_CHART:
        updatedWidget.config = {
          ...updatedWidget.config,
          barPadding: vis.barPadding,
          groupPadding: vis.groupPadding,
          showDataLabel: vis.showDataLabel
        };
        break;
        
      case WidgetType.PIE_CHART:
        updatedWidget.config = {
          ...updatedWidget.config,
          doughnut: vis.doughnut,
          explodeSlices: vis.explodeSlices,
          labels: vis.labels
        };
        break;
        
      case WidgetType.GAUGE:
        updatedWidget.config = {
          ...updatedWidget.config,
          min: vis.min,
          max: vis.max,
          units: vis.units,
          angleSpan: vis.angleSpan,
          startAngle: vis.startAngle
        };
        break;
    }
    
    // Emit the updated widget
    this.updateWidget.emit(updatedWidget);
  }

  // Data source loading methods
  loadFacilities(): void {
    this.telemetryService.getFacilities().subscribe(facilities => {
      this.facilities = facilities;
    });
  }

  onFacilityChange(event: MatSelectChange): void {
    this.systems = [];
    this.devices = [];
    this.availableMetrics = [];
    this.widgetForm.get('dataSource.systemId')?.setValue('');
    this.widgetForm.get('dataSource.deviceId')?.setValue('');
    this.widgetForm.get('dataSource.metrics')?.setValue([]);
    
    if (event.value) {
      this.telemetryService.getSystems(event.value).subscribe(systems => {
        this.systems = systems;
      });
    }
    
    this.onFormChanges();
  }

  onSystemChange(event: MatSelectChange): void {
    this.devices = [];
    this.availableMetrics = [];
    this.widgetForm.get('dataSource.deviceId')?.setValue('');
    this.widgetForm.get('dataSource.metrics')?.setValue([]);
    
    if (event.value) {
      this.telemetryService.getDevices(event.value).subscribe(devices => {
        this.devices = devices;
      });
    }
    
    this.onFormChanges();
  }

  onDeviceChange(event: MatSelectChange): void {
    this.availableMetrics = [];
    this.widgetForm.get('dataSource.metrics')?.setValue([]);
    
    if (event.value) {
      this.telemetryService.getMetrics(event.value).subscribe(metrics => {
        this.availableMetrics = metrics;
      });
    }
    
    this.onFormChanges();
  }

  // Helper for time settings
  onUseGlobalTimeChange(): void {
    const useGlobalTime = this.widgetForm.get('timeSettings.useGlobalTime')?.value;
    if (useGlobalTime) {
      this.widgetForm.get('timeSettings.customTimeRange')?.disable();
    } else {
      this.widgetForm.get('timeSettings.customTimeRange')?.enable();
    }
    
    this.onFormChanges();
  }
}
