import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Types for mock data
interface Facility {
  id: string;
  name: string;
}

interface System {
  id: string;
  name: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
}

interface Metric {
  id: string;
  name: string;
  unit: string;
}

interface MetricDataPoint {
  timestamp: Date;
  value: number;
}

interface SystemsMap {
  [key: string]: System[];
}

interface DevicesMap {
  [key: string]: Device[];
}

interface MetricNamesMap {
  [key: string]: string;
}

// Mock data service for the first version
// Will be replaced with actual API service later
@Injectable({
  providedIn: 'root'
})
export class TelemetryService {

  constructor() { }

  // Get available facilities
  getFacilities(): Observable<Facility[]> {
    return of([
      { id: 'facility-1', name: 'Headquarters' },
      { id: 'facility-2', name: 'Production Plant' },
      { id: 'facility-3', name: 'Distribution Center' }
    ]).pipe(delay(500)); // Simulate network delay
  }

  // Get systems in a facility
  getSystems(facilityId: string): Observable<System[]> {
    const systems: SystemsMap = {
      'facility-1': [
        { id: 'system-1', name: 'HVAC System' },
        { id: 'system-2', name: 'Water Supply System' }
      ],
      'facility-2': [
        { id: 'system-3', name: 'Cooling System' },
        { id: 'system-4', name: 'Process Water System' }
      ],
      'facility-3': [
        { id: 'system-5', name: 'Utility System' }
      ]
    };

    return of(systems[facilityId] || []).pipe(delay(500));
  }

  // Get devices in a system
  getDevices(systemId: string): Observable<Device[]> {
    const devices: DevicesMap = {
      'system-1': [
        { id: 'device-1', name: 'CR95 Pump', type: 'pump' },
        { id: 'device-2', name: 'CR45 Pump', type: 'pump' }
      ],
      'system-2': [
        { id: 'device-3', name: 'CR15 Pump', type: 'pump' },
        { id: 'device-4', name: 'CR20 Pump', type: 'pump' }
      ],
      'system-3': [
        { id: 'device-5', name: 'CR30 Pump', type: 'pump' }
      ],
      'system-4': [
        { id: 'device-6', name: 'CR10 Pump', type: 'pump' }
      ],
      'system-5': [
        { id: 'device-7', name: 'CR5 Pump', type: 'pump' }
      ]
    };

    return of(devices[systemId] || []).pipe(delay(500));
  }

  // Get available metrics for a device
  getMetrics(deviceId: string): Observable<Metric[]> {
    const commonMetrics: Metric[] = [
      { id: 'flow', name: 'Flow Rate', unit: 'm³/h' },
      { id: 'pressure', name: 'Pressure', unit: 'bar' },
      { id: 'temperature', name: 'Temperature', unit: '°C' },
      { id: 'power', name: 'Power Consumption', unit: 'kW' },
      { id: 'efficiency', name: 'Efficiency', unit: '%' },
      { id: 'runtime', name: 'Runtime', unit: 'h' }
    ];

    return of(commonMetrics).pipe(delay(500));
  }

  // Get telemetry data for a set of metrics
  getTelemetryData(deviceId: string, metrics: string[], timeRange: any): Observable<any[]> {
    // Generate mock time series data
    const startTime = timeRange.from instanceof Date ? 
      timeRange.from : new Date(timeRange.from);
    const endTime = timeRange.to instanceof Date ? 
      timeRange.to : new Date(timeRange.to);
    
    const duration = endTime.getTime() - startTime.getTime();
    const pointCount = Math.min(100, Math.max(10, Math.floor(duration / (1000 * 60 * 5)))); // 1 point per 5 minutes
    const series: any[] = [];

    // Generate data for each metric
    metrics.forEach(metricId => {
      const data: MetricDataPoint[] = [];
      for (let i = 0; i < pointCount; i++) {
        const timestamp = new Date(startTime.getTime() + (i * (duration / (pointCount - 1))));
        
        // Generate different patterns based on the metric
        let value;
        switch (metricId) {
          case 'flow':
            value = 50 + 10 * Math.sin(i / 5) + (Math.random() * 5);
            break;
          case 'pressure':
            value = 4 + Math.cos(i / 10) + (Math.random() * 0.5);
            break;
          case 'temperature':
            value = 25 + 5 * Math.sin(i / 8) + (Math.random() * 1);
            break;
          case 'power':
            value = 15 + 3 * Math.sin(i / 7) + (Math.random() * 2);
            break;
          case 'efficiency':
            value = 85 + 5 * Math.sin(i / 15) + (Math.random() * 3);
            break;
          case 'runtime':
            value = i / 4 + (Math.random() * 0.2);
            break;
          default:
            value = 50 + 25 * Math.sin(i / 10) + (Math.random() * 10);
        }

        data.push({
          timestamp,
          value: Math.max(0, value) // Ensure non-negative values
        });
      }

      series.push({
        name: this.getMetricName(metricId),
        series: data.map(item => ({
          name: item.timestamp,
          value: item.value
        }))
      });
    });

    return of(series).pipe(delay(1000));
  }

  private getMetricName(metricId: string): string {
    const metricNames: MetricNamesMap = {
      'flow': 'Flow Rate',
      'pressure': 'Pressure',
      'temperature': 'Temperature',
      'power': 'Power Consumption',
      'efficiency': 'Efficiency',
      'runtime': 'Runtime'
    };

    return metricNames[metricId] || metricId;
  }
}
