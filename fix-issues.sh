#!/bin/bash

# Fix issues script for the dashboard application

echo "Installing dependencies..."
npm install

# Install type definitions for UUID
echo "Installing type definitions for UUID..."
npm install --save-dev @types/uuid

# Create essential directories
echo "Creating necessary directories..."
mkdir -p src/assets

# Add .d.ts file for NgxCharts
echo "Adding type definitions for NgxCharts..."
cat > src/app/ngx-charts.d.ts << EOF
// Type definitions to fix NgxCharts issues
declare module '@swimlane/ngx-charts' {
  export interface LegendPosition {
    // This interface is empty to allow string values for legendPosition
  }
}
EOF

echo "Setup complete! You can now run 'ng serve' to start the development server."
