import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminActionResponse,
  AdminCreateUserResponse,
  AdminDashboardStats,
  AdminUser,
  AdminUsersResponse,
  AdminUserRole,
  AdminUserStatus,
  CreateAdminUserRequest
} from '../interface/admin-user.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUri}/admin`;

  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.apiUrl}/dashboard/stats`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getUsers(): Observable<AdminUsersResponse> {
    return this.http.get<AdminUsersResponse>(`${this.apiUrl}/users`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  createUser(user: CreateAdminUserRequest): Observable<AdminCreateUserResponse> {
    return this.http.post<AdminCreateUserResponse>(`${this.apiUrl}/users`, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUserRole(id: string, role: AdminUserRole): Observable<AdminActionResponse> {
    return this.http.patch<AdminActionResponse>(`${this.apiUrl}/users/${id}/role`, { role }).pipe(
      catchError(this.handleError)
    );
  }

  updateUserStatus(id: string, status: AdminUserStatus): Observable<AdminActionResponse> {
    return this.http.patch<AdminActionResponse>(`${this.apiUrl}/users/${id}/status`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(id: string, password: string): Observable<AdminActionResponse> {
    return this.http.patch<AdminActionResponse>(`${this.apiUrl}/users/${id}/reset-password`, { password }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<AdminActionResponse> {
    return this.http.delete<AdminActionResponse>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
