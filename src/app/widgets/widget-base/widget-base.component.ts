import { Component, ElementRef, Input, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WidgetItem } from '../../models/widget-item.model';
import { TelemetryService } from '../../services/telemetry.service';
import { TestDataService } from '../../services/test-data.service';

@Component({
  selector: 'app-widget-base',
  template: '<div>This is a base widget that should be extended</div>',
  standalone: true,
  imports: [CommonModule]
})
export class WidgetBaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() widget!: WidgetItem;
  
  protected destroy$ = new Subject<void>();
  
  chartWidth: number = 0;
  chartHeight: number = 0;
  loading: boolean = false;
  error: string | null = null;
  noData: boolean = false;
  usingTestData: boolean = false;
  
  constructor(
    protected elementRef: ElementRef,
    protected telemetryService: TelemetryService,
    protected testDataService: TestDataService,
    protected cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Common initialization logic
    this.initWidget();
  }
  
  ngAfterViewInit(): void {
    // Set up resize observer for responsive charts
    this.setupResizeObserver();
    // Initial size calculation
    this.updateChartDimensions();
  }
  
  ngOnDestroy(): void {
    // Clean up
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    // Stop test data if it was being used
    if (this.usingTestData && this.widget) {
      this.testDataService.stopTestData(this.widget.id);
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  protected resizeObserver?: ResizeObserver;
  
  protected initWidget(): void {
    // Override in child classes
  }
  
  protected setupResizeObserver(): void {
    try {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateChartDimensions();
      });
      
      const container = this.elementRef.nativeElement.querySelector('.chart-container');
      if (container) {
        this.resizeObserver.observe(container);
      }
    } catch (error) {
      console.error('ResizeObserver not supported:', error);
      // Fallback to window resize
      window.addEventListener('resize', () => this.updateChartDimensions());
    }
  }
  
  protected updateChartDimensions(): void {
    const container = this.elementRef.nativeElement.querySelector('.chart-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      
      // Ensure positive dimensions and factor in any padding/margins
      this.chartWidth = Math.max(1, Math.floor(rect.width));
      this.chartHeight = Math.max(1, Math.floor(rect.height));
      
      // Trigger change detection
      this.cdr.detectChanges();
    }
  }
  
  protected loadData(): void {
    this.loading = true;
    this.error = null;
    this.noData = false;
    this.usingTestData = false;
    
    // Check if widget has a configured data source
    if (!this.widget.dataSource || 
        !this.widget.dataSource.entityMapping.device || 
        !this.widget.dataSource.metrics || 
        this.widget.dataSource.metrics.length === 0) {
      
      // No data source configured - use test data
      this.usingTestData = true;
      this.testDataService.getTestDataStream(this.widget.id, this.widget.type)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.handleData(data);
            this.loading = false;
            this.noData = false;
          },
          error: (err) => {
            console.error('Error loading test data:', err);
            this.error = 'Failed to load test data';
            this.loading = false;
          }
        });
      
      return;
    }
    
    // Has data source configuration - use telemetry service
    // Get time range
    const timeRange = this.getTimeRange();
    
    // Load telemetry data
    this.telemetryService.getTelemetryData(
      this.widget.dataSource.entityMapping.device,
      this.widget.dataSource.metrics,
      timeRange
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.handleData(data);
        this.loading = false;
        this.noData = data.length === 0;
      },
      error: (err) => {
        console.error('Error loading telemetry data:', err);
        this.error = 'Failed to load data';
        this.loading = false;
      }
    });
  }
  
  protected handleData(data: any[]): void {
    // Override in child classes
  }
  
  protected getTimeRange(): any {
    // Default time range (last 24 hours)
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    
    // If the widget has a custom time range, use it
    if (this.widget.timeContext && !this.widget.timeContext.useGlobalTime && this.widget.timeContext.timeRange) {
      return this.widget.timeContext.timeRange;
    }
    
    // Default time range
    return {
      from: yesterday,
      to: now
    };
  }
  
  protected getDefaultColorScheme(): any {
    return {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
  }
  
  onResize(): void {
    this.updateChartDimensions();
  }
}
