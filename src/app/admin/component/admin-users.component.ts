import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AdminService } from '../service/admin.service';
import {
  AdminUser,
  AdminUserRole,
  AdminUserStatus
} from '../interface/admin-user.interface';
import { AdminConfirmDialogComponent } from './dialogs/admin-confirm-dialog.component';
import { AdminResetPasswordDialogComponent } from './dialogs/admin-reset-password-dialog.component';

@Component({
  selector: 'app-admin-users',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  readonly users = signal<AdminUser[]>([]);
  readonly displayedColumns: string[] = ['name', 'email', 'role', 'status', 'actions'];
  readonly isLoading = signal(true);

  readonly searchTerm = signal('');
  readonly selectedRole = signal('');
  readonly selectedStatus = signal('');

  readonly filteredUsers = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const selectedRole = this.selectedRole();
    const selectedStatus = this.selectedStatus();

    return this.users().filter(user => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);

      const matchesRole = !selectedRole || user.role === selectedRole;
      const matchesStatus = !selectedStatus || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  });

  readonly totalUsers = computed(() => this.users().length);
  readonly filteredUsersCount = computed(() => this.filteredUsers().length);

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);

    this.adminService.getUsers().subscribe({
      next: response => {
        this.users.set(response.users);
        this.isLoading.set(false);
      },
      error: err => {
        console.error(err);
        this.isLoading.set(false);
        this.snackBar.open('Unable to load users.', 'Dismiss', {
          duration: 4000
        });
      }
    });
  }

  updateRole(user: AdminUser, role: AdminUserRole) {
    const userId = user._id ?? user.id;

    if (!userId || user.role === role) {
      return;
    }

    this.adminService.updateUserRole(userId, role).subscribe({
      next: () => {
        this.snackBar.open(`Updated role for ${user.name}.`, 'Dismiss', {
          duration: 3000
        });
        this.loadUsers();
      },
      error: err => {
        console.error(err);
        this.snackBar.open(`Unable to update role for ${user.name}.`, 'Dismiss', {
          duration: 4000
        });
        this.loadUsers();
      }
    });
  }

  toggleStatus(user: AdminUser) {
    const userId = user._id ?? user.id;

    if (!userId) {
      return;
    }

    const nextStatus: AdminUserStatus = user.status === 'active' ? 'suspended' : 'active';

    this.adminService.updateUserStatus(userId, nextStatus).subscribe({
      next: () => {
        this.snackBar.open(`Updated status for ${user.name}.`, 'Dismiss', {
          duration: 3000
        });
        this.loadUsers();
      },
      error: err => {
        console.error(err);
        this.snackBar.open(`Unable to update status for ${user.name}.`, 'Dismiss', {
          duration: 4000
        });
      }
    });
  }

  openResetPasswordDialog(user: AdminUser) {
    const dialogRef = this.dialog.open(AdminResetPasswordDialogComponent, {
      width: '420px',
      data: { name: user.name }
    });

    dialogRef.afterClosed().subscribe(newPassword => {
      const userId = user._id ?? user.id;

      if (!newPassword || !userId) {
        return;
      }

      this.adminService.resetPassword(userId, newPassword).subscribe({
        next: () => {
          this.snackBar.open(`Password reset for ${user.name}.`, 'Dismiss', {
            duration: 3000
          });
        },
        error: err => {
          console.error(err);
          this.snackBar.open(`Unable to reset password for ${user.name}.`, 'Dismiss', {
            duration: 4000
          });
        }
      });
    });
  }

  confirmDelete(user: AdminUser) {
    const dialogRef = this.dialog.open(AdminConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Delete User',
        message: `Delete ${user.name}? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      const userId = user._id ?? user.id;

      if (!confirmed || !userId) {
        return;
      }

      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBar.open(`${user.name} deleted.`, 'Dismiss', {
            duration: 3000
          });
          this.loadUsers();
        },
        error: err => {
          console.error(err);
          this.snackBar.open(`Unable to delete ${user.name}.`, 'Dismiss', {
            duration: 4000
          });
        }
      });
    });
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  updateSelectedRole(value: string) {
    this.selectedRole.set(value);
  }

  updateSelectedStatus(value: string) {
    this.selectedStatus.set(value);
  }
}
