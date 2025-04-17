import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDesignerComponent } from './dashboard-designer/dashboard-designer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, DashboardDesignerComponent]
})
export class AppComponent {
  title = 'Forge Dash';
}
