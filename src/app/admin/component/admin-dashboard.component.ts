import { NgStyle } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../service/admin.service';
import { AdminDashboardStats } from '../interface/admin-user.interface';

interface ChartSegment {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgStyle, RouterModule, MatButtonModule, MatCardModule, MatSnackBarModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  readonly isLoading = signal(true);
  readonly stats = signal<AdminDashboardStats | null>(null);
  readonly totalUsers = computed(() => this.stats()?.totalUsers ?? 0);
  readonly activeUsers = computed(() => this.stats()?.activeUsers ?? 0);
  readonly suspendedUsers = computed(() => this.stats()?.suspendedUsers ?? 0);

  readonly roleChartSegments = computed<ChartSegment[]>(() => {
    const stats = this.stats();

    if (!stats) {
      return [];
    }

    return [
      { label: 'Viewers', value: stats.countsByRole.viewer, color: '#d32f2f' },
      { label: 'Creators', value: stats.countsByRole.creator, color: '#1976d2' },
      { label: 'Admins', value: stats.countsByRole.admin, color: '#2e7d32' }
    ];
  });

  readonly statusChartSegments = computed<ChartSegment[]>(() => {
    const stats = this.stats();

    if (!stats) {
      return [];
    }

    return [
      { label: 'Active', value: stats.activeUsers, color: '#1976d2' },
      { label: 'Suspended', value: stats.suspendedUsers, color: '#616161' }
    ];
  });

  readonly roleChartStyle = computed(() => this.buildChartStyle(this.roleChartSegments()));
  readonly statusChartStyle = computed(() => this.buildChartStyle(this.statusChartSegments()));

  constructor() {
    this.loadDashboardStats();
  }

  private loadDashboardStats() {
    this.isLoading.set(true);

    this.adminService.getDashboardStats().subscribe({
      next: stats => {
        this.stats.set(stats);
        this.isLoading.set(false);
      },
      error: err => {
        console.error(err);
        this.isLoading.set(false);
        this.snackBar.open('Unable to load admin dashboard.', 'Dismiss', {
          duration: 4000
        });
      }
    });
  }

  getPercentage(value: number, total: number) {
    if (!total) {
      return 0;
    }

    return Math.round((value / total) * 100);
  }

  private buildChartStyle(segments: ChartSegment[]) {
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);

    if (!total) {
      return {
        background: 'conic-gradient(#e0e0e0 0deg 360deg)'
      };
    }

    let currentAngle = 0;
    const colorStops = segments.map(segment => {
      const startAngle = currentAngle;
      const segmentAngle = (segment.value / total) * 360;
      currentAngle += segmentAngle;

      return `${segment.color} ${startAngle}deg ${currentAngle}deg`;
    });

    return {
      background: `conic-gradient(${colorStops.join(', ')})`
    };
  }
}
