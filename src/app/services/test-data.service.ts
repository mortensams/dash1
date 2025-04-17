import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { WidgetType } from '../models/widget-item.model';

interface SeriesConfig {
  name: string;
  baseValue: number;
  amplitude: number;
  frequency: number;
  noise: number;
}

@Injectable({
  providedIn: 'root'
})
export class TestDataService {
  // Store a reference to all active test data streams
  private activeStreams: Map<string, BehaviorSubject<any[]>> = new Map();
  private updateInterval = 2000; // Update every 2 seconds

  constructor() { }

  /**
   * Get a test data stream for a widget with no data source
   * @param widgetId Unique widget ID
   * @param widgetType Type of widget
   */
  getTestDataStream(widgetId: string, widgetType: WidgetType): Observable<any[]> {
    // Check if we already have a stream for this widget
    if (!this.activeStreams.has(widgetId)) {
      // Create initial data
      const initialData = this.generateInitialData(widgetType);
      
      // Create a subject to manage the data stream
      const dataSubject = new BehaviorSubject<any[]>(initialData);
      this.activeStreams.set(widgetId, dataSubject);

      // Set up timer to update data
      timer(this.updateInterval, this.updateInterval).subscribe(() => {
        const currentData = dataSubject.getValue();
        const updatedData = this.updateTestData(currentData, widgetType);
        dataSubject.next(updatedData);
      });
    }

    return this.activeStreams.get(widgetId)!.asObservable();
  }

  /**
   * Generate initial test data based on widget type
   */
  private generateInitialData(widgetType: WidgetType): any[] {
    const now = new Date();
    
    switch (widgetType) {
      case WidgetType.LINE_CHART:
        // Generate 30 points of historical data for line chart
        return this.generateMultiSeriesData(now, 30);
        
      case WidgetType.BAR_CHART:
        // Generate category data for bar chart
        return this.generateCategoryData();
        
      case WidgetType.PIE_CHART:
        // Generate distribution data for pie chart
        return this.generateDistributionData();
        
      case WidgetType.GAUGE:
        // Generate single value with range for gauge
        return this.generateGaugeData();
        
      case WidgetType.CARD:
        // Generate single value with trend for card
        return this.generateCardData(now, 10);
        
      default:
        // Default to line chart data
        return this.generateMultiSeriesData(now, 30);
    }
  }

  /**
   * Update existing test data to simulate real-time changes
   */
  private updateTestData(currentData: any[], widgetType: WidgetType): any[] {
    const now = new Date();
    
    switch (widgetType) {
      case WidgetType.LINE_CHART:
        // Add a new data point and remove oldest
        return this.updateMultiSeriesData(currentData, now);
        
      case WidgetType.BAR_CHART:
        // Update values for each category
        return this.updateCategoryData(currentData);
        
      case WidgetType.PIE_CHART:
        // Adjust distribution values
        return this.updateDistributionData(currentData);
        
      case WidgetType.GAUGE:
        // Update gauge value
        return this.updateGaugeData(currentData);
        
      case WidgetType.CARD:
        // Update card value and trend
        return this.updateCardData(currentData, now);
        
      default:
        return currentData;
    }
  }

  /**
   * Generate multi-series time data for line charts
   */
  private generateMultiSeriesData(endTime: Date, pointCount: number): any[] {
    const series = [
      { name: 'Flow Rate', baseValue: 50, amplitude: 10, frequency: 0.2, noise: 5 },
      { name: 'Pressure', baseValue: 4, amplitude: 1, frequency: 0.1, noise: 0.5 },
      { name: 'Temperature', baseValue: 25, amplitude: 5, frequency: 0.15, noise: 1 }
    ];
    
    return series.map(s => {
      const points = [];
      
      for (let i = 0; i < pointCount; i++) {
        const timestamp = new Date(endTime.getTime() - (pointCount - i - 1) * 60000); // 1 point per minute
        const value = s.baseValue + 
                     s.amplitude * Math.sin(i * s.frequency) + 
                     (Math.random() - 0.5) * s.noise;
        
        points.push({
          name: timestamp,
          value: Math.max(0, value) // Ensure non-negative
        });
      }
      
      return {
        name: s.name,
        series: points
      };
    });
  }

  /**
   * Update multi-series time data by adding a new point
   */
  private updateMultiSeriesData(currentData: any[], timestamp: Date): any[] {
    return currentData.map((series) => {
      // Define configs for different series types
      const seriesConfigs: {[key: string]: SeriesConfig} = {
        'Flow Rate': { name: 'Flow Rate', baseValue: 50, amplitude: 10, frequency: 0.2, noise: 5 },
        'Pressure': { name: 'Pressure', baseValue: 4, amplitude: 1, frequency: 0.1, noise: 0.5 },
        'Temperature': { name: 'Temperature', baseValue: 25, amplitude: 5, frequency: 0.15, noise: 1 }
      };
      
      // Get the config for this series or use a default
      const defaultConfig: SeriesConfig = { 
        name: series.name, 
        baseValue: 50, 
        amplitude: 10, 
        frequency: 0.2, 
        noise: 5 
      };
      
      const s = seriesConfigs[series.name] || defaultConfig;
      
      const lastPoint = series.series[series.series.length - 1];
      const lastValue = lastPoint.value;
      const i = series.series.length;
      
      // Calculate new value with some randomness and trend following
      const trendFactor = 0.7; // How much to follow the previous trend
      const randomFactor = 0.3; // How much randomness to add
      
      const theoreticalValue = s.baseValue + s.amplitude * Math.sin(i * s.frequency);
      const randomValue = (Math.random() - 0.5) * s.noise;
      const trendValue = lastValue;
      
      const newValue = trendFactor * trendValue + randomFactor * (theoreticalValue + randomValue);
      
      // Create a copy of the series with the new point added and oldest removed
      const updatedSeries = [...series.series.slice(1), {
        name: timestamp,
        value: Math.max(0, newValue) // Ensure non-negative
      }];
      
      return {
        ...series,
        series: updatedSeries
      };
    });
  }

  /**
   * Generate category data for bar charts
   */
  private generateCategoryData(): any[] {
    return [
      { name: 'System A', value: 65 + Math.random() * 10 },
      { name: 'System B', value: 48 + Math.random() * 10 },
      { name: 'System C', value: 72 + Math.random() * 10 },
      { name: 'System D', value: 53 + Math.random() * 10 },
      { name: 'System E', value: 39 + Math.random() * 10 }
    ];
  }

  /**
   * Update category data for bar charts
   */
  private updateCategoryData(currentData: any[]): any[] {
    return currentData.map(item => ({
      ...item,
      value: Math.max(0, item.value + (Math.random() - 0.5) * 5) // Add some random change
    }));
  }

  /**
   * Generate distribution data for pie charts
   */
  private generateDistributionData(): any[] {
    return [
      { name: 'Heating', value: 35 + Math.random() * 5 },
      { name: 'Cooling', value: 25 + Math.random() * 5 },
      { name: 'Ventilation', value: 15 + Math.random() * 5 },
      { name: 'Water', value: 20 + Math.random() * 5 },
      { name: 'Other', value: 5 + Math.random() * 5 }
    ];
  }

  /**
   * Update distribution data for pie charts
   */
  private updateDistributionData(currentData: any[]): any[] {
    return currentData.map(item => ({
      ...item,
      value: Math.max(0, item.value + (Math.random() - 0.5) * 2) // Add some random change
    }));
  }

  /**
   * Generate gauge data
   */
  private generateGaugeData(): any[] {
    return [
      { name: 'Value', value: 65 + Math.random() * 10 }
    ];
  }

  /**
   * Update gauge data
   */
  private updateGaugeData(currentData: any[]): any[] {
    const current = currentData[0].value;
    // Simulate a value that tends to move toward 75
    const target = 75;
    const newValue = current + (target - current) * 0.1 + (Math.random() - 0.5) * 5;
    
    return [
      { name: 'Value', value: Math.max(0, Math.min(100, newValue)) } // Clamp between 0-100
    ];
  }

  /**
   * Generate card data with history for trend
   */
  private generateCardData(endTime: Date, pointCount: number): any[] {
    const points = [];
    const baseValue = 75;
    
    for (let i = 0; i < pointCount; i++) {
      const timestamp = new Date(endTime.getTime() - (pointCount - i - 1) * 60000);
      const value = baseValue + (Math.random() - 0.5) * 10;
      
      points.push({
        name: timestamp,
        value: Math.max(0, value)
      });
    }
    
    return [{
      name: 'Efficiency',
      series: points
    }];
  }

  /**
   * Update card data
   */
  private updateCardData(currentData: any[], timestamp: Date): any[] {
    if (!currentData.length || !currentData[0].series || !currentData[0].series.length) {
      return this.generateCardData(timestamp, 10);
    }
    
    const series = currentData[0].series;
    const lastValue = series[series.length - 1]?.value || 75;
    
    // Generate new value with some randomness and trend following
    const newValue = lastValue + (Math.random() - 0.5) * 3;
    
    // Create a copy with the new point added and oldest removed
    const updatedSeries = [...series.slice(1), {
      name: timestamp,
      value: Math.max(0, newValue)
    }];
    
    return [{
      name: currentData[0].name,
      series: updatedSeries
    }];
  }

  /**
   * Clean up by stopping data streams
   */
  stopTestData(widgetId: string): void {
    if (this.activeStreams.has(widgetId)) {
      this.activeStreams.delete(widgetId);
    }
  }
}
