import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DriverService } from '../../service/driver.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from '../../interface/driver.interface';
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-driver-form',
  imports: [MatButtonModule,
    MatFormFieldModule,MatInputModule,
    MatCardModule,MatIconModule,
    MatRadioModule,MatSelectModule,
    FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './driver-form.component.html',
  styleUrl: './driver-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private driverService = inject(DriverService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: string = "";
  driverData?: Driver;

  driverForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['viewer', [Validators.required]],
    racingNumber: [0, [Validators.required]],
    nationality: ['', [Validators.required]],
    driverImage: [''],
    driverTeam: ['', [Validators.required]],
    driverDES: [''],
    wins: [0, [Validators.required]],
    podiums: [0, [Validators.required]],
    driverWC: [0, [Validators.required]],
    dob: ['']
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || "";

    if (this.id) {
      this.driverService.getDriverById(this.id).subscribe(driver => {
        this.driverData = driver;

        this.driverForm.patchValue({
          name: driver.name,
          email: driver.email,
          password: driver.password,
          role: driver.role,
          racingNumber: driver.racingNumber,
          nationality: driver.nationality,
          driverImage: driver.driverImage,
          driverTeam: driver.driverTeam,
          driverDES: driver.driverDES,
          wins: driver.wins,
          podiums: driver.podiums,
          driverWC: driver.driverWC,
          dob: driver.dob ? new Date(driver.dob).toISOString().substring(0, 10) : ''
        });
      });
    }
  }

  onSubmit() {
    const formData = this.driverForm.value as Driver;

    if (!this.id) {
      // CREATE
      this.driverService.addDriver(formData).subscribe({
        next: () => this.router.navigate(['/drivers']),
        error: (err: Error) => console.log(err.message),
      });
    } else {
      // UPDATE
      this.driverService.updateDriver(this.id, formData).subscribe({
        next: () => this.router.navigate(['/drivers']),
        error: (err: Error) => console.log(err.message),
      });
    }
  }

  goToDriver() {
    this.router.navigate(['/drivers']);
  }

  // Getters for the form
  get name() { return this.driverForm.get('name'); }
  get email() { return this.driverForm.get('email'); }
  get password() { return this.driverForm.get('password'); }
  get racingNumber() { return this.driverForm.get('racingNumber'); }
  get nationality() { return this.driverForm.get('nationality'); }
  get driverImage() { return this.driverForm.get('driverImage'); }
  get driverTeam() { return this.driverForm.get('driverTeam'); }
  get driverDES() { return this.driverForm.get('driverDES'); }
  get wins() { return this.driverForm.get('wins'); }
  get podiums() { return this.driverForm.get('podiums'); }
  get driverWC() { return this.driverForm.get('driverWC'); }
  get dob() { return this.driverForm.get('dob'); }






  


}
