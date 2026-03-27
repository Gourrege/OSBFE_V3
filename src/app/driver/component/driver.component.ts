import { Component, inject } from '@angular/core';
import { DriverService } from '../service/driver.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Driver } from '../interface/driver.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'
import { Router } from '@angular/router';
import { AuthCustomService } from '../../auth/service/auth-custom.service';

@Component({
  selector: 'app-driver',
  imports: [AsyncPipe, CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss'
})
export class DriverComponent {

  isCreator: boolean = false;

  private router = inject(Router);
  private dataService = inject(DriverService);
  private authService = inject(AuthCustomService);
  drivers$: Observable<Driver[]> = this.getVisibleDrivers();

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isCreator = user?.role === 'creator';
    });
  }

  deleteDriver(id: string) {
    this.dataService.deleteDriver(id).subscribe({
      next: () => {
        console.log("Driver deleted");
        this.drivers$ = this.getVisibleDrivers();
      },
      error: (err) => console.error(err)
    });
  }

  goToAddDriver() {
    this.router.navigate(['/drivers/form']);
  }

  updateExisting(id: string) {
    this.router.navigate(['/drivers', id, 'edit']);
  }

  private getVisibleDrivers(): Observable<Driver[]> {
    return this.dataService.getDrivers().pipe(
      map(drivers => drivers.filter(driver => driver.role === 'viewer' || driver.role === 'creator'))
    );
  }
}
