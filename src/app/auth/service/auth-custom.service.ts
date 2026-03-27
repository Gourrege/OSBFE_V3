import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { AuthDriver, AuthRole } from '../interface/auth-driver';

@Injectable({
  providedIn: 'root'
})
export class AuthCustomService {

  readonly currentUser$: BehaviorSubject<AuthDriver | null>;
  readonly isAuthenticated$: BehaviorSubject<boolean>;

  private http = inject(HttpClient);
  private authenticateTimeout: any;

  constructor() {

    // Load user from localStorage (if exists)
    this.currentUser$ = new BehaviorSubject<AuthDriver | null>(
      JSON.parse(localStorage.getItem('user') || 'null')
    );

    const token = localStorage.getItem('token') || '';

    console.log('[Auth] Token found:', token !== '');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expires = payload.exp * 1000;

      console.log('[Auth] Token expires at:', new Date(expires));
      console.log('[Auth] Current time:', new Date());

      if (expires > Date.now()) {
        console.log('[Auth] Token is VALID');

        this.isAuthenticated$ = new BehaviorSubject<boolean>(true);

        // Restore full user (id, email, role)
        const user: AuthDriver = {
          id: payload.driverId,
          email: payload.email,
          role: payload.role,
        };

        this.currentUser$.next(user);
        this.startAuthenticateTimer(expires);

      } else {
        console.log('[Auth] Token is EXPIRED');
        this.isAuthenticated$ = new BehaviorSubject<boolean>(false);
        this.currentUser$.next(null);
      }
    } else {
      console.log('[Auth] No token found');
      this.isAuthenticated$ = new BehaviorSubject<boolean>(false);
    }
  }

  // LOGIN
  login(email: string, password: string) {
    return this.http.post<{ token: string }>(
      `${environment.apiUri}/auth/login`,
      { email, password }
    ).pipe(
      tap(response => {

        localStorage.setItem('token', response.token);

        const payload = JSON.parse(atob(response.token.split('.')[1]));

        // Store FULL auth driver
        const driver: AuthDriver = {
          id: payload.driverId,
          email: payload.email,
          role: payload.role,
        };

        localStorage.setItem('user', JSON.stringify(driver));

        this.currentUser$.next(driver);
        this.isAuthenticated$.next(true);

        this.startAuthenticateTimer(payload.exp * 1000);
      })
    );
  }

  //LOGOUT
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.currentUser$.next(null);
    this.isAuthenticated$.next(false);

    if (this.authenticateTimeout) {
      clearTimeout(this.authenticateTimeout);
    }
  }

  // AUTO LOGOUT
  private startAuthenticateTimer(expires: number) {
    const timeout = expires - Date.now() - (60 * 1000);

    this.authenticateTimeout = setTimeout(() => {
      if (this.isAuthenticated$.value) {
        this.logout();
      }
    }, timeout);
  }

  
  // ROLE HELPERS

  getCurrentUser(): AuthDriver | null {
    return this.currentUser$.value;
  }

  getUserRole(): AuthRole | null {
    return this.currentUser$.value?.role ?? null;
  }

  isCreator(): boolean {
    const role = this.getUserRole();
    return role === 'creator' || role === 'admin';
  }

  isViewer(): boolean {
    return this.getUserRole() === 'viewer';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}
