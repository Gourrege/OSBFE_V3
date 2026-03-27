import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin-reset-password-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Reset Password</h2>
    <mat-dialog-content>
      <p>Set a new password for {{ data.name }}.</p>

      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>New Password</mat-label>
          <input matInput type="password" formControlName="password" />
          @if (form.get('password')?.invalid && form.get('password')?.touched) {
            <mat-error>Password must be at least 6 characters.</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button type="button" (click)="dialogRef.close()">Cancel</button>
      <button mat-flat-button color="primary" type="button" [disabled]="form.invalid" (click)="submit()">
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      padding-top: 8px;
    }

    .full-width {
      width: 100%;
    }
  `]
})
export class AdminResetPasswordDialogComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    public dialogRef: MatDialogRef<AdminResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue().password);
  }
}
