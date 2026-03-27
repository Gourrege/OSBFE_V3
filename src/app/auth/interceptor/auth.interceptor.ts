import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthCustomService } from '../service/auth-custom.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const authService = inject(AuthCustomService);

  const apiUri = `${environment.apiUri}`;
  const jwt = localStorage.getItem('token');
  const isApiRequest = req.url.startsWith(apiUri);

  const authRequest = jwt && isApiRequest
    ? req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } })
    : req;

  return next(authRequest).pipe(
    catchError((err) => {
      console.log('Request failed ' + err.status);

      if (isApiRequest && (err.status === 401 || err.status === 403)) {
        authService.logout();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};
