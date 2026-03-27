import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { CreateAdminUserRequest } from '../../interface/admin-user.interface';

@Component({
  selector: 'app-admin-user-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './admin-user-form.component.html',
  styleUrl: './admin-user-form.component.scss'
})
export class AdminUserFormComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  userForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['viewer', [Validators.required]],
    status: ['active', [Validators.required]],
    racingNumber: [null],
    nationality: [''],
    driverImage: [''],
    driverTeam: [''],
    driverDES: [''],
    wins: [null],
    podiums: [null],
    driverWC: [null],
    dob: ['']
  });

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    this.adminService.createUser(payload).subscribe({
      next: () => {
        this.snackBar.open('User created successfully.', 'Dismiss', {
          duration: 3000
        });
        this.router.navigate(['/admin/users']);
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Unable to create user.', 'Dismiss', {
          duration: 4000
        });
      }
    });
  }

  goToUsers() {
    this.router.navigate(['/admin/users']);
  }

  private buildPayload(): CreateAdminUserRequest {
    const value = this.userForm.getRawValue();

    return {
      name: value.name,
      email: value.email,
      password: value.password,
      role: value.role,
      status: value.status,
      ...(value.racingNumber !== null && value.racingNumber !== '' ? { racingNumber: Number(value.racingNumber) } : {}),
      ...(value.nationality ? { nationality: value.nationality } : {}),
      ...(value.driverImage ? { driverImage: value.driverImage } : {}),
      ...(value.driverTeam ? { driverTeam: value.driverTeam } : {}),
      ...(value.driverDES ? { driverDES: value.driverDES } : {}),
      ...(value.wins !== null && value.wins !== '' ? { wins: Number(value.wins) } : {}),
      ...(value.podiums !== null && value.podiums !== '' ? { podiums: Number(value.podiums) } : {}),
      ...(value.driverWC !== null && value.driverWC !== '' ? { driverWC: Number(value.driverWC) } : {}),
      ...(value.dob ? { dob: value.dob } : {})
    };
  }
}
