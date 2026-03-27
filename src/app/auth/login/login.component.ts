import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthCustomService } from '../service/auth-custom.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCard
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthCustomService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    console.log('Submitting login:', { email });

    this.authService.login(email, password).subscribe({
      next: response => {
        console.log('LOGIN SUCCESS — TOKEN:', response.token);
        // 🚫 Do NOT store token yet (next step)
        // 🚫 Do NOT guard routes yet

        this.router.navigateByUrl('/drivers');
      },
      error: err => {
        console.error('LOGIN ERROR:', err);
        this.openErrorSnackBar('Incorrect email or password');
      }
    });
  }

  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  goToAddDriver() {
    this.router.navigate(['/drivers/form']);
  }
}
