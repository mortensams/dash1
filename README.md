# Forge Dash

A modern dashboard system for visualizing telemetry data from Grundfos pump systems.

## Features

- **Responsive Dashboard Layout**: Drag and drop widgets with Angular-Gridster2
- **Real-time and Historical Data**: Visualization for both real-time and historical data
- **Multiple Visualization Types**: Line charts, bar charts, pie charts, gauges and metric cards
- **Entity Selection**: Hierarchical selection of facilities, systems, and devices
- **Time Context Management**: Set time windows at dashboard or widget level
- **Persistence**: Dashboard configurations saved to local storage (to be extended with backend integration)

## Prerequisites

- Node.js 18.x or newer
- npm 9.x or newer
- Angular CLI 19.x (`npm install -g @angular/cli`)

## Installation

1. Clone the repository or extract the provided files
2. Navigate to the project directory
3. Run the fix-issues script to resolve any dependency issues:

```bash
bash fix-issues.sh
```

Alternatively, you can install dependencies manually:

```bash
# Install dependencies
npm install

# Install type definitions for UUID
npm install --save-dev @types/uuid
```

## Running the Development Server

Run the development server with:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

## Troubleshooting

If you encounter compilation errors:

1. **Angular Material theming errors**:
   - The error "Undefined function" with `mat.define-palette` is typically related to the theme configuration
   - This is fixed in the styles.scss file

2. **NgxCharts type errors**:
   - For errors about `LegendPosition` and properties like `groupPadding`, these are type definition issues
   - The fix-issues.sh script adds necessary type definitions

3. **UUID type errors**:
   - If you see errors about UUID module types, install the type definitions:
   - `npm install --save-dev @types/uuid`

## Project Structure

- `src/app/dashboard-designer/`: Main dashboard designer component with 3-panel layout
  - `widget-panel/`: Left panel with widget toolbox
  - `dashboard-panel/`: Center panel with the dashboard
  - `detail-panel/`: Right panel for editing widget properties
- `src/app/widgets/`: Widget components
  - `widget-base/`: Base widget component with common functionality
  - `chart-widget/`: Base chart component and chart types
  - `gauge-widget/`: Gauge visualization
  - `card-widget/`: Metric card visualization
- `src/app/models/`: Data models
- `src/app/services/`: Services for dashboard management and telemetry data

## Implementation Notes

- The current implementation uses mock data from the TelemetryService
- Dashboards are stored in localStorage for now, with plans to integrate with a backend
- Time management is partially implemented, with local time handling
- The application is set up to support multi-tenant configuration in later iterations

## Next Steps

1. Implement more chart types and visualizations
2. Add dashboard template management
3. Integrate with actual telemetry API endpoints
4. Add user authentication and authorization
5. Support multi-tenant dashboard management
6. Implement time synchronization across widgets
7. Add collaboration features

## Widgets

### Line Chart Widget
Visualizes time series data with configurable axes, legends, and curve types.

### Bar Chart Widget
Displays categorical data with customizable bar appearance.

### Pie Chart Widget
Shows proportional data with optional doughnut representation.

### Gauge Widget
Displays a single value within a range using a gauge visualization.

### Metric Card Widget
Shows a key value with optional trend indication.

## License

This project is proprietary and confidential.
# dash1
# dash1
